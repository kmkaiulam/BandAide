'use strict';
//require('dotenv').config();

// --- MODULES ---
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
      mongoose.Promise = global.Promise;
const passport = require('passport');

// --- MIDDLEWARE ---
app.use(express.json());
app.use(express.static('public'));


// --- LOGGING ---
app.use(morgan('common'));


// --- IMPORTS ---
const {announcementsRouter, eventevalsRouter, feedbacksRouter, trainingsRouter, usersRouter} = require('./routes');
const {authRouter, localStrategy, jwtStrategy } = require('./auth');

// --- CONFIG ---
const { PORT, DATABASE_URL } = require('./config/constants');

// --- ENDPOINTS ---
app.use('/api/announcements/', announcementsRouter);
app.use('/api/eventevals/', eventevalsRouter);
app.use('/api/feedback/', feedbacksRouter);
app.use('/api/training/', trainingsRouter);
app.use('/api/users/', usersRouter);


//app.use('/api/auth/', authRouter);


// --- CORS ---
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});
/*
passport.use(localStrategy);
passport.use(jwtStrategy);
*/




//const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it
/* Don't quite understand this one yet.... CHECK IT OUT
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});
*/
app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});


let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl, port = PORT) {
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

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };
