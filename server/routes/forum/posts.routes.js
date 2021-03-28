const express = require('express');
const router = express.Router();
const Helper = require('../../helper');
const helper = new Helper();
const Posts = require('../../models/forums/posts.model');

router.get('/', (req, res) => {
    Posts.get(req, (err, data) => {
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

    Posts.create(req, (err, data) => {
        if(!err) {
            res.status(200).json(helper.processResults(data.recordset[0]));
        } else {
            res.status(400).json(err);
        }
    });
});

router.put('/', (req, res) => {
    if(!req.isAuthenticated()) {
        res.status(440).json({ message: 'User not logged in.' });
        return;
    }

    Posts.update(req, (err, data) => {
        if(!err) {
            res.status(200).json(helper.processResults(data.recordset));
        } else {
            res.status(400).json(err);
        }
    });
});

router.delete('/', (req, res) => {
    if(!req.isAuthenticated()) {
        res.status(440).json({ message: 'User not logged in.' });
        return;
    }

    if(!helper.hasRole(req, [helper.roles.Admin, helper.roles.Moderator])) {
        return res.status(403).json({ message: 'Not authorized to perform this action.' });
    }

    Posts.delete(req, (err, data) => {
        if(!err) {
            res.status(200).json(helper.processResults(data.recordset));
        } else {
            res.status(400).json(err);
        }
    });
});

module.exports = router;
