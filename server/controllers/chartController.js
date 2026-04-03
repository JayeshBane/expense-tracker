const getCharts = async (req, res) => {
  res.send({
    text: "Charts Route",
  });
};

module.exports = {
  getCharts,
};
