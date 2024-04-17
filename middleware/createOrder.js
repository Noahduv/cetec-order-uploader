const csvParse = require('./csvParse');

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
    billto_name:"",
    billto_address_1:"",
    billto_address_2:"",
    billto_address_3:"",
    billto_address_4:"",
    billto_city:"",
    billto_state:"",
    billto_zip:"",
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
   // "prepayment_ref":"",
};

const orderData = {
    partnum:"",
    custpart:"",
    resale:"",
    cost:"",
    qty:"",
    revision:"1",
    description:"",
    comments:"",
    due_date:"2024-05-15",
    ship_date:"2024-05-10",
    wip_date:"2024-05-05",
    external_key:"",
    transcode:"SN",
};

/*Main Function for creating a CETEC Order. Returns a JSON object thats is ready to be sent to CETEC*/
async function createOrder(file)
{ 
    let combinedData;
    const data = await csvParse.processCSV(file);
    console.log('Data Completed');
    console.log(data);
    
    //stuff here
   // orderData = JSON.stringify(orderData);
   // orderData = JSON.parse(orderData);
    //console.log(orderData[0].Email);

    //const orderJSON = JSON.stringify(combinedData);
   // return orderJSON;
}

function fillCustomerData(data){
    const newData = Object.create(orderCustomerData);



}

function fillOrderData(data){
    const newData = Object.create(orderData);

}

createOrder('./csvStorage/TestOrders.csv');
//function 