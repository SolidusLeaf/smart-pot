#include "sensors.h"
#include "pins.h"
#include "config.h"

#include <Arduino.h>
#include <Wire.h>

#if USE_BME280
#include <Adafruit_BME280.h>
Adafruit_BME280 bme;
#else
#include <DHT.h>
#define DHT_TYPE DHT22
DHT dht(PIN_DHT22, DHT_TYPE);
#endif

static int clampPercent(int value) {
    if (value < 0) return 0;
    if (value > 100) return 100;
    return value;
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

#if USE_BME280
    Wire.begin(PIN_I2C_SDA, PIN_I2C_SCL);
    bool ok = bme.begin(0x76);
    if (!ok) {
        Serial.println("BME280 not found at 0x76. Trying 0x77...");
        ok = bme.begin(0x77);
    }

    if (!ok) {
        Serial.println("ERROR: BME280 not detected.");
    } else {
        Serial.println("BME280 detected.");
    }
#else
    dht.begin();
    Serial.println("DHT22 initialized.");
#endif
}

SensorData readSensors() {
    SensorData data{};

    data.soilRaw = analogRead(PIN_SOIL_MOISTURE);
    data.soilPercent = mapSoilToPercent(data.soilRaw);

    data.waterRaw = analogRead(PIN_WATER_LEVEL);
    data.waterPercent = mapWaterToPercent(data.waterRaw);

#if USE_BME280
    data.temperature = bme.readTemperature();
    data.humidity = bme.readHumidity();
    data.pressure = bme.readPressure() / 100.0F;
    data.environmentOk = !isnan(data.temperature) && !isnan(data.humidity) && !isnan(data.pressure);
#else
    data.temperature = dht.readTemperature();
    data.humidity = dht.readHumidity();
    data.pressure = 0.0;
    data.environmentOk = !isnan(data.temperature) && !isnan(data.humidity);
#endif

    return data;
}
