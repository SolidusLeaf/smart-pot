#include "actuators.h"
#include "pins.h"
#include "config.h"

#include <Arduino.h>

static bool pumpState = false;
static int fanSpeedPercent = 0;

void actuatorsBegin() {
    pinMode(PIN_PUMP, OUTPUT);
    digitalWrite(PIN_PUMP, LOW);

}

void setPump(bool enabled) {
    pumpState = enabled;
    digitalWrite(PIN_PUMP, enabled ? HIGH : LOW);
}


bool getPumpState() {
    return pumpState;
}


