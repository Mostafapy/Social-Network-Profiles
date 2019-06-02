const express = require('express');

const { isAuthorized } = require('../../middlewares/authorization');
const profileController = require('../../controllers/profileController');

const router = express.Router();

// [GET] api/profile/me
// @desc  Get current user profile
// @access Private
router.get('/me', isAuthorized, profileController.userProfileRetriever);

module.exports = router;
