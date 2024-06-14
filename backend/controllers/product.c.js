const { validationResult } = require('express-validator');
const Product = require('../models/product.m')
const fs = require('fs');
const path = require('path');
class ProductController {

    // API for adding or updating a product
    async addProduct(req, res) {
        try {
            // Validate request body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            // Extract product data from request body
            const {
                id,
                name,
                short_description,
                description,
                rating,
                images,
                category,
                new_price,
                old_price,
                discount,
                review_counts,
                all_time_quantity_sold,
                thumbnail_url,
                available
            } = req.body;

            // Check if a product with the same id already exists
            let existingProduct = await Product.findOne({ id });

            if (existingProduct) {
                // Merge the category arrays to include all unique categories
                const mergedCategories = Array.from(new Set([...existingProduct.category, ...category]));

                // Update the existing product with the merged categories
                existingProduct.category = mergedCategories;

                // Check if the fields match except id and category
                const fieldsMatch = (
                    existingProduct.name === name &&
                    existingProduct.short_description === short_description &&
                    existingProduct.description === description &&
                    existingProduct.rating === rating &&
                    JSON.stringify(existingProduct.images) === JSON.stringify(images) &&
                    existingProduct.new_price === new_price &&
                    existingProduct.old_price === old_price &&
                    existingProduct.discount === discount &&
                    existingProduct.review_counts === review_counts &&
                    existingProduct.all_time_quantity_sold === all_time_quantity_sold &&
                    existingProduct.thumbnail_url === thumbnail_url &&
                    existingProduct.available === available
                );

                if (fieldsMatch) {
                    await existingProduct.save();

                    return res.status(200).json({
                        success: true,
                        message: 'Product updated with merged categories',
                        product: existingProduct,
                    });
                } else {
                    // Fields are different, update the existing product with a new id
                    const latestProduct = await Product.findOne().sort({ id: -1 });
                    const newId = latestProduct ? latestProduct.id + 1 : 1;

                    existingProduct.id = newId;
                    await existingProduct.save();
                }
            } else {
                // Check if a product with the same fields but different id exists
                const duplicateProduct = await Product.findOne({
                    name,
                    short_description,
                    description,
                    rating,
                    images,
                    new_price,
                    old_price,
                    discount,
                    review_counts,
                    all_time_quantity_sold,
                    thumbnail_url,
                    available
                });

                if (duplicateProduct) {
                    // Merge the category arrays to include all unique categories
                    const mergedCategories = Array.from(new Set([...duplicateProduct.category, ...category]));

                    // Update the duplicate product with the merged categories
                    duplicateProduct.category = mergedCategories;
                    await duplicateProduct.save();

                    // Delete the duplicate product with the old id
                    await Product.deleteOne({ id });

                    return res.status(200).json({
                        success: true,
                        message: 'Duplicate product found and merged with existing product',
                        product: duplicateProduct,
                    });
                }
            }

            // Create a new product object
            const product = new Product({
                id,
                name,
                short_description: short_description || '',
                description: description || '',
                rating: rating || 0,
                images: images || [],
                category,
                new_price,
                old_price,
                discount: discount || 0,
                review_counts: review_counts || 0,
                all_time_quantity_sold: all_time_quantity_sold || 0,
                thumbnail_url: thumbnail_url || '',
                available: available !== undefined ? available : 'not available',
            });

            // Save the new product to the database
            await product.save();

            // Send a response with status code 201 (Created)
            res.status(201).json({
                success: true,
                product,
            });
        } catch (error) {
            console.error('Error adding or updating product:', error);

            // Send a response with status code 500 (Internal Server Error)
            res.status(500).json({
                success: false,
                message: 'Error adding or updating product',
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

    // API for cleaning up duplicate products
    async cleanUpProducts(req, res) {
        try {
            // Fetch all products
            let products = await Product.find({});

            // Create a map to store unique products
            let uniqueProductsMap = new Map();

            products.forEach(product => {
                // Create a unique key based on product fields (excluding 'date' and 'id')
                let uniqueKey = JSON.stringify({
                    name: product.name,
                    short_description: product.short_description,
                    description: product.description,
                    rating: product.rating,
                    images: product.images,
                    category: product.category,
                    new_price: product.new_price,
                    old_price: product.old_price,
                    discount: product.discount,
                    review_counts: product.review_counts,
                    all_time_quantity_sold: product.all_time_quantity_sold,
                    thumbnail_url: product.thumbnail_url,
                    available: product.available
                });

                // If the key doesn't exist, add the product to the map
                if (!uniqueProductsMap.has(uniqueKey)) {
                    uniqueProductsMap.set(uniqueKey, product);
                }
            });

            // Get all unique products from the map
            let uniqueProducts = Array.from(uniqueProductsMap.values());

            // Remove all products from the database
            await Product.deleteMany({});

            // Insert unique products back into the database
            await Product.insertMany(uniqueProducts);

            console.log("Duplicate products removed. Unique products count:", uniqueProducts.length);
            res.status(200).json({
                success: true,
                message: "Duplicate products removed successfully",
                uniqueProductsCount: uniqueProducts.length
            });
        } catch (error) {
            console.error("Error cleaning up products:", error);
            res.status(500).json({
                success: false,
                message: 'Error cleaning up products'
            });
        }
    };

    // API for exporting all products to a JavaScript object and writing to a file
    async exportProducts(req, res) {
        try {
            // Fetch all products
            const products = await Product.find({});

            // Create a JavaScript object to hold the products
            const productsObject = {
                products: products.map(product => ({
                    id: product.id,
                    name: product.name,
                    short_description: product.short_description,
                    description: product.description,
                    rating: product.rating,
                    images: product.images,
                    category: product.category,
                    new_price: product.new_price,
                    old_price: product.old_price,
                    discount: product.discount,
                    review_counts: product.review_counts,
                    all_time_quantity_sold: product.all_time_quantity_sold,
                    thumbnail_url: product.thumbnail_url,
                    available: product.available,
                    date: product.date
                }))
            };

            // Define the file path
            const filePath = path.join(__dirname, '/products.json');

            console.log("filepath: ", filePath);
            // Write the products object to a file
            fs.writeFile(filePath, JSON.stringify(productsObject, null, 2), (err) => {
                if (err) {
                    console.error("Error writing file:", err);
                    return res.status(500).json({
                        success: false,
                        message: 'Error exporting products to file'
                    });
                }

                console.log("Products exported successfully:", filePath);
                res.status(200).json({
                    success: true,
                    message: 'Products exported successfully',
                    filePath: filePath
                });
            });
        } catch (error) {
            console.error("Error exporting products:", error);
            res.status(500).json({
                success: false,
                message: 'Error exporting products'
            });
        }
    };
};

module.exports = new ProductController();
