const Joi = require('joi');

const socialsSchema = Joi.string().uri({ scheme: ['https'] });

const createOrUpdateProfileRequestValidation = Joi.object()
  .required()
  .keys({
    status: Joi.string().required(),
    skills: Joi.string().required(),
    company: Joi.string(),
    bio: Joi.string(),
    website: Joi.string().uri(),
    location: Joi.string(),
    githubusername: Joi.string(),
    youtube: socialsSchema,
    facebook: socialsSchema,
    twitter: socialsSchema,
    instagram: socialsSchema,
    linkedin: socialsSchema,
  });

const userRequestValidation = (req, res, next) => {
  const validatedBody = Joi.validate(
    req.body,
    createOrUpdateProfileRequestValidation,
  );

  if (validatedBody.error !== null) {
    const error = validatedBody.error.details[0];

    const errStr = `${error.message}, (error path): ${error.path.join('.')}`;

    return res.status(422).json({
      err: errStr,
      msg: 'Input validation error.',
      data: null,
    });
  }

  return next();
};

module.exports = userRequestValidation;
