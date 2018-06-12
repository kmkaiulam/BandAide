'use strict';
const {User} = require('./usersModel');
const {Post} = require('./postsModel')
const {Comment} = require ('./commentsModel');
const {Announcement} = require ('./announcementsModel');
//console.log(`index.js: ${Announcement}`);
module.exports = {User, Post, Comment, Announcement};
