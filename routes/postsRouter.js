'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {Post} = require('../models');

const jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;

//CRUD

//CREATE
//GET all posts
router.get('/', (req, res) => {
    Post
        .find()
        .then(posts => {
            res.json(posts.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }); 
});

//Get post by ID
router.get('/:id', (req,res) => {
    Post
        .findById(req.params.id)
        .then(posts =>{
            res.json(posts)
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }); 
});

//POST
router.post('/', (req, res) => {
    const requiredFields = ['type', 'priority', 'team', 'topic', 'content'];
    for (let i=0; i<requiredFields.length; i++) {
        const field =requiredFields[i];
        if(!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }

    }
    Post
        .create({
            type: req.body.type,
            priority: req.body.priority,
            team: req.body.team,
            topic: req.body.topic,
            content: req.body.content,
            comments: req.body.comments
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
//----How can i write a middleware to only allow delete and edit for an entry if you're the owner?----
//PUT
router.put('/:id', (req, res) => {
    const requiredFields = ['id','type', 'priority', 'team', 'topic', 'content'];
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
  const updateableFields = ['type', 'priority', 'team', 'topic', 'content']; 
  
  updateableFields.forEach(field => {
      if (field in req.body) {
          toUpdate[field] = req.body[field];
      }
  })
  
  Post
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
//---------------- Want to include middleware to ensure you are the same user who posted the entry or comment
//Include middleware to make sure you don't delete a post that includes comments
//should only be an admin privilege to remove those posts
//DELETE
router.delete('/:id', (req, res) => {
    Post
        .findByIdAndRemove(req.params.id)
        .then(post => {
            console.log(`Deleted post \`${req.params.id}\``);
            res.status(204).end();
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' }); 
        });
});


module.exports = {router};