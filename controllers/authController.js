const jwt = require('jsonwebtoken');
const { promisify } = require('util');
// configration
const jwtConfig = require('config').get('jwt');

const encryption = require('../utils/encryption');

const userCRUDLogic = require('../logic/userCRUD');
const logger = require('../utils/logger')('Controllers:AuthController');

// [GET] api/auth
const manageAuthorization = async (req, res) => {
  try {
    const retrievedUser = await userCRUDLogic.getUserById(req.user.id);

    res.json(retrievedUser);
  } catch (err) {
    logger.error('@manageAuth [error: %0]', err.message);

    res.status(500).send('Server Error');
  }
};

// [POST] api/auth
const manageAuthentication = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existedUser = await userCRUDLogic.getUser(email);
    if (!existedUser) {
      return res.status(400).json({
        error: [
          {
            msg: 'Invalid Credentials',
          },
        ],
      });
    }
    // compare password
    const isMatch = await encryption.comparePasswordToHash(
      password,
      existedUser.password,
    );

    if (!isMatch) {
      return res.status(400).json({
        error: [
          {
            msg: 'Invalid Credentials',
          },
        ],
      });
    }

    const payload = {
      user: {
        id: existedUser.id,
      },
    };

    const jwtSign = promisify(jwt.sign);
    const token = await jwtSign(payload, jwtConfig.secret, { expiresIn: 3600 });

    return res.json({ token });
  } catch (err) {
    logger.error('@manageAuthentication() [error: %0]', err.message);

    res.status(500).send('Server Error');
  }
};
module.exports = { manageAuthorization, manageAuthentication };
