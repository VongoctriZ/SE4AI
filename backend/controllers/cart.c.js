const User = require('../models/user.m');
const Cart = require('../models/cart.m');
const Product = require('../models/product.m'); // Assuming you need this for validation

class CartController {
    // Add a product to the cart
    async addToCart(req, res) {
        console.log("added", req.body.itemId);

        try {
            // Find the user
            const user = await User.findOne({ _id: req.user.id });

            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }else{
                console.log("user: ",user);
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

            // Add or update product in cart
            const productIndex = cart.products.findIndex(p => p.productId === req.body.itemId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity++;
            } else {
                cart.products.push({ productId: req.body.itemId, quantity: 1 });
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
            const user = await User.findOne({ _id: req.user.id });
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            // Find the user's cart
            let cart = await Cart.findOne({ id: user.cartId });
            if (!cart) {
                return res.status(404).send({ message: 'Cart not found' });
            }

            // Remove product from cart or decrease quantity
            const productIndex = cart.products.findIndex(p => p.productId === req.body.itemId);
            if (productIndex > -1) {
                if (cart.products[productIndex].quantity > 1) {
                    cart.products[productIndex].quantity--;
                } else {
                    cart.products.splice(productIndex, 1);
                }
            }

            await cart.save();
            res.send({ message: 'Product removed from cart successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error removing product from cart' });
        }
    }

    // Get the user's cart data
    async getCart(req, res) {
        console.log("get cart: ", req.body);

        try {
            // Find the user
            const user = await User.findOne({ Id: req.body.userId });
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            // Find the user's cart
            let cart = await Cart.findOne({ id: user.cartId });
            if (!cart) {
                return res.status(404).send({ message: 'Cart not found' });
            }
            console.log("Products In Cart: ",cart.products);

            res.json(cart.products);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error getting cart data' });
        }
    }

     // Method to convert cart items from old design to new design
     async convertCartDesign(req, res) {
        try {
            // Find all carts that still use the old design
            const carts = await Cart.find({ 'productIds.0': { $type: 'number' } });

            // Iterate through each cart and convert its design
            for (let cart of carts) {
                // Initialize a Map to count product IDs
                const productCountMap = new Map();

                // Count occurrences of each product ID
                cart.productIds.forEach(productId => {
                    if (productCountMap.has(productId)) {
                        productCountMap.set(productId, productCountMap.get(productId) + 1);
                    } else {
                        productCountMap.set(productId, 1);
                    }
                });

                // Create a new array with objects containing productId and quantity
                const newProductIds = [];
                productCountMap.forEach((quantity, productId) => {
                    newProductIds.push({ productId, quantity });
                });

                // Update the cart with the new structure
                cart.productIds = newProductIds;
                await cart.save();
            }

            res.send({ message: 'Cart design conversion completed successfully' });
        } catch (error) {
            console.error("Error converting cart design:", error);
            res.status(500).send({ message: 'Error converting cart design' });
        }
    }
}

module.exports = new CartController();
