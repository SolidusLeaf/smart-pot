const { db } = require("./db");

function insertAlert(alert, callback) {
  db.run(
    `
    INSERT INTO alerts (
      device_id,
      type,
      severity,
      message,
      value
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      alert.device_id,
      alert.type,
      alert.severity,
      alert.message,
      alert.value ?? null
    ],
    function (error) {
      if (callback) {
        callback(error, {
          id: this?.lastID,
          ...alert
        });
      }
    }
  );
}

function getRecentAlerts(limit = 50, callback) {
  db.all(
    `
    SELECT *
    FROM alerts
    ORDER BY created_at DESC
    LIMIT ?
    `,
    [limit],
    callback
  );
}

module.exports = {
  insertAlert,
  getRecentAlerts
};