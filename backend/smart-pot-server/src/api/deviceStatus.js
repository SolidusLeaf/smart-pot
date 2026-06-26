const express = require("express");
const { getLatestReading } = require("../database/readingRepository");

const router = express.Router();

function parseTimestamp(timestamp) {
  return new Date(timestamp).getTime();
}

function getDeviceStatusFromTimestamp(timestamp) {
  if (!timestamp) {
    return {
      online: false,
      status: "offline",
      reason: "No telemetry received yet",
      lastSeen: null,
      ageSeconds: null
    };
  }

  const lastSeenTime = parseTimestamp(timestamp);
  const now = Date.now();
  const ageSeconds = Math.round((now - lastSeenTime) / 1000);

  const isOnline = ageSeconds <= 60;

  return {
    online: isOnline,
    status: isOnline ? "online" : "offline",
    reason: isOnline
      ? "Recent telemetry received"
      : "No telemetry received in the last 60 seconds",
    lastSeen: timestamp,
    ageSeconds
  };
}

router.get("/device/status", (req, res) => {
  getLatestReading((error, row) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    if (!row) {
      return res.json({
        success: true,
        deviceId: "smartpot_01",
        ...getDeviceStatusFromTimestamp(null)
      });
    }

    res.json({
      success: true,
      deviceId: row.device_id,
      ...getDeviceStatusFromTimestamp(row.timestamp)
    });
  });
});

module.exports = router;