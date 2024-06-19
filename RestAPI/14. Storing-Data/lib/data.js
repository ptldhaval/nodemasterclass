const fs = require("fs");
const path = require("path");

var lib = {};
//methods
var getFilePath = (dir, file) => lib.baseDir + dir + "/" + file + ".json";

function writeNewFile(filePath, data, callback) {
  fs.open(filePath, "wx", function (err, fd) {
    if (!err) {
      //convert data to string
      const dString = JSON.stringify(data);

      //write to the file and close it
      fs.writeFile(fd, dString, function (err) {
        if (!err) {
          callback(false);
        } else {
          callback("ERROR: Writing data to the new file");
        }
      });
    } else {
      callback("ERROR: File already exist");
    }
  });
}

//Base directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data/");
lib.create = function (dir, file, data, callback) {
  const filePath = getFilePath(dir, file);
  //check direcotry exit or not
  fs.readdir(lib.baseDir + dir, function (err) {
    if (err) {
      //create directory
      fs.mkdir(lib.baseDir + dir, function (err) {
        if (!err) {
          //check the file to write
          writeNewFile(filePath, data, callback);
        } else {
          callback("ERROR: Directory not created");
        }
      });
    } else {
      //check the file to write
      writeNewFile(filePath, data, callback);
    }
  });
};

module.exports = lib;
