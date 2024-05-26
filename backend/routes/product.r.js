const express = require('express');
const router = express.Router();

const {
    addProduct,
    allProducts,
    removeAllProducts,
    removeProduct,
    popularInWomen,
    newCollections,
} = require('../controllers/product.c');

// Endpoint to add a product
router.post('/addproduct', addProduct);

// Endpoint to get all products
router.get('/allproducts', allProducts);

// Endpoint to remove a specific product
router.post('/removeproduct', removeProduct);

// Endpoint to remove all products
router.post('/removeallproducts', removeAllProducts);

// Endpoint to get popular products in the women category
router.get('/popularinwomen', popularInWomen);

// Endpoint to get new collections
router.get('/newcollections', newCollections);

module.exports = router;