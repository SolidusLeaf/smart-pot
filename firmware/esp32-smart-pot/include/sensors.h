#ifndef SENSORS_H
#define SENSORS_H
struct SensorData {
    int soilRaw;
    int soilPercent; 
    int currentTankDistanceCm;
    int tankPercent;
    float temperature;
    float humidity;
    int batteryVoltageRaw;
    float batteryVoltage;
    int batteryPercent;
};

void sensorsBegin();
SensorData readSensors();
void sensorsFlagSetup(bool isInitialized);
bool getSensorFlag();
float readUltrasonicDistanceCm();
int waterPercentFromDistance(float distanceCm);
#endif
