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
  modified: {type: Date},
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
  youtubeLink: {
    type: String
  },
  created: {
    type: Date, 
    default: Date.now
  },
  modified:{type: Date},
  createdBy: {
      type: ObjectId, 
      ref:'User'
  },
  replies: [ReplySchema]
}); 

BandpostSchema.methods.serialize = function(){
  return  this.replies;
};

const Bandpost = mongoose.model('Bandpost', BandpostSchema);


module.exports = {Bandpost};