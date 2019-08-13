const Joi = require('joi');

const addExperienceToProfileRequestSchema = Joi.object()
  .required()
  .keys({
    title: Joi.string().required(),
    company: Joi.string().required(),
    from: Joi.date().required(),
    location: Joi.string(),
    description: Joi.string(),
    to: Joi.date(),
    current: Joi.boolean(),
  });

const addExperienceToProfileRequestValidation = (req, res, next) => {
  const validatedBody = Joi.validate(
    req.body,
    addExperienceToProfileRequestSchema,
  );

  if (validatedBody.error !== null) {
    const error = validatedBody.error.details[0];

    const errStr = `${error.message}, (error path): ${error.path.join('.')}`;

    return res.status(400).json({ errors: [errStr] });
  }

  return next();
};

module.exports = addExperienceToProfileRequestValidation;
