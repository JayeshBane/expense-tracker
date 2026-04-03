const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send({
    text: "Expenses Route",
  });
});

module.exports = router;
