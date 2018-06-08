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
            res.json(posts);
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
    const requiredFields = ['post-type', 'priority', 'team', 'topic', 'content'];
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
            'post-type': req.body.post-type,
            priority: req.body.priority,
            team: req.body.team,
            topic: req.body.topic,
            content: req.body.content
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
              
   




module.exports = {router};