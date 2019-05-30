// routes/index.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Campground = require('../models/campground');
// ==================================================================================
// ROOT ROUTE =======================================================================
// ==================================================================================
router.get('/', (req, res) => {
    res.render('landing');
})

// ==================================================================================
// AUTHENTICATION ROUTES ============================================================
// ==================================================================================

// SIGNUP ROUTES
// SHOW register form
router.get('/register', (req, res) => {
    res.render('register', {
        page: 'register'
    });
});

// handle signup logic
router.post('/register', (req, res) => {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });

    // check secret code for admin rights
    if (req.body.adminCode === 'secret') {
        newUser.isAmin = true;
    }

    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            //console.log(err.message);
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', 'Welcome to YelpCamp, ' + user.username + ' !')
            res.redirect('/campgrounds');
        });
    });
});

// LOGIN ROUTES 
// SHOW login form
router.get('/login', (req, res) => {
    res.render('login', {
        message: req.flash('error'),
        page: 'login'
    });
});

// handle login logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res) => {
    // do stuff
});

// LOGOUT ROUTE
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/campgrounds');
});

// =====================================================================================
// USER PROFILES =======================================================================
// =====================================================================================
router.get('/users/:id', (req, res) => {
    // find the user
    User.findById(req.params.id, (err, foundUser) => {
        if (err) { // handle errors
            req.flash('error', 'User not found.');
            return res.redirect('back');
        }
        // find all posts by user
        Campground.find().where('author.id').equals(foundUser._id).exec((err, foundCampgrounds) => {
            if (err) {
                req.flash('error', 'Campgrounds not found.');
                return res.redirect('back');
            }
            // render show page with user data
            res.render('users/show', {
                user: foundUser,
                campgrounds: foundCampgrounds
            });
        });
    });
});

module.exports = router;