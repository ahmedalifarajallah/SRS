const express = require('express');
const router=express.Router();
const authController = require(`../controllers/authController`);
const mediasController = require('../controllers/mediaController');

//Protect routes
router.use(authController.protect)

router.route('/')
.post(mediasController.uploadMediasFiles,mediasController.processMediasFiles,mediasController.addMedia)
.get(mediasController.getMedias)

router.route('/:id')
.get(mediasController.getOneMedia)
//.patch(mediasController.checkMediaExists,mediasController.uploadMediasFiles,mediasController.processMediasFiles,mediasController.updateMedia)
.delete(mediasController.deleteMedia)


module.exports = router;