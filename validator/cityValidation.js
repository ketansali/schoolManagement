const Joi = require("joi");
const { badRequestResponse } = require("../middleware/response");
exports.cityValidation = (req, res, next) => {
  const city = Joi.object().keys({
    cityName: Joi.string().required(),
    StateId: Joi.string().required(),
  });
  const { error } = city.validate(req.body);
  if (!error) return next();
  const message = error.details.map((e) => e.message);
  return badRequestResponse(res, {
    message: message,
  });
};


