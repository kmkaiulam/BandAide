'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  comments:{
    topic: {type: String},
    comment: {type: String},
    createdBy: Schema.Types.ObjectId, ref:'User', // how to grab schema from other file? do i need to use require('./usersModel')?
    created: {type: Date, default: Date.now}
  }
});
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
  comments: {
   // CommentSchema // how do I put the comment schema inside the post schema? - going to be an array of objects

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

Post.methods.serialize = function(){
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

module.exports = {Post};