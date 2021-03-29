const express = require('express');
const router = express.Router();

const warningsRoutes = require('./warnings.routes');

router.use('/', warningsRoutes);

module.exports = router;
