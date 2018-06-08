'use strict';
const express = require('express');
const router = express.Router();

const {router : usersRouter } = require('./usersRouter');
const {router : postsRouter} = require('./postsRouter');
const {router : authRouter} = require('./authRouter');


//Resources













module.exports = {usersRouter, postsRouter, authRouter};
