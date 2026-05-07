#ifndef CONFIG_H
#define CONFIG_H

// =============================
// SENSOR SELECTION
// =============================
// Set to 1 for BME280, 0 for DHT22.
#define USE_BME280 1

// =============================
// WI-FI CONFIG
// =============================
#define WIFI_SSID "YOUR_WIFI_NAME"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

// =============================
// MQTT CONFIG
// =============================
#define MQTT_SERVER "broker.hivemq.com"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "smart-pot-student-1"

#define MQTT_TOPIC_TELEMETRY "smartpot/student1/telemetry"
#define MQTT_TOPIC_COMMAND   "smartpot/student1/command"
#define MQTT_TOPIC_STATUS    "smartpot/student1/status"

// =============================
// SENSOR CALIBRATION
// =============================
// Adjust these after testing your actual soil sensor.
// Usually: wet gives lower value, dry gives higher value.
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

#endif
