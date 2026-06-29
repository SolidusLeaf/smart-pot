const mqtt = require("mqtt");

const MQTT_URL = process.env.MQTT_URL || "mqtt://localhost:1883";
const COMMAND_TOPIC =
  process.env.MQTT_COMMAND_TOPIC || "smartpot/plant1/command";

let publisherClient = null;

function startMqttPublisher() {
  publisherClient = mqtt.connect(MQTT_URL, {
    clientId: `smartpot-command-publisher-${Date.now()}`,
    clean: true,
    reconnectPeriod: 1000
  });

  publisherClient.on("connect", () => {
    console.log(`MQTT publisher connected to ${MQTT_URL}`);
  });

  publisherClient.on("error", (error) => {
    console.error("MQTT publisher error:", error.message);
  });

  publisherClient.on("close", () => {
    console.log("MQTT publisher connection closed");
  });
}

function publishCommand(commandPayload) {
  return new Promise((resolve, reject) => {
    if (!publisherClient || !publisherClient.connected) {
      reject(new Error("MQTT publisher is not connected"));
      return;
    }

    const message = JSON.stringify(commandPayload);

    publisherClient.publish(COMMAND_TOPIC, message, { qos: 0 }, (error) => {
      if (error) {
        reject(error);
        return;
      }

      console.log(`Command published to ${COMMAND_TOPIC}:`, message);

      resolve({
        topic: COMMAND_TOPIC,
        message: commandPayload
      });
    });
  });
}

module.exports = {
  startMqttPublisher,
  publishCommand
};