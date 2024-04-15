//const apiCalls = require('./modules/apiCalls.js');


//const apiCalls = require('./apiCalls');
const config = {headers: { Accept: 'application/json' } };
const getCustomer = async (email) => {
   try{
       
       const res = await axios.get(`https://mistymountain.cetecerp.com/api/customer?preshared_token=c4tBewPhEYNM1Gm&acct_email=${email}`, config);
     //  const data = await res.json();
      // console.log(res.data[1].addresses[0].city);
       console.log(res.data);
   }catch(e){
       console.log('Error: ', e);
   }
  
};

const pushOrder = async (order) =>{
    try{
        const res = await axios.post(`https://mistymountain.cetecerp.com/importjson/quotes?preshared_token=c4tBewPhEYNM1Gm&import_source_name=WEBSERVICE&json=${order}`, config);
       console.log(res.success);
    }catch(e)
    {
        console.log('Error: ', e);
    }

}

const getDadJoke = async () => {
   try{
       const config = { headers: { Accept: 'application/json' }}
       const res = await axios.get('https://icanhazdadjoke.com/', config);
       return res.data.joke;
   
   }catch(e){
       console.log('Error: ', e);
       return "I'm out of Jokes!";
   }
  
};

const addNewJoke = async () =>{
    const jokeText = await getDadJoke();
    console.log(jokeText);
    const newLI = document.createElement('LI');
    newLI.append(jokeText);
    jokes.append(newLI);
}
const firstOrder = {
    
        "customer_name":"Misty Mountain Threadworks",
        "location":"MN",
        "customer_id":"27588",
        "shipto_name":"Misty Mountain Threadworks",
        "shipto_address_1":"320 Burma Road",
        "shipto_address_2":"",
        "shipto_address_3":"",
        "shipto_address_4":"",
        "shipto_city":"Banner Elk",
        "shipto_state":"NC",
        "shipto_zip":"28604",
        "billto_name":"Misty Mountain Threadworks",
        "billto_address_1":"320 Burma Road",
        "billto_address_2":"",
        "billto_address_3":"",
        "billto_address_4":"",
        "billto_city":"Banner Elk",
        "billto_state":"NC",
        "billto_zip":"28604",
        "po":"TESTPOHELLOWORLD",
        "external_key":"TESTOrder4",
        "internal_customer_id" : 1,
        "internal_vendor_id" : 1,
        "place_order":"true",
        "commission_note": "",
        "ship_via":"ups_ground",
        "internal_comments":"",
        "shipping_instructions":"",
        "terms_external_key":"1",
        "terms_description":"Prepay",
        "customer_taxtype":"1",
        "tax_collected":"",
        "freight_billing_type": "fixed_bid",
        "freight_resale": "15",
        "freight_cost": "",
        "quote_name": "Online Order",
        //"payment_type_id":"3",
       // "prepayment_amount":"FULL",
       // "prepayment_ref":"",
        "lines":[
           {
              "partnum":"BOM5122MD",
              "custpart":"",
              "resale":"179.95",
              "cost":"",
              "qty":"1",
              "revision":"1",
              "description":"",
              "comments":"Make sure to keep it clean as this is for my cat.",
              "due_date":"2024-05-15",
              "ship_date":"2024-05-10",
              "wip_date":"2024-05-05",
              "external_key":"Order1",
              "transcode":"SN",
              "locations":[
                 {
                    "location_external_key":"wh",
                    "build_order":1,
                    "operations":[
                       {
                          "operation_external_key":"admin",
                          "repetitions":"5",
                          "setup":true,
                          "place_in_line":1
                       },
                       {
                          "operation_external_key":"Production Volume",
                          "repetitions":"8",
                          "setup":false,
                          "place_in_line":2
                       }
                    ]
                 }
              ]
           },
           {
              "partnum":"BOM5122LG",
              "custpart":"",
              "resale":"179.95",
              "cost":"",
              "qty":"2",
              "use_current_rev": 1,
              "description":"",
              "comments":"Doggo...",
              "due_date":"2020-01-11",
              "ship_date":"2020-01-06",
              "wip_date":"2020-01-01",
              "external_key":"order2",
              "transcode":"SN"
           }
        ]
}
const orderJSON = JSON.stringify(firstOrder);




const jokes = document.querySelector('#jokeList');
const jokeButton = document.querySelector('#jokeButton');
const apiButtonGet = document.querySelector('#buttonAPIGET');
const apiButtonPost = document.querySelector('#buttonAPIPOST');

jokeButton.addEventListener('click', addNewJoke);
apiButtonGet.addEventListener('click', getCustomer("customerservice@mistymountain.com"));
//apiButtonPost.addEventListener('click', pushOrder(orderJSON));
//;
