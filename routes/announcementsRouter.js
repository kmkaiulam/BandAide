'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Announcement} = require('../models');
const {jwtAuth, checkValidUser} = require('../auth')
mongoose.Promise = global.Promise;


//GET request
router.get('/', (req, res) => {
    Announcement
        .find()
        .populate({
            path: 'createdBy', 
            select: 'username firstName lastName -_id' //can name any field and populate
        })
        .then(announcements => {
            res.json(announcements);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }); 
});

//GET announcement by ID
router.get('/:id', (req, res) => {
    Announcement
        .findbyId(req.params.id)
        .populate({
            path: 'createdBy', 
            select: 'username firstName lastName -_id' //can name any field and populate
        })
        .then(announcement => {
            res.json(announcement);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }); 
});

      
//POST request
router.post('/', jwtAuth, (req, res) => {
        const requiredFields = ['text'];
        for (let i=0; i<requiredFields.length; i++) {
            const field =requiredFields;
            if(!(field in req.body)) {
                const message = `Missing \`${field}\` in request body`
                console.error(message);
                console.log(req.user);
                return res.status(400).send(message);
            }
    
        }  
        Announcement
            .create({
                text: req.body.text,
                createdBy: req.user.id,
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

//PUT Request
router.put('/:id', jwtAuth, /*checkValidUser,*/ (req, res) => {
    const requiredFields = ['text'];
    for (let i=0; i<requiredFields.length; i++) {
        const field =requiredFields[i];
        if(!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id){
        const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }
console.log(`Updating bandpost entry \`${req.params.id}\``);

  const toUpdate = {};
  const updateableFields = ['text']; 
  
  updateableFields.forEach(field => {
      if (field in req.body) {
          toUpdate[field] = req.body[field];
      }
  })
  //Add modified date to post 
  toUpdate.modified = Date.now();
  //add middleware to validate that the user owns this post, otherwise throw error
 /*
  Announcement
  .findbyId(req.params.id)
  .populate({
      path: 'createdBy', 
      select: 'username firstName lastName -_id' //can name any field and populate
  })
  .then(announcement => {
      return res.json(announcement)})
        .then (req => {
        checkValidUser(req)
        })
*/   
  Announcement
        .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
        .then(announcement => {
            console.log(announcement)
            res.status(201).send(announcement)
        })
          .catch(err => {
              console.error(err);
              res.status(500).json({ message: 'Internal server error' });         
        })
});


//DELETE Request
//Make sure the user has the rights to Delete
             



module.exports = {router};



