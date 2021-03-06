'use strict';
const passport = require('passport')
const {Strategy: LocalStrategy} = require('passport-local');
const {Strategy: JwtStrategy} = require('passport-jwt');
const {User} = require('../models')
const {JWT_SECRET} = require('../config');

const localStrategy = new LocalStrategy((username, password, callback) => {
  let user;
  User.findOne({username: username})
    .then(_user => {
      user = _user;
      if (!user) {
      
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid){
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return callback(null, user);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return callback(null, false, err);
      }
      return callback(err, false);
    });
});

//JWT Cookie Extractor
let cookieExtractor = function(req){
  var token = null;
  if (req && req.cookies)
  {
      token = req.cookies.authToken;
  }
  return token;

};
const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: cookieExtractor,
    algorithms: ['HS256']
  },
  (payload, done) => {
    done(null, payload.user);
  }
);

const jwtAuth = passport.authenticate('jwt', { session: false });

module.exports = {localStrategy, jwtStrategy, jwtAuth};