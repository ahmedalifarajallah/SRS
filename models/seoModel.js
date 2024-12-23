const mongoose = require('mongoose');
const seoSchema = new mongoose.Schema({
    page:{
        type:String,
        required:[true,"must has a page"],
        unique:[true,"You entered this field before"]
    },
    title_en:{
        type:String,
        required:[true,'must has a title_en']
    },
    title_ar:{
        type:String,
        required:[true,'must has a title_ar']
    },
    meta_description_en:String,
    meta_description_ar:String,
    keywords_en:[String],
    keywords_ar:[String],
    og_title_en:String,
    og_title_ar:String,
    og_description_en:String,
    og_description_ar:String,
    og_image:String
})
const Seo = mongoose.model('Seo',seoSchema);

module.exports=Seo;