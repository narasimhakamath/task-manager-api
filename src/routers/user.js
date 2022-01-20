const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({
    limits: {
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('File must be a valid image.'));
        }
        cb(undefined, true);
    }
});

const User = require('./../models/user');
const auth = require('./../middleware/auth');
const {sendWelcomeEmail} = require('../emails/account');

router.post(`/users`, async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(req.body.email, req.body.name);
        const token = await user.generateAuthToken();
        res.status(201).json({user, token});
    } catch(e) {
        res.status(400).json(e);
    }
});

router.post(`/users/login`, async (req, res) => {
    try {
        const user = await User.findByCredentials(req['body']['email'], req['body']['password']);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch(e) {
        res.status(400).send();
    }
});

router.post(`/users/logoutall`, auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send();
    }
});

router.post(`/users/logout`, auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token != req.token);
        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send();
    }
});

router.get(`/users`, auth, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch(e) {
        res.status(400).send();
    }
});

router.get(`/users/me`, auth, async (req, res) => {
    res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req['body']);
    const allowedUpdates = ['name', 'email', 'password', 'age'];

    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).json({error: 'Invalid update operation.'});
    }

    try {
        const user = await User.findById(req.user._id);
        updates.forEach(update => user[update] = req['body'][update]);
        await user.save();

        // const user = await User.findByIdAndUpdate(req['params']['id'], req['body'], {new: true, runValidators: true});
        if(!user) {
            return res.status(404).json({});
        }
        res.send(user);
    } catch(e) {
        res.status(400).send(e);
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(user);
    } catch(e) {
        res.status(500).json(e);
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar) {
            throw new Error();
        }

        res.status(200);
        res.set('Content-Type', 'image/jpg');
        set.send(user.avatar);
    } catch(e) {
        res.status(404).json();
    }
});

module.exports = router;