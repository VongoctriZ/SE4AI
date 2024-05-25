const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetch-user');

const {addToCart, getCart, removeFromCart} = require('../controllers/cart.c');

router.use('/addtocart',fetchUser,addToCart);
router.use('/getcart',fetchUser,getCart);
router.use('/removefromcart',fetchUser,removeFromCart);

module.exports = router;