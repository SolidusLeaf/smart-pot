#include "actuators.h"
#include "pins.h"
#include "config.h"

#include <Arduino.h>

static bool pumpState = false;
static int fanSpeedPercent = 0;

void actuatorsBegin() {
    pinMode(PIN_PUMP, OUTPUT);
    digitalWrite(PIN_PUMP, LOW);

    ledcSetup(FAN_PWM_CHANNEL, FAN_PWM_FREQ, FAN_PWM_RESOLUTION);
    ledcAttachPin(PIN_FAN, FAN_PWM_CHANNEL);
    ledcWrite(FAN_PWM_CHANNEL, 0);
}

void setPump(bool enabled) {
    pumpState = enabled;
    digitalWrite(PIN_PUMP, enabled ? HIGH : LOW);
}

void setFanSpeed(int speedPercent) {
    if (speedPercent < 0) speedPercent = 0;
    if (speedPercent > 100) speedPercent = 100;

    fanSpeedPercent = speedPercent;
    int pwmValue = map(speedPercent, 0, 100, 0, 255);
    ledcWrite(FAN_PWM_CHANNEL, pwmValue);
}

bool getPumpState() {
    return pumpState;
}

int getFanSpeed() {
    return fanSpeedPercent;
}
