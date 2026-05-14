import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🌱 Smart Pot Dashboard</h1>
          <p className="subtitle">
            Live monitoring panel for autonomous plant care
          </p>
        </div>

        <div className="status-badge disconnected">● Backend: Not connected</div>
      </header>

      <section className="cards-grid">
        <div className="metric-card">
          <div className="card-header">
            <span className="card-icon">💧</span>
            <span className="card-label">Soil Moisture</span>
          </div>
          <div className="card-value">--%</div>
          <div className="card-status">Waiting for data</div>
          <div className="card-bar"><div className="card-bar-fill" style={{width: '0%'}}></div></div>
        </div>

        <div className="metric-card">
          <div className="card-header">
            <span className="card-icon">🌡️</span>
            <span className="card-label">Temperature</span>
          </div>
          <div className="card-value">--°C</div>
          <div className="card-status">Waiting for data</div>
          <div className="card-bar"><div className="card-bar-fill" style={{width: '0%'}}></div></div>
        </div>

        <div className="metric-card">
          <div className="card-header">
            <span className="card-icon">💨</span>
            <span className="card-label">Humidity</span>
          </div>
          <div className="card-value">--%</div>
          <div className="card-status">Waiting for data</div>
          <div className="card-bar"><div className="card-bar-fill" style={{width: '0%'}}></div></div>
        </div>

        <div className="metric-card">
          <div className="card-header">
            <span className="card-icon">🌊</span>
            <span className="card-label">Water Level</span>
          </div>
          <div className="card-value">--</div>
          <div className="card-status">Waiting for data</div>
          <div className="card-bar"><div className="card-bar-fill" style={{width: '0%'}}></div></div>
        </div>
      </section>

      <section className="panels-grid">
        <div className="panel">
          <h2 className="panel-title">⚙️ Device Status</h2>
          <div className="status-list">
            <div className="status-item">
              <span className="status-label">Device ID</span>
              <strong className="status-value">plant1</strong>
            </div>
            <div className="status-item">
              <span className="status-label">Pump</span>
              <strong className="status-value status-off">● OFF</strong>
            </div>
            <div className="status-item">
              <span className="status-label">Fan</span>
              <strong className="status-value status-off">● OFF</strong>
            </div>
            <div className="status-item">
              <span className="status-label">Last Update</span>
              <strong className="status-value">No data yet</strong>
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
            Static preview • Backend connection coming soon
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
              <strong className="status-value">-- V</strong>
            </div>
            <div className="status-item">
              <span className="status-label">Solar</span>
              <strong className="status-value">-- V</strong>
            </div>
            <div className="status-item">
              <span className="status-label">Mode</span>
              <strong className="status-value">Unknown</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;