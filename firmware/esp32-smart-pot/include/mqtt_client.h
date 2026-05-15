#ifndef MQTT_CLIENT_H
#define MQTT_CLIENT_H

#include "sensors.h"

struct AlertFlags {
    bool soilAlert=false;
    bool tempAlert=false;
    bool humidityAlert=false;
};

void mqttBegin();
void mqttLoop();
void publishTelemetry(const SensorData &data);
void publishAlert(const char* alertMessage);
void checkAlerts(const SensorData &data);
#endif
