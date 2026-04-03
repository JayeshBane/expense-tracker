const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send({
    text: "Metadata Route",
  });
});

module.exports = router;
