const maxItemInCart = 300;
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const User = require('../models/user.m');
const Cart = require('../models/cart.m')

class UserController {

    async create(req, res) {
        const { fullName, phoneNumber, email, password, confirmPassword, address, Id } = req.body;

        // Validate required fields
        if (!fullName || !phoneNumber || !email || !password || !confirmPassword || !address) {
            return res.status(400).json({ success: false, errors: "All fields are required" });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, errors: "Passwords do not match" });
        }

        let newUser;

        try {
            if (Id) {
                // If an ID is provided, check if it already exists
                const existingUser = await User.findOne({ Id });
                if (existingUser) {
                    // If a user with the provided ID exists, return an error
                    return res.status(400).json({ success: false, errors: "User with the provided ID already exists" });
                }
                newUser = new User({ Id });
            } else {
                // If no ID is provided, generate a new one
                const lastUser = await User.findOne().sort({ Id: -1 });
                const lastId = lastUser ? lastUser.Id : 0;
                newUser = new User({ Id: lastId + 1 });
            }

            // Hash the password
            const hashedPassword = password;

            // Create new user
            newUser.fullName = fullName;
            newUser.phoneNumber = phoneNumber;
            newUser.email = email;
            newUser.password = hashedPassword;
            newUser.address = address;

            await newUser.save();



        } catch (error) {
            console.error("Error saving user:", error);
            res.status(500).json({ success: false, errors: "Error creating user" });
        }
    }


    async signUp(req, res) {
        const { fullName, phoneNumber, email, password, confirmPassword, address, Id } = req.body;

        if (!fullName){
            return res.status(400).json({sucess:false, errors: "Full Name is required"});
        }

        if (!phoneNumber){
            return res.status(400).json({success: false, errors: "Phone Number is required"});
        }

        if (!email){
            return res.status(400).json({success: false, errors: "Email is required"});
        }

        if (!password) {
            return res.status(400).json({ sucess: false, errors: "Password is required" });
        }

        if (!email){
            return res.status(400).json({ sucess: false, errors: "Email is required" });
        }

     
        // Validate required fields
        if (!fullName || !phoneNumber || !email || !password || !confirmPassword || !address) {
            return res.status(400).json({ success: false, errors: "All fields are required" });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, errors: "Password does not match" });
        }

        try {
            // Check if email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, errors: "User with the provided email already exists" });
            }

            let newUser;
            if (Id) {
                // If an ID is provided, check if it already exists
                const existingUser = await User.findOne({ Id });
                if (existingUser) {
                    return res.status(400).json({ success: false, errors: "User with the provided ID already exists" });
                }
                newUser = new User({ Id });
            } else {
                // If no ID is provided, generate a new one
                const lastUser = await User.findOne().sort({ Id: -1 });
                const lastId = lastUser ? lastUser.Id : 0;
                newUser = new User({ Id: lastId + 1 });
            }

            // Hash the password
            const hashedPassword = password; // Replace with actual hashing logic

            // Assign other user details
            newUser.fullName = fullName;
            newUser.phoneNumber = phoneNumber;
            newUser.email = email;
            newUser.password = hashedPassword;
            newUser.address = address;

            // Create a new cart for the user
            const lastCart = await Cart.findOne().sort({ id: -1 });
            const lastCartId = lastCart ? lastCart.id : 0;
            const newCart = new Cart({ id: lastCartId + 1, userId: newUser.Id });

            await newCart.save();

            // Assign the new cartId to the user
            newUser.cartId = newCart.id;

            // Save the new user
            await newUser.save();

            const payload = {
                user: {
                    id: newUser._id // Use id generated by MongoDB
                }
            };

            const token = jwt.sign(payload, 'secret_ecom', { expiresIn: '24h' });
            res.json({
                success: true, token, user: {
                    Id: newUser.Id,
                    email: newUser.email,
                    fullName: newUser.fullName,
                    address: newUser.address,
                    password: newUser.password,
                }
            });
        } catch (error) {
            console.error("Error saving user or cart:", error);
            res.status(500).json({ success: false, errors: "Error creating user or cart" });
        }
    }



    async login(req, res) {
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
                Id: user.Id,
                email: user.email,
                fullName: user.fullName,
                address: user.address,
                password: user.password,
            }
        });
    }

    async update(req, res) {
        const { fullName, email, password, phoneNumber, address } = req.body;

        try {
            const toUpdateUser = await User.findById(req.user.Id);
            if (!toUpdateUser) {
                return res.status(404).json({ message: "User not found" });
            }
            console.log("User found:", req.body);

            if (fullName) {
                toUpdateUser.fullName = fullName;
                console.log("Full name updated");
            }

            if (email) {
                toUpdateUser.email = email;
                console.log("Email updated");
            }

            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                toUpdateUser.password = hashedPassword;
                console.log("Password updated");
            }

            if (phoneNumber) {
                toUpdateUser.phoneNumber = phoneNumber;
                console.log("Phone number updated");
            }

            if (address) {
                toUpdateUser.address = address;
                console.log("Address updated");
            }

            console.log("Attempting to save user...");
            await toUpdateUser.save();
            console.log('User saved successfully');
            res.json({
                user: {
                    fullName: toUpdateUser.fullName,
                    email: toUpdateUser.email,
                    password: toUpdateUser.password,
                    phoneNumber: toUpdateUser.phoneNumber,
                    address: toUpdateUser.address,
                }
            });

        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ message: "Error updating user" });
        }
    }

    // API for getting all products
    async allUsers(req, res) {
        try {
            let users = await User.find({});
            // Status code: 200 OK
            // The request is OK (the standard response for successful HTTP requests)
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error fetching products",
            });
        }
    };

    async removeUser(req, res) {
        try {
            const { _id } = req.body;
            if (!_id) {
                return res.status(400).json({ success: false, message: 'ID is required' });
            }

            // Find user by ID
            const user = await User.findById(_id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Delete the user's cart
            const cartResult = await Cart.findOneAndDelete({ userId: user.Id });

            // Delete the user
            const userResult = await User.findByIdAndDelete(_id);

            if (userResult) {
                res.status(200).json({
                    success: true,
                    user: userResult,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }
        } catch (error) {
            console.error("Error removing user:", error);
            res.status(500).json({
                success: false,
                message: 'Error removing user',
            });
        }
    };

    async removeAllUsers(req, res) {
        try {
            const result = await User.deleteMany({});
            console.log(`${result.deletedCount} users removed`);
            res.status(200).json({
                success: true,
                message: `${result.deletedCount} users removed`,
            });
        } catch (error) {
            console.log("Error removing all users:", error);
            res.status(500).json({
                success: false,
                message: 'Error removing all users',
            });
        }
    };


}

module.exports = new UserController();