'use strict';
const {router : usersRouter } = require('./usersRouter');
const {router : postsRouter} = require('./postsRouter');
const {router : authRouter} = require('./authRouter');

module.exports = {usersRouter, postsRouter, authRouter};
