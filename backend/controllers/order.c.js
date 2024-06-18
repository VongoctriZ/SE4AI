const axios = require('axios');
const Order = require('../models/order.m');
const User = require('../models/user.m');
const Product = require('../models/product.m'); // Assuming you need this for validation

class OrderController {

    constructor() {
        this.updateOrderStatus = this.updateOrderStatus.bind(this);
    }

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

    // Get all orders
    async allOrders(req, res) {
        try {
            const orders = await Order.find({});
            console.log("All orders fetched");
            res.status(200).json(orders);
        } catch (error) {
            console.log("Error fetching all orders:", error);
            res.status(500).json({
                success: false,
                message: 'Error fetching all orders',
            });
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

    async updateAttribute(req, res, attribute) {
        try {
            console.log("request body: ", req.body);
            const orderId = req.body.id;
            const newValue = req.body[attribute];

            if (!newValue) {
                return res.status(400).json({
                    success: false,
                    message: `New value for ${attribute} is required`,
                });
            };

            // Fetch the current order to check its status
            const currentOrder = await Order.findOne({ id: orderId });
            if (!currentOrder) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found',
                });
            }

            // Check if the status is already 'accepted'
            if (attribute === 'status' && currentOrder.status === 'accepted') {
                return res.status(400).json({
                    success: false,
                    message: 'Order status is already accepted, no update performed',
                });
            }

            const updateData = {};
            updateData[attribute] = newValue;

            const updateOrder = await Order.findOneAndUpdate(
                { id: orderId },
                updateData,
                { new: true, runValidators: true }
            );

            if (!updateOrder) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found',
                });
            };

            res.status(200).json({
                success: true,
                order: updateOrder,
            });

            // Additional step: If updating status to 'accepted', update products' all_time_quantity_sold
            if (attribute === 'status' && newValue === 'accepted') {
                await this.updateProductsQuantitySold(updateOrder.products);
            }

        } catch (error) {
            console.error(`Error updating ${attribute}:`, error);
            res.status(500).json({
                success: false,
                message: `Error updating ${attribute}`,
            });
        }
    }

    // Update the status of an order
    async updateOrderStatus(req, res) {
        return this.updateAttribute(req, res, 'status');
    }

    // Update products' all_time_quantity_sold based on order products
    async updateProductsQuantitySold(products) {
        try {
            for (const product of products) {
                const { productId, quantity } = product;
                // Fetch the current product details
                const existingProduct = await Product.findOne({ id: productId });
                if (existingProduct) {
                    console.log("Old quantity: ", existingProduct.all_time_quantity_sold);
                    console.log("Add: ", quantity);

                    const newQuantity = existingProduct.all_time_quantity_sold + quantity;
                    await axios.post('http://localhost:4000/product/update/all_time_quantity_sold', {
                        id: productId,
                        all_time_quantity_sold: newQuantity
                    });
                }
            }

        } catch (error) {
            console.error('Error updating products quantity sold:', error);
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

    // Remove all orders
    async removeAllOrders(req, res) {
        console.log("Request body: ", req.body);
        try {
            const result = await Order.deleteMany({});
            console.log(`${result.deletedCount} orders removed`);
            res.status(200).json({
                success: true,
                message: `${result.deletedCount} orders removed`,
            });
        } catch (error) {
            console.log("Error removing all orders", error);
            res.status(500).json({
                success: 'false',
                message: 'Error removing all orders',
            });
        }
    }
}

module.exports = new OrderController();
