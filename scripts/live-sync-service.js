/**
 * AirDraw Pro — Master Live Sync & Server Daemon
 * Manages:
 * 1. Local HTTP Server (Port 3000)
 * 2. Cloudflare Global Public HTTPS Tunnel
 * 3. Real-Time GitHub Auto-Sync Engine
 */

const { spawn, execSync } = require('child_process');
const path = require('path');
const http = require('http');

const REPO_DIR = path.resolve(__dirname, '..');
const PORT = 3000;

function isPortOpen(port, callback) {
    const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
        callback(true);
    });
    req.on('error', () => {
        callback(false);
    });
    req.setTimeout(1500, () => {
        req.destroy();
        callback(false);
    });
}

console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║       ✨ AIRDRAW PRO — MASTER LIVE SYNC SERVICE       ║');
console.log('╚═══════════════════════════════════════════════════════╝');

// 1. Check / start local server
isPortOpen(PORT, (isOpen) => {
    if (isOpen) {
        console.log(`[Service] ⚡ Local server already running on port ${PORT}`);
    } else {
        console.log(`[Service] 🚀 Starting local web server on port ${PORT}...`);
        const serverProc = spawn('npx', ['serve', '-l', String(PORT), '.'], {
            cwd: REPO_DIR,
            stdio: 'inherit'
        });
        serverProc.on('error', (err) => {
            console.error('[Service] Error starting serve:', err.message);
        });
    }

    // 2. Start Live Tunnel & Link Updater
    console.log('[Service] 🌐 Starting Cloudflare Live Tunnel & Link Engine...');
    const tunnelProc = spawn('node', [path.join(__dirname, 'live-tunnel.js')], {
        cwd: REPO_DIR,
        stdio: 'inherit'
    });

    // 3. Start GitHub Auto-Sync File Watcher
    console.log('[Service] 🔄 Starting GitHub Real-Time Auto-Sync Engine...');
    const syncProc = spawn('node', [path.join(REPO_DIR, 'auto-sync.js')], {
        cwd: REPO_DIR,
        stdio: 'inherit'
    });

    const cleanup = () => {
        console.log('\n[Service] Shutting down AirDraw live services...');
        try { tunnelProc.kill('SIGTERM'); } catch (e) {}
        try { syncProc.kill('SIGTERM'); } catch (e) {}
        process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
});
