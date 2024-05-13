const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const cetecController = require('../controllers/cetecController.js');
const upload = multer({dest: 'uploads/', fileFilter(req, file, cb) { (!file.originalname.match(/\.(csv)$/)) ? cb(null, false) : cb(undefined, true); }});

router.post('/placeOrder', upload.single('shopifyOrders'), catchAsync(cetecController.processOrders));

module.exports = router;