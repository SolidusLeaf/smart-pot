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

function getRecentAlertByType(deviceId, type, minutes, callback) {
  db.get(
    `
    SELECT *
    FROM alerts
    WHERE device_id = ?
      AND type = ?
      AND created_at >= datetime('now', ?)
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [deviceId, type, `-${minutes} minutes`],
    callback
  );
}

function insertAlertIfNotRecent(alert, cooldownMinutes = 30, callback) {
  getRecentAlertByType(
    alert.device_id,
    alert.type,
    cooldownMinutes,
    (error, existingAlert) => {
      if (error) {
        if (callback) callback(error);
        return;
      }

      if (existingAlert) {
        console.log(`Skipped duplicate alert: ${alert.type}`);
        if (callback) callback(null, null);
        return;
      }

      insertAlert(alert, callback);
    }
  );
}

module.exports = {
  insertAlert,
  getRecentAlerts,
  getRecentAlertByType,
  insertAlertIfNotRecent
};