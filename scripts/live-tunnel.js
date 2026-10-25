/**
 * AirDraw Pro — Real-Time Live Public Tunnel & Link Sync Engine
 * Spawns Cloudflare Quick Tunnel, extracts live HTTPS URL,
 * updates PUBLIC_LINK.txt, Desktop links, and README.md,
 * and automatically commits and pushes all updated links to GitHub.
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const http = require('http');

const REPO_DIR = path.resolve(__dirname, '..');
const PORT = 3000;
const LOCAL_SERVER_URL = `http://127.0.0.1:${PORT}`;

let tunnelProc = null;
let currentTunnelUrl = null;
let isRestarting = false;

// Get local network IP address
function getLocalIp() {
    try {
        const en0 = execSync('ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null', { encoding: 'utf8' }).trim();
        if (en0) return en0;
    } catch (e) {}
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

const LOCAL_IP = getLocalIp();

function updateAllLinks(liveUrl) {
    console.log('\n=============================================================');
    console.log(' ✨ AIRDRAW PRO — LIVE GLOBAL HTTPS LINK ESTABLISHED');
    console.log('=============================================================');
    console.log(` 🌍 LIVE PUBLIC HTTPS : ${liveUrl}`);
    console.log(` 📱 LOCAL WI-FI (LAN) : http://${LOCAL_IP}:${PORT}`);
    console.log(` 💻 LOCAL MACHINE     : ${LOCAL_SERVER_URL}`);
    console.log(` 📦 GITHUB REPO       : https://github.com/nikithpadmanabhuni/air-draw`);
    console.log(` 🚀 GITHUB PAGES      : https://nikithpadmanabhuni.github.io/air-draw/`);
    console.log('=============================================================\n');

    // 1. Write project root PUBLIC_LINK.txt
    try {
        fs.writeFileSync(path.join(REPO_DIR, 'PUBLIC_LINK.txt'), liveUrl + '\n', 'utf8');
    } catch (e) {
        console.error('[Tunnel Link] Error writing PUBLIC_LINK.txt:', e.message);
    }

    // 2. Format detailed instructions for mobile & desktop
    const phoneNotice = `========================================================================
 ✨ AIRDRAW PRO — LIVE ACCESS LINKS FOR MOBILE & DESKTOP
========================================================================

🌍 GLOBAL PUBLIC HTTPS LINK (iPhone, Android, Tablets, PC worldwide):
${liveUrl}

📱 LOCAL WI-FI LINK (Devices on the same local network):
http://${LOCAL_IP}:${PORT}

💻 LOCAL COMPUTER:
http://localhost:${PORT}

📦 GITHUB REPOSITORY:
https://github.com/nikithpadmanabhuni/air-draw

🚀 GITHUB PAGES:
https://nikithpadmanabhuni.github.io/air-draw/

------------------------------------------------------------------------
📸 Camera & Drawing Notes:
- Modern web browsers require HTTPS for camera access (getUserMedia).
- The Global Public HTTPS link works directly on iOS Safari, Android Chrome,
  Mac, Windows, and Linux with full webcam permissions and single-finger drawing!
========================================================================
`;

    // 3. Write project root AIRDRAW_PUBLIC_PHONE_LINK.txt
    try {
        fs.writeFileSync(path.join(REPO_DIR, 'AIRDRAW_PUBLIC_PHONE_LINK.txt'), phoneNotice, 'utf8');
    } catch (e) {
        console.error('[Tunnel Link] Error writing AIRDRAW_PUBLIC_PHONE_LINK.txt:', e.message);
    }

    // 4. Save to ~/Desktop/AIRDRAW_PUBLIC_PHONE_LINK.txt
    try {
        const desktopPath = path.join(os.homedir(), 'Desktop', 'AIRDRAW_PUBLIC_PHONE_LINK.txt');
        fs.writeFileSync(desktopPath, phoneNotice, 'utf8');
        console.log(`[Tunnel Link] 📁 Saved desktop shortcut: ${desktopPath}`);
    } catch (e) {
        // ignore if desktop unavailable
    }

    // 5. Update README.md with the live link
    try {
        const readmePath = path.join(REPO_DIR, 'README.md');
        if (fs.existsSync(readmePath)) {
            let readme = fs.readFileSync(readmePath, 'utf8');
            let updatedReadme = readme;

            // Replace existing trycloudflare link if present
            if (/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/.test(readme)) {
                updatedReadme = readme.replace(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/g, liveUrl);
            }

            if (updatedReadme !== readme) {
                fs.writeFileSync(readmePath, updatedReadme, 'utf8');
                console.log('[Tunnel Link] 📝 Updated README.md with live tunnel URL');
            }
        }
    } catch (e) {
        console.error('[Tunnel Link] Error updating README.md:', e.message);
    }

    // 6. Automatically trigger GitHub Auto-Sync to push new links to GitHub
    try {
        const { syncToGitHub } = require('../auto-sync.js');
        console.log('[Tunnel Link] 🔄 Triggering GitHub auto-sync for newly established links...');
        syncToGitHub();
    } catch (e) {
        console.error('[Tunnel Link] Error triggering auto-sync:', e.message);
    }
}

function startTunnel() {
    console.log(`[Tunnel Link] 🔌 Launching Cloudflare Tunnel for ${LOCAL_SERVER_URL}...`);

    tunnelProc = spawn('cloudflared', ['tunnel', '--url', LOCAL_SERVER_URL], {
        cwd: REPO_DIR,
        stdio: ['ignore', 'pipe', 'pipe']
    });

    const handleOutput = (data) => {
        const text = data.toString();
        const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
        if (match && match[0] !== currentTunnelUrl) {
            currentTunnelUrl = match[0];
            updateAllLinks(currentTunnelUrl);
        }
    };

    tunnelProc.stdout.on('data', handleOutput);
    tunnelProc.stderr.on('data', handleOutput);

    tunnelProc.on('close', (code) => {
        console.warn(`[Tunnel Link] ⚠️ Cloudflare tunnel exited with code ${code}`);
        currentTunnelUrl = null;
        if (!isRestarting) {
            console.log('[Tunnel Link] ⏳ Restarting tunnel in 5 seconds...');
            setTimeout(startTunnel, 5000);
        }
    });

    tunnelProc.on('error', (err) => {
        console.error('[Tunnel Link] ❌ Tunnel process error:', err.message);
    });
}

// Watchdog: verify tunnel health every 12 seconds
setInterval(() => {
    if (!currentTunnelUrl) return;

    https.get(currentTunnelUrl, { timeout: 6000 }, (res) => {
        // Tunnel responding
    }).on('error', (err) => {
        console.warn(`[Tunnel Watchdog] ⚠️ Tunnel check failed (${err.message}), verifying process...`);
    });
}, 12000);

// Graceful cleanup
function cleanup() {
    isRestarting = true;
    if (tunnelProc) {
        try {
            tunnelProc.kill('SIGTERM');
        } catch (e) {}
    }
    process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start
startTunnel();
