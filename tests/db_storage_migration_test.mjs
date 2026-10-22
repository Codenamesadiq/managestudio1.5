/**
 * MANAGE STUDIO - DATABASE & STORAGE MIGRATION TEST SUITE
 * Tests PostgreSQL schema definitions, database adapter, transaction handling,
 * storage driver operations, and magic byte validation.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseAdapter } from '../server/dbAdapter.js';
import { 
  validateImageMagicBytes, 
  LocalStorageDriver, 
  S3StorageDriver, 
  ALLOWED_EXTENSIONS, 
  MAX_FILE_SIZE_BYTES 
} from '../server/storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName} ${details ? '- ' + details : ''}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('MANAGE STUDIO - DATABASE & STORAGE MIGRATION SUITE');
  console.log('======================================================\n');

  // 1. PostgreSQL Schema Validation
  console.log('--- 1. PostgreSQL Schema Migration Validation ---');
  const schemaPath = path.join(__dirname, '..', 'server', 'migrations', '001_initial_schema.sql');
  assert(fs.existsSync(schemaPath), 'Migration file 001_initial_schema.sql exists');

  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  const expectedTables = [
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

  for (const table of expectedTables) {
    assert(schemaContent.includes(`CREATE TABLE IF NOT EXISTS ${table}`), `Schema creates table [${table}]`);
  }

  assert(schemaContent.includes('idx_studios_owner_uid'), 'Index on studios(owner_uid) defined');
  assert(schemaContent.includes('idx_albums_client_token'), 'Unique index on albums(client_token) defined');
  assert(schemaContent.includes('idx_devices_user_device'), 'Index on device_activations(user_uid, device_id) defined');

  // 2. Database Adapter & Placeholder Translation
  console.log('\n--- 2. Database Adapter & Translation Tests ---');
  const adapter = new DatabaseAdapter();
  assert(adapter.getEngine() === 'sqlite', 'Default engine is SQLite in local dev');

  const translatedSql = adapter.translatePlaceholders('SELECT * FROM studios WHERE id = ? AND email = ?');
  assert(translatedSql === 'SELECT * FROM studios WHERE id = $1 AND email = $2', 'Placeholders properly translated from ? to $1, $2');

  const multiParamSql = adapter.translatePlaceholders('INSERT INTO test (a, b, c) VALUES (?, ?, ?)');
  assert(multiParamSql === 'INSERT INTO test (a, b, c) VALUES ($1, $2, $3)', 'Multiple placeholders sequentially numbered');

  // 3. Database Adapter CRUD & Transactions (SQLite mode)
  console.log('\n--- 3. Database Adapter CRUD & Transaction Tests ---');
  const testStudio = await adapter.get('SELECT * FROM studios LIMIT 1');
  assert(testStudio !== undefined && testStudio.id !== undefined, 'Adapter.get returns studio record');

  const allStudios = await adapter.all('SELECT * FROM studios');
  assert(Array.isArray(allStudios) && allStudios.length > 0, 'Adapter.all returns array of studios');

  // Transaction rollback test
  let rollbackCaught = false;
  try {
    await adapter.withTransaction(async (tx) => {
      tx.run('UPDATE studios SET storage_used_gb = 9999 WHERE id = ?', [testStudio.id]);
      throw new Error('Simulated transaction failure');
    });
  } catch (err) {
    rollbackCaught = true;
  }
  assert(rollbackCaught, 'Transaction error caught');

  const afterRollbackStudio = await adapter.get('SELECT storage_used_gb FROM studios WHERE id = ?', [testStudio.id]);
  assert(afterRollbackStudio.storage_used_gb !== 9999, 'Atomic transaction rolled back safely on error');

  // 4. Storage Driver & Magic Byte Validation
  console.log('\n--- 4. Storage Driver & Magic Byte Validation ---');
  
  // Valid JPEG header: FF D8 FF E0
  const validJpeg = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01]);
  assert(validateImageMagicBytes(validJpeg) === true, 'Valid JPEG magic bytes accepted');

  // Valid PNG header: 89 50 4E 47
  const validPng = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D]);
  assert(validateImageMagicBytes(validPng) === true, 'Valid PNG magic bytes accepted');

  // Valid WebP header: RIFF....WEBP
  const validWebP = Buffer.from('RIFF\x00\x00\x00\x00WEBPVP8 ', 'binary');
  assert(validateImageMagicBytes(validWebP) === true, 'Valid WebP magic bytes accepted');

  // Malicious executable disguised as image: MZ.... or <?php
  const fakeImage1 = Buffer.from('<?php echo "pwned"; ?>', 'utf8');
  assert(validateImageMagicBytes(fakeImage1) === false, 'PHP script disguised as image rejected by magic bytes');

  const fakeImage2 = Buffer.from('MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00', 'binary');
  assert(validateImageMagicBytes(fakeImage2) === false, 'Windows executable disguised as image rejected by magic bytes');

  // Storage Drivers
  const localDriver = new LocalStorageDriver();
  const testBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]);
  const saveResult = await localDriver.saveFile({ filename: 'test_photo.jpg', buffer: testBuffer });
  assert(saveResult.url.includes('/uploads/test_photo.jpg'), 'LocalStorageDriver saves and returns valid URL');

  const signedUrl = await localDriver.getSignedUrl('test_photo.jpg', 60);
  assert(signedUrl.includes('exp=') && signedUrl.includes('sig='), 'LocalStorageDriver generates signed URL');

  await localDriver.deleteFile('test_photo.jpg');

  const s3Driver = new S3StorageDriver({
    endpoint: 'https://test.r2.cloudflarestorage.com',
    bucket: 'test-bucket',
    publicUrl: 'https://cdn.managestudio.io'
  });
  const s3SignedUrl = await s3Driver.getSignedUrl('studios/sample.jpg', 3600);
  assert(s3SignedUrl.includes('https://cdn.managestudio.io/studios/sample.jpg') && s3SignedUrl.includes('sig='), 'S3StorageDriver generates S3 SigV4 signed URL');

  // Whitelist checks
  assert(ALLOWED_EXTENSIONS.includes('.jpg') && ALLOWED_EXTENSIONS.includes('.webp'), 'Allowed extensions include .jpg and .webp');
  assert(MAX_FILE_SIZE_BYTES === 52428800, 'Max file size configured to 50MB');

  console.log('\n======================================================');
  console.log(`DATABASE & STORAGE SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
