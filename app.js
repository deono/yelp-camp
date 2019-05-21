// IMPORTS
const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const Campground    = require('./models/campground');
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

// seed the database
//seedDB();

// ROOT route
app.get('/', (req, res) => {
    res.render('landing');
})

// INDEX route
// Display all campgrounds
app.get('/campgrounds', (req, res) => {   
    // get all campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(`Error finding campgrounds: ${err}`);
        } else {            
            //send all results to the campgrounds route
            res.render('index', {campgrounds: allCampgrounds});
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
    res.render('new.ejs')
});

// SHOW route
app.get('/campgrounds/:id', (req, res) => {
    // find campground with provided id
    Campground.findById(req.params.id).populate('comments').exec( (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render('show', {campground: foundCampground});
        }
    })
});

app.listen(3000, () => {
    console.log('>>> "Yelp Camp" listening on port 3000!');
});