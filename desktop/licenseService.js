/**
 * MANAGE STUDIO - DESKTOP SOFTWARE LICENSING CLIENT
 * Handles device fingerprinting, server entitlement checks, module gating,
 * multi-device policy enforcement, and offline grace periods.
 */

import crypto from 'node:crypto';

export const GRACE_PERIOD_MS = 72 * 60 * 60 * 1000; // 72 Hours Offline Grace Period
export const MAX_SIMULTANEOUS_DEVICES = 3;

export class ManageStudioDesktopLicenseClient {
  constructor(options = {}) {
    this.baseUrl = (options.baseUrl || process.env.SAAS_BACKEND_URL || 'http://localhost:3001').replace(/\/$/, '');
    this.deviceId = options.deviceId || this.generateOrLoadDeviceId();
    this.deviceName = options.deviceName || 'Windows Desktop PC';
    this.osInfo = options.osInfo || 'Windows 11 Pro';
    this.cacheKey = `managestudio_license_cache_${this.deviceId}`;
    this.storage = options.customStorage || new MemoryStorage();
  }

  generateOrLoadDeviceId() {
    const existing = this.storage ? this.storage.getItem('managestudio_device_id') : null;
    if (existing) return existing;
    const newId = `dev_win_${crypto.randomBytes(8).toString('hex')}`;
    if (this.storage) {
      this.storage.setItem('managestudio_device_id', newId);
    }
    return newId;
  }

  /**
   * Activates device on the backend and synchronizes entitlements
   */
  async activateDevice(authToken) {
    try {
      const response = await fetch(`${this.baseUrl}/api/license/activate-device`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          deviceId: this.deviceId,
          deviceName: this.deviceName,
          osInfo: this.osInfo
        })
      });

      const data = await response.json();

      if (response.ok && data.success && data.isLicensed) {
        // Cache successful activation state locally
        const cached = {
          isLicensed: true,
          deviceId: this.deviceId,
          subscription: data.subscription,
          lastVerifiedAt: Date.now()
        };
        this.storage.setItem(this.cacheKey, JSON.stringify(cached));
        return { success: true, isLicensed: true, subscription: data.subscription, activeDevicesCount: data.activeDevicesCount };
      }

      if (data.deviceLimitReached) {
        return {
          success: false,
          isLicensed: false,
          deviceLimitReached: true,
          message: data.message,
          activeDevices: data.activeDevices || []
        };
      }

      return {
        success: false,
        isLicensed: false,
        reason: data.reason || 'ACTIVATION_REJECTED',
        message: data.message || 'Unable to activate this PC.'
      };
    } catch (err) {
      // Offline fallback: check cached activation within grace period
      return this.checkOfflineGracePeriod(err);
    }
  }

  /**
   * Verifies current license state against server or local grace period
   */
  async verifyLicense(authToken) {
    try {
      const response = await fetch(`${this.baseUrl}/api/license/verify?deviceId=${encodeURIComponent(this.deviceId)}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success && data.isLicensed) {
        const cached = {
          isLicensed: true,
          deviceId: this.deviceId,
          subscription: {
            modules: data.modules,
            storageQuotaGb: data.storageQuotaGb,
            expiresAt: data.expiresAt
          },
          lastVerifiedAt: Date.now()
        };
        this.storage.setItem(this.cacheKey, JSON.stringify(cached));
        return { success: true, isLicensed: true, modules: data.modules, storageQuotaGb: data.storageQuotaGb, expiresAt: data.expiresAt };
      }

      // If server returned explicit un-licensing, clear cache
      this.storage.removeItem(this.cacheKey);
      return {
        success: true,
        isLicensed: false,
        reason: data.reason || 'NOT_LICENSED',
        message: data.message || 'Subscription inactive or device revoked.'
      };
    } catch (err) {
      return this.checkOfflineGracePeriod(err);
    }
  }

  /**
   * Deactivates this or another registered device
   */
  async deactivateDevice(authToken, targetDeviceId = null) {
    const devId = targetDeviceId || this.deviceId;
    const response = await fetch(`${this.baseUrl}/api/license/deactivate-device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ deviceId: devId })
    });

    const data = await response.json();
    if (devId === this.deviceId) {
      this.storage.removeItem(this.cacheKey);
    }
    return data;
  }

  /**
   * Lists all active/registered devices for account
   */
  async listDevices(authToken) {
    const response = await fetch(`${this.baseUrl}/api/license/devices`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return await response.json();
  }

  /**
   * Validates if a specific module is entitled
   */
  isModuleEntitled(moduleKey, activeModules = []) {
    // Gallery, Camera Ingest, Studio Files are included with every plan
    const ALWAYS_INCLUDED = ['gallery', 'camera_ingest', 'studio_files'];
    if (ALWAYS_INCLUDED.includes(moduleKey)) return true;

    return activeModules.includes(moduleKey);
  }

  /**
   * Handles offline verification grace period
   */
  checkOfflineGracePeriod(networkError) {
    const raw = this.storage.getItem(this.cacheKey);
    if (!raw) {
      return {
        success: false,
        isLicensed: false,
        reason: 'OFFLINE_NO_CACHE',
        message: 'No previous verification record found. Please connect to internet to activate ManageStudio.'
      };
    }

    try {
      const cached = JSON.parse(raw);
      const elapsed = Date.now() - (cached.lastVerifiedAt || 0);

      if (elapsed > GRACE_PERIOD_MS) {
        return {
          success: false,
          isLicensed: false,
          reason: 'GRACE_PERIOD_EXPIRED',
          message: 'Offline grace period (72 hours) expired. Please connect to internet to re-verify license.'
        };
      }

      // Check subscription expiry date
      if (cached.subscription?.expiresAt && new Date() > new Date(cached.subscription.expiresAt)) {
        return {
          success: false,
          isLicensed: false,
          reason: 'SUBSCRIPTION_EXPIRED',
          message: 'Your subscription period has ended. Please renew on managestudio.io.'
        };
      }

      return {
        success: true,
        isLicensed: true,
        offlineMode: true,
        modules: cached.subscription?.modules || [],
        storageQuotaGb: cached.subscription?.storageQuotaGb || 5,
        expiresAt: cached.subscription?.expiresAt,
        message: 'Running in offline mode with valid local license verification.'
      };
    } catch (_) {
      return {
        success: false,
        isLicensed: false,
        reason: 'INVALID_CACHE',
        message: 'Corrupted license cache. Internet connection required.'
      };
    }
  }
}

export class MemoryStorage {
  constructor() {
    this.map = new Map();
  }
  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }
  setItem(key, val) {
    this.map.set(key, String(val));
  }
  removeItem(key) {
    this.map.delete(key);
  }
}

export default ManageStudioDesktopLicenseClient;
