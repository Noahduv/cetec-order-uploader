const express = require('express');
const router = express.Router();
const apiCalls = require('../middleware/apiCalls.js');
const handleOrders = require('../middleware/handleOrders.js');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

router.get('/customer', (req, res) => {
    const data = apiCalls.getCustomer('customerservice@mistymountain.com');
    //console.log(data.addresses[0].city);
    res.send("Getting Cetec Customer");
})

router.post('/placeOrder', upload.single('shopifyOrders'), (req, res) => {
    //file saved to /uploads
    try{ /*Send File to parsed and uploaded */
        const data = handleOrders.createOrder(req.file);
        res.send(data);
        
    }catch(e){
        /* Any Errors */
        console.log(' Upload Unsuccessful:', e);
    }
    
    res.send(req.file);
})

module.exports = router;