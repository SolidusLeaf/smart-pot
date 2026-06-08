#ifndef CONFIG_H
#define CONFIG_H

// =============================
// SENSOR SELECTION
// =============================
#define DHTTYPE DHT22 

// =============================
// WI-FI CONFIG
// =============================
#define WIFI_SSID "Checking" // Replace with your Wi-Fi SSID
#define WIFI_PASSWORD "mjik4591" // Replace with your Wi-Fi password

// =============================
// MQTT CONFIG
// =============================
#define MQTT_SERVER "your-mqtt-broker-address"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "smart-pot-student1"
#define MQTT_USERNAME ""
#define MQTT_PASSWORD ""


#define MQTT_TOPIC_TELEMETRY "smartpot/data"
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

#define TELEMETRY_INTERVAL_MS 10000

// =============================
// BATTERY CONFIG
// =============================
#define ADC_MAX 4095.0
#define ADC_REF 3.3

#define BAT_R1 100000.0
#define BAT_R2 100000.0

#endif
