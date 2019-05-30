const userCRUDLogic = require('../logic/userCRUD');
const logger = require('../utils/logger')('Controllers:AuthController');

const manageAuth = async (req, res) => {
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

module.exports = manageAuth;
