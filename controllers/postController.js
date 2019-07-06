const postCRUDLogic = require('../logic/postCRUD.js');
const logger = require('../utils/logger')('Controllers:PostController');

// [POST] api/post
const addPost = async (req, res) => {
  try {
    await postCRUDLogic.createPost(req.user.id, req.body.text);

    return res.status(200).json({
      err: null,
      msg: `Successfully new post added`,
      data: null,
    });
  } catch (err) {
    logger.error('@addPost() [error: %0]', err.message);

    return res.status(500).json({
      err: null,
      msg: `Cannot add new post`,
      data: null,
    });
  }
};

// [GET] api/post
const retrieveAllPosts = async (_req, res) => {
  try {
    const retrievedPosts = await postCRUDLogic.getPosts();

    return res.status(200).json({
      err: null,
      msg: `Successfully all posts retrieved`,
      data: retrievedPosts,
    });
  } catch (err) {
    logger.error('@getAllPosts() [error: %0]', err.message);

    return res.status(500).json({
      err: null,
      msg: `Cannot Get any post`,
      data: null,
    });
  }
};

// [GET] api/post/:postId
const retrievePostById = async (req, res) => {
  try {
    const retrievedPost = await postCRUDLogic.getPostById(req.params.postId);

    if (!retrievedPost) {
      return res.status(404).json({
        err: null,
        msg: 'There is no post for the requested post id',
        data: null,
      });
    }

    return res.status(200).json({
      err: null,
      msg: `Successfully a post retrieved by id`,
      data: retrievedPost,
    });
  } catch (err) {
    logger.error('@retrievePostById() [error: %0]', err.message);

    if (err.kind === 'ObjectId') {
      return res.status(401).json({
        err: null,
        msg: 'There is no post for the requested post id',
        data: null,
      });
    }

    return res.status(500).json({
      err: null,
      msg: `Cannot Get the post by it's id`,
      data: null,
    });
  }
};

// [DELETE] api/post/:postId
const DeletePostById = async (req, res) => {
  try {
    const operationStatus = await postCRUDLogic.deletePost(req.params.postId);

    if (operationStatus === 'successed')
      return res.status(200).json({
        err: null,
        msg: `Successfully delete post by id`,
        data: null,
      });

    // operationStatus === 'failed'
    return res.status(404).json({
      err: null,
      msg: 'There is no post for the requested post id',
      data: null,
    });
  } catch (err) {
    logger.error('@DeletePostById() [error: %0]', err.message);

    if (err.kind === 'ObjectId') {
      return res.status(401).json({
        err: null,
        msg: 'There is no post for the requested post id',
        data: null,
      });
    }

    return res.status(500).json({
      err: null,
      msg: `Cannot delete the requested post`,
      data: null,
    });
  }
};

// [PUT] api/post/like/:postId
const addLikesForPost = async (req, res) => {
  try {
    const retrievedPost = await postCRUDLogic.getPostById(req.params.postId);

    if (!retrievedPost) {
      return res.status(404).json({
        err: null,
        msg: 'There is no post for the requested post id',
        data: null,
      });
    }

    const postLikes = await postCRUDLogic.addLike(retrievedPost, req.user.id);
    if (postLikes === `liked before`) {
      return res.status(400).json({
        err: null,
        msg: `this post has already liked`,
        data: null,
      });
    }

    return res.status(200).json({
      err: null,
      msg: `Successfully add like to this post`,
      data: postLikes,
    });
  } catch (err) {
    logger.error('@addLikesForPost() [error: %0]', err.message);

    return res.status(500).json({
      err: null,
      msg: `Cannot add likes for this post`,
      data: null,
    });
  }
};

// [PUT] api/post/unlike/:postId
const unlikePost = async (req, res) => {
  try {
    const retrievedPost = await postCRUDLogic.getPostById(req.params.postId);

    if (!retrievedPost) {
      return res.status(404).json({
        err: null,
        msg: 'There is no post for the requested post id',
        data: null,
      });
    }

    const postLikes = await postCRUDLogic.unLikePosts(
      retrievedPost,
      req.user.id,
    );

    if (postLikes === `not liked before`) {
      return res.status(400).json({
        err: null,
        msg: `this post hasn't yet liked`,
        data: null,
      });
    }

    return res.status(200).json({
      err: null,
      msg: `Successfully unlike this post`,
      data: postLikes,
    });
  } catch (err) {
    logger.error('@unlikePost() [error: %0]', err.message);

    return res.status(500).json({
      err: null,
      msg: `Cannot unlike this post`,
      data: null,
    });
  }
};

// [PUT] api/post/comment/:postId
const addCommentForPost = async (req, res) => {
  try {
    const post = await postCRUDLogic.addComment(
      req.user.id,
      req.params.postId,
      req.body.text,
    );

    return res.status(200).json({
      err: null,
      msg: `Successfully new comment added`,
      data: post,
    });
  } catch (err) {
    logger.error('@addCommentForPost() [error: %0]', err.message);

    return res.status(500).json({
      err: null,
      msg: `Cannot add new comment for this post`,
      data: null,
    });
  }
};

// [PUT] api/post/uncomment/:postId/:commentId
const removeCommentForPost = async (req, res) => {
  try {
    const comments = await postCRUDLogic.uncommentPost(
      req.user.id,
      req.params.postId,
      req.params.commentId,
    );

    return res.status(200).json({
      err: null,
      msg: `Successfully uncomment this post`,
      data: comments,
    });
  } catch (err) {
    logger.error('@removeCommentForPost() [error: %0]', err.message);

    return res.status(500).json({
      err: null,
      msg: `Cannot add uncomment this post`,
      data: null,
    });
  }
};
module.exports = {
  addPost,
  retrieveAllPosts,
  retrievePostById,
  DeletePostById,
  addLikesForPost,
  unlikePost,
  addCommentForPost,
  removeCommentForPost,
};
