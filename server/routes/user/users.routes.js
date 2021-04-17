const express = require('express');
const router = express.Router();
const Helper = require('../../helper');
const helper = new Helper();
const Users = require('../../models/user/users.model');

router.get('/', (req, res) => {
    if(!req.isAuthenticated()) {
        res.status(440).json({ message: 'User not logged in.' });
        return;
    }

    Users.getAll(req, (err, data) => {
        if(!err) {
            res.status(200).json(helper.processResults(data.recordset));
        } else {
            res.status(400).json(err);
        }
    });
});

router.get('/events', (req, res) => {
    if(!req.isAuthenticated()) {
        res.status(440).json({ message: 'User not logged in.' });
        return;
    }

    Users.getEvents(req, (err, data) => {
        if(!err) {
            res.status(200).json(helper.processResults(data.recordset));
        } else {
            res.status(400).json(err);
        }
    });
});

router.get('/warnings', (req, res) => {
    if(!req.isAuthenticated()) {
        res.status(440).json({ message: 'User not logged in.' });
        return;
    }

    Users.getWarnings(req, (err, data) => {
        if(!err) {
            res.status(200).json(helper.processResults(data.recordset));
        } else {
            res.status(400).json(err);
        }
    });
});

router.post('/', (req, res) => {
    if(!req.isAuthenticated()) {
        res.status(440).json({ message: 'User not logged in.' });
        return;
    }

    if(!helper.hasRole(req, [helper.roles.Admin, helper.roles.Moderator])) {
        return res.status(403).json({ message: 'Not authorized to perform this action.' });
    }

    Users.update(req, (err, data) => {
        if(!err) {
            res.status(200).json(helper.processResults(data.recordset));
        } else {
            res.status(400).json(err);
        }
    });
});

router.post('/reset-password-request', (req, res) => {
    Users.resetPassword(req, (err, data) => {
        if(!err) {
            res.status(200).json(helper.processResults(data.recordset));
        } else {
            res.status(400).json(err);
        }
    });
});

router.post('/reset-password', (req, res) => {
    Users.updatePassword(req, (err, data) => {
        if(!err) {
            res.status(200).json(helper.processResults(data.recordset));
        } else {
            res.status(400).json(err);
        }
    });
});

module.exports = router;
