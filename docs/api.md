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
