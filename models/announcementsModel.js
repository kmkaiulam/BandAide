'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const AnnouncementSchema = new Schema({  
    text: {type: String, required: true },
    createdBy: {type: ObjectId, ref: 'User'},
    created: {type: Date, default: Date.now()} 
    //want to add an expiration date to these that can be set. not sure where i will do that to hide or archive old announcements
});

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

module.exports = {Announcement};