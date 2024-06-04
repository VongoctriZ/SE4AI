const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for Creating Products
const ProductSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },

    url_key: { type: String },
    url_path: { type: String },

    short_description: { type: String },

    price: {
        type: Number,
        required: true,
    },
    original_price: {
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
    review_counts: {
        type: Number,
        default: 0,
    },

    inventory_status: { type: String },

    all_time_quantity_sold: {
        type: Number,
        default: 0,
    },

    description: {
        type: String,
        default: "",
    },

    images: {
        type: Array,
    },

    brand: { type: Object },

    configuration_option: { type: Array },

})

module.exports = mongoose.model('Product', ProductSchema, 'QuanNuNguoiLon');