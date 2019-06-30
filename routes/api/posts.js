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

// [GET] api/post
// @desc  Get all post
// @access Private
router.get('/', isAuthorized, postController.retrieveAllPosts);

// [GET] api/post/:postId
// @desc  Get a post by it's id
// @access Private
router.get('/:postId', isAuthorized, postController.retrievePostById);

// [DELETE] api/post/:postId
// @desc  DELETE a post by it's id
// @access Private
router.delete('/:postId', isAuthorized, postController.DeletePostById);

module.exports = router;
