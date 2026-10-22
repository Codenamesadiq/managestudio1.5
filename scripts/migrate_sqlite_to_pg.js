/**
 * MANAGE STUDIO - SQLITE TO POSTGRESQL MIGRATION SCRIPT
 * Safely transfers all studio accounts, albums, photos, subscriptions,
 * orders, device activations, and client proofing links into PostgreSQL.
 *
 * Usage:
 *   node scripts/migrate_sqlite_to_pg.js
 * Requires:
 *   DATABASE_URL or TARGET_DATABASE_URL environment variable pointing to PostgreSQL.
 */

import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import pg from 'pg';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SQLITE_PATH = path.join(__dirname, '..', 'server', 'data', 'studio_select.db');
const SCHEMA_FILE = path.join(__dirname, '..', 'server', 'migrations', '001_initial_schema.sql');

export async function runMigration(options = {}) {
  const targetUrl = options.targetUrl || process.env.TARGET_DATABASE_URL || process.env.DATABASE_URL;
  const sqliteFile = options.sqliteFile || SQLITE_PATH;

  console.log('\n======================================================');
  console.log('MANAGE STUDIO — SQLITE TO POSTGRESQL SAFE MIGRATION');
  console.log('======================================================\n');

  if (!targetUrl) {
    throw new Error('Target PostgreSQL connection URL is missing. Set DATABASE_URL or pass targetUrl.');
  }

  if (!fs.existsSync(sqliteFile)) {
    throw new Error(`Source SQLite database not found at ${sqliteFile}`);
  }

  console.log(`[Source] SQLite: ${sqliteFile}`);
  console.log(`[Target] PostgreSQL: ${targetUrl.replace(/:[^:@]+@/, ':***@')}`);

  const sqlite = new DatabaseSync(sqliteFile);
  const pool = new Pool({
    connectionString: targetUrl,
    connectionTimeoutMillis: 5000,
    ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false }
  });

  const client = await pool.connect();

  try {
    console.log('\n[1/4] Applying PostgreSQL DDL Schema...');
    const schemaSql = fs.readFileSync(SCHEMA_FILE, 'utf8');
    await client.query(schemaSql);
    console.log('  ✓ PostgreSQL schema & indices verified.');

    console.log('\n[2/4] Beginning atomic migration transaction...');
    await client.query('BEGIN');

    const tables = [
      'studios',
      'contact_messages',
      'albums',
      'photos',
      'activity_logs',
      'subscription_orders',
      'subscriptions',
      'payment_audit_logs',
      'device_activations'
    ];

    const migrationSummary = {};

    for (const table of tables) {
      console.log(`\n  Migrating table: [${table}]...`);
      const rows = sqlite.prepare(`SELECT * FROM ${table}`).all();
      let insertedCount = 0;

      if (rows.length === 0) {
        console.log(`    - Table is empty in SQLite (0 rows). Skipping.`);
        migrationSummary[table] = { source: 0, target: 0, status: 'EMPTY_MATCH' };
        continue;
      }

      const columns = Object.keys(rows[0]);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      const colList = columns.join(', ');

      const insertSql = `
        INSERT INTO ${table} (${colList})
        VALUES (${placeholders})
        ON CONFLICT (id) DO UPDATE SET
          ${columns.filter(c => c !== 'id').map(c => `${c} = EXCLUDED.${c}`).join(', ')}
      `;

      for (const row of rows) {
        const values = columns.map(col => {
          let val = row[col];
          // Handle numeric or date types safely if needed
          return val;
        });
        await client.query(insertSql, values);
        insertedCount++;
      }

      // Verify row count in Postgres
      const checkRes = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
      const pgCount = parseInt(checkRes.rows[0].count, 10);

      console.log(`    ✓ Migrated ${insertedCount}/${rows.length} rows. (PostgreSQL total: ${pgCount})`);
      migrationSummary[table] = {
        source: rows.length,
        target: pgCount,
        status: pgCount >= rows.length ? 'VERIFIED' : 'MISMATCH'
      };

      if (pgCount < rows.length) {
        throw new Error(`Integrity mismatch on table ${table}: SQLite has ${rows.length} rows, PostgreSQL has ${pgCount}`);
      }
    }

    console.log('\n[3/4] Committing PostgreSQL migration transaction...');
    await client.query('COMMIT');
    console.log('  ✓ Transaction successfully committed.');

    console.log('\n[4/4] Final Verification Report:');
    console.table(migrationSummary);

    return { success: true, summary: migrationSummary };
  } catch (err) {
    console.error('\n[MIGRATION FAILED] Rolling back PostgreSQL transaction...', err);
    try {
      await client.query('ROLLBACK');
    } catch (_) {}
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

// Direct execution from CLI
if (process.argv[1] && process.argv[1].endsWith('migrate_sqlite_to_pg.js')) {
  runMigration()
    .then(() => {
      console.log('\n✓ Migration completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('\n✗ Migration failed:', err.message);
      process.exit(1);
    });
}
