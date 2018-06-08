'use strict'
const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

chai.use(chaiHttp);

const {app, runServer, closeServer} = require ('../server')
const {TEST_DATABASE_URL} = require('../config/constants');


function generateTestPost(){
    const testPost = [{
        type: 'Event Eval',
        priority: 'High',
        team: 'All',
        topic: 'SWS 20180610',
        content: 'Let\'s discuss any tech issues or improvements that we can make.', 
        comments: {
                topic: 'Wireless',
                comment: 'Had some issues with the channels we used, DPA sounded like he was inside a bathroom',
                createdBy: 'Kenny',
                created: 20180611
        }
    }];
    return testPost
}

function seedTestData(){
    const seedData =[]
        seedData.push(generateTestPost);
    console.info('seed post data');
    return Post.insert(seedData);
}

function dropDatabase(){
    console.warn('Deleting Database');
    return mongoose.connection.dropDatabase();
}


describe('BandAide Posts', function() {

    before(function(){
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function(){
        return seedTestData();
    });

   afterEach(function(){
        return dropDatabase();
    });

    after(function(){
        return closeServer();
    });

    // --'Posts' Tests --
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
