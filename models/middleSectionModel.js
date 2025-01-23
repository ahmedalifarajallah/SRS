const mongoose = require("mongoose");
const middleSectionSchema = new mongoose.Schema(
  {
    backgroundImg: {
      type: String,
      required: [true, "middle Section must have backgroundImg"],
    },
    titleOne: {
      type: String,
      required: [true, "middle Section must have titleOne"],
    },
    titleTwo: {
      type: String,
      required: [true, "middle Section must have titleTwo"],
    },
    titleOne_ar: {
      type: String,
      required: [true, "middle Section must have titleOne in arabic"],
    },
    titleTwo_ar: {
      type: String,
      required: [true, "middle Section must have titleTwo in arabic"],
    },
  },
  {
    timestamps: true,
  }
);

middleSectionSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});
const MiddleSection = mongoose.model("MiddleSection", middleSectionSchema);

module.exports = MiddleSection;
