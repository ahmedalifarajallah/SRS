const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const Scope = require("../models/scopeModel");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Multer configuration
const multerFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const multerStorage = multer.memoryStorage();
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Middleware to upload multiple types of images
exports.uploadScopesImages = upload.fields([
  { name: "mainImg", maxCount: 1 },
  { name: "iconImg", maxCount: 1 },
]);

// Middleware to resize and retain the original format
exports.resizeScopesImages = catchAsync(async (req, res, next) => {
  if (!req.files.mainImg && !req.files.iconImg) return next();

  const timestamp = Date.now();
  const id = req.user.id; // Assuming the user ID is available from req.user.id

  if (req.files.mainImg) {
    // 1) Process MainImg Image
    const bgMetadataMainImg = await sharp(
      req.files.mainImg[0].buffer
    ).metadata();
    const bgExtMainImg = bgMetadataMainImg.format; // Get the original format (e.g., png, jpeg, etc.)

    const mainImgFilename = `mainImg-${id}-${timestamp}.${bgExtMainImg}`;

    await sharp(req.files.mainImg[0].buffer)
      .resize(2000, 1333) // Resize as necessary
      .toFile(`public/scopes/mainImgs/${mainImgFilename}`);

    // Save mainImg image URL
    req.body.mainImg = `public/scopes/mainImgs/${mainImgFilename}`;
  }

  if (req.files.iconImg) {
    //2) Process IconImg Image
    const bgMetadataIconImg = await sharp(
      req.files.iconImg[0].buffer
    ).metadata();
    const bgExtIconImg = bgMetadataIconImg.format; // Get the original format (e.g., png, jpeg, etc.)

    const IconImgFilename = `iconImg-${id}-${timestamp}.${bgExtIconImg}`;

    await sharp(req.files.iconImg[0].buffer)
      .resize(200, 200) // Resize as necessary
      .toFile(`public/scopes/iconImgs/${IconImgFilename}`);

    // Save IconImg image URL
    req.body.iconImg = `public/scopes/iconImgs/${IconImgFilename}`;
  }

  next();
});

exports.addScope = catchAsync(async (req, res, next) => {
  await Scope.create(req.body);
  res.status(201).json({
    status: true,
    message: "scope created Successfully",
    // data:doc
  });
});

exports.getScopes = catchAsync(async (req, res, next) => {
  const data = await Scope.find();
  if (!data || data.length === 0)
    return next(new AppError(`data n't found`, 404));
  res.status(200).json({
    status: true,
    length: data.length,
    data,
  });
});
exports.getOneScope = catchAsync(async (req, res, next) => {
  const doc = await Scope.findById(req.params.id);
  if (!doc) return next(new AppError(`data n't found`, 404));
  res.status(200).json({
    status: true,
    data: doc,
  });
});

exports.updateScope = catchAsync(async (req, res, next) => {
  if (req.files.mainImg) fs.unlink(`${req.scope.mainImg}`, (err) => {});
  if (req.files.iconImg) fs.unlink(`${req.scope.iconImg}`, (err) => {});

  req.scope.set(req.body); // Update the fields of the document
  const updatedScope = await req.scope.save(); // Save the changes

  res.status(200).json({
    status: true,
    message: "Scope Updated Successfully",
    doc: updatedScope,
  });
});

exports.deleteScope = catchAsync(async (req, res, next) => {
  const doc = await Scope.findById(req.params.id);
  if (!doc) return next(new AppError("Data not found", 404));
  fs.unlink(`${doc.iconImg}`, (err) => {});
  fs.unlink(`${doc.mainImg}`, (err) => {});

  await doc.deleteOne();
  res.status(200).json({
    status: true,
    message: "Scope deleted Successfully",
  });
});

exports.checkScopeExists = async (req, res, next) => {
  const doc = await Scope.findById(req.params.id);
  if (!doc) {
    return next(new AppError("Data Not Found", 404));
  }
  req.scope = doc;
  next();
};
