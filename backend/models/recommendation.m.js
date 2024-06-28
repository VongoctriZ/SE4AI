const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecommendationSchema = new Schema({
    user_id: {
        type: Number,
        required: true,
    },
    recommended_items: {
        type: [{
            product_id: {
                type: Number,
                required: true,
            }
        }],
    }
});

const Recommendation = mongoose.model('Recommendation', RecommendationSchema);

module.exports = Recommendation;
