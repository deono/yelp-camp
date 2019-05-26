// routes/comments.js
const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
// ==================================================================================
// COMMENT ROUTES ===================================================================
// ==================================================================================

 // NEW route
 router.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    // find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    });
});

// POST route
router.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
    // lookup campground by id
    Campground.findById(req.params.id, (err, campground) => {
       if (err) {
           console.log(err);
           res.redirect('/campgrounds');
       } else {
           // create new comment
           Comment.create(req.body.comment, (err, comment) => {
               if (err) {
                   console.log(err);
               } else {
                   // connect new campground to comment
                   campground.comments.push(comment);
                   // save the data
                   campground.save();
                   // redirect to campground show page
                   res.redirect('/campgrounds/' + campground._id);
               }
           });

       }
    });
});

// MIDDLEWARE - check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;