const postCRUDLogic = require('../logic/postCRUD.js');
const logger = require('../utils/logger')('Controllers:PostController');

// [POST] api/post
const addPost = async (req, res) => {
  try {
    const post = await postCRUDLogic.createPost(req.user.id, req.body.text);

    return res.json(post);
  } catch (err) {
    logger.error('@addPost() [error: %0]', err.message);

    return res.status(500).send('Server Error');
  }
};

// [GET] api/post
const retrieveAllPosts = async (_req, res) => {
  try {
    const retrievedPosts = await postCRUDLogic.getPosts();

    return res.status(200).json(retrievedPosts);
  } catch (err) {
    logger.error('@getAllPosts() [error: %0]', err.message);

    return res.status(500).send('Server Error');
  }
};

// [GET] api/post/:postId
const retrievePostById = async (req, res) => {
  try {
    const retrievedPost = await postCRUDLogic.getPostById(req.params.postId);

    if (!retrievedPost) {
      return res.status(404).json({
        msg: 'Post is not found',
      });
    }

    return res.status(200).json(retrievedPost);
  } catch (err) {
    logger.error('@retrievePostById() [error: %0]', err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json('Post is not found');
    }

    return res.status(500).send('Server Error');
  }
};

// [DELETE] api/post/:postId
const DeletePostById = async (req, res) => {
  try {
    const operationStatus = await postCRUDLogic.deletePost(req.params.postId);

    if (operationStatus === 'successed')
      return res.json({
        msg: `Successfully delete post by id`,
      });

    // operationStatus === 'failed'
    return res.status(404).json({
      msg: 'Post is not found',
    });
  } catch (err) {
    logger.error('@DeletePostById() [error: %0]', err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Post is not found',
      });
    }

    return res.status(500).send('Server Error');
  }
};

// [PUT] api/post/like/:postId
const addLikesForPost = async (req, res) => {
  try {
    const retrievedPost = await postCRUDLogic.getPostById(req.params.postId);

    if (!retrievedPost) {
      return res.status(404).json({
        msg: 'There is no post for the requested post id',
      });
    }

    const post = await postCRUDLogic.addLike(retrievedPost, req.user.id);
    if (post === `liked before`) {
      return res.status(400).json({
        msg: `Post has already liked`,
      });
    }

    return res.json(post);
  } catch (err) {
    logger.error('@addLikesForPost() [error: %0]', err.message);

    return res.status(500).send('Server Error');
  }
};

// [PUT] api/post/unlike/:postId
const unlikePost = async (req, res) => {
  try {
    const retrievedPost = await postCRUDLogic.getPostById(req.params.postId);

    if (!retrievedPost) {
      return res.status(404).json({
        msg: 'There is no post for the requested post id',
      });
    }

    const post = await postCRUDLogic.unLikePosts(retrievedPost, req.user.id);

    if (post === `not liked before`) {
      return res.status(400).json({
        msg: `this post hasn't yet liked`,
      });
    }

    return res.json(post);
  } catch (err) {
    logger.error('@unlikePost() [error: %0]', err.message);

    return res.status(500).send('Server Error');
  }
};

// [POST] api/post/comment/:postId
const addCommentForPost = async (req, res) => {
  try {
    const post = await postCRUDLogic.addComment(
      req.user.id,
      req.params.postId,
      req.body.text,
    );

    return res.status(200).json(post);
  } catch (err) {
    logger.error('@addCommentForPost() [error: %0]', err.message);

    return res.status(500).send('Server Error');
  }
};

// [DELETE] api/post/comment/:postId/:commentId
const removeCommentForPost = async (req, res) => {
  try {
    const post = await postCRUDLogic.uncommentPost(
      req.user.id,
      req.params.postId,
      req.params.commentId,
    );
    if (post === 'not found') {
      return res.status(404).json({ msg: 'Comment does not exit' });
    }
    return res.json(post);
  } catch (err) {
    logger.error('@removeCommentForPost() [error: %0]', err.message);

    return res.status(500).send('Server Error');
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
