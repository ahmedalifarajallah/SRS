const express = require('express');
const router=express.Router();
const authController = require(`../controllers/authController`);
const slideController = require('../controllers/slideController');

//Protect routes
router.use(authController.protect)

router.route('/')
.post(slideController.uploadSlideImage,slideController.resizeSlideImage,slideController.addSlide)
.get(slideController.getSlides)

router.route('/:id')
.get(slideController.getOneSlide)
.patch(slideController.checkSlideExists,slideController.uploadSlideImage,slideController.resizeSlideImage,slideController.updateSlide)
.delete(slideController.deleteSlide)


module.exports = router;