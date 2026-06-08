#include "manual.h"
#include "actuators.h"
#include "sensors.h"
#include <ArduinoJson.h>
#include <Arduino.h>
ManualConfig manualConfig;

// Default configuration values
void manualInit() {
    manualConfig.soilTarget = 10; // Originally 40
    manualConfig.tempMax = 28;
    manualConfig.tempMin = 15;
    manualConfig.humidityMax = 70;
    manualConfig.waterMin = 20;
    manualConfig.tankDistancePercent = 10; // Set default tank distance threshold
    manualConfig.pumpManualOverride = true; // Set to manual override by default instead of auto
    setPump(false); // Ensure pump is off at startup

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
    if (doc.containsKey("pumpState"))
        if (doc["pumpManualOverride"] == true || manualConfig.pumpManualOverride == true) {
            bool state = getPumpState();
             if (doc["pumpState"] == true){
                setPump(true);
            } else if (doc["pumpState"] == false){
                setPump(false);
            }
        }
   
  
    if (doc.containsKey("pumpManualOverride"))
        if (doc["pumpManualOverride"] == true) {
            manualConfig.pumpManualOverride = true;
        } else if (doc["pumpManualOverride"] == false) {
            manualConfig.pumpManualOverride = false;
        }

    Serial.println("Manual config updated:");
    Serial.println(payload);

}

void automaticPump(int soilPercent, int tankPercent) {
    // Automatic control logic based on sensor readings and thresholds
    
     if (soilPercent < manualConfig.soilTarget && tankPercent > manualConfig.tankDistancePercent) {
        setPump(true);
    } else {
        setPump(false);
    }
}

void manualPump() {
    // Manual control logic based on pumpState variable
    bool pumpState = getPumpState(); // Get the current pump state
    pumpState = !pumpState; // Toggle the pump state
    setPump(pumpState);
}

bool getPumpOverrideState() {
    return manualConfig.pumpManualOverride;
}