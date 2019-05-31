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

    res.status(200).json({
      err: null,
      msg: null,
      data: retrievedUser,
    });
  } catch (err) {
    console.log('err');
    logger.error('@manageAuth [error: %0]', err.message);

    res.status(500).json({
      err: null,
      msg: `Cannot find the requested user by this Id`,
      data: null,
    });
  }
};

// [POST] api/auth
const manageAuthentication = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existedUser = await userCRUDLogic.getUser(email);
    if (!existedUser) {
      return res.status(500).json({
        err: null,
        msg: 'Invalid Credentials',
        data: null,
      });
    }
    // compare password
    const isMatch = await encryption.comparePasswordToHash(
      password,
      existedUser.password,
    );

    if (!isMatch) {
      return res.status(500).json({
        err: null,
        msg: 'Invalid Credentials',
        data: null,
      });
    }

    const payload = {
      user: {
        id: existedUser.id,
      },
    };

    const jwtSign = promisify(jwt.sign);
    const token = await jwtSign(payload, jwtConfig.secret, { expiresIn: 3600 });

    return res.status(200).json({
      err: null,
      msg: 'Signed in successfully',
      data: token,
    });
  } catch (err) {
    logger.error('@manageAuthentication() [error: %0]', err.message);

    return res.status(500).json({
      err: null,
      msg: 'Cannot authorize The Requested User',
      data: null,
    });
  }
};
module.exports = { manageAuthorization, manageAuthentication };
