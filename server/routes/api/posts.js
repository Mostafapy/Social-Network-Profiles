const express = require('express');
const { isAuthorized } = require('../../middlewares/authorization');
const addPostRequestValidation = require('../../validations/addPostValidation');
const addCommentRequestValidation = require('../../validations/addCommentForPostValidation');
const postController = require('../../controllers/postController');

const router = express.Router();

// [POST] api/posts
// @desc  Create a post
// @access Private
router.post(
  '/',
  isAuthorized,
  addPostRequestValidation,
  postController.addPost,
);

// [GET] api/posts
// @desc  Get all post
// @access Private
router.get('/', isAuthorized, postController.retrieveAllPosts);

// [GET] api/posts/:postId
// @desc  Get a post by it's id
// @access Private
router.get('/:postId', isAuthorized, postController.retrievePostById);

// [DELETE] api/posts/:postId
// @desc  DELETE a post by it's id
// @access Private
router.delete('/:postId', isAuthorized, postController.DeletePostById);

// [PUT] api/posts/like/:postId
// @desc  Like a post
// @access Private
router.put('/like/:postId', isAuthorized, postController.addLikesForPost);

// [PUT] api/posts/unlike/:postId
// @desc  unLike a post
// @access Private
router.put('/unlike/:postId', isAuthorized, postController.unlikePost);

// [POST] api/posts/comment/:postId
// @desc  comment on a post
// @access Private
router.post(
  '/comment/:postId',
  isAuthorized,
  addCommentRequestValidation,
  postController.addCommentForPost,
);

// [DELETE] api/posts/uncomment/:postId/:commentId
// @desc  comment on a post
// @access Private
router.delete(
  '/uncomment/:postId/:comment:Id',
  isAuthorized,
  postController.removeCommentForPost,
);

module.exports = router;
