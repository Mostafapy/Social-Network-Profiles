const router = require('express').Router();
const apiRouters = require('express').Router();
// Routers
const usersRouter = require('./users');
const authRouter = require('./auth');
const profileRouter = require('./profile');
// const postsRouter = require('./posts');

// Routes
router.use('/api', apiRouters);
apiRouters.use('/auth', authRouter);
apiRouters.use('/profile', profileRouter);
// apiRouters.use('/posts', postsRouter);
apiRouters.use('/users', usersRouter);

module.exports = router;
