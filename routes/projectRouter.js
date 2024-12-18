const express = require('express');
const router=express.Router();
const authController = require(`../controllers/authController`);
const projectController = require('../controllers/projectController');


//Protect routes
router.use(authController.protect)

router.route('/')
.post(projectController.uploadProjectsImages,projectController.resizeProjectsImages,projectController.AddProject)
.get(projectController.getProjects)

router.route('/:id')
.get(projectController.getOneProject)
.patch(projectController.checkProjectExists,projectController.uploadProjectsImages,projectController.resizeProjectsImages,projectController.updateProject)
.delete(projectController.deleteProject)


module.exports = router;