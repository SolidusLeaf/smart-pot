# Demo Script — Smart Pot IoT Project

## Day 2 Demo Checklist

### Backend and MQTT

- Start Mosquitto or confirm it is running on port 1883.
- Start backend with `npm run dev`.
- Open `http://localhost:3000/api/health`.
- Confirm backend status is `online`.
- Confirm MQTT status is `connected`.
- Publish test telemetry to `smartpot/plant1/telemetry`.
- Confirm backend logs the received telemetry.
- Publish invalid JSON.
- Confirm backend logs an error but does not crash.

### Dashboard

- Start dashboard with `npm run dev`.
- Open `http://localhost:5173`.
- Show the Smart Pot dashboard layout.
- Show 4 metric cards:
  - Soil Moisture
  - Temperature
  - Humidity
  - Water Level
- Show Device Status panel.
- Show Controls panel.
- Show Alerts panel.
- Show Power panel.

## Current Limitations

- Dashboard is static.
- Dashboard does not fetch backend data yet.
- Buttons do not send commands yet.
- Database is not connected yet.