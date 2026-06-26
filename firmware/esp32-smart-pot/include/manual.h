#ifndef MANUAL_H
#define MANUAL_H


struct ManualConfig {
    int soilTargetMin;
    int soilTargetMax;
    int tempMax;
    int tempMin;
    int humidityMax;
    int waterMin;
    int tankDistancePercent;
    bool pumpManualOverride; // true for manual override, false for automatic control
};

extern ManualConfig manualConfig;

void manualInit();
void manualHandleMessage(const char* topic, const char* payload);
void automaticPump(int soilPercent, int tankPercent);
void manualPump();
bool getPumpOverrideState();
#endif