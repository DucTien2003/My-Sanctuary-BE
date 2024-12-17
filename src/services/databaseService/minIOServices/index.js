const bucket = require("./bucketServices");
const object = require("./objectServices");

module.exports = {
  ...bucket,
  ...object,
};
