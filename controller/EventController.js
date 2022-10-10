const errorResponse = require("../middleware/error-response");
const EVENT = require("../models/eventSchema");
const EVENTIMAGES = require("../models/eventImagesSchema");
const { Sequelize, Op, QueryTypes } = require("sequelize");
const sequelize = require("../config/db");
const { unlikeImage } = require("../middleware/removeImage");
const {
  successResponse,
  badRequestResponse,
} = require("../middleware/response");
const path = require("path");
const fs = require("fs");
exports.event = {
  getImageOptions: (uploads) => {
    return new Promise((resolve, reject) => {
      const imgData = [];
      let pathDirectory = __dirname.split("\\");
      pathDirectory.pop();
      pathDirectory = pathDirectory.join("\\");
      const uploadFilePath = `${pathDirectory}/uploads/eventes/`;

      uploads.forEach(async (upload) => {
        const extensionName = path.extname(upload.name);
        const allowedExtension = [".png", ".jpg", ".jpeg"];
        if (!allowedExtension.includes(extensionName)) {
          reject("!Invalid image");
        } else {
          const name = await `${new Date().valueOf()}_${Math.ceil(
            Math.random() * 1000
          )}${path.parse(upload.name).ext}`;
          imgData.push(name);
          await upload.mv(`${uploadFilePath}/${name}`, async (err) => {
            if (err) {
              reject("Something wrong");
            }
          });
        }
      });

      resolve(imgData);
    });
  },
  addEvent: async (req, res) => {
    try {
      const eventInfo = await EVENT.findOne({
        where: {
          eventName: Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("eventName")),
            "LIKE",
            "%" + req.body.eventName.toLowerCase() + "%"
          ),
        },
      });
      if (eventInfo) {
        return badRequestResponse(res, {
          message: "Event already exist!",
        });
      }

      const event = {
        eventName: req.body.eventName,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        description: req.body.description,
        time: req.body.time,
        createdBy: req.user.Id,
        isActive: true,
      };

      const imageFile = req.files ? req.files.images : [];
      const imgs = await this.event.getImageOptions(imageFile);

      const isCreated = await EVENT.create(event);
      if (isCreated) {
        if (imgs.length != 0) {
          const imagesdata = imgs.map((i) => {
            return {
              EventId: isCreated.Id,
              image: i,
              createdBy: req.user.Id,
            };
          });
          await EVENTIMAGES.bulkCreate(imagesdata);
        }
        return successResponse(res, {
          message: "Event created successfully",
        });
      } else {
        return badRequestResponse(res, {
          message: "Failed to create Event",
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  updateEvent: async (req, res) => {
    try {
      const eventInfo = await EVENT.findByPk(req.body.id);
      if (!eventInfo) {
        return badRequestResponse(res, {
          message: "Event not found",
        });
      }
      const event = {
        eventName: req.body.eventName,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        description: req.body.description,
        time: req.body.time,
        updatedBy: req.user.Id,
      };
      const imageFile = req.files ? req.files.images : [];
      const imgs = await this.event.getImageOptions(imageFile);

      if (imgs.length != 0) {
        const eventImagesData = await EVENTIMAGES.findAll({
          where: { EventId: eventInfo.Id },
        });
        eventImagesData.map((e) => {
          unlikeImage(`/uploads/eventes/${e.image}`, (err) => {});
        });
        await EVENTIMAGES.destroy({
          where: { EventId: eventInfo.Id },
        });

        const imagesdata = imgs.map((i) => {
          return {
            EventId: eventInfo.Id,
            image: i,
            createdBy: req.user.Id,
            updatedBy: req.user.Id,
          };
        });
        await EVENTIMAGES.bulkCreate(imagesdata);
      }
      await EVENT.update(event, { where: { Id: eventInfo.Id } });
      return successResponse(res, {
        message: "Event updated successfully",
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  deleteEvent: async (req, res) => {
    try {
      const eventInfo = await EVENT.findByPk(req.query.id);
      if (!eventInfo) {
        return badRequestResponse(res, {
          message: "Event not found",
        });
      }
      const eventImagesData = await EVENTIMAGES.findAll({
        where: { EventId: eventInfo.Id },
      });
      
      eventImagesData.map((e) => {
        unlikeImage(`/uploads/eventes/${e.image}`);
      });
      await EVENTIMAGES.destroy({
        where: { EventId: eventInfo.Id },
      });
      await EVENT.destroy({
        where: { Id: req.query.id },
      });
      return successResponse(res, {
        message: "Event deleted successfully",
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getEvents: async (req, res) => {
    try {
      // const eventes = await sequelize.query("select * from events", {
      //   type: QueryTypes.SELECT,
      // });
      // const eventeImages = await sequelize.query("select * from eventimages", {
      //   type: QueryTypes.SELECT,
      // });
      const eventes = await EVENT.findAll({ })
      const eventeImages = await EVENTIMAGES.findAll({});
      await eventes.map((ev) => {
        eventeImages.map((evi) => {
          if (ev.Id == evi.EventId) {
            if (!ev["images"]) ev["images"] = new Array();
            ev.images.push(evi.image);
          }
        });
      });
      return successResponse(res, {
        data: eventes,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getEventById: async (req, res) => {
    try {
      const eventInfo = await EVENT.findByPk(req.query.id);
      const eventeImages = await EVENTIMAGES.findAll({
        where: { EventId: eventInfo.Id },
      });
      if (eventeImages.length != 0) {
        eventeImages.map((evi) => {
          if (!eventInfo["images"]) eventInfo["images"] = new Array();
          eventInfo.images.push(evi.image);
        });
      }

      if (!eventInfo) {
        return badRequestResponse(res, {
          message: "Event not found",
        });
      }
      return successResponse(res, {
        data: eventInfo,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
};
