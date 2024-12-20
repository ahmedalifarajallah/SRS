const mongoose =require('mongoose');
const valuesSectionSchema = new mongoose.Schema({
    title:{
        type:String,
        minlength:[3,'must enter atlease 3 characters'],
        required:[true,'value Section must has title']
    },
    title_ar:{
        type:String,
        minlength:[3,'must enter atlease 3 characters'],
        required:[true,'value Section must has title_ar']
    },
    description:{
        type:String,
        minlength:[3,'must enter atlease 3 characters'],
        required:[true,'value Section must has description']
    },
    description_ar:{
        type:String,
        minlength:[3,'must enter atlease 3 characters'],
        required:[true,'value Section must has description_ar']
    },
    link: {
        type: String,
        required: [true, 'The link value is required'],
        validate: {
          validator: function (v) {
            // Regular expression to validate a URL
            return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
          },
          message: (props) => `${props.value} is not a valid URL!`,
        },
      },
      images:{
        main:{
            type:String,
            required:[true,"must have a main image"]
        },
        rotate:{
            type:String,
            required:[true,"must have a rotate image"]
        }
      },
      published:{
        type:Boolean,
        default:false
      }

    })

const ValuesSection = mongoose.model('ValuesSection',valuesSectionSchema);

module.exports=ValuesSection;