const express = require('express');

const { isAuthenticated } = require('../../middlewares/authentication');
const authController = require('../../controllers/authController');

const router = express.Router();
// [GET] api/auth
// @desc  authentication of users
// @access Public
router.get('/auth', isAuthenticated, authController);

module.exports = router;
