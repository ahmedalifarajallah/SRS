const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const Seo = require('../models/seoModel');
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
exports.uploadSeoImage = upload.single('og_image')


exports.resizeSeoImage = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    const timestamp = Date.now();
    const id = req.user ? req.user.id : 'guest'; // Fallback if user ID isn't available

    // Get the original file extension
    const fileMetadata = await sharp(req.file.buffer).metadata();
    const fileExt = fileMetadata.format;

    // Generate the file name
    const seoFilename = `seo-${id}-${timestamp}.${fileExt}`;

    // Save the resized image
    const outputPath = `public/seos/imgs/${seoFilename}`;
    await sharp(req.file.buffer)
        .resize(2000, 1333) // Resize dimensions
        .toFile(outputPath);

    // Attach the file path to the request body
    req.body.og_image = `public/seos/imgs/${seoFilename}`; // Relative path for saving in DB

    next();
});



exports.addSeo = catchAsync(async (req, res, next) => {
   const doc= await Seo.create(req.body);
    res.status(201).json({
        status: true,
        message: "seo created Successfully",
        data:doc
    })
})

exports.getSeos = catchAsync(async (req, res, next) => {
    const data = await Seo.find().sort('-createdAt');
    if (!data || data.length === 0) return next(new AppError(`data n't found`, 404));
    res.status(200).json({
        status: true,
        data
    })
});
/*
exports.getOneSeo=catchAsync(async(req,res,next)=>{
    const doc = await Seo.findById(req.params.id);
    if(!doc)  return next(new AppError(`data n't found`, 404));
    res.status(200).json({
        status:true,
        data:doc
    })
})
    */
exports.getSeoByPage=catchAsync(async(req,res,next)=>{
    const doc = await Seo.findOne({page:req.params.page});
    if(!doc)  return next(new AppError(`data n't found`, 404));
    res.status(200).json({
        status:true,
        data:doc
    })
})


exports.updateSeo=catchAsync(async(req,res,next)=>{
 if(req.file)  fs.unlink(`${req.seo.og_image}`, (err) => {});

    req.seo.set(req.body); // Update the fields of the document
    const updatedSeo = await req.seo.save(); // Save the changes
    
    res.status(200).json({
        status:true,
        message:"Seo Updated Successfully",
        doc:updatedSeo
    })
})

exports.deleteSeo=catchAsync(async(req,res,next)=>{
    const doc = await Seo.findOne({page:req.params.page});

    if (!doc) return next(new AppError('Data not found', 404));
    fs.unlink(`${doc.og_image}`, (err) => {console.log("error of removing og_image",err)});

  await  doc.deleteOne();
  res.status(200).json({
    status:true,
    message:"Seo deleted Successfully"
  })
})

exports.checkSeoExists = async (req, res, next) => {
    const doc = await Seo.findOne({page:req.params.page});
    if (!doc) {
      return next(
        new AppError('Data Not Found', 404)
      );
    }
    req.seo=doc;
    next();
  };
  
  