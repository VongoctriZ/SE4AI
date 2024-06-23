# -*- coding: utf-8 -*-
import pandas as pd
from surprise import Dataset, Reader, SVD, accuracy
from surprise.model_selection import train_test_split

# Function to load data and train SVD model
def train_recommendation_system(data_path='transactions.csv'):
    try:
        # Read data from CSV into Pandas DataFrame
        df = pd.read_csv(data_path)

        # Define the rating scale
        reader = Reader(rating_scale=(1, 5))

        # Load data into Surprise Dataset format
        data = Dataset.load_from_df(df[['user_id', 'product_id', 'rating']], reader)

        # Split data into training and testing sets
        trainset, testset = train_test_split(data, test_size=0.2)

        # Initialize SVD model
        model = SVD()

        # Train the model on the training set
        model.fit(trainset)

        # Evaluate the model using RMSE
        predictions = model.test(testset)
        rmse = accuracy.rmse(predictions)

        print(f'Model trained successfully with RMSE: {rmse:.4f}')

        return model, df,predictions

    except FileNotFoundError:
        print(f'Error: File "{data_path}" not found.')
        return None, None
    except Exception as e:
        print(f'Error occurred during training: {str(e)}')
        return None, None

# Function to get top-N recommendations for a user
def get_top_n_recommendations(model, user_id, n=10, df=None):
    try:
        if df is None:
            raise ValueError('DataFrame is not provided.')

        # Get unique product IDs
        all_product_ids = df['product_id'].unique()

        # Predict ratings for all products user hasn't rated
        user_ratings = [(product_id, model.predict(user_id, product_id).est) for product_id in all_product_ids]

        # Sort ratings by predicted value
        user_ratings.sort(key=lambda x: x[1], reverse=True)

        # Get top-N recommendations
        top_n_recommendations = user_ratings[:n]

        return top_n_recommendations

    except ValueError as ve:
        print(f'ValueError: {str(ve)}')
        return []
    except Exception as e:
        print(f'Error occurred during recommendation: {str(e)}')
        return []

# Main execution
if __name__ == '__main__':
    # Train the recommendation system
    model, df,predictions = train_recommendation_system('transactions.csv')

    if model and df is not None:
        # Show example predictions
        print("\nExample Predictions:")
        for uid, iid, true_r, est, _ in predictions[:10]:
            print(f'User {uid:<10} - Product {iid:<10} | Actual: {true_r:<5.2}, Predicted: {est:<5.2f}')

        # Get recommendations for a specific user
        user_id = 22580465
        recommendations = get_top_n_recommendations(model, user_id, 10, df)
        if recommendations:
            print("\nTop Recommendations:")
            for product_id, rating in recommendations:
                print(f'Product ID: {product_id:<10}, Predicted Rating: {rating:<5.2f}')
        else:
            print(f'No recommendations found for user {user_id}.')
