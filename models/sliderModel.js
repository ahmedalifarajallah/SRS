const mongoose = require('mongoose');
const MainCarousel = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'MainCarousel must has title']
    }
})