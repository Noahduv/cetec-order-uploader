const express = require("express");
const app = express();
const port = 3000;
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');
//const flash = require('connect-flash');
//const cookieParser = require('cookie-parser');

//app.use(cookieParser('secret'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionOptions = { secret: 'secretKey', resave: false, saveUninitialized: false};
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(morgan('tiny'));
app.use(session(sessionOptions));
 
app.get('/', (req, res) =>{
    res.render('index');
})



 /**This Route must go Last 
app.use((req, res) =>{
    res.status(404).send('Invalid Request. Page Not Found...');
}) */

app.listen(process.env.PORT || port, () =>{
    console.log("Listening on port 3000")
})