// IMPORTS
const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const Campground    = require('./models/campground');
const Comment       = require('./models/comment');
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

/*************************** 
 * COMMENT ROUTES 
 ***************************/

 // NEW route
 app.get('/campgrounds/:id/comments/new', (req, res) => {
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
 app.post('/campgrounds/:id/comments', (req, res) => {
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

app.listen(3000, () => {
    console.log('>>> "Yelp Camp" listening on port 3000!');
});