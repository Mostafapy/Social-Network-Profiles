const express = require('express');
const { isAuthorized } = require('../../middlewares/authorization');
const addPostRequestValidation = require('../../validations/addPostValidation');
const addCommentRequestValidation = require('../../validations/addCommentForPostValidation');
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

// [PUT] api/post/like/:postId
// @desc  Like a post
// @access Private
router.put('/like/:postId', isAuthorized, postController.addLikesForPost);

// [PUT] api/post/unlike/:postId
// @desc  unLike a post
// @access Private
router.put('/unlike/:postId', isAuthorized, postController.unlikePost);

// [POST] api/post/comment/:postId
// @desc  comment on a post
// @access Private
router.post(
  '/comment/:postId',
  isAuthorized,
  addCommentRequestValidation,
  postController.addCommentForPost,
);

// [DELETE] api/post/uncomment/:postId/:commentId
// @desc  comment on a post
// @access Private
router.delete(
  '/uncomment/:postId/:comment:Id',
  isAuthorized,
  postController.removeCommentForPost,
);

module.exports = router;
