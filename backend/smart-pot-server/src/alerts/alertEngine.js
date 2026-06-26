const { insertAlertIfNotRecent } = require("../database/alertRepository");

function checkTelemetryAlerts(reading) {
  const alerts = [];
  const deviceId = reading.device_id || "smartpot_01";

  if (reading.soil_humidity !== null && reading.soil_humidity < 20) {
    alerts.push({
      device_id: deviceId,
      type: "DRY_SOIL",
      severity: "CRITICAL",
      message: "Soil moisture is critically low",
      value: reading.soil_humidity
    });
  } else if (reading.soil_humidity !== null && reading.soil_humidity < 35) {
    alerts.push({
      device_id: deviceId,
      type: "LOW_SOIL_MOISTURE",
      severity: "WARNING",
      message: "Soil moisture is low",
      value: reading.soil_humidity
    });
  }

  if (reading.water_level && String(reading.water_level).toUpperCase() !== "OK") {
    alerts.push({
      device_id: deviceId,
      type: "LOW_WATER",
      severity: "CRITICAL",
      message: "Water tank level is low or empty",
      value: null
    });
  }

  if (reading.temperature !== null && reading.temperature > 35) {
    alerts.push({
      device_id: deviceId,
      type: "HIGH_TEMPERATURE",
      severity: "WARNING",
      message: "Temperature is too high",
      value: reading.temperature
    });
  }

  if (reading.air_humidity !== null && reading.air_humidity < 30) {
    alerts.push({
      device_id: deviceId,
      type: "LOW_HUMIDITY",
      severity: "WARNING",
      message: "Air humidity is too low",
      value: reading.air_humidity
    });
  }

  if (reading.battery_voltage !== null && reading.battery_voltage < 3.4) {
    alerts.push({
      device_id: deviceId,
      type: "LOW_BATTERY",
      severity: "WARNING",
      message: "Battery voltage is low",
      value: reading.battery_voltage
    });
  }

  alerts.forEach((alert) => {
    insertAlertIfNotRecent(alert, 30, (error, savedAlert) => {
      if (error) {
        console.error("Alert insert error:", error.message);
        return;
      }

      if (savedAlert) {
        console.log("Alert created:", savedAlert);
      }
    });
  });

  return alerts;
}

module.exports = {
  checkTelemetryAlerts
};