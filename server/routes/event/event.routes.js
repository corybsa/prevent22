const express = require('express');
const router = express.Router();

const eventsRoutes = require('./events.routes');
const volunteerRoutes = require('./volunteer.routes');

router.use('/', eventsRoutes);
router.use('/volunteer', volunteerRoutes);

module.exports = router;
