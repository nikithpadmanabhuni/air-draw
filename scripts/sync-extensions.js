#!/usr/bin/env node
/**
 * AirDraw Pro — Cross-Antigravity Extension Bridge
 * Keeps ~/.antigravity/extensions and ~/.antigravity-ide/extensions in two-way sync.
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME;
const IDE_EXT_DIR = path.join(HOME, '.antigravity-ide', 'extensions');
const APP_EXT_DIR = path.join(HOME, '.antigravity', 'extensions');

function syncInstance(sourceDir, targetDir, sourceName, targetName) {
    if (!fs.existsSync(sourceDir) || !fs.existsSync(targetDir)) return;

    const sourceJsonPath = path.join(sourceDir, 'extensions.json');
    const targetJsonPath = path.join(targetDir, 'extensions.json');

    if (!fs.existsSync(sourceJsonPath)) return;

    const sourceList = JSON.parse(fs.readFileSync(sourceJsonPath, 'utf8'));
    let targetList = [];
    try {
        targetList = JSON.parse(fs.readFileSync(targetJsonPath, 'utf8'));
    } catch (e) {
        targetList = [];
    }

    const targetMap = new Map();
    targetList.forEach(ext => {
        if (ext.identifier && ext.identifier.id) {
            targetMap.set(ext.identifier.id.toLowerCase(), ext);
        }
    });

    let syncCount = 0;
    for (const ext of sourceList) {
        const id = ext.identifier.id.toLowerCase();
        const sourceFolder = path.join(sourceDir, ext.relativeLocation);
        const targetFolder = path.join(targetDir, ext.relativeLocation);

        if (!fs.existsSync(targetFolder) && fs.existsSync(sourceFolder)) {
            try {
                fs.symlinkSync(sourceFolder, targetFolder);
                console.log(`[Linker] 🔗 Linked ${ext.identifier.id} (${ext.version}) into ${targetName}`);
                syncCount++;
            } catch (err) {
                console.error(`[Linker] ❌ Could not link ${ext.relativeLocation}:`, err.message);
            }
        }

        const cloned = JSON.parse(JSON.stringify(ext));
        if (cloned.location) {
            cloned.location.path = targetFolder;
            if (cloned.location.fsPath) cloned.location.fsPath = targetFolder;
            if (cloned.location.external) cloned.location.external = 'file://' + targetFolder;
        }

        if (!targetMap.has(id)) {
            targetMap.set(id, cloned);
        }
    }

    fs.writeFileSync(targetJsonPath, JSON.stringify(Array.from(targetMap.values()), null, 2), 'utf8');
    return syncCount;
}

console.log('====================================================');
console.log(' 🔄 Antigravity Cross-Instance Extension Bridge');
console.log('====================================================');

const synced1 = syncInstance(IDE_EXT_DIR, APP_EXT_DIR, 'Antigravity IDE', 'Antigravity');
const synced2 = syncInstance(APP_EXT_DIR, IDE_EXT_DIR, 'Antigravity', 'Antigravity IDE');

console.log(`\n✅ Synchronization complete. Both Antigravity instances now share all extensions.`);
