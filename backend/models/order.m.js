const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Schema for Creating Orders
const OrderSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    userId: {
        type: Number,
        required: true,
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
            }
        }
    ],
    total_money: {
        type: Number,
        require: true,
    },
    status: {
        type: String,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;