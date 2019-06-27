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

module.exports = { createPost };
