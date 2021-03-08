const express = require('express');
const sql = require('mssql');
const passport = require('passport');
const router = express.Router();
const Helper = require('../../helper');
const helper = new Helper();
const Auth = require('../../models/auth/auth.model');

router.post('/check', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) {
            return res.status(400).json(err);
        }

        let sessionUser;

        if(req.session && req.session.passport) {
            if(req.session.passport.user) {
                sessionUser = req.session.passport.user;
            }
        }

        if(!sessionUser) {
            res.status(200).json({ message: 'User not found' });
        } else {
            const params = [
                { name: 'StatementType', type: sql.Int, value: 1 },
                { name: 'UserId', type: sql.Int, value: sessionUser }
            ];

            helper.exec('sp_Users', params, (err, user) => {
                res.status(200).json(helper.processResults(user.recordset[0]));
            });
        }
    })(req, res, next);
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        Auth.login(req, (err, user) => {
            if (err) {
                res.status(500).json(err);
            } else {
                req.login(user, (err) => {
                    res.status(200).json(user);
                });
            }
        });
    })(req, res, next);
});

router.post('/logout', (req, res, next) => {
    req.logout();
    res.clearCookie('sessionId', { httpOnly: true });
    res.status(200).json(null);
});

module.exports = router;
