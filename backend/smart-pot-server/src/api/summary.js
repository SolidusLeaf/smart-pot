const express = require("express");
const {
  getSummaries,
  getTodaySummary
} = require("../database/readingRepository");

const router = express.Router();

router.get("/summary", (req, res) => {
  const deviceId = req.query.device || "smartpot_01";

  getSummaries(deviceId, (error, rows) => {
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

router.get("/summary/today", (req, res) => {
  const deviceId = req.query.device || "smartpot_01";

  getTodaySummary(deviceId, (error, row) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    if (!row) {
      return res.json({
        success: true,
        hasData: false,
        message: "No summary yet for today",
        data: null
      });
    }

    res.json({
      success: true,
      hasData: true,
      data: row
    });
  });
});

module.exports = router;