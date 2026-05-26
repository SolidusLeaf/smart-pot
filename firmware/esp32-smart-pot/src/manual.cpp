#include "manual.h"
#include <ArduinoJson.h>
#include <Arduino.h>
#include <SPIFFS.h>
ManualConfig manualConfig;

// Default configuration values
void manualInit() {
    manualConfig.soilTarget = 40;
    manualConfig.tempMax = 28;
    manualConfig.tempMin = 15;
    manualConfig.humidityMax = 70;
    manualConfig.waterMin = 20;
    manualConfig.tankDistancePercent = 10; // Set default tank distance threshold
    manualConfig.pumpOverride = true; // Set to manual override by default instead of auto
}

void manualHandleMessage(const char* topic, const char* payload) {
    StaticJsonDocument<256> doc;

    DeserializationError error = deserializeJson(doc, payload);

    if (error) {
        Serial.println("JSON parse failed");
        return;
    }

    if (doc.containsKey("soilTarget"))
        manualConfig.soilTarget = doc["soilTarget"];

    if (doc.containsKey("tempMax"))
        manualConfig.tempMax = doc["tempMax"];

    if (doc.containsKey("humidityMax"))
        manualConfig.humidityMax = doc["humidityMax"];

    if (doc.containsKey("waterMin"))
        manualConfig.waterMin = doc["waterMin"];
     if (doc.containsKey("tankDistancePercent"))
        manualConfig.tankDistancePercent = doc["tankDistancePercent"];
    if (doc.containsKey("pump"))
        manualConfig.pumpOverride = doc["pump"];

    Serial.println("Manual config updated:");
    Serial.println(payload);
}
