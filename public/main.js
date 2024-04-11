


//const apiCalls = require('./apiCalls');

const getCustomer = async (email) => {
    try{
        const config = { mode: "cors", headers: { Accept: 'application/json',  host: 'https://magnificent-gold-hatchling.cyclic.app/',  } }
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

const addNewJoke = async () =>{
    const jokeText = await getDadJoke();
    console.log(jokeText);
    const newLI = document.createElement('LI');
    newLI.append(jokeText);
    jokes.append(newLI);
}

const jokes = document.querySelector('#jokeList');
const jokeButton = document.querySelector('#jokeButton');
const apiButton = document.querySelector('#buttonAPI');

jokeButton.addEventListener('click', addNewJoke);
apiButton.addEventListener('click', getCustomer("customerservice@mistymountain.com"));
//;
