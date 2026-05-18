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
    pinMode(PIN_ULTRASONIC_TRIG, OUTPUT);
    pinMode(PIN_ULTRASONIC_ECHO, INPUT);

    digitalWrite(PIN_ULTRASONIC_TRIG, LOW);

    dht.begin();
    Serial.println("DHT22 initialized.");

}

SensorData readSensors() {
    SensorData data;

    // soil example
    data.soilRaw = analogRead(PIN_SOIL_MOISTURE);
    data.soilPercent = map(data.soilRaw, 3800, 1500, 0, 100);
    data.soilPercent = constrain(data.soilPercent, 0, 100);

    // ultrasonic water level
    float distance = readUltrasonicDistanceCm();
    data.currentTankDistanceCm = distance;  // distance in cm
    data.tankPercent = waterPercentFromDistance(distance);

    // DHT code here
    data.temperature = dht.readTemperature();
    data.humidity = dht.readHumidity();

    if (isnan(data.temperature)) data.temperature = 0;
    if (isnan(data.humidity)) data.humidity = 0;

    return data;
}

float readUltrasonicDistanceCm() {
    digitalWrite(PIN_ULTRASONIC_TRIG, LOW);
    delayMicroseconds(2);

    digitalWrite(PIN_ULTRASONIC_TRIG, HIGH);
    delayMicroseconds(10);
    digitalWrite(PIN_ULTRASONIC_TRIG, LOW);

    unsigned long duration = pulseIn(PIN_ULTRASONIC_ECHO, HIGH, 30000);

    if (duration == 0) {
        return -1; // no echo / failed reading
    }

    float distance = duration * 0.0343 / 2.0;
    return distance;
}

int waterPercentFromDistance(float distanceCm) {
    if (distanceCm < 0) {
        return 0;
    }

    int percent = map(
        distanceCm,
        TANK_EMPTY_DISTANCE_CM,
        TANK_FULL_DISTANCE_CM,
        0,
        100
    );

    return constrain(percent, 0, 100);
}