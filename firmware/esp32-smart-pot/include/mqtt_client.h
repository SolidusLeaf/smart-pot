#ifndef MQTT_CLIENT_H
#define MQTT_CLIENT_H

#include "sensors.h"

struct AlertFlags {
    bool soilAlert;
    bool tempAlert;
    bool humidityAlert;
    bool tankAlert;
};

void mqttBegin();
void mqttLoop();
void publishTelemetry(const SensorData &data);
void publishAlerts(const AlertFlags &alerts);
void publishAlert(const char* alertMessage);
AlertFlags checkAlerts(const SensorData &data);
void initializeAlertFlags();
#endif
