const express = require("express");
const { getLatestReading } = require("../database/readingRepository");

const router = express.Router();

router.get("/latest", (req, res) => {
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
        hasData: false,
        message: "No telemetry received yet",
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