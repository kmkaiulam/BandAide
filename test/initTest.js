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
            console.log(newHashedUsers);
            newUsers.push(newHashedUsers[0])
            newUsers.push(newHashedUsers[1])
        })
       
    /*
    user = generateUserData();
    return  User.hashPassword(user.password)
    .then (hash =>{
        user.password = hash
        return User.create(user)
    })
    .then (newUser => {
        return Announcement.create(generateAnnouncementPost)
    }
    */

};
            
function seedAnnouncementData(newUsers){
    console.info ('seeding Announcement data')
    const announcementData = [];
    for (let i = 1; i<=3; i++){
        announcementData.push(generateAnnouncementPost(newUsers));
    return Announcement.insertMany(announcementData);
    };
};

function seedEventData(newUsers){
    console.info ('seeding Event data')
    const eventData = [];
    for (let i = 1; i<=3; i++){
        eventData.push(generateEventBandpost(newUsers));
    return Bandpost.insertMany(eventData);
    };
};

function seedTrainingData(newUsers){
    console.info ('seeding Training data')
    const trainingData = [];
    for (let i = 1; i<=3; i++){
        trainingData.push(generateTrainingBandpost(newUsers));
    return Bandpost.insertMany(trainingData);
    };
};

function seedReplyData(newUsers){
    console.info('seeding Reply data');
    const replyData = [];
    for (let i = 1; i<=2; i++){
        replyData.push(generateReplyBandpost(newUsers));
    return Bandpost.insertMany(replyData);
    };
}

function seedData(){
    return seedUserData()
    .then (data =>{
    seedAnnouncementData(newUsers);
    seedEventData(newUsers);
    seedTrainingData(newUsers);
    seedReplyData(newUsers);
    })
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
        return seedData();
    });
    

    afterEach(function(){
        return dropDatabase();
    });

    after(function(){
        return closeServer();
    });

/*
let resEvents;
let newPost = {
    asdkfjklsd: djfkjsdf,
    message : ksdnfsdf
}

return chai.request(app)
.get('/api/bandpost/events')
.then(res => {
    resEvents = res.body
    expect(resEvents).to.be.a('array')
    resEvents.forEach(event => {
        expect(event).to.be.a('object')
    })
    return chai.request(app)
    .post(`/api/bandpost/${resEvents[0]._id}`)
    .send(newPost)
    .then(res => {
        console.log(res);
        expect
        return Bandpost.findById()
    })


    // check that it was posted through my server
    // check that my database actually has the post    
*/

// --- GET REQUESTS
    /*
    describe('GET request to Root', function(){

        it('should return status 200', function(){
            let res;
            return chai.request(app)
                .get('/')
                .then(_res => {
                res = _res;
                expect(res).to.have.status(200);
                });
            });
        }); 
        */

   

    describe('GET Announcements', function(){
        
        it('should return all Announcements', function(){
            let res;
            return chai.request(app)
                .get('/api/announcements')
                .then (_res => {
                res = _res;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res).to.be.an.object;
                console.log(res.body);
            })
        });

    }) 

});