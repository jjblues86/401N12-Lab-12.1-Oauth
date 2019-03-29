'use strict';
require('dotenv').config();

process.env.STORAGE = 'mongo';

const jwt = require('jsonwebtoken');

const server = require('../../../src/app.js').server;
const supergoose = require('../../supergoose.js');
// try creating a process.env.secret - The Girls


const mockRequest = supergoose.server(server);

let users = {
    admin: {username: 'admin', password: 'password', role: 'admin'},
    editor: {username: 'editor', password: 'password', role: 'editor'},
    user: {username: 'user', password: 'password', role: 'user'},
};

beforeAll(supergoose.startDB);
afterAll(supergoose.stopDB);

describe('Auth Router', () => {

    Object.keys(users).forEach( userType => {

        describe(`${userType} users`, () => {

            let encodedToken;
            let id;

            it('can create one', () => {
                return mockRequest.post('/signup')
                    .send(users[userType])
                    .then(results => {
                        var token = jwt.verify(results.text, process.env.TWITCH_CLIENT_SECRET || 'changeit');
                        id = token.id;
                        encodedToken = results.text;
                        console.log(token.id);
                        expect(token.id).toBeDefined();
                        // expect(token.capabilities).toBeDefined();
                    });
            });

            it('can signin with basic', () => {
                return mockRequest.post('/signin')
                    .auth(users[userType].username, users[userType].password)
                    .then(results => {
                        var token = jwt.verify(results.text, process.env.TWITCH_CLIENT_SECRET || 'changeit');
                        console.log(token)
                        //expect(token.id).toEqual(id);
                        expect(token).toBeDefined();
                    });
            });

        });

    });

});