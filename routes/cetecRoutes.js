const express = require('express');
const router = express.Router();
const apiCalls = require('../middleware/apiCalls');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

router.get('/customer', (req, res) => {
    const data = apiCalls.getCustomer('customerservice@mistymountain.com');
    console.log(data);
    res.send("Getting CETEC Customer");
})

router.post('/placeOrder', upload.single('shopifyOrders'), (req, res) => {
    res.send(req.file);
})

module.exports = router;