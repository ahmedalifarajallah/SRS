const mongoose = require('mongoose');
const slugify = require('slugify');
const newSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'neew must has a title'],
        trim: true
    },
    title_ar: {
        type: String,
        required: [true, 'new must has ar title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'new must has ar description'],
        trim: true
    },
    description_ar: {
        type: String,
        required: [true, 'new must has ar description'],
        trim: true
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "new must has a author"]

    },
    
    images: [{
        type: String,
        required: [true, 'new must has an images']
    }],
    thumbnail:{
        type: String,
        required: [true, 'new must has an images']
    },
    published: {
        type: Boolean,
        default: false
    },    
    slug: {
        type: String,
        unique: true,
    },
    slug_ar: {
        type: String,
        unique: true,
    },
    date:{
        type:Date,
        default:Date.now()
    }
    
},{
    timestamps: true,
   })



// Middleware to generate slug and slug_ar before saving
newSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true });
    }
    if (this.isModified('title_ar')) {
        this.slug_ar = slugify(this.title_ar, { lower: true });
    }
    next();
});

newSchema.pre(/^find/, function (next) {
    this.populate('author').select('-__v')
    next();
  })

const New = mongoose.model('New',newSchema);

module.exports=New;