'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ReplySchema = new Schema({  
  topic: {
    type: String
  },
  reply: {
    type: String, 
    required: true 
  },
  created: {
    type: Date,
    default: Date.now
  }, 
  modified:{
    type: Date
  },
  createdBy:{
    type: ObjectId, 
    ref: 'User'
  }
});



const BandpostSchema = new Schema({
  posttype: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  created: {
    type: Date, 
    default: Date.now
  },
  modified:{
    type: Date
  },
  createdBy: {
      type: ObjectId, 
      ref:'User'
  },
  replies: [ReplySchema]
}); 

//how do I grab just one value from another schema? in this case I want 
//createdBy to automatically populate with the signed in user's username
  
BandpostSchema.methods.serialize = function() {
  return  this.replies;
};

const Bandpost = mongoose.model('Bandpost', BandpostSchema);


module.exports = {Bandpost};