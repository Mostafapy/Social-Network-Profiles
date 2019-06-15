const profileModel = require('../models/profileModel');
const logger = require('../utils/logger')('Logic:profileCRUD');

/**
 * Function the retrieve user , name and avatar user profile by id
 * @param {String} id
 * @returns {Promise | Error}
 */
const getUserProfileById = async id => {
  try {
    const profile = await profileModel
      .findOne({ user: id })
      .populate('user', ['name', 'avatar']);

    return Promise.resolve(profile);
  } catch (err) {
    logger.error('@getUserProfileById() [error: %0]', err.message);

    return Promise.reject(
      new Error('Cannot complete finding the requested profile in mongoDB'),
    );
  }
};

/**
 * update user profile which have the same user id
 * @param {String} id
 * @returns {Promise | Error}
 */
const _updateProfile = async (id, fields) => {
  try {
    await profileModel.updateOne({ user: id }, { $set: fields });
    return Promise.resolve('updated');
  } catch (err) {
    logger.error('@_updateProfile() [error: %0]', err.message);
    return Promise.reject(new Error('Cannot update user Profile'));
  }
};

/**
 * function to create or update user profile
 * @param {String} id
 * @param {Object} fields
 * @returns {Promise | Error}
 */
const createOrUpdateProfile = async (id, fields) => {
  try {
    await profileModel.create(fields);

    return Promise.resolve('created');
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      await _updateProfile(id, fields);
    }

    logger.error('@createOrUpdateProfile() [error: %0]', err.message);
    return Promise.reject(
      new Error(new Error('Cannot create or update user Profile')),
    );
  }
};

/**
 * Function the retrieve all user profile
 * @returns {Promise | Error}
 */
const getAllUserProfile = async () => {
  try {
    const profile = await profileModel
      .findOne()
      .populate('user', ['name', 'avatar']);

    return Promise.resolve(profile);
  } catch (err) {
    logger.error('@getAllUserProfile() [error: %0]', err.message);

    return Promise.reject(new Error('Cannot retrieve any profile in mongoDB'));
  }
};

/**
 * Function the delete profile
 * @returns {Promise | Error}
 */
const deleteProfile = async id => {
  try {
    await profileModel.findOneAndRemove({ user: id });

    return Promise.resolve();
  } catch (err) {
    logger.error('@deleteProfile() [error: %0]', err.message);

    return Promise.reject(new Error('Cannot delete this profile in mongoDB'));
  }
};

/**
 * Function to add experience to the requested profile id
 * @param {String} id
 * @param {Object} experienceFields
 * @returns {Promise | Error}
 */
const addExperience = async (id, experienceFields) => {
  try {
    const profile = await profileModel.findOne({ user: id });

    profile.experience.unshift(experienceFields);

    profile.save();

    return Promise.resolve(profile);
  } catch (err) {
    logger.error('@getUserProfileByIdAllData() [error: %0]', err.message);

    return Promise.reject(
      new Error('Cannot complete finding the requested profile in mongoDB'),
    );
  }
};

/**
 * Function to delete the experience attribute in a user profile
 * @param {String} userId
 * @param {String} expId
 * @returns {Promise | Error}
 */
const deleteExperience = async (userId, expId) => {
  try {
    await profileModel.findOneAndUpdate(
      { user: userId },
      { $pull: { experience: { _id: expId } } },
      { useFindAndModify: false },
    );

    return Promise.resolve();
  } catch (err) {
    logger.error('@deleteExperience() [error: %0]', err.message);

    return Promise.reject(
      new Error('Cannot delete experience for this profile'),
    );
  }
};

module.exports = {
  getUserProfileById,
  createOrUpdateProfile,
  getAllUserProfile,
  deleteProfile,
  addExperience,
  deleteExperience,
};
