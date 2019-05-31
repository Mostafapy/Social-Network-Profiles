const Joi = require('joi');

const authenticationRequestSchema = Joi.object()
  .required()
  .keys({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string()
      .min(6)
      .required(),
  });

const userRequestValidation = (req, res, next) => {
  const validatedBody = Joi.validate(req.body, authenticationRequestSchema);

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
