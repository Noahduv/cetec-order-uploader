const getCustomer = async (email) => {
    try{
        const config = { headers: { Accept: 'application/json' }}
        const res = await axios.get('https://mistymountain.cetecerp.com/api/customer?preshared_token=c4tBewPhEYNM1Gm&acct_email=${email}', config);
      //  const data = await res.json();
        console.log(res.data);
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

const apiCalls = {
    getCustomer: getCustomer,
    getDadJoke: getDadJoke
}
module.exports = apiCalls;