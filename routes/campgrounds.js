// routes/campgrounds.js
const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
// ==================================================================================
// CAMPGROUND ROUTES ================================================================
// ==================================================================================

// INDEX route
// Display all campgrounds
router.get('/', (req, res) => {
    // get all campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(`Error finding campgrounds: ${err}`);
        } else {
            //send all results to the campgrounds route
            res.render('campgrounds/index', {
                campgrounds: allCampgrounds
            });
        }
    });
});

// CREATE route
// Add a new campground to DB
router.post('/', isLoggedIn, (req, res) => {
    // get data from form 
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
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
            console.log(newlyCreated);
            res.redirect('/campgrounds');
        }
    });
});

// NEW route
// display form to make new campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// SHOW CAMPGROUND route
router.get('/:id', (req, res) => {
    // find campground with provided id
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render('campgrounds/show', {
                campground: foundCampground
            });
        }
    });
});

// EDIT CAMPGROUND route
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND route
router.put('/:id', checkCampgroundOwnership, (req, res) => {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            // redirect to show page
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})

// DESTROY route
router.delete('/:id', checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            res.redirect('/campgrounds');
        }
        Comment.deleteMany({
            _id: {
                $in: campgroundRemoved.comments
            }
        }, (err) => {
            if (err) {
                res.redirect('/campgrounds');
            }
            res.redirect('/campgrounds');
        });
    });
});

// ==================================================================================
// MIDDLEWARE  ======================================================================
// ==================================================================================
// check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
// check if logged in user owns the campground
function checkCampgroundOwnership(req, res, next) {
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

module.exports = router;