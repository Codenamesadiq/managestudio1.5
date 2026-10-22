/**
 * MANAGE STUDIO - END-TO-END INTEGRATION TEST
 * Executes complete customer journey against running server on http://localhost:3001
 */

import crypto from 'node:crypto';
import { db } from '../server/db.js';

const BASE_URL = 'http://localhost:3001';
const RAZORPAY_SECRET = 'testSecret_ManageStudio_2026_Secure';
const WEBHOOK_SECRET = 'whsec_test_ManageStudio_2026';
const FIREBASE_API_KEY = 'AIzaSyB_vjq-m_QYOwBJ0zx5kdggcpjvgPhai4I';

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

async function runE2ETests() {
  console.log('\n======================================================');
  console.log('MANAGE STUDIO - END-TO-END LOCAL INTEGRATION TEST');
  console.log('Target: ' + BASE_URL);
  console.log('======================================================\n');

  // 1. Root & Static Serving Check
  console.log('--- 1. Web Server & Static Serving Check ---');
  const rootRes = await fetch(`${BASE_URL}/`);
  assert(rootRes.status === 200, 'Root URL returns HTTP 200');
  const rootHtml = await rootRes.text();
  assert(rootHtml.includes('<!doctype html>') || rootHtml.includes('<html'), 'Root serves HTML application');
  assert(rootHtml.includes('assets/'), 'Root HTML links to production assets');

  // 2. Dashboard Stats
  console.log('\n--- 2. Dashboard Stats API Check ---');
  const statsRes = await fetch(`${BASE_URL}/api/dashboard/stats`);
  assert(statsRes.status === 200, 'Dashboard stats API returns HTTP 200');
  const statsData = await statsRes.json();
  assert(statsData.studio !== undefined, 'Studio profile returned in stats');

  // 3. Security: Unauthorized Access Prevention
  console.log('\n--- 3. Unauthorized Access Rejection ---');
  const unauthSub = await fetch(`${BASE_URL}/api/subscription/status`);
  assert(unauthSub.status === 401, 'Protected /api/subscription/status rejects request without token (HTTP 401)');

  const unauthOrder = await fetch(`${BASE_URL}/api/payments/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ modules: ['album-selection'] })
  });
  assert(unauthOrder.status === 401, 'Protected /api/payments/create-order rejects request without token (HTTP 401)');

  // 4. Firebase Auth Integration (Sign Up, Sign In, Password Reset)
  console.log('\n--- 4. Firebase Authentication Integration ---');
  const testEmail = `test_studio_${Date.now()}@example.com`;
  const testPassword = 'Password123!Secure';
  let userToken = null;
  let userUid = null;

  try {
    // 4.1 Test Sign Up via Firebase REST API
    const signUpRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        returnSecureToken: true
      })
    });
    const signUpData = await signUpRes.json();
    if (signUpRes.ok && signUpData.idToken) {
      userToken = signUpData.idToken;
      userUid = signUpData.localId;
      assert(true, 'Sign Up with email & password succeeded in Firebase Auth');
    } else {
      assert(false, 'Sign Up succeeded in Firebase Auth', signUpData.error?.message);
    }

    // 4.2 Test Password Reset / Recovery Request
    const resetRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestType: 'PASSWORD_RESET',
        email: testEmail
      })
    });
    const resetData = await resetRes.json();
    assert(resetRes.ok && resetData.email === testEmail, 'Password reset email dispatch accepted by Firebase');

    // 4.3 Test Email Verification Request
    if (userToken) {
      const verifyEmailRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'VERIFY_EMAIL',
          idToken: userToken
        })
      });
      const verifyEmailData = await verifyEmailRes.json();
      assert(verifyEmailRes.ok && verifyEmailData.email === testEmail, 'Email verification dispatch accepted by Firebase');
    }

    // 4.4 Test Sign In with Password
    const signInRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        returnSecureToken: true
      })
    });
    const signInData = await signInRes.json();
    assert(signInRes.ok && signInData.idToken, 'Login with email & password succeeded in Firebase Auth');

    // 4.5 Test Sign In with Invalid Password (Rejected)
    const badLoginRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'WrongPassword999!',
        returnSecureToken: true
      })
    });
    assert(badLoginRes.status === 400, 'Invalid credentials strictly rejected (HTTP 400 INVALID_PASSWORD)');

  } catch (authErr) {
    console.warn('Firebase network check notice:', authErr.message);
  }

  // If live network token was obtained, use it; otherwise use mock token for offline test
  if (!userToken) {
    console.log('  [Note] Using simulated token for local test sandbox.');
    userToken = 'mock_local_test_token';
    userUid = `local_user_${Date.now()}`;
  }

  // 5. Razorpay Order Creation via Server
  console.log('\n--- 5. Razorpay Order Creation via Server ---');
  let createdOrderId = null;
  const orderRes = await fetch(`${BASE_URL}/api/payments/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      modules: ['album-selection', 'guest-photo-ai'], // 499 + 699 = 1198
      selectedStorageId: '200gb', // 599
      studioId: `std_${userUid.slice(0, 8)}`
    })
  });

  const orderData = await orderRes.json();
  assert(orderRes.status === 200 && orderData.success === true, 'Order created successfully on backend');
  assert(orderData.amount === 179700, 'Authoritative price calculated: ₹1,198 (modules) + ₹599 (200GB) = ₹1,797 (179700 paise)');
  assert(orderData.currency === 'INR', 'Currency is INR');
  assert(orderData.orderId !== undefined && orderData.orderId.length > 5, 'Valid Order ID assigned');
  createdOrderId = orderData.orderId;

  // 6. Test Failed / Cancelled Checkout
  console.log('\n--- 6. Cancelled / Unverified Order State ---');
  const checkInitialOrder = db.prepare('SELECT * FROM subscription_orders WHERE order_id = ?').get(createdOrderId);
  assert(checkInitialOrder.status === 'CREATED', 'Order remains in CREATED state when payment is not yet verified');

  // Verify that unverified order has NOT granted active subscription
  const unverifiedSub = db.prepare("SELECT * FROM subscriptions WHERE user_uid = ? AND status = 'active'").get(userUid);
  assert(unverifiedSub === undefined, 'No subscription granted before verified payment');

  // 7. Test Payment Verification with Invalid / Tampered Signature
  console.log('\n--- 7. Payment Verification with Tampered Signature ---');
  const fakePaymentId = `pay_fake_${Date.now()}`;
  const tamperedSig = 'deadbeef_invalid_signature_1234567890abcdef1234567890abcdef12345678';

  const badVerifyRes = await fetch(`${BASE_URL}/api/payments/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      orderId: createdOrderId,
      paymentId: fakePaymentId,
      signature: tamperedSig,
      studioId: `std_${userUid.slice(0, 8)}`,
      modules: ['album-selection', 'guest-photo-ai'],
      storageGb: 210
    })
  });

  assert(badVerifyRes.status === 400, 'Tampered signature rejected with HTTP 400');
  const badVerifyData = await badVerifyRes.json();
  assert(badVerifyData.error !== undefined, 'Clear error message returned for invalid signature');

  // 8. Test Successful Payment Verification (Valid HMAC Signature)
  console.log('\n--- 8. Successful Payment Verification (HMAC-SHA256) ---');
  const validPaymentId = `pay_valid_${Date.now()}`;
  const validSig = crypto
    .createHmac('sha256', RAZORPAY_SECRET)
    .update(`${createdOrderId}|${validPaymentId}`)
    .digest('hex');

  const goodVerifyRes = await fetch(`${BASE_URL}/api/payments/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      orderId: createdOrderId,
      paymentId: validPaymentId,
      signature: validSig,
      studioId: `std_${userUid.slice(0, 8)}`,
      modules: ['album-selection', 'guest-photo-ai'],
      storageGb: 210
    })
  });

  assert(goodVerifyRes.status === 200, 'Payment verified successfully with HTTP 200');
  const goodVerifyData = await goodVerifyRes.json();
  assert(goodVerifyData.success === true, 'Verification returns success: true');
  assert(goodVerifyData.subscription !== undefined, 'Subscription object returned in verification response');

  // Check Database Order Status
  const verifiedOrder = db.prepare('SELECT * FROM subscription_orders WHERE order_id = ?').get(createdOrderId);
  assert(verifiedOrder.status === 'VERIFIED', 'Database order status transitioned to VERIFIED');
  assert(verifiedOrder.payment_id === validPaymentId, 'Payment ID linked to order');

  // 9. Verify Customer Subscription & Storage Quota
  console.log('\n--- 9. Customer Subscription & Storage Quota Verification ---');
  const activeSub = db.prepare("SELECT * FROM subscriptions WHERE user_uid = ? AND status = 'active'").get(userUid);
  assert(activeSub !== undefined, 'Active subscription record created in SQLite');
  assert(activeSub.storage_quota_gb === 210, 'Storage quota reflects base 10GB + 200GB addon = 210GB', `Got ${activeSub.storage_quota_gb}`);
  assert(JSON.parse(activeSub.modules_json).length === 2, '2 active paid modules assigned');

  // Query authenticated status endpoint
  const statusRes = await fetch(`${BASE_URL}/api/subscription/status`, {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  assert(statusRes.status === 200, 'Subscription status endpoint returns HTTP 200 for customer');
  const statusData = await statusRes.json();
  assert(statusData.subscription?.status === 'active', 'Customer sees active subscription status');
  assert(statusData.subscription?.storageQuotaGb === 210, 'Customer sees 210GB storage allowance');
  assert(statusData.recentOrders?.length >= 1, 'Customer sees order in recent billing history');

  // 10. Test Duplicate Payment Replay (Idempotency)
  console.log('\n--- 10. Duplicate Payment Replay (Idempotency) ---');
  const replayRes = await fetch(`${BASE_URL}/api/payments/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      orderId: createdOrderId,
      paymentId: validPaymentId,
      signature: validSig,
      studioId: `std_${userUid.slice(0, 8)}`,
      modules: ['album-selection', 'guest-photo-ai'],
      storageGb: 210
    })
  });

  assert(replayRes.status === 200, 'Replay request succeeds cleanly without error');
  const replayData = await replayRes.json();
  assert(replayData.alreadyVerified === true, 'Idempotency detected: alreadyVerified flag set');

  const countActive = db.prepare("SELECT COUNT(*) as count FROM subscriptions WHERE user_uid = ? AND status = 'active'").get(userUid).count;
  assert(countActive === 1, 'Strictly 1 active subscription maintained; no duplicate rows created');

  // 11. Test Webhook Delivery
  console.log('\n--- 11. Webhook Signature & Event Processing ---');
  const webhookPayload = JSON.stringify({
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: validPaymentId,
          order_id: createdOrderId,
          amount: 179700,
          status: 'captured'
        }
      }
    }
  });

  const validWebhookSig = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(Buffer.from(webhookPayload, 'utf8'))
    .digest('hex');

  const hookRes = await fetch(`${BASE_URL}/api/payments/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Razorpay-Signature': validWebhookSig
    },
    body: webhookPayload
  });
  assert(hookRes.status === 200, 'Webhook accepted with valid signature (HTTP 200)');
  const hookData = await hookRes.json();
  assert(hookData.received === true, 'Webhook returns received: true');

  // Tampered Webhook
  const badHookRes = await fetch(`${BASE_URL}/api/payments/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Razorpay-Signature': 'invalid_webhook_sig_xyz'
    },
    body: webhookPayload
  });
  assert(badHookRes.status === 400, 'Webhook with forged signature rejected (HTTP 400)');

  // 12. Test Subscription Cancellation
  console.log('\n--- 12. Subscription Cancellation Flow ---');
  const cancelRes = await fetch(`${BASE_URL}/api/subscription/cancel`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  assert(cancelRes.status === 200, 'Cancellation request returns HTTP 200');

  const cancelledSub = db.prepare('SELECT * FROM subscriptions WHERE user_uid = ?').get(userUid);
  assert(cancelledSub.status === 'cancelled', 'Subscription status marked as cancelled in database');
  assert(cancelledSub.storage_quota_gb === 210, 'Quota preserved during cancellation period');

  // 13. Discount Coupon Checkout Flow
  console.log('\n--- 13. Discount Coupon Checkout Flow ---');
  const couponOrderRes = await fetch(`${BASE_URL}/api/payments/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      modules: ['album-selection'], // ₹499
      couponCode: 'TEST10' // 10% off -> ₹449.10 = 44910 paise
    })
  });
  assert(couponOrderRes.status === 200, 'Order with TEST10 coupon created successfully');
  const couponOrderData = await couponOrderRes.json();
  assert(couponOrderData.amount === 44910, 'Server calculated discounted amount of 44910 paise');
  assert(couponOrderData.planSummary?.couponCode === 'TEST10', 'Plan summary reflects applied TEST10 coupon');

  // 14. Multi-Device Desktop Licensing Flow
  console.log('\n--- 14. Multi-Device Desktop Licensing Flow ---');
  const licSubId = `sub_e2e_lic_${Date.now()}`;
  const now = new Date().toISOString();
  const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  db.prepare(`
    INSERT INTO subscriptions (id, user_uid, studio_id, plan_name, modules_json, storage_quota_gb, status, current_period_start, current_period_end, created_at, updated_at)
    VALUES (?, ?, 'std_test', 'Custom Studio Suite', '["album-selection"]', 15, 'active', ?, ?, ?, ?)
  `).run(licSubId, userUid, now, periodEnd, now, now);

  const testDeviceId = `dev_${crypto.randomBytes(6).toString('hex')}`;
  const activateRes = await fetch(`${BASE_URL}/api/license/activate-device`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      deviceId: testDeviceId,
      deviceName: 'Studio Primary Workstation',
      osInfo: 'Windows 11 Pro'
    })
  });
  assert(activateRes.status === 200, 'Desktop activation endpoint returns HTTP 200');
  const activateData = await activateRes.json();
  assert(activateData.isLicensed === true, 'Desktop activation returns isLicensed: true');
  assert(activateData.maxDevices === 3, 'Policy confirms max 3 simultaneous devices');

  // Verify license endpoint
  const verifyLicRes = await fetch(`${BASE_URL}/api/license/verify?deviceId=${testDeviceId}`, {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  assert(verifyLicRes.status === 200, 'License verify endpoint returns HTTP 200');
  const verifyLicData = await verifyLicRes.json();
  assert(verifyLicData.isLicensed === true, 'Device license verified successfully');

  // List devices endpoint
  const listDevRes = await fetch(`${BASE_URL}/api/license/devices`, {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  assert(listDevRes.status === 200, 'List devices endpoint returns HTTP 200');
  const listDevData = await listDevRes.json();
  assert(Array.isArray(listDevData.devices) && listDevData.devices.length >= 1, 'Customer can see list of active devices');

  // Deactivate device
  const deactRes = await fetch(`${BASE_URL}/api/license/deactivate-device`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({ deviceId: testDeviceId })
  });
  assert(deactRes.status === 200, 'Device deactivation returns HTTP 200');

  // 15. Public Client Portal Verification
  console.log('\n--- 15. Public Client Portal Link Verification ---');
  const e2eAlbId = `alb_portal_e2e_${Date.now()}`;
  const e2eToken = `sel_e2e_${crypto.randomBytes(6).toString('hex')}`;
  db.prepare(`
    INSERT INTO albums (id, studio_id, name, client_name, cover_photo_url, client_token, status, created_at, updated_at)
    VALUES (?, 'std_test', 'Karan & Pooja Reception', 'Karan & Pooja', 'cover.jpg', ?, 'WAITING', ?, ?)
  `).run(e2eAlbId, e2eToken, now, now);

  const portalRes = await fetch(`${BASE_URL}/api/portal/${e2eToken}`);
  assert(portalRes.status === 200, 'Public client selection portal accessible without login (HTTP 200)');
  const portalData = await portalRes.json();
  assert(portalData.album?.id === e2eAlbId, 'Correct client selection album returned');

  // Summary
  console.log('\n======================================================');
  console.log(`E2E TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) process.exit(1);
}

runE2ETests().catch((err) => {
  console.error('Fatal E2E error:', err);
  process.exit(1);
});
