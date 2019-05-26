// middleware/index.js

// ===================================================================
// MIDDLEWARE ========================================================
// ===================================================================

// DEPENDENCIES
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// middleware object
const middleware = {};

// METHODS
// check if logged in user owns the campground
middleware.checkCampgroundOwnership = function(req, res, next) {
    // is the user logged in?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                res.redirect('back');
            } else {
                //does the user own the campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        console.log('You need to be logged in to do that');
        res.redirect('back');
    }
}

// check if logged in user owns the comment
middleware.checkCommentOwnership = function(req, res, next) {
    // is the user logged in?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect('back');
            } else {
                //does the user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        console.log('You need to be logged in to do that');
        res.redirect('back');
    }
}

// check if user is logged in
middleware.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


module.exports = middleware;