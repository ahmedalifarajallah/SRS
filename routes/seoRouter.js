const express = require('express');
const router=express.Router();
const authController = require(`../controllers/authController`);
const seoController = require('../controllers/seoController');

//Protect routes
router.use(authController.protect)

router.route('/')
.post(seoController.uploadSeoImage,seoController.resizeSeoImage,seoController.addSeo)
.get(seoController.getSeos)

router.get('/:id',seoController.getSeos);

router.route('/:page')
.get(seoController.getSeoByPage)
.delete(seoController.deleteSeo)
.patch(seoController.checkSeoExists,seoController.uploadSeoImage,seoController.resizeSeoImage,seoController.updateSeo)


module.exports = router;