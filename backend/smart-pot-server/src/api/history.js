const express = require("express");
const { getRecentReadings } = require("../database/readingRepository");

const router = express.Router();

router.get("/history", (req, res) => {
  const deviceId = req.query.device || "smartpot_01";
  const limit = Math.min(Number(req.query.limit) || 50, 200);

  getRecentReadings(deviceId, limit, (error, rows) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      count: rows.length,
      records: rows
    });
  });
});

module.exports = router;