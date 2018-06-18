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
})

const ReplySchema = new Schema({  
  topic: {type: String, required: true},
  reply: {type: String, required: true },
  comments: [CommentSchema],
  createdBy: {type: ObjectId, ref: 'User'},
  created: {type: Date, default: Date.now} 
});



const EventevalSchema = new Schema({
  eventName: {
    type: String,
    required: true
  },
  eventDate: { 
      type: Date,
      required: true
  },
  description:{   
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




const Eventeval = mongoose.model('Event', EventevalSchema);

module.exports = {Eventeval};