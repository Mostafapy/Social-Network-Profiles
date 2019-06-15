const profileCRUDLogic = require('../logic/profileCRUD');
const userCRUDLogic = require('../logic/userCRUD');
const logger = require('../utils/logger')('Controllers:ProfileController');

// [GET] api/profile/me
const currentUserProfileRetrieverById = async (req, res) => {
  try {
    const retrievedProfile = await profileCRUDLogic.getUserProfileById(
      req.user.id,
    );

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

// [POST] api/profile/
const userProfileCreatorOrUpdater = async (req, res) => {
  const {
    company,
    website,
    location,
    bio,
    skills,
    status,
    githubusername,
    youtube,
    facebook,
    instagram,
    linkedin,
    twitter,
  } = req.body;
  try {
    const profileOBJ = {};

    profileOBJ.user = req.user.id;

    if (company) profileOBJ.company = company;
    if (youtube) profileOBJ.youtube = youtube;
    if (facebook) profileOBJ.facebook = facebook;
    if (instagram) profileOBJ.instagram = instagram;
    if (twitter) profileOBJ.twitter = twitter;
    if (linkedin) profileOBJ.linkedin = linkedin;
    if (githubusername) profileOBJ.githubusername = githubusername;
    if (website) profileOBJ.website = website;
    if (bio) profileOBJ.bio = bio;
    if (location) profileOBJ.location = location;

    profileOBJ.skills = skills.split(',').map(skill => skill.trim());
    profileOBJ.status = status;

    const actionDone = await profileCRUDLogic.createOrUpdateProfile(
      profileOBJ.user,
      profileOBJ,
    ); // created //updated

    if (actionDone === 'created')
      return res
        .status(200)
        .json({ err: null, msg: `One User Profile Created`, data: null });

    return res
      .status(200)
      .json({ err: null, msg: `One User Profile Updated`, data: null });
  } catch (err) {
    logger.error('@userProfileCreatorOrUpdater() [error: %0]', err.message);

    return res.status(500).json({
      err: null,
      msg: 'Cannot Create Or Update User Profile',
      data: null,
    });
  }
};

// [GET] api/profile/
const allUserProfilesRetriever = async (req, res) => {
  try {
    const allProfiles = await profileCRUDLogic.getAllUserProfile();

    return res.status(200).json({
      err: null,
      msg: 'All User Profiles are retrieved successfully',
      data: allProfiles,
    });
  } catch (err) {
    logger.error('@allUserProfilesRetriever() [error: %0]', err.message);

    return res.status(500).json({
      err: null,
      msg: 'Cannot get User Profiles',
      data: null,
    });
  }
};

// [GET] api/profile/user/:user_id
const userProfileRetrieverByUserId = async (req, res) => {
  try {
    const retrievedProfile = await profileCRUDLogic.getUserProfileById(
      req.params.user_id,
    );

    if (!retrievedProfile) {
      return res.status(401).json({
        err: null,
        msg: 'There is no profile for the requested user id',
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

    if (err.kind === 'ObjectId') {
      return res.status(401).json({
        err: null,
        msg: 'There is no profile for the requested user id',
        data: null,
      });
    }
    return res.status(500).json({
      err: null,
      msg: 'Error In Retrieving User Profile',
      data: null,
    });
  }
};

// [DELETE] api/profile
const deleteProfileWithUser = async (req, res) => {
  try {
    // delete profile
    await profileCRUDLogic.deleteProfile(req.user.id);
    // delete user
    await userCRUDLogic.deleteUser(req.user.id);

    return res.status(200).json({
      err: null,
      msg: `The requested user is deleted with it's profile`,
      data: null,
    });
  } catch (err) {
    logger.error('@deleteProfileWithUser() [error: %0]', err.message);

    return res.status(500).json({
      err: null,
      msg: `Cannot delete this User or it's Profiles`,
      data: null,
    });
  }
};

const addExperienceToProfile = async (req, res) => {
  const { title, company, location, from, to, current, description } = req.body;

  const newExpOBJ = {
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  };
  try {
    const retrievedProfile = await profileCRUDLogic.addExperience(
      req.user.id,
      newExpOBJ,
    );

    return res.status(200).json({
      err: null,
      msg: `New Experience added to requested user profile`,
      data: retrievedProfile,
    });
  } catch (err) {
    logger.error('@addExperienceToProfile() [error: %0]', err.message);

    return res.status(500).json({
      err: null,
      msg: `Cannot Add Experience To This Profile`,
      data: null,
    });
  }
};

const deleteExperienceFromProfile = async (req, res) => {
  try {
    await profileCRUDLogic.deleteExperience(
      req.user.id,
      req.params.experienceId,
    );

    return res.status(200).json({
      err: null,
      msg: `Successfully delete experence for the requested profile`,
      data: null,
    });
  } catch (err) {
    logger.error('@deleteExperienceFromProfile() [error: %0]', err.message);

    return res.status(500).json({
      err: null,
      msg: `Cannot Delete Experience From This Profile`,
      data: null,
    });
  }
};

module.exports = {
  currentUserProfileRetrieverById,
  userProfileCreatorOrUpdater,
  allUserProfilesRetriever,
  userProfileRetrieverByUserId,
  deleteProfileWithUser,
  addExperienceToProfile,
  deleteExperienceFromProfile,
};
