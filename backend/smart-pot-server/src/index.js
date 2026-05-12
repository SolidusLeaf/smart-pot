const express = require("express");
const cors = require("cors");
require("dotenv").config();

const latestRoute = require("./api/latest");
const historyRoute = require("./api/history");
const commandsRoute = require("./api/commands");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", latestRoute);
app.use("/api", historyRoute);
app.use("/api", commandsRoute);

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