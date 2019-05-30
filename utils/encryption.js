const bcrypt = require('bcryptjs');
const logger = require('./logger')('Utils:Encryption');

/**
 * Function that takes a plain text string and returns a salt-hash encrypted string
 * @param {String} password
 * @returns {Promise | Void}
 */
const passwordHashing = async password => {
  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    return Promise.resolve(hashedPassword);
  } catch (err) {
    logger.error('@passwordHashing() [error: %0]', err.message);
    return Promise.reject(new Error(' Cannot Hash This Password Text'));
  }
};

/**
 * Function that takes a plain text string and a salt-hash, and checks if they match after encryption
 * @param {String} candidatePassword
 * @param {String} hash
 * @returns {Promise | Error}
 */
const comparePasswordToHash = async (candidatePassword, hash) => {
  try {
    await bcrypt.compare(candidatePassword, hash);
  } catch (err) {
    logger.error('@comparePasswordToHash() [error: %0]', err.message);
    return Promise.reject(
      new Error(`Cannot Compare This Password to it's hash code`),
    );
  }
};

module.exports = {
  passwordHashing,
  comparePasswordToHash,
};
