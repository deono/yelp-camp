//import mongoose
const mongoose = require('mongoose');
// import Campgound model
const Campground = require('./models/campground');
// import Comment model
const Comment = require ('./models/comment');

//seed data array
const data = [
    {
        name: "Cloud's Rest",
        image: "https://farm8.staticflickr.com/7196/6784772714_d3c50bfc9e.jpg",
        description: "Space, the final frontier. These are the voyages of the Starship Enterprise. Its five-year mission: to explore strange new worlds, to seek out new life and new civilizations, to boldly go where no man has gone before."
    },
    {
        name: "Misty Lakes",
        image: "https://farm5.staticflickr.com/4080/4938516049_eef5cbc734.jpg",
        description: "Many say exploration is part of our destiny, but it’s actually our duty to future generations and their quest to ensure the survival of the human species."
    },
    {
        name: "Salmon Creek",
        image: "https://farm2.staticflickr.com/1274/4670974422_ec49d65ab2.jpg",
        description: "A flower in my garden, a mystery in my panties. Heart attack never stopped old Big Bear. I didn't even know we were calling him Big Bear."
    },
    {
        name: "Wild Waters",
        image: "https://farm2.staticflickr.com/1220/742933311_67a6793525.jpg",
        description: "Half-cab camel back ollie transition ledge Wes Humpston 1080. Carve casper switch kickturn late downhill. Hardware nosebone Rick McCrank bluntslide bigspin steps egg plant."
    }
];

function seedDB() {
    // delete all campgrounds
    Campground.deleteMany({}, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('removed campgrounds');
            // add a few campgrounds
            data.forEach((seed) => { // loop through data 
                Campground.create(seed, (err, campground) => { // create campground
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Added a campground');
                        //create comment on each camground
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet!!!",
                                author: "Homer"
                            }, (err, comment) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    // add comments
                                    campground.comments.push(comment);
                                    // save data
                                    campground.save();
                                    console.log('Created new comment');
                                }
                            });
                    }
                });
            });
        }
    });
}

// export seedDB function
module.exports = seedDB;