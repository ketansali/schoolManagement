const Joi = require("joi");
const { badRequestResponse } = require("../middleware/response");
exports.countryValidation = (req, res, next) => {
  const country = Joi.object().keys({
    countryName: Joi.string().required(),
  });
  const { error } = country.validate(req.body);
  if (!error) return next();
  const message = error.details.map((e) => e.message);
  return badRequestResponse(res, {
    message: message,
  });
};


