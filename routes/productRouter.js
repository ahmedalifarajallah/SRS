const express = require('express');
const router=express.Router();
const authController = require(`../controllers/authController`);
const productController = require('../controllers/productController');


//Protect routes
router.use(authController.protect)

router.route('/')
.post(productController.uploadProductsImages,productController.resizeProductsImages,productController.AddProduct)
.get(productController.getProducts)

router.route('/:id')
.get(productController.getOneProduct)
.patch(productController.checkProductExists,productController.uploadProductsImages,productController.resizeProductsImages,productController.updateProduct)
.delete(productController.deleteProduct)


module.exports = router;