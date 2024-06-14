const Comment = require('../models/comment.m');
const Product = require('../models/product.m'); // Import the Product model

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

            console.log("new comment: ", newComment);

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
            console.log("comments: ", comments);
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

    // // API to delete a comment by ID
    // async deleteComment(req, res) {
    //     try {
    //         const comment = await Comment.findByIdAndDelete(req.params.id);
    //         if (!comment) {
    //             return res.status(404).json({ success: false, errors: "Comment not found" });
    //         }
    //         res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    //     } catch (error) {
    //         console.error("Error deleting comment:", error);
    //         res.status(500).json({ success: false, errors: "Error deleting comment" });
    //     }
    // }
}

module.exports = new CommentController();
