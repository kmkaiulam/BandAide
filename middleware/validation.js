'use strict';

const checkValidUser = function(req,res,next) { 
    console.log(`this is req.body.createdById ${req.body.createdById}`);
    console.log(`this is req.user.id ${req.user.id}`);
    if(!(req.body.createdById === req.user.id)) {
      const message = `You don't have the rights to modify/delete this entry`
      console.error(message);
      return res.status(400).send(message);
    }
    next();
  }
  
  const checkRequiredFields = function(req,res,next) {
    console.log(req.body);
    let resourceName = req.originalUrl.split('/')[2];
    let nestedResourceName = req.originalUrl.split('/')[3];
    let requestMethod = req.method;
    let requiredFields;
  
    //write conditionals based on the Original url and the type of request that is being made)
    //*SWITCH
      // --- ANNOUNCEMENTS ---
    if (resourceName === 'announcements' && requestMethod === 'POST') {
       requiredFields = ['posttype', 'text'];
    }
    if (resourceName === 'announcements' && requestMethod === 'PUT') {
       requiredFields = ['posttype', 'announcementsId', 'createdById','text'];
    }
    if (resourceName === 'announcements' && requestMethod === 'DELETE') {
       requiredFields = ['announcementsId', 'createdById'];
    }
    // --- BANDPOSTS ---
    if (resourceName === 'bandposts' && requestMethod === 'POST') {
       requiredFields = ['posttype', 'topic', 'description'];
    }
    if (resourceName === 'bandposts' && requestMethod === 'PUT') {
       requiredFields = ['bandpostsId','createdById', 'posttype', 'topic', 'description'];
    }
    if (resourceName === 'bandposts' && requestMethod === 'DELETE') {
       requiredFields = ['bandpostsId', 'createdById'];
    }
    // --- REPLIES ---
    if (nestedResourceName === 'reply' && requestMethod === 'POST') {
       requiredFields = ['topic', 'reply'];
    }
    if (nestedResourceName === 'reply' && requestMethod === 'PUT') {
       requiredFields = ['bandpostsId', 'createdById', 'replyId', 'topicUpdate', 'replyUpdate'];
    }
    if (nestedResourceName === 'reply' && requestMethod === 'DELETE') {
       requiredFields = ['bandpostsId', 'replyId', 'createdById'];
    }
      console.log(nestedResourceName);
      for (let i=0; i<requiredFields.length; i++) {
        const field =requiredFields[i];
        if(!(field in req.body) || field === null) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
      }
      next()
  };



  //Consider deleting this middleware
const checkValidId = function(req, res, next) {   //Not sure If i want this  or if i want to rewrite it <-----------------
    let resourceName = req.originalUrl.split('/')[2];
    console.log(resourceName)
    let specialId = req.body`.${resourceName}Id`.trim()
   
    console.log('Checking Valid Id');
    if (req.params.id !== specialId){
      const message = `Request path id (${req.params.id}) and request body (id) (${specialId}) must match`;
      console.error(message);
      return res.status(400).send(message); 
    }
    next();
  };
  
  module.exports = {checkValidUser, checkRequiredFields, checkValidId};