'use strict';
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const urlParser = bodyParser.urlencoded()
const config = require('../config');
const router = express.Router();

const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false});
// The user provides a username and password to login
router.post('/login', urlParser, localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.cookie('authToken', authToken);
  res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', urlParser, jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});
// The user signs out and clears the cookie
router.get('/logout', urlParser, (req, res) => {
  res.clearCookie('authToken')
  res.redirect('/login');
});

module.exports = {router};
