### 📚 **Log Rotation Guide for Redbelly Node Logs**

**Log rotation** ensures that log files do not grow indefinitely, consuming all disk space. Below is a simple guide to set up log rotation for your Redbelly Node.

---

## 🛠️ **1. Create a Log Rotation Configuration File**

Open the configuration file for Redbelly logs:

```bash
sudo nano /etc/logrotate.d/rbbc_logs
```

Add the following configuration:

```conf
/var/log/redbelly/rbn_logs/rbbc_logs.log {
    daily                   # Rotate logs daily
    size 5G                 # Rotate if log file exceeds 5GB
    rotate 10               # Keep last 10 rotated logs
    copytruncate            # Truncate the original log file after rotation
    missingok               # Ignore if the log file is missing
    notifempty              # Do not rotate if the log file is empty
    compress                # Compress rotated logs
    delaycompress           # Delay compression until the next rotation
    create 0640 rbnuser rbnuser  # Set ownership and permissions
}
```

Save and close the file.

---

## 🔄 **2. Test Log Rotation Configuration**

Run the following command to verify your setup:

```bash
sudo logrotate -f /etc/logrotate.d/rbbc_logs
```

Check if new rotated files (`rbbc_logs.log.1`, `rbbc_logs.log.1.gz`) have been created:

```bash
ls -lh /var/log/redbelly/rbn_logs/
```

---

## 🕒 **3. Verify Scheduled Log Rotation**

Log rotation typically runs daily via a systemd timer or cron job. Verify it:

### For Systemd:
```bash
sudo systemctl status logrotate
```

### For Cron:
Check if logrotate is scheduled under `/etc/cron.daily/logrotate`.

---

## 📊 **4. Monitor Disk Usage**

Ensure logs aren’t consuming excessive disk space:

```bash
du -sh /var/log/redbelly/rbn_logs/
```

---

## ✅ **5. You're All Set!**

Your Redbelly Node logs are now managed efficiently with log rotation. Logs will be compressed, archived, and space will be freed periodically.

Feel free to reach out for help or feedback! 🚀
