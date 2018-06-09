'use strict';
const {User} = require('./usersModel');
const {Post, Comment} = require('./postsModel')
//const {Comment} = require('./postsModel') //('./commentsModel)
module.exports = {User, Post, Comment};
