import { useEffect, useState } from "react";
import "./App.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const API_BASE_URL = "http://localhost:3000";

function App() {
  const [latestData, setLatestData] = useState(null);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [todaySummary, setTodaySummary] = useState(null);

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

  async function fetchHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/history?limit=10`);
      const result = await response.json();

      if (result.success) {
        setHistory(result.records);
      }
    } catch (err) {
      console.error("History fetch failed:", err.message);
    }
  }

  async function fetchAlerts() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts?limit=5`);
      const result = await response.json();

      if (result.success) {
        setAlerts(result.records);
      }
    } catch (err) {
      console.error("Alerts fetch failed:", err.message);
    }
  }

  async function fetchTodaySummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/summary/today`);
      const result = await response.json();

      if (result.success && result.hasData) {
        setTodaySummary(result.data);
      }
    } catch (err) {
      console.error("Today summary fetch failed:", err.message);
    }
  }

  async function sendCommand(command, durationMs = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/command`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          command,
          durationMs
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Command failed");
      }

      alert(`${command} command sent successfully`);
    } catch (err) {
      alert(`Command error: ${err.message}`);
    }
  }

  useEffect(() => {
    fetchLatestData();
    fetchHistory();
    fetchAlerts();
    fetchTodaySummary();

    const intervalId = setInterval(() => {
      fetchLatestData();
      fetchHistory();
      fetchAlerts();
      fetchTodaySummary();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const soilMoisture = latestData?.soil_humidity ?? latestData?.soilMoisture ?? "--";
  const temperature = latestData?.temperature ?? "--";
  const humidity = latestData?.air_humidity ?? latestData?.humidity ?? "--";
  const waterLevel = latestData?.water_level ?? latestData?.waterLevel ?? "--";
  const pumpState = latestData?.pump_state ?? latestData?.pumpState ?? "OFF";
  const fanState = latestData?.fan_state ?? latestData?.fanState ?? "OFF";
  const batteryVoltage = latestData?.battery_voltage ?? latestData?.batteryVoltage ?? "--";
  const solarVoltage = latestData?.solar_voltage ?? latestData?.solarVoltage ?? "--";
  const solarCurrent = latestData?.solar_current ?? latestData?.solarCurrent ?? "--";
  const powerMode = latestData?.power_mode ?? latestData?.powerMode ?? "Unknown";
  const lastUpdate = latestData?.timestamp ?? latestData?.receivedAt ?? "No data yet";

  const healthScore = todaySummary?.health_score ?? "--";
  const healthNotes = todaySummary?.notes ?? "No recommendation yet.";

  const chartData = history
    .slice()
    .reverse()
    .map((row) => ({
      time: row.timestamp
        ? new Date(row.timestamp).toLocaleTimeString()
        : "",
      soil: row.soil_humidity ?? null,
      temperature: row.temperature ?? null,
      humidity: row.air_humidity ?? null,
      battery: row.battery_voltage ?? null,
      solar: row.solar_voltage ?? null
    }));

  let healthStatus = "Unknown";

  if (healthScore !== "--") {
    if (healthScore >= 70) {
      healthStatus = "Healthy";
    } else if (healthScore >= 50) {
      healthStatus = "Needs Attention";
    } else {
      healthStatus = "Critical";
    }
  }

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
                {latestData?.device_id ?? "plant1"}
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
            <button
              className="btn btn-primary"
              onClick={() => sendCommand("WATER", 3000)}
            >
              Water Plant
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => sendCommand("FAN_ON")}
            >
              Fan On
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => sendCommand("FAN_OFF")}
            >
              Fan Off
            </button>
          </div>
          <p className="panel-note">
            Buttons send MQTT commands through the backend.
          </p>
        </div>

        <div className="panel">
          <h2 className="panel-title">🚨 Alerts</h2>

          {alerts.length === 0 ? (
            <div className="empty-state">
              <p>✓ No alerts. System is healthy!</p>
            </div>
          ) : (
            <div className="alerts-list">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`alert-item ${alert.severity?.toLowerCase()}`}
                >
                  <div>
                    <strong>{alert.type}</strong>
                    <p>{alert.message}</p>
                  </div>
                  <span>{alert.severity}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <h2 className="panel-title">🔋 Power</h2>
          <div className="status-list">
            <div className="status-item">
              <span className="status-label">Battery Voltage</span>
              <strong className="status-value">
                {batteryVoltage !== "--" ? `${batteryVoltage} V` : "--"}
              </strong>
            </div>

            <div className="status-item">
              <span className="status-label">Solar Voltage</span>
              <strong className="status-value">
                {solarVoltage !== "--" ? `${solarVoltage} V` : "--"}
              </strong>
            </div>

            <div className="status-item">
              <span className="status-label">Solar Current</span>
              <strong className="status-value">
                {solarCurrent !== "--" ? `${solarCurrent} A` : "--"}
              </strong>
            </div>

            <div className="status-item">
              <span className="status-label">Power Mode</span>
              <strong className="status-value">{powerMode}</strong>
            </div>
          </div>
        </div>

        <div className="panel">
          <h2 className="panel-title">🌿 Plant Health</h2>

          <div className="health-score">
            <div className="health-number">
              {healthScore !== "--" ? `${healthScore}/100` : "--"}
            </div>
            <div className="health-label">{healthStatus}</div>
          </div>

          <div className="card-bar">
            <div
              className="card-bar-fill"
              style={{
                width: healthScore !== "--" ? `${healthScore}%` : "0%"
              }}
            ></div>
          </div>

          <p className="panel-note">{healthNotes}</p>
        </div>
      </section>

      <section className="history-panel">
        <h2 className="panel-title">📊 Recent Readings</h2>

        {history.length === 0 ? (
          <p className="panel-note">No history data yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Soil</th>
                  <th>Temp</th>
                  <th>Humidity</th>
                  <th>Water</th>
                  <th>Power</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <tr key={row.id}>
                    <td>{row.timestamp}</td>
                    <td>{row.soil_humidity ?? "--"}%</td>
                    <td>{row.temperature ?? "--"}°C</td>
                    <td>{row.air_humidity ?? "--"}%</td>
                    <td>{row.water_level ?? "--"}</td>
                    <td>{row.power_mode ?? "--"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="charts-panel">
        <h2 className="panel-title">📈 History Charts</h2>

        {chartData.length === 0 ? (
          <p className="panel-note">No chart data yet.</p>
        ) : (
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Soil Moisture</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="soil" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Temperature</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Humidity</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="humidity" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Power</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="battery" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="solar" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;