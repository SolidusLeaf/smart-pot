const express = require("express");

const router = express.Router();

router.get("/latest", (req, res) => {
  res.json({
    deviceId: "plant1",
    soilMoisture: null,
    temperature: null,
    humidity: null,
    waterLevel: null,
    pumpState: "OFF",
    fanState: "OFF",
    timestamp: new Date().toISOString(),
    message: "No real sensor data yet"
  });
});

module.exports = router;