'use strict';

const {router: authRouter} = require('./authRouter');
const {localStrategy, jwtStrategy, jwtAuth, checkValidUser, checkRequiredFields, checkValidId} = require('./strategies');


module.exports = {authRouter, localStrategy, jwtStrategy, jwtAuth, checkValidUser, checkRequiredFields, checkValidId};
