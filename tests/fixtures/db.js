const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../../src/models/user');
const Task = require('../../src/models/task');


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

const user2ID = new mongoose.Types.ObjectId();
const user2 = {
    _id: user2ID,
    name: 'Chester',
    email: 'chester@example.com',
    password: 'AveSatanas',
    tokens: [{
        token: jwt.sign({_id: user1ID}, process.env.JWT_SECRET)
    }]
};

const task1 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task!',
    completed: false,
    owner: user1ID
}

const task2 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task!',
    completed: true,
    owner: user1ID
}

const task3 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task!',
    completed: true,
    owner: user2ID
}

const setupDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();

    await new User(user1).save();
    await new User(user2).save();

    await new Task(task1).save();
    await new Task(task2).save();
    await new Task(task3).save();
}

module.exports = {
    user1ID,
    user2ID,
    user1,
    user2,
    task1,
    task2,
    task3,
    setupDatabase
}