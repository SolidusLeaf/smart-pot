# 🌱 SmartPot — Plant Monitoring System

An IoT system that monitors plant health in real time using an ESP32, MQTT messaging, and a cloud database hosted on a Google Cloud VM.

**Sensors tracked:**
- 💧 Soil moisture
- 💨 Air humidity
- ☀️ Light intensity
- ⏱️ Daily sun exposure
- 📊 Auto-generated health scores & alerts

---

## 📋 Architecture

```
ESP32 (sensors)
    ↓  MQTT publish
Mosquitto Broker — localhost:1883
    ↓
Node.js Bridge — localhost:3000
    ↓
SQLite Database — plant_data.db
```

---

## 🛠️ VM Setup (first time only)

### Prerequisites
- Google Cloud Compute Engine VM running Ubuntu/Debian
- SSH access to the VM

### Step 1 — SSH into the VM
```bash
ssh YOUR_USERNAME@YOUR_VM_EXTERNAL_IP
```

### Step 2 — Install Mosquitto
```bash
sudo apt-get update
sudo apt-get install -y mosquitto mosquitto-clients
sudo systemctl start mosquitto
sudo systemctl enable mosquitto
```

Configure it to accept connections:
```bash
sudo nano /etc/mosquitto/mosquitto.conf
```
Add at the end:
```
listener 1883
allow_anonymous true
```
Restart Mosquitto:
```bash
sudo systemctl restart mosquitto
```

### Step 3 — Install Node.js 20.x
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify:
```bash
node --version   # should be v20.x.x
npm --version
```

### Step 4 — Set Up Project
```bash
mkdir ~/esp32-mqtt-db
cd ~/esp32-mqtt-db
npm init -y
npm install mqtt sqlite3 express cors
```

### Step 5 — Add Project Files

Copy `database.js` and `app.js` into `~/esp32-mqtt-db/`.

Verify they're there:
```bash
ls -la ~/esp32-mqtt-db/
```

You should see: `app.js`, `database.js`, `package.json`, `node_modules/`

### Step 6 — Run as a Background Service

This keeps the app running 24/7, even when you log out or close your laptop.

Create the service file:
```bash
sudo nano /etc/systemd/system/smartpot.service
```

Paste this:
```ini
[Unit]
Description=SmartPot MQTT Database Bridge
After=network.target mosquitto.service

[Service]
Type=simple
User=YOUR_USERNAME
WorkingDirectory=/home/YOUR_USERNAME/esp32-mqtt-db
ExecStart=/usr/bin/node /home/YOUR_USERNAME/esp32-mqtt-db/app.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

> Replace `YOUR_USERNAME` with your actual Linux username (e.g. `fayzullo`)

Enable and start it:
```bash
sudo systemctl daemon-reload
sudo systemctl enable smartpot
sudo systemctl start smartpot
```

Check it's running:
```bash
sudo systemctl status smartpot
```

You should see `Active: active (running)`.

### Step 7 — Open VM Firewall Ports

Run these from your local machine or Google Cloud Console:
```bash
gcloud compute firewall-rules create allow-mqtt --allow=tcp:1883
gcloud compute firewall-rules create allow-api  --allow=tcp:3000
```

---

## 🔌 ESP32 Setup

### Required Libraries (install via Arduino Library Manager)
- `PubSubClient` by Nick O'Leary
- `ArduinoJson` by Benoit Blanchon
- `DHT sensor library` by Adafruit

### Sensor Wiring

| Sensor | Recommended Pin | Notes |
|--------|----------------|-------|
| Soil Moisture | GPIO34 (A0) | Capacitive sensor recommended |
| DHT22 Air Humidity | GPIO4 | Needs 10kΩ pull-up resistor |
| Light Sensor (LDR) | GPIO35 (A1) | Or use BH1750 via I2C |

### ESP32 Arduino Code
```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

// ── WiFi ──────────────────────────────────────────────
const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// ── MQTT ──────────────────────────────────────────────
const char* mqtt_server = "YOUR_VM_EXTERNAL_IP"; // e.g. "34.x.x.x"
const int   mqtt_port   = 1883;
const char* mqtt_topic  = "smartpot/data";

// ── Sensors ───────────────────────────────────────────
#define SOIL_PIN  34
#define LIGHT_PIN 35
#define DHT_PIN   4
#define DHT_TYPE  DHT22

DHT dht(DHT_PIN, DHT_TYPE);
WiFiClient   espClient;
PubSubClient client(espClient);

unsigned long lastMsg       = 0;
unsigned long sunStartTime  = 0;
float         totalSunMin   = 0;

void setup_wifi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi connected: " + WiFi.localIP().toString());
  } else {
    Serial.println("\n✗ WiFi failed — check credentials");
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT... ");
    if (client.connect("ESP32_SmartPot")) {
      Serial.println("✓ connected");
    } else {
      Serial.print("✗ failed (rc=");
      Serial.print(client.state());
      Serial.println("), retrying in 5s");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  unsigned long now = millis();

  // Send a reading every 5 minutes
  if (now - lastMsg > 300000) {
    lastMsg = now;

    // Read sensors
    float soilRaw      = analogRead(SOIL_PIN);
    float soilHumidity = 100.0 - ((soilRaw / 4095.0) * 100.0); // invert: dry = low ADC
    float airHumidity  = dht.readHumidity();
    float lightRaw     = analogRead(LIGHT_PIN);                 // 0–4095 ADC

    // Track sun exposure in minutes (threshold: ADC > 2500 = good light)
    if (lightRaw > 2500) {
      if (sunStartTime == 0) sunStartTime = now;
    } else {
      if (sunStartTime != 0) {
        totalSunMin += (now - sunStartTime) / 60000.0;
        sunStartTime = 0;
      }
    }

    // Build JSON
    StaticJsonDocument<256> doc;
    doc["device_id"]          = "smartpot_01";
    doc["soil_humidity"]      = round(soilHumidity * 10) / 10.0;
    doc["air_humidity"]       = round(airHumidity  * 10) / 10.0;
    doc["light_intensity"]    = lightRaw;
    doc["sun_exposure_today"] = round(totalSunMin  * 10) / 10.0;

    char buffer[256];
    serializeJson(doc, buffer);

    if (client.publish(mqtt_topic, buffer)) {
      Serial.print("✓ Published: ");
      Serial.println(buffer);
    } else {
      Serial.println("✗ Publish failed");
    }

    // Reset sun counter at midnight (simple check: millis overflow ~49 days)
    static unsigned long lastDay = 0;
    if (now / 86400000UL != lastDay) {
      totalSunMin = 0;
      lastDay = now / 86400000UL;
    }
  }
}
```

---

## 📡 API Endpoints

Base URL: `http://YOUR_VM_EXTERNAL_IP:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/readings` | Last 50 raw sensor readings |
| GET | `/api/summary` | Last 30 daily summaries |
| GET | `/api/summary/today` | Today's summary with health score |
| GET | `/api/health` | Server and MQTT status |

### Examples
```bash
# Check server is alive
curl http://YOUR_VM_IP:3000/api/health

# Get today's plant summary
curl http://YOUR_VM_IP:3000/api/summary/today

# Get raw readings
curl http://YOUR_VM_IP:3000/api/readings
```

---

## 📊 Database Schema

Database file: `~/esp32-mqtt-db/plant_data.db`

### `sensor_readings` — raw data every ~5 minutes

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Auto ID |
| `device_id` | TEXT | ESP32 identifier |
| `soil_humidity` | REAL | 0–100% |
| `air_humidity` | REAL | 0–100% |
| `light_intensity` | REAL | ADC value (0–4095) |
| `sun_exposure_today` | REAL | Minutes under good light today |
| `soil_status` | TEXT | `dry` / `low` / `optimal` / `wet` |
| `light_status` | TEXT | `dark` / `low` / `good` / `bright` |
| `timestamp` | DATETIME | Auto UTC timestamp |

### `daily_summary` — one row per day

| Column | Type | Description |
|--------|------|-------------|
| `date` | TEXT | YYYY-MM-DD |
| `avg_soil_humidity` | REAL | Average soil moisture |
| `min_soil_humidity` | REAL | Driest point of day |
| `max_soil_humidity` | REAL | Wettest point of day |
| `avg_air_humidity` | REAL | Average air humidity |
| `avg_light_intensity` | REAL | Average light level |
| `peak_light_intensity` | REAL | Brightest reading |
| `total_sun_exposure` | REAL | Total minutes of good light |
| `watering_needed` | INTEGER | 1 if soil was dry for too long |
| `sun_sufficient` | INTEGER | 1 if plant got ≥ 2hrs of light |
| `health_score` | REAL | 0–100 overall score |
| `notes` | TEXT | Auto-generated day summary |

**Health score weights:** soil moisture 50% · sunlight 35% · air humidity 15%

---

## 🧪 Testing

### Send a simulated ESP32 message
```bash
mosquitto_pub -h localhost -t smartpot/data -m '{
  "device_id": "smartpot_01",
  "soil_humidity": 35.5,
  "air_humidity": 65.2,
  "light_intensity": 3500,
  "sun_exposure_today": 120
}'
```

### Query the database directly
```bash
sqlite3 ~/esp32-mqtt-db/plant_data.db "SELECT * FROM sensor_readings ORDER BY timestamp DESC LIMIT 5;"
sqlite3 ~/esp32-mqtt-db/plant_data.db "SELECT * FROM daily_summary;"
```

### View live server logs
```bash
sudo journalctl -u smartpot -f
```

---

## ⚙️ Service Management

```bash
# Check if running
sudo systemctl status smartpot

# Stop the service
sudo systemctl stop smartpot

# Restart (after editing app.js or database.js)
sudo systemctl restart smartpot

# View last 50 log lines
sudo journalctl -u smartpot -n 50

# Disable auto-start
sudo systemctl disable smartpot
```

---

## 🔧 Customization

Edit thresholds in `database.js` to match your specific plant and sensors:

```javascript
// Soil moisture thresholds
if (soilHumidity < 20) return 'dry';       // ← urgent, needs water
if (soilHumidity < 40) return 'low';       // ← getting dry
if (soilHumidity <= 70) return 'optimal';  // ← perfect range
return 'wet';                              // ← overwatered

// Light thresholds (ADC 0–4095)
if (lux < 500)   return 'dark';    // too dark
if (lux < 2500)  return 'low';     // low light
if (lux < 10000) return 'good';    // ideal
return 'bright';                   // full sun

// Daily sunlight goal (minutes)
const sunSufficient = row.total_sun >= 120 ? 1 : 0;  // ← change 120 to your plant's needs

// Health score weights
const soilScore  = ... * 0.50;   // 50%
const sunScore   = ... * 0.35;   // 35%
const airScore   = ... * 0.15;   // 15%
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `node app.js` can't connect to MQTT | `sudo systemctl start mosquitto` |
| ESP32 can't reach VM | Check VM firewall allows port 1883 |
| API returns 500 | Check DB file exists: `ls -la ~/esp32-mqtt-db/plant_data.db` |
| No data in DB | Verify ESP32 publishes to topic `smartpot/data` |
| Service won't start | Check logs: `sudo journalctl -u smartpot -n 30` |

---

## 👥 Team Tasks

| Role | Responsibilities |
|------|-----------------|
| **Firmware** | Wire sensors, calibrate ADC values, upload ESP32 code |
| **Backend** | Deploy VM service, test API endpoints |
| **Electronics** | Solder DHT22, soil sensor, light sensor to correct GPIO pins |
| **Frontend** *(optional)* | Build dashboard using `/api/readings` and `/api/summary` |

---

## 📚 Resources

- [PubSubClient (MQTT for ESP32)](https://github.com/knolleary/pubsubclient)
- [ArduinoJson](https://arduinojson.org/)
- [DHT Sensor Library](https://github.com/adafruit/DHT-sensor-library)
- [SQLite Docs](https://www.sqlite.org/docs.html)
- [Mosquitto Docs](https://mosquitto.org/documentation/)

---

**Last updated:** 2026-05-12
**Project lead:** fayzullo
