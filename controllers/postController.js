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

module.exports = {
  addPost,
  retrieveAllPosts,
  retrievePostById,
  DeletePostById,
};
