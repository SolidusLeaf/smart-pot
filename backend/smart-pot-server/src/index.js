const { initDatabase } = require("./database/db");
const summaryRoute = require("./api/summary");
const express = require("express");
const cors = require("cors");
const { startMqttPublisher } = require("./mqtt/publisher");
require("dotenv").config();

const latestRoute = require("./api/latest");
const historyRoute = require("./api/history");
const commandsRoute = require("./api/commands");
const { startMqttSubscriber, getMqttStatus } = require("./mqtt/subscriber");

const alertsRoute = require("./api/alerts");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", latestRoute);
app.use("/api", historyRoute);
app.use("/api", commandsRoute);
app.use("/api", summaryRoute);
app.use("/api", alertsRoute);

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
    mqtt: getMqttStatus(),
    database: "connected"
  });
});

initDatabase();
startMqttSubscriber();
startMqttPublisher();

app.listen(PORT, () => {
  console.log(`Smart Pot server running on port ${PORT}`);
});