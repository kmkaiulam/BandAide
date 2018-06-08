'use strict'
const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const {Post} = require('../models')

chai.use(chaiHttp);

const {app, runServer, closeServer} = require ('../server')
const {TEST_DATABASE_URL} = require('../config/constants');


//testData
const testPost = {
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
};
   


function seedTestData(){
    const seedData =[]
        seedData.push(testPost);
    console.info('seed post data');
    return Post.insertMany(seedData);
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

        it('should return all blogposts', function(){
        
            let res;
            return chai.request(app)
                .get('/api/posts')
                .then(_res => {
                res = _res;
                expect(res).to.have.status(200);

                expect(res.body).to.have.lengthOf.at.least(1);
                return Post.count();
                })
                .then (count => {
                    expect(res.body).to.have.lengthOf(count);
                })
            });
        
        it('should return posts with the correct fields', function(){
        
            let resPost;
            return chai.request(app)
                .get('/api/posts')
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;

                res.body.forEach(function (post){
                    expect(post).to.be.a('object');
                    expect(post).to.include.keys('_id', 'type', 'priority', 'topic', 'content', 'comments', 'created');
                    expect(post.comment).to.include.keys('id','topic','comment', 'createdBy', 'created');
                });
                resPost = res.body[0];
                return BlogPost.findById(resPost.id);
                })
                .then(post => {
                    expect(resPost.type).to.equal(post.type);
                    expect(resPost.priority).to.equal(post.priority);
                    expect(resPost.topic).to.equal(post.topic);
                    expect(Date(resPost.content)).to.equal(Date(post.content));
                    expect(resPost.comments).to.eql(post.comments); //can i use deep equal to just check if there's match between the comments object?
                    expect(resPost.created).to.equal(post.created);
                    expect(resPost.id).to.equal(String(post._id));
                })

        });

    });
});            
        
 


