import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>Smart Pot Dashboard</h1>
      <p className="subtitle">Live monitoring panel for the autonomous plant pot</p>

      <div className="cards">
        <div className="card">
          <h2>Soil Moisture</h2>
          <p>Waiting for data...</p>
        </div>

        <div className="card">
          <h2>Temperature</h2>
          <p>Waiting for data...</p>
        </div>

        <div className="card">
          <h2>Humidity</h2>
          <p>Waiting for data...</p>
        </div>

        <div className="card">
          <h2>Water Level</h2>
          <p>Waiting for data...</p>
        </div>
      </div>
    </div>
  );
}

export default App;