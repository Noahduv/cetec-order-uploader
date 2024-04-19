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
        return res.status;
    }catch(e){
        console.log('Error: ', e);
    }
   
};

const addCustomerAddress = async(data) =>{
    try{
        //patch request
    }catch(e){
        console.log('Error: ', e);
    }
}
//export {getCustomer, getDadJoke, config};

const apiCalls = {
    getCustomerByEmail: getCustomerByEmail,
    getContact: getContact,
    getCustomerById: getCustomerById,
    createCustomer: createCustomer,
    addCustomerAddress: addCustomerAddress,
    getDadJoke: getDadJoke,
    config: config
}
module.exports = apiCalls;