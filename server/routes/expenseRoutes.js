const express = require("express");

const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  exportExpenses,
} = require("../controllers/expenseController");

const router = express.Router();

router.get("/export", exportExpenses);

router.get("/", getExpenses);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
