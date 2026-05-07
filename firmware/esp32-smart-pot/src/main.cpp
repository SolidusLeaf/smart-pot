#include <Arduino.h>

#include "pins.h"
#include "config.h"
#include "sensors.h"
#include "actuators.h"
#include "mqtt_client.h"

unsigned long lastTelemetryTime = 0;

void setup() {
    Serial.begin(115200);
    delay(1000);

    pinMode(PIN_STATUS_LED, OUTPUT);
    digitalWrite(PIN_STATUS_LED, LOW);

    Serial.println("Smart Pot IoT — Student 1 Firmware Starting...");

    sensorsBegin();
    actuatorsBegin();
    mqttBegin();

    Serial.println("System ready.");
}

void loop() {
    mqttLoop();

    unsigned long now = millis();
    if (now - lastTelemetryTime >= TELEMETRY_INTERVAL_MS) {
        lastTelemetryTime = now;

        SensorData data = readSensors();
        publishTelemetry(data);

        digitalWrite(PIN_STATUS_LED, !digitalRead(PIN_STATUS_LED));
    }
}
