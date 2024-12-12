const express = require('express');
const router = express.Router();
const authController = require(`../controllers/authController`)


router.post('/signUp', authController.SignUp);
router.post('/login', authController.login);





module.exports = router;