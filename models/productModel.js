const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, " product must has a name"],
        trim: true,
        unique: [true, 'there;s a product with the same name'],
    },
    name_ar: {
        type: String,
        required: [true, " product must has a name_ar"],
        trim: true,
        unique: [true, 'there;s a product with the same name_ar'],
    },
    description: {
        type: String,
        required: [true, " product must has a description"]
    },
    description_ar: {
        type: String,
        required: [true, " product must has a description_ar"]
    },
    images: [String],
    thumbnail: {
        type: String,
        required: [true, " product must has a thumbnail"]
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
    parentProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Self-reference
        validate: {
            validator: function (value) {
                // Ensure the product is not its own parent
                return value ? value.toString() !== this._id.toString() : true;
            },
            message: 'A product cannot be its own parent.',
        },
    },
},{
    timestamps:true
});

// Middleware to generate slug and slug_ar before saving
productSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true });
    }
    if (this.isModified('name_ar')) {
        this.slug_ar = slugify(this.name_ar, { lower: true });
    }
    next();
});

// Middleware to ensure the parent exists
productSchema.pre('save', async function (next) {
    if (this.parentProductId) {
        const parent = await mongoose.model('Product').findById(this.parentProductId);
        if (!parent) {
            return next(new Error('The specified parent product does not exist.'));
        }
    }
    next();
});



const Product = mongoose.model('Product', productSchema);

module.exports = Product;