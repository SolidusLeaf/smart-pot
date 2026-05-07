# Smart Pot IoT — Student 1 Firmware

## Responsibility
Soltanov Ramiz handles firmware setup for ESP32 hardware control:

- Soil moisture sensor
- BME280 or DHT22 environment sensor
- Water level sensor
- Pump MOSFET control
- Fan PWM MOSFET control
- Wi-Fi connection
- MQTT telemetry and commands

## ESP32 Pin Map

| Function | ESP32 Pin |
|---|---:|
| I2C SDA | GPIO 21 |
| I2C SCL | GPIO 22 |
| Soil Moisture Analog | GPIO 34 |
| Water Level Analog | GPIO 35 |
| DHT22 Data | GPIO 4 |
| Pump MOSFET Gate | GPIO 26 |
| Fan MOSFET Gate/PWM | GPIO 27 |
| Status LED | GPIO 2 |

## MQTT Topics

Telemetry:

```text
smartpot/student1/telemetry
```

Commands:

```text
smartpot/student1/command
```

Status:

```text
smartpot/student1/status
```

## MQTT Commands

Turn pump on:

```text
pump_on
```

Turn pump off:

```text
pump_off
```

Set fan speed:

```text
fan:0
fan:50
fan:100
```

## Important Hardware Rule
Never connect the pump or fan directly to ESP32 pins. Use a MOSFET driver circuit and common ground.