const express = require('express');
const router = express.Router();

const {addProduct,allProducts,removeAllProducts,removeProduct, popularInWomen, newCollections} = require('../controllers/product.c');

router.post('/addproduct',addProduct);
router.get('/allproducts',allProducts);
router.post('/removeproduct',removeProduct);
router.post('/removeallproducts',removeAllProducts);
router.get('/popularinwomen',popularInWomen);
router.get('/newcollections',newCollections);

module.exports = router;