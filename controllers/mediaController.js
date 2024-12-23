const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const Media = require('../models/mediaModel');
const { catchAsync } = require('../utils/catchAsync');
//const {filterObj}=require('../utils/filterObj')
const AppError = require('../utils/appError');


const multerFilter = (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const allowedVideoTypes = ['video/mp4', 'video/mkv', 'video/avi'];

    if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Invalid file type! Please upload images or videos only.', 400), false);
    }
};

const multerStorage = multer.memoryStorage();

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

// Middleware to upload two images and one video
exports.uploadMediasFiles = upload.fields([
    { name: 'fullImage', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 },
]);

exports.processMediasFiles = catchAsync(async (req, res, next) => {
    const timestamp = Date.now();
    const id = req.user.id; // Assuming the user ID is available from req.user.id

    // Process fullImage
    if (req.files.fullImage && req.body.type==='Image') {
        const fullImageMetadata = await sharp(req.files.fullImage[0].buffer).metadata();
        const fullImageExt = fullImageMetadata.format;

        const fullImageFilename = `fullImage-${id}-${timestamp}.${fullImageExt}`;

        await sharp(req.files.fullImage[0].buffer)
            .resize(2000, 1333)
            .toFile(`public/medias/fullImages/${fullImageFilename}`);

        req.body.fullImage = `public/medias/fullImages/${fullImageFilename}`;
    }

    // Process thumbnail
    if (req.files.thumbnail&& req.body.type==='Image') {
        const thumbnailMetadata = await sharp(req.files.thumbnail[0].buffer).metadata();
        const thumbnailExt = thumbnailMetadata.format;

        const thumbnailFilename = `thumbnail-${id}-${timestamp}.${thumbnailExt}`;

        await sharp(req.files.thumbnail[0].buffer)
            .resize(500, 500)
            .toFile(`public/medias/thumbnails/${thumbnailFilename}`);

        req.body.thumbnail = `public/medias/thumbnails/${thumbnailFilename}`;
    }

    // Process video
    if (req.files.video&& req.body.type==='Video') {
        const videoFilename = `video-${id}-${timestamp}.${req.files.video[0].originalname.split('.').pop()}`;

        // Save video to a public directory
        const videoPath = `public/medias/videos/${videoFilename}`;
        fs.writeFileSync(videoPath, req.files.video[0].buffer);

        req.body.video = videoPath;
    }

    next();
});

exports.addMedia = catchAsync(async (req, res, next) => {
     await Media.create(req.body);
    res.status(201).json({
        status: true,
        message: "media created Successfully",
       // data: doc

    })
})

exports.getMedias = catchAsync(async (req, res, next) => {

    const data = await Media.find().sort('-createdAt');
    if (!data || data.length === 0) return next(new AppError(`data n't found`, 404));
    res.status(200).json({
        status: true,
        length: data.length,
        data
    })
});

exports.getOneMedia = catchAsync(async (req, res, next) => {
    const doc = await Media.findById(req.params.id);
    if (!doc) return next(new AppError(`data n't found`, 404));
    res.status(200).json({
        status: true,
        data: doc
    })
})
/*
exports.updateMedia = catchAsync(async (req, res, next) => {
    if (req.files.fullImage) fs.unlink(`${req.media.fullImage}`, (err) => { });
    if (req.files.thumbnail) fs.unlink(`${req.media.thumbnail}`, (err) => { });
    if (req.files.video)     fs.unlink(`${req.media.video}`, (err) => { });

    req.media.set(req.body); // Update the fields of the document
    const updatedMedia = await req.media.save(); // Save the changes
    res.status(200).json({
        status: true,
        message: "Media Updated Successfully",
        doc: updatedMedia
    })
})
*/
exports.deleteMedia = catchAsync(async (req, res, next) => {
    const doc = await Media.findById(req.params.id);
    if (!doc) return next(new AppError('Data not found', 404));
    fs.unlink(`${doc.thumbnail}`, (err) => { });
    fs.unlink(`${doc.fullImage}`, (err) => { });
    fs.unlink(`${doc.video}`, (err) => { });
    await doc.deleteOne();
    res.status(200).json({
        status: true,
        message: "Media deleted Successfully"
    })
})

exports.checkMediaExists = async (req, res, next) => {

    const doc = await Media.findById(req.params.id);
    if (!doc) {
        return next(
            new AppError('Data Not Found', 404)
        );
    }
    
    req.media = doc;
    next();
};