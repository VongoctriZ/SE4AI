const Order = require('../models/order.m');
const User = require('../models/user.m');
const Product = require('../models/product.m'); // Assuming you need this for validation

class OrderController {
    // Create a new order
    async createOrder(req, res) {
        try {
            const { userId, products, total_money, status = "pending" } = req.body;

            console.log("Request Data: ", req.body);

            // Validate user
            const user = await User.findOne({ Id: userId });
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            // Validate products
            for (const product of products) {
                const productExists = await Product.findOne({ id: product.productId });
                if (!productExists) {
                    return res.status(404).send({ message: `Product with ID ${product.productId} not found` });
                }
            }

            // Find the current highest order ID
            const lastOrder = await Order.findOne().sort({ id: -1 });
            const newOrderId = lastOrder ? lastOrder.id + 1 : 1;

            // Create a new order
            const newOrder = new Order({
                id: newOrderId,
                userId,
                products,
                total_money,
                status
            });

            await newOrder.save();
            res.status(201).send({ message: 'Order created successfully', order: newOrder });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).send({ message: 'Error creating order' });
        }
    }

    // Get all orders for a user
    async getUserOrders(req, res) {
        try {
            const { userId } = req.params;

            // Validate user
            const user = await User.findOne({ Id: userId });
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            // Find all orders for the user
            const orders = await Order.find({ userId });
            res.status(200).send({ orders });
        } catch (error) {
            console.error('Error fetching user orders:', error);
            res.status(500).send({ message: 'Error fetching user orders' });
        }
    }

    // Get details of a specific order
    async getOrderDetails(req, res) {
        try {
            const { orderId } = req.params;

            // Find the order
            const order = await Order.findOne({ id: orderId });
            if (!order) {
                return res.status(404).send({ message: 'Order not found' });
            }

            res.status(200).send({ order });
        } catch (error) {
            console.error('Error fetching order details:', error);
            res.status(500).send({ message: 'Error fetching order details' });
        }
    }

    // Update the status of an order
    async updateOrderStatus(req, res) {
        try {
            const { orderId } = req.params;
            const { status } = req.body;

            // Find the order
            const order = await Order.findOne({ id: orderId });
            if (!order) {
                return res.status(404).send({ message: 'Order not found' });
            }

            // Update the status
            order.status = status;
            await order.save();

            res.status(200).send({ message: 'Order status updated successfully', order });
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).send({ message: 'Error updating order status' });
        }
    }

    // Delete an order
    async deleteOrder(req, res) {
        try {
            const { orderId } = req.params;

            // Find and delete the order
            const order = await Order.findOneAndDelete({ id: orderId });
            if (!order) {
                return res.status(404).send({ message: 'Order not found' });
            }

            res.status(200).send({ message: 'Order deleted successfully' });
        } catch (error) {
            console.error('Error deleting order:', error);
            res.status(500).send({ message: 'Error deleting order' });
        }
    }
}

module.exports = new OrderController();
