'use strict';
require('dotenv').config();
// --- MODULES ---
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const mongoose = require('mongoose');
      mongoose.Promise = global.Promise;
const passport = require('passport');

// --- EJS
app.set('views', './views')
app.set('view engine', 'ejs');

// --- VIEWS

app.get('/', (req,res) => {
  res.render('pages/landing')
})

app.get('/home', (req,res) => {
  res.render('pages/home')
})

app.get('/login', (req,res) => {
  res.render('pages/login')
})
app.get('/signup', (req,res) =>{
  res.render('pages/signup')
})


// --- MIDDLEWARE ---
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded(({
  extended: true
})));
app.use(cookieParser());

// --- LOGGING ---
app.use(morgan('common'));


// --- IMPORTS ---
const {announcementsRouter,bandpostsRouter, usersRouter} = require('./routes');
const {authRouter, localStrategy, jwtStrategy } = require('./auth');

// --- CONFIG ---
const { PORT, DATABASE_URL } = require('./config');

// --- ENDPOINTS ---
app.use('/api/announcements/', announcementsRouter);
app.use('/api/bandposts/', bandpostsRouter);
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);


// --- CORS ---
app.use(function (req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  if (req.method === 'OPTIONS'){
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

let server;

function runServer(databaseUrl, port = PORT){
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}
function closeServer(){
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) =>{
      console.log('Closing server');
      server.close(err => {
        if (err){
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module){
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {runServer, app, closeServer};