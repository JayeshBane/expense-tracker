const getExpenses = async (req, res) => {
  res.send({
    text: "Expenses Route",
  });
};

module.exports = {
  getExpenses,
};
