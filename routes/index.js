// routes/index.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

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

// hande signup logic
router.post('/register', (req, res) => {
    var newUser = new User({
        username: req.body.username
    });
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

module.exports = router;