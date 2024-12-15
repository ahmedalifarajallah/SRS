const express = require('express');
const router=express.Router();
const authController = require(`../controllers/authController`);
const newController = require('../controllers/newController');


//Protect routes
router.use(authController.protect)

router.route('/')
.post(newController.uploadNewsImages,newController.resizeNewsImages,newController.createNew)
.get(newController.getNews)

router.route('/:id')
.get(newController.getOneNew)
.delete(newController.deleteNew)
.patch(newController.uploadNewsImages,newController.resizeNewsImages,newController.updateNew)


router.use(authController.restrictTo('admin'));
router.delete('/deleteByAdmin/:id',newController.deleteNewByAdmin)
module.exports = router;