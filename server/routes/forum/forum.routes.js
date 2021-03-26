const express = require('express');
const router = express.Router();

const forumsRoutes = require('./forums.routes');
const threadsRoutes = require('./threads.routes');

router.use('/', forumsRoutes);
router.use('/threads', threadsRoutes);

module.exports = router;
