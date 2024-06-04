const User = require('../models/user.m');

class CartController {
    // Add a product to the cart
    async addToCart(req, res) {
        console.log("added", req.body.itemId);

        try {
            const user = await User.findById(req.user.id);
            if (!user.cartData[req.body.itemId]) {
                user.cartData[req.body.itemId] = 0;
            }
            user.cartData[req.body.itemId]++;
            await user.save();

            res.send({ message: 'Product added to cart successfully' });
        } catch (error) {
            res.status(500).send({ message: 'Error adding product to cart' });
        }
    }

    // Remove a product from the cart
    async removeFromCart(req, res) {
        console.log("removed", req.body.itemId);

        try {
            const user = await User.findById(req.user.id);
            if (user.cartData[req.body.itemId] > 0) {
                user.cartData[req.body.itemId]--;
                await user.save();
            }

            res.send({ message: 'Product removed from cart successfully' });
        } catch (error) {
            res.status(500).send({ message: 'Error removing product from cart' });
        }
    }

    // Get the user's cart data
    async getCart(req, res) {
        console.log("get cart");

        try {
            const user = await User.findById(req.user.id);
            res.json(user.cartData);
        } catch (error) {
            res.status(500).send({ message: 'Error getting cart data' });
        }
    }
}

module.exports = new CartController();