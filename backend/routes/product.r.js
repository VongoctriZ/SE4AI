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
router.get('/search', productController.searchProducts);

// Endpoint to remove a specific product
router.post('/removeproduct', productController.removeProduct);

// Endpoint to remove all products
router.post('/removeallproducts', productController.removeAllProducts);


// Endpoint to get new collections
router.get('/newcollections', productController.newCollections);

// Route for retrieving top-seller products
router.get('/best-sellers', productController.bestSellers);

// Route for cleaning up products
router.post('/cleanup', productController.cleanUpProducts);

// Route for updating attribute
router.post('/update/id', productController.updateProductId);
router.post('/update/name', productController.updateProductName);
router.post('/update/new_price', productController.updateProductNewPrice);
router.post('/update/old_price', productController.updateProductOldPrice);
router.post('/update/discount', productController.updateProductDiscount);
router.post('/update/rating', productController.updateProductRating);
// router.post('/update/thumbnail_url', productController.updateProductThumbnailUrl);
router.post('/update/short_description', productController.updateProductShortDescription);
router.post('/update/description', productController.updateProductDescription);
router.post('/update/review_counts', productController.updateProductReviewCounts);
router.post('/update/all_time_quantity_sold', productController.updateProductAllTimeQuantitySold);
router.post('/update/available', productController.updateProductAvailable);
router.post('/update/images', productController.updateProductImages);
router.post('/update/category', productController.updateProductCategory);
router.post('/update/date', productController.updateProductDate);



// update ratings from comments
router.post('/update-rating-from-comments', productController.updateProductRatingsFromComments);



module.exports = router;