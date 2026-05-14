#ifndef ACTUATORS_H
#define ACTUATORS_H

void actuatorsBegin();
void setPump(bool enabled);
bool getPumpState();
int getFanSpeed();

#endif
