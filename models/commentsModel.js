'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {User, Post} = require('./')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CommentSchema = new Schema({  
    postId:{type: ObjectId, ref: 'Post'},
    text: {type: String, 
         required: true },
    createdBy: {type: ObjectId, ref: 'User'},
    created: {type: Date, default: Date.now} 
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = {Comment};