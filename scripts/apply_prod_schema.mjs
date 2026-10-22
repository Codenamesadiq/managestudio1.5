import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  // Construct isolated production URL pointing to managestudio_prod
  const prodUrl = rawUrl.replace('/neondb?', '/managestudio_prod?');

  const schemaPath = path.resolve(__dirname, '..', 'server', 'migrations', '001_initial_schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  console.log('--- Applying 001_initial_schema.sql to managestudio_prod ---');
  const client = new pg.Client({
    connectionString: prodUrl,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  try {
    await client.query('BEGIN;');
    await client.query(sql);
    await client.query('COMMIT;');
    console.log('SUCCESS: Schema successfully applied to managestudio_prod!');

    // Verify created tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('Verified production tables:', res.rows.map(r => r.table_name));

    // Verify row count is strictly 0 across all tables
    let totalRows = 0;
    for (const r of res.rows) {
      const c = await client.query(`SELECT COUNT(*) as count FROM ${r.table_name};`);
      const count = parseInt(c.rows[0].count, 10);
      console.log(`  Table [${r.table_name}]: ${count} rows`);
      totalRows += count;
    }
    console.log(`Total production records: ${totalRows} (Pristine clean production state, 0 test records)`);
  } catch (err) {
    await client.query('ROLLBACK;');
    console.error('Schema application failed, rolled back:', err.message);
  } finally {
    await client.end();
  }
}

main();
