#include "manual.h"
#include <ArduinoJson.h>
#include <Arduino.h>
#include <SPIFFS.h>
ManualConfig manualConfig;
static bool manualFlag = false;

void setManualFlag(bool isInitialized) {
    manualFlag = isInitialized;
}

bool getManualFlag() {
    return manualFlag;
}
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

bool loadConfig(const char* path) {
    File file = SPIFFS.open(path, "r");
    if (!file) {
        Serial.printf("Failed to open %s\n", path);
        return false;
    }

    StaticJsonDocument<256> doc;
    DeserializationError error = deserializeJson(doc, file);

    if (error) {
        Serial.printf("Failed to parse %s\n", path);
        file.close();
        return false;
    }

    manualConfig.soilTarget = doc["soilTarget"];
    manualConfig.tempMax = doc["tempMax"];
    manualConfig.humidityMax = doc["humidityMax"];
    manualConfig.waterMin = doc["waterMin"];
    manualConfig.tankDistancePercent = doc["tankDistancePercent"];
    manualConfig.pumpOverride = doc["pumpOverride"];

    file.close();
    return true;
}
void changeConfig(const ManualConfig& newConfig) {
    manualConfig = newConfig;

    StaticJsonDocument<256> doc;
    doc["soilTarget"] = manualConfig.soilTarget;
    doc["tempMax"] = manualConfig.tempMax;
    doc["humidityMax"] = manualConfig.humidityMax;
    doc["waterMin"] = manualConfig.waterMin;
    doc["tankDistancePercent"] = manualConfig.tankDistancePercent;
    doc["pumpOverride"] = manualConfig.pumpOverride;

    File file = SPIFFS.open("/config.json", "w");
    if (!file) {
        Serial.println("Failed to open config file for writing");
        return;
    }

    if (serializeJson(doc, file) == 0) {
        Serial.println("Failed to write config to file");
    } else {
        Serial.println("Config saved to file");
    }

    file.close();