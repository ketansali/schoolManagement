const errorResponse = require("../middleware/error-response");
const COUNTRY = require("../models/countrySchema");
const {
  successResponse,
  badRequestResponse,
} = require("../middleware/response");
const { Sequelize,Op } = require("sequelize");
exports.country = {
  addCountry: async (req, res) => {
    try {
      const countryInfo = await COUNTRY.findOne({
        where: {
          countryName: Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("countryName")),
            "LIKE",
            "%" + req.body.countryName.toLowerCase() + "%"
          ),
        },
      });
      if (countryInfo) {
        return badRequestResponse(res, {
          message: "Country already exist!",
        });
      }
     
      const country = {
        countryName: req.body.countryName,
        createdBy: req.user.Id,
        isActive: true,
      };

      const isCreated = await COUNTRY.create(country);
      if (isCreated) {
        return successResponse(res, {
          message: "Country created successfully",
        });
      } else {
        return badRequestResponse(res, {
          message: "Failed to create Country",
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  updateCountry: async (req, res) => {
    try {
      const countryInfo = await COUNTRY.findByPk(req.body.id);
      if (!countryInfo) {
        return badRequestResponse(res, {
          message: "Country not found",
        });
      }
      const nameExisted = await COUNTRY.findOne({
        where: { [Op.and]:{
          countryName: Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col('countryName')),
            "LIKE",
            "%" + req.body.countryName.toLowerCase() + "%"
          ),
          Id :{
            [Op.ne]:req.body.id
          }
        }   
        },
      })
      if(nameExisted) return badRequestResponse(res,{
        message :'Country already exist!'
      })
      await COUNTRY.update(
        {
          countryName: req.body.countryName,
          updatedBy: req.user.Id,
        },
        { where: { Id: countryInfo.Id } }
      );
      return successResponse(res, {
        message: "Country updated successfully",
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  deleteCountry: async (req, res) => {
    try {
      const countryInfo = await COUNTRY.findByPk(req.query.id);
      if (!countryInfo) {
        return badRequestResponse(res, {
          message: "Country not found",
        });
      }
      await COUNTRY.destroy({
        where: { Id: req.query.id },
      });
      return successResponse(res, {
        message: "Country deleted successfully",
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getCountries: async (req, res) => {
    try {
      const coutries = await COUNTRY.findAll({});
      return successResponse(res, {
        data: coutries,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getCountryById: async (req, res) => {
    try {
      const countryInfo = await COUNTRY.findByPk(req.query.id);
      if (!countryInfo) {
        return badRequestResponse(res, {
          message: "Country not found",
        });
      }
      return successResponse(res, {
        data: countryInfo,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
};
