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
    manualConfig.humidityMax = 70;
    manualConfig.waterMin = 20;
    manualConfig.pumpOverride = false;
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

    manualConfig.soilTarget = doc["soilTarget"] | 40;
    manualConfig.tempMax = doc["tempMax"] | 28;
    manualConfig.humidityMax = doc["humidityMax"] | 70;
    manualConfig.waterMin = doc["waterMin"] | 20;
    manualConfig.pumpOverride = doc["pumpOverride"] | false;

    file.close();
    return true;
}