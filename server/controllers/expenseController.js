const prisma = require("../db/prisma");

// GET /api/expenses
const getExpenses = async (req, res) => {
  try {
    const { start, end, categoryId, paymentMethodId } = req.query;

    const expenses = await prisma.expense.findMany({
      where: {
        ...(start || end
          ? {
              expenseDate: {
                ...(start && { gte: new Date(start) }),
                ...(end && { lte: new Date(end) }),
              },
            }
          : {}),
        ...(categoryId && { categoryId: parseInt(categoryId) }),
        ...(paymentMethodId && { paymentMethodId: parseInt(paymentMethodId) }),
      },
      include: {
        category: true,
        paymentMethod: true,
      },
      orderBy: {
        expenseDate: "desc",
      },
    });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/expenses
const createExpense = async (req, res) => {};

module.exports = {
  getExpenses,
};
