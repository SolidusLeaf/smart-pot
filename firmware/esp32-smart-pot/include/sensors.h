#ifndef SENSORS_H
#define SENSORS_H
bool sensorFlag=false;
struct SensorData {
    int soilRaw;
    int soilPercent;
    int waterRaw;
    int waterPercent;
    float temperature;
    float humidity;
    float pressure;
};

void sensorsBegin();
SensorData readSensors();
void sensorsFlagSetup(bool isInitialized);
bool getSensorFlag();
#endif
