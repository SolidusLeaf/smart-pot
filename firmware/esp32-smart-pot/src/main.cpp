#include <Arduino.h>

#include "pins.h"
#include "config.h"
#include "sensors.h"
#include "actuators.h"
#include "mqtt_client.h"
#include "manual.h"

unsigned long lastTelemetryTime = 0;
unsigned long lastPumpStatusTime = 0;

void setup() {
    delay(5000); // Allow time for serial monitor to connect
    Serial.begin(115200);
    Serial.println("Initializing Smart Pot IoT firmware...");
    delay(1000);

    pinMode(PIN_STATUS_LED, OUTPUT);
    digitalWrite(PIN_STATUS_LED, LOW);

    Serial.println("Smart Pot IoT — Student 1 Firmware Starting...");

    sensorsBegin();
    actuatorsBegin();
    manualInit();
    mqttBegin();

    
    Serial.println("System ready.");
    sensorsFlagSetup(true);
}

void loop() {
    mqttLoop();  // keep MQTT connection alive

    unsigned long now = millis();

    if (now - lastTelemetryTime >= TELEMETRY_INTERVAL_MS) {
        lastTelemetryTime = now;

        SensorData data = readSensors();

        // Serial.println(
        //     "Soil: " + String(data.soilPercent) +
        //     "%, Temp: " + String(data.temperature) +
        //     "C, Humidity: " + String(data.humidity) +
        //     "%, Tank Distance: " + String(data.currentTankDistanceCm) +
        //     "cm, Tank Percent: " + String(data.tankPercent) + "%"
        // );

        Serial.println("Soil Raw: " + String(data.soilRaw));

        // Serial.println(
        //     "Battery Voltage: " + String(data.batteryVoltage, 2) +
        //     "V, Battery Percent: " + String(data.batteryPercent) + "%"
        // );

        publishTelemetry(data);      // publish sensor data to MQTT
        if (getPumpOverrideState())
        {
            AlertFlags flags = checkAlerts(data);
            publishAlerts(flags);
        }

        digitalWrite(PIN_STATUS_LED, !digitalRead(PIN_STATUS_LED));
        // Serial.println(getPumpOverrideState() ? "Auto pump is OFF" : "Auto pump is ON");
        // Serial.println("Tank percent: " + String(data.tankPercent) + "%");
        // Serial.println("Soil percent: " + String(data.soilPercent) + "%");
         
    }
    if (now - lastPumpStatusTime >= PUMP_STATUS_INTERVAL_MS) {
        lastPumpStatusTime = now;
        checkPump();
    }

    if (!getPumpOverrideState()) {
        SensorData data = readSensors();
        automaticPump(data.soilPercent, data.tankPercent);
    }
}