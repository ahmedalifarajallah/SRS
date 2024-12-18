const mongoose = require('mongoose');
const slugify = require('slugify');
const projectSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'project must have title']
    },
    title_ar:{
        type:String,
        required:[true,'project must have title_ar']
    },
    description:{
        type:String,
        required:[true,'project must have description']
    },
    description_ar:{
        type:String,
        required:[true,'project must have description_ar ']
    },
    client:{
        type:String,
        required:[true,'project must have client']
    },
    client_ar:{
        type:String,
        required:[true,'project must have client']
    },
    location:String,
    location_ar:String,
    startDate:{
        type:Date,
        default:Date.now(),
    },
    endDate:{
        type:Date,
        required:[true,'project must have endDate']
    },
    images:[String],
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Self-reference
        required:[true,'project must have category']
    },
    status:{
        type:String,
        enum:["pending", "in progress", "completed"], 
        required:[true,'project must have state']
    },
    published: { type: Boolean, default: false }, 
    projectProgress: { type: Number, min: 0, max: 100, required: [true,'must has projectProgress'] }, 
    
})

// Middleware to generate slug and slug_ar before saving
projectSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true });
    }
    if (this.isModified('title_ar')) {
        this.slug_ar = slugify(this.title_ar, { lower: true });
    }
    next();
});
//populate category => product_Id
projectSchema.pre(/^find/,function(next){
    this.populate('category').select('-__v');
    next();
})

const Project = mongoose.model('Project',projectSchema);

module.exports = Project;