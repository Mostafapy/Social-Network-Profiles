const profileModel = require('../models/profileModel');
const logger = require('../utils/logger')('Logic:profileCRUD');

/**
 * Function the retrieve user profile
 * @param {String} id
 * @returns {Promise | Error}
 */
const getUserProfile = async id => {
  try {
    const profile = await profileModel
      .findOne({ user: id }, { _id: 0 })
      .populate('user', ['name', 'avatar']);

    return Promise.resolve(profile);
  } catch (err) {
    logger.error('@getUserProfile() [error: %0]', err.message);

    return Promise.reject(
      new Error('Cannot complete finding the requested profile in mongoDB'),
    );
  }
};

module.exports = { getUserProfile };
