# Testing Checklist

## Day 1 Tests

| Test | Expected Result | Status |
|---|---|---|
| Backend starts with npm run dev | Server runs on port 3000 | Passed |
| GET / works | Returns backend running message | Passed |
| GET /api/health works | Returns backend status JSON | Passed |
| GET /api/latest works | Returns placeholder latest telemetry | Passed |
| GET /api/history works | Returns empty history array | Passed |
| POST /api/command accepts WATER | Returns success true | Passed |
| POST /api/command rejects empty command | Returns error message | Passed |
| Dashboard starts with npm run dev | Vite opens dashboard | Passed |
| Dashboard cards visible | Four cards are shown | Passed |

## Notes

Day 1 backend and dashboard skeleton tested successfully.

## Day 2 Tests

| Test | Expected Result | Status |
|---|---|---|
| Mosquitto installed | Mosquitto command works from install folder | Passed |
| Mosquitto broker running | Port 1883 is LISTENING | Passed |
| MQTT subscriber connects | Subscriber waits on `smartpot/plant1/telemetry` | Passed |
| MQTT publisher sends message | Test JSON message is published | Passed |
| MQTT subscriber receives message | Telemetry JSON appears in subscriber terminal | Passed |
| Backend connects to MQTT | Backend logs MQTT connection | Passed |
| Backend subscribes to telemetry topic | Backend logs subscribed topic | Passed |
| Backend receives telemetry | Backend logs parsed JSON | Passed |
| Backend handles bad JSON | Backend logs error and does not crash | Passed |
| Dashboard static layout opens | Dashboard loads in browser | Passed |

## Day 2 Notes

Mosquitto was tested locally on Windows.

Broker was already running as a Windows background service, so running `mosquitto -v` manually showed a port conflict on port 1883. This is expected because the service was already listening on port 1883.

Verified with:

```bash
netstat -ano | findstr :1883
```

Test topic:

```bash
smartpot/plant1/telemetry
```

Test message:

```bash
{"deviceId":"plant1","soilMoisture":55,"temperature":24.5,"humidity":60}
```

## Day 5 Tests

| Test | Expected Result | Status |
|---|---|---|
| MQTT publisher connects | Backend logs publisher connection | Passed |
| POST /api/command accepts WATER | Command is published to MQTT | Passed |
| POST /api/command rejects invalid command | API returns 400 error | Passed |
| Dashboard Water button works | WATER command appears in MQTT subscriber | Passed |
| Dashboard Fan On button works | FAN_ON command appears in MQTT subscriber | Passed |
| Dashboard Fan Off button works | FAN_OFF command appears in MQTT subscriber | Passed |

## Day 7 Week 1 Integration Tests

| Test | Expected Result | Status |
|---|---|---|
| Backend starts | Server runs on port 3000 | Passed |
| MQTT subscriber connects | Backend subscribes to telemetry topics | Passed |
| MQTT publisher connects | Backend can publish command messages | Passed |
| SQLite database works | Readings are saved into `plant_data.db` | Passed |
| GET /api/latest works | Latest telemetry is returned | Passed |
| GET /api/history works | Recent readings are returned | Passed |
| GET /api/summary/today works | Daily summary is returned | Passed |
| GET /api/alerts works | Alert records are returned | Passed |
| Dashboard shows latest data | Cards update from backend API | Passed |
| Dashboard command buttons work | MQTT command messages are published | Passed |
| Dangerous telemetry creates alerts | Alert engine saves warnings/critical alerts | Passed |

## Day 7 Notes

Week 1 backend, MQTT, database, alerts, API, and dashboard integration test completed successfully.

## Day 8 Tests

| Test | Expected Result | Status |
|---|---|---|
| Dashboard fetches `/api/latest` | Sensor cards update with latest reading | Passed |
| Dashboard fetches `/api/history` | Recent readings table is shown | Passed |
| Data refresh works | Dashboard updates every 3 seconds | Passed |
| Multiple MQTT messages appear | Recent readings list updates correctly | Passed |

## Day 9 Tests

| Test | Expected Result | Status |
|---|---|---|
| Backend accepts power telemetry | Power fields are saved to SQLite | Passed |
| GET /api/latest returns power fields | Battery, solar, current, and mode are visible | Passed |
| Dashboard shows battery voltage | Power panel displays battery value | Passed |
| Dashboard shows solar voltage | Power panel displays solar value | Passed |
| Dashboard shows solar current | Power panel displays current value | Passed |
| Dashboard handles missing power fields | Missing values show as `--` | Passed |
| Old telemetry format still works | Backend does not crash | Passed |