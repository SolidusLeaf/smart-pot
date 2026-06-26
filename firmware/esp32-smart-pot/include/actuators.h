#ifndef ACTUATORS_H
#define ACTUATORS_H

 // Global variable to track pump state


void actuatorsBegin();
void setPump(bool enabled);
bool getPumpState();

#endif
