const express = require('express');
const router = express.Router();

const authenticationRoutes = require('./authentication.routes');

router.use('/', authenticationRoutes);

module.exports = router;
