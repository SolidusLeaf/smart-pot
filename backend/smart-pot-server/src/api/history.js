const express = require("express");

const router = express.Router();

router.get("/history", (req, res) => {
  res.json({
    deviceId: "plant1",
    records: [],
    message: "History database is not connected yet"
  });
});

module.exports = router;