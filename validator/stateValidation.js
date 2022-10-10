const Joi = require("joi");
const { badRequestResponse } = require("../middleware/response");
exports.stateValidation = (req, res, next) => {
  const state = Joi.object().keys({
    stateName: Joi.string().required(),
    CountryId: Joi.string().required(),
  });
  const { error } = state.validate(req.body);
  if (!error) return next();
  const message = error.details.map((e) => e.message);
  return badRequestResponse(res, {
    message: message,
  });
};


