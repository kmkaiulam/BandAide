'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const urlParser = bodyParser.urlencoded();
const {jwtAuth, checkValidUser, checkRequiredFields} = require('../auth')
const {Bandpost} = require('../models');
mongoose.Promise = global.Promise;

// --- Bandposts ---
// --- GET ---

router.get('/', (req, res) => {
    Bandpost
        .find()
        .populate({
            path: 'createdBy', 
            select: 'username id' 
        })
        .populate({
            path: 'replies.createdBy', 
            select: 'username id' 
        })
        .then(bandposts => {
            res.json(bandposts);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }); 
});

//GET Bandpost by ID
router.get('/:id', (req,res) => {
    Bandpost
        .findById(req.params.id)
        .populate({
            path: 'createdBy', 
            select: 'username id' //can name any field and populate
        })
        .then(bandpost =>{
            res.json(bandpost)
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }); 
});

// --- POST ---
//Create New Bandpost
router.post('/', urlParser, jwtAuth, checkRequiredFields, (req, res) => {
    Bandpost
        .create({
            posttype: req.body.posttype,
            topic: req.body.topic,
            description: req.body.description,
            created: req.body.created,
            createdBy: req.user.id,
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

// --- PUT ---
//Update a Bandpost
//Check for required fields
router.put('/:id',urlParser, jwtAuth, checkValidUser, checkRequiredFields, (req, res) => {
    const requiredFields = ['bandpostId', 'posttype', 'topic', 'description'];
    for (let i=0; i<requiredFields.length; i++) {
        const field =requiredFields[i];
        if(!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.bandpostId){
        const message = `Request path id (${req.params.id}) and request body id (${req.body.bandpostId}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }
console.log(`Updating bandpost entry \`${req.params.id}\``);

  const toUpdate = {};
  const updateableFields = ['posttype', 'topic', 'description']; 
  
  updateableFields.forEach(field => {
      if (field in req.body) {
          toUpdate[field] = req.body[field];
      }
  })
  //Add modified date to post 
  toUpdate.modified = Date.now();
  console.log(toUpdate);
  //add middleware to validate that the user owns this post, otherwise throw error
  Bandpost
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

// --- DELETE ---
//DELETE a Bandpost
router.delete('/:id', urlParser, jwtAuth, checkValidUser, checkRequiredFields, (req,res) => {
    const requiredFields = ['bandpostId', 'createdById'];
    for (let i=0; i<requiredFields.length; i++) {
        const field =requiredFields[i];
        if(!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.bandpostId){
        const message = `Request path id (${req.params.id}) and request body id (${req.body.bandpostId}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }
console.log(`Deleting bandpost entry \`${req.params.id}\``);
   
    Bandpost
        .findByIdAndRemove(req.params.id)
        .then(bandpost =>{
            res.status(204).end();
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

// --- Replies ---
// --- GET ---
//GET all Replies for a Bandpost 
router.get('/reply/:id', (req,res) => {
    Bandpost
        .findById(req.params.id)
        .populate({
            path: 'replies.createdBy', 
            select: 'username id' //can name any field and populate
        })
        .then(bandpost => {
            res.json(bandpost.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }); 
});

// --- POST ---
//Add Reply to a Bandpost post
//Check for required fields
router.post('/reply/:id', urlParser, jwtAuth, checkRequiredFields, (req, res) => {
    const requiredFields = ['topic', 'reply'];
    for (let i=0; i<requiredFields.length; i++) {
        const field =requiredFields[i];
        if(!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    console.log(`Adding reply to bandpost \`${req.params.id}\``);

    
    Bandpost
        .findByIdAndUpdate(req.params.id, 
            {$push: {replies:
                        {
                        "topic": req.body.topic,
                        "reply": req.body.reply,
                        "createdBy": req.user.id
                        }
                    },
            },
            {new: true}
        )
        .then(reply => {
            res.status(201).json(reply.serialize())
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' }
            );
        });
});

// --- PUT ---
//REPLY UPDATE
router.put('/reply/:id', urlParser, jwtAuth, checkValidUser, checkRequiredFields, (req, res) => {
    const requiredFields = ['bandpostId', 'createdById', 'replyId', 'topicUpdate', 'replyUpdate'];
    for (let i=0; i<requiredFields.length; i++) {
        const field =requiredFields[i];
        if(!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.bandpostId){
        const message = `Request path id (${req.params.id}) and request body id (${req.body.bandpostId}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }
console.log(`Updating reply entry \`${req.params.id}\``);
    
    let bandPostId = req.params.id;
    let {replyId, replyUpdate, topicUpdate} = req.body;
    Bandpost
        .findById(bandPostId, function (err, bandpost) {
            let subDoc = bandpost.replies.id(replyId);
            subDoc.$set({"topic": topicUpdate});
            subDoc.$set({"reply": replyUpdate});
            subDoc.$set({"modified": Date.now()});
            bandpost.save()
                .then(result => {
                    res.status(200).json(result)
                })
       });
});

       
// ---DELETE ---
//DELETE a reply from a bandpost
router.delete('/reply/:id',urlParser, jwtAuth, checkValidUser, checkRequiredFields, (req,res) => {
    const requiredFields = ['bandpostId', 'replyId', 'createdById'];
    for (let i=0; i<requiredFields.length; i++) {
        const field =requiredFields[i];
        if(!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    /* Remove? -----
    if (req.params.id !== req.body.bandpostId){
        const message = `Request path id (${req.params.id}) and request body id (${req.body.bandpostId}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }
    */
console.log(`Deleting reply for bandpost \`${req.params.id}\``);
    Bandpost
        .findById(req.params.id)
        .then(bandpost => {
            let subDoc = bandpost.replies.id(req.body.replyId);
            subDoc.remove();
            bandpost.save(function (err) {
                if (err) {
                    console.log(err)
                } 
                res.status(204).end();
            })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
});
     
module.exports = {router};