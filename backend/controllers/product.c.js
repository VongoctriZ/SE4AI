const Product = require('../models/product.m')

class ProductController {

    // API for adding a product
    async addProduct(req, res) {
        try {
            // find()   - method from Mongoose to search for documents in the Product collection
            // {}       - does not filter any documents, retrieve all from the collection
            // sort({id:-1})    - sort by id field in descending order  
            // limit(1) - restrict the number of documents returned by the query
            // let products = await Product.find({}).sort({ id: -1 }).limit(1);
            // console.log(products.length);
            // // if there is no existing product, set id for added product as 1
            // let id = products.length > 0 ? products[0].id + 1 : 1;
            // console.log(id);
            // Get thumbnail URL from request or use the first image in the images array
            const thumbnail_url = req.body.thumbnail_url || (req.body.images && req.body.images.length > 0 ? req.body.images[0] : '');

            let id = req.body.id;
            if (id === null) {
                id = products.length > 0 ? products[0].id + 1 : 1;
            }

            const product = new Product({
                id: id,
                name: req.body.name,
                description: req.body.description || '',
                rating: req.body.rating || 0,
                images: [],
                category: req.body.category,
                new_price: req.body.new_price,
                old_price: req.body.old_price,
                discount: req.body.discount || 0,
                review_counts: req.body.review_counts || 0,
                all_time_quantity_sold: req.body.all_time_quantity_sold || 0,
                thumbnail_url: '',
                available: req.body.available !== undefined ? req.body.available : 'not available',
            });

            // save document in the collection
            await product.save();
            // for debug
            console.log("Product saved:", product);

            // status code: 201 Created 
            // The request has been fulfilled, 
            // and a new resource is created.
            res.status(201).json({
                success: true,
                product: product,
            });
        } catch (error) {
            console.error("Error adding product:", error);
            // status code: 500 Internal Server Error
            // The request was not completed
            // The server met an expected condition
            res.status(500).json({
                success: false,
                message: 'Error adding product',
            });
        }
    };

    // API for getting all products
    async allProducts(req, res) {
        try {
            let products = await Product.find({});
            console.log("ALl Products fetched");
            // Status code: 200 OK
            // The request is OK (the standard response for successful HTTP requests)
            res.status(200).json(products);
        } catch (error) {
            console.log("Error fetching products:", error);
            res.status(500).json({
                success: false,
                message: "Error fetching products",
            });
        }
    };

    // API for deleting a product
    async removeProduct(req, res) {
        try {
            const result = await Product.findOneAndDelete({ id: req.body.id });
            if (result) {
                console.log("Product removed:", result);
                res.status(200).json({
                    success: true,
                    product: result,
                });
            } else {
                // status code: 404 Not Found
                // The server can not find the requested page
                res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
            }
        } catch (error) {
            console.error("Error removing product:", error);
            res.status(500).json({
                success: false,
                message: 'Error removing product',
            });
        }
    };

    // API for deleting all products
    async removeAllProducts(req, res) {
        try {
            const result = await Product.deleteMany({});
            console.log(`${result.deletedCount} products removed`);
            res.status(200).json({
                success: true,
                message: `${result.deletedCount} products removed`,
            });
        } catch (error) {
            console.error("Error removing all products:", error);
            res.status(500).json({
                success: false,
                message: 'Error removing all products',
            });
        }
    };

    // API for getting popular products in the women section
    async popularInWomen(req, res, next) {
        try {
            // find top 4 of the most popular products in the women section by rating (descending order)
            // let products = await Product.find({ category: "women" }).sort({ rating: -1 }).limit(4);
            // console.log("Popular in women fetched:", products);
            // res.json(products);
            Product.find({}).limit(4)
                .then((products) => {
                    res.json(products)
                })
                .catch(next);
        } catch (error) {
            console.error("Error fetching popular products in women:", error);
            res.status(500).json({
                success: false,
                message: 'Error fetching popular products in women',
            });
        }
    };

    // API for getting new collection data
    async newCollections(req, res) {
        try {
            let products = await Product.find({}).sort({ date: -1 }).limit(8);
            console.log("New collections fetched:", products);
            res.status(200).json(products);
        } catch (error) {
            console.error("Error fetching new collections:", error);
            res.status(500).json({
                success: false,
                message: 'Error fetching new collections',
            });
        }
    };

    // API for updating a product
    async updateProduct(req, res) {
        try {
            const productId = req.params.id;
            const updateData = req.body;

            // Map and extract base_url values from images array if provided
            if (updateData.images) {
                updateData.images = updateData.images.map(image => image.base_url);
            }

            // Get thumbnail URL from request or use the first image in the images array
            if (updateData.images && updateData.images.length > 0) {
                updateData.thumbnail_url = updateData.thumbnail_url || updateData.images[0];
            }

            // Update the product with the provided data
            const updatedProduct = await Product.findOneAndUpdate({ id: productId }, updateData, {
                new: true, // Return the updated document
                runValidators: true // Ensure validation rules are enforced
            });

            if (!updatedProduct) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
            }

            // status code: 200 OK
            // The request was successful and the resource was updated.
            res.status(200).json({
                success: true,
                product: updatedProduct,
            });
        } catch (error) {
            console.error("Error updating product:", error);
            // status code: 500 Internal Server Error
            // The request was not completed
            // The server met an unexpected condition
            res.status(500).json({
                success: false,
                message: 'Error updating product',
            });
        }
    };
};

module.exports = new ProductController();