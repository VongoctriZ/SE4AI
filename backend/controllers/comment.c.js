const User = require('../models/user.m')
const Comment = require('../models/comment.m');
const Product = require('../models/product.m');

class CommentController {

    // API for creating a comment
    async createComment(req, res) {
        try {
            const { id, product_id, rating, created_by, content, images } = req.body;

            // Validate required fields
            if (!product_id || !rating || !created_by || !content) {
                return res.status(400).json({ success: false, errors: "Product ID, rating, created by, and content are required" });
            }

            // Check if the product exists
            const productExists = await Product.findOne({ id: product_id });
            if (!productExists) {
                return res.status(404).json({ success: false, errors: "Product not found" });
            }

            // Extract paths from images
            const imagePaths = images ? images.map(image => image.full_path) : [];

            // Generate a new ID for the comment if not provided
            let newId = id;
            if (!newId) {
                const latestComment = await Comment.find({}).sort({ id: -1 }).limit(1);
                newId = latestComment.length > 0 ? latestComment[0].id + 1 : 1;
            }

            // Create new comment
            const newComment = new Comment({
                id: newId,
                product_id,
                rating,
                created_by,
                content,
                images: imagePaths
            });


            await newComment.save();

            res.status(201).json({ success: true, message: 'Comment created successfully', comment: newComment });
        } catch (error) {
            console.error("Error creating comment:", error);
            res.status(500).json({ success: false, errors: "Error creating comment" });
        }
    }


    async getAllComments(req, res) {
        try {
            const comments = await Comment.find();
            res.status(200).json(comments);
        } catch (error) {
            console.error("Error fetching comments:", error);
            res.status(500).json({ success: false, errors: "Error fetching comments" });
        }
    }

    async getCommentById(req, res) {
        try {
            const comment = await Comment.findById(req.params.id);
            if (!comment) {
                return res.status(404).json({ success: false, errors: "Comment not found" });
            }
            res.status(200).json(comment);
        } catch (error) {
            console.error("Error finding comment:", error);
            res.status(500).json({ success: false, errors: "Error finding comment" });
        }
    }

    async updateComment(req, res) {
        try {
            const { product_id, rating, created_by, content, images } = req.body;

            const comment = await Comment.findByIdAndUpdate(req.params.id, {
                product_id,
                rating,
                created_by,
                content,
                images
            }, { new: true });

            if (!comment) {
                return res.status(404).json({ success: false, errors: "Comment not found" });
            }

            res.status(200).json({ success: true, message: 'Comment updated successfully', comment });
        } catch (error) {
            console.error("Error updating comment:", error);
            res.status(500).json({ success: false, errors: "Error updating comment" });
        }
    }

    async deleteComment(req, res) {
        try {
            const comment = await Comment.findByIdAndDelete(req.params.id);
            if (!comment) {
                return res.status(404).json({ success: false, errors: "Comment not found" });
            }
            res.status(200).json({ success: true, message: 'Comment deleted successfully' });
        } catch (error) {
            console.error("Error deleting comment:", error);
            res.status(500).json({ success: false, errors: "Error deleting comment" });
        }
    }

    // Clean up comments of not found users by Id
    async cleanUp(req, res) {
        try {
            // Find all users and retrieve their Ids
            const users = await User.find({});

            // Extract user Ids from the users array
            const userIds = users.map(user => user.Id);

            // Clean up comments where user Id is not found in the userIds array
            const cleanupResult = await Comment.deleteMany({ 'created_by.id': { $nin: userIds } });

            res.status(200).json({
                success: true,
                message: `Clean up completed successfully. ${cleanupResult.deletedCount} comments removed.`,
            });
        } catch (error) {
            console.error('Error cleaning up comments:', error);
            res.status(500).json({ success: false, message: 'Error cleaning up comments' });
        }
    }

    async removeDuplicateComments(req, res) {
        try {
            // Aggregate to find duplicates based on productId and created_by
            const duplicates = await Comment.aggregate([
                {
                    $group: {
                        _id: {
                            productId: "$product_id",
                            createdBy: "$created_by"
                        },
                        count: { $sum: 1 },
                        ids: { $push: "$_id" }
                    }
                },
                {
                    $match: {
                        count: { $gt: 1 }
                    }
                }
            ]);

            console.log("Duplicates found:", duplicates.length);

            // Flatten the ids array and remove the first id of each group
            const idsToDelete = duplicates.flatMap(group => group.ids.slice(1));

            if (idsToDelete.length > 0) {
                // Delete the duplicate comments
                const deleteResult = await Comment.deleteMany({ _id: { $in: idsToDelete } });

                res.status(200).json({
                    success: true,
                    message: `Duplicates removed successfully. ${deleteResult.deletedCount} comments removed.`,
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: 'No duplicate comments found.'
                });
            }
        } catch (error) {
            console.error('Error removing duplicate comments:', error);
            res.status(500).json({ success: false, message: 'Error removing duplicate comments' });
        }
    };

    // Method to update product review counts
    async updateReviewCounts(req, res) {
        try {
            // Fetch all products
            const products = await Product.find({});

            // Iterate over each product
            for (const product of products) {
                // Count the number of comments for the current product
                const commentCount = await Comment.countDocuments({ product_id: product.id });

                // Update the product's review count
                await Product.findByIdAndUpdate(product._id, { review_counts: commentCount }, { new: true });
            }

            res.status(200).json({ success: true, message: 'Review counts updated successfully' });
        } catch (error) {
            console.error('Error updating review counts:', error);
            res.status(500).json({ success: false, message: 'Error updating review counts' });
        }
    };



}

module.exports = new CommentController();
