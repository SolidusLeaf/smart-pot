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

router.post("/command", async (req, res) => {
  try {
    const { command, durationMs } = req.body;

    if (!command) {
      return res.status(400).json({
        success: false,
        error: "Command is required"
      });
    }

    if (!allowedCommands.includes(command)) {
      return res.status(400).json({
        success: false,
        error: "Invalid command",
        allowedCommands
      });
    }

    const commandPayload = {
      deviceId: "plant1",
      command,
      durationMs: durationMs ?? null,
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