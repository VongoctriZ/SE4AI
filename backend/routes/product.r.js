const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.c');

// Endpoint to add a product
router.post('/addproduct', productController.addProduct);

// Endpoint to get all products
router.get('/allproducts', productController.allProducts);

// Endpoint to remove a specific product
router.post('/removeproduct', productController.removeProduct);

// Endpoint to remove all products
router.post('/removeallproducts', productController.removeAllProducts);

// Endpoint to get popular products in the women category
router.get('/popularinwomen', productController.popularInWomen);

// Endpoint to get new collections
router.get('/newcollections', productController.newCollections);

module.exports = router;