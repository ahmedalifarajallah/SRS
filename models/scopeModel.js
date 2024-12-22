const mongoose = require('mongoose');
const slugify = require('slugify');
const scopeSchema= new mongoose.Schema({
    service:{
        type:String,
        required:[true,"scope must has a service"],
        unique: true,
    },
    service_ar:{
        type:String,
        required:[true,"scope must has a service_ar"],
        unique: true,
    },
    details:{
        type:String,
        required:[true,"scope must has a details"]
    },
    
    details_ar:{
        type:String,
        required:[true,"scope must has a details_ar"]
    },
    iconImg:{
        type:String,
        required:[true,"scope must has a details_ar"]
    },
    mainImg:{
        type:String,
        required:[true,"scope must has a details_ar"]
    },
    published:{
        type:Boolean,
        default:false
    },
    slug:{
        type:String,
        unique: true,
    },
    slug_ar:{
        type:String,
        unique: true,
    }
    
},{
    timestamps:true
})

// Middleware to generate slug and slug_ar before saving
scopeSchema.pre('save', function (next) {
    if (this.isModified('service')) {
        this.slug = slugify(this.service, { lower: true });
    }
    if (this.isModified('service_ar')) {
        this.slug_ar = slugify(this.service_ar, { lower: true });
    }
    next();
});

const Scope = mongoose.model('Scope',scopeSchema);
module.exports=Scope;