const CSVToJSON = require('csvtojson');
const fs = require('fs');
const multer = require('multer');

/*CSV columns need white spaces to be removed*/
/*"CustomerName","Email","CustomerNameShipping","ShippingAddress1","ShippingAddress2","ShippingCity","ShippingProvinceCode","ShippingZIP","ShippingCountry","ShippingAddressPhone","CustomerNameBilling","BillingAddress1","BillingAddress2","BillingCity","BillingProvinceCode","BillingZIP","BillingCountry","OrderName","SKU","ProductPriceLineItemPrice","OrderItemQuantity","TotalTax","TotalDiscounts","TransactionDateCreated","ShippingPrice"*/

function printCSV(file){
CSVToJSON().fromFile(file).then(source => {
    console.log(source);
});
};

async function processCSV(file){
    //promise chain here
    const fp = "output.json";
    try{
        await parseCSV(file, fp);
        const data =  await readJSON(fp);
        console.log('Data Completed');
        return data;
    }catch(e) {
        console.log("error: ", e);
    }
}

async function parseCSV(file, fp){
//make promise  
  const converter = await CSVToJSON({trim:true}).fromFile(file).then(source => {
            fs.writeFileSync(fp, JSON.stringify(source), "utf-8"); 
          });
          return 'File Saved successfully';
}
   
async function readJSON(fp){
        const data = fs.readFileSync(fp, 'utf8');
        return JSON.parse(data);
}


const csvParse = {
    printCSV: printCSV,
    processCSV: processCSV
}
module.exports = csvParse;