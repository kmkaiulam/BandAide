'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {User} = require('./');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const PostSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true
  },
  team: {
    type : Array,
    required: true,
    default:[]
  },
  topic: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdBy: {
      type: ObjectId, ref:'User'
  },
  created: {
      type: Date, 
      default: Date.now
    }
}); 

//how do I grab just one value from another schema? in this case I want 
//createdBy to automatically populate with the signed in user's username
  



const Post = mongoose.model('Post', PostSchema);

module.exports = {Post};