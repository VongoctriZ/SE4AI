const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for Creating Shopping Carts
const CartSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    userId: {
        type: Number,
        required: true,
        unique: true, // Each user has a unique cart
    },
    productIds: {
        type: [Number],
        default: [],
    }
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;