const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const Counter = require('../models/counterModel');
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
exports.uploadCounterImage = upload.single('image')


exports.resizeCounterImage = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    const timestamp = Date.now();
    const id = req.user ? req.user.id : 'guest'; // Fallback if user ID isn't available

    // Get the original file extension
    const fileMetadata = await sharp(req.file.buffer).metadata();
    const fileExt = fileMetadata.format;

    // Generate the file name
    const counterFilename = `counter-${id}-${timestamp}.${fileExt}`;

    // Save the resized image
    const outputPath = `public/counters/imgs/${counterFilename}`;
    await sharp(req.file.buffer)
        .resize(2000, 1333) // Resize dimensions
        .toFile(outputPath);

    // Attach the file path to the request body
    req.body.image = `public/counters/imgs/${counterFilename}`; // Relative path for saving in DB

    next();
});



exports.addCounter = catchAsync(async (req, res, next) => {
        const counter = await Counter.create(req.body);
        res.status(201).json({
            status:true,
            message:"Counter created Successfully",
           // data:counter
        })
});

exports.getCounters=catchAsync(async(req,res,next)=>{
    const data= await Counter.find();
    if(!data ||data.length===0) return next(new AppError(`data n't found`,404));
    res.status(200).json({
        status:true,
        data
    })
})

exports.getOneCounter=catchAsync(async(req,res,next)=>{
    const data= await Counter.findById(req.params.id);
    if(!data||data.length===0) return next(new AppError(`data n't found`,404));
    res.status(200).json({
        status:true,
        data
    })
})

exports.updateCounter = catchAsync(async(req,res,next)=>{
    if(req.file)  fs.unlink(`${req.counter.image}`, (err) => {});

    req.counter.set(req.body); // Update the fields of the document
    const updatedCounter = await req.counter.save(); // Save the changes
    
    res.status(200).json({
        status:true,
        message:"Counter Updated Successfully",
       // doc:updatedCounter
    })
})

exports.deleteCounter= catchAsync(async(req,res,next)=>{
    const doc = await Counter.findById(req.params.id);


    if (!doc) return next(new AppError('Data not found', 404));
    fs.unlink(`${doc.image}`, (err) => {console.log("error of removing image",err)});

  await  doc.deleteOne();
  res.status(200).json({
    status:true,
    message:"Counter deleted Successfully"
  })
})

exports.checkCounterExists = async (req, res, next) => {
    const doc = await Counter.findById(req.params.id);
    if (!doc) {
      return next(
        new AppError('Data Not Found', 404)
      );
    }
    req.counter=doc;
    next();
  };
  
  