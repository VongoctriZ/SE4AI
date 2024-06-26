import pandas as pd
from pymongo import MongoClient

mongodb_uri = 'mongodb+srv://huy94:qVG1QgHHccmC3eI5@clothes.4eaglhc.mongodb.net/shoper'
database_name = 'shoper'
collection_name = 'recommendations'


def upload_recommendations_to_mongodb(data, mongodb_uri, database_name, collection_name):
    # Format the data according to the schema
    recommendations = []
    for _, row in data.iterrows():
        user_id = row['user_id']
        item_ids = row['item_predict'].split()  # Assuming 'item_predict' contains space-separated IDs
        recommended_items = [{'product_id': int(item_id)} for item_id in item_ids]
        
        recommendations.append({
            'user_id': int(user_id),
            'recommended_items': recommended_items
        })

    # Connect to MongoDB
    client = MongoClient(mongodb_uri)
    db = client[database_name]
    collection = db[collection_name]

    # Insert the formatted data into MongoDB
    collection.insert_many(recommendations)
    print(f"Uploaded {len(recommendations)} recommendations to MongoDB.")