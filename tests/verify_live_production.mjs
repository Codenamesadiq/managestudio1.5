const FIREBASE_API_KEY = 'AIzaSyB_vjq-m_QYOwBJ0zx5kdggcpjvgPhai4I';

async function runLiveVerification() {
  console.log('======================================================');
  console.log('MANAGESTUDIO — PRODUCTION LIVE VERIFICATION AUDIT');
  console.log('Target: https://managestudio.io / https://app.managestudio.io');
  console.log('======================================================\n');

  // 1. Homepage & App Response
  console.log('1. Checking Live Website and App endpoints...');
  const homeRes = await fetch('https://managestudio.io/', { method: 'GET' });
  console.log(`  ✓ Homepage Status: ${homeRes.status} ${homeRes.statusText}`);
  if (homeRes.status !== 200) throw new Error(`Homepage returned status ${homeRes.status}`);

  const appRes = await fetch('https://app.managestudio.io/', { method: 'GET' });
  console.log(`  ✓ App Portal Status: ${appRes.status} ${appRes.statusText}`);
  if (appRes.status !== 200) throw new Error(`App portal returned status ${appRes.status}`);

  // 2. Health & Status API Check (Ensure JSON, not HTML)
  console.log('\n2. Checking Production API Status (/api/health)...');
  const healthRes = await fetch('https://managestudio.io/api/health', { method: 'GET' });
  console.log(`  ✓ Health Status: ${healthRes.status} ${healthRes.statusText}`);
  const healthContentType = healthRes.headers.get('content-type') || '';
  console.log(`  ✓ Health Content-Type: ${healthContentType}`);
  if (!healthContentType.includes('application/json')) {
    throw new Error(`Expected JSON from /api/health, got: ${healthContentType}`);
  }
  const healthData = await healthRes.json();
  console.log(`  ✓ Health Response: ${JSON.stringify(healthData)}`);

  // 3. Customer Signup & Authentication on Live System
  console.log('\n3. Provisioning temporary test customer for checkout audit...');
  const testEmail = `prod_audit_${Date.now()}@managestudio.test`;
  const testPassword = 'Password123!Secure';
  
  const signUpRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword, returnSecureToken: true })
  });
  const signUpData = await signUpRes.json();
  if (!signUpData.idToken) throw new Error(`Signup failed: ${JSON.stringify(signUpData)}`);
  const token = signUpData.idToken;
  const uid = signUpData.localId;
  console.log(`  ✓ Test Customer Provisioned: ${uid}`);

  try {
    // 4. Regression Case: Album (499) + Song (499) + Guest AI (699) + 50GB storage (299) = ₹1,996 with TEST99 (99%) -> ₹19.96 (1,996 paise)
    console.log('\n4. Testing Regression Order Creation with Coupon TEST99...');
    const orderPayload = {
      modules: ['album-selection', 'song-selection', 'guest-photo-ai'],
      storageId: '50gb',
      selectedStorageId: '50gb',
      couponCode: 'TEST99',
      studioId: `std_${uid.slice(0, 8)}`
    };

    const orderRes = await fetch('https://managestudio.io/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderPayload)
    });

    console.log(`  ✓ Order HTTP Status: ${orderRes.status}`);
    const orderContentType = orderRes.headers.get('content-type') || '';
    console.log(`  ✓ Order Content-Type: ${orderContentType}`);
    if (!orderContentType.includes('application/json')) {
      const text = await orderRes.text();
      throw new Error(`Expected JSON response, got: ${text.slice(0, 200)}`);
    }

    const orderData = await orderRes.json();
    if (!orderData.success || !orderData.orderId) {
      throw new Error(`Order creation failed: ${JSON.stringify(orderData)}`);
    }
    console.log(`  ✓ Order ID Assigned: ${orderData.orderId}`);
    console.log(`  ✓ Calculated Amount (Paise): ${orderData.amount} (₹${orderData.amount / 100})`);
    console.log(`  ✓ Currency: ${orderData.currency}`);

    // Verify exact expected paise: 1996 paise
    if (orderData.amount !== 1996) {
      throw new Error(`PRICING REGRESSION MISMATCH: Expected 1996 paise (₹19.96), got ${orderData.amount} paise (₹${orderData.amount / 100})`);
    }
    console.log('  ✓ PERFECT MATCH: Razorpay order is exactly 1,996 paise (₹19.96)');

    // 5. Test Invalid Coupon Code Rejection
    console.log('\n5. Testing Invalid Coupon Rejection (HTTP 400 JSON)...');
    const invalidCouponPayload = {
      modules: ['album-selection'],
      storageId: null,
      couponCode: 'INVALID_BOGUS_COUPON_99',
      studioId: `std_${uid.slice(0, 8)}`
    };

    const invalidRes = await fetch('https://managestudio.io/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(invalidCouponPayload)
    });

    console.log(`  ✓ Invalid Coupon HTTP Status: ${invalidRes.status}`);
    const invalidData = await invalidRes.json();
    console.log(`  ✓ Rejection JSON: ${JSON.stringify(invalidData)}`);
    if (invalidRes.status !== 400 || !invalidData.error) {
      throw new Error(`Expected HTTP 400 with error JSON, got ${invalidRes.status}`);
    }
    console.log('  ✓ Invalid coupon code successfully rejected with HTTP 400 JSON error.');

    // 6. Test Payment Verification Flow
    console.log('\n6. Testing Payment Verification Flow...');
    const verifyPayload = {
      orderId: orderData.orderId,
      razorpay_order_id: orderData.orderId,
      paymentId: `pay_test_${Date.now()}`,
      razorpay_payment_id: `pay_test_${Date.now()}`,
      signature: 'test_sandbox_signature',
      razorpay_signature: 'test_sandbox_signature',
      studioId: `std_${uid.slice(0, 8)}`,
      modules: ['album-selection', 'song-selection', 'guest-photo-ai'],
      storageGb: 65
    };

    const verifyRes = await fetch('https://managestudio.io/api/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(verifyPayload)
    });

    console.log(`  ✓ Verification HTTP Status: ${verifyRes.status}`);
    const verifyData = await verifyRes.json();
    console.log(`  ✓ Verification Response: ${JSON.stringify(verifyData)}`);
    if (!verifyData.success) {
      throw new Error(`Payment verification failed: ${JSON.stringify(verifyData)}`);
    }
    console.log('  ✓ Payment verification succeeded.');

  } finally {
    // 7. Cleanup Test Account
    console.log('\n7. Cleaning up temporary test customer...');
    await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token })
    });
    console.log('  ✓ Temporary test customer account deleted.');
  }

  console.log('\n======================================================');
  console.log('ALL LIVE PRODUCTION CHECKS COMPLETED SUCCESSFULLY');
  console.log('======================================================');
}

runLiveVerification().catch(err => {
  console.error('\n✗ Live Verification Error:', err.message);
  process.exit(1);
});
