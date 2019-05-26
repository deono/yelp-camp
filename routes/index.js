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
    res.render('register');
});

// hande signup logic
router.post('/register', (req, res) => {
    var newUser = new User({ username : req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds');
        });
    });
});

// LOGIN ROUTES 
// SHOW login form
router.get('/login', (req, res) => {
    res.render('login');
});
// handle login logic
router.post('/login', passport.authenticate('local', 
{   
    successRedirect : '/campgrounds', 
    failureRedirect : '/login'
}), (req, res) => {
    // do stuff
});

// LOGOUT ROUTE
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
});

// MIDDLEWARE - check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;