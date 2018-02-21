'use strict'

const should = require('should');
const request = require('request');
const util = require('util');
const expect = require('chai').expect;
const config = require('./config');

describe('return users without auth', () => {
    it('return users without auth', (done) => {
        request.get({url: config.API_BASE_URL + '/users'}, (error, res, body) => {
            expect(res.statusCode).to.equal(401);
            done();
        });
    });
});

/* POST options */
var options = {
    uri: config.API_BASE_URL + '/users/authenticate',
    method: 'POST',
    json: {
        'email': config.API_USER_TEST_EMAIL,
        'password': config.API_USER_TEST_PASSWORD
    }
};

describe('authenticate user', () => {
    it('authenticate user', (done) => {
        request(options, (error, res, body) => {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });
});