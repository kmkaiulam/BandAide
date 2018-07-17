'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const AnnouncementSchema = new Schema({
    posttype: {type: String, required: true },
    text: {type: String, required: true },
    modified: {type: Date},
    created: {type: Date, default: Date.now()},
    createdBy: {type: ObjectId, ref: 'User'}
    //want to add an expiration date to these that can be set. not sure where i will do that to hide or archive old announcements
});

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

module.exports = {Announcement};