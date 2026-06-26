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
    Serial.println();
    Serial.println("===== MQTT MESSAGE RECEIVED =====");

    Serial.print("Topic: ");
    Serial.println(topic);

    Serial.print("Payload: ");
    for (unsigned int i = 0; i < length; i++) {
        Serial.print((char)payload[i]);
    }

    Serial.println();
    Serial.println("=================================");
    if (!strcmp(topic,MQTT_TOPIC_MANUAL)) {
        manualHandleMessage(topic, (char*)payload);
    }
}

static void reconnectMQTT() {
    while (!mqtt.connected()) {
        Serial.print("Connecting to MQTT...");

        String clientId = "smartpot-student1-" + String((uint32_t)ESP.getEfuseMac(), HEX);

        Serial.print(" Client ID: ");
        Serial.println(clientId);

        if (mqtt.connect(clientId.c_str(), MQTT_USERNAME, MQTT_PASSWORD)) {
            Serial.println("MQTT connected.");

            Serial.print("MQTT server: ");
            Serial.println(MQTT_SERVER);

            Serial.print("MQTT port: ");
            Serial.println(MQTT_PORT);

            Serial.print("Telemetry topic: ");
            Serial.println(MQTT_TOPIC_TELEMETRY);

            Serial.print("Manual topic: ");
            Serial.println(MQTT_TOPIC_MANUAL);

            bool subCommand = mqtt.subscribe(MQTT_TOPIC_COMMAND);
            bool subManual  = mqtt.subscribe(MQTT_TOPIC_MANUAL);
            bool subTest    = mqtt.subscribe("smartpot/student1/test");
            bool subAll     = mqtt.subscribe("smartpot/student1/#");

            Serial.print("Subscribe command: ");
            Serial.println(subCommand ? "OK" : "FAILED");

            Serial.print("Subscribe manual: ");
            Serial.println(subManual ? "OK" : "FAILED");

            Serial.print("Subscribe test: ");
            Serial.println(subTest ? "OK" : "FAILED");

            Serial.print("Subscribe wildcard: ");
            Serial.println(subAll ? "OK" : "FAILED");

            bool statusOk = mqtt.publish(MQTT_TOPIC_STATUS, "student1_online", true);
            Serial.print("Status publish: ");
            Serial.println(statusOk ? "OK" : "FAILED");

            bool testOk = mqtt.publish("test", "esp32_self_test", true);
            Serial.print("Self-test publish: ");
            Serial.println(testOk ? "OK" : "FAILED");

            unsigned long start = millis();
            while (millis() - start < 2000) {
                mqtt.loop();
                delay(10);
            }

        } else {
            Serial.print("MQTT failed, rc=");
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
    reconnectMQTT();
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
        "{\"soilRaw\":%d,\"soilPercent\":%d,\"temperature\":%.2f,\"humidity\":%.2f,\"batteryVoltage\":%.2f,\"batteryPercent\":%d,\"pump\":%s}",
        data.soilRaw,
        data.soilPercent,
        data.temperature,
        data.humidity,
        data.batteryVoltage,
        data.batteryPercent,
        getPumpState() ? "true" : "false"
    );

    Serial.print("MQTT connected: ");
    Serial.println(mqtt.connected() ? "YES" : "NO");

    Serial.print("Publishing to topic: ");
    Serial.println(MQTT_TOPIC_TELEMETRY);

    Serial.print("Payload: ");
    Serial.println(payload);

    bool ok = mqtt.publish(MQTT_TOPIC_TELEMETRY, payload);

    Serial.print("Publish result: ");
    Serial.println(ok ? "OK" : "FAILED");
}

void publishAlert(const char* alertMessage) {
    mqtt.publish(MQTT_TOPIC_STATUS, alertMessage);
    Serial.println(alertMessage);
}

AlertFlags checkAlerts(const SensorData &data) {

    AlertFlags alert;
    if (data.soilPercent < manualConfig.soilTarget) {
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
    return alert;
}

void publishAlerts(const AlertFlags &alert) { 
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
    

}

void subscribeTopics() {
    bool subCommand = mqtt.subscribe(MQTT_TOPIC_COMMAND);
    bool subManual  = mqtt.subscribe(MQTT_TOPIC_MANUAL);
    bool subTest    = mqtt.subscribe("smartpot/student1/test");

    Serial.print("Subscribe command: ");
    Serial.println(subCommand ? "OK" : "FAILED");

    Serial.print("Subscribe manual: ");
    Serial.println(subManual ? "OK" : "FAILED");

    Serial.print("Subscribe test: ");
    Serial.println(subTest ? "OK" : "FAILED");

    mqtt.subscribe("smartpot/student1/test");

    bool ok = mqtt.publish("smartpot/student1/test", "esp32_self_test", true);

    Serial.print("Self-test publish: ");
    Serial.println(ok ? "OK" : "FAILED");
}

void publishCheck(){
    mqtt.publish("test", "hello", true);
    mqtt.subscribe("test");
}