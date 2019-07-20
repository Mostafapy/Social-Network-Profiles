const jwt = require('jsonwebtoken');
const { secret } = require('config').get('jwt');

const logger = require('../utils/logger')('Middlewares:Authorization');

const isAuthorized = (req, res, next) => {
  // Get token from header
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      msg: 'No  token, Authorization is denied',
    });
  }
  // verfy token
  try {
    const decodedToken = jwt.verify(token, secret);

    req.user = decodedToken.user;

    next();
  } catch (err) {
    logger.error('@addNewUser [error: %0]', err.message);

    return res.status(401).json({
      msg: 'Login timed out, Token hs expired, please login again.',
    });
  }
};

module.exports = { isAuthorized };
