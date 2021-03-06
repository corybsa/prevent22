const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/auth.routes');
const forumRoutes = require('./forum/forum.routes');
const warningRoutes = require('./warning/warning.routes');
const userRoutes = require('./user/user.routes');
const eventRoutes = require('./event/event.routes');

router.use('/auth', authRoutes);
router.use('/forum', forumRoutes);
router.use('/warning', warningRoutes);
router.use('/user', userRoutes);
router.use('/events', eventRoutes);

module.exports = router;