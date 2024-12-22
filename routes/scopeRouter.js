const express = require('express');
const router=express.Router();
const authController = require(`../controllers/authController`);
const scopesController = require('../controllers/scopeController');

//Protect routes
router.use(authController.protect)

router.route('/')
.post(scopesController.uploadScopesImages,scopesController.resizeScopesImages,scopesController.addScope)
.get(scopesController.getScopes)

router.route('/:id')
.get(scopesController.getOneScope)
.patch(scopesController.checkScopeExists,scopesController.uploadScopesImages,scopesController.resizeScopesImages,scopesController.updateScope)
.delete(scopesController.deleteScope)


module.exports = router;