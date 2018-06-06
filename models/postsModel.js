'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  'post-type': {
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
  },
  topic: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  comments: {
    type: Array,
    default: []
  }, 
  createdBy: {
      type: Schema.Types.ObjectId, ref:'User'
  },
  created: {
      type: Date, 
      default: Date.now
    }
}); 


  


UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};



const Post = mongoose.model('Post', PostSchema);

module.exports = {Post};