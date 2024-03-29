const express = require('express');

const { isAuthorized } = require('../../middlewares/authorization');
const authController = require('../../controllers/authController');
const authRequestValidation = require('../../validations/userAuthentication.validation');

const router = express.Router();
// [GET] api/auth
// @desc  authorization of users
// @access Public
router.get('/', isAuthorized, authController.manageAuthorization);

// [POST] api/auth
// @desc  authentication of users
// @access Public
router.post('/', authRequestValidation, authController.manageAuthentication);

module.exports = router;
