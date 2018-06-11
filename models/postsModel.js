'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const {User, Comment} = require('./');
const ObjectId = Schema.Types.ObjectId

const PostSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true
  },
  team: [{
    type : String,
    required: true,
  }],
  topic: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  comments: [{type: ObjectId, ref:'Comment'}], 
  createdBy: {
      type: {ObjectId, ref:'User'}
  },
  created: {
      type: Date, 
      default: Date.now
  }
}); 


PostSchema.methods.serialize = function(){
  return {
    id: this._id,
    type: this.type,
    priority: this.priority,
    team: this.team,
    topic: this.topic,
    content: this.content, 
    createdBy: this.createdBy,
    created: this.created,
    comments: {
                topic: this.topic,
                comment: this.comment, 
                createdBy: this.createdBy,
                created: this.created
    }
  };
};

  


const Post = mongoose.model('Post', PostSchema);

module.exports = {Post};