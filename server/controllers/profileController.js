const request = require('request');
const config = require('config');
const profileCRUDLogic = require('../logic/profileCRUD');
const userCRUDLogic = require('../logic/userCRUD');
const logger = require('../utils/logger')('Controllers:ProfileController');

// private function
const _request = options =>
  new Promise((resolve, reject) => {
    request(options, (err, response, body) => {
      if (!err && response.statusCode === 200) {
        resolve(body);
      } else {
        if (response.statusCode === 404) {
          resolve(null);
        }
        reject(new Error(err));
      }
    });
  });

// [GET] api/profile
const currentUserProfileRetrieverById = async (req, res) => {
  try {
    const retrievedProfile = await profileCRUDLogic.getUserProfileById(
      req.user.id,
    );

    if (!retrievedProfile) {
      return res.status(401).json({
        msg: 'There is no profile for this user',
      });
    }

    return res.json(retrievedProfile);
  } catch (err) {
    logger.error('@userProfileRetriever() [error: %0]', err.message);

    return res.status(500).send('Server Error');
  }
};

// [POST] api/profile/
const userProfileCreatorOrUpdater = async (req, res) => {
  const {
    handle,
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

    if (handle) profileOBJ.handle = handle;
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

    await profileCRUDLogic.createOrUpdateProfile(profileOBJ.user, profileOBJ); // created //updated

    const profile = await profileCRUDLogic.getUserProfile(profileOBJ.user);

    return res.json(profile);
  } catch (err) {
    logger.error('@userProfileCreatorOrUpdater() [error: %0]', err.message);

    return res.status(500).send('Server Error');
  }
};

// [GET] api/profile/all
const allUserProfilesRetriever = async (req, res) => {
  try {
    const allProfiles = await profileCRUDLogic.getAllUserProfile();

    return res.json(allProfiles);
  } catch (err) {
    logger.error('@allUserProfilesRetriever() [error: %0]', err.message);

    return res.status(500).send('Server Error');
  }
};

// [GET] api/profile/user/:user_id
const userProfileRetrieverByUserId = async (req, res) => {
  try {
    const retrievedProfile = await profileCRUDLogic.getUserProfileById(
      req.params.user_id,
    );

    if (!retrievedProfile) {
      return res.status(400).json({
        msg: 'Profile is not found',
      });
    }

    return res.json(retrievedProfile);
  } catch (err) {
    logger.error('@userProfileRetriever() [error: %0]', err.message);

    if (err.kind === 'ObjectId') {
      return res.status(400).json({
        msg: 'Profile is not found',
      });
    }
    return res.status(500).send('Server Error');
  }
};

// [DELETE] api/profile
const deleteProfileWithUser = async (req, res) => {
  try {
    // delete profile
    await profileCRUDLogic.deleteProfile(req.user.id);
    // delete user
    await userCRUDLogic.deleteUser(req.user.id);

    return res.json({
      msg: `The requested user is deleted with it's profile`,
    });
  } catch (err) {
    logger.error('@deleteProfileWithUser() [error: %0]', err.message);

    return res.status(500).send('Server Error');
  }
};

// [PUT] api/profile/experience
const addExperienceToProfile = async (req, res) => {
  const { title, company, location, from, to, current, description } = req.body;

  console.log(req.body);
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

    return res.status(200).json(retrievedProfile);
  } catch (err) {
    logger.error('@addExperienceToProfile() [error: %0]', err.message);

    return res.status(500).send('Server Error');
  }
};

// [DELETE] api/profile/experience/:experienceId
const deleteExperienceFromProfile = async (req, res) => {
  try {
    await profileCRUDLogic.deleteExperience(
      req.user.id,
      req.params.experienceId,
    );

    const profile = await profileCRUDLogic.getUserProfile(req.user.id);

    return res.json(profile);
  } catch (err) {
    logger.error('@deleteExperienceFromProfile() [error: %0]', err.message);

    return res.status(500).send('Server Error');
  }
};

// [PUT] api/profile/education
const addEducationToProfile = async (req, res) => {
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  } = req.body;

  const newEduOBJ = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  };
  try {
    const retrievedProfile = await profileCRUDLogic.addEducation(
      req.user.id,
      newEduOBJ,
    );

    return res.json(retrievedProfile);
  } catch (err) {
    logger.error('@addEducationToProfile() [error: %0]', err.message);

    return res.status(500).send('Server Error');
  }
};

// [DELETE] api/profile/education/:educationId
const deleteEducationFromProfile = async (req, res) => {
  try {
    await profileCRUDLogic.deleteEducation(req.user.id, req.params.educationId);

    const profile = await profileCRUDLogic.getUserProfile(req.user.id);

    return res.json(profile);
  } catch (err) {
    logger.error('@deleteEducationFromProfile() [error: %0]', err.message);

    return res.status(500).send('Server Error');
  }
};

// [GET] api/profile/github/:username
const getGithubReposForProfiles = async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${
        config.get('github').clientId
      }&client_secret=${config.get('github').secret}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };
    const response = await _request(options);
    if (response) {
      return res.json(JSON.parse(response));
    }

    return res.status(404).json({
      msg: `No Github Profile Found`,
    });
  } catch (err) {
    logger.error('@getGithubReposForProfiles() [error: %0]', err.message);

    return res.status(500).send('Server Error');
  }
};

// [GET] api/profile/handle/:handle
const userProfileRetrieverByHandle = async (req, res) => {
  try {
    const profile = await profileCRUDLogic.getUserProfileByHandler(
      req.params.handle,
    );
    if (!profile) {
      res.status(404).json('No profile found for this handler');
    }

    res.json(profile);
  } catch (err) {
    logger.error('@userProfileRetrieverByHandle() [error: %0]', err.message);

    return res.status(500).send('Server Error');
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
  addEducationToProfile,
  deleteEducationFromProfile,
  getGithubReposForProfiles,
  userProfileRetrieverByHandle,
};
