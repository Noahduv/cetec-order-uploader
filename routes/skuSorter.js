const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const cetecController = require('../controllers/skuSorter.js');

router.get('/', (req, res) =>{
    const splitSku = {}
    res.render('skuSorter', {splitSku});
});

router.post('/', catchAsync(cetecController.splitSKU));


module.exports = router;