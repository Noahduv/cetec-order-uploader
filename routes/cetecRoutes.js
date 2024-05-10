const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressError');
const handleOrders = require('../middleware/handleOrders.js');
const helperFunctions = require('../middleware/helperFunctions');
const multer = require('multer');
const upload = multer({dest: 'uploads/', fileFilter(req, file, cb) { (!file.originalname.match(/\.(csv)$/)) ? cb(null, false) : cb(undefined, true); }});

router.post('/placeOrder', upload.single('shopifyOrders'), catchAsync(async (req, res) => {

     //Send File to parsed and uploaded 
            if(!req.file) throw new expressError('csv file required', 400);
                const data = await handleOrders.createOrder(req.file);
                if(data[0]== -1 && data.length == 1){
                    throw new expressError();
                }
                else{
                    //filter out successful and failed orders
                    const failedUploads = data.filter((failed) => failed.includes('W'));
                    const succUploads = data.filter((succ) => !succ.includes('W'));
                    //turn arrays to string
                    const failedUploadsString = await helperFunctions.arraytoString(failedUploads);
                    const succUploadsString = await helperFunctions.arraytoString(succUploads);
                    //create alerts
                    req.flash('success', `Successfully placed orders: ${succUploadsString}`);
                    if(failedUploads.length !== 0) req.flash('error', `Failed to place orders: ${failedUploadsString}`);
                    
                }
            
    //file saved to /uploads 
   res.redirect('/');
    
}))

module.exports = router;