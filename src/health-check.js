const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 9092;

// Add CORS and JSON handling middleware
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.get('/health/service', (req, res) => {
    exec('systemctl is-active redbelly.service', (error, stdout, stderr) => {
        if (error && !stdout) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to check service health',
                timestamp: new Date().toISOString(),
                error: error.message
            });
        } else {
            const serviceStatus = stdout.trim();
            res.json({
                status: serviceStatus === 'active' ? 'ok' : 'error',
                timestamp: new Date().toISOString(),
                service: {
                    name: 'redbelly.service',
                    status: serviceStatus
                }
            });
        }
    });
});

app.get('/health/block', (req, res) => {
    const extractBlockCommands = [
        // 1. Look for "Done processing block" lines first (most authoritative)
        `grep -E "Done processing block [0-9]+" /var/log/redbelly/rbn_logs/rbbc_logs.log | tail -n 100 | grep -oP "(?<=Done processing block )[0-9]+" | tail -n 1`,
        
        // 2. Look for "Inserted new chain segment" lines
        `grep -E "Inserted new chain segment.*number.* [0-9]+" /var/log/redbelly/rbn_logs/rbbc_logs.log | tail -n 100 | grep -oP '(?<="number": ")([0-9]+)(?=")' | tail -n 1`,
        
        // 3. Look for block import logs
        `grep -E "Inserted new block.*number.* [0-9]+" /var/log/redbelly/rbn_logs/rbbc_logs.log | tail -n 100 | grep -oP '(?<="number": ")([0-9]+)(?=")' | tail -n 1`,
        
        // 4. Look for block processor logs
        `grep -E "blockchain/blocks_processor.go.*block [0-9]+" /var/log/redbelly/rbn_logs/rbbc_logs.log | tail -n 100 | grep -oP "(?<=block )[0-9]+" | tail -n 1`,
        
        // 5. Fallback to downloader client logs (least preferred)
        `grep -E "returned block hash.*for block [0-9]+" /var/log/redbelly/rbn_logs/rbbc_logs.log | tail -n 100 | grep -oP "(?<=for block )[0-9]+" | tail -n 1`
    ];

    const tryNextCommand = (commands) => {
        if (commands.length === 0) {
            res.status(500).json({
                error: 'No valid block number found in logs'
            });
            return;
        }

        const currentCommand = commands[0];
        exec(currentCommand, (error, stdout, stderr) => {
            const blockNumber = stdout ? parseInt(stdout.trim()) : null;
            
            if (blockNumber && !isNaN(blockNumber)) {
                res.json(blockNumber);
            } else {
                tryNextCommand(commands.slice(1));
            }
        });
    };

    tryNextCommand(extractBlockCommands);
});

app.get('/', (req, res) => {
    res.json({
        message: 'Redbelly Node Health Check API',
        endpoints: {
            serviceHealth: '/health/service',
            latestBlock: '/health/block'
        }
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Health check service running on http://0.0.0.0:${port}`);
});
