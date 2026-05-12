# Contributing Guide — Smart Pot IoT Project

This document explains how our team works on the Smart Pot IoT project, who is responsible for each part, and how to contribute safely.

---

## Project Overview

Smart Pot is an autonomous IoT plant pot system that can:

- Read soil moisture, temperature, humidity, and water level
- Control a water pump and fan
- Send sensor data through MQTT
- Store telemetry in the backend
- Show live data on a web dashboard
- Send alerts through Telegram
- Monitor solar and battery power
- Export data as CSV
- Calculate plant health score and recommendations

---

## Team Responsibilities

### Student 1 — ESP32 Firmware + Hardware

Student 1 is responsible for:

- ESP32 firmware
- Sensor connections
- Soil moisture sensor
- BME280 or DHT22 temperature/humidity sensor
- Water level sensor
- Pump control
- Fan control
- MQTT publish/subscribe on ESP32
- Local automation logic
- Hardware safety logic
- Deep sleep / low-power firmware mode
- Sensor calibration
- Hardware wiring documentation

Main folders and files:

```text
firmware/
docs/firmware-setup.md
docs/hardware-wiring.md
docs/sensor-calibration.md
```

---

### Student 2 — Backend Core + Dashboard + Export + Testing

Student 2 is responsible for:

- MQTT subscriber on backend
- REST API
- Alert engine
- SQLite/database logic
- Server setup guide
- Web dashboard
- Dashboard controls
- CSV export
- Testing checklist
- Demo quality
- API documentation

Main folders and files:

```text
backend/smart-pot-server/src/mqtt/
backend/smart-pot-server/src/api/
backend/smart-pot-server/src/alerts/
backend/smart-pot-server/src/database/
frontend/smart-pot-dashboard/
docs/server-setup.md
docs/api.md
docs/testing.md
docs/demo-script.md
```

---

### Student 3 — Power + Telegram + Analytics

Student 3 is responsible for:

- Solar/battery monitoring
- INA219 integration
- Power status logic
- Power mode rules
- Telegram bot
- Telegram commands
- Telegram alerts
- Plant health score
- Analytics modules
- Chart data requirements

Main folders and files:

```text
backend/smart-pot-server/src/telegram/
backend/smart-pot-server/src/power/
backend/smart-pot-server/src/analytics/
docs/power-system.md
docs/telegram-bot.md
docs/plant-health-score.md
```

---

## Project Structure

```text
smart-pot/
├── firmware/
│   └── esp32-smart-pot/
│
├── backend/
│   └── smart-pot-server/
│       ├── src/
│       │   ├── mqtt/
│       │   ├── api/
│       │   ├── alerts/
│       │   ├── database/
│       │   ├── telegram/
│       │   ├── power/
│       │   ├── analytics/
│       │   └── index.js
│       └── README.md
│
├── frontend/
│   └── smart-pot-dashboard/
│
├── docs/
│   ├── server-setup.md
│   ├── api.md
│   ├── testing.md
│   ├── demo-script.md
│   ├── firmware-setup.md
│   ├── hardware-wiring.md
│   ├── sensor-calibration.md
│   ├── power-system.md
│   ├── telegram-bot.md
│   └── plant-health-score.md
│
└── CONTRIBUTING.md
```

---

## Branch Rules

Each student should work in their own branch.

Recommended branch names:

```text
student1-firmware-hardware
student2-backend-dashboard
student3-power-telegram
```

Create a new branch:

```bash
git checkout -b student2-backend-dashboard
```

Switch to an existing branch:

```bash
git checkout student2-backend-dashboard
```

Before starting work, always pull the latest changes:

```bash
git pull origin main
```

If your team uses a `dev` branch instead of `main`, pull from `dev`:

```bash
git pull origin dev
```

---

## Commit Rules

Make small commits with clear messages.

Good commit examples:

```text
Add initial backend API routes
Create dashboard layout
Add MQTT subscriber skeleton
Add Telegram status command
Fix command validation
Update testing checklist
Add power status logic
```

Bad commit examples:

```text
update
fix
stuff
final
changes
```

Recommended commit flow:

```bash
git status
git add .
git commit -m "Add clear description here"
git push
```

---

## Pull Request Rules

Before opening a pull request:

1. Make sure the project runs without errors.
2. Test your own part.
3. Update related documentation.
4. Do not change another student's files without agreement.
5. Write a clear pull request description.

Pull request description format:

```text
What was added:
- ...

What was tested:
- ...

Known issues:
- ...
```

---

## Code Ownership Rules

Do not edit another student's main files without asking first.

Examples:

- Student 1 should not directly change backend API logic unless agreed.
- Student 2 should not directly change firmware pin logic unless agreed.
- Student 3 should not directly change dashboard pages unless agreed.

If a feature requires changes across multiple parts, discuss it first and mention it in the pull request.

---

## Environment Files and Secrets

Never commit real secret values.

Do not commit:

```text
.env
Telegram bot token
Wi-Fi password
MQTT password
API keys
Private certificates
```

Use `.env.example` instead.

Example `.env.example`:

```env
PORT=3000
MQTT_URL=mqtt://localhost:1883
MQTT_TELEMETRY_TOPIC=smartpot/plant1/telemetry
MQTT_COMMAND_TOPIC=smartpot/plant1/command
TELEGRAM_BOT_TOKEN=your_token_here
```

Each developer should create their own local `.env` file.

---

## Testing Requirements

Every student should test their own part before pushing.

### Student 1 should test:

- ESP32 boots correctly
- Sensors return valid values
- MQTT telemetry is published
- Pump command works
- Fan command works
- Water safety logic works
- Deep sleep or low-power mode works if implemented

### Student 2 should test:

- Backend starts correctly
- REST API routes work
- MQTT subscriber receives telemetry
- Database saves data
- Dashboard loads correctly
- Dashboard can call backend API
- CSV export works
- Alert engine works

### Student 3 should test:

- Telegram bot starts correctly
- Telegram commands work
- Power data is processed correctly
- Health score is calculated correctly
- Telegram alerts are sent correctly
- Power mode logic works

---

## Documentation Rules

Documentation should be updated together with code.

Important documentation files:

```text
docs/server-setup.md
docs/api.md
docs/testing.md
docs/demo-script.md
docs/firmware-setup.md
docs/hardware-wiring.md
docs/sensor-calibration.md
docs/power-system.md
docs/telegram-bot.md
docs/plant-health-score.md
```

When adding a feature, document:

- What it does
- How to run it
- How to test it
- Required environment variables
- Known limitations

---

## Backend API Rules

Student 2 owns the backend API structure.

Main API routes should use this pattern:

```text
GET    /api/health
GET    /api/latest
GET    /api/history
POST   /api/command
GET    /api/alerts
GET    /api/history/export.csv
```

API responses should be JSON except CSV export.

Example success response:

```json
{
  "success": true,
  "message": "Command received"
}
```

Example error response:

```json
{
  "success": false,
  "error": "Command is required"
}
```

---

## MQTT Topic Rules

Recommended MQTT topics:

```text
smartpot/plant1/telemetry
smartpot/plant1/command
smartpot/plant1/status
smartpot/plant1/alerts
```

Telemetry should be valid JSON.

Example telemetry format:

```json
{
  "deviceId": "plant1",
  "soilMoisture": 55,
  "temperature": 24.5,
  "humidity": 61,
  "waterLevel": "OK",
  "pumpState": "OFF",
  "fanState": "OFF",
  "batteryVoltage": 3.9,
  "solarVoltage": 5.2,
  "solarCurrent": 0.3,
  "powerMode": "NORMAL",
  "healthScore": 87,
  "timestamp": "2026-05-07T10:00:00.000Z"
}
```

---

## Command Rules

Allowed commands should be limited and validated.

Recommended commands:

```text
WATER
PUMP_OFF
FAN_ON
FAN_OFF
AUTO_ON
AUTO_OFF
```

Do not allow unknown commands to be sent to the ESP32.

---

## Safety Rules

The project must include safety logic.

Important safety requirements:

- Pump must not run if the water tank is empty.
- Pump should have a maximum run duration.
- Pump should have a minimum delay between watering events.
- Invalid sensor readings should not trigger dangerous actions.
- Backend should validate all command requests.
- Telegram and dashboard commands should go through backend validation.

---

## Final Demo Requirements

Before the final demo, the team should verify:

- ESP32 sends sensor data
- Backend receives MQTT telemetry
- Database stores telemetry
- Dashboard shows latest data
- Dashboard shows history/charts
- Commands work from dashboard
- Telegram bot responds to commands
- Alerts work
- CSV export works
- Plant health score is visible
- Power status is visible
- Backup demo video is recorded

---

## Final Rule

Work clearly, test before pushing, and keep responsibilities separated.

If a feature affects another student's part, discuss it before changing the code.
