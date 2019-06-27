const express = require('express');
const { isAuthorized } = require('../../middlewares/authorization');
const addPostRequestValidation = require('../../validations/addPostValidation');
const postController = require('../../controllers/postController');

const router = express.Router();

// [POST] api/post
// @desc  Create a post
// @access Private
router.post(
  '/',
  isAuthorized,
  addPostRequestValidation,
  postController.addPost,
);

module.exports = router;
