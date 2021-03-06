// routes/comments.js

const express = require('express');
const router = express.Router({
    mergeParams: true
});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');


// ==================================================================================
// COMMENT ROUTES ===================================================================
// ==================================================================================

// NEW COMMENTS route
router.get('/new', middleware.isLoggedIn, (req, res) => {
    // find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {
                campground: campground
            });
        }
    });
});

// CREATE COMMENTS route
router.post('/', middleware.isLoggedIn, (req, res) => {
    // lookup campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            // create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash('error', 'Something went wrong');
                    console.log(err);
                } else {
                    // add username and and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // connect new campground to comment
                    campground.comments.push(comment);
                    // save the data
                    campground.save();
                    // redirect to campground show page
                    req.flash('success', 'Successfully added comment')
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// EDIT COMMENTS route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash('error', 'Campground not found');
            return res.redirect('back');
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect('back');
            } else {
                res.render('comments/edit', {
                    campground_id: req.params.id,
                    comment: foundComment
                });
            }
        });
    });
});

// UPDATE COMMENT route
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err){
            req.flash('error', 'Comment not found');
            res.redirect('back');
        } else {
            req.flash('success', 'Comment updated');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DESTROY COMMENT route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) =>{
        if(err){
            res.redirect('back');
        } else {
            req.flash('success', 'Comment deleted');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

module.exports = router;