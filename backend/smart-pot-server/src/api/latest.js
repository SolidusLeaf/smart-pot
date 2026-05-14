const express = require("express");
const { getLatestTelemetry } = require("../store/telemetryStore");

const router = express.Router();

router.get("/latest", (req, res) => {
  const latestTelemetry = getLatestTelemetry();

  if (!latestTelemetry) {
    return res.json({
      success: true,
      hasData: false,
      message: "No telemetry received yet",
      data: null
    });
  }

  res.json({
    success: true,
    hasData: true,
    data: latestTelemetry
  });
});

module.exports = router;