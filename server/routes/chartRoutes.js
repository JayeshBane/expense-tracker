const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send({
    text: "Charts Route",
  });
});

module.exports = router;
