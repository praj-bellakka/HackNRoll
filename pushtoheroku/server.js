//This file is for setting up the server.  
//DO NOT CHANGE THE ARRANGEMENT OF STUFF, IT MIGHT SCREW UP THE SERVER 

//require
const express = require('express');
const path = require('path');
const session = require('express-session');
var bodyparser = require('body-parser');
const restricted = require('./auth/restricted-middleware');

//create express app
const server = express();

//session
const sessionConfig = {
  name: 'monster',
  secret: process.env.SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60,//this is in milliseconds
    secure: false, //for production, set to true for https only access
    httpOnly: true //true means no access from javascript
  },
  resave: false,
  saveUninitialized: true //set to false in production as user has to consent to save cookies 
};

//routers 


//other
server.use(bodyparser.urlencoded({limit: '50mb', extended: true }));
server.use(bodyparser.json({limit: '50mb', extended: true}));

//server setup
server
.use(express.static(path.join(__dirname, 'public')))
.use(express.static(__dirname + '/public')) //to use external files, need to add the file path here (or just add the files in /public)
.use(express.json())
.set('views', path.join(__dirname, './views'))
.set('view engine', 'ejs');

//other 
server.use(express.json());
server.use(express.urlencoded())
server.use(session(sessionConfig));

//routers



//Login page
server.get('/', (req, res) => {
  if(req.session.user){
    res.redirect('/homepage');
  }else {
    res.render('index');
  }    
} );

//registration page

server.get('/registration', (req, res) => {
  res.render('registration');
})

//debugging
server.get('/test', (req, res) => {
  res.send({
    obj1:{
      sd:"Sd"
    },
    obj2:{
      sdsd:"SDds"
    }
    });
  
  res.json(req.body);
});

//export
module.exports = server;

