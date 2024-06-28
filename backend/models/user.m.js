const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Id: {
        type: Number,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        match: [/^\d+$/, 'Please use a valid phone number.']
    },
    cartId: {
        type: Number,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    address: {
        type: String,
        default: ""
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;