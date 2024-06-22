const mongoose = require('mongoose');

// Schema for Creating Comments
const CommentSchema = new mongoose.Schema({
    product_id: {
        // type: mongoose.Schema.Types.ObjectId, // use id from mongoDB
        type: Number, // Assuming product_id in CommentSchema is the same type as id in ProductSchema
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
        // required: true,
    },
    images: {
        type: [String],
        default: [],
    },
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
