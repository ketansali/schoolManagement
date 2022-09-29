const Joi = require("joi");
const { badRequestResponse } = require("../middleware/response");
exports.departmentValidation = (req, res, next) => {
  const department = Joi.object().keys({
    departmentName: Joi.string().required(),
  });
  const { error } = department.validate(req.body);
  if (!error) return next();
  const message = error.details.map((e) => e.message);
  return badRequestResponse(res, {
    message: message,
  });
};


