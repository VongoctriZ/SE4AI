
import os
import numpy as np
import pandas as pd
import implicit
from scipy.sparse import coo_matrix
from implicit.evaluation import mean_average_precision_at_k
import schedule
import time

os.environ['OPENBLAS_NUM_THREADS'] = '1'

def load_data(dataset):
    df = dataset
    df.rename(columns={'product_id': 'item_id'}, inplace=True)
    df['t_dat'] = pd.to_datetime(df['t_dat']).dt.date
    return df

def random_date(start, end, n):
    date_range = pd.date_range(start, end)
    return np.random.choice(date_range, n)

def assign_random_dates(df, start_date='2024-01-01', end_date='2024-12-31'):
    start = pd.to_datetime(start_date)
    end = pd.to_datetime(end_date)
    df['t_dat'] = random_date(start, end, df.shape[0])
    return df

def preprocess_data(df):
    df = df.drop_duplicates(['t_dat', 'user_id', 'item_id'])
    
    user_id_mapping = {user_id: idx for idx, user_id in enumerate(df['user_id'].unique())}
    item_id_mapping = {item_id: idx for idx, item_id in enumerate(df['item_id'].unique())}
    
    df.loc[:, 'user_id'] = df['user_id'].map(user_id_mapping)
    df.loc[:, 'item_id'] = df['item_id'].map(item_id_mapping)
    
    num_users = df['user_id'].nunique()
    num_items = df['item_id'].nunique()
    
    row = df['user_id'].values
    col = df['item_id'].values
    data = np.ones(df.shape[0])
    
    coo_train = coo_matrix((data, (row, col)), shape=(num_users, num_items))
    
    return df, coo_train, user_id_mapping, item_id_mapping

def to_user_item_coo(df, user_id_map, item_id_map):
    row = df['user_id'].map(user_id_map).values
    col = df['item_id'].map(item_id_map).values
    data = np.ones(df.shape[0])
    coo = coo_matrix((data, (row, col)), shape=(len(user_id_map), len(item_id_map)))
    return coo

def split_data(df, validation_days=7):
    validation_cut = df['t_dat'].max() - pd.Timedelta(days=validation_days)
    df_train = df[df['t_dat'] < validation_cut]
    df_val = df[df['t_dat'] >= validation_cut]
    return df_train, df_val

def get_val_matrices(df, validation_days=7):
    df_train, df_val = split_data(df, validation_days=validation_days)

    user_id_map = {user_id: idx for idx, user_id in enumerate(df['user_id'].unique())}
    item_id_map = {item_id: idx for idx, item_id in enumerate(df['item_id'].unique())}

    coo_train = to_user_item_coo(df_train, user_id_map, item_id_map)
    coo_val = to_user_item_coo(df_val, user_id_map, item_id_map)

    csr_train = coo_train.tocsr()
    csr_val = coo_val.tocsr()

    return {'coo_train': coo_train, 'csr_train': csr_train, 'csr_val': csr_val}

def validate(matrices, factors=200, iterations=20, regularization=0.01, show_progress=True):
    coo_train, csr_train, csr_val = matrices['coo_train'], matrices['csr_train'], matrices['csr_val']

    model = implicit.als.AlternatingLeastSquares(factors=factors,
                                                iterations=iterations,
                                                regularization=regularization,
                                                random_state=42)

    model.fit(csr_train, show_progress=show_progress)

    map12 = mean_average_precision_at_k(model, csr_train, csr_val, K=12, show_progress=show_progress, num_threads=4)

    return map12

def optimize_params(df):
    best_map12 = 0
    best_params = {}
    
    for factors in [40, 50, 60, 100, 200, 500, 1000]:
        for iterations in [3, 12, 14, 15, 20]:
            for regularization in [0.01]:
                try:
                    matrices = get_val_matrices(df)
                    map12 = validate(matrices, factors, iterations, regularization, show_progress=False)
                    if map12 > best_map12:
                        best_map12 = map12
                        best_params = {'factors': factors, 'iterations': iterations, 'regularization': regularization}
                except IndexError as e:
                    print(f"IndexError: {e} with factors={factors}, iterations={iterations}, regularization={regularization}")

    return best_params, best_map12

def train(coo_train, factors=200, iterations=15, regularization=0.01, show_progress=True):
    model = implicit.als.AlternatingLeastSquares(factors=factors,
                                                iterations=iterations,
                                                regularization=regularization,
                                                random_state=42)
    model.fit(coo_train, show_progress=show_progress)
    return model

def predict(model, csr_train, user_id_map, item_id_map, submission_name="submissions.csv", N=10):
    preds = []
    batch_size = 2000
    to_generate = np.arange(len(user_id_map))
    
    inverse_user_id_mapping = {idx: user_id for user_id, idx in user_id_map.items()}
    inverse_item_id_mapping = {idx: item_id for item_id, idx in item_id_map.items()}
    
    for startidx in range(0, len(to_generate), batch_size):
        batch = to_generate[startidx: startidx + batch_size]
        ids, scores = model.recommend(batch, csr_train[batch], N=N, filter_already_liked_items=False)
        for i, userid in enumerate(batch):
            customer_id = inverse_user_id_mapping[userid]
            user_items = ids[i]
            article_ids = [str(inverse_item_id_mapping[item_id]) for item_id in user_items]
            preds.append((customer_id, ' '.join(article_ids)))

    df_preds = pd.DataFrame(preds, columns=['user_id', 'item_predict'])

    return df_preds


def convert_back(df, inverse_user_id_mapping, inverse_item_id_mapping):
    df['user_id'] = df['user_id'].map(inverse_user_id_mapping)
    df['item_predict'] = df['item_predict'].apply(
        lambda x: ' '.join(str(inverse_item_id_mapping.get(int(item), 'UNKNOWN')) for item in x.split())
    )
    return df

def generate_recommendations(dataset):
    df = load_data(dataset)
    df, coo_train, user_id_mapping, item_id_mapping = preprocess_data(df)
    best_params, best_map12 = optimize_params(df)
    model = train(coo_train, **best_params)
    
    csr_train = coo_train.tocsr()
    df_preds = predict(model, csr_train, user_id_mapping, item_id_mapping, N=12)
    

    recommendations = df_preds
    
    return recommendations