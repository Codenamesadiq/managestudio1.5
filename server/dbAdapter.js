/**
 * MANAGE STUDIO - DATABASE ADAPTER
 * Supports both PostgreSQL (Staging / Production with connection pooling)
 * and SQLite (Local development / testing fallback).
 */

import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DatabaseAdapter {
  constructor(options = {}) {
    this.connectionString = options.connectionString || process.env.DATABASE_URL;
    this.engine = this.connectionString ? 'postgres' : 'sqlite';
    this.sqliteDb = null;
    this.pgPool = null;

    if (this.engine === 'postgres') {
      const isProduction = process.env.NODE_ENV === 'production';
      const sslConfig = process.env.PGSSLMODE === 'disable' ? false : {
        rejectUnauthorized: process.env.PG_REJECT_UNAUTHORIZED === 'true'
      };

      this.pgPool = new Pool({
        connectionString: this.connectionString,
        max: parseInt(process.env.DB_POOL_MAX || '20', 10),
        idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS || '30000', 10),
        connectionTimeoutMillis: parseInt(process.env.DB_CONN_TIMEOUT_MS || '5000', 10),
        ssl: sslConfig
      });

      this.pgPool.on('error', (err) => {
        console.error('[DB Pool Error]: Unexpected error on idle client', err);
      });
    } else {
      const dataDir = path.join(__dirname, 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const dbPath = options.dbPath || path.join(dataDir, 'studio_select.db');
      this.sqliteDb = new DatabaseSync(dbPath);

      try {
        this.sqliteDb.exec('PRAGMA journal_mode = WAL;');
        this.sqliteDb.exec('PRAGMA synchronous = NORMAL;');
        this.sqliteDb.exec('PRAGMA busy_timeout = 5000;');
      } catch (err) {
        console.warn('[DB] SQLite PRAGMA initialization warning:', err.message);
      }
    }
  }

  getEngine() {
    return this.engine;
  }

  /**
   * Translates standard '?' placeholders to PostgreSQL '$1, $2, ...' placeholders
   */
  translatePlaceholders(sql) {
    let index = 1;
    return sql.replace(/\?/g, () => `$${index++}`);
  }

  /**
   * Executes a query returning all rows
   */
  async all(sql, params = []) {
    if (this.engine === 'postgres') {
      const pgSql = this.translatePlaceholders(sql);
      const res = await this.pgPool.query(pgSql, params);
      return res.rows;
    } else {
      const stmt = this.sqliteDb.prepare(sql);
      return stmt.all(...params);
    }
  }

  /**
   * Executes a query returning the first row or undefined
   */
  async get(sql, params = []) {
    if (this.engine === 'postgres') {
      const pgSql = this.translatePlaceholders(sql);
      const res = await this.pgPool.query(pgSql, params);
      return res.rows[0] || undefined;
    } else {
      const stmt = this.sqliteDb.prepare(sql);
      return stmt.get(...params);
    }
  }

  /**
   * Executes a query modifying data, returning changes
   */
  async run(sql, params = []) {
    if (this.engine === 'postgres') {
      const pgSql = this.translatePlaceholders(sql);
      const res = await this.pgPool.query(pgSql, params);
      return { changes: res.rowCount, rowCount: res.rowCount };
    } else {
      const stmt = this.sqliteDb.prepare(sql);
      return stmt.run(...params);
    }
  }

  /**
   * Executes multiple statements without parameter substitution
   */
  async exec(sql) {
    if (this.engine === 'postgres') {
      return await this.pgPool.query(sql);
    } else {
      return this.sqliteDb.exec(sql);
    }
  }

  /**
   * Compatibility wrapper for synchronous-like db.prepare(sql).get/all/run
   * In SQLite mode, works fully synchronously for zero legacy disruption.
   * In Postgres mode, returns promises.
   */
  prepare(sql) {
    if (this.engine === 'sqlite') {
      return this.sqliteDb.prepare(sql);
    }

    const self = this;
    return {
      get(...params) {
        return self.get(sql, params);
      },
      all(...params) {
        return self.all(sql, params);
      },
      run(...params) {
        return self.run(sql, params);
      }
    };
  }

  /**
   * Executes a block within an atomic transaction
   */
  async withTransaction(fn) {
    if (this.engine === 'postgres') {
      const client = await this.pgPool.connect();
      try {
        await client.query('BEGIN');
        const txDb = {
          async query(sql, params = []) {
            const pgSql = self.translatePlaceholders(sql);
            return (await client.query(pgSql, params)).rows;
          },
          async get(sql, params = []) {
            const pgSql = self.translatePlaceholders(sql);
            const res = await client.query(pgSql, params);
            return res.rows[0] || undefined;
          },
          async run(sql, params = []) {
            const pgSql = self.translatePlaceholders(sql);
            const res = await client.query(pgSql, params);
            return { changes: res.rowCount };
          }
        };
        const result = await fn(txDb);
        await client.query('COMMIT');
        return result;
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } else {
      this.sqliteDb.exec('BEGIN IMMEDIATE;');
      try {
        const result = await fn(this);
        this.sqliteDb.exec('COMMIT;');
        return result;
      } catch (err) {
        this.sqliteDb.exec('ROLLBACK;');
        throw err;
      }
    }
  }

  async close() {
    if (this.pgPool) {
      await this.pgPool.end();
    }
  }
}

export default DatabaseAdapter;
