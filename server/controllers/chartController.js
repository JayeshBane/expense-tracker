const prisma = require("../db/prisma");

// GET /api/charts/bar?start=2024-01-01&end=2024-01-31
const getBarData = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res
        .status(400)
        .json({ error: "start and end query params are required" });
    }

    const rows = await prisma.$queryRaw`
      SELECT
        TO_CHAR(expense_date, 'YYYY-MM-DD') AS date,
        SUM(amount)::FLOAT                  AS total
      FROM expenses
      WHERE expense_date BETWEEN ${new Date(start)} AND ${new Date(end)}
      GROUP BY expense_date
      ORDER BY expense_date ASC
    `;

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/charts/line?months=6
const getLineData = async (req, res) => {
  try {
    const months = parseInt(req.query.months ?? 6);

    const rows = await prisma.$queryRaw`
      SELECT
        TO_CHAR(DATE_TRUNC('month', expense_date), 'Mon YYYY') AS month,
        DATE_TRUNC('month', expense_date)                       AS month_date,
        SUM(amount)::FLOAT                                      AS total
      FROM expenses
      WHERE expense_date >= DATE_TRUNC('month', NOW()) - ${months} * INTERVAL '1 month'
      GROUP BY DATE_TRUNC('month', expense_date)
      ORDER BY month_date ASC
    `;

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/charts/pie?start=2024-01-01&end=2024-01-31
const getPieData = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res
        .status(400)
        .json({ error: "start and end query params are required" });
    }

    const rows = await prisma.$queryRaw`
      SELECT
        COALESCE(c.name, 'Uncategorised') AS category,
        COALESCE(c.color, '#a8a49e')      AS color,
        SUM(e.amount)::FLOAT              AS total
      FROM expenses e
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.expense_date BETWEEN ${new Date(start)} AND ${new Date(end)}
      GROUP BY c.name, c.color
      ORDER BY total DESC
    `;

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getBarData, getLineData, getPieData };
