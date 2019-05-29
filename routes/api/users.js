const express = require('express');
const userRegistrationValidation = require('../../validations/usersRequest.validation');

const userCtrl = require('../../controllers/usersController');

const router = express.Router();
// [POST] api/users
// @desc  Register user
// @access Public
router.post('/users', userRegistrationValidation, userCtrl.userRegistration);

module.exports = router;
