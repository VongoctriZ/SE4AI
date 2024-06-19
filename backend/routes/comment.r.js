const express = require('express');
const router = express.Router();

const commentController = require('../controllers/comment.c');
const fetchUser = require('../middleware/fetch-user');

// Routes for handling comments

// Create a new comment
router.post('/create', commentController.createComment);

// Get all comments
router.get('/allcomments', commentController.getAllComments);

// Get a comment by ID
router.get('/:id', commentController.getCommentById);

// Update a comment
router.put('/:id', fetchUser, commentController.updateComment);

// Delete a comment
router.delete('/:id', fetchUser, commentController.deleteComment);

// Clean up comments of not found users
router.post('/cleanup', commentController.cleanUp);

// Route to update product review counts
router.post('/update-review-counts', commentController.updateReviewCounts);

module.exports = router;