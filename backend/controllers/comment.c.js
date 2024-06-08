const Comment = require('../models/comment.m');

class CommentController {

    async createComment(req, res) {
        try {
            const { product_id, rating, created_by, content, images } = req.body;

            // Validate required fields
            if (!product_id || !rating || !created_by || !content) {
                return res.status(400).json({ success: false, errors: "Product ID, rating, created by, and content are required" });
            }

            // Create new comment
            const newComment = new Comment({
                product_id,
                rating,
                created_by,
                content,
                images
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
}

module.exports = new CommentController();