// const User = require('../models/user.m');

// class CartController {
//     // Add a product to the cart
//     async addToCart(req, res) {
//         console.log("added", req.body.itemId);

//         try {
//             const user = await User.findById(req.user.Id);
//             if (!user.cartData[req.body.itemId]) {
//                 user.cartData[req.body.itemId] = 0;
//             }
//             user.cartData[req.body.itemId]++;
//             await user.save();

//             res.send({ message: 'Product added to cart successfully' });
//         } catch (error) {
//             res.status(500).send({ message: 'Error adding product to cart' });
//         }
//     }

//     // Remove a product from the cart
//     async removeFromCart(req, res) {
//         console.log("removed", req.body.itemId);

//         try {
//             const user = await User.findById(req.user.Id);
//             if (user.cartData[req.body.itemId] > 0) {
//                 user.cartData[req.body.itemId]--;
//                 await user.save();
//             }

//             res.send({ message: 'Product removed from cart successfully' });
//         } catch (error) {
//             res.status(500).send({ message: 'Error removing product from cart' });
//         }
//     }

//     // Get the user's cart data
//     async getCart(req, res) {
//         console.log("get cart");

//         try {
//             const user = await User.findById(req.user.Id);
//             res.json(user.cartData);
//         } catch (error) {
//             res.status(500).send({ message: 'Error getting cart data' });
//         }
//     }
// }

// module.exports = new CartController();


const User = require('../models/user.m');
const Cart = require('../models/cart.m');
const Product = require('../models/product.m'); // Assuming you need this for validation

class CartController {
    // Add a product to the cart
    async addToCart(req, res) {
        console.log("added", req);

        try {
            // Find the user
            const user = await User.findOne({ Id: req.user.Id });
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            // Find the user's cart or create a new one if it doesn't exist
            let cart = await Cart.findOne({ id: user.cartId });
            if (!cart) {
                const newCartId = new Date().getTime();
                cart = new Cart({ id: newCartId, userId: user.Id });
                user.cartId = newCartId;
                await user.save();
            }

            // Check if the product exists
            const product = await Product.findOne({ id: req.body.itemId });
            if (!product) {
                return res.status(404).send({ message: 'Product not found' });
            }

            // Add product to cart
            if (!cart.productIds.includes(req.body.itemId)) {
                cart.productIds.push(req.body.itemId);
            }

            await cart.save();
            res.send({ message: 'Product added to cart successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error adding product to cart' });
        }
    }

    // Remove a product from the cart
    async removeFromCart(req, res) {
        console.log("removed", req.body.itemId);

        try {
            // Find the user
            const user = await User.findOne({ Id: req.user.Id });
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            // Find the user's cart
            let cart = await Cart.findOne({ id: user.cartId });
            if (!cart) {
                return res.status(404).send({ message: 'Cart not found' });
            }

            // Remove product from cart
            cart.productIds = cart.productIds.filter(id => id !== req.body.itemId);

            await cart.save();
            res.send({ message: 'Product removed from cart successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error removing product from cart' });
        }
    }

    // Get the user's cart data
    async getCart(req, res) {
        console.log("get cart");

        try {
            // Find the user
            const user = await User.findOne({ Id: req.user.Id });
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            // Find the user's cart
            let cart = await Cart.findOne({ id: user.cartId });
            if (!cart) {
                return res.status(404).send({ message: 'Cart not found' });
            }

            res.json(cart.productIds);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error getting cart data' });
        }
    }
}

module.exports = new CartController();