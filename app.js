if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
//console.log(process.env.API_KEY);

const express = require("express");
const app = express();
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const cetecRoutes = require('./routes/cetecRoutes');
const catchAsync = require('./utils/catchAsync');
const expressError = require('./utils/expressError');
const http = require('http');
//const cookieParser = require('cookie-parser');

//app.use(cookieParser('secret'));

app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, 'public')));

const sessionOptions = { name: '__CTU', secret: 'secretKey', resave: false, saveUninitialized: false, cookie: {httpOnly: true, expires: Date.now() + 1000 * 60 * 60 * 24 * 7, maxAge: 1000 * 60 * 60 *24 * 7}};
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(morgan('tiny'));
app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) =>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/cetec', cetecRoutes);

app.get('/', (req, res) =>{
    req.flash('success', 'Welcome home!');
    res.render('index');
})

app.get('/settings', (req, res) =>{
    res.render('settingsPage');
})

app.get('/about', (req, res) =>{
    res.render('about');
})

app.get('/skusorter', (req, res) =>{
    res.render('skuSorter');
})

app.all('*', (req, res, next) =>{
    next(new expressError('Page Not Found', 404));
})

app.use((err, req, res, next) =>{
    console.log("Error");
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something went Wrong!';
    req.flash('error', err.message);

    if(err.statusCode == 404) res.status(statusCode).render('notfound');
    
    res.redirect('back');
})

//Server within network only
http.createServer(app).listen(process.env.PORT, process.env.HOSTNAME, () => {
    console.log(`Server Listening at http://${process.env.HOSTNAME}:${process.env.PORT}`)
});

//Localhost server only
/*app.listen(process.env.PORT, () => {
    console.log(`Listening on Port http://localhost:${process.env.PORT}`);
})*/