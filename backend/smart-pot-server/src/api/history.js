const express = require("express");
const { getTelemetryHistory } = require("../store/telemetryStore");

const router = express.Router();

router.get("/history", (req, res) => {
  const history = getTelemetryHistory();

  res.json({
    success: true,
    count: history.length,
    records: history
  });
});

module.exports = router;