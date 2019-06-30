const userCRUDLogic = require('./userCRUD');
const Post = require('../models/postsModel');
const logger = require('../utils/logger')('Logic:postCRUD');
/**
 * function to create new post for user profile
 * @param {String} id
 * @param {String} postText
 * @returns {Promise | Error}
 */
const createPost = async (id, postText) => {
  try {
    const user = await userCRUDLogic.getUserById(id);

    Post.create({
      text: postText,
      name: user.name,
      avatar: user.avatar,
      user: id,
    });

    return Promise.resolve();
  } catch (err) {
    logger.error('@createPost() [error: %0]', err.message);

    return Promise.reject(new Error('Cannot create new post for this user'));
  }
};

/**
 * Function to get all the posts
 * @returns {Promise | Error}
 */
const getPosts = async () => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    return Promise.resolve(posts);
  } catch (err) {
    logger.error('@getPosts() [error: %0]', err.message);

    return Promise.reject(new Error('Cannot get posts'));
  }
};

/**
 * Function to get a post by id
 * @returns {Promise | Error}
 */
const getPostById = async id => {
  try {
    const post = await Post.findById(id);

    return Promise.resolve(post);
  } catch (err) {
    logger.error('@getPosts() [error: %0]', err.message);

    return Promise.reject(new Error('Cannot get post by id'));
  }
};

/**
 * Function to delete a post by id
 * @returns {Promise | Error}
 */
const deletePost = async id => {
  try {
    const post = await Post.findById(id);

    if (!post) {
      return Promise.resolve('failed');
    }
    await post.remove();

    return Promise.resolve('successed');
  } catch (err) {
    logger.error('@getPosts() [error: %0]', err.message);

    return Promise.reject(new Error('Cannot delete a post'));
  }
};

/**
 * Function to add like for a post
 * @param {Object} post
 * @param {String} userId
 * @returns {Promise | Error}
 */
const addLike = async (post, userId) => {
  try {
    // check if post has already been liked
    if (post.likes.filter(like => like.user.toString() === userId).length > 0) {
      return Promise.resolve('liked before');
    }
    post.likes.unshift({ user: userId });

    await post.save();

    return Promise.resolve(post.likes);
  } catch (err) {
    logger.error('@addLike() [error: %0]', err.message);

    return Promise.reject(new Error('Cannot add a like for this post'));
  }
};

/**
 * Function to unlike a post
 * @param {Object} post
 * @param {String} userId
 * @returns {Promise | Error}
 */
const unLikePosts = async (post, userId) => {
  try {
    // check if post hasn't yet been liked
    if (
      post.likes.filter(like => like.user.toString() === userId).length === 0
    ) {
      return Promise.resolve('not liked before');
    }
    // get remove index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(userId);

    post.likes.splice(removeIndex, 1);

    await post.save();

    return Promise.resolve(post.likes);
  } catch (err) {
    logger.error('@addLike() [error: %0]', err.message);

    return Promise.reject(new Error('Cannot add a like for this post'));
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  addLike,
  unLikePosts,
};
