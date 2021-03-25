const express = require('express');
const router = express.Router();

const forumsRoutes = require('./forums.routes');

router.use('/', forumsRoutes);

module.exports = router;
