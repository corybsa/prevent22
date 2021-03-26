const express = require('express');
const router = express.Router();
const Helper = require('../../helper');
const helper = new Helper();
const Threads = require('../../models/forums/threads.model');

router.get('/', (req, res) => {
    Threads.get(req, (err, data) => {
        if(!err) {
            res.status(200).json(helper.processResults(data.recordset));
        } else {
            res.status(400).json(err);
        }
    });
});

module.exports = router;
