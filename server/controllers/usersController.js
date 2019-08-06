const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
// configration
const jwtConfig = require('config').get('jwt');

const encryption = require('../utils/encryption');
const userCRUDLogic = require('../logic/userCRUD');
const logger = require('../utils/logger')('Controllers:UsersController');

// [POST] api/users
const userRegistration = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existedUser = await userCRUDLogic.getUser(email);
    if (existedUser) {
      return res.status(400).json({
        errors: [
          {
            msg: 'User already exists',
          },
        ],
      });
    }
    const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });

    const hashedPassword = await encryption.passwordHashing(password);

    await userCRUDLogic.addNewUser(name, email, avatar, hashedPassword);
    // initalize payload
    const user = await userCRUDLogic.getUser(email);

    const payload = {
      user: {
        id: user.id,
      },
    };

    const jwtSign = promisify(jwt.sign);
    const token = await jwtSign(payload, jwtConfig.secret, { expiresIn: 3600 });

    return res.json({ token });
  } catch (err) {
    logger.error('@userRegistration() [error: %0]', err.message);

    return res.status(500).send('Server Error');
  }
};

module.exports = { userRegistration };
