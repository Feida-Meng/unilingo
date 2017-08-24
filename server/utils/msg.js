var generateMsg = (from, text) => {
  return {
    from,
    text,
    createdAt: new Date().getTime()
  };
};

var generateLocationMsg = (from, coords) => {
  return {
    from,
    url: `https://www.google.ca/maps?=${coords.latitude},${coords.longitude}`,
    createdAt: new Date().getTime()
  };

}

module.exports = {generateMsg, generateLocationMsg};
