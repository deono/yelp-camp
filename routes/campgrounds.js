// routes/campgrounds.js
const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
// ==================================================================================
// CAMPGROUND ROUTES ================================================================
// ==================================================================================

// INDEX route
// Display all campgrounds
router.get('/campgrounds', (req, res) => {   
    // get all campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(`Error finding campgrounds: ${err}`);
        } else {            
            //send all results to the campgrounds route
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
        }
    });
});

// CREATE route
// Add a new campground to DB
router.post('/campgrounds', isLoggedIn, (req, res) => {    
    // get data from form 
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {
        name: name,
        image: image,
        description: desc,
        author: author
    };
    // create new campground and save to database
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            // redirect back to campgrounds page
            res.redirect('/campgrounds');
        }
    })
});

// NEW route
// display form to make new campground
router.get('/campgrounds/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// SHOW route
router.get('/campgrounds/:id', (req, res) => {
    // find campground with provided id
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render('campgrounds/show', {campground: foundCampground});
        }
    })
});

// MIDDLEWARE - check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;