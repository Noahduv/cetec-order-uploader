const csvParse = require('./csvParse');
const apiCalls = require('./apiCalls');
const configData = require('../config/default.json');
const fs = require('fs');

/*ObjectTemplate for creating new order. Contains important fields required for importing orders to cetec*/
const orderCustomerData = {
    "customer_name":"",
    "location":"MN",
    "customer_id":"",
    "shipto_name":"",
    "shipto_address_1":"",
    "shipto_address_2":"",
    "shipto_address_3":"",
    "shipto_address_4":"",
    "shipto_city":"",
    "shipto_state":"",
    "shipto_zip":"",
    "shipto_country":"",
    "billto_name":"",
    "billto_address_1":"",
    "billto_address_2":"",
    "billto_address_3":"",
    "billto_address_4":"",
    "billto_city":"",
    "billto_state":"",
    "billto_zip":"",
    "billto_country":"",
    "po":"",
    "external_key":"",
    "internal_customer_id" : "1",
    "internal_vendor_id" : "1",
    "place_order":"true",
    "commission_note": "",
    "ship_via":"ups_ground",
    "internal_comments":"",
    "shipping_instructions":"",
    "terms_external_key":"1",
    "terms_description":"Prepay",
    "customer_taxtype":"0",
    "tax_collected":"",
    "freight_billing_type": "fixed_bid",
    "freight_resale": "",
    "freight_cost": "",
    "quote_name": "",
    "payment_type_id" :"6",
    "prepayment_amount":"FULL",
    "oorderdate": "",
    "lines":[]
   // "prepayment_ref":"",
};

/*Object Template for creating new line item in order*/
const lineOrderData = {
    "partnum":"",
    "custpart":"",
    "resale":"",
    "cost":"",
    "qty":"",
    "use_current_revision":"1",
    "description":"",
    "comments":"",
    "due_date":"",
    "ship_date":"",
    "wip_date":"",
    "external_key":"",
    "transcode":"SN",
};

/*Object Template for creating new customer*/
const newCustomerData ={
    "tax_resale_id": "",
    "purchemail": "",
    "purchfax": true,
    "custnum": "",
    "purchphone" : "",
    "preshared_token": "",
    "taxtype": "",
    "tax_resale_state": "",
    "fob": "",
    "acctfax": "",
    "name": "",
    "shipvia": "",
    "credit_code": "1",
    "business_type_id": "5",
    "acctphone": "",
    "credit_limit": "",
    "daysahead": "",
    "terms_code": "1",
    "acctemail": "",
    "external_key": "",
    "bill_to_name": "",
    "bill_to_address_1": "",
    "bill_to_address_2": "",
    "bill_to_address_city": "",
    "bill_to_address_state": "",
    "bill_to_country_id": "",
    "bill_to_address_zip": "",
    "ship_to_name": "",
    "ship_to_address_1": "",
    "ship_to_address_2": "",
    "ship_to_address_city" : "",
    "ship_to_address_state": "",
    "ship_to_country_id": "",
    "ship_to_address_zip": ""
};

async function fillCustomerData(orderData, extKey){

    const newData = Object.create(orderCustomerData);

    newData.customer_name = orderData["Customer Name"];
    newData.location = "MN";
    newData.customer_id = "";
    newData.shipto_name = orderData["Customer Name (Shipping)"];
    newData.shipto_address_1 = orderData["Shipping Address 1"];
    newData.shipto_address_2 = orderData["Shipping Address 2"];
    newData.shipto_city = orderData["Shipping City"];
    newData.shipto_state = orderData["Shipping Province Code"];
    newData.shipto_zip = orderData["Shipping ZIP"];
    newData.billto_name = orderData["Customer Name (Billing)"];
    newData.billto_address_1 = orderData["Billing Address 1"];
    newData.billto_address_2 = orderData["Billing Address 2"];
    newData.billto_city = orderData["Billing City"];
    newData.billto_state = orderData["Billing Province Code"];
    newData.billto_zip = orderData["Billing ZIP"];
    newData.po = orderData["Order Name"];
    newData.external_key = extKey;
    newData.freight_resale = orderData["Shipping Price"];
    newData.freight_cost = "";
    newData.quote_name = orderData["Order Name"];
    newData.payment_type_id = "6";
    newData.prepayment_amount = "FULL";
    newData.freight_billing_type = "fixed_bid";
    newData.terms_external_key = "1";
    newData.terms_description = "Prepay";

    /*Find correct country code*/
    newData.shipto_country = await getCountryCode(orderData["Shipping Country"]);
    newData.billto_country = await getCountryCode(orderData["Billing Country"]);

    /*Determine if tax should be applied*/
    if(orderData["Billing Province Code"] == "NC")
    {
        newData.tax_collected = orderData["Total Tax"];
        newData.customer_taxtype = "1";
    } else{
        newData.customer_taxtype = "0";
    }
    newData.oorderdate = orderData["Transaction Date (Created)"];
    newData.internal_customer_id = "1";
    newData.internal_vendor_id = "1";
    newData.place_order = "true";
    newData.commission_note = "";
    newData.ship_via = "ups_ground";
    newData.lines = [];
    return newData;
}

/*Creates new object based off the Order Line template and fills the data required for a order line item*/
async function fillLineData(orderData){

    const newData = Object.create(lineOrderData);

    newData.partnum = orderData["SKU"];
    newData.qty = orderData["Order Item Quantity"];
    newData.external_key = orderData["Order Name"];
    newData.use_current_rev = "1";
    newData.transcode = "SN";
    newData.resale = (orderData["Product Price (Line Item Price)"] - orderData["Total Discounts"]);
    newData.cost = "";
    newData.custpart = "";
    newData.description = "";
    newData.comments = orderData["Customer Note"];
    newData.due_date = "";
    newData.ship_date = "";
    newData.wip_date = await processDate(orderData["Transaction Date (Created)"]);

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
    newData.credit_code = "1";
    newData.business_type_id = "5";
    orderData["Billing Province Code"] == "NC" ? newData.taxtype = "1" : newData.taxtype = "0";
   
    const extKey = await generateExternalKey();
    if(extKey !== 0) newData.external_key = extKey;

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
        return newKey;
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

//returns CETEC Country code
async function getCountryCode(ctryName){
    const countryList = ["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Azores", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bonaire", "Bosnia", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Canary Islands", "Cape Verde Island", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "The Democratic Republic of Congo", "Cook Islands", "Costa Rica", "Croatia", "Curacao", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "England", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Europe", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holland", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "South Korea", "Kosrae", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Macedonia", "Madagascar", "Madeira", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norfolk Island", "Northern Ireland", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Ponape", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Rota", "Russia", "Rwanda", "Saba", "Saipan", "Samoa", "San Marino", "Saudi Arabia", "Scotland", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "South Africa", "Spain", "Sri Lanka", "St. Barthelemy", "St. Christopher", "St. Croix", "St. Eustatius", "St. John", "St. Kitts and Nevis", "St. Lucia", "St. Maarten", "St. Martin", "St. Thomas", "St. Vincent and the Grenadines", "Suriname", "Swaziland", "Sweden", "Switzerland", "Tahiti", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Tinian", "Togo", "Tonga", "Tortola", "Trinidad and Tobago", "Truk", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "U.S. Virgin Islands", "Uganda", "Ukraine", "Union Island", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican", "Venezuela", "Vietnam", "Virgin Gorda", "Wales", "Wallis and Futuna Islands", "Yap", "Yemen", "Zambia", "Zimbabwe"];

    const countryCode = countryList.indexOf(ctryName) + 1;
    if(countryCode !== -1)
    {
        return countryCode;
    }
    else{
        console.log("No country found. Using US code for now.");
        return 233;
    }

}

/*Lines array with external_key key must be passed in */
async function incramentKey(value){
    let keyV = 1;
    for(let i = 0; i < value.length; i++){
        value[i].external_key = keyV++;
    }
}
async function processDate(date){
    const spaceIndex = date.indexOf(" ");
    return date.substring(0, spaceIndex);
}

async function evaluateResponse(res){
    if(res.success == 1){
        console.log("request success : ", res.orders[0]);
        return res.orders[0];
    }
    else{
        console.log("Request Failed");
        return -1;
    }
}

async function sendOrders(order){
    const res = await apiCalls.sendOrder(order);
    return res.data;
}

async function arraytoString(ordersArr){
    let ordString ="";
    ordersArr.forEach(async(order) =>{
        ordString += (order + ", ");
    });
    return ordString;
}
const helperFunctions = {
    orderCustomerData: orderCustomerData,
    lineOrderData: lineOrderData,
    newCustomerData: newCustomerData,
    fillCustomerData: fillCustomerData,
    fillLineData: fillLineData,
    getCustomerKey: getCustomerKey,
    createCustomer: createCustomer,
    generateExternalKey: generateExternalKey,
    saveExtKey: saveExtKey,
    pushToArray: pushToArray,
    getCountryCode: getCountryCode,
    incramentKey: incramentKey,
    processDate: processDate,
    evaluateResponse: evaluateResponse,
    sendOrders: sendOrders,
    arraytoString: arraytoString
}
module.exports = helperFunctions;