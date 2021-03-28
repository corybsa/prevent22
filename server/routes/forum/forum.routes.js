const express = require('express');
const router = express.Router();

const forumRoutes = require('./forums.routes');
const threadRoutes = require('./threads.routes');
const postRoutes = require('./posts.routes');

router.use('/', forumRoutes);
router.use('/threads', threadRoutes);
router.use('/posts', postRoutes);

module.exports = router;
