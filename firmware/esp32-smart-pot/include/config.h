#ifndef CONFIG_H
#define CONFIG_H

// =============================
// SENSOR SELECTION
// =============================
#define DHTTYPE DHT22 

// =============================
// WI-FI CONFIG
// =============================
#define WIFI_SSID "Checking"
#define WIFI_PASSWORD "ftqz3398"

// =============================
// MQTT CONFIG
// =============================
#define MQTT_SERVER "broker.hivemq.com"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "smart-pot-student-1"

#define MQTT_TOPIC_TELEMETRY "smartpot/student1/telemetry"
#define MQTT_TOPIC_COMMAND   "smartpot/student1/command"
#define MQTT_TOPIC_STATUS    "smartpot/student1/status"
#define MQTT_TOPIC_MANUAL    "smartpot/student1/manual"

// =============================
// SENSOR CALIBRATION
// =============================
// Adjust these after testing your actual soil sensor.
// Usually: wet gives lower value, dry gives higher value.
#define TANK_EMPTY_DISTANCE_CM 20
#define TANK_FULL_DISTANCE_CM 4

#define SOIL_WET_VALUE 1200
#define SOIL_DRY_VALUE 3200

#define WATER_EMPTY_VALUE 500
#define WATER_FULL_VALUE 2500

// =============================
// CONTROL SETTINGS
// =============================

#define TELEMETRY_INTERVAL_MS 5000

#define FAN_PWM_CHANNEL 0
#define FAN_PWM_FREQ 5000
#define FAN_PWM_RESOLUTION 8
// =============================
// FILE PATHS
// =============================
#define MANUAL_CONFIG_PATH "/data config.json"

#endif
