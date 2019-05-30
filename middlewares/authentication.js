const jwt = require('jsonwebtoken');
const { secret } = require('config').get('jwt');

const logger = require('../utils/logger')('Middlewares:Authorization');

const isAuthenticated = (req, res, next) => {
  // Get token from header
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      error: null,
      msg: 'No  token, Authorization is denied',
      data: null,
    });
  }
  // verfy token
  try {
    const decodedToken = jwt.verify(token, secret);

    req.user = decodedToken.user;

    next();
  } catch (err) {
    logger.error('@addNewUser [error: %0]', err.message);

    return res.status(500).json({
      err: null,
      msg: 'Token Is Not Valid',
      data: null,
    });
  }
};

module.exports = { isAuthenticated };
