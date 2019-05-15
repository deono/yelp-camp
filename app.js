const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// temp campgrounds array
var campgrounds = [
    {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8241/8577059163_1efc4d5782.jpg"},
    {name: "Granite Hill", image: "https://farm5.staticflickr.com/4134/4901707346_ec6b7d676a.jpg"},
    {name: "Mountain Goat's Rest", image: "https://farm1.staticflickr.com/82/225912054_690e32830d.jpg"}
];

// root route
app.get('/', (req, res) => {
    res.render('landing');
})

// campgrounds GET route
app.get('/campgrounds', (req, res) => {   
    // render the page
    res.render('campgrounds', {campgrounds: campgrounds});
});

// campgrounds POST route
app.post('/campgrounds', (req, res) => {    
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    // redirect back to campgrounds page
    res.redirect('/campgrounds');
});

// add new campgrounds
app.get('/campgrounds/new', (req, res) => {
    res.render('new.ejs')
});

app.listen(3000, () => {
    console.log('>>> "Yelp Camp" listening on port 3000!');
});