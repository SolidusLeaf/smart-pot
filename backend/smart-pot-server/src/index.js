const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Smart Pot Backend is running",
    status: "OK"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    backend: "online",
    mqtt: "not_connected_yet",
    database: "not_connected_yet"
  });
});

app.listen(PORT, () => {
  console.log(`Smart Pot server running on port ${PORT}`);
});