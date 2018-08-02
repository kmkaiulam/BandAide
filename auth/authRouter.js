'use strict';
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();

const createAuthToken = function(user){
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false});

router.post('/login', localAuth, (req, res) =>{
  const authToken = createAuthToken(req.user.serialize());
  res.cookie('authToken', authToken);
  res.json({authToken});
});

router.get('/logout', (req, res) =>{
  res.clearCookie('authToken')
  res.status(200);
  res.redirect('/login');
});

module.exports = {router};
