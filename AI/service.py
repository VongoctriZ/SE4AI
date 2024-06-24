from flask import Flask, request, jsonify
import joblib
import numpy as np
from scipy.sparse import coo_matrix

app = Flask(__name__)

# Load model and mappings
model = joblib.load('als_model.pkl')
user_id_mapping = joblib.load('user_id_mapping.pkl')
item_id_mapping = joblib.load('item_id_mapping.pkl')
inverse_user_id_mapping = joblib.load('inverse_user_id_mapping.pkl')
inverse_item_id_mapping = joblib.load('inverse_item_id_mapping.pkl')

def get_recommendations(user_id, num_recommendations=12):
    user_idx = user_id_mapping.get(user_id)
    if user_idx is None:
        return []
    ids, scores = model.recommend(user_idx, csr_train[user_idx], N=num_recommendations, filter_already_liked_items=True)
    recommendations = [inverse_item_id_mapping[item_id] for item_id in ids]
    return recommendations

@app.route('/recommend', methods=['GET'])
def recommend():
    user_id = request.args.get('user_id', type=int)
    num_recommendations = request.args.get('num_recommendations', default=12, type=int)
    recommendations = get_recommendations(user_id, num_recommendations)
    return jsonify({'user_id': user_id, 'recommendations': recommendations})

if __name__ == '__main__':
    app.run(debug=True)
