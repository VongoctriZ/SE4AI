import requests
import pandas as pd
import numpy as np

# Define functions for fetching orders and products
def fetch_all_orders():
    try:
        response = requests.get('http://localhost:4000/order/allorders')
        data = response.json()
        print('Fetch orders success')
        return data
    except requests.exceptions.RequestException as e:
        print(f'Error fetching all orders: {e}')
        return []

def fetch_all_products():
    try:
        response = requests.get('http://localhost:4000/product/allproducts')
        data = response.json()
        print('Fetch products success')
        return data
    except requests.exceptions.RequestException as e:
        print(f'Error fetching all products: {e}')
        return []

# Format orders to DataFrame
def format_orders_to_csv(orders, products):
    csv_data = []
    product_ratings = {product['id']: product['rating'] for product in products}

    for order in orders:
        user_id = order['userId']
        t_dat = order['createdAt']
        for product in order['products']:
            product_id = product['productId']
            rating = product_ratings.get(product_id, 0)  # Default rating to 0 if not found
            csv_data.append({'t_dat': t_dat, 'user_id': user_id, 'product_id': product_id, 'rating': rating})

    return pd.DataFrame(csv_data)

def get_dataset():
    orders = fetch_all_orders()
    products = fetch_all_products()
    df = format_orders_to_csv(orders, products)

    
    return df