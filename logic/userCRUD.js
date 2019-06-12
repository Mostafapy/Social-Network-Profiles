const userModel = require('../models/userModel');
const logger = require('../utils/logger')('Logic:UserCRUD');

/**
 * function to check if user exists in the mongoDB or not by checking of his/her email
 * @param {String} email
 * @returns {Promise | Error}
 */
const getUser = async email => {
  try {
    const user = await userModel.findOne({ email });
    return Promise.resolve(user);
  } catch (err) {
    logger.error('@getUser() [error: %0]', err.message);
    return Promise.reject(
      new Error('Cannot complete finding the requested user in mongoDB'),
    );
  }
};

/**
 * Function to intialize new user in the mongoDB
 * @param {String} userName
 * @param {String} userEmail
 * @param {String} userAvatar
 * @param {String} userPassword
 * @returns {Void | Error}
 */
const addNewUser = async (userName, userEmail, userAvatar, userPassword) => {
  try {
    await userModel.create({
      name: userName,
      email: userEmail,
      password: userPassword,
      avatar: userAvatar,
    });
    return Promise.resolve();
  } catch (err) {
    logger.error('@addNewUser() [error: %0]', err.message);
    return Promise.reject(new Error('Cannot Add a new user in mongoDB'));
  }
};

/**
 *  Function to get the requested user by the id
 * @param {String} id
 * @returns {Promise | Error}
 */

const getUserById = async id => {
  try {
    const user = await userModel.findById(id).select('-password');

    return Promise.resolve(user);
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.error(
        `@getUserById() [error: There is no template found in the database with the passed name]`,
      );
      return Promise.reject(new Error(`No Found Template`));
    }

    logger.error('@getUserById() [error: %0]', err.message);
    return Promise.reject(
      new Error(
        'Cannot complete finding the requested user by this Id in mongoDB',
      ),
    );
  }
};

/**
 * Function the delete user
 * @returns {Promise | Error}
 */
const deleteUser = async id => {
  try {
    await userModel.findOneAndRemove({ _id: id });

    return Promise.resolve();
  } catch (err) {
    logger.error('@deleteUser() [error: %0]', err.message);

    return Promise.reject(new Error('Cannot delete this user in mongoDB'));
  }
};
module.exports = { getUser, addNewUser, getUserById, deleteUser };
