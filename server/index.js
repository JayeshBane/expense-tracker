const express = require("express");
const cors = require("cors");

require("dotenv").config();

// Importing routes
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const metaRoutes = require("./routes/metaRoutes");
const chartRoutes = require("./routes/chartRoutes");

const authMiddleware = require("./middleware/auth");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    text: "Hello World",
  });
});

// Auth routes (public)
app.use("/api/auth", authRoutes);

// App routes (require a valid JWT; req.userId is set by authMiddleware)
app.use("/api/expenses", authMiddleware, expenseRoutes);
app.use("/api", authMiddleware, metaRoutes);
app.use("/api/charts", authMiddleware, chartRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
