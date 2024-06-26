const mongoose = require('mongoose');
const Recommendation = require('../models/recommendation.m'); // Adjust path as per your file structure
const Product = require('../models/product.m'); // Adjust path as per your file structure
const User = require('../models/user.m')

class RecommendationController {

    async allRecommendations(req, res) {
        try {
            const recommendations = await Recommendation.find({});

            if (!recommendations.length) {
                return res.status(404).json({ error: 'Recommendations not found!' });
            }

            // Extract all user IDs and product IDs
            const userIds = recommendations.map(r => r.user_id);
            const productIds = recommendations.flatMap(r => r.recommended_items.map(item => item.product_id));

            // Fetch all users and products in one go
            const users = await User.find({ Id: { $in: userIds } });
            const products = await Product.find({ id: { $in: productIds } });

            // Create a map for quick lookup
            const userMap = new Map(users.map(user => [user.Id, user]));
            const productMap = new Map(products.map(product => [product.id, product]));

            // Build the response
            const results = recommendations.map(rec => {
                const user = userMap.get(rec.user_id) || { error: `User with Id ${rec.user_id} not found` };
                const recommendedItems = rec.recommended_items.map(item => {
                    const product = productMap.get(item.product_id) || { error: `Product with Id ${item.product_id} not found` };
                    return product;
                });
                return { user, recommendedItems };
            });

            res.json(results);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };


    async getRecommendations(req, res) {
        const user_id = req.body.user_id;

        try {
            // Find recommendations for the given user_id
            const recommendations = await Recommendation.findOne({ user_id });

            if (!recommendations) {
                return res.status(404).json({ error: 'Recommendations not found for this user' });
            }

            console.log("Recommendations: ", recommendations);

            // Extract the array of recommended_items from recommendations
            const recommendedItems = recommendations.recommended_items;

            console.log("Number of Items: ", recommendedItems.length);

            // Fetch product details concurrently using Promise.all
            const productPromises = recommendedItems.map(item =>
                Product.findOne({ id: item.product_id })
            );

            // Wait for all product details to be fetched
            const products = await Promise.all(productPromises);

            // Filter out null values where products were not found
            const mappedRecommendations = products.filter(product => product).map(product => ({
                id: product.id,
                name: product.name,
                new_price: product.new_price,
                old_price: product.old_price,
                discount: product.discount,
                rating: product.rating,
                thumbnail_url: product.thumbnail_url,
                short_description: product.short_description,
                description: product.description,
                review_counts: product.review_counts,
                all_time_quantity_sold: product.all_time_quantity_sold,
                available: product.available,
                images: product.images,
                category: product.category,
                date: product.date,
            }));

            // Return mapped recommendations as JSON response
            return res.status(200).json(mappedRecommendations);

        } catch (error) {
            // Handle any errors that occur during the process
            console.error("Error fetching recommendations:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new RecommendationController();
