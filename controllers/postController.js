const postCRUDLogic = require('../logic/postCRUD.js');
const logger = require('../utils/logger')('Controllers:PostController');

const addPost = async (req, res) => {
  try {
    await postCRUDLogic.createPost(req.user.id, req.body.text);

    return res.status(200).json({
      err: null,
      msg: `Successfully new post added`,
      data: null,
    });
  } catch (err) {
    logger.error('@addPost() [error: %0]', err.message);

    return res.status(500).json({
      err: null,
      msg: `Cannot add new post`,
      data: null,
    });
  }
};

module.exports = { addPost };
