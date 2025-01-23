const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const Slide = require('../models/slideModel');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Multer configuration
const multerFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const multerStorage = multer.memoryStorage();


// Multer upload instance with size limit
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5 MB
    },
});

// Middleware to upload multiple types of images
exports.uploadSlideImage = upload.single('image')


exports.resizeSlideImage = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    const timestamp = Date.now();
    const id = req.user ? req.user.id : 'guest'; // Fallback if user ID isn't available

    // Get the original file extension
    const fileMetadata = await sharp(req.file.buffer).metadata();
    const fileExt = fileMetadata.format;

    // Generate the file name
    const slideFilename = `slide-${id}-${timestamp}.${fileExt}`;

    // Save the resized image
    const outputPath = `public/slides/imgs/${slideFilename}`;
    await sharp(req.file.buffer)
        .resize(2000, 1333) // Resize dimensions
        .toFile(outputPath);

    // Attach the file path to the request body
    req.body.image = `public/slides/imgs/${slideFilename}`; // Relative path for saving in DB

    next();
});





exports.addSlide = catchAsync(async (req, res, next) => {
    await Slide.create(req.body);
    res.status(201).json({
        status: true,
        message: "slide created Successfully",

    })
})

exports.getSlides = catchAsync(async (req, res, next) => {
    const {type} = req.query;
    let filter={};
    if(type) filter.type=type;
    const data = await Slide.find(filter);
    if (!data || data.length === 0) return next(new AppError(`data n't found`, 404));
    res.status(200).json({
        status: true,
        data
    })
});
exports.getOneSlide=catchAsync(async(req,res,next)=>{
    const doc = await Slide.findById(req.params.id);
    if(!doc)  return next(new AppError(`data n't found`, 404));
    res.status(200).json({
        status:true,
        data:doc
    })
})

exports.updateSlide=catchAsync(async(req,res,next)=>{
 if(req.file)  fs.unlink(`${req.slide.image}`, (err) => {});

    req.slide.set(req.body); // Update the fields of the document
    const updatedSlide = await req.slide.save(); // Save the changes
    
    res.status(200).json({
        status:true,
        message:"Slide Updated Successfully",
        doc:updatedSlide
    })
})

exports.deleteSlide=catchAsync(async(req,res,next)=>{
    const doc = await Slide.findById(req.params.id);


    if (!doc) return next(new AppError('Data not found', 404));
    fs.unlink(`${doc.image}`, (err) => {console.log("error of removing image",err)});

  await  doc.deleteOne();
  res.status(200).json({
    status:true,
    message:"Slide deleted Successfully"
  })
})

exports.checkSlideExists = async (req, res, next) => {
    const doc = await Slide.findById(req.params.id);
    if (!doc) {
      return next(
        new AppError('Data Not Found', 404)
      );
    }
    req.slide=doc;
    next();
  };
  
  