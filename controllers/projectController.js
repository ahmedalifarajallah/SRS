const fs =require('fs');
const multer = require('multer');
const sharp = require('sharp');
const Project = require('../models/projectModel');
const { catchAsync } = require('../utils/catchAsync');
const { filterObj } = require(`../utils/filterObj`);
const AppError = require('../utils/appError');
