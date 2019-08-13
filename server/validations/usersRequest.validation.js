const Joi = require('joi');

const userRequestSchema = Joi.object()
  .required()
  .keys({
    name: Joi.string().required(),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string()
      .min(6)
      .required(),
  });

const userRequestValidation = (req, res, next) => {
  const validatedBody = Joi.validate(req.body, userRequestSchema);

  if (validatedBody.error !== null) {
    const error = validatedBody.error.details[0];

    const errStr = `${error.message}, (error path): ${error.path.join('.')}`;

    return res.status(400).json({ errors: [errStr] });
  }

  return next();
};

module.exports = userRequestValidation;
