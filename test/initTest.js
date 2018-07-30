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

// --- Generate Data
function generateUserData(){
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
    }
};

// if i generate on the backend.... what should i do about username, userId? these posts will be missing them unless i populate beforehand
//but with what user? they don't exist before I enter it - issue with nested schemas
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
    return {
        posttype: 'Training_Resource',
        topic: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(),
        youtubeLink: 'https://www.youtube.com/watch?v=hq8uXO4FelQ',
        createdBy: newUsers[0]._id,
        created: Date.now()
    }
};

function generateReplyBandpost(newUsers){
    return { 
            posttype: 'Event_Eval',
            topic: faker.lorem.sentence(),
            description: faker.lorem.paragraphs(),
            created: Date.now(),
            createdBy: newUsers[0]._id,
            replies: {
                    topic: faker.lorem.words(),
                    reply: faker.lorem.paragraphs(),
                    createdBy: newUsers[1]._id,
                    created: Date.now()
            }    
    }          
};


// --- Seeding Data
function seedUserData(){
    console.info ('seeding User data')
    let user = [];
    let hashedPassword = [];
    for (let i = 0; i<2; i++){
        user.push(generateUserData());
    }
    unhashedUsers = user;
    for (let i = 0; i<2; i++){
        hashedPassword.push(User.hashPassword(user[i].password))
    }
    return Promise.all(hashedPassword)
        .then (hashedPassword => {
            user[0].password = hashedPassword[0]
            user[1].password= hashedPassword[1]
            return User.insertMany(user)
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

function seedReplyData(newUsers){
    console.info('seeding Reply data');
    const replyData = [];
    for (let i = 1; i<=2; i++){
        replyData.push(generateReplyBandpost(newUsers));
    };
    return Bandpost.insertMany(replyData);
};

function seedData(){
    return seedUserData()
        .then (data =>{
        return  Promise.all([seedAnnouncementData(newUsers), seedEventData(newUsers),  seedTrainingData(newUsers), seedReplyData(newUsers)])
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
       return runServer(TEST_DATABASE_URL);
        
    });

    beforeEach(function(){
        return seedData()
    });
    

    afterEach(function(){
        return dropDatabase(); 
    });

    after(function(){
        return closeServer();
    });



    describe('GET Announcements endpoint', function(){
        
        it('should return all Announcements', function(){
            let res;
            return chai.request(app)
                .get('/api/announcements')
                .then(_res => {
                    res = _res;
                    console.log(res.body);
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
                    console.log(Announcement.find({}));
                    console.log(res.body);
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res).to.be.a('object');
                    res.body.forEach(function(post){
                        expect(post).to.include.keys('_id','posttype','text','createdBy', 'created');
                        expect(post.posttype).to.equal('Announcement')
                        expect(post._id).to.be.a('string');
                        expect(post.posttype).to.be.a('string');
                        expect(post.text).to.be.a('string');
                        expect(post.created).to.be.a('string'); //technically a date... but Date.now() is a string?
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
                    expect(post.created).to.be.a('string'); //technically a date... but Date.now() is a string?
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
            return chai.request(app)
            .get('/api/bandposts/training')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res).to.be.a('object');
                console.log(res.body[0]);
                res.body.forEach(function(post){
                    expect(post).to.include.keys('_id','posttype','topic', 'description', 'youtubeLink', 'replies', 'created', 'createdBy');
                    expect(post.posttype).to.equal('Training_Resource')
                    expect(post._id).to.be.a('string');
                    expect(post.posttype).to.be.a('string');
                    expect(post.topic).to.be.a('string');
                    expect(post.description).to.be.a('string');
                    expect(post.youtubeLink).to.be.a('string');
                    expect(post.replies).to.be.a('array');
                    expect(post.created).to.be.a('string'); //technically a date... but Date.now() is a string?
                    expect(post.createdBy).to.be.a('object');
                    expect(post.createdBy).to.include.keys('_id', 'username');
                    expect(post.createdBy._id).to.be.a('string');
                    expect(post.createdBy.username).to.be.a('string');
                });
            });
        });
    });
});



