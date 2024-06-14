const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.c');

// Endpoint to add a product
router.post('/addproduct', productController.addProduct);

// Endpoint to get all products
router.get('/allproducts', productController.allProducts);

// Endpoint for get all products by category (process first for main categories)
router.get('/category/:category', productController.productsByCategory);

// Route for searching products by category
router.get('/search', productController.searchProductsByCategory);

// Endpoint to remove a specific product
router.post('/removeproduct', productController.removeProduct);

// Endpoint to remove all products
router.post('/removeallproducts', productController.removeAllProducts);

// Endpoint to get popular products in the women category
router.get('/popularinwomen', productController.popularInWomen);

// Endpoint to get new collections
router.get('/newcollections', productController.newCollections);

// Route for retrieving top-seller products
router.get('/best-sellers', productController.bestSellers);

// Route for cleaning up products
router.post('/cleanup', productController.cleanUpProducts);

// Route for exporting products
router.get('/export', productController.exportProducts);

module.exports = router;