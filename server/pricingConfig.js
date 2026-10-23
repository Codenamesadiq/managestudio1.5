/**
 * ManageStudio Authoritative Server Pricing & Storage Configuration
 * Server-side source of truth.
 */

export const PAID_MODULES = {
  'album-selection': {
    id: 'album-selection',
    name: 'Album Selection',
    price: 499,
    storageGb: 5,
    firestoreKey: 'photoSelection'
  },
  'song-selection': {
    id: 'song-selection',
    name: 'Song Selection',
    price: 499,
    storageGb: 5,
    firestoreKey: 'songs'
  },
  'guest-photo-ai': {
    id: 'guest-photo-ai',
    name: 'Guest Photo AI',
    price: 699,
    storageGb: 5,
    firestoreKey: 'guestFinder'
  }
};

export const INCLUDED_MODULES = [
  { id: 'gallery', name: 'Client Gallery', price: 0, firestoreKey: 'gallery' },
  { id: 'camera-ingest', name: 'Camera Ingest', price: 0, firestoreKey: 'cameraIngest' },
  { id: 'studio-files', name: 'Studio Files', price: 0, firestoreKey: 'files' }
];

export const STORAGE_ADDONS = {
  '50gb': { id: '50gb', label: '50 GB', storageGb: 50, price: 299 },
  '200gb': { id: '200gb', label: '200 GB', storageGb: 200, price: 599 },
  '500gb': { id: '500gb', label: '500 GB', storageGb: 500, price: 999 },
  '1tb': { id: '1tb', label: '1 TB', storageGb: 1000, price: 1499 }
};

// Available discount coupons with server-side validation
export const AVAILABLE_COUPONS = {
  'TEST10': {
    code: 'TEST10',
    type: 'percentage',
    discountPercent: 10,
    description: '10% Launch Discount',
    enabled: true,
    testOnly: true,
    minCartAmount: 1
  },
  'TEST15': {
    code: 'TEST15',
    type: 'percentage',
    discountPercent: 15,
    description: '15% Seasonal Discount',
    enabled: true,
    testOnly: true,
    minCartAmount: 1
  },
  'TEST20': {
    code: 'TEST20',
    type: 'percentage',
    discountPercent: 20,
    description: '20% Test Discount',
    enabled: true,
    testOnly: true,
    minCartAmount: 1
  },
  'TEST25': {
    code: 'TEST25',
    type: 'percentage',
    discountPercent: 25,
    description: '25% Test Discount',
    enabled: true,
    testOnly: true,
    minCartAmount: 1
  },
  'TEST50': {
    code: 'TEST50',
    type: 'percentage',
    discountPercent: 50,
    description: '50% Test Discount',
    enabled: true,
    testOnly: true,
    minCartAmount: 1
  },
  'TEST99': {
    code: 'TEST99',
    type: 'percentage',
    discountPercent: 99,
    description: '99% Sandbox Test Discount',
    enabled: true,
    testOnly: true,
    minCartAmount: 1
  },
  'SAVE10': {
    code: 'SAVE10',
    type: 'percentage',
    discountPercent: 10,
    description: '10% Savings Offer',
    enabled: true,
    testOnly: false,
    minCartAmount: 1
  },
  'SAVE15': {
    code: 'SAVE15',
    type: 'percentage',
    discountPercent: 15,
    description: '15% Savings Offer',
    enabled: true,
    testOnly: false,
    minCartAmount: 1
  },
  'SAVE20': {
    code: 'SAVE20',
    type: 'percentage',
    discountPercent: 20,
    description: '20% Savings Offer',
    enabled: true,
    testOnly: false,
    minCartAmount: 1
  },
  'SAVE50': {
    code: 'SAVE50',
    type: 'percentage',
    discountPercent: 50,
    description: '50% Savings Offer',
    enabled: true,
    testOnly: false,
    minCartAmount: 1
  },
  'STUDIO10': {
    code: 'STUDIO10',
    type: 'percentage',
    discountPercent: 10,
    description: '10% Studio Partner Discount',
    enabled: true,
    testOnly: false,
    minCartAmount: 1
  },
  'STUDIO15': {
    code: 'STUDIO15',
    type: 'percentage',
    discountPercent: 15,
    description: '15% Studio Partner Discount',
    enabled: true,
    testOnly: false,
    minCartAmount: 1
  },
  'STUDIO50': {
    code: 'STUDIO50',
    type: 'percentage',
    discountPercent: 50,
    description: '50% Studio Partner Discount',
    enabled: true,
    testOnly: false,
    minCartAmount: 1
  },
  'LAUNCH10': {
    code: 'LAUNCH10',
    type: 'percentage',
    discountPercent: 10,
    description: '10% Launch Promotion',
    enabled: true,
    testOnly: false,
    minCartAmount: 1
  },
  'LAUNCH50': {
    code: 'LAUNCH50',
    type: 'percentage',
    discountPercent: 50,
    description: '50% Launch Promotion',
    enabled: true,
    testOnly: false,
    minCartAmount: 1
  }
};

/**
 * Validates and calculates discount on server side
 */
export function validateAndApplyCoupon(
  subtotalPaise, 
  couponCode, 
  isProduction = Boolean(process.env.RAZORPAY_KEY_ID?.startsWith('rzp_live_') && !process.env.ENABLE_TEST_COUPONS)
) {
  if (!couponCode) {
    return {
      isValidCoupon: false,
      coupon: null,
      discountPaise: 0,
      discountAmount: 0,
      finalAmountInPaise: subtotalPaise,
      finalPrice: Number((subtotalPaise / 100).toFixed(2)),
      originalPrice: Number((subtotalPaise / 100).toFixed(2)),
      originalAmountInPaise: subtotalPaise
    };
  }

  const cleanCode = String(couponCode).trim().toUpperCase();
  const coupon = AVAILABLE_COUPONS[cleanCode];

  if (!coupon) {
    return {
      isValidCoupon: false,
      error: `Invalid coupon code "${cleanCode}". Please verify and try again.`,
      coupon: null,
      discountPaise: 0,
      discountAmount: 0,
      finalAmountInPaise: subtotalPaise,
      finalPrice: Number((subtotalPaise / 100).toFixed(2)),
      originalPrice: Number((subtotalPaise / 100).toFixed(2)),
      originalAmountInPaise: subtotalPaise
    };
  }

  if (!coupon.enabled) {
    return {
      isValidCoupon: false,
      error: `Coupon "${cleanCode}" is no longer active.`,
      coupon: null,
      discountPaise: 0,
      discountAmount: 0,
      finalAmountInPaise: subtotalPaise,
      finalPrice: Number((subtotalPaise / 100).toFixed(2)),
      originalPrice: Number((subtotalPaise / 100).toFixed(2)),
      originalAmountInPaise: subtotalPaise
    };
  }

  if (coupon.testOnly && isProduction) {
    return {
      isValidCoupon: false,
      error: `Coupon "${cleanCode}" is a test-only coupon and cannot be applied in live mode.`,
      coupon: null,
      discountPaise: 0,
      discountAmount: 0,
      finalAmountInPaise: subtotalPaise,
      finalPrice: Number((subtotalPaise / 100).toFixed(2)),
      originalPrice: Number((subtotalPaise / 100).toFixed(2)),
      originalAmountInPaise: subtotalPaise
    };
  }

  const subtotalPrice = subtotalPaise / 100;
  if (coupon.minCartAmount && subtotalPrice < coupon.minCartAmount) {
    return {
      isValidCoupon: false,
      error: `Coupon "${cleanCode}" requires a minimum cart total of ₹${coupon.minCartAmount}.`,
      coupon: null,
      discountPaise: 0,
      discountAmount: 0,
      finalAmountInPaise: subtotalPaise,
      finalPrice: Number((subtotalPaise / 100).toFixed(2)),
      originalPrice: Number((subtotalPaise / 100).toFixed(2)),
      originalAmountInPaise: subtotalPaise
    };
  }

  // Calculate discount in paise
  const rawDiscountPaise = Math.round((subtotalPaise * coupon.discountPercent) / 100);
  let finalPaise = subtotalPaise - rawDiscountPaise;

  // Enforce Razorpay minimum supported transaction of ₹1.00 (100 paise)
  const MIN_RAZORPAY_PAISE = 100;
  if (finalPaise < MIN_RAZORPAY_PAISE) {
    finalPaise = MIN_RAZORPAY_PAISE;
  }

  const discountPaise = Math.max(0, subtotalPaise - finalPaise);
  const discountAmount = Number((discountPaise / 100).toFixed(2));
  const finalPrice = Number((finalPaise / 100).toFixed(2));

  return {
    isValidCoupon: true,
    error: null,
    coupon: {
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      description: coupon.description,
      testOnly: coupon.testOnly
    },
    discountPaise,
    discountAmount,
    finalAmountInPaise: finalPaise,
    finalPrice,
    originalPrice: subtotalPrice,
    originalAmountInPaise: subtotalPaise
  };
}

export function calculatePlanSummary(
  selectedModuleIds = [], 
  selectedStorageId = null, 
  couponCode = null, 
  isProduction = Boolean(process.env.RAZORPAY_KEY_ID?.startsWith('rzp_live_') && !process.env.ENABLE_TEST_COUPONS)
) {
  // Normalize module IDs (support both canonical IDs and legacy keys like photoSelection)
  const MODULE_KEY_MAP = {
    'photoSelection': 'album-selection',
    'photo-selection': 'album-selection',
    'songSelection': 'song-selection',
    'songs': 'song-selection',
    'guestFinder': 'guest-photo-ai',
    'guest-finder': 'guest-photo-ai'
  };

  const canonicalIds = (selectedModuleIds || []).map(id => MODULE_KEY_MAP[id] || id);
  // Filter only valid paid modules and remove any duplicates
  const validModuleIds = [...new Set(canonicalIds.filter(id => Boolean(PAID_MODULES[id])))];
  
  let modulesPrice = 0;
  validModuleIds.forEach(id => {
    modulesPrice += PAID_MODULES[id].price;
  });

  const baseStorageGb = validModuleIds.length * 5;

  let storagePrice = 0;
  let additionalStorageGb = 0;
  let validStorageAddon = null;

  const STORAGE_KEY_MAP = {
    '50': '50gb',
    '50gb': '50gb',
    '200': '200gb',
    '200gb': '200gb',
    '500': '500gb',
    '500gb': '500gb',
    '1000': '1tb',
    '1tb': '1tb'
  };
  const normalizedStorageId = selectedStorageId ? (STORAGE_KEY_MAP[String(selectedStorageId).toLowerCase()] || selectedStorageId) : null;

  if (normalizedStorageId && STORAGE_ADDONS[normalizedStorageId]) {
    validStorageAddon = STORAGE_ADDONS[normalizedStorageId];
    storagePrice = validStorageAddon.price;
    additionalStorageGb = validStorageAddon.storageGb;
  }

  const totalStorageGb = baseStorageGb + additionalStorageGb;
  const totalPrice = modulesPrice + storagePrice;
  const subtotalPaise = Math.round(totalPrice * 100);

  // Apply coupon discount if provided
  const couponResult = validateAndApplyCoupon(subtotalPaise, couponCode, isProduction);

  return {
    validModuleIds,
    selectedCount: validModuleIds.length,
    modulesPrice,
    baseStorageGb,
    selectedStorageId: validStorageAddon ? validStorageAddon.id : null,
    storageAddon: validStorageAddon,
    additionalStorageGb,
    storagePrice,
    totalStorageGb,
    // Original subtotal
    subtotalPrice: totalPrice,
    subtotalPaise,
    totalPrice: couponResult.isValidCoupon ? couponResult.finalPrice : totalPrice,
    amountInPaise: couponResult.isValidCoupon ? couponResult.finalAmountInPaise : subtotalPaise,
    // Coupon fields
    couponCode: couponResult.coupon ? couponResult.coupon.code : null,
    coupon: couponResult.coupon,
    couponError: couponResult.error,
    discountAmount: couponResult.discountAmount,
    discountPaise: couponResult.discountPaise,
    originalPrice: totalPrice,
    originalAmountInPaise: subtotalPaise,
    currency: 'INR',
    billingFrequency: 'Monthly',
    isValid: validModuleIds.length > 0
  };
}
