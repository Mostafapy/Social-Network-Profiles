const router = require('express').Router();

// Routers
const usersRouter = require('./users');
const authRouter = require('./auth');
// const profileRouter = require('./profile');
// const postsRouter = require('./posts');

// Routes
router.use('/api', authRouter);
// router.use('/profile', profileRouter);
// router.use('/posts', postsRouter);
router.use('/api', usersRouter);

module.exports = router;
