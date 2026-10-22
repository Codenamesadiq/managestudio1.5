/**
 * MANAGE STUDIO - DESKTOP SOFTWARE LICENSING INTEGRATION TEST
 * Tests multi-PC licensing, device activation limit (3 PCs), remote deactivation,
 * module gating, subscription expiration, and offline grace periods.
 */

import crypto from 'node:crypto';
import { db } from '../server/db.js';
import { ManageStudioDesktopLicenseClient, MemoryStorage } from '../desktop/licenseService.js';

const BASE_URL = 'http://localhost:3001';
const TEST_UID = 'usr_desktop_test_' + Date.now();
const TEST_EMAIL = `desktop_test_${Date.now()}@studio.io`;

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

function generateTestToken(uid, email) {
  return `mock_local_test_token:${uid}:${email}`;
}

async function runDesktopLicensingTests() {
  console.log('\n======================================================');
  console.log('MANAGE STUDIO - DESKTOP SOFTWARE LICENSING TEST SUITE');
  console.log('======================================================\n');

  const authToken = generateTestToken(TEST_UID, TEST_EMAIL);

  // Setup: Create Studio & Active Subscription for test user
  const studioId = `std_${Date.now()}`;
  const now = new Date().toISOString();
  const futureExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  db.prepare(`
    INSERT INTO studios (id, name, owner_name, email, owner_uid, storage_limit_gb, storage_used_gb, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(studioId, 'Golden Lens Studio', 'Shaik Sadiq', TEST_EMAIL, TEST_UID, 50, 12, now, now);

  const subId = `sub_${Date.now()}`;
  db.prepare(`
    INSERT INTO subscriptions (id, user_uid, studio_id, plan_name, modules_json, storage_quota_gb, status, current_period_start, current_period_end, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?)
  `).run(
    subId,
    TEST_UID,
    studioId,
    'Custom Studio Suite',
    JSON.stringify(['album_selection', 'gallery', 'camera_ingest']),
    50,
    now,
    futureExpiry,
    now,
    now
  );

  // 1. First PC Activation (PC-1: Main Editing Rig)
  console.log('--- 1. First PC Activation (PC-1) ---');
  const pc1Storage = new MemoryStorage();
  const pc1Client = new ManageStudioDesktopLicenseClient({
    baseUrl: BASE_URL,
    deviceId: 'PC1_EDITING_RIG_' + Date.now(),
    deviceName: 'Main Editing Rig (Win 11)',
    customStorage: pc1Storage
  });

  const pc1Result = await pc1Client.activateDevice(authToken);
  assert(pc1Result.success === true, 'PC-1 activation succeeds');
  assert(pc1Result.isLicensed === true, 'PC-1 is licensed');
  assert(pc1Result.activeDevicesCount === 1, 'Active devices count is 1');
  assert(pc1Result.subscription.modules.includes('album_selection'), 'PC-1 receives album_selection entitlement');

  // Verify PC-1 license check
  const pc1Verify = await pc1Client.verifyLicense(authToken);
  assert(pc1Verify.isLicensed === true, 'PC-1 verification returns isLicensed: true');

  // 2. Second PC Activation (PC-2: Field Laptop using same customer account)
  console.log('\n--- 2. Second PC Activation (PC-2: Same Account) ---');
  const pc2Storage = new MemoryStorage();
  const pc2Client = new ManageStudioDesktopLicenseClient({
    baseUrl: BASE_URL,
    deviceId: 'PC2_FIELD_LAPTOP_' + Date.now(),
    deviceName: 'Studio Field Laptop (Win 11)',
    customStorage: pc2Storage
  });

  const pc2Result = await pc2Client.activateDevice(authToken);
  assert(pc2Result.success === true, 'PC-2 activation succeeds with same customer account');
  assert(pc2Result.isLicensed === true, 'PC-2 is licensed');
  assert(pc2Result.activeDevicesCount === 2, 'Active devices count is now 2');

  // Verify both PCs remain active simultaneously
  const pc1Recheck = await pc1Client.verifyLicense(authToken);
  const pc2Recheck = await pc2Client.verifyLicense(authToken);
  assert(pc1Recheck.isLicensed === true && pc2Recheck.isLicensed === true, 'Both PC-1 and PC-2 are simultaneously active');

  // 3. Third PC Activation (PC-3: Reception Terminal)
  console.log('\n--- 3. Third PC Activation (PC-3) ---');
  const pc3Storage = new MemoryStorage();
  const pc3Client = new ManageStudioDesktopLicenseClient({
    baseUrl: BASE_URL,
    deviceId: 'PC3_RECEPTION_' + Date.now(),
    deviceName: 'Reception Desk Terminal',
    customStorage: pc3Storage
  });

  const pc3Result = await pc3Client.activateDevice(authToken);
  assert(pc3Result.success === true, 'PC-3 activation succeeds (3/3 slots filled)');
  assert(pc3Result.activeDevicesCount === 3, 'Active devices count is now 3');

  // 4. Fourth PC Rejection (PC-4: Exceeds 3-device limit)
  console.log('\n--- 4. Fourth PC Rejection (Exceeds Limit) ---');
  const pc4Storage = new MemoryStorage();
  const pc4Client = new ManageStudioDesktopLicenseClient({
    baseUrl: BASE_URL,
    deviceId: 'PC4_GUEST_PC_' + Date.now(),
    deviceName: 'Freelancer Retoucher PC',
    customStorage: pc4Storage
  });

  const pc4Result = await pc4Client.activateDevice(authToken);
  assert(pc4Result.success === false, 'PC-4 activation rejected');
  assert(pc4Result.deviceLimitReached === true, 'deviceLimitReached flag is true');
  assert(pc4Result.activeDevices.length === 3, 'Returns list of 3 currently active devices for customer management');

  // 5. Remote Deactivation of PC-1 & Reallocation to PC-4
  console.log('\n--- 5. Deactivate PC-1 and Activate PC-4 ---');
  const deactRes = await pc4Client.deactivateDevice(authToken, pc1Client.deviceId);
  assert(deactRes.success === true, 'PC-1 successfully deactivated remotely');

  // Now PC-4 activates successfully
  const pc4Retry = await pc4Client.activateDevice(authToken);
  assert(pc4Retry.success === true, 'PC-4 successfully activated after slot freed');
  assert(pc4Retry.isLicensed === true, 'PC-4 is now licensed');

  // Confirm PC-1 is no longer licensed
  const pc1RevokedCheck = await pc1Client.verifyLicense(authToken);
  assert(pc1RevokedCheck.isLicensed === false, 'PC-1 verification now returns isLicensed: false');
  assert(pc1RevokedCheck.reason === 'DEVICE_NOT_ACTIVATED', 'Reason is DEVICE_NOT_ACTIVATED');

  // 6. Module Entitlement Gating Check
  console.log('\n--- 6. Module Entitlement Gating ---');
  assert(pc4Client.isModuleEntitled('gallery', pc4Retry.subscription.modules) === true, 'Gallery is entitled (always included)');
  assert(pc4Client.isModuleEntitled('camera_ingest', pc4Retry.subscription.modules) === true, 'Camera Ingest is entitled');
  assert(pc4Client.isModuleEntitled('album_selection', pc4Retry.subscription.modules) === true, 'Album Selection is entitled (purchased)');
  assert(pc4Client.isModuleEntitled('song_selection', pc4Retry.subscription.modules) === false, 'Song Selection is gated (not purchased)');
  assert(pc4Client.isModuleEntitled('guest_photo_ai', pc4Retry.subscription.modules) === false, 'Guest Photo AI is gated (not purchased)');

  // 7. Subscription Expiration Handling
  console.log('\n--- 7. Subscription Expiration / Cancellation ---');
  const pastDate = new Date(Date.now() - 1000).toISOString();
  db.prepare("UPDATE subscriptions SET status = 'expired', current_period_end = ? WHERE id = ?").run(pastDate, subId);

  const expiredVerify = await pc4Client.verifyLicense(authToken);
  assert(expiredVerify.isLicensed === false, 'Expired subscription revokes desktop license');
  assert(expiredVerify.reason === 'NO_ACTIVE_SUBSCRIPTION', 'Reason is NO_ACTIVE_SUBSCRIPTION');

  // Restore subscription for offline test
  db.prepare("UPDATE subscriptions SET status = 'active', current_period_end = ? WHERE id = ?").run(futureExpiry, subId);

  // 8. Offline Grace Period Tests
  console.log('\n--- 8. Offline Grace Period Handling ---');
  const offlineStorage = new MemoryStorage();
  const offlineClient = new ManageStudioDesktopLicenseClient({
    baseUrl: 'http://localhost:9999', // Non-existent offline host
    deviceId: 'PC_OFFLINE_' + Date.now(),
    customStorage: offlineStorage
  });

  // Test: No cache -> fails safely
  const noCacheRes = await offlineClient.activateDevice(authToken);
  assert(noCacheRes.isLicensed === false && noCacheRes.reason === 'OFFLINE_NO_CACHE', 'Offline without cache fails with OFFLINE_NO_CACHE');

  // Seed valid cache within 72h
  offlineStorage.setItem(offlineClient.cacheKey, JSON.stringify({
    isLicensed: true,
    lastVerifiedAt: Date.now() - 3600 * 1000, // 1 hour ago
    subscription: {
      modules: ['album_selection', 'gallery'],
      storageQuotaGb: 50,
      expiresAt: futureExpiry
    }
  }));

  const validGraceRes = await offlineClient.verifyLicense(authToken);
  assert(validGraceRes.isLicensed === true, 'Recent cached license validates offline within 72h grace period');
  assert(validGraceRes.offlineMode === true, 'offlineMode flag is set to true');

  // Seed expired cache (older than 72 hours)
  offlineStorage.setItem(offlineClient.cacheKey, JSON.stringify({
    isLicensed: true,
    lastVerifiedAt: Date.now() - (73 * 3600 * 1000), // 73 hours ago
    subscription: {
      modules: ['album_selection', 'gallery'],
      storageQuotaGb: 50,
      expiresAt: futureExpiry
    }
  }));

  const expiredGraceRes = await offlineClient.verifyLicense(authToken);
  assert(expiredGraceRes.isLicensed === false, 'Offline cache older than 72 hours is rejected');
  assert(expiredGraceRes.reason === 'GRACE_PERIOD_EXPIRED', 'Reason is GRACE_PERIOD_EXPIRED');

  // Cleanup test user
  db.prepare('DELETE FROM device_activations WHERE user_uid = ?').run(TEST_UID);
  db.prepare('DELETE FROM subscriptions WHERE user_uid = ?').run(TEST_UID);
  db.prepare('DELETE FROM studios WHERE owner_uid = ?').run(TEST_UID);

  console.log('\n======================================================');
  console.log(`DESKTOP LICENSING SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runDesktopLicensingTests().catch(err => {
  console.error('Desktop test execution error:', err);
  process.exit(1);
});
