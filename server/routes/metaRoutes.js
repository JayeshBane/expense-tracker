const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} = require("../controllers/metaController");

const router = express.Router();

router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.get("/payment-methods", getPaymentMethods);
router.post("/payment-methods", createPaymentMethod);
router.put("/payment-methods/:id", updatePaymentMethod);
router.delete("/payment-methods/:id", deletePaymentMethod);

module.exports = router;
