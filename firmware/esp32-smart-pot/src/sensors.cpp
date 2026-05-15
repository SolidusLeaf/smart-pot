#include "sensors.h"
#include "pins.h"
#include "config.h"

#include <Arduino.h>
#include <Wire.h>

#include <DHT.h>

static bool sensorFlag = false;

DHT dht(PIN_DHT22, DHTTYPE);

static int clampPercent(int value) {
    if (value < 0) return 0;
    if (value > 100) return 100;
    return value;
}
void sensorsFlagSetup(bool isInitialized) {
    sensorFlag = isInitialized;
}

bool getSensorFlag() {
    return sensorFlag;
}
static int mapSoilToPercent(int raw) {
    int percent = map(raw, SOIL_DRY_VALUE, SOIL_WET_VALUE, 0, 100);
    return clampPercent(percent);
}

static int mapWaterToPercent(int raw) {
    int percent = map(raw, WATER_EMPTY_VALUE, WATER_FULL_VALUE, 0, 100);
    return clampPercent(percent);
}

void sensorsBegin() {
    pinMode(PIN_SOIL_MOISTURE, INPUT);
    pinMode(PIN_WATER_LEVEL, INPUT);


    dht.begin();
    Serial.println("DHT22 initialized.");

}

SensorData readSensors() {
    SensorData data{};

    data.soilRaw = analogRead(PIN_SOIL_MOISTURE);
    data.soilPercent = mapSoilToPercent(data.soilRaw);

    data.waterRaw = analogRead(PIN_WATER_LEVEL);
    data.waterPercent = mapWaterToPercent(data.waterRaw);


    data.temperature = dht.readTemperature();
    data.humidity = dht.readHumidity();
    data.pressure = 0.0;


    return data;
}
