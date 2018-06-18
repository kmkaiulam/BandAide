'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {User} = require('./');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const CommentSchema = new Schema({ 
  comment:{type: String, required: true },
  createdby: {type: ObjectId, ref: 'User'},
  created: {type: Date, default: Date.now} 
});

const ReplySchema = new Schema({  
  topic: {type: String, required: true},
  reply: {type: String, required: true },
  comments: [CommentSchema],
  createdBy: {type: ObjectId, ref: 'User'},
  created: {type: Date, default: Date.now} 
});





const TrainingSchema = new Schema({
  topic: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  replies: [ReplySchema],
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
  



const Training = mongoose.model('Training', TrainingSchema);

module.exports = {Training};