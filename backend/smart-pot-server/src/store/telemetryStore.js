let latestTelemetry = null;
let telemetryHistory = [];

function saveTelemetry(telemetry) {
  const telemetryWithTimestamp = {
    ...telemetry,
    receivedAt: new Date().toISOString()
  };

  latestTelemetry = telemetryWithTimestamp;

  telemetryHistory.push(telemetryWithTimestamp);

  // Keep only last 100 records in memory for now
  if (telemetryHistory.length > 100) {
    telemetryHistory = telemetryHistory.slice(-100);
  }

  return telemetryWithTimestamp;
}

function getLatestTelemetry() {
  return latestTelemetry;
}

function getTelemetryHistory() {
  return telemetryHistory;
}

module.exports = {
  saveTelemetry,
  getLatestTelemetry,
  getTelemetryHistory
};