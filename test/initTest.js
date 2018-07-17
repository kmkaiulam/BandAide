/*
const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

chai.use(chaiHttp);

const {app, runServer, closeServer} = require ('../server')
const {TEST_DATABASE_URL} = require('../config');


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
    */