const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetch-user');

const cartController = require('../controllers/cart.c');

router.use('/addtocart', fetchUser, cartController.addToCart);

router.use('/getcart', fetchUser, cartController.getCart);

router.use('/removefromcart', fetchUser, cartController.removeFromCart);

module.exports = router;