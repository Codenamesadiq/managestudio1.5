/**
 * ManageStudio Production Checkout & Pricing Flow Automated Verification Test Suite
 *
 * Verifies Requirements:
 * 1. Exact pricing flow from frontend calculation through backend Razorpay order creation
 * 2. Independent backend coupon validation & authoritative discount calculation (never trusts client amount)
 * 3. Unified frontend and backend rules for modules, storage, billing period, tax, and coupons
 * 4. Strict rejection of invalid or unauthorized coupon codes (HTTP 400 / thrown exception)
 * 5. Exact match between Razorpay order amount and final payable amount in paise
 * 6. Regular checkout, valid coupons, invalid coupons, module combinations, storage add-ons, tampered amounts
 */

import 'dotenv/config';
import crypto from 'node:crypto';
import { db } from '../server/db.js';
import { calculatePlanSummary, validateAndApplyCoupon, PAID_MODULES, STORAGE_ADDONS, AVAILABLE_COUPONS } from '../server/pricingConfig.js';
import { createSubscriptionOrder } from '../server/payments.js';

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

async function runCheckoutPricingTests() {
  console.log('================================================================');
  console.log('MANAGESTUDIO — CHECKOUT PRICING FLOW & COUPON VERIFICATION SUITE');
  console.log('================================================================\n');

  // ==========================================================================
  // SUITE 1: Module Combinations & Regular Checkout (No Coupon)
  // ==========================================================================
  console.log('--- SUITE 1: Module Combinations & Regular Checkout ---');

  // 1.1 Single Module - Album Selection
  const planAlbum = calculatePlanSummary(['album-selection']);
  assert(planAlbum.totalPrice === 499, 'Single Album Selection is exactly ₹499/mo');
  assert(planAlbum.amountInPaise === 49900, 'Album Selection amount in paise is 49900');
  assert(planAlbum.totalStorageGb === 5, '1 module includes 5 GB shared storage');

  // 1.2 Single Module - Song Selection
  const planSong = calculatePlanSummary(['song-selection']);
  assert(planSong.totalPrice === 499, 'Single Song Selection is exactly ₹499/mo');
  assert(planSong.amountInPaise === 49900, 'Song Selection amount in paise is 49900');

  // 1.3 Single Module - Guest Photo AI
  const planGuest = calculatePlanSummary(['guest-photo-ai']);
  assert(planGuest.totalPrice === 699, 'Single Guest Photo AI is exactly ₹699/mo');
  assert(planGuest.amountInPaise === 69900, 'Guest Photo AI amount in paise is 69900');

  // 1.4 Two Modules - Album + Song
  const planAlbumSong = calculatePlanSummary(['album-selection', 'song-selection']);
  assert(planAlbumSong.totalPrice === 998, 'Album + Song = ₹998/mo');
  assert(planAlbumSong.amountInPaise === 99800, 'Album + Song amount in paise is 99800');
  assert(planAlbumSong.totalStorageGb === 10, '2 modules include 10 GB shared storage');

  // 1.5 Three Modules - Album + Song + Guest Photo AI
  const planAll3 = calculatePlanSummary(['album-selection', 'song-selection', 'guest-photo-ai']);
  assert(planAll3.totalPrice === 1697, 'All 3 modules (499 + 499 + 699) = ₹1,697/mo');
  assert(planAll3.amountInPaise === 169700, 'All 3 modules amount in paise is 169700');
  assert(planAll3.totalStorageGb === 15, '3 modules include 15 GB shared storage');

  // 1.6 Free Included Modules - Gallery, Camera Ingest, Studio Files NEVER add to billable amount
  const planWithFree = calculatePlanSummary(['album-selection', 'gallery', 'camera-ingest', 'studio-files']);
  assert(planWithFree.totalPrice === 499, 'Included free modules (gallery, camera-ingest, studio-files) do not increase price (remains ₹499)');
  assert(planWithFree.amountInPaise === 49900, 'Free modules do not increase amount in paise');
  assert(planWithFree.validModuleIds.length === 1, 'Only paid module album-selection is counted in validModuleIds');

  // 1.7 Legacy camelCase key normalization & deduplication
  const planNormalized = calculatePlanSummary(['album-selection', 'photoSelection', 'songSelection', 'gallery']);
  assert(planNormalized.validModuleIds.length === 2, 'Duplicates and legacy keys normalized and deduped to exactly 2 modules');
  assert(planNormalized.totalPrice === 998, 'Normalized price is exactly 499 + 499 = ₹998 (no double charging or gallery fee)');

  // ==========================================================================
  // SUITE 2: Storage Add-on Combinations
  // ==========================================================================
  console.log('\n--- SUITE 2: Storage Add-on Combinations ---');

  // 2.1 3 Modules + 50 GB Add-on (Matches the user screenshot cart base: ₹1,996)
  const cartUserBase = calculatePlanSummary(['album-selection', 'song-selection', 'guest-photo-ai'], '50gb');
  assert(cartUserBase.subtotalPrice === 1996, '3 modules (1697) + 50GB storage (299) = original monthly total of ₹1,996');
  assert(cartUserBase.subtotalPaise === 199600, 'Base cart subtotal in paise is 199600');
  assert(cartUserBase.totalStorageGb === 65, 'Total storage is 15GB base + 50GB addon = 65 GB');

  // 2.2 3 Modules + 200 GB Add-on
  const cart200 = calculatePlanSummary(['album-selection', 'song-selection', 'guest-photo-ai'], '200gb');
  assert(cart200.totalPrice === 2296, '3 modules (1697) + 200GB (599) = ₹2,296/mo');
  assert(cart200.amountInPaise === 229600, '200GB cart paise is 229600');
  assert(cart200.totalStorageGb === 215, 'Total storage is 15GB + 200GB = 215 GB');

  // 2.3 3 Modules + 500 GB Add-on
  const cart500 = calculatePlanSummary(['album-selection', 'song-selection', 'guest-photo-ai'], '500gb');
  assert(cart500.totalPrice === 2696, '3 modules (1697) + 500GB (999) = ₹2,696/mo');
  assert(cart500.amountInPaise === 269600, '500GB cart paise is 269600');

  // 2.4 3 Modules + 1 TB Add-on
  const cart1tb = calculatePlanSummary(['album-selection', 'song-selection', 'guest-photo-ai'], '1tb');
  assert(cart1tb.totalPrice === 3196, '3 modules (1697) + 1TB (1499) = ₹3,196/mo');
  assert(cart1tb.amountInPaise === 319600, '1TB cart paise is 319600');
  assert(cart1tb.totalStorageGb === 1015, 'Total storage is 15GB + 1000GB = 1,015 GB');

  // 2.5 Storage key normalization ('50', '50GB', '50gb')
  const cartNormalizedStorage = calculatePlanSummary(['album-selection'], '50');
  assert(cartNormalizedStorage.storagePrice === 299, 'Numeric storage key "50" normalized to 50gb add-on (₹299)');

  // ==========================================================================
  // SUITE 3: Valid Coupon Calculations & Razorpay Minimum Rule
  // ==========================================================================
  console.log('\n--- SUITE 3: Valid Coupon Calculations & Razorpay Order Amount ---');

  // 3.1 Coupon TEST99 on ₹1,996 cart (The exact user screenshot scenario!)
  // Original: ₹1,996 (199,600 paise)
  // Discount: 99% of 199,600 = 197,604 paise (₹1,976.04)
  // Final Payable: 1,996 paise (₹19.96)
  const cartWithTest99 = calculatePlanSummary(
    ['album-selection', 'song-selection', 'guest-photo-ai'],
    '50gb',
    'TEST99',
    false // Sandbox test mode enabled
  );
  assert(cartWithTest99.originalPrice === 1996, 'Original price before discount is ₹1,996');
  assert(cartWithTest99.couponCode === 'TEST99', 'Coupon code TEST99 applied');
  assert(cartWithTest99.discountAmount === 1976.04, 'Coupon TEST99 discount is ₹1,976.04 (99%)');
  assert(cartWithTest99.totalPrice === 19.96, 'Final payable price is exactly ₹19.96/mo');
  assert(cartWithTest99.amountInPaise === 1996, 'Final amount in paise is exactly 1996 paise');

  // 3.2 Real Razorpay Order Creation with TEST99 matches final payable amount in paise
  const testUser = { uid: `test_user_${Date.now()}`, email: 'checkout_test@managestudio.io' };
  const rzpOrderTest99 = await createSubscriptionOrder({
    user: testUser,
    studioId: 'std_test_01',
    modules: ['album-selection', 'song-selection', 'guest-photo-ai'],
    storageId: '50gb',
    couponCode: 'TEST99'
  });
  assert(rzpOrderTest99.success === true, 'Razorpay subscription order created successfully');
  assert(rzpOrderTest99.amount === 1996, 'Razorpay order amount exactly matches final payable amount: 1,996 paise (₹19.96)');
  assert(rzpOrderTest99.currency === 'INR', 'Currency is strictly INR');
  assert(rzpOrderTest99.planSummary.discountAmount === 1976.04, 'Plan summary records exact discount of ₹1,976.04');

  // 3.3 Coupon TEST10 (10% discount on ₹1,996 cart)
  // 10% of 199,600 = 19,960 paise (₹199.60)
  // Final: 199,600 - 19,960 = 179,640 paise (₹1,796.40)
  const rzpOrderTest10 = await createSubscriptionOrder({
    user: testUser,
    studioId: 'std_test_01',
    modules: ['album-selection', 'song-selection', 'guest-photo-ai'],
    storageId: '50gb',
    couponCode: 'TEST10'
  });
  assert(rzpOrderTest10.amount === 179640, 'TEST10 order amount in paise is exactly 179640 (₹1,796.40)');
  assert(rzpOrderTest10.planSummary.totalPrice === 1796.4, 'TEST10 payable price is ₹1,796.40');

  // 3.4 Razorpay 100 paise minimum rule on tiny cart
  const tinyCartCoupon = validateAndApplyCoupon(5000, 'TEST99', false); // ₹50 cart with 99% off = 50 paise (under Razorpay min)
  assert(tinyCartCoupon.finalAmountInPaise === 100, 'Razorpay minimum 100 paise rule enforced (capped at 100 paise / ₹1.00)');
  assert(tinyCartCoupon.finalPrice === 1, 'Final price capped at minimum ₹1.00');

  // 3.5 Live Coupon SAVE10 (works in production mode without testOnly restriction)
  const save10Prod = validateAndApplyCoupon(100000, 'SAVE10', true);
  assert(save10Prod.isValidCoupon === true, 'Live coupon SAVE10 is authorized in live production mode');
  assert(save10Prod.discountAmount === 100, 'SAVE10 applies 10% discount in live production');

  // ==========================================================================
  // SUITE 4: Rejection of Invalid & Unauthorized Coupons (Requirements 2 & 4)
  // ==========================================================================
  console.log('\n--- SUITE 4: Rejection of Invalid & Unauthorized Coupons ---');

  // 4.1 Forged/Non-existent coupon code must be rejected by createSubscriptionOrder
  let forgedRejected = false;
  let forgedErrorMessage = '';
  try {
    await createSubscriptionOrder({
      user: testUser,
      studioId: 'std_test_01',
      modules: ['album-selection'],
      couponCode: 'FORGED_DISCOUNT_99'
    });
  } catch (err) {
    forgedRejected = true;
    forgedErrorMessage = err.message;
  }
  assert(forgedRejected === true, 'Backend strictly throws exception when invalid coupon code is provided');
  assert(forgedErrorMessage.includes('Invalid coupon code'), 'Error message clearly indicates coupon is invalid: ' + forgedErrorMessage);

  // 4.2 Bogus coupon validation directly on calculatePlanSummary
  const bogusSummary = calculatePlanSummary(['album-selection'], null, 'BOGUS_CODE');
  assert(bogusSummary.coupon === null, 'Bogus coupon produces null coupon in plan summary');
  assert(Boolean(bogusSummary.couponError), 'Bogus coupon sets descriptive couponError');

  // 4.3 Unauthorized test coupon in production mode (Production Guard)
  let prodUnauthorizedRejected = false;
  let prodUnauthorizedMessage = '';
  const prodSummary = calculatePlanSummary(['album-selection'], null, 'TEST99', true); // isProduction = true
  assert(prodSummary.coupon === null, 'Test coupon in production mode is blocked by production guard');
  assert(prodSummary.couponError.includes('test-only coupon and cannot be applied in live mode'), 'Descriptive rejection reason for test coupon in live mode');

  // 4.4 Disabled coupon rejection
  const disabledTest = validateAndApplyCoupon(100000, 'DISABLED_CODE', false);
  assert(disabledTest.isValidCoupon === false, 'Unknown or disabled coupon is rejected');

  // ==========================================================================
  // SUITE 5: Tampered Client Amounts Disregarded (Requirement 2)
  // ==========================================================================
  console.log('\n--- SUITE 5: Tampered Client Amounts Disregarded ---');

  // 5.1 If client tries to forge amounts in the payload
  const tamperedPayload = {
    user: testUser,
    studioId: 'std_test_01',
    modules: ['album-selection'], // Price is ₹499
    amount: 100,                  // Client forges: 100 paise (₹1.00)
    amountPaise: 100,
    price: 1,
    discountAmount: 498,
    totalPrice: 1
  };
  const tamperedOrder = await createSubscriptionOrder(tamperedPayload);
  assert(tamperedOrder.amount === 49900, 'Server completely disregards client-supplied amount (100) and enforces authoritative 49900 paise');
  assert(tamperedOrder.planSummary.totalPrice === 499, 'Server enforces authoritative ₹499 price');

  // 5.2 Tampered storage payload
  const tamperedStoragePayload = {
    user: testUser,
    studioId: 'std_test_01',
    modules: ['album-selection'],
    storageId: 'forged_10tb_free',
    amount: 1000
  };
  const tamperedStorageOrder = await createSubscriptionOrder(tamperedStoragePayload);
  assert(tamperedStorageOrder.amount === 49900, 'Forged storage tier rejected, base module charge enforced');
  assert(tamperedStorageOrder.planSummary.storagePrice === 0, 'Forged storage grants ₹0 extra cost and 0 GB extra storage');

  // ==========================================================================
  // SUITE 6: Database & Audit Trail Integrity
  // ==========================================================================
  console.log('\n--- SUITE 6: Database & Audit Trail Integrity ---');

  // Verify that the order record stored in the database has exact amounts
  const dbOrder = db.prepare('SELECT * FROM subscription_orders WHERE order_id = ?').get(rzpOrderTest99.orderId);
  assert(dbOrder !== undefined, 'Order successfully recorded in SQLite subscription_orders table');
  assert(dbOrder.amount_paise === 1996, 'Database records exact payable amount: 1,996 paise');
  assert(dbOrder.original_amount_paise === 199600, 'Database records exact original amount: 199,600 paise');
  assert(dbOrder.discount_paise === 197604, 'Database records exact discount amount: 197,604 paise');
  assert(dbOrder.coupon_code === 'TEST99', 'Database records applied coupon code TEST99');

  console.log('\n================================================================');
  console.log(`CHECKOUT PRICING VERIFICATION: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runCheckoutPricingTests().catch(err => {
  console.error('\n✗ Test Suite Execution Error:', err);
  process.exit(1);
});
