const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const ValuesSection = require("../models/valuesSectionModel");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Multer configuration
const multerFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
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
exports.uploadValuesSectionsImages = upload.fields([
  { name: "main", maxCount: 1 },
  { name: "rotate", maxCount: 1 },
]);

// Middleware to resize and retain the original format
exports.resizeValuesSectionsImages = catchAsync(async (req, res, next) => {
  if (!req.files.main && !req.files.rotate) return next();

  const timestamp = Date.now();
  const id = req.user.id; // Assuming the user ID is available from req.user.id

  req.body.images = {};

  if (req.files.main) {
    // 1) Process Main Image
    const bgMetadataMain = await sharp(req.files.main[0].buffer).metadata();
    const bgExtMain = bgMetadataMain.format; // Get the original format (e.g., png, jpeg, etc.)

    const mainFilename = `main-${id}-${timestamp}.${bgExtMain}`;

    await sharp(req.files.main[0].buffer)
      // .resize(2000, 1333) // Resize as necessary
      .toFile(`public/valuesSections/mains/${mainFilename}`);

    // Save main image URL
    req.body.images.main = `public/valuesSections/mains/${mainFilename}`;
  }

  if (req.files.rotate) {
    //2) Process Rotate Image
    const bgMetadataRotate = await sharp(req.files.rotate[0].buffer).metadata();
    const bgExtRotate = bgMetadataRotate.format; // Get the original format (e.g., png, jpeg, etc.)

    const RotateFilename = `rotate-${id}-${timestamp}.${bgExtRotate}`;

    await sharp(req.files.rotate[0].buffer)
      // .resize(2000, 1333) // Resize as necessary
      .toFile(`public/valuesSections/rotates/${RotateFilename}`);

    // Save Rotate image URL
    req.body.images.rotate = `public/valuesSections/rotates/${RotateFilename}`;
  }

  next();
});

exports.addValuesSection = catchAsync(async (req, res, next) => {
  await ValuesSection.create(req.body);
  res.status(201).json({
    status: true,
    message: "valuesSection created Successfully",
    //data:doc
  });
});

exports.getValuesSections = catchAsync(async (req, res, next) => {
  const data = await ValuesSection.find();
  if (!data || data.length === 0)
    return next(new AppError(`data n't found`, 404));
  res.status(200).json({
    status: true,
    length: data.length,
    data,
  });
});
exports.getOneValuesSection = catchAsync(async (req, res, next) => {
  const doc = await ValuesSection.findById(req.params.id);
  if (!doc) return next(new AppError(`data n't found`, 404));
  res.status(200).json({
    status: true,
    data: doc,
  });
});
//FIXME:
exports.updateValuesSection = catchAsync(async (req, res, next) => {
  if (req.files.main)
    fs.unlink(`${req.valuesSection.images.main}`, (err) => {});
  if (req.files.rotate)
    fs.unlink(`${req.valuesSection.images.rotate}`, (err) => {});

  req.valuesSection.set(req.body); // Update the fields of the document
  const updatedValuesSection = await req.valuesSection.save(); // Save the changes

  res.status(200).json({
    status: true,
    message: "ValuesSection Updated Successfully",
    doc: updatedValuesSection,
  });
});

exports.deleteValuesSection = catchAsync(async (req, res, next) => {
  const doc = await ValuesSection.findById(req.params.id);
  if (!doc) return next(new AppError("Data not found", 404));
  fs.unlink(`${doc.images.rotate}`, (err) => {});
  fs.unlink(`${doc.images.main}`, (err) => {});

  await doc.deleteOne();
  res.status(200).json({
    status: true,
    message: "ValuesSection deleted Successfully",
  });
});

exports.checkValuesSectionExists = async (req, res, next) => {
  const doc = await ValuesSection.findById(req.params.id);
  if (!doc) {
    return next(new AppError("Data Not Found", 404));
  }
  req.valuesSection = doc;
  next();
};

exports.constraint = catchAsync(async (req, res, next) => {
  const data = await ValuesSection.find();
  if (data.length >= 3)
    return next(
      new AppError(`You reach to values limit and cannot add anymore`, 401)
    );
  next();
});
