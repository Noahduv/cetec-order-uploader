//const apiCalls = require('./apiCalls');
const config = {headers: { Accept: 'application/json' } };
const getCustomer = async (email) => {
    try{
        
        const res = await axios.get(`https://mistymountain.cetecerp.com/api/customer?preshared_token=c4tBewPhEYNM1Gm&acct_email=${email}`, config);
      //  const data = await res.json();
       // console.log(res.data[1].addresses[0].city);
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

//export {getCustomer, getDadJoke, config};

const apiCalls = {
    getCustomer: getCustomer,
    getDadJoke: getDadJoke,
    config: config
}
module.exports = apiCalls;