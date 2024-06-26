# main.py
from pymongo import MongoClient
from data import get_dataset
from recommendation_system import generate_recommendations
from upload import upload_recommendations_to_mongodb
import time

mongodb_uri = 'mongodb+srv://huy94:qVG1QgHHccmC3eI5@clothes.4eaglhc.mongodb.net/shoper'
database_name = 'shoper'
collection_name = 'recommendations'

def check_database_connection():
    client = MongoClient(mongodb_uri)
    try:
        # Check if the client can connect to the database
        client.server_info()  # This will raise an exception if not connected
        print("Connected to MongoDB successfully!")
        return True
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        return False

if __name__ == "__main__":
    while True:
        # Check database connection before proceeding
        if not check_database_connection():
            break
        
        dataset = get_dataset()
        recommendations = generate_recommendations(dataset)
        
        # Upload recommendations to MongoDB
        upload_recommendations_to_mongodb(recommendations, mongodb_uri, database_name, collection_name)
        
        print("Recommendations uploaded to MongoDB.")
        
        print("Waiting for updating...")
        # Sleep for a period before repeating the process
        time.sleep(5)  # Sleep for 1 hour (adjust as needed)

    print("Pipeline stopped due to database connection failure.")
