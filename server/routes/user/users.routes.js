const express = require('express');
const router = express.Router();
const Helper = require('../../helper');
const helper = new Helper();
const Users = require('../../models/user/users.model');

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

module.exports = router;
