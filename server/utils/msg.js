var moment = require('moment');
var generateMsg = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
};

var generateLocationMsg = (from, coords) => {
  return {
    from,
    url: `https://www.google.ca/maps?=${coords.latitude},${coords.longitude}`,
    createdAt: moment().valueOf()
  };

}

module.exports = {generateMsg, generateLocationMsg};
