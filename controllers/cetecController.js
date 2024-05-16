
const expressError = require('../utils/expressError');
const handleOrders = require('../middleware/handleOrders.js');
const helperFunctions = require('../middleware/helperFunctions'); 

module.exports.processOrders = async (req, res) => {
    //file saved to /uploads 
    //Send File to parsed and uploaded 
           if(!req.file) throw new expressError('csv File Required', 400);
           if(!req.body.APIKEY) throw new expressError('CETEC Api Key Required', 400);
               const data = await handleOrders.createOrder(req.file, req.body.APIKEY);
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
           
   

  res.redirect('/');
   
}

