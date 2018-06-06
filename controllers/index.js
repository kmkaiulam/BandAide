'use strict';
const {router : usersController } = require('./usersController');
const {router : postsController} = require('./postController');
const {router : authController} = require('./authController');

module.exports = {usersController, postsController, authController};
