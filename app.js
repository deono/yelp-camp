// app.js
require('dotenv').config();
// DEPENDENCIES
const express           = require('express');
const app               = express();
const bodyParser        = require('body-parser');
const mongoose          = require('mongoose');
const flash             = require('connect-flash');
const passport          = require('passport');
const LocalStrategy     = require('passport-local');
const methodOverride    = require('method-override');
const Campground        = require('./models/campground');
const Comment           = require('./models/comment');
const User              = require('./models/user');
const seedDB            = require('./seeds');

// requiring routes
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
app.use(methodOverride('_method'));
app.use(flash());
app.locals.moment = require('moment');

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
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// routes
app.use("/", authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

// seed the database
//seedDB();

// start the server
app.listen(3000, () => {
    console.log('>>> "Yelp Camp" listening on port 3000!');
});