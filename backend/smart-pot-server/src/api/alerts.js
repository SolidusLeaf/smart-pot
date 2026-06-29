const express = require("express");
const { getRecentAlerts } = require("../database/alertRepository");

const router = express.Router();

router.get("/alerts", (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);

  getRecentAlerts(limit, (error, rows) => {
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