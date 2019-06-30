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

    return Promise.reject(new Error('Cannot get posts'));
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

    return Promise.reject(new Error('Cannot get posts'));
  }
};
module.exports = { createPost, getPosts, getPostById, deletePost };
