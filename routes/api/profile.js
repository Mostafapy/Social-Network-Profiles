const express = require('express');

const { isAuthorized } = require('../../middlewares/authorization');
const createOrUpdateProfileValidation = require('../../validations/createOrUpdateProfile.validation');
const profileController = require('../../controllers/profileController');

const router = express.Router();

// [GET] api/profile/me
// @desc  Get current user profile
// @access Private
router.get(
  '/me',
  isAuthorized,
  profileController.currentUserProfileRetrieverById,
);

// [POST] api/profile
// @desc  Create or Update user Profile
// @access Private
router.post(
  '/',
  isAuthorized,
  createOrUpdateProfileValidation,
  profileController.userProfileCreatorOrUpdater,
);

// [GET] api/profile
// @desc  Get all user profiles
// @access Public
router.get('/', profileController.allUserProfilesRetriever);

// [GET] api/profile/user/:user_Id
// @desc  Get all user profiles
// @access Public
router.get('/user/:user_Id', profileController.userProfileRetrieverByUserId);

module.exports = router;
