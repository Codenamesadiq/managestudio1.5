import crypto from 'node:crypto';
import https from 'node:https';
import Razorpay from 'razorpay';
import { db } from './db.js';
import { calculatePlanSummary } from './pricingConfig.js';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';
const SAAS_BACKEND_URL = process.env.SAAS_BACKEND_URL || 'https://studio-manager-saas.onrender.com';

let razorpayClient = null;
if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
  try {
    razorpayClient = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    });
    console.log('[Razorpay] Initialized with Key ID:', RAZORPAY_KEY_ID.slice(0, 8) + '...');
  } catch (err) {
    console.error('[Razorpay] Initialization error:', err.message);
  }
} else {
  console.log('[Razorpay] Running in Test/Sandbox Mode (live credentials not set in environment).');
}

/**
 * Creates an authoritative Razorpay order
 */
export async function createSubscriptionOrder({ user, studioId, modules, storageId, userToken, couponCode }) {
  if (!user || !user.uid) {
    throw new Error('Authenticated user required.');
  }

  // Authoritative server-side price & storage calculation with coupon validation
  const planSummary = calculatePlanSummary(modules, storageId, couponCode);
  if (!planSummary.isValid) {
    throw new Error('Please select at least one valid paid module.');
  }

  const amountPaise = planSummary.amountInPaise;
  const originalAmountPaise = planSummary.originalAmountInPaise || planSummary.subtotalPaise;
  const discountPaise = planSummary.discountPaise || 0;
  const appliedCouponCode = planSummary.couponCode || null;

  const now = new Date().toISOString();
  let orderId = '';
  let keyId = RAZORPAY_KEY_ID || 'rzp_test_placeholder';

  // 1. Try Razorpay SDK if live/test keys are provided in .env
  if (razorpayClient) {
    try {
      const rzpOrder = await razorpayClient.orders.create({
        amount: amountPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}_${user.uid.slice(0, 6)}`,
        notes: {
          userUid: user.uid,
          userEmail: user.email,
          studioId: studioId || '',
          modules: planSummary.validModuleIds.join(','),
          storageGb: String(planSummary.totalStorageGb),
          couponCode: appliedCouponCode || '',
          discountPaise: String(discountPaise)
        }
      });
      orderId = rzpOrder.id;
    } catch (rzpErr) {
      console.warn('[Razorpay] Direct SDK order error:', rzpErr.message);
    }
  }

  // 2. If no SDK client or SDK failed, attempt SaaS backend proxy with user token if available
  if (!orderId && userToken) {
    try {
      const saasRes = await fetch(`${SAAS_BACKEND_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          modules: planSummary.validModuleIds,
          selectedModules: planSummary.validModuleIds,
          storageGb: planSummary.totalStorageGb,
          selectedStorageGb: planSummary.totalStorageGb,
          studioId: studioId || '',
          couponCode: appliedCouponCode
        })
      });

      if (saasRes.ok) {
        const saasData = await saasRes.json();
        orderId = saasData.orderId || saasData.id || saasData.order?.id;
        if (saasData.keyId) keyId = saasData.keyId;
      }
    } catch (saasErr) {
      console.warn('[Razorpay] SaaS fallback creation error:', saasErr.message);
    }
  }

  // 3. Fallback to deterministic Test Sandbox Order ID if credentials are being configured (development only)
  if (!orderId) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Payment gateway order initialization failed. Live order creation error.');
    }
    const testHash = crypto.randomBytes(8).toString('hex');
    orderId = `order_test_${Date.now()}_${testHash}`;
  }

  // Store in database with status CREATED and coupon tracking
  db.prepare(`
    INSERT INTO subscription_orders (
      id, order_id, user_uid, studio_id, amount_paise, currency, 
      modules_json, storage_gb, status, coupon_code, discount_paise, original_amount_paise,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'CREATED', ?, ?, ?, ?, ?)
  `).run(
    `ord_rec_${Date.now()}`,
    orderId,
    user.uid,
    studioId || '',
    amountPaise,
    'INR',
    JSON.stringify(planSummary.validModuleIds),
    planSummary.totalStorageGb,
    appliedCouponCode,
    discountPaise,
    originalAmountPaise,
    now,
    now
  );

  // Log audit event
  db.prepare(`
    INSERT INTO payment_audit_logs (id, order_id, event_type, details_json, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    `audit_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    orderId,
    'ORDER_CREATED',
    JSON.stringify({
      userUid: user.uid,
      amountPaise,
      originalAmountPaise,
      discountPaise,
      couponCode: appliedCouponCode,
      modules: planSummary.validModuleIds,
      storageGb: planSummary.totalStorageGb
    }),
    now
  );

  return {
    success: true,
    orderId,
    keyId,
    amount: amountPaise,
    currency: 'INR',
    planSummary
  };
}

/**
 * Verifies Razorpay payment signature and activates subscription idempotently
 */
export async function verifySubscriptionPayment({
  user,
  orderId,
  paymentId,
  signature,
  studioId,
  modules,
  storageGb,
  userToken
}) {
  if (!orderId || !paymentId) {
    throw new Error('Order ID and Payment ID are required.');
  }

  const existingOrder = db.prepare('SELECT * FROM subscription_orders WHERE order_id = ?').get(orderId);
  if (!existingOrder) {
    throw new Error('Order record not found in system.');
  }

  // CRITICAL SECURITY: Verify order belongs to the authenticated user
  if (existingOrder.user_uid !== user.uid) {
    db.prepare(`
      INSERT INTO payment_audit_logs (id, order_id, payment_id, event_type, details_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      `audit_${Date.now()}_tamper`,
      orderId,
      paymentId,
      'CROSS_TENANT_TAMPER_ATTEMPT',
      JSON.stringify({ orderUser: existingOrder.user_uid, attemptingUser: user.uid }),
      new Date().toISOString()
    );
    throw new Error('Unauthorized: Order does not belong to the authenticated user.');
  }

  // IDEMPOTENCY CHECK: If already verified, return successful entitlement without re-processing
  if (existingOrder.status === 'VERIFIED') {
    const existingSub = db.prepare("SELECT * FROM subscriptions WHERE user_uid = ? AND status = 'active'").get(user.uid);
    return {
      success: true,
      alreadyVerified: true,
      message: 'Payment has already been safely verified and activated.',
      orderId,
      paymentId,
      subscription: existingSub ? {
        ...existingSub,
        modules: JSON.parse(existingSub.modules_json || '[]')
      } : null
    };
  }

  // SIGNATURE VERIFICATION
  let isSignatureValid = false;

  if (RAZORPAY_KEY_SECRET && signature) {
    const expected = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    try {
      isSignatureValid = crypto.timingSafeEqual(
        Buffer.from(signature, 'utf8'),
        Buffer.from(expected, 'utf8')
      );
    } catch {
      isSignatureValid = false;
    }

    if (!isSignatureValid) {
      db.prepare(`
        INSERT INTO payment_audit_logs (id, order_id, payment_id, event_type, details_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        `audit_${Date.now()}_err`,
        orderId,
        paymentId,
        'SIGNATURE_FAILED',
        JSON.stringify({ provided: signature }),
        new Date().toISOString()
      );
      throw new Error('Invalid Razorpay payment signature.');
    }
  } else {
    // In Test Sandbox Mode without secret configured:
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Payment signature verification configuration error in live mode.');
    }
    isSignatureValid = true;
  }

  // Fallback verification with SaaS backend if configured
  if (userToken) {
    try {
      await fetch(`${SAAS_BACKEND_URL}/api/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          orderId,
          razorpay_order_id: orderId,
          paymentId,
          razorpay_payment_id: paymentId,
          signature: signature || '',
          razorpay_signature: signature || '',
          studioId: studioId || existingOrder.studio_id,
          modules: modules || JSON.parse(existingOrder.modules_json || '[]'),
          storageGb: storageGb ?? existingOrder.storage_gb
        })
      });
    } catch (saasVerifyErr) {
      console.warn('[Payments] SaaS backend sync notice:', saasVerifyErr.message);
    }
  }

  const now = new Date().toISOString();
  const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const effectiveModules = modules || JSON.parse(existingOrder.modules_json || '[]');
  const effectiveStorage = storageGb ?? existingOrder.storage_gb;

  // 1. Mark order as VERIFIED in database
  db.prepare(`
    UPDATE subscription_orders 
    SET status = 'VERIFIED', payment_id = ?, razorpay_signature = ?, updated_at = ?
    WHERE order_id = ?
  `).run(
    paymentId,
    signature || 'test_verified',
    now,
    orderId
  );

  // 2. Mark any previously active subscription as superseded
  db.prepare(`
    UPDATE subscriptions 
    SET status = 'superseded', updated_at = ?
    WHERE user_uid = ? AND status = 'active'
  `).run(now, user.uid);

  // Upsert customer subscription record
  const subId = `sub_${Date.now()}_${user.uid.slice(0, 6)}`;
  db.prepare(`
    INSERT INTO subscriptions (
      id, user_uid, studio_id, plan_name, modules_json, storage_quota_gb,
      status, current_period_start, current_period_end, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?)
  `).run(
    subId,
    user.uid,
    studioId || existingOrder.studio_id || '',
    'Custom Studio Suite',
    JSON.stringify(effectiveModules),
    effectiveStorage,
    now,
    periodEnd,
    now,
    now
  );

  // 3. Record successful audit event
  db.prepare(`
    INSERT INTO payment_audit_logs (id, order_id, payment_id, event_type, details_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    `audit_${Date.now()}_success`,
    orderId,
    paymentId,
    'PAYMENT_VERIFIED',
    JSON.stringify({
      userUid: user.uid,
      amountPaise: existingOrder.amount_paise,
      modules: effectiveModules,
      storageGb: effectiveStorage
    }),
    now
  );

  return {
    success: true,
    orderId,
    paymentId,
    subscription: {
      id: subId,
      status: 'active',
      planName: 'Custom Studio Suite',
      modules: effectiveModules,
      storageQuotaGb: effectiveStorage,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd
    }
  };
}

/**
 * Validates Razorpay Webhook signature against raw body buffer
 */
export function verifyWebhookSignature(rawBodyBuffer, signature, secretOverride = null) {
  const secret = secretOverride || RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET is missing in production mode. Strictly rejecting webhook.');
      return false;
    }
    console.warn('[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET not set; signature verification skipped.');
    return true;
  }

  if (!signature || !rawBodyBuffer) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBodyBuffer)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(expected, 'utf8')
    );
  } catch {
    return false;
  }
}
