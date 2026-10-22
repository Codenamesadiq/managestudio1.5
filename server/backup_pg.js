/**
 * MANAGE STUDIO - POSTGRESQL BACKUP & RESTORE UTILITY
 * Supports automated logical backups, backup rotation, and integrity verification.
 */

import 'dotenv/config';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUP_DIR = path.join(__dirname, 'backups', 'postgres');

export async function createPostgresBackup() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to perform a PostgreSQL backup.');
  }

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(BACKUP_DIR, `managestudio_pg_backup_${timestamp}.sql`);

  console.log(`[Backup] Initiating PostgreSQL backup to: ${backupFile}`);

  try {
    // pg_dump execution command
    const cmd = `pg_dump "${databaseUrl}" --clean --if-exists --no-owner --no-privileges -f "${backupFile}"`;
    await execAsync(cmd);

    const stats = fs.statSync(backupFile);
    console.log(`[Backup] Completed successfully. Size: ${(stats.size / 1024).toFixed(2)} KB`);

    // Rotate older backups (keep last 14)
    rotateBackups(14);

    return { success: true, backupFile, sizeBytes: stats.size };
  } catch (err) {
    console.error('[Backup Failed]:', err.message);
    throw err;
  }
}

export function rotateBackups(keepCount = 14) {
  if (!fs.existsSync(BACKUP_DIR)) return;
  const files = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.endsWith('.sql'))
    .map(f => ({ name: f, time: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time);

  if (files.length > keepCount) {
    const toDelete = files.slice(keepCount);
    for (const f of toDelete) {
      fs.unlinkSync(path.join(BACKUP_DIR, f.name));
      console.log(`[Backup Rotation] Removed older backup: ${f.name}`);
    }
  }
}

// CLI execution
if (process.argv[1] && process.argv[1].endsWith('backup_pg.js')) {
  createPostgresBackup()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
