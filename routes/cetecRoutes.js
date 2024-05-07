const express = require('express');
const router = express.Router();
const apiCalls = require('../middleware/apiCalls.js');
const handleOrders = require('../middleware/handleOrders.js');
const multer = require('multer');
const upload = multer({dest: 'uploads/', fileFilter(req, file, cb) { (!file.originalname.match(/\.(csv)$/)) ? cb(null, false) : cb(undefined, true); }});

router.get('/customer', (req, res) => {
    const data = apiCalls.getCustomer('customerservice@mistymountain.com');
    //console.log(data.addresses[0].city);
    res.send("Getting Cetec Customer");
})

router.post('/placeOrder', upload.single('shopifyOrders'), async (req, res) => {
    if(req.file)
    {   //Send File to parsed and uploaded 
        try{ 
        const data = await handleOrders.createOrder(req.file);
        if(data == -1){
            req.flash('error', 'An error occured when uploading');
        }
        else{
            req.flash('success', `Successfully placed orders: ${data}`);
        }
        
        }catch(e){
        // Any Errors 
        req.flash('error', 'An error occured when uploading');
         } 
    }
    else{
        req.flash('error', 'Error: File is not a .csv');
    }
    //file saved to /uploads 
   res.redirect('/');
    
})

module.exports = router;