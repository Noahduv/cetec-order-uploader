const csvParse = require('./csvParse');
const apiCalls = require('./apiCalls');
const configData = require('../config/default.json');
const fs = require('fs');

/*ObjectTemplate for creating new order. Contains important fields required for importing orders to cetec*/
const orderCustomerData = {
    customer_name:"",
    location:"MN",
    customer_id:"",
    shipto_name:"",
    shipto_address_1:"",
    shipto_address_2:"",
    shipto_address_3:"",
    shipto_address_4:"",
    shipto_city:"",
    shipto_state:"",
    shipto_zip:"",
    shipto_country:"",
    billto_name:"",
    billto_address_1:"",
    billto_address_2:"",
    billto_address_3:"",
    billto_address_4:"",
    billto_city:"",
    billto_state:"",
    billto_zip:"",
    billto_country:"",
    po:"",
    external_key:"",
    internal_customer_id : 1,
    internal_vendor_id : 1,
    place_order:"true",
    commission_note: "",
    ship_via:"ups_ground",
    internal_comments:"",
    shipping_instructions:"",
    terms_external_key:"1",
    terms_description:"Prepay",
    customer_taxtype:"1",
    tax_collected:"",
    freight_billing_type: "fixed_bid",
    freight_resale: "",
    freight_cost: "",
    quote_name: "Online Order",
    payment_type_id :"3",
    prepayment_amount:"FULL",
    lines:[]
   // "prepayment_ref":"",
};

/*Object Template for creating new line item in order*/
const lineOrderData = {
    partnum:"",
    custpart:"",
    resale:"",
    cost:"",
    qty:"",
    use_current_revision:"1",
    description:"",
    comments:"",
    due_date:"",
    ship_date:"",
    wip_date:"",
    external_key:"",
    transcode:"SN",
};

/*Object Template for creating new customer*/
const newCustomerData ={
    tax_resale_id: "",
    purchemail: "",
    purchfax: true,
    custnum: "",
    purchphone : "",
    preshared_token: "",
    taxtype: "",
    tax_resale_state: "",
    fob: "",
    acctfax: "",
    name: "",
    shipvia: "",
    credit_code: "1",
    business_type_id: "5",
    acctphone: "",
    credit_limit: "",
    daysahead: "",
    terms_code: "1",
    acctemail: "",
    external_key: "",
    bill_to_name: "",
    bill_to_address_1: "",
    bill_to_address_2: "",
    bill_to_address_city: "",
    bill_to_address_state: "",
    bill_to_country_id: "",
    bill_to_address_zip: "",
    ship_to_name: "",
    ship_to_address_1: "",
    ship_to_address_2: "",
    ship_to_address_city : "",
    ship_to_address_state: "",
    ship_to_country_id: "",
    ship_to_address_zip: ""
};

/*Main Function for creating a CETEC Order. Returns a JSON object thats is ready to be sent to CETEC*/
async function createOrder(file)
{ 
    const fileP = file;
    let combinedData = [];
    let newOrder = {};
    let newLine = {};
    let lastOrder;

    //contains json object with all order data
    const orderData = await csvParse.processCSV(fileP);

    for(let i = 0; i < orderData.length; i++){
        if(lastOrder === orderData[i]["Order Name"]){
            //Order with multiple line items
            newLine = await fillLineData(orderData[i]);
            await pushToArray(newOrder.lines, newLine);

        }
        else{
            //loop has moved on to next order. Save newOrder Object to array combinedData
            if(lastOrder) {
                await pushToArray(combinedData, newOrder);
                newOrder = await clearObject(newOrder);
                //await sealCustomer(combinedData, lastOrder);
            }

            //start processing data for next order
            const extKey =  await getCustomerKey(orderData[i]);
            newOrder = await fillCustomerData(orderData[i], extKey);
            newLine = await fillLineData(orderData[i]);
            await pushToArray(newOrder.lines, newLine);
        }
        //save email for the current line. Will be used later to check if an order has multiple lines
        lastOrder = orderData[i]["Order Name"];
    } 
    //push last order to array
    await pushToArray(combinedData, newOrder);
    if(combinedData.length > 0) {
        console.log("array has been filled", combinedData.length);
        for(let i = 0; i < combinedData.length; i++){
            console.log(combinedData[i]);
            console.log(combinedData[i].lines);
        }   
    }
    else{
        console.log("Array of orders failed to fill");
    }

}

async function fillCustomerData(orderData, extKey){

    const newData = Object.create(orderCustomerData);

    newData.customer_name = orderData["Customer Name"];
    newData.shipto_name = orderData["Customer Name (Shipping)"];
    newData.shipto_address_1 = orderData["Shipping Address 1"];
    newData.shipto_address_2 = orderData["Shipping Address 2"];
    newData.shipto_city = orderData["Shipping City"];
    newData.shipto_state = orderData["Shipping Province Code"];
    newData.shipto_zip = orderData["Shipping ZIP"];
    newData.shipto_country = orderData["Shipping Country"],
    newData.billto_name = orderData["Customer Name (Billing)"];
    newData.billto_address_1 = orderData["Billing Address 1"];
    newData.billto_address_2 = orderData["Billing Address 2"];
    newData.billto_city = orderData["Billing City"];
    newData.billto_state = orderData["Billing Province Code"];
    newData.billto_zip = orderData["Billing ZIP"];
    newData.billto_country = orderData["Billing Country"];
    newData.po = orderData["Order Name"];
    newData.tax_collected = orderData["Total Tax"];
    newData.freight_resale = orderData["Shipping Price"];
    newData.external_key = extKey;
    return newData;
}

/*Creates new object based off the Order Line template and fills the data required for a order line item*/
async function fillLineData(orderData){

    const newData = Object.create(lineOrderData);

    newData.partnum = orderData["SKU"];
    newData.qty = orderData["Order Item Quantity"];
    newData.external_key = orderData["Order Name"];

    return newData;

}

/*exports valid customer external key*/
async function getCustomerKey(orderData){

    let custEmail = orderData["Email"];
    
    let custData = await apiCalls.getCustomerByEmail(custEmail);
    if(custData.length >= 1){
       // console.log(custData);
       console.log("Customer found from email.")
        return custData[0].external_key;
    }else{

        custData = await apiCalls.getContact(custEmail); //find contact with mathcing email 

        if(custData.length >= 1){ //Any Contacts Found?
            custData = await apiCalls.getCustomerById(custData[0].customer_id); //get customer data from customer ID
            console.log("Found customer via contact.");
            //console.log(custData);
            return custData[0].external_key;

        } else{
            console.log("No Customer found need to create customer");
            custData = await createCustomer(orderData);
            console.log(custData.status);

            if(custData.status == 201 || custData.status == 200){
                console.log("Customer Created Successfully");
                return custData.data.external_key;
    
            }
            else{
                console.log("Customer Failed to be created");
            }
            
        }
    }
   // extKey = orderData.external_key;

}

async function createCustomer(orderData){
    const newData = Object.create(newCustomerData);

    newData.preshared_token = "c4tBewPhEYNM1Gm";
    newData.name = orderData["Customer Name"];
    newData.acctemail = orderData["Email"];
    newData.acctphone = orderData["Shipping Address Phone"];

    const extKey = await generateExternalKey();
    if(extKey !== 0)
    {
        newData.external_key = extKey;
    }

    newData.bill_to_name = orderData["Customer Name (Billing)"];
    newData.bill_to_address_1 = orderData["Billing Address 1"];
    newData.bill_to_address_2 = orderData["Billing Address 2"];
    newData.bill_to_address_city = orderData["Billing City"];
    newData.bill_to_address_state = orderData["Billing Province Code"];
    newData.bill_to_address_zip = orderData["Billing ZIP"];
    newData.bill_to_country_id = 233; //orderData["Billing Country"];

    //shipping data
    newData.ship_to_name = orderData["Customer Name (Shipping)"];
    newData.ship_to_address_1 = orderData["Shipping Address 1"];
    newData.ship_to_address_2 = orderData["Shipping Address 2"];
    newData.ship_to_address_city = orderData["Shipping City"];
    newData.ship_to_address_state = orderData["Shipping Province Code"];
    newData.ship_to_address_zip = orderData["Shipping ZIP"];
    newData.ship_to_country_id = 233;

    const res = apiCalls.createCustomer(newData);
    return res;

}

/**Generates a new External key for a customer and saves to default.json. Returns External Key value as INT*/
async function generateExternalKey(){
    const limiterSize = 30;
    let limiter = 0;
    let newKey = configData.last_external_key + 1;
    let custData = await apiCalls.getCustomerByKey(newKey);

    if(custData.length !== 0)
    {
        //initial api call found a customer with a corresponding key. Add one to the key and try again
        while(custData.length !== 0 && limiter < limiterSize) 
        {
            newKey++;
            custData = await apiCalls.getCustomerByKey(newKey);
            limiter++;
         }
    }
    
    if(limiter < limiterSize)
    {
        console.log("Available key found: ", newKey);
        configData.last_external_key = newKey;
       const res = await saveExtKey(newKey);
        if(res == 200) {console.log("New external Key saved.");}
        
        //remove "T" + after development!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! DOn't FOrget
        return "T"+ newKey;
    }
    else{
        console.log("Could not find valid customer key.")
        return 0;
    }
}

//saves new External Key to default.json file
async function saveExtKey(newKey){

    const fp = './config/default.json';
    const newObject = { "last_external_key": ""};
    newObject.last_external_key = newKey;
    let newObjStr = JSON.stringify(newObject);
    
        try{
            fs.writeFileSync(fp, newObjStr, "utf-8");
            return 200;
        }catch(e){
            console.log('New External Key Failed to Save... : ', e);
            return 0;
        }
}

async function pushToArray(arr, obj){
    try{
        arr.push(obj);
    }catch(e){
        console.log("Failed to push order lines to array... Error: ", e);
    }
}
async function clearObject(obj){
 /*   for(let a = 0; a < obj.lines.length; a++){
        obj.lines.pop();
    }*/
    obj = {};
    return obj;
}

async function sealCustomer(Arr, searchValue){
    for(let i = 0; i < Arr.length; i++){
        if(Arr[i].po === searchValue){
            const target = Arr[i];
            Object.seal(target);
        }
    }
   
}
const handleOrders = {
    createOrder: createOrder
}
module.exports = handleOrders;


createOrder('./csvStorage/TestOrders.csv');
//function 