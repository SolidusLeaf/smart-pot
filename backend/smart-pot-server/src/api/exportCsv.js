const express = require("express");
const { db } = require("../database/db");

const router = express.Router();

function escapeCsvValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

router.get("/history/export.csv", (req, res) => {
  const deviceId = req.query.device || "smartpot_01";
  const limit = Math.min(Number(req.query.limit) || 500, 5000);

  db.all(
    `
    SELECT
      id,
      device_id,
      soil_humidity,
      air_humidity,
      temperature,
      water_level,
      pump_state,
      fan_state,
      battery_voltage,
      solar_voltage,
      solar_current,
      power_mode,
      light_intensity,
      sun_exposure_today,
      soil_status,
      light_status,
      timestamp
    FROM sensor_readings
    WHERE device_id = ?
    ORDER BY timestamp DESC
    LIMIT ?
    `,
    [deviceId, limit],
    (error, rows) => {
      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      const headers = [
        "id",
        "device_id",
        "soil_humidity",
        "air_humidity",
        "temperature",
        "water_level",
        "pump_state",
        "fan_state",
        "battery_voltage",
        "solar_voltage",
        "solar_current",
        "power_mode",
        "light_intensity",
        "sun_exposure_today",
        "soil_status",
        "light_status",
        "timestamp"
      ];

      const csvRows = [
        headers.join(","),
        ...rows.map((row) =>
          headers.map((header) => escapeCsvValue(row[header])).join(",")
        )
      ];

      const csv = csvRows.join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="smart-pot-history-${deviceId}.csv"`
      );

      res.send(csv);
    }
  );
});

module.exports = router;