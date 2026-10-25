/**
 * AirDraw Pro — GitHub Real-Time Auto-Sync Engine
 * Automatically detects file changes, stages them, creates descriptive commits,
 * and pushes directly to GitHub (origin main).
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEBOUNCE_DELAY_MS = 3000; // Wait 3s after last file change before pushing
const REPO_DIR = __dirname;

let debounceTimer = null;
let isSyncing = false;
let pendingChanges = new Set();

const IGNORED_PATTERNS = [
    /^\.git/,
    /node_modules/,
    /\.DS_Store/,
    /\.tmp$/,
    /~$/,
    /\.swp$/,
    /auto-sync\.log$/,
    /\.env($|\.)/i,
    /\.(key|pem|pkcs12|pfx|p12|cert|crt|token|secret)$/i,
    /id_rsa/i,
    /id_ed25519/i,
    /credentials\.json$/i,
    /client_secret.*\.json$/i,
    /user-data\.json$/i,
    /cloudflare\.(log|pid)$/
];

const SECRET_PATTERNS = [
    /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP |)PRIVATE KEY-----/,
    /AKIA[0-9A-Z]{16}/,
    /gh[pousr]_[0-9a-zA-Z]{36}/,
    /sk-[a-zA-Z0-9]{20,}/,
    /AIza[0-9A-Za-z\-_]{35}/,
    /xox[baprs]-[0-9a-zA-Z]{10,}/,
    /(?:password|passwd|secret|api_key|apikey)\s*[:=]\s*['"][^'"]{8,}['"]/i
];

function isIgnored(filepath) {
    if (!filepath) return true;
    const normalized = filepath.replace(/\\/g, '/');
    return IGNORED_PATTERNS.some(pattern => pattern.test(normalized));
}

function containsSecret(filepath) {
    try {
        const fullPath = path.resolve(REPO_DIR, filepath);
        if (!fs.existsSync(fullPath)) return false;
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() || stat.size > 2 * 1024 * 1024) return false; // skip huge files
        const content = fs.readFileSync(fullPath, 'utf8');
        return SECRET_PATTERNS.some(regex => regex.test(content));
    } catch (e) {
        return false;
    }
}

function runGit(cmd) {
    return execSync(cmd, { cwd: REPO_DIR, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

function syncToGitHub() {
    if (isSyncing) {
        console.log('[Auto-Sync] ⏳ Sync already in progress, queuing next check...');
        debounceTimer = setTimeout(syncToGitHub, DEBOUNCE_DELAY_MS);
        return;
    }

    isSyncing = true;

    try {
        // 1. Check if git working directory has modifications
        const status = runGit('git status --porcelain');
        if (!status) {
            console.log('[Auto-Sync] ℹ️ No pending changes detected.');
            isSyncing = false;
            pendingChanges.clear();
            return;
        }

        // 2. Identify changed files
        const changedLines = status.split('\n').filter(Boolean);
        const changedFiles = changedLines.map(l => l.replace(/^..\s+/, '').trim());

        // Pre-commit security scan
        for (const file of changedFiles) {
            if (isIgnored(file)) {
                console.warn(`[Auto-Sync] ⚠️ Skipping ignored/sensitive file: ${file}`);
                continue;
            }
            if (containsSecret(file)) {
                console.error(`[Auto-Sync] 🚨 SECURITY ALERT: Potential secret or credential pattern detected in ${file}! Sync aborted.`);
                isSyncing = false;
                pendingChanges.clear();
                return;
            }
        }

        const summary = changedFiles.slice(0, 3).join(', ') + (changedFiles.length > 3 ? ` (+${changedFiles.length - 3} more)` : '');

        const timestamp = new Date().toLocaleString();
        const commitMsg = `auto-sync: update ${summary} (${timestamp})`;

        console.log(`[Auto-Sync] 🔄 Changes detected in: ${summary}`);
        console.log(`[Auto-Sync] 📦 Staging and committing...`);

        // 3. Stage & Commit
        runGit('git add -A');
        runGit(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);

        // 4. Push to remote
        console.log(`[Auto-Sync] 🚀 Pushing to GitHub (origin main)...`);
        const pushResult = runGit('git push origin main');

        console.log(`[Auto-Sync] ✅ Successfully synced to GitHub at ${timestamp}!`);
        if (pushResult) console.log(`[Auto-Sync] Output: ${pushResult}`);

        pendingChanges.clear();
    } catch (err) {
        console.error('[Auto-Sync] ❌ Sync error:', err.stderr ? err.stderr.toString() : err.message);
    } finally {
        isSyncing = false;
    }
}

function onFileEvent(eventType, filename) {
    if (isIgnored(filename)) return;

    pendingChanges.add(filename);
    console.log(`[Auto-Sync] 📝 Detected ${eventType} in ${filename}`);

    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
        syncToGitHub();
    }, DEBOUNCE_DELAY_MS);
}

// Start watching repository directory
console.log('====================================================');
console.log(' ✨ AirDraw Pro — GitHub Auto-Sync Active');
console.log(` 📂 Watching workspace: ${REPO_DIR}`);
console.log(` 🎯 Remote: https://github.com/nikithpadmanabhuni/air-draw.git`);
console.log(` ⏱️ Debounce interval: ${DEBOUNCE_DELAY_MS}ms`);
console.log('====================================================');

// Perform initial check on launch
syncToGitHub();

try {
    fs.watch(REPO_DIR, { recursive: true }, onFileEvent);
} catch (watchErr) {
    console.warn('[Auto-Sync] Warning: fs.watch recursive failed, falling back to interval check:', watchErr.message);
    setInterval(syncToGitHub, 10000);
}

// Keep process alive
process.stdin.resume();
