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
            } else {
                console.log("user: ", user);
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
            console.log("Product removed from cart successfully");

            res.send({ message: 'Product removed from cart successfully' });
        } catch (error) {
            console.log("Error removing product from cart");
            console.error(error);
            res.status(500).send({ message: 'Error removing product from cart' });
        }
    }

    // Remove all items from the cart
    async removeAll(req, res) {
        console.log("Remove all items from the cart if user with Id: ", req.body.userId);
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

            // Remove all products from cart
            cart.products = [];
            await cart.save();

            console.log("All items removed from cart successfully");
            res.send({ message: 'All items removed from cart successfully' });
        } catch (error) {
            console.error("Error removing all items from cart", error);
            res.status(500).send({ message: 'Error removing all items from cart' });
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
            console.log("Products In Cart: ", cart.products);

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

    // api to remove carts where userId not found
    async cleanUp(req, res) {
        try {
            // Find all carts
            const allCarts = await Cart.find();

            // If no carts found, return
            if (allCarts.length === 0) {
                return res.status(200).json({ message: 'No carts found.' });
            }

            // Get all userIds from User collection
            const allUserIds = await User.find().distinct('Id');

            // Initialize an array to store invalid cartIds
            const invalidCartIds = [];

            // Initialize a counter for successfully deleted carts
            let deletedCount = 0;

            // Iterate through each cart
            for (const cart of allCarts) {
                // Check if userId exists in the User collection
                if (!allUserIds.includes(cart.userId)) {
                    // Log the inconsistency for monitoring
                    console.warn(`Cart with userId ${cart.userId} not found in User collection. Removing cart.`);

                    // Attempt to delete the cart
                    try {
                        const deleteResult = await Cart.deleteOne({ _id: cart._id });
                        if (deleteResult.deletedCount > 0) {
                            deletedCount++;
                        } else {
                            console.error(`Failed to delete cart with _id ${cart._id}.`);
                        }
                    } catch (error) {
                        console.error(`Error deleting cart with _id ${cart._id}:`, error);
                        // Handle specific errors or add rollback logic if needed
                    }
                }
            }

            return res.status(200).json({
                message: `Removed ${deletedCount} carts with invalid userId.`,
            });

        } catch (error) {
            console.error('Error cleaning up carts:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

}

module.exports = new CartController();
