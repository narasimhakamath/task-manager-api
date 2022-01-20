const express = require('express');
const router = express.Router();
const Task = require('./../models/task');
const auth = require('../middleware/auth');

router.post(`/tasks`, auth, async (req, res) => {
    const task = new Task({...req.body, owner: req.user._id});
    try {
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        res.status(400).send(e);
    }
});

router.get(`/tasks`, auth, async (req, res) => {
    try {
        const conditions = {owner: req.user._id};
        if(req.query.hasOwnProperty('isCompleted'))
            conditions['completed'] = req.query.isCompleted === 'true';

        const tasks = await Task.find(conditions);
        res.send(tasks);
    } catch(e) {
        res.status(500).send();
    }
});

router.get(`/tasks/:id`, auth, async (req, res) => {
    const _id = req.params.id;

    try {
        // const task = await Task.findById(_id);
        const task = await Task.findOne({_id, owner: req.user._id});

        if(task) {
            res.status(200).json(task);
        } else {
            res.status(404).json({});
        }
    } catch(e) {
        res.status(500).send();
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req['body']);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if(!isValidOperation) {
        return res.status(400).json({error: 'Invalid update operation.'});
    }

    try {

        const task = await Task.findOne({_id: req['params']['id'], owner: req.user._id});
        if(!task) {
            return res.status(404).json({});
        }

        updates.forEach(update => user[update] = req['body'][update]);
        await task.save();
        res.send(task);
    } catch(e) {
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req['params']['id'], owner: req.user._id});
        if(!task) {
            return res.status(404).json();
        }
        res.send(task);
    } catch(e) {
        res.status(500).json(e);
    }
});

module.exports = router;