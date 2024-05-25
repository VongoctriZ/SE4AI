// const mongoose = require('mongoose');

// // schema creating for User model
// const User = mongoose.model('User', {
//     username: {
//         type: String,
//     },
//     email: {
//         type: String,
//     },
//     password: {
//         type: String,
//     },
//     cartData: {
//         type: Object,
//     },
//     date: {
//         type: Date,
//         default: Date.now,
//     }
// })

const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true, // Removes whitespace from both ends
    },
    emailAddress: {
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
        minlength: 8, // Minimum password length
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
    }
});

// Create the User model
const User = mongoose.model('User', userSchema);


module.exports = User;