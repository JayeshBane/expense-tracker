const express = require("express");
const cors = require("cors");

require("dotenv").config();

// Importing routes
const expenseRoutes = require("./routes/expenseRoutes");
const metaRoutes = require("./routes/metaRoutes");
const chartRoutes = require("./routes/chartRoutes");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    text: "Hello World",
  });
});

// App routes
app.use("/api/expenses", expenseRoutes);
app.use("/api", metaRoutes);
app.use("/api/charts", chartRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
