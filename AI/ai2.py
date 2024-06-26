import os; os.environ['OPENBLAS_NUM_THREADS']='1'
import numpy as np
import pandas as pd
import implicit
from scipy.sparse import coo_matrix
from implicit.evaluation import mean_average_precision_at_k

df = pd.read_csv('_transactions.csv')

df.rename(columns={'product_id':'item_id'},inplace=True)

# Convert 't_dat' to datetime
df['t_dat'] = pd.to_datetime(df['t_dat'])

# Extract only the date part
df['t_dat'] = df['t_dat'].dt.date

def random_date(start, end, n):
    """Generate a list of random dates between start and end with possible duplicates."""
    date_range = pd.date_range(start, end)
    return np.random.choice(date_range, n)

# Sử dụng hàm này để sinh ngày tháng ngẫu nhiên
def assign_random_dates(df, start_date='2024-01-01', end_date='2024-12-31'):
    """Assign random dates within the year 2024 to the 't_dat' column of the DataFrame with possible duplicates."""
    start = pd.to_datetime(start_date)
    end = pd.to_datetime(end_date)

    # Generate random dates with possible duplicates
    df['t_dat'] = random_date(start, end, df.shape[0])
    return df

df = assign_random_dates(df)

df = df.drop_duplicates(['t_dat','user_id', 'item_id'])

# Create mappings for user_id and item_id to be zero-indexed
user_id_mapping = {user_id: idx for idx, user_id in enumerate(df['user_id'].unique())}
item_id_mapping = {item_id: idx for idx, item_id in enumerate(df['item_id'].unique())}

# Create mappings for user_id and item_id to be zero-indexed
user_id_mapping = {user_id: idx for idx, user_id in enumerate(df['user_id'].unique())}
item_id_mapping = {item_id: idx for idx, item_id in enumerate(df['item_id'].unique())}

# Apply the mappings to the dataframe
df['user_id'] = df['user_id'].map(user_id_mapping)
df['item_id'] = df['item_id'].map(item_id_mapping)

# Define the number of users and items
num_users = df['user_id'].nunique()
num_items = df['item_id'].nunique()

# Create the COO matrix
row = df['user_id'].values
col = df['item_id'].values
data = np.ones(df.shape[0])  # Use ones for implicit feedback

# Create the COO matrix with the shape based on unique users and items
coo_train = coo_matrix((data, (row, col)), shape=(num_users, num_items))

print("COO matrix shape:", coo_train.shape)
print("Non-zero elements:", coo_train.nnz)

"""# Check that model works ok with data"""


"""# Validation

## Functions required for validation
"""

def to_user_item_coo(df, user_id_map, item_id_map):
    """ Turn a dataframe with transactions into a COO sparse items x users matrix"""
    row = df['user_id'].map(user_id_map).values
    col = df['item_id'].map(item_id_map).values
    data = np.ones(df.shape[0])
    coo = coo_matrix((data, (row, col)), shape=(len(user_id_map), len(item_id_map)))
    return coo

def split_data(df, validation_days=7):
    """ Split a pandas dataframe into training and validation data, using <<validation_days>> """
    validation_cut = df['t_dat'].max() - pd.Timedelta(validation_days)
    df_train = df[df['t_dat'] < validation_cut]
    df_val = df[df['t_dat'] >= validation_cut]
    return df_train, df_val

def get_val_matrices(df, validation_days=7):
    """ Split into training and validation and create various matrices """
    df_train, df_val = split_data(df, validation_days=validation_days)

    user_id_map = {user_id: idx for idx, user_id in enumerate(df['user_id'].unique())}
    item_id_map = {item_id: idx for idx, item_id in enumerate(df['item_id'].unique())}

    coo_train = to_user_item_coo(df_train, user_id_map, item_id_map)
    coo_val = to_user_item_coo(df_val, user_id_map, item_id_map)

    csr_train = coo_train.tocsr()
    csr_val = coo_val.tocsr()

    return {'coo_train': coo_train,
            'csr_train': csr_train,
            'csr_val': csr_val}

# Use the existing validate function with the above modifications

def validate(matrices, factors=200, iterations=20, regularization=0.01, show_progress=True):
    """ Train an ALS model with <<factors>> (embeddings dimension) for <<iterations>> over matrices and validate with MAP@12 """
    coo_train, csr_train, csr_val = matrices['coo_train'], matrices['csr_train'], matrices['csr_val']

    model = implicit.als.AlternatingLeastSquares(factors=factors,
                                                iterations=iterations,
                                                regularization=regularization,
                                                random_state=42)

#     # Debugging the input matrices
#     print("coo_train shape:", coo_train.shape, "non-zero elements:", coo_train.nnz)
#     print("csr_train shape:", csr_train.shape, "non-zero elements:", csr_train.nnz)
#     print("csr_val shape:", csr_val.shape, "non-zero elements:", csr_val.nnz)

    model.fit(csr_train, show_progress=show_progress)  # Use csr_train for fitting

    map12 = mean_average_precision_at_k(model, csr_train, csr_val, K=12, show_progress=show_progress, num_threads=4)

    print(f"Factors: {factors:>3} - Iterations: {iterations:>2} - Regularization: {regularization:4.3f} ==> MAP@12: {map12:6.5f}")
    return map12

matrices = get_val_matrices(df)

# Main loop
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
                    print(f"Best MAP@12 found. Updating: {best_params}")
            except IndexError as e:
                print(f"IndexError: {e} with factors={factors}, iterations={iterations}, regularization={regularization}")

# Output the best parameters found
print("===================")
print(f"Best parameters: {best_params}")
print(f"Best MAP@12: {best_map12}")

del matrices

"""# Training over the full dataset"""

user_id_map = {user_id: idx for idx, user_id in enumerate(df['user_id'].unique())}
item_id_map = {item_id: idx for idx, item_id in enumerate(df['item_id'].unique())}
print("user id map: ",user_id_map)

coo_train = to_user_item_coo(df, user_id_map, item_id_map)
csr_train = coo_train.tocsr()

def train(coo_train, factors=200, iterations=15, regularization=0.01, show_progress=True):
    model = implicit.als.AlternatingLeastSquares(factors=factors,
                                                iterations=iterations,
                                                regularization=regularization,
                                                random_state=42)
    model.fit(coo_train, show_progress=show_progress)
    return model

print(best_params)

model = train(coo_train, **best_params)

"""# Predictition"""

def predict(model, csr_train, user_id_map, item_id_map, submission_name="submissions.csv", N=10):
    preds = []
    batch_size = 2000
    to_generate = np.arange(len(user_id_map))
    for startidx in range(0, len(to_generate), batch_size):
        batch = to_generate[startidx : startidx + batch_size]
        ids, scores = model.recommend(batch, csr_train[batch], N=N, filter_already_liked_items=False)
        for i, userid in enumerate(batch):
            customer_id = user_id_map[userid]
            user_items = ids[i]
            article_ids = [str(item_id_map[item_id]) for item_id in user_items]  # Convert item IDs to strings
            preds.append((customer_id, ' '.join(article_ids)))

    df_preds = pd.DataFrame(preds, columns=['user_id', 'item_predict'])
    df_preds.to_csv(submission_name, index=False)

    return df_preds


# Commented out IPython magic to ensure Python compatibility.
# %%time
df_preds = predict(model, csr_train, user_id_map, item_id_map,N=10)
df_preds.to_csv('ai2-predictions.csv')

# Create inverse mappings
inverse_user_id_mapping = {idx: user_id for user_id, idx in user_id_mapping.items()}
inverse_item_id_mapping = {idx: item_id for item_id, idx in item_id_mapping.items()}

# Function to convert back user_id and item_id in the DataFrame
def convert_back(df, inverse_user_id_mapping, inverse_item_id_mapping):
    df['user_id'] = df['user_id'].map(inverse_user_id_mapping)
    df['item_predict'] = df['item_predict'].apply(
        lambda x: ' '.join(str(inverse_item_id_mapping[int(item)]) for item in x.split())
    )
    return df

# Convert back to original values
df_converted_back = convert_back(df_preds, inverse_user_id_mapping, inverse_item_id_mapping)

# Display the converted DataFrame
print(df_converted_back)

df_converted_back.to_csv('recommendations.csv')

