'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const urlParser = bodyParser.urlencoded();
const {Announcement} = require('../models');
const {jwtAuth, checkValidUser, checkRequiredFields, checkValidId} = require('../auth')
mongoose.Promise = global.Promise;


// --- Common Functions ---
function populateAnnouncements(req, res){
    Announcement
    .find()
    .populate({
        path: 'createdBy', 
        select: 'username _id' //can name any field and populate
    })
    .then(populatedPosts =>{
        if(req.method === 'GET'){
        res.json(populatedPosts);
        }
        else{
            res.status(201).json(populatedPosts)
        }
    })
    .catch(err =>{
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }); 
};


// --- GET ---
//GET request
router.get('/', (req, res) =>{
  populateAnnouncements(req,res);
});

/* MIGHT NOT NEED THIS ONE
//GET announcement by ID
router.get('/:id', (req, res) =>{
    
    Announcement
        .findById(req.params.id)
        .populate({
            path: 'createdBy',
            select: 'username _id' //can name any field and populate
        })
        .then(announcement =>{
            res.json(announcement);
        })
        .catch(err =>{
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }); 
});
*/
      
// --- POST ---
router.post('/',urlParser, jwtAuth, checkRequiredFields, (req, res) =>{
    Announcement
        .create({
             text: req.body.text,
             created: req.body.created,
             createdBy: req.user.id 
        })
        .then(post =>{
           populateAnnouncements(req,res)
              });
});

// --- PUT ---
router.put('/:id', urlParser, jwtAuth, checkValidUser, checkRequiredFields, (req, res) =>{
console.log(`Updating bandpost entry \`${req.params.id}\``);
  const toUpdate = {};
  const updateableFields = ['text']; 

  updateableFields.forEach(field =>{
      if (field in req.body){
          toUpdate[field] = req.body[field];
      }
  })
  //Add modified date to post 
  toUpdate.modified = Date.now();

  Announcement
        .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
        .then(announcement =>{
           populateAnnouncements(req,res)
        });
});



// --- DELETE ---
router.delete('/:id', urlParser, jwtAuth, checkValidUser, checkRequiredFields, (req,res) => {
console.log(`Deleting bandpost entry \`${req.params.id}\``);
   
    Announcement
        .findByIdAndRemove(req.params.id)
        .then(Announcement =>{
            res.status(204).end();
        })
        .catch(err =>{
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
});
           



module.exports = {router};



