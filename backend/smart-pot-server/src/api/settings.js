const express = require("express");
const {
  getSettings,
  updateSettings
} = require("../database/settingsRepository");
const { publishCommand } = require("../mqtt/publisher");

const router = express.Router();

router.get("/settings", (req, res) => {
  getSettings((error, settings) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      data: {
        autoMode: Boolean(settings.auto_mode),
        soilThreshold: settings.soil_threshold,
        updatedAt: settings.updated_at
      }
    });
  });
});

router.put("/settings", async (req, res) => {
  try {
    const { autoMode, soilThreshold } = req.body;

    if (typeof autoMode !== "boolean") {
      return res.status(400).json({
        success: false,
        error: "autoMode must be boolean"
      });
    }

    const threshold = Number(soilThreshold);

    if (Number.isNaN(threshold) || threshold < 10 || threshold > 80) {
      return res.status(400).json({
        success: false,
        error: "soilThreshold must be a number from 10 to 80"
      });
    }

    const dbSettings = {
      auto_mode: autoMode ? 1 : 0,
      soil_threshold: threshold
    };

    updateSettings(dbSettings, async (error, savedSettings) => {
      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      const command = autoMode ? "AUTO_ON" : "AUTO_OFF";

      try {
        await publishCommand({
          deviceId: "plant1",
          command,
          soilThreshold: threshold,
          createdAt: new Date().toISOString()
        });
      } catch (mqttError) {
        console.error("Settings MQTT publish error:", mqttError.message);
      }

      res.json({
        success: true,
        message: "Settings updated",
        data: {
          autoMode: Boolean(savedSettings.auto_mode),
          soilThreshold: savedSettings.soil_threshold
        }
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;