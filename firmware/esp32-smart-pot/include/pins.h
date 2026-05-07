#ifndef PINS_H
#define PINS_H

// =============================
// ESP32 PIN MAP — Smart Pot IoT
// =============================

// I2C pins for BME280
#define PIN_I2C_SDA 21
#define PIN_I2C_SCL 22

// Analog soil moisture sensor
// GPIO34 is input-only and good for analog reading.
#define PIN_SOIL_MOISTURE 34

// Water level sensor
// Use analog mode if the sensor outputs variable voltage.
#define PIN_WATER_LEVEL 35

// DHT22 data pin, only used if DHT22 is selected instead of BME280.
#define PIN_DHT22 4

// Pump control through MOSFET gate
#define PIN_PUMP 26

// Fan control through MOSFET gate / PWM
#define PIN_FAN 27

// Optional status LED
#define PIN_STATUS_LED 2

#endif