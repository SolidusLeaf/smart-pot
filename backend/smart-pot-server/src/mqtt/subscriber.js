const mqtt = require("mqtt");
const {
  insertReading,
  upsertDailySummary
} = require("../database/readingRepository");

const MQTT_URL = process.env.MQTT_URL || "mqtt://localhost:1883";

const TELEMETRY_TOPICS = [
  process.env.MQTT_TELEMETRY_TOPIC || "smartpot/plant1/telemetry",
  "smartpot/data"
];

let mqttStatus = "disconnected";

function startMqttSubscriber() {
  const client = mqtt.connect(MQTT_URL, {
    clientId: `smartpot-backend-${Date.now()}`,
    clean: true,
    reconnectPeriod: 1000
  });

  client.on("connect", () => {
    mqttStatus = "connected";
    console.log(`MQTT connected to ${MQTT_URL}`);

    client.subscribe(TELEMETRY_TOPICS, (error) => {
      if (error) {
        console.error("MQTT subscribe error:", error.message);
        return;
      }

      console.log(`Subscribed to topics: ${TELEMETRY_TOPICS.join(", ")}`);
    });
  });

  client.on("message", (topic, message) => {
    const rawMessage = message.toString();

    console.log("MQTT message received:");
    console.log("Topic:", topic);
    console.log("Payload:", rawMessage);

    try {
      const telemetry = JSON.parse(rawMessage);

      insertReading(telemetry, (error, savedReading) => {
        if (error) {
          console.error("Database insert error:", error.message);
          return;
        }

        console.log("Saved reading:", savedReading);

        const today = new Date().toISOString().split("T")[0];

        upsertDailySummary(savedReading.device_id, today, (summaryError) => {
          if (summaryError) {
            console.error("Summary update error:", summaryError.message);
          } else {
            console.log("Daily summary updated");
          }
        });
      });
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