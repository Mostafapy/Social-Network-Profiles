const profileCRUDLogic = require('../logic/profileCRUD');
const logger = require('../utils/logger')('Controllers:ProfileController');

// [GET] api/profile/me
const userProfileRetriever = async (req, res) => {
  try {
    const retrievedProfile = await profileCRUDLogic.getUserProfile(req.user.id);
    if (!retrievedProfile) {
      return res.status(401).json({
        err: null,
        msg: 'There is no profile for this user',
        data: null,
      });
    }
    return res.status(200).json({
      err: null,
      msg: 'The requested profile is retrieved successfully',
      data: retrievedProfile,
    });
  } catch (err) {
    logger.error('@userProfileRetriever() [error: %0]', err.message);

    return res.status(500).json({
      err: null,
      msg: 'Error In Retrieving User Profile',
      data: null,
    });
  }
};

module.exports = { userProfileRetriever };
