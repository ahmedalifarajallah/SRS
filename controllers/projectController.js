const fs =require('fs');
const multer = require('multer');
const sharp = require('sharp');
const Project = require('../models/projectModel');
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
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });
  
  // Middleware to upload multiple types of images
  exports.uploadProjectsImages = upload.fields([
    { name: "images", maxCount: 5 },
  ]);
  
  // Middleware to resize and retain the original format
  exports.resizeProjectsImages = catchAsync(async (req, res, next) => {
    if (!req.files.images) return next();
  
    const timestamp = Date.now();
    const id = req.user.id; // Assuming the user ID is available from req.user.id
  

    // 2) Process Additional Images
    req.body.images = await Promise.all(
      req.files.images.map(async (file, i) => {
        const fileMetadata = await sharp(file.buffer).metadata();
        const fileExt = fileMetadata.format; // Get the original format (e.g., png, jpeg, etc.)
        const filename = `project-${id}-${timestamp}-${i + 1}.${fileExt}`;
  
        await sharp(file.buffer)
          .resize(2000, 1333) // Resize as necessary
          .toFile(`public/projects/imgs/${filename}`);
  
        // Return the image URL
        return `public/projects/imgs/${filename}`;
      })
    );
  
    next();
  });
  
  
exports.AddProject=catchAsync(async(req,res,next)=>{
    const data = await Project.create(req.body);
    res.status(201).json({
        status:true,
        message:"project created Successfully",
        data
    })
});

exports.getProjects=catchAsync(async(req,res,next)=>{
    const data = await Project.find();
    if(!data||data.length===0) return next(new AppError(`data n't found`,404));
    res.status(200).json({
        status:true,
        data
    })
});

exports.getOneProject=catchAsync(async(req,res,next)=>{
    const data = await Project.findById(req.params.id);
    if(!data) return next(new AppError(`data n't found`,404));
    res.status(200).json({
        status:true,
        data
    })
})

exports.updateProject=catchAsync(async(req,res,next)=>{
    if(req.files.images)  req.project.images.map(image=>{fs.unlink(`${image}`, (err) => {console.log("error of removing images",err)});})

        req.project.set(req.body); // Update the fields of the document
        const updatedProject = await req.project.save(); // Save the changes

    res.status(200).json({
        status:true,
        message:"project updated successfully",
        data:updatedProject
    })

})

exports.deleteProject= catchAsync(async(req,res,next)=>{
    const doc = await Project.findById(req.params.id);

  
    doc.images.map(image=>{
      fs.unlink(`${image}`, (err) => {console.log("error of removing images",err)});
    })

  await  doc.deleteOne();
  res.status(200).json({
    status:true,
    message:"Project deleted Successfully"
  })
})

exports.checkProjectExists = async (req, res, next) => {
    const doc = await Project.findById(req.params.id);
    if (!doc) {
      return next(
        new AppError('Data Not Found', 404)
      );
    }
    req.project=doc;
    next();
  };
  