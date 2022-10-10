const Joi = require("joi");
const { badRequestResponse } = require("../middleware/response");
exports.userValidation = (req, res, next) => {
  const user = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    contact: Joi.string()
      .max(10).min(10)
      .required(),
    CountryId: Joi.string().required(),
    StateId: Joi.string().required(),
    CityId: Joi.string().required(),
    address: Joi.string().required(),
    degree: Joi.string().required(),
    departmentId: Joi.string().required(),
    userType: Joi.string().required(),
    DOB: Joi.date().required(),
    DOJ: Joi.date().required(),
    courseId: Joi.array().required(),
  });
  const { error } = user.validate(req.body);
  if (!error) return next();
  const message = error.details.map((e) => e.message);
  return badRequestResponse(res, {
    message: message,
  });
};
