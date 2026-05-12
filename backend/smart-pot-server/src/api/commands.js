const express = require("express");

const router = express.Router();

router.post("/command", (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({
      error: "Command is required"
    });
  }

  res.json({
    success: true,
    command,
    message: "Command received, MQTT publishing will be added later"
  });
});

module.exports = router;