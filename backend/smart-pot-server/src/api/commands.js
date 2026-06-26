const express = require("express");
const { publishCommand } = require("../mqtt/publisher");

const router = express.Router();

const allowedCommands = [
  "WATER",
  "PUMP_OFF",
  "FAN_ON",
  "FAN_OFF",
  "AUTO_ON",
  "AUTO_OFF"
];

const maxWaterDurationMs = 10000;

router.post("/command", async (req, res) => {
  try {
    const { command, durationMs } = req.body;

    if (!command || typeof command !== "string") {
      return res.status(400).json({
        success: false,
        error: "Command is required and must be a string"
      });
    }

    if (!allowedCommands.includes(command)) {
      return res.status(400).json({
        success: false,
        error: "Invalid command",
        allowedCommands
      });
    }

    let safeDurationMs = null;

    if (durationMs !== null && durationMs !== undefined) {
      safeDurationMs = Number(durationMs);

      if (
        Number.isNaN(safeDurationMs) ||
        safeDurationMs < 0 ||
        safeDurationMs > maxWaterDurationMs
      ) {
        return res.status(400).json({
          success: false,
          error: `durationMs must be between 0 and ${maxWaterDurationMs}`
        });
      }
    }

    if (command === "WATER" && safeDurationMs === null) {
      safeDurationMs = 3000;
    }

    if (command !== "WATER") {
      safeDurationMs = null;
    }

    const commandPayload = {
      deviceId: "plant1",
      command,
      durationMs: safeDurationMs,
      createdAt: new Date().toISOString()
    };

    const published = await publishCommand(commandPayload);

    res.json({
      success: true,
      message: "Command published to MQTT",
      data: published
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;