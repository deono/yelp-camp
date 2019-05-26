// app.js

// DEPENDENCIES
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

const commentRoutes     = require('./routes/comments');
const campgroundRoutes  = require('./routes/campgrounds');
const authRoutes        = require('./routes/index');

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
});

// routes
app.use(authRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

// seed the database
//seedDB();

// start the server
app.listen(3000, () => {
    console.log('>>> "Yelp Camp" listening on port 3000!');
});