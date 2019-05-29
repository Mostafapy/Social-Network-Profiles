const userModel = require('../models/userModel');
const logger = require('../utils/logger')('Logic:UserCRUD');

/**
 * functio to check if user exists in the mongoDB or not by checking of his/her email
 * @param {String} email
 * @returns {Promise | Error}
 */
const getUser = async email => {
  try {
    const user = await userModel.findOne({ email });
    return Promise.resolve(user);
  } catch (err) {
    logger.error('@checkUserExistance [error: %0]', err.message);
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
    logger.error('@addNewUser [error: %0]', err.message);
    return Promise.reject(new Error('Cannot Add a new user in mongoDB'));
  }
};
module.exports = { getUser, addNewUser };
