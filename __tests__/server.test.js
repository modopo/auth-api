'use strict'

const server = require('../src/server');
const { db } = require('../src/models/index');
const supertest = require('supertest');
const request = supertest(server.server);

beforeAll(async() => {
  await db.sync();
})

afterAll(async () => {
  await db.drop();
})

describe("Testing V1 routes", () => {
  
  test('POST into food/clothes', async () => {
    let newFood = {
      name: 'banana',
      calories: 100,
      type: 'fruit'
    }

    let newClothes = {
      name: 'shirt',
      color: 'blue',
      size: 'medium'
    }

    const foodResponse = await request.post('/api/v1/food').send(newFood);
    const clothesResponse = await request.post('/api/v1/clothes').send(newClothes);
    
    expect(foodResponse.body.name).toEqual('banana');
    expect(clothesResponse.body.name).toEqual('shirt');
  })

  test('GET all from food/clothes', async () => {
    const foodResponse = await request.get('/api/v1/food');
    const clothesResponse = await request.get('/api/v1/clothes');

    expect(foodResponse.body[0].name).toEqual('banana');
    expect(clothesResponse.body[0].name).toEqual('shirt');
  });

  test('GET food/clothes with ID', async () => {
    const foodResponse = await request.get('/api/v1/food/1');
    const clothesResponse = await request.get('/api/v1/clothes/1');

    expect(foodResponse.body.name).toEqual('banana');
    expect(clothesResponse.body.name).toEqual('shirt');
  });

  test('PUT food/clothes with ID', async () => {
    let newFood = {
      name: 'apple',
      calories: 200,
      type: 'fruit'
    }

    let newClothes = {
      name: 'pants',
      color: 'black',
      size: 'medium'
    }

    const foodResponse = await request.put('/api/v1/food/1').send(newFood);
    const clothesResponse = await request.put('/api/v1/clothes/1').send(newClothes);

    expect(foodResponse.body.name).toEqual('apple');
    expect(clothesResponse.body.name).toEqual('pants');
  });

  test('DELETE food/clothes with ID', async() => {
    const foodResponse = await request.delete('/api/v1/food/1');
    const clothesResponse = await request.delete('/api/v1/clothes/1');

    expect(foodResponse.body).toEqual(1);
    expect(clothesResponse.body).toEqual(1);
  });
});

describe("Testing V2 routes", () => {
  let admin = {
    username: 'admin',
    password: 'password',
    role: 'admin'
  }
  let token = '';

  test('POST into food/clothes', async () => {
    let newFood = {
      name: 'banana',
      calories: 100,
      type: 'fruit'
    }

    let newClothes = {
      name: 'shirt',
      color: 'blue',
      size: 'medium'
    }

    let response = await request.post('/signup').send(admin);
    token = response.body.user.token

    const foodResponse = await request.post('/api/v2/food').set('Authorization', `Bearer ${token}`).send(newFood);
    const clothesResponse = await request.post('/api/v2/clothes').set('Authorization', `Bearer ${token}`).send(newClothes);
    
    expect(foodResponse.body.name).toEqual('banana');
    expect(clothesResponse.body.name).toEqual('shirt');
  })

  test('GET all from food/clothes', async () => {
    const foodResponse = await request.get('/api/v1/food').set('Authorization', `Bearer ${token}`);
    const clothesResponse = await request.get('/api/v1/clothes').set('Authorization', `Bearer ${token}`);

    expect(foodResponse.body[0].name).toEqual('banana');
    expect(clothesResponse.body[0].name).toEqual('shirt');
  });

  test('GET food/clothes with ID', async () => {
    const foodResponse = await request.get('/api/v1/food/2').set('Authorization', `Bearer ${token}`);
    const clothesResponse = await request.get('/api/v1/clothes/2').set('Authorization', `Bearer ${token}`);

    expect(foodResponse.body.name).toEqual('banana');
    expect(clothesResponse.body.name).toEqual('shirt');
  });

  test('PUT food/clothes with ID', async () => {
    let newFood = {
      name: 'apple',
      calories: 200,
      type: 'fruit'
    }

    let newClothes = {
      name: 'pants',
      color: 'black',
      size: 'medium'
    }

    const foodResponse = await request.put('/api/v1/food/2').set('Authorization', `Bearer ${token}`).send(newFood);
    const clothesResponse = await request.put('/api/v1/clothes/2').set('Authorization', `Bearer ${token}`).send(newClothes);

    expect(foodResponse.body.name).toEqual('apple');
    expect(clothesResponse.body.name).toEqual('pants');
  });

  test('DELETE food/clothes with ID', async() => {
    const foodResponse = await request.delete('/api/v1/food/2').set('Authorization', `Bearer ${token}`);
    const clothesResponse = await request.delete('/api/v1/clothes/2').set('Authorization', `Bearer ${token}`);

    expect(foodResponse.body).toEqual(1);
    expect(clothesResponse.body).toEqual(1);
  })
})