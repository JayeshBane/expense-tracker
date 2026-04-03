const getMeta = async (req, res) => {
  res.send({
    text: "Meta Route",
  });
};

module.exports = {
  getMeta,
};
