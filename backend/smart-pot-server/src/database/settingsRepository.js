const { db } = require("./db");

function getSettings(callback) {
  db.get(
    `
    SELECT *
    FROM settings
    WHERE id = 1
    `,
    callback
  );
}

function updateSettings(settings, callback) {
  db.run(
    `
    UPDATE settings
    SET
      auto_mode = ?,
      soil_threshold = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
    `,
    [
      settings.auto_mode,
      settings.soil_threshold
    ],
    function (error) {
      if (callback) {
        callback(error, {
          id: 1,
          auto_mode: settings.auto_mode,
          soil_threshold: settings.soil_threshold
        });
      }
    }
  );
}

module.exports = {
  getSettings,
  updateSettings
};