// models/campground.js

// import mongoose
const mongoose = require('mongoose');

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    location: String,
    lat: Number,
    lng: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

// Compile shcema into model and export
module.exports = mongoose.model("Campground", campgroundSchema);