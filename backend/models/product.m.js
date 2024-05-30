const mongoose = require('mongoose');

// Schema for Creating Products
const ProductSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
    },
    thumbnail_url: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
    },
    review_counts: {
        type: Number,
        default: 0,
    },

    all_time_quantity_sold: {
        type: Number,
        default: 0,
    },
    available: {
        type: String,
        default: 'not available',
    },
    images: {
        type: [String],
        // required: true,
    },
    category: {
        type: String,
        required: true,
        // enum: ['men', 'women', 'kids'], // Ensuring it only takes these values
    },
    date: {
        type: Date,
        default: Date.now,
    },

})

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;