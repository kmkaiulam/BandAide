const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');
const {User, Announcement, Bandpost} = require('../models');
chai.use(chaiHttp);

const {app, runServer, closeServer} = require ('../server')
const {TEST_DATABASE_URL} = require('../config');


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
function generateAnnouncementPost(){
    return {
        posttype: 'Announcement',
        text: faker.lorem.paragraph()
    }
}

function generateEventBandpost(){
   return { 
        posttype: 'Event_Eval',
        topic: faker.lorem.sentence(),
        description: faker.lorem.paragraphs()
    };
}

function generateTrainingBandpost(){
    return {
        posttype: 'Training_Resource',
        topic: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(),
        youtubeLink: 'https://www.youtube.com/watch?v=hq8uXO4FelQ'
    }
};

function generateReplyBandpost(){
    return { 
            posttype: 'Event_Eval',
            topic: faker.lorem.sentence(),
            description: faker.lorem.paragraphs(),
            replies: {
                    topic: faker.lorem.words(),
                    reply: faker.lorem.paragraphs(),
            }
    }          
};


// --- Seeding Data
function seedUserData(){
    console.info('seeding User data');
    const userData = [];
    for (let i = 1; i<=2; i++){
        userData.push(generateUserData());
    return User.insertMany(seedData);
    };
};

function seedAnnouncementData(){
    console.info ('seeding Announcement data')
    const announcementData = [];
    for (let i = 1; i<=3; i++){
        announcementData.push(generateAnnouncementPost());
    return Announcement.insertMany(seedData);
    };
};

function seedEventData(){
    console.info ('seeding Event data')
    const eventData = [];
    for (let i = 1; i<=3; i++){
        eventData.push(generateEventBandpost());
    return Bandpost.insertMany(seedData);
    };
};

function seedTrainingData(){
    console.info ('seeding Training data')
    const trainingtData = [];
    for (let i = 1; i<=3; i++){
        trainingData.push(generateTrainingBandpost());
    return Bandpost.insertMany(seedData);
    };
};

function seedReplyData(){
    console.info('seeding Reply data');
    const replyData = [];
    for (let i = 1; i<=2; i++){
        replyData.push(generateReplyBandpost());
    return Bandpost.insertMany(seedData);
    };
}

function seedData(){
    seedUserData();
    seedAnnouncementData();
    seedEventData();
    seedTrainingData();
    seedReplyData();   
};



function dropDatabase(){
    console.warn('Deleting Database');
    return mongoose.connection.dropDatabase();
}

describe('Blog API resource', function(){
    
    before(function(){
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function(){
        return seedBlogData();
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


    // check that it was posted through my serve
    // check that my database actually has the post    
*/


describe('GET endpoint', function(){

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
    
});






describe('GET endpoint', function(){

    it('should return  status 200', function(){
        let res;
        return chai.request(app)
            .get('/')
            .then (_res => {
            res = _res;
            expect(res).to.have.status(200);
        })
    });

})