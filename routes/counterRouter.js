const express = require('express');
const router=express.Router();
const authController = require(`../controllers/authController`);
const counterController = require('../controllers/counterController');


//Protect routes
router.use(authController.protect)

router.route('/')
.post(counterController.uploadCounterImage,counterController.resizeCounterImage,counterController.addCounter)
.get(counterController.getCounters)

router.route('/:id')
.get(counterController.getOneCounter)
.patch(counterController.checkCounterExists,counterController.uploadCounterImage,counterController.resizeCounterImage,counterController.updateCounter)
.delete(counterController.deleteCounter)


module.exports = router;