'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//const {User} = require('./')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const AnnouncementSchema = new Schema({  
    text: {type: String, 
         required: true },
    createdBy: {type: ObjectId, ref: 'User'},
    created: {type: Date} 
});

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

module.exports = {Announcement};