'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const {User} = require('./');
const ObjectId = Schema.Types.ObjectId

const CommentSchema = new Schema({
    topic: {type: String},
    comment: {type: String},
    createdBy: {type: ObjectId, ref:'User'}, // how to grab schema from other file? do i need to use require('./usersModel')?
    created: {type: Date, default: Date.now}
});

const Comment = mongoose.model('Comment', CommentSchema);
// going to write comment section in postsRouter to make sure the values are strings

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



//how do I grab just one value from another schema? in this case I want 
//createdBy to automatically populate with the signed in user's username
  



const Post = mongoose.model('Post', PostSchema);

module.exports = {Post, Comment};