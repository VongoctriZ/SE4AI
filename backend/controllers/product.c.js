const Product = require('../models/product.m')

class ProductController {

    // API for adding a product
    async addProduct(req, res) {
        try {
            // Retrieve the latest product to determine the next product ID
            let products = await Product.find({}).sort({ id: -1 }).limit(1);
            let id = req.body.id || (products.length > 0 ? products[0].id + 1 : 1);

            // Create a new product object
            const product = new Product({
                id: id,
                name: req.body.name,
                short_description: req.body.short_description || '',
                description: req.body.description || '',
                rating: req.body.rating || 0,
                images: req.body.images || [],
                category: req.body.category,
                new_price: req.body.new_price,
                old_price: req.body.old_price,
                discount: req.body.discount || 0,
                review_counts: req.body.review_counts || 0,
                all_time_quantity_sold: req.body.all_time_quantity_sold || 0,
                thumbnail_url: req.body.thumbnail_url || '',
                available: req.body.available !== undefined ? req.body.available : 'not available',
            });

            // Save the new product to the database
            await product.save();

            // Log the saved product for debugging purposes
            // console.log("Product saved:", product);

            // Send a response with status code 201 (Created)
            res.status(201).json({
                success: true,
                product: product,
            });
        } catch (error) {
            console.error("Error adding product:", error);

            // Send a response with status code 500 (Internal Server Error)
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

    // API for getting products by category
    async productsByCategory(req, res) {
        try {
            const category = req.params.category;
            const products = await Product.find({ "category.0": category });
            console.log(`Products fetched for category: ${category}`);
            console.log(`Total products: ${products.length}`);
            res.status(200).json(products);

            console.log("Fetched Compleletely!!!");
        } catch (error) {
            console.error(`Error fetching products for category ${category}:`, error);
            res.status(500).json({
                success: false,
                message: `Error fetching products for category ${category}`,
            });
        }
    };

    // API for searching products by category
    async searchProductsByCategory(req, res) {
        try {
            const categoryQuery = req.query.q;

            console.log("query: ", categoryQuery);

            // If categoryQuery is a single string, convert it to an array
            const categories = Array.isArray(categoryQuery) ? categoryQuery : [categoryQuery];

            console.log("Categories: ", categories);

            // Use regex to make the search case insensitive for each category
            const regexArray = categories.map(category => new RegExp(`^${category}$`, 'i'));

            console.log("regexArray: ", regexArray);

            // Find products that have any matching categories in their category array
            const products = await Product.find({
                category: { $elemMatch: { $in: regexArray } }
            });

            console.log(`Products fetched for categories: ${categories}`);
            console.log("Total fetched products: ", products.length);
            res.status(200).json(products);
        } catch (error) {
            console.error(`Error fetching products for categories ${categoryQuery}:`, error);
            res.status(500).json({
                success: false,
                message: `Error fetching products for categories ${categoryQuery}`,
            });
        }
    }


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

            // Product.find({}).limit(4)
            //     .then((products) => {
            //         res.json(products)
            //     })
            //     .catch(next);

            const products = await Product.find({ "category.0": "women" })
                .sort({ rating: -1 })
                .limit(4);

            console.log("Popular in women fetched:", products);
            res.json(products);

            console.log("Fetched Completely!!!")

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
            let products = await Product.find({}).sort({ date: -1 }).limit(4);
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

    // API for retrieving top-seller products
    async bestSellers(req, res) {
        try {
            const products = await Product.find({})
                .sort({ all_time_quantity_sold: -1 })
                .limit(4);

            console.log("Best-seller products fetched:", products);
            res.status(200).json(products);
        } catch (error) {
            console.error("Error fetching best-seller products:", error);
            res.status(500).json({
                success: false,
                message: 'Error fetching best-seller products',
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