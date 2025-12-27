const express = require("express");
require("dotenv").config();
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.send(`DB Connected at ${result.rows[0].now}`);
});

const PORT = 9001;
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
