const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    product_id: {
        type: Number,
        ref: 'Product',
        required: true,
    },
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    created_by: {
        id: {
            type: Number,
            required: true
        },
        full_name: {
            type: String,
            required: true
        }
    },
    create_at: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: String,
    },
    images: {
        type: [String],
        default: [],
    },
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
