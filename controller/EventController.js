const mongoose = require("mongoose");
const errorResponse = require("../middleware/error-response");
const EVENT = mongoose.model("event");
const { decodeUris, cloneDeep } = require("../lib/commonQuery");
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
        eventName: { $regex: req.body.eventName, $options: "i" },
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
        createdBy: req.user._id,
        isActive: true,
      };

      const imageFile = req.files ? req.files.images : [];
      const imgs = await this.event.getImageOptions(imageFile);
      if (imgs) event.images = imgs;

      const isCreated = await EVENT.create(event);
      if (isCreated) {
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
      const eventInfo = await EVENT.findOne({
        _id: req.body.id,
      });
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
        updatedBy: req.user._id,
      };
      const imageFile = req.files ? req.files.images : [];
      const imgs = await this.event.getImageOptions(imageFile);
      if (imgs) {
        let pathDirectory = __dirname.split("\\");
      console.log(pathDirectory);
      pathDirectory.pop();
      pathDirectory = pathDirectory.join("\\");
      eventInfo.images.map((imgName) => {
        fs.unlink(`${pathDirectory}/uploads/eventes/${imgName}`, (err) => {});
      });
        event.images = imgs
      }
      await EVENT.findOneAndUpdate(
        { _id: eventInfo._id },
        {
          $set: event,
        }
      );
      return successResponse(res, {
        message: "Event updated successfully",
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  deleteEvent: async (req, res) => {
    try {
      const eventInfo = await EVENT.findOne({
        _id: req.query.id,
      });
      if (!eventInfo) {
        return badRequestResponse(res, {
          message: "Event not found",
        });
      }
      let pathDirectory = __dirname.split("\\");
      console.log(pathDirectory);
      pathDirectory.pop();
      pathDirectory = pathDirectory.join("\\");
      eventInfo.images.map((imgName) => {
        fs.unlink(`${pathDirectory}/uploads/eventes/${imgName}`, (err) => {});
      });
      await EVENT.findByIdAndRemove({
        _id: eventInfo._id,
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
      req.body = decodeUris(req.body);
      const coutries = await EVENT.find({});
      return successResponse(res, {
        data: cloneDeep(coutries),
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getEventById: async (req, res) => {
    try {
      req.body = decodeUris(req.body);
      const eventInfo = await EVENT.findOne({
        _id: req.query.id,
      });
      if (!eventInfo) {
        return badRequestResponse(res, {
          message: "Event not found",
        });
      }
      return successResponse(res, {
        data: cloneDeep(eventInfo),
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
};
