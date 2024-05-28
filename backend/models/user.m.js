const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
    Id: {
        type: Number,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true, // Removes whitespace from both ends
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true, // Converts email to lowercase
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'] // Email format validation
    },
    password: {
        type: String,
        required: true,
        // minlength: 8, // Minimum password length
    },
    phoneNumber: {
        type: String,
        required: true,
        match: [/^\d+$/, 'Please use a valid phone number.'] // Ensures the phone number contains only digits
    },
    cartData: {
        type: Object,
        default: {} // Default to an empty object
    },
    createdAt: {
        type: Date,
        default: Date.now, // Default to current date and time
    },
    address:{
        type: String,
        // require: true,
        default: ""
    }
});

// Create the User model
const User = mongoose.model('User', UserSchema);


module.exports = User;