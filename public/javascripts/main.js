//const apiCalls = require('./modules/apiCalls.js');
const orderArr = [];
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
const apiButtonGet = document.querySelector('#buttonAPIGET');
const apiButtonPost = document.querySelector('#buttonAPIPOST');

jokeButton.addEventListener('click', addNewJoke);
//apiButtonGet.addEventListener('click', getCustomer("customerservice@mistymountain.com"));
//apiButtonPost.addEventListener('click', pushOrder(orderJSON));
//;
