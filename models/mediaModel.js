const mongoose=require('mongoose');
const mediaSchema= new mongoose.Schema({
    title:{
        type:String,
        unique:[true,"u enter that title before"],
        required:[true,"u must enter title"]
    },
    title_ar:{
        type:String,
        unique:[true,"u enter that title_ar before"],
        required:[true,"u must enter title_ar"]
    },
    published:{
        type:Boolean,
        default:false
    },
    type:{
        type:String,
        required:[true,"type is required"],
        enum:['Image','Video']
    },
  
    },{
        discriminatorKey: 'type', timestamps: true,
        timestamps:true
})

const Media = mongoose.model('Media',mediaSchema);


     Media.discriminator(
      'Image',
      new mongoose.Schema({
        thumbnail: { type: String, required: true },
        fullImage: { type: String, required: true },
        
      })
    );
    Media.discriminator(
        'Video',
        new mongoose.Schema({
            video: { type: String, required: true },
         
          
        })
      );

module.exports=Media;
