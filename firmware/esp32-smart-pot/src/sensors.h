#ifndef SENSORS_H
#define SENSORS_H

struct SensorData {
    int soilRaw;
    int soilPercent;
    int waterRaw;
    int waterPercent;
    float temperature;
    float humidity;
    float pressure;
    bool environmentOk;
};

void sensorsBegin();
SensorData readSensors();

#endif
