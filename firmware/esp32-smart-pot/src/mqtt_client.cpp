#include "mqtt_client.h"
#include "config.h"
#include "actuators.h"
#include "manual.h"
#include "sensors.h"

#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

WiFiClient espClient;
PubSubClient mqtt(espClient);
static void connectWiFi() {
    Serial.print("Connecting to Wi-Fi: ");
    Serial.println(WIFI_SSID);

    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println();
    Serial.print("Wi-Fi connected. IP: ");
    Serial.println(WiFi.localIP());
}

static void mqttCallback(char *topic, byte *payload, unsigned int length) {
    String message;
    for (unsigned int i = 0; i < length; i++) {
        message += (char)payload[i];
    }

    Serial.print("MQTT command received: ");
    Serial.println(message);

    if (message == "pump_on") {
        setPump(true);
    } else if (message == "pump_off") {
        setPump(false);
    }
    if (getSensorFlag()) {
        checkAlerts(readSensors());
    }
}

static void reconnectMQTT() {
    while (!mqtt.connected()) {
        Serial.print("Connecting to MQTT...");

        if (mqtt.connect(MQTT_CLIENT_ID)) {
            Serial.println("connected.");
            mqtt.subscribe(MQTT_TOPIC_COMMAND);
            mqtt.publish(MQTT_TOPIC_STATUS, "student1_online");
        } else {
            Serial.print("failed, rc=");
            Serial.print(mqtt.state());
            Serial.println(" retrying in 3 seconds...");
            delay(3000);
        }
    }
}

void mqttBegin() {
    connectWiFi();
    mqtt.setServer(MQTT_SERVER, MQTT_PORT);
    mqtt.setCallback(mqttCallback);
}

void mqttLoop() {
    if (!mqtt.connected()) {
        reconnectMQTT();
    }
    mqtt.loop();
}

void publishTelemetry(const SensorData &data) {
    char payload[256];

    snprintf(
        payload,
        sizeof(payload),
        "{\"soilRaw\":%d,\"soilPercent\":%d,\"waterRaw\":%d,\"waterPercent\":%d,\"temperature\":%.2f,\"humidity\":%.2f,\"pressure\":%.2f,\"pump\":%s,\"fan\":%d}",
        data.soilRaw,
        data.soilPercent,
        data.waterRaw,
        data.waterPercent,
        data.temperature,
        data.humidity,
        data.pressure,
        getPumpState() ? "true" : "false"
    );

    mqtt.publish(MQTT_TOPIC_TELEMETRY, payload);
    Serial.println(payload);
}
void publishAlert(const char* alertMessage) {
    mqtt.publish(MQTT_TOPIC_STATUS, alertMessage);
    Serial.println(alertMessage);
}

void checkAlerts(const SensorData &data) {

    AlertFlags alert;
    if (data.soilPercent < manualConfig.soilTarget && data.waterPercent > manualConfig.waterMin) {
        alert.soilAlert = true;
    }
    else {
        alert.soilAlert = false;
    }
    if(data.temperature > manualConfig.tempMax) {
        alert.tempAlert = true;
    } else if (data.temperature < manualConfig.tempMin) {
        alert.tempAlert = true;
    }
    else {
        alert.tempAlert = false;
    }
    if (data.humidity > manualConfig.humidityMax) {
        alert.humidityAlert = true;
    }
    else {
        alert.humidityAlert = false;
    }
    if (data.tankPercent < manualConfig.tankDistancePercent) {
        alert.tankAlert = true;
    }
    else {
        alert.tankAlert = false;
    }
    
    
    if (alert.soilAlert) {
        publishAlert("Soil moisture is below target!");
    }else {
        publishAlert("Soil moisture is comfortable.");
    } if (alert.tempAlert) {
        publishAlert("Temperature is out of range!");
    } else{
        publishAlert("Temperature is comfortable.");
    }if (alert.humidityAlert) {
        publishAlert("Humidity is too high!");
    
    } else {
        publishAlert("Environment conditions are good.");
    }
    if (alert.tankAlert) {
        publishAlert("Tank level is low!");
    } else {
        publishAlert("Tank level is sufficient.");
    }

    {
        String status = "Automatic watering is set to ";
        status += manualConfig.pumpOverride ? "OFF (manual override)" : "ON (automatic control)";
        publishAlert(status.c_str());
    }
}
