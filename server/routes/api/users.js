const express = require('express');
const userRegistrationValidation = require('../../validations/usersRequest.validation');

const { isAuthorized } = require('../../middlewares/authorization');
const userCtrl = require('../../controllers/usersController');

const router = express.Router();
// [POST] api/users/register
// @desc  Register user
// @access Public
router.post('/register', userRegistrationValidation, userCtrl.userRegistration);

// [GET] api/users/current
// @desc  get current user
// @access private
router.get('/current', isAuthorized, userCtrl.retrieveCurrentUser);
module.exports = router;
