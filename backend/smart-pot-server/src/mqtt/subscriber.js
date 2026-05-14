const mqtt = require("mqtt");
const { saveTelemetry } = require("../store/telemetryStore");

const MQTT_URL = process.env.MQTT_URL || "mqtt://localhost:1883";
const TELEMETRY_TOPIC =
  process.env.MQTT_TELEMETRY_TOPIC || "smartpot/plant1/telemetry";

let mqttStatus = "disconnected";

function startMqttSubscriber() {
  const client = mqtt.connect(MQTT_URL);

  client.on("connect", () => {
    mqttStatus = "connected";
    console.log(`MQTT connected to ${MQTT_URL}`);

    client.subscribe(TELEMETRY_TOPIC, (error) => {
      if (error) {
        console.error("MQTT subscribe error:", error.message);
        return;
      }

      console.log(`Subscribed to topic: ${TELEMETRY_TOPIC}`);
    });
  });

  client.on("message", (topic, message) => {
    const rawMessage = message.toString();

    console.log("MQTT message received:");
    console.log("Topic:", topic);
    console.log("Payload:", rawMessage);

    try {
      const telemetry = JSON.parse(rawMessage);
      const savedTelemetry = saveTelemetry(telemetry);

      console.log("Parsed telemetry:", telemetry);
      console.log("Saved latest telemetry:", savedTelemetry);
    } catch (error) {
      console.error("Invalid JSON received:", error.message);
    }
  });

  client.on("error", (error) => {
    mqttStatus = "error";
    console.error("MQTT connection error:", error.message);
  });

  client.on("close", () => {
    mqttStatus = "disconnected";
    console.log("MQTT connection closed");
  });
}

function getMqttStatus() {
  return mqttStatus;
}

module.exports = {
  startMqttSubscriber,
  getMqttStatus
};