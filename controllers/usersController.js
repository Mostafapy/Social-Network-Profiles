const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const userCRUDLogic = require('../logic/userCRUD');
const logger = require('../utils/logger')('Controllers:UsersController');

// [POST] api/users
const userRegistration = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existedUser = await userCRUDLogic.checkUserExistance(email);
    if (existedUser) {
      return res.status(500).json({
        err: null,
        msg: 'User already exists',
        data: null,
      });
    }
    const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    await userCRUDLogic.addNewUser(name, email, avatar, hashedPassword);

    return res.status(200).json({
      err: null,
      msg: 'One User is registered successfully',
      data: null,
    });
  } catch (err) {
    logger.error('@userRegistration [error: %0]', err.message);
    return res.status(500).json({
      err: 'Cannot register The Requested User',
      msg: 'Cannot register The Requested User',
      data: null,
    });
  }
};

module.exports = { userRegistration };
