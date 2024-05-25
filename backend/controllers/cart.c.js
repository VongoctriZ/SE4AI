const Users = require('../models/user.m');

// creating endpoint for adding products in cart data
const addToCart = async (req, res) => {
    console.log("added", req.body.itemId);

    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    // Send a response back to the client
    res.send({ message: 'Product added to cart successfully' });  // console.log(req.body,req.user);
}

// creating endpoint for removing product from cart data
const removeFromCart = async (req, res) => {
    console.log("removed", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0) { userData.cartData[req.body.itemId] -= 1; }
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    // Send a response back to the client
    res.send({ message: 'Product removed from cart successfully' });
}

// creating endpoint to get cart data
const getCart = async (req, res) => {
    console.log("get cart");
    let userData = await Users.findOne({ _id: req.user.id });
    return res.json(
            userData.cartData,
        );
    // Send a response back to the client
    // res.send({ message: 'All Products got from cart successfully' });
}

module.exports = { addToCart, removeFromCart, getCart };