const express = require("express");
const { getCharts } = require("../controllers/chartController");

const router = express.Router();

router.get("/", getCharts);

module.exports = router;
