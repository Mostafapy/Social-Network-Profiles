const Joi = require('joi');

const addEducationToProfileRequestSchema = Joi.object()
  .required()
  .keys({
    school: Joi.string().required(),
    degree: Joi.string().required(),
    from: Joi.date().required(),
    fieldofstudy: Joi.string(),
    description: Joi.string(),
    to: Joi.date(),
    current: Joi.boolean().required(),
  });

const addEducationToProfileRequestValidation = (req, res, next) => {
  const validatedBody = Joi.validate(
    req.body,
    addEducationToProfileRequestSchema,
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

module.exports = addEducationToProfileRequestValidation;
