const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    userId: {
        type: Number,
        required: true,
        unique: true, 
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
                default: 0, 
            }
        }
    ]
});

module.exports = mongoose.model('Cart', CartSchema);;