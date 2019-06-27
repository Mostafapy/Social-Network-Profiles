const Joi = require('joi');

const addPostRequestSchema = Joi.object()
  .required()
  .keys({
    text: Joi.string().required(),
  });

const addPostRequestValidation = (req, res, next) => {
  const validatedBody = Joi.validate(req.body, addPostRequestSchema);

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

module.exports = addPostRequestValidation;
