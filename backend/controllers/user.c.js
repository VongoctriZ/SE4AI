const maxItemInCart = 300;

const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
const User = require('../models/user.m');

// creating endpoint for registering the user
const SignUp = async (req, res) => {
    const { fullName, phoneNumber, email, password, confirmPassword, address } = req.body;

    // Validate required fields
    if (!fullName || !phoneNumber || !email || !password || !confirmPassword || !address) {
        return res.status(400).json({ success: false, errors: "All fields are required" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, errors: "Passwords do not match" });
    }

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ success: false, errors: "Existing user found with the same email address" });
    }

    // Initialize cart data
    let cart = {};
    for (let i = 0; i < maxItemInCart; i++) {
        cart[i] = 0;
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = password;

    // Create new user
    const user = new User({
        fullName,
        phoneNumber,
        email,
        password: hashedPassword,
        cartData: cart,
        address,
    });

    await user.save();

    const payload = {
        user: {
            id: user._id // Use _id as generated by MongoDB
        }
    };

    const token = jwt.sign(payload, 'secret_ecom', { expiresIn: '24h' });
    res.json({
        success: true, token, user: {
            email: user.email,
            fullName: user.fullName,
        }
    });
};

// creating endpoint for user login
const Login = async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({ success: false, errors: "All fields are required" });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ success: false, errors: "Invalid email address or password" });
    }

    // Compare hashed passwords
    // const isMatch = await bcrypt.compare(password, user.password);

    const isMatch = password === user.password;
    if (!isMatch) {
        return res.status(400).json({ success: false, errors: "Invalid email address or password" });
    }

    const payload = {
        user: {
            id: user._id
        }
    };

    const token = jwt.sign(payload, 'secret_ecom', { expiresIn: '24h' });
    res.json({
        success: true, token, user: {
            email: user.email,
            fullName: user.fullName,
        }
    });
};


const Update = async (req, res) => {
    const { fullName, email, password } = req.body;

    let toUpdateUser;
    try {
        toUpdateUser = await User.findById(req.user.id);
        if (!toUpdateUser) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("User found:", req.body);
    } catch (error) {
        console.error("Error finding user:", error);
        return res.status(500).json({ message: "Error finding user" });
    }

    if (fullName) {
        toUpdateUser.fullName = fullName;
        console.log("Full name updated");
    }

    if (email) {
        toUpdateUser.email = email;
        console.log("Email updated");
    }

    if (password) {
        // Ensure password is hashed before saving
        // const hashedPassword = await bcrypt.hash(password, 10);
        toUpdateUser.password = password;
        console.log("Password updated");
    }

    try {
        console.log("Attempting to save user...");
        await toUpdateUser.save();
        console.log('User saved successfully');
        res.json({
            user: {
                fullName: toUpdateUser.fullName,
                email: toUpdateUser.email
            }
        });
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: "Error updating user" });
    }
};


module.exports = { SignUp, Login, Update };