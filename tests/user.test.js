const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = require('../src/app');
const User = require('../src/models/user');

const user1ID = new mongoose.Types.ObjectId();

const user1 = {
    _id: user1ID,
    name: 'Mike',
    email: 'mike@example.com',
    password: 'AveSatanas',
    tokens: [{
        token: jwt.sign({_id: user1ID}, process.env.JWT_SECRET)
    }]
};



beforeEach(async () => {
    await User.deleteMany();
    await new User(user1).save();
});

test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'Narasimha Kamath',
        email: 'narasimhakamath@outlook11.com',
        password: 'AveSatanas@666'
    }).expect(201);
});

test('Should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: user1['email'],
        password: user1['password'],
    }).expect(200);
});

test('Should not login with invalid credentials', async () => {
    await request(app).post('/users/login').send({
        email: user1['email'],
        password: 'asdasdasdafasd'
    }).expect(400);
});

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${user1['tokens'][0]['token']}`)
        .send()
        .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('Should delete account for user', async () => {
    console.log("Delete me...");
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${user1['tokens'][0]['token']}`)
        .send()
        .expect(200);
});

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});