#ifndef MANUAL_H
#define MANUAL_H


struct ManualConfig {
    int soilTarget;
    int tempMax;
    int humidityMax;
    int waterMin;
    bool pumpOverride;
};

extern ManualConfig manualConfig;

void manualInit();
void manualHandleMessage(const char* topic, const char* payload);
void setManualFlag(bool isInitialized);
bool getManualFlag();
#endif