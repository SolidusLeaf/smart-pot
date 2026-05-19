const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../../data/plant_data.db");

const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error("Database opening error:", error.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

function initDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS sensor_readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id TEXT NOT NULL,
        soil_humidity REAL,
        air_humidity REAL,
        temperature REAL,
        water_level TEXT,
        pump_state TEXT,
        fan_state TEXT,
        battery_voltage REAL,
        solar_voltage REAL,
        solar_current REAL,
        power_mode TEXT,
        light_intensity REAL,
        sun_exposure_today REAL,
        soil_status TEXT,
        light_status TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS daily_summary (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id TEXT NOT NULL,
        date TEXT UNIQUE NOT NULL,

        avg_soil_humidity REAL,
        min_soil_humidity REAL,
        max_soil_humidity REAL,

        avg_air_humidity REAL,
        avg_temperature REAL,

        avg_light_intensity REAL,
        peak_light_intensity REAL,
        total_sun_exposure REAL,

        watering_needed INTEGER DEFAULT 0,
        sun_sufficient INTEGER DEFAULT 0,
        health_score REAL,

        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Database tables ready");
  });
}

module.exports = {
  db,
  initDatabase
};