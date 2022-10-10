const fs = require("fs");
exports.unlikeImage = (path) => {
  let pathDirectory = __dirname.split("\\");
  pathDirectory.pop();
  pathDirectory = pathDirectory.join("\\");
  fs.unlink(`${pathDirectory}${path}`, (err) => {});
};
