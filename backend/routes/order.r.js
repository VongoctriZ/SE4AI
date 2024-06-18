const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.c');

// Create a new order
router.post('/create', OrderController.createOrder);

// Get all orders
router.get('/allorders',OrderController.allOrders);

// Get all orders for a user
router.get('/user/:userId', OrderController.getUserOrders);

// Get details of a specific order
router.get('/:orderId', OrderController.getOrderDetails);

// Update the status of an order
router.post('/update/status', OrderController.updateOrderStatus);

// Delete an order
router.delete('/:orderId', OrderController.deleteOrder);

router.post('/removeall', OrderController.removeAllOrders);

module.exports = router;
