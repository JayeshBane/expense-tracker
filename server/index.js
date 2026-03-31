const express = require("express");
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    text: "Hello World",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
