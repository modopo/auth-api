'use strict'

require('dotenv').config();

const server = require('../src/server');
const base64 = require('base-64');
const { db } = require('../src/models/index');
const supertest = require('supertest');
const request = supertest(server.server);


beforeAll(async () => {
  await db.sync();
})

afterAll(async () => {
  await db.drop({});
})

describe('Testing auth routes ', () => {
  let token = '';
  let newUser = {
    username: "test",
    password: "test",
    role: "admin"
  };

  test("Sign up succesfully", async () => {
    const response = await request.post('/signup').send(newUser);
    expect(response.body.user.username).toEqual('test');
  })

  test("Sign in succesfully", async () => {
    let encoded = base64.encode(`${newUser.username}:${newUser.password}`);
    let response = await request.post('/signin').set('Authorization', `Basic ${encoded}`)

    token = response.body.user.token;

    expect(token).toBeTruthy();
  });

  test("Access routes that require the right token", async () => { 
    let firstResponse = await request.get('/secret').set('Authorization', `Bearer ${token}`);

    let secondResponse = await request.get('/users').set('Authorization', `Basic ${token}`);

    expect(firstResponse.text).toEqual('Welcome to the secret area');
    expect(secondResponse.body[0]).toEqual('test');
  });

})