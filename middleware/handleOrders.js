const csvParse = require('./csvParse');
const configData = require('../config/default.json');
const helperFunctions = require('./helperFunctions');



/*Main Function for creating a CETEC Order. Returns a JSON object thats is ready to be sent to CETEC*/
async function createOrder(file, apiKey)
{ 
    const fileP = file.path;
    let combinedData = [];
    let newOrder = {};
    let newLine = {};
    let lastOrder;
    const orderList =[];
    const failedOrders =[];
    
    //contains json object with all order data
    const orderData = await csvParse.processCSV(fileP);

if(orderData){
    for(let i = 0; i < orderData.length; i++){
        if(lastOrder === orderData[i]["Order Name"]){
            //Order with multiple line items
            newLine = await helperFunctions.fillLineData(orderData[i], false);
            await helperFunctions.pushToArray(newOrder.lines, newLine);

        }
        else{
            //loop has moved on to next order. Save newOrder Object to array combinedData
            if(lastOrder) {
                await helperFunctions.pushToArray(combinedData, newOrder);
            }

            //start processing data for next order
            const extKey =  await helperFunctions.getCustomerKey(orderData[i], apiKey);
            newOrder = await helperFunctions.fillCustomerData(orderData[i], extKey);
            newLine = await helperFunctions.fillLineData(orderData[i], true);
            await helperFunctions.pushToArray(newOrder.lines, newLine);
        }
        //save email for the current line. Will be used later to check if an order has multiple lines
        lastOrder = orderData[i]["Order Name"];
    } 
    //push last order to array
        await helperFunctions.pushToArray(combinedData, newOrder);
    
    if(combinedData.length > 0) {
        console.log("array has been filled", combinedData.length);
        for(let i = 0; i < combinedData.length; i++){
           await helperFunctions.incramentKey(combinedData[i].lines);
            let res = await helperFunctions.sendOrders(combinedData[i], apiKey);
            orderList.push(await helperFunctions.evaluateResponse(res));
            if(orderList[i] == -1) orderList[i] = (combinedData[i].po);
        }   
    }
    else{
        console.log("Array of orders failed to fill");
    }
}
    //If list is empty push -1. Something has gone wrong.
    if(orderList.length < 1){
        return -1;
    }
    
   //delete temporary file in /uploads
    await helperFunctions.deletedFile(file.filename);

    return orderList;
    
}

const handleOrders = {
    createOrder: createOrder
}
module.exports = handleOrders;

