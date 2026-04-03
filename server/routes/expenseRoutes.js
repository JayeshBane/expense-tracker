const express = require("express");

const { getExpenses } = require("../controllers/expenseController");

const router = express.Router();

router.get("/", getExpenses);

module.exports = router;
