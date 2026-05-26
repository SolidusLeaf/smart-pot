#ifndef PINS_H
#define PINS_H

// =============================
// ESP32 PIN MAP — Smart Pot IoT
// =============================


// Analog soil moisture sensor
// GPIO34 is input-only and good for analog reading.
#define PIN_SOIL_MOISTURE 34
#define PIN_BATTERY_VOLTAGE 33

// DHT22 data pin, only used if DHT22 is selected instead of BME280.
#define PIN_DHT22 4

// Pump control through MOSFET gate
#define PIN_PUMP 26

// Ultrasonic sensor pins
#define PIN_ULTRASONIC_TRIG 5
#define PIN_ULTRASONIC_ECHO 18

// Optional status LED
#define PIN_STATUS_LED 2

#endif