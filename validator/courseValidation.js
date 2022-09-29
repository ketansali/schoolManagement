const Joi = require("joi");
const { badRequestResponse } = require("../middleware/response");
exports.courseValidation = (req, res, next) => {
  const course = Joi.object().keys({
    courseName: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    description: Joi.string().required(),
  });
  const { error } = course.validate(req.body);
  if (!error) return next();
  const message = error.details.map((e) => e.message);
  return badRequestResponse(res, {
    message: message,
  });
};


