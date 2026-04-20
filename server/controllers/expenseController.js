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
const createExpense = async (req, res) => {
  try {
    const { amount, expenseDate, categoryId, paymentMethodId, notes } =
      req.body;

    if (!amount || !expenseDate) {
      return res
        .status(400)
        .json({ error: "amount and expenseDate are required" });
    }

    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        expenseDate: new Date(expenseDate),
        notes: notes ?? null,
        ...(categoryId && {
          category: { connect: { id: parseInt(categoryId) } },
        }),
        ...(paymentMethodId && {
          paymentMethod: { connect: { id: parseInt(paymentMethodId) } },
        }),
      },
      include: {
        category: true,
        paymentMethod: true,
      },
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/expenses/:id
const updateExpense = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { amount, expenseDate, categoryId, paymentMethodId, notes } =
      req.body;

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        ...(amount && { amount: parseFloat(amount) }),
        ...(expenseDate && { expenseDate: new Date(expenseDate) }),
        ...(notes !== undefined && { notes }),
        ...(categoryId && {
          category: { connect: { id: parseInt(categoryId) } },
        }),
        ...(paymentMethodId && {
          paymentMethod: { connect: { id: parseInt(paymentMethodId) } },
        }),
      },
      include: {
        category: true,
        paymentMethod: true,
      },
    });

    res.json(expense);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/expenses/:id

const deleteExpense = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.expense.delete({ where: { id } });

    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(500).json({ error: err.message });
  }
};

// GET /api/expenses/export?format=csv&start=&end=&categoryId=&paymentMethodId=
const exportExpenses = async (req, res) => {
  try {
    const {
      format = "csv",
      start,
      end,
      categoryId,
      paymentMethodId,
    } = req.query;

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
      orderBy: { expenseDate: "desc" },
    });

    // Flatten for export
    const rows = expenses.map((e) => ({
      date: e.expenseDate.toISOString().slice(0, 10),
      amount: parseFloat(e.amount).toFixed(2),
      category: e.category?.name ?? "Uncategorised",
      payment_method: e.paymentMethod?.name ?? "Unknown",
      notes: e.notes ?? "",
    }));

    if (format === "csv") {
      const { Parser } = require("json2csv");
      const parser = new Parser({
        fields: ["date", "amount", "category", "payment_method", "notes"],
      });
      const csv = parser.parse(rows);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=expenses.csv");
      return res.send(csv);
    }

    if (format === "excel") {
      const ExcelJS = require("exceljs");

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Expenses");

      sheet.columns = [
        { header: "Date", key: "date", width: 14 },
        { header: "Amount ($)", key: "amount", width: 12 },
        { header: "Category", key: "category", width: 18 },
        { header: "Payment Method", key: "payment_method", width: 18 },
        { header: "Notes", key: "notes", width: 32 },
      ];

      sheet.getRow(1).font = { bold: true };
      sheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE9E9E9" },
      };

      sheet.addRows(rows);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=expenses.xlsx",
      );
      await workbook.xlsx.write(res);
      return res.end();
    }

    res
      .status(400)
      .json({ error: "Invalid format. Only csv and excel are supported." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  exportExpenses,
};
