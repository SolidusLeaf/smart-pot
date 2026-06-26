const { db } = require("./db");

function getSoilStatus(soilHumidity) {
  if (soilHumidity === null || soilHumidity === undefined) return "unknown";
  if (soilHumidity < 20) return "dry";
  if (soilHumidity < 40) return "low";
  if (soilHumidity <= 70) return "optimal";
  return "wet";
}

function getLightStatus(lightIntensity) {
  if (lightIntensity === null || lightIntensity === undefined) return "unknown";
  if (lightIntensity < 500) return "dark";
  if (lightIntensity < 2500) return "low";
  if (lightIntensity < 10000) return "good";
  return "bright";
}

function normalizeTelemetry(data) {
  const soilHumidity = data.soil_humidity ?? data.soilMoisture ?? null;
  const airHumidity = data.air_humidity ?? data.humidity ?? null;
  const lightIntensity = data.light_intensity ?? data.lightIntensity ?? null;

  return {
    device_id: data.device_id ?? data.deviceId ?? "smartpot_01",
    soil_humidity: soilHumidity,
    air_humidity: airHumidity,
    temperature: data.temperature ?? null,
    water_level: data.water_level ?? data.waterLevel ?? null,
    pump_state: data.pump_state ?? data.pumpState ?? null,
    fan_state: data.fan_state ?? data.fanState ?? null,
    battery_voltage: data.battery_voltage ?? data.batteryVoltage ?? null,
    solar_voltage: data.solar_voltage ?? data.solarVoltage ?? null,
    solar_current: data.solar_current ?? data.solarCurrent ?? null,
    power_mode: data.power_mode ?? data.powerMode ?? null,
    light_intensity: lightIntensity,
    sun_exposure_today:
      data.sun_exposure_today ?? data.sunExposureToday ?? 0,
    soil_status: getSoilStatus(soilHumidity),
    light_status: getLightStatus(lightIntensity)
  };
}

function insertReading(rawTelemetry, callback) {
  const data = normalizeTelemetry(rawTelemetry);

  db.run(
    `
    INSERT INTO sensor_readings (
      device_id,
      soil_humidity,
      air_humidity,
      temperature,
      water_level,
      pump_state,
      fan_state,
      battery_voltage,
      solar_voltage,
      solar_current,
      power_mode,
      light_intensity,
      sun_exposure_today,
      soil_status,
      light_status,
      timestamp
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.device_id,
      data.soil_humidity,
      data.air_humidity,
      data.temperature,
      data.water_level,
      data.pump_state,
      data.fan_state,
      data.battery_voltage,
      data.solar_voltage,
      data.solar_current,
      data.power_mode,
      data.light_intensity,
      data.sun_exposure_today,
      data.soil_status,
      data.light_status,
      new Date().toISOString()
    ],
    function (error) {
      if (callback) {
        callback(error, {
          id: this?.lastID,
          ...data
        });
      }
    }
  );
}

function getLatestReading(callback) {
  db.get(
    `
    SELECT *
    FROM sensor_readings
    ORDER BY timestamp DESC
    LIMIT 1
    `,
    callback
  );
}

function getRecentReadings(deviceId = "smartpot_01", limit = 50, callback) {
  db.all(
    `
    SELECT *
    FROM sensor_readings
    WHERE device_id = ?
    ORDER BY timestamp DESC
    LIMIT ?
    `,
    [deviceId, limit],
    callback
  );
}

function upsertDailySummary(deviceId, date, callback) {
  db.get(
    `
    SELECT
      AVG(soil_humidity) AS avg_soil,
      MIN(soil_humidity) AS min_soil,
      MAX(soil_humidity) AS max_soil,
      AVG(air_humidity) AS avg_air,
      AVG(temperature) AS avg_temperature,
      AVG(light_intensity) AS avg_light,
      MAX(light_intensity) AS peak_light,
      MAX(sun_exposure_today) AS total_sun
    FROM sensor_readings
    WHERE device_id = ? AND DATE(timestamp, 'localtime') = ?
    `,
    [deviceId, date],
    (error, row) => {
      if (error) {
        callback(error);
        return;
      }

      if (!row || row.avg_soil === null) {
        callback(null);
        return;
      }

      const wateringNeeded = row.avg_soil < 30 ? 1 : 0;
      const sunSufficient = (row.total_sun ?? 0) >= 120 ? 1 : 0;

      const soilScore = Math.min(100, Math.max(0, (row.avg_soil / 70) * 100));
      const sunScore = Math.min(100, ((row.total_sun ?? 0) / 240) * 100);
      const airScore = Math.min(100, Math.max(0, row.avg_air ?? 0));

      const healthScore = Math.round(
        soilScore * 0.5 + sunScore * 0.35 + airScore * 0.15
      );

      const notes = [
        wateringNeeded ? "Plant was thirsty today." : "Soil moisture was good.",
        sunSufficient ? "Enough sunlight today." : "Could use more sunlight.",
        `Health score: ${healthScore}/100.`
      ].join(" ");

      db.run(
        `
        INSERT INTO daily_summary (
          device_id,
          date,
          avg_soil_humidity,
          min_soil_humidity,
          max_soil_humidity,
          avg_air_humidity,
          avg_temperature,
          avg_light_intensity,
          peak_light_intensity,
          total_sun_exposure,
          watering_needed,
          sun_sufficient,
          health_score,
          notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(date) DO UPDATE SET
          avg_soil_humidity = excluded.avg_soil_humidity,
          min_soil_humidity = excluded.min_soil_humidity,
          max_soil_humidity = excluded.max_soil_humidity,
          avg_air_humidity = excluded.avg_air_humidity,
          avg_temperature = excluded.avg_temperature,
          avg_light_intensity = excluded.avg_light_intensity,
          peak_light_intensity = excluded.peak_light_intensity,
          total_sun_exposure = excluded.total_sun_exposure,
          watering_needed = excluded.watering_needed,
          sun_sufficient = excluded.sun_sufficient,
          health_score = excluded.health_score,
          notes = excluded.notes
        `,
        [
          deviceId,
          date,
          row.avg_soil,
          row.min_soil,
          row.max_soil,
          row.avg_air,
          row.avg_temperature,
          row.avg_light,
          row.peak_light,
          row.total_sun,
          wateringNeeded,
          sunSufficient,
          healthScore,
          notes
        ],
        callback
      );
    }
  );
}

function getSummaries(deviceId = "smartpot_01", callback) {
  db.all(
    `
    SELECT *
    FROM daily_summary
    WHERE device_id = ?
    ORDER BY date DESC
    LIMIT 30
    `,
    [deviceId],
    callback
  );
}

function getTodaySummary(deviceId = "smartpot_01", callback) {
  const today = new Date().toISOString().split("T")[0];

  db.get(
    `
    SELECT *
    FROM daily_summary
    WHERE device_id = ? AND date = ?
    `,
    [deviceId, today],
    callback
  );
}

module.exports = {
  normalizeTelemetry,
  insertReading,
  getLatestReading,
  getRecentReadings,
  upsertDailySummary,
  getSummaries,
  getTodaySummary,
  getSoilStatus,
  getLightStatus
};