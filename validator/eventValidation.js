const Joi = require("joi");
const { badRequestResponse } = require("../middleware/response");
exports.eventValidation = (req, res, next) => {
  const event = Joi.object().keys({
    eventName: Joi.string().required(),
    time: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    description: Joi.string().required(),
  });
  const { error } = event.validate(req.body);
  if (!error) return next();
  const message = error.details.map((e) => e.message);
  return badRequestResponse(res, {
    message: message,
  });
};
