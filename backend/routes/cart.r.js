const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetch-user');

const cartController = require('../controllers/cart.c');

router.post('/addtocart', fetchUser, cartController.addToCart);

router.post('/getcart', fetchUser, cartController.getCart);

router.post('/removefromcart', fetchUser, cartController.removeFromCart);

router.post('/removeallfromcart', fetchUser, cartController.removeAll);

// Add a route for converting cart design
router.post('/convert-cart-design', cartController.convertCartDesign);

module.exports = router;