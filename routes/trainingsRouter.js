'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {Training} = require('../models');
const {User} = require('../models');
const jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;


//CREATE
//GET all feedback
router.get('/', (req, res) => {
    Training
        .find()
        .then(posts => {
            res.json(posts);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }); 
});

//GET feedback by ID
router.get('/:id', (req,res) => {
    Training
        .findById(req.params.id)
        .then(post =>{
            res.json(post)
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }); 
});



//POST
router.post('/', (req, res) => {
    const requiredFields = ['topic', 'content'];
    for (let i=0; i<requiredFields.length; i++) {
        const field =requiredFields[i];
        if(!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }

    }
    Training
        .create({
           topic: req.body.topic,
           content: req.body.content,
           replies: req.body.replies
          })
          .then(post => {
              res.status(201).json(post)
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' }
        );
    });
}); 
              
   
//PUT
router.put('/:id', (req, res) => {
    const requiredFields = ['id', 'topic', 'content'];
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
console.log(`Updating blog post entry \`${req.params.id}\``);

  const toUpdate = {};
  const updateableFields = ['topic', 'content']; 
  
  updateableFields.forEach(field => {
      if (field in req.body) {
          toUpdate[field] = req.body[field];
      }
  })
  
//add middleware to validate that the user owns this post, otherwise throw error
 Training
      .findByIdAndUpdate(req.params.id, {$set: toUpdate}, { new: true })
        .then(post => {
            console.log(post)
            res.status(201).send(post)
        })
          .catch(err => {
              console.error(err);
              res.status(500).json({ message: 'Internal server error' }); 
          });
});

//DELETE need to add middleware to validate that user owns this or throw error
//router.delete('/:id', (req, res))





module.exports = {router};