/* 
 *  CAMPGROUNDS MODEL
 *  campground.js
 */

// import mongoose
const mongoose = require('mongoose');

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// Compile shcema into model and export
module.exports = mongoose.model("Campground", campgroundSchema);