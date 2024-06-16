const bucket = require('./bucket');
const object = require('./object');

module.exports = {
  ...bucket,
  ...object,
};
