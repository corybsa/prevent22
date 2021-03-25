const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/auth.routes');
const forumRoutes = require('./forum/forum.routes');

router.use('/auth', authRoutes);
router.use('/forum', forumRoutes);

module.exports = router;