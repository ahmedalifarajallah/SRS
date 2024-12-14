const mongoose = require('mongoose');

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
    /*
    date:{
        type:Date,
        default:Date.now()
    }
    */
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
    
},{
    timestamps: true,
    // toJSON: { virtuals: true },
    //  toObject: { virtuals: true },
  })




newSchema.pre(/^find/, function (next) {
    this.populate('author').select('-__v')
    next();
  })

const New = mongoose.model('New',newSchema);

module.exports=New;