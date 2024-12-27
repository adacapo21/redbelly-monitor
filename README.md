# 🚀 Redbelly Node Health Monitor

A monitoring solution for Redbelly Node health and performance, utilizing **Node.js**, **Prometheus**, and **Grafana** to provide real-time insights into node operations.

---

## 📊 **Features**
- Real-time health checks for Redbelly Node services.
- Monitoring critical metrics like **latest block number**, **service status**, and **node logs**.
- Interactive Grafana dashboards for clear visualization.

---

## ⚙️ **1. Prerequisites**

Ensure you have the following installed on your server:

- **Node.js (v14+)**
- **Prometheus**
- **Grafana**
- **Systemd (for service management)**

---

## 📦 **2. Clone the Repository**

```bash
git clone https://github.com/adacapo21/redbelly-monitor.git
cd redbelly-monitor
```

---

## 🚀 **3. Install Dependencies**
    
```bash
npm install
```

---

## 🛠️ **4. Run the Health Check Service**

### Start the Service Manually (For Testing):
bash
```bash
node src/health-check.js
```
### Set Up as a Systemd Service (For Production):

### 1. Create a Systemd Service File:
```bash
sudo nano /etc/systemd/system/node-health.service
```

### 2. Add the Following Configuration:
```bash
[Unit]
Description=Redbelly Node Health Check Service
After=network.target

[Service]
ExecStart=/usr/bin/node /path/to/redbelly-monitor/src/health-check.js
Restart=always
User=root
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory=/path/to/redbelly-monitor

[Install]
WantedBy=multi-user.target
```

### 3. Reload systemd and enable the service::
```bash
sudo systemctl daemon-reload
sudo systemctl enable node-health.service
sudo systemctl start node-health.service
sudo systemctl status node-health.service
```

### 4. Check the Service Status:
```bash
sudo systemctl status node-health.service
```

---

## 📈 **5. Set Up Prometheus and Grafana**

### 1. Install Prometheus:
```bash
sudo apt-get install prometheus
```

### 2. Install Grafana:
```bash
sudo apt-get install grafana
```

### 3. Configure Prometheus:
```bash
sudo nano /etc/prometheus/prometheus.yml
```

### 4. Add the Following Configuration:
```bash
scrape_configs:
  - job_name: 'redbelly-health'
    static_configs:
      - targets: ['localhost:9092']
```

### 5. Restart Prometheus:
```bash
sudo systemctl restart prometheus
sudo systemctl status prometheus
```

### 6. Configure Grafana:
- Open Grafana in your browser (http://<server-ip>:3000)
- Log in with the default credentials (admin/admin) - **you will be prompt to change these credentials**.
- Add Prometheus as a data source (http://<server-ip>:9090).
- Import the Grafana dashboard
  - Go to Dashboard > Import
  - Add panels
    - Query: `redbelly_latest_block`
    - Query: `up{job="redbelly-health"}`
  - Save the dashboard.
    - Name: `Redbelly Node Health Monitoring`

---

## 🎉 **6. Access Monitoring Dashboard**

- **Prometheus UI:** http://<server-ip>:9090
- **Grafana Dashboard:** http://<server-ip>:3000

---

## 📝 **7. Configuration**

### 🛡️ Firewall Rules (If Necessary)

```bash
sudo ufw allow 9090
sudo ufw allow 9092
sudo ufw allow 3000
sudo ufw reload
```

---

## 🧩 8. Troubleshooting

### **1. Check the Service Logs:**
```bash
sudo journalctl -u node-health.service -f
sudo journalctl -u prometheus -f
sudo journalctl -u grafana-server -f

```

### **2. Check the Node.js Logs:**
```bash
cat /path/to/redbelly-monitor/logs/health-check.log
```

### **3. Check the Prometheus Logs:**
```bash
cat /var/log/prometheus/prometheus.log
```

### **4. Check the Grafana Logs:**
```bash
cat /var/log/grafana/grafana.log
```

### Verify Node Service is Active:
```bash
sudo systemctl status node-health.service
```

### Verify Metrics are Being Scraped:

- **Prometheus:** http://<server-ip>:9092/metrics

