const mongoose=require('mongoose');
const counterSchema = new mongoose.Schema({
    image:{
        type:String,
        required:[true,'counter must has image']
    },
    counters:[{
        value:{
            type:Number,
            required:[true,'counters must has a value']
        },
        label:{
            type:String,
            required:[true,'counters must have labels']
        },
        label_ar:{
            type:String,
            required:[true,'counters must have labels_ar']
        },
    }]

},{
    timestamps:true
}) 

counterSchema.pre(/^find/, function (next) {
    this.select('-__v')
    next();
  })


const Counter = mongoose.model('Counter',counterSchema);

module.exports=Counter;