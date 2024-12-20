const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    title_ar: { type: String, required: true },
    image: { type: String, required: true },
    publish: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    type: { type: String, required: true, enum: ['MainCarousel', 'ClientCarousel'] }, // Discriminator key
  },
  { discriminatorKey: 'type', timestamps: true }
);
slideSchema.index({ type: 1, publish: 1 });

const Slide = mongoose.model('Slide', slideSchema);

const MainCarousel = Slide.discriminator(
  'MainCarousel',
  new mongoose.Schema({
    description: { type: String, required: true },
    description_ar: { type: String, required: true },
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
  })
);

const ClientCarousel = Slide.discriminator(
  'ClientCarousel',
  new mongoose.Schema({})
);

module.exports = Slide,MainCarousel,ClientCarousel;