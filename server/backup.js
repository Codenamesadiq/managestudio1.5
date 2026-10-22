/**
 * ManageStudio SQLite Database Backup Utility
 * Phase 8: Database Persistence, Concurrency & Safe Snapshots
 * 
 * Uses SQLite's native `VACUUM INTO` statement via Node.js built-in `node:sqlite`.
 * Creates an exact, transactionally consistent, vacuumed snapshot of the database
 * without interrupting active transactions, readers, or writers.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUPS_DIR = path.join(__dirname, 'storage', 'backups');

export async function createDatabaseBackup(customDestination = null) {
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFileName = `managestudio_backup_${timestamp}.db`;
  const backupPath = customDestination || path.join(BACKUPS_DIR, backupFileName);

  console.log(`[Backup] Starting atomic SQLite snapshot to: ${backupPath}`);
  
  const startTime = Date.now();

  // If backup destination exists, remove first so VACUUM INTO can write cleanly
  if (fs.existsSync(backupPath)) {
    fs.unlinkSync(backupPath);
  }
  
  // Use SQLite's native VACUUM INTO for online, zero-downtime atomic backup
  // Forward slashes for SQL string literal compatibility
  const normalizedPath = backupPath.replace(/\\/g, '/');
  db.exec(`VACUUM INTO '${normalizedPath}'`);

  const durationMs = Date.now() - startTime;
  const stats = fs.statSync(backupPath);
  const sizeKb = (stats.size / 1024).toFixed(2);

  console.log(`[Backup] Snapshot complete in ${durationMs}ms (${sizeKb} KB)`);

  // Verify backup integrity with read-only connection
  const verifyDb = new DatabaseSync(backupPath, { readOnly: true });
  const integrity = verifyDb.prepare('PRAGMA integrity_check').get();
  verifyDb.close();

  if (integrity.integrity_check !== 'ok') {
    throw new Error(`Backup failed integrity check: ${JSON.stringify(integrity)}`);
  }

  console.log('[Backup] Integrity verified: OK');

  return {
    success: true,
    backupPath,
    fileName: backupFileName,
    sizeBytes: stats.size,
    sizeKb,
    durationMs,
    integrity: 'ok',
    timestamp
  };
}

export function pruneOldBackups(maxToKeep = 10) {
  if (!fs.existsSync(BACKUPS_DIR)) return [];

  const files = fs.readdirSync(BACKUPS_DIR)
    .filter(f => f.startsWith('managestudio_backup_') && f.endsWith('.db'))
    .map(f => {
      const fullPath = path.join(BACKUPS_DIR, f);
      return {
        fileName: f,
        fullPath,
        mtime: fs.statSync(fullPath).mtimeMs
      };
    })
    .sort((a, b) => b.mtime - a.mtime); // Newest first

  const removed = [];
  if (files.length > maxToKeep) {
    const toDelete = files.slice(maxToKeep);
    toDelete.forEach(f => {
      try {
        fs.unlinkSync(f.fullPath);
        removed.push(f.fileName);
      } catch (err) {
        console.warn(`[Backup] Failed to remove old backup ${f.fileName}:`, err.message);
      }
    });
  }

  return removed;
}

// CLI direct execution
if (process.argv[1] && (process.argv[1].endsWith('server\\backup.js') || process.argv[1].endsWith('server/backup.js'))) {
  createDatabaseBackup()
    .then(result => {
      console.log('Result:', result);
      const pruned = pruneOldBackups(7);
      if (pruned.length > 0) {
        console.log(`Pruned ${pruned.length} older backups.`);
      }
      process.exit(0);
    })
    .catch(err => {
      console.error('Backup error:', err);
      process.exit(1);
    });
}
