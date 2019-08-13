const Joi = require('joi');

const addCommentRequestSchema = Joi.object()
  .required()
  .keys({
    text: Joi.string().required(),
  });

const addCommentRequestValidation = (req, res, next) => {
  const validatedBody = Joi.validate(req.body, addCommentRequestSchema);

  if (validatedBody.error !== null) {
    const error = validatedBody.error.details[0];

    const errStr = `${error.message}, (error path): ${error.path.join('.')}`;

    return res.status(400).json({ errors: [errStr] });
  }

  return next();
};

module.exports = addCommentRequestValidation;
