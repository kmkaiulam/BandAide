'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {Announcement} = require('../models');
const {User} = require('../models');

const jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;


//GET request
router.get('/', (req, res) => {
    Announcement.find()
        .select("")
        .populate('createdBy', 'username')
        .exec(announcement => {
            console.log(announcement);
        });
})

router.post('/', (req, res) => {
        const requiredFields = ['text', 'createdBy'];
        for (let i=0; i<requiredFields.length; i++) {
            const field =requiredFields[i];
            if(!(field in req.body)) {
                const message = `Missing \`${field}\` in request body`
                console.error(message);
                return res.status(400).send(message);
            }
    
        }
        Announcement
            .create({
                text: req.body.text,
                createdBy: User.findOne({username:req.body.username}),
                created: req.body.created 
              })
              .then(post => {
                  res.status(201).json(post)
              })
              .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error'})

              })
});
             



module.exports = {router};



