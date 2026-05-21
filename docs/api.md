# API Documentation

## GET /api/latest

Returns the latest sensor reading stored in SQLite.

Example response:

```json
{
  "success": true,
  "hasData": true,
  "data": {
    "id": 1,
    "device_id": "plant1",
    "soil_humidity": 60,
    "air_humidity": 59,
    "temperature": 24.6,
    "water_level": "OK",
    "pump_state": "OFF",
    "fan_state": "OFF",
    "battery_voltage": 3.85,
    "solar_voltage": 5.12,
    "solar_current": 0.28,
    "power_mode": "NORMAL",
    "timestamp": "2026-05-07 10:30:00"
  }
}
```

## Supported power fields

### The backend supports power telemetry from Student 3:

| Field                                | Type   | Description                          |
| ------------------------------------ | ------ | ------------------------------------ |
| `batteryVoltage` / `battery_voltage` | number | Battery voltage                      |
| `solarVoltage` / `solar_voltage`     | number | Solar panel voltage                  |
| `solarCurrent` / `solar_current`     | number | Solar charging current               |
| `powerMode` / `power_mode`           | string | `NORMAL`, `LOW_POWER`, or `CRITICAL` |

## GET /api/history/export.csv

Exports recent telemetry history as a CSV file.

### Query parameters

| Parameter | Description | Default |
|---|---|---|
| `device` | Device ID to export | `smartpot_01` |
| `limit` | Maximum number of rows | `500` |

### Example

```text
GET /api/history/export.csv?device=smartpot_01&limit=500
```

### CSV columns
```
id,
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
```

## GET /api/device/status

Returns whether the device is online or offline based on the latest telemetry timestamp.

The device is considered online if the latest telemetry was received in the last 60 seconds.

Example response:

```json
{
  "success": true,
  "deviceId": "plant1",
  "online": true,
  "status": "online",
  "reason": "Recent telemetry received",
  "lastSeen": "2026-05-21T11:05:30.000Z",
  "ageSeconds": 3
}
```

## GET /api/settings

Returns automation settings.

```json
{
  "success": true,
  "data": {
    "autoMode": true,
    "soilThreshold": 30,
    "updatedAt": "2026-05-21 12:00:00"
  }
}