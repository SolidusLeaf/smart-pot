import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:3000";

function App() {
  const [latestData, setLatestData] = useState(null);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [error, setError] = useState("");

  async function fetchLatestData() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/latest`);
      const result = await response.json();

      if (result.success && result.hasData) {
        setLatestData(result.data);
      }

      setBackendStatus("connected");
      setError("");
    } catch (err) {
      setBackendStatus("disconnected");
      setError("Backend connection failed");
    }
  }

  useEffect(() => {
    fetchLatestData();

    const intervalId = setInterval(fetchLatestData, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const soilMoisture = latestData?.soilMoisture ?? "--";
  const temperature = latestData?.temperature ?? "--";
  const humidity = latestData?.humidity ?? "--";
  const waterLevel = latestData?.waterLevel ?? "--";
  const pumpState = latestData?.pumpState ?? "OFF";
  const fanState = latestData?.fanState ?? "OFF";
  const batteryVoltage = latestData?.batteryVoltage ?? "--";
  const solarVoltage = latestData?.solarVoltage ?? "--";
  const powerMode = latestData?.powerMode ?? "Unknown";
  const lastUpdate = latestData?.receivedAt ?? "No data yet";

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🌱 Smart Pot Dashboard</h1>
          <p className="subtitle">
            Live monitoring panel for autonomous plant care
          </p>
        </div>

        <div className={`status-badge ${backendStatus}`}>
          Backend: {backendStatus}
        </div>
      </header>

      {error && <div className="error-box">{error}</div>}

      <section className="cards-grid">
        <div className="metric-card">
          <div className="card-header">
            <span className="card-icon">💧</span>
            <span className="card-label">Soil Moisture</span>
          </div>
          <div className="card-value">{soilMoisture}%</div>
          <div className="card-status">Latest sensor value</div>
          <div className="card-bar">
            <div
              className="card-bar-fill"
              style={{ width: latestData ? `${soilMoisture}%` : "0%" }}
            ></div>
          </div>
        </div>

        <div className="metric-card">
          <div className="card-header">
            <span className="card-icon">🌡️</span>
            <span className="card-label">Temperature</span>
          </div>
          <div className="card-value">{temperature}°C</div>
          <div className="card-status">Latest sensor value</div>
          <div className="card-bar">
            <div
              className="card-bar-fill"
              style={{
                width: latestData ? `${Math.min(Number(temperature) * 3, 100)}%` : "0%"
              }}
            ></div>
          </div>
        </div>

        <div className="metric-card">
          <div className="card-header">
            <span className="card-icon">💨</span>
            <span className="card-label">Humidity</span>
          </div>
          <div className="card-value">{humidity}%</div>
          <div className="card-status">Latest sensor value</div>
          <div className="card-bar">
            <div
              className="card-bar-fill"
              style={{ width: latestData ? `${humidity}%` : "0%" }}
            ></div>
          </div>
        </div>

        <div className="metric-card">
          <div className="card-header">
            <span className="card-icon">🌊</span>
            <span className="card-label">Water Level</span>
          </div>
          <div className="card-value">{waterLevel}</div>
          <div className="card-status">Latest tank status</div>
          <div className="card-bar">
            <div
              className="card-bar-fill"
              style={{ width: waterLevel === "OK" ? "100%" : "20%" }}
            ></div>
          </div>
        </div>
      </section>

      <section className="panels-grid">
        <div className="panel">
          <h2 className="panel-title">⚙️ Device Status</h2>
          <div className="status-list">
            <div className="status-item">
              <span className="status-label">Device ID</span>
              <strong className="status-value">
                {latestData?.deviceId ?? "plant1"}
              </strong>
            </div>
            <div className="status-item">
              <span className="status-label">Pump</span>
              <strong className="status-value status-off">● {pumpState}</strong>
            </div>
            <div className="status-item">
              <span className="status-label">Fan</span>
              <strong className="status-value status-off">● {fanState}</strong>
            </div>
            <div className="status-item">
              <span className="status-label">Last Update</span>
              <strong className="status-value">{lastUpdate}</strong>
            </div>
          </div>
        </div>

        <div className="panel">
          <h2 className="panel-title">🎛️ Controls</h2>
          <div className="button-grid">
            <button className="btn btn-primary">Water Plant</button>
            <button className="btn btn-secondary">Fan On</button>
            <button className="btn btn-secondary">Fan Off</button>
          </div>
          <p className="panel-note">
            Buttons are static for now. Command connection will be added later.
          </p>
        </div>

        <div className="panel">
          <h2 className="panel-title">🚨 Alerts</h2>
          <div className="empty-state">
            <p>✓ No alerts. System is healthy!</p>
          </div>
        </div>

        <div className="panel">
          <h2 className="panel-title">🔋 Power</h2>
          <div className="status-list">
            <div className="status-item">
              <span className="status-label">Battery</span>
              <strong className="status-value">{batteryVoltage} V</strong>
            </div>
            <div className="status-item">
              <span className="status-label">Solar</span>
              <strong className="status-value">{solarVoltage} V</strong>
            </div>
            <div className="status-item">
              <span className="status-label">Mode</span>
              <strong className="status-value">{powerMode}</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;