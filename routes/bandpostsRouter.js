'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const {jwtAuth} = require('../auth');
const {Bandpost} = require('../models');
mongoose.Promise = global.Promise;

//CRUD

//CREATE
// --- GET ---
//GET all Bandpost
router.get('/', (req, res) => {
    Bandpost
        .find()
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
        .then(bandpost =>{
            res.json(bandpost)
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }); 
});

//GET all Replies for a Bandpost 
router.get('/reply/:id', (req,res) => {
    Bandpost
        .findById(req.params.id)
        .then(bandpost => {
            res.json(bandpost.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }); 
});


// --- Bandposts ---
//POST 

//Create New Bandpost
router.post('/', (req, res) => {
    //let {posttype, topic, description, replies} = req.body;
    
    const requiredFields = ['posttype', 'topic', 'description'];
    for (let i=0; i<requiredFields.length; i++) {
        const field =requiredFields[i];
        if(!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    Bandpost
        .create({
            posttype: req.body.posttype,
            topic: req.body.topic,
            description: req.body.description,
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

//Update a Bandpost
//Check for required fields
router.put('/:id', (req, res) => {
    const requiredFields = ['id', 'posttype', 'topic', 'description'];
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


// --- Replies ---
//POST
//Add Reply to a Bandpost post



//Check for required fields
router.post('/reply/:id', (req, res) => {
    const requiredFields = ['topic', 'reply'];
    for (let i=0; i<requiredFields.length; i++) {
        const field =requiredFields[i];
        if(!(field in req.body.replies)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    console.log(`Adding reply to bandpost \`${req.params.id}\``);

    
    Bandpost
        .findByIdAndUpdate(req.params.id, 
            {$push: 
                {
                "replies":
                    {
                    "topic": req.body.replies.topic,
                    "reply": req.body.replies.reply
                    }
                }
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

//PUT
//REPLY UPDATE
router.put('/reply/:id', (req, res) => {
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

       






//DELETE need to add middleware to validate that user owns this or throw error
//router.delete('/:id', (req, res))


module.exports = {router};