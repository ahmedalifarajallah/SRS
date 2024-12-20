const express = require('express');
const router=express.Router();
const authController = require(`../controllers/authController`);
const middleSectionController = require('../controllers/middleSectionController');

//Protect routes
router.use(authController.protect)

router.route('/')
.post(middleSectionController.uploadMiddleSectionImage,middleSectionController.resizeMiddleSectionImage,middleSectionController.addMiddleSection)
.get(middleSectionController.getMids)

router.route('/:id')
.get(middleSectionController.getOneMiddleSection)
.patch(middleSectionController.checkMiddleSectionExists,middleSectionController.uploadMiddleSectionImage,middleSectionController.resizeMiddleSectionImage,middleSectionController.updateMiddleSection)
.delete(middleSectionController.deleteMiddleSection)


module.exports = router;