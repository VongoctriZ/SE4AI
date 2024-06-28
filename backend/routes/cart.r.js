const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetch-user');

const cartController = require('../controllers/cart.c');

router.post('/addtocart', fetchUser, cartController.addToCart);

router.post('/getcart', fetchUser, cartController.getCart);

router.post('/removefromcart', fetchUser, cartController.removeFromCart);

router.post('/removeallfromcart', fetchUser, cartController.removeAll);


// clean up: remove cart of not found user (maybe deleted user)
router.post('/cleanup', cartController.cleanUp);

module.exports = router;