#ifndef MQTT_CLIENT_H
#define MQTT_CLIENT_H

#include "sensors.h"

void mqttBegin();
void mqttLoop();
void publishTelemetry(const SensorData &data);
void publishAlert(const char* alertMessage);
#endif
