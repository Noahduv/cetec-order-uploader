//const apiCalls = require('./apiCalls');
const axios = require('axios');

const config = {headers: { Accept: 'application/json' } };

/**GET REQUESTS*/

/*GET CUSTOMER API CALLS*/
 const getCustomerByEmail = async (email) => {
    try{
        const res = await axios.get(`https://mistymountain.cetecerp.com/api/customer?preshared_token=c4tBewPhEYNM1Gm&acct_email=${email}`, config);
        return res.data;
    }catch(e){
        console.log('Error: ', e);
    }
   
};

const getCustomerById = async(ID) => {
    try{
        const res = await axios.get(`https://mistymountain.cetecerp.com/api/customer?preshared_token=c4tBewPhEYNM1Gm&id=${ID}`, config);
        return res.data;
    }catch(e){
        console.log('Error: ', e);
    }
};

const getCustomerByKey = async(key) => {
    try{
        const res = await axios.get(`https://mistymountain.cetecerp.com/api/customer?preshared_token=c4tBewPhEYNM1Gm&external_key=${key}`, config);
        return res.data;
    }catch(e){
        console.log('Error: ', e);
    }
};
/*GET CONTACT API CALLS */
const getContact = async (email) =>{
    try{
        const res = await axios.get(`https://mistymountain.cetecerp.com/api/contact?preshared_token=c4tBewPhEYNM1Gm&email=${email}`, config);
        return res.data;
    }catch(e){
        console.log('Error: ', e);
    }
};



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

/*PUT REQUESTS

/*PUT Customer API CAllS*/
const createCustomer = async (data) => {
    try{
        const res = await axios.put(`https://mistymountain.cetecerp.com/api/customer`, data, config);
        return res;
    }catch(e){
        console.log('Error: ', e);
    }
   
};

const addCustomerAddress = async(data, ID) =>{
    try{
        const res = await axios.patch(`https://mistymountain.cetecerp.com/api/customer/${ID}`, data, config);
        return res.status;
    }catch(e){
        console.log('Error: ', e);
    }
}

const sendOrder = async(data) => {
    try{
        const res = await axios.post(`https://mistymountain.cetecerp.com/importjson/quotes?preshared_token=c4tBewPhEYNM1Gm&import_source_name=WEBSERVICE&json=`, data, config);
        return res;
    }catch(e){
        console.log("Error: Failed to send post request.... ", e);
    }
}
//export {getCustomer, getDadJoke, config};

const apiCalls = {
    getCustomerByEmail: getCustomerByEmail,
    getContact: getContact,
    getCustomerById: getCustomerById,
    createCustomer: createCustomer,
    addCustomerAddress: addCustomerAddress,
    getCustomerByKey: getCustomerByKey,
    sendOrder: sendOrder,
    getDadJoke: getDadJoke,
    config: config
}
module.exports = apiCalls;