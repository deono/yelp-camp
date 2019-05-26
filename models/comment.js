// models/comment.js

// import mongoose
const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
});

// compile model and export
module.exports  = mongoose.model('Comment', commentSchema);