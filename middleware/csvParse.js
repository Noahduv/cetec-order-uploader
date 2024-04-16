const CSVToJSON = require('csvtojson');
const FileSystem = require('fs');
/*CSV columns need white spaces to be removed*/
/*"CustomerName","Email","CustomerNameShipping","ShippingAddress1","ShippingAddress2","ShippingCity","ShippingProvinceCode","ShippingZIP","ShippingCountry","ShippingAddressPhone","CustomerNameBilling","BillingAddress1","BillingAddress2","BillingCity","BillingProvinceCode","BillingZIP","BillingCountry","OrderName","SKU","ProductPriceLineItemPrice","OrderItemQuantity","TotalTax","TotalDiscounts","TransactionDateCreated","ShippingPrice"*/
function printCSV(file){
CSVToJSON().fromFile(file).then(source => {
    console.log(source);
});
};

function parseCSV(file){
    var data;
    CSVToJSON().fromFile(file).then(source => {
       // console.log(source[1].CustomerName);
       // source = JSON.parse(source);
       data = source;
      // return source;
    });

    console.log(data);
    return data;
};

const csvParse = {
    printCSV: printCSV,
    parseCSV: parseCSV
}
module.exports = csvParse;