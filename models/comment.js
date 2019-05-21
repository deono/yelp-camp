/* 
 *  COMMENT MODEL
 *  comment.js
 */

// import mongoose
const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    text: String,
    author: String
});

// compile model and export
module.exports  = mongoose.model('Comment', commentSchema);