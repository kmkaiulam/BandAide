const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');
const {User, Announcement, Bandpost} = require('../models');
chai.use(chaiHttp);

const {app, runServer, closeServer} = require ('../server')
const {TEST_DATABASE_URL} = require('../config');
mongoose.Promise = global.Promise;
// --- Global Variables
let newUsers = [];
let unhashedUsers;


//--- Generate New Posts
function generateNewAnnouncement(){
    return {
        posttype: 'Announcement',
        text: faker.lorem.paragraph()
    }
}

function generateNewTraining(){
    return {
        posttype: 'Training_Resource',
        topic: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(),
        youtubeLink: 'https://www.youtube.com/watch?v=hq8uXO4FelQ'
    }  
};


function generateNewReply(newUsers){
    return {  topic: faker.lorem.words(),
              reply: faker.lorem.paragraphs(),
              created: Date.now()
    }    
};          


// --- Generate For Seed Data
function generateUserData(){
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.internet.userName(),
        password: '123123',
    }
};

function generateAnnouncementPost(newUsers){
    return {
        posttype: 'Announcement',
        text: faker.lorem.paragraph(),
        createdBy: newUsers[0]._id,
        created: Date.now()
    }
}

function generateEventBandpost(newUsers){
    return {
        posttype: 'Event_Eval',
        topic: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(),
        createdBy: newUsers[0]._id,
        created: Date.now()
    };
}

function generateTrainingBandpost(newUsers){
    let newReply = generateReply(newUsers);
    return {
        posttype: 'Training_Resource',
        topic: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(),
        youtubeLink: 'https://www.youtube.com/watch?v=hq8uXO4FelQ',
        createdBy: newUsers[0]._id,
        created: Date.now(),
        replies:  newReply
    }  
};


function generateReply(newUsers){
    return {  topic: faker.lorem.words(),
              reply: faker.lorem.paragraphs(),
              createdBy: newUsers[1]._id,
              created: Date.now()
    }    
};          





//Not sure why but... i'm getting my supposedly unhashed user object, as hashed... so i needed to hardcode the password so i can access my database
// --- Seeding Data
function seedUserData(){
    console.info ('seeding User data')
    let user = [];
    let hashedPassword = [];
    for (let i = 0; i<2; i++){
        user.push(generateUserData());
    }
    unhashedUsers = user;
    let newHashedUsers = user;
    for (let i = 0; i<2; i++){
        hashedPassword.push(User.hashPassword(user[i].password))
    }
    return Promise.all(hashedPassword)
        .then (hashedPassword => {
            newHashedUsers[0].password = hashedPassword[0]
            newHashedUsers[1].password= hashedPassword[1]
            return User.insertMany(newHashedUsers)
        })
        .then(newHashedUsers =>{ 
            newUsers.push(newHashedUsers[0])
            newUsers.push(newHashedUsers[1])
        })
};
            
function seedAnnouncementData(newUsers){
    console.info ('seeding Announcement data')
    const announcementData = [];
    for (let i = 1; i<=2; i++){
        announcementData.push(generateAnnouncementPost(newUsers));
    };
    return Announcement.insertMany(announcementData);
};

function seedEventData(newUsers){
    console.info ('seeding Event data')
    const eventData = [];
    for (let i = 1; i<=2; i++){
        eventData.push(generateEventBandpost(newUsers));
    };
    return Bandpost.insertMany(eventData);
};

function seedTrainingData(newUsers){
    console.info ('seeding Training data')
    const trainingData = [];
    for (let i = 1; i<=2; i++){
        trainingData.push(generateTrainingBandpost(newUsers));
    };
    return Bandpost.insertMany(trainingData);
};


function seedData(){
    return seedUserData()
        .then (data =>{
        return  Promise.all([seedAnnouncementData(newUsers), seedEventData(newUsers), seedTrainingData(newUsers)])
            .then (values => {
                console.log('working')
            });
        });
};





function dropDatabase(){
    console.warn('Deleting Database');
    return mongoose.connection.dropDatabase();
}

describe('BandAide API resource', function(){

    before(function(){
       return runServer(TEST_DATABASE_URL)
       .then (data => {
           return seedData();
       });
    });
    

    after(function(){
        return dropDatabase()
        .then(data => {
        return closeServer();
        });
    });




    describe('GET Announcements', function(){
        
        it('should return all Announcements', function(){
            let res;
            return chai.request(app)
                .get('/api/announcements')
                .then(_res => {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.lengthOf.at.least(1);
                    return Announcement.count();
                })
                    .then(count => {
                    expect(res.body).to.have.lengthOf(count);
                    });
        });   
    
    
   
        it('should return all Announcements with the correct fields', function(){
            return chai.request(app)
                .get('/api/announcements')
                .then(res => {   
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res).to.be.a('object');
                    res.body.forEach(function(post){
                        expect(post).to.include.keys('_id','posttype','text','createdBy', 'created');
                        expect(post.posttype).to.equal('Announcement')
                        expect(post._id).to.be.a('string');
                        expect(post.posttype).to.be.a('string');
                        expect(post.text).to.be.a('string');
                        expect(post.created).to.be.a('string');
                        expect(post.createdBy).to.be.a('object');
                        expect(post.createdBy).to.include.keys('_id', 'username');
                        expect(post.createdBy._id).to.be.a('string');
                        expect(post.createdBy.username).to.be.a('string');
                    });   
                });
        });
    });


    describe('GET Bandposts', function(){

        it('should return all Event_Eval Bandposts', function(){
            let res;
            return chai.request(app)
                .get('/api/bandposts/events')
                .then(_res => {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.lengthOf.at.least(1);
                    return Bandpost.find({'posttype': 'Event_Eval'}).count();
                })
                    .then(count => {
                        expect(res.body).to.have.lengthOf(count);
                    });
        });

        it('should return all Event_Eval Bandposts with correct fields', function(){
            return chai.request(app)
            .get('/api/bandposts/events')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res).to.be.a('object');
                res.body.forEach(function(post){
                    expect(post).to.include.keys('_id','posttype','topic', 'description', 'replies', 'created', 'createdBy');
                    expect(post.posttype).to.equal('Event_Eval')
                    expect(post._id).to.be.a('string');
                    expect(post.posttype).to.be.a('string');
                    expect(post.topic).to.be.a('string');
                    expect(post.description).to.be.a('string');
                    expect(post.replies).to.be.a('array');
                    expect(post.created).to.be.a('string'); 
                    expect(post.createdBy).to.be.a('object');
                    expect(post.createdBy).to.include.keys('_id', 'username');
                    expect(post.createdBy._id).to.be.a('string');
                    expect(post.createdBy.username).to.be.a('string');
                });
            });
        });

        it('should return all Training_Resource Bandposts', function(){
            let res
            return chai.request(app)
                .get('/api/bandposts/training')
                .then(_res => {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.lengthOf.at.least(1);
                    return Bandpost.find({'posttype': 'Training_Resource'}).count();
                })
                    .then(count => {
                        expect(res.body).to.have.lengthOf(count);
                    });
        });

        it('should return all Training_Resource Bandposts with correct fields', function(){
            let postReplies;
            return chai.request(app)
            .get('/api/bandposts/training')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res).to.be.a('object');
                res.body.forEach(function(post){
                    expect(post).to.include.keys('_id','posttype','topic', 'description', 'youtubeLink', 'replies', 'created', 'createdBy');
                    expect(post.posttype).to.equal('Training_Resource')
                    expect(post._id).to.be.a('string');
                    expect(post.posttype).to.be.a('string');
                    expect(post.topic).to.be.a('string');
                    expect(post.description).to.be.a('string');
                    expect(post.youtubeLink).to.be.a('string');
                    expect(post.replies).to.be.a('array');
                    postReplies = post.replies[0];
                    expect(postReplies.topic).to.be.a('string');
                    expect(postReplies.reply).to.be.a('string');
                    expect(postReplies.created).to.be.a('string');
                    expect(postReplies.createdBy).to.be.a('object');
                    expect(postReplies.createdBy).to.include.keys('_id', 'username');
                    expect(postReplies.createdBy._id).to.be.a('string');
                    expect(postReplies.createdBy.username).to.be.a('string');
                    expect(post.created).to.be.a('string'); //technically a date... but Date.now() is a string?
                    expect(post.createdBy).to.be.a('object');
                    expect(post.createdBy).to.include.keys('_id', 'username');
                    expect(post.createdBy._id).to.be.a('string');
                    expect(post.createdBy.username).to.be.a('string');
                });
            });
        });  
    });


    describe('POST User', function(){

        it('should create a new User', function(){
            let newUser = generateUserData()
            let user;
                return chai.request(app)
                .post('/api/users')
                .send(newUser)
                .then(res => {
                    expect(res).to.have.status(201) 
                    expect(res).to.be.json;
                    expect(res).to.be.a('object');
                    user = res.body;
                    console.log(user);
                    expect(user).to.include.keys('firstName', 'lastName', 'username', 'id');
                    expect(user.firstName).to.be.a('string');
                    expect(user.lastName).to.be.a('string');
                    expect(user.username).to.be.a('string');
                    expect(user.firstName).to.equal(newUser.firstName)
                    expect(user.lastName).to.equal(newUser.lastName)
                    expect(user.username).to.equal(newUser.username)
                    expect(user.id).to.be.a('string');
                 return User.findById(user.id)
                })
                .then(dbUser => {
                    expect(String(dbUser._id)).to.equal(user.id);
                    expect(dbUser.firstName).to.equal(newUser.firstName);
                    expect(dbUser.lastName).to.equal(newUser.lastName);
                    expect(dbUser.username).to.equal(newUser.username);
                });            
        });
    });

    describe('Auth Route Login Process', function(){
        //Login
        it('should allow a registered user to login and return a cookie', function(){ 
            let agent = chai.request.agent(app)
            return agent
                .post('/api/auth/login')
                .send({username: newUsers[0].username , password: '123123'})
                .then(function(res){
                    expect(res).to.have.status(200);
                    expect(res).to.have.cookie('authToken');
            });
        });
    
        //Logout
        it('should allow a registered user to signout and clear the cookie', function(){
            let agent = chai.request.agent(app)
            return agent
            .post('/api/auth/login')
            .send({username: newUsers[0].username , password: '123123'})
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.have.cookie('authToken')
            return agent
            .get('/api/auth/logout')
            })
            .then(function (res){
                expect(res).to.have.status(200);
                expect(res).to.not.have.cookie('authToken');
            });
        });
    });

    describe('Authenticated Announcement Endpoints', function(){

        it('should POST a new announcement for an authenticated user', function(){
            let newAnnouncement = generateNewAnnouncement();
            let agent = chai.request.agent(app)
            return agent
                .post('/api/auth/login')
                .send({username: newUsers[0].username , password: '123123'})
                .then(function(res){
                    expect(res).to.have.status(200);
                    expect(res).to.have.cookie('authToken')
            return agent
            .post('/api/announcements')
            .send(newAnnouncement)
            })
            .then(res => {
                resAnnounce = res.body
                expect(res).to.have.status(201)
                expect(res.body).to.include.keys('_id','posttype','text','createdBy', 'created');
                expect(res.body.posttype).to.equal('Announcement')
                expect(res.body._id).to.be.a('string');
                expect(res.body.posttype).to.be.a('string');
                expect(res.body.text).to.be.a('string');
                expect(res.body.created).to.be.a('string'); //technically a date... but Date.now() is a string?
                expect(res.body.createdBy).to.be.a('object');
                expect(res.body.createdBy).to.include.keys('_id', 'username');
                expect(res.body.createdBy._id).to.be.a('string');
                expect(res.body.createdBy.username).to.be.a('string');
                return Announcement.findById(res.body._id)
            })
                .then(post => {
                    expect(String(post._id)).to.equal(resAnnounce._id);
                    expect(post.posttype).to.equal(resAnnounce.posttype);
                    expect(post.text).to.equal(resAnnounce.text);
                    expect(String(post.createdBy._id)).to.equal(resAnnounce.createdBy._id);
                    expect(Date(post.created)).to.equal((Date(resAnnounce.created)));
                });
        });
        
        it('should Update (PUT) an announcement with all the correct fields and proper fields changed', function(){
            let newAnnouncement = generateNewAnnouncement();
            let update = generateNewAnnouncement();
            let agent = chai.request.agent(app)
            let original;
            return agent
                .post('/api/auth/login')
                .send({username: newUsers[0].username , password: '123123'})
                .then(function(res){
            return agent
            .post('/api/announcements')
            .send(newAnnouncement)
            })
            .then(res =>{
                original = res.body
                update.announcementsId= original._id
                update.createdById= original.createdBy._id
            return agent
            .put(`/api/announcements/${original._id}`)
            .send(update)  
            })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res).to.be.a('object');
            return Announcement.findById(res.body._id)
            })
            .then(newPost => {
                expect(String(newPost._id)).to.equal(original._id);
                expect(Date(newPost.created)).to.equal(Date(original.created));
                expect(String(newPost.createdBy)).to.equal(original.createdBy._id);
                expect(newPost.posttype).to.equal(update.posttype);
                expect(newPost.text).to.equal(update.text);              
                expect(newPost.modified).to.be.a('Date');
            })
        });

        it('should DELETE an Announcement', function(){
            let newAnnouncement = generateNewAnnouncement();
            let deleteRequest = {};
            let agent = chai.request.agent(app)
            return agent
                .post('/api/auth/login')
                .send({username: newUsers[0].username , password: '123123'})
                .then(function(res){
            return agent
            .post('/api/announcements')
            .send(newAnnouncement)
            })
            .then(res =>{
                deleteRequest.announcementsId = res.body._id
                deleteRequest.createdById= res.body.createdBy._id
            return agent
            .delete(`/api/announcements/${res.body._id}`)
            .send(deleteRequest)   
            })
            .then(res => {
                expect(res).to.be.status(204);
            return Announcement.findById(deleteRequest.announcementsId)
            })
            .then(res =>{
                expect(res).to.be.null;
            }); 
        });
    });

    describe('Authenticated BandPost Endpoints', function(){

        it('should POST a New BandPost with all the proper fields', function(){ 
            let newBandpost = generateNewTraining();
            let bandpost;
            let agent = chai.request.agent(app)
            return agent
                .post('/api/auth/login')
                .send({username: newUsers[0].username , password: '123123'})
                .then(function(res){
            return agent
            .post('/api/bandposts')
            .send(newBandpost)
            })
            .then(res => {
                expect(res).to.be.status(201);
                expect(res).to.be.json;
                 bandpost = res.body;
                expect(bandpost).to.include.keys('_id','posttype','topic', 'description', 'replies', 'createdBy', 'created');
                expect(bandpost.posttype).to.equal('Training_Resource')
                expect(bandpost._id).to.be.a('string');
                expect(bandpost.posttype).to.be.a('string');
                expect(bandpost.topic).to.be.a('string');
                expect(bandpost.description).to.be.a('string');
                expect(bandpost.replies).to.be.a('array');
                expect(bandpost.created).to.be.a('string'); 
                expect(bandpost.createdBy).to.be.a('object');
                expect(bandpost.createdBy).to.include.keys('_id', 'username');
                expect(bandpost.createdBy._id).to.be.a('string');
                expect(bandpost.createdBy.username).to.be.a('string');
            return Bandpost.findById(bandpost._id)
            })
            .then(newPost =>{
                expect(String(newPost._id)).to.equal(bandpost._id);
                expect(newPost.posttype).to.equal(bandpost.posttype);
                expect(newPost.topic).to.equal(bandpost.topic);
                expect(newPost.description).to.equal(bandpost.description);
                expect(newPost.replies).to.deep.equal(bandpost.replies);
                expect(String(newPost.createdBy)).to.equal(bandpost.createdBy._id);
                expect(Date(newPost.created)).to.equal(Date(bandpost.created));
            })
        });

        it('should PUT a Bandpost', function(){
            let newBandpost = generateNewTraining();
            let update = generateNewTraining();
            let original;
            let agent = chai.request.agent(app)
            return agent
                .post('/api/auth/login')
                .send({username: newUsers[0].username , password: '123123'})
                .then(function(res){
            return agent
            .post('/api/bandposts')
            .send(newBandpost)
        })
            .then(res =>{
                original = res.body
                update.bandpostsId= original._id
                update.createdById= original.createdBy._id
            return agent
            .put(`/api/bandposts/${original._id}`)
            .send(update)   
            })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res).to.be.a('object');
            return Bandpost.findById(res.body._id)
            })
            .then(newBandpost => {
                expect(newBandpost.posttype).to.equal(original.posttype);
                expect(Date(newBandpost.created)).to.equal(Date(original.created));
                expect(String(newBandpost.createdBy)).to.equal(original.createdBy._id);
                expect(String(newBandpost._id)).to.equal(original._id);
                expect(newBandpost.topic).to.equal(update.topic);
                expect(newBandpost.description).to.equal(update.description);
                expect(newBandpost.modified).to.be.a('Date');
            });
        });

        it('should DELETE a Bandpost', function(){
            let newBandpost = generateNewTraining();
            let deleteRequest = {};
            let agent = chai.request.agent(app)
            return agent
                .post('/api/auth/login')
                .send({username: newUsers[0].username , password: '123123'})
                .then(function(res){
            return agent
            .post('/api/bandposts')
            .send(newBandpost)
            })
            .then(res =>{
                deleteRequest.bandpostsId = res.body._id
                deleteRequest.createdById= res.body.createdBy._id
            return agent
            .delete(`/api/bandposts/${res.body._id}`)
            .send(deleteRequest)   
            })
            .then(res => {
                expect(res).to.be.status(204);
            return Bandpost.findById(deleteRequest.bandpostsId)
            })
            .then(res =>{
                expect(res).to.be.null;
            }); 
        });
    });


    describe('Authenticated Reply Routes', function(){

        it('POST a new Reply', function(){
            let replies;
            let newBandpost = generateNewTraining();
            let creator;
            let replyRequest = generateNewReply();
            let agent = chai.request.agent(app)
            return agent
                .post('/api/auth/login')
                .send({username: newUsers[0].username , password: '123123'})
                .then(function(res){
            return agent
            .post('/api/bandposts')
            .send(newBandpost)
            })
            .then(res =>{
                replyRequest.bandpostsId = res.body._id
                creator = res.body.createdBy._id;
            return agent
            .post(`/api/bandposts/reply/${replyRequest.bandpostsId}`)
            .send(replyRequest)
            })
            .then(res => {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                replies = res.body;
                postReply = replies[0]
                expect(replies).to.be.a('array')
                expect(postReply).to.be.a('object');
                expect(postReply).to.include.keys('_id', 'topic', 'reply', 'created', 'createdBy')
                expect(postReply.createdBy).to.include.keys('_id', 'username');
                expect(postReply.topic).to.be.a('string');
                expect(postReply.reply).to.be.a('string');
                expect(postReply.created).to.be.a('string');
                expect(postReply.createdBy).to.be.a('object');
                expect(postReply._id).to.exist;
            return Bandpost.findById(replyRequest.bandpostsId)
            })
            .then(post => {
                newReply = post.replies[0];
                console.log(newReply);
                expect(newReply.topic).to.equal(postReply.topic);
                expect(newReply.reply).to.equal(postReply.reply);
                expect(Date(newReply.created)).to.equal(Date(postReply.topic));
                expect(String(newReply.createdBy)).to.equal(creator);
            });
        });
        
        it('DELETE a Reply', function(){
            let replyRequest = generateNewReply();
            let deleteRequest = {};
            let newBandpost = generateNewTraining();
            let agent = chai.request.agent(app)
            return agent
                .post('/api/auth/login')
                .send({username: newUsers[0].username , password: '123123'})
                .then(function(res){
            return agent
            .post('/api/bandposts')
            .send(newBandpost)
            })
            .then(res =>{
                replyRequest.bandpostsId = res.body._id;
                deleteRequest.bandpostsId = res.body._id;
                deleteRequest.createdById = res.body.createdBy._id;
            return agent
            .post(`/api/bandposts/reply/${replyRequest.bandpostsId}`)
            .send(replyRequest)
            })
            .then(res => {
                deleteRequest.replyId = res.body[0]._id
            return agent
            .delete(`/api/bandposts/reply/${deleteRequest.bandpostsId}`)
            .send(deleteRequest);
            })
            .then(res =>{
                expect(res).to.have.status(204);
            return Bandpost.findById(deleteRequest.bandpostsId)
            })
            .then(res =>{
                let response = res.replies;
                expect(response).to.be.empty;
            })
        });
    });
});








    

