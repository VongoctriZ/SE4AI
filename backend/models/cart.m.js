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
    products: [
        {
            productId: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 0, // Default quantity is 1
            }
        }
    ]
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;