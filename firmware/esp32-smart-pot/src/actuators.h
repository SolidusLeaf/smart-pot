#ifndef ACTUATORS_H
#define ACTUATORS_H

void actuatorsBegin();
void setPump(bool enabled);
void setFanSpeed(int speedPercent);
bool getPumpState();
int getFanSpeed();

#endif
