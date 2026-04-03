const express = require("express");
const {
  getBarData,
  getLineData,
  getPieData,
} = require("../controllers/chartController");

const router = express.Router();

router.get("/bar", getBarData);
router.get("/line", getLineData);
router.get("/pie", getPieData);

module.exports = router;
