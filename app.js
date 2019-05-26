// app.js

// IMPORTS
const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const passport      = require('passport');
const LocalStrategy = require('passport-local');
const Campground    = require('./models/campground');
const Comment       = require('./models/comment');
const User          = require('./models/user');
const seedDB        = require('./seeds');

// mongoose config
// fix all mongodb deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//connect to the database
mongoose.connect("mongodb://localhost/yelp_camp");

// app config
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// passport config
app.use(require('express-session')({
    secret : 'tragedy and hope',
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// pass the user object to every template
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

// seed the database
//seedDB();

// ==================================================================================
// ROUTES ============================================================
// ==================================================================================

// ROOT route
app.get('/', (req, res) => {
    res.render('landing');
})

// ==================================================================================
// CAMPGROUND ROUTES ============================================================
// ==================================================================================

// INDEX route
// Display all campgrounds
app.get('/campgrounds', (req, res) => {   
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
app.post('/campgrounds', (req, res) => {    
    // get data from form 
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
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
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// SHOW route
app.get('/campgrounds/:id', (req, res) => {
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

// ==================================================================================
// COMMENT ROUTES ============================================================
// ==================================================================================

 // NEW route
 app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
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
 app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
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

// ==================================================================================
// AUTHENTICATION ROUTES ============================================================
// ==================================================================================

// SIGNUP ROUTES
// SHOW register form
app.get('/register', (req, res) => {
    res.render('register');
});

// hande signup logic
app.post('/register', (req, res) => {
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
app.get('/login', (req, res) => {
    res.render('login');
});
// handle login logic
app.post('/login', passport.authenticate('local', 
{   
    successRedirect : '/campgrounds', 
    failureRedirect : '/login'
}), (req, res) => {
    // do stuff
});

// LOGOUT ROUTE
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
});

// check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.listen(3000, () => {
    console.log('>>> "Yelp Camp" listening on port 3000!');
});