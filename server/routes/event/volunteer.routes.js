const express = require('express');
const router = express.Router();
const Helper = require('../../helper');
const helper = new Helper();
const Volunteer = require('../../models/events/volunteer.model');

router.post('/', (req, res) => {
    if(!req.isAuthenticated()) {
        res.status(440).json({ message: 'User not logged in.' });
        return;
    }

    Volunteer.create(req, (err, data) => {
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

    Volunteer.cancelVolunteer(req, (err, data) => {
        if(!err) {
            res.status(200).json(helper.processResults(data.recordset));
        } else {
            res.status(400).json(err);
        }
    });
});

router.delete('/user', (req, res) => {
    if(!req.isAuthenticated()) {
        res.status(440).json({ message: 'User not logged in.' });
        return;
    }

    Volunteer.cancelVolunteerByUserId(req, (err, data) => {
        if(!err) {
            res.status(200).json(helper.processResults(data.recordset));
        } else {
            res.status(400).json(err);
        }
    });
});

router.delete('/code', (req, res) => {
    if(!req.isAuthenticated()) {
        res.status(440).json({ message: 'User not logged in.' });
        return;
    }

    Volunteer.cancelVolunteerByCode(req, (err, data) => {
        if(!err) {
            res.status(200).json(helper.processResults(data.recordset));
        } else {
            res.status(400).json(err);
        }
    });
});

module.exports = router;