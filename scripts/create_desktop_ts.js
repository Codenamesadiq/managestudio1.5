import fs from 'node:fs';

const tsContent = `/**
 * MANAGE STUDIO - DESKTOP SOFTWARE LICENSING SERVICE
 * Manages device fingerprinting, server entitlement checks, module gating,
 * multi-device policy enforcement, and offline grace periods.
 */

export const GRACE_PERIOD_MS = 72 * 60 * 60 * 1000; // 72 Hours Offline Grace Period
export const MAX_SIMULTANEOUS_DEVICES = 3;

export interface DesktopSubscriptionInfo {
  id?: string;
  planName?: string;
  modules: string[];
  storageQuotaGb: number;
  expiresAt?: string;
}

export interface LicenseVerifyResult {
  success: boolean;
  isLicensed: boolean;
  offlineMode?: boolean;
  deviceLimitReached?: boolean;
  modules?: string[];
  storageQuotaGb?: number;
  expiresAt?: string;
  reason?: string;
  message?: string;
  activeDevices?: Array<{
    id: string;
    deviceId: string;
    deviceName: string;
    osInfo: string;
    lastActiveAt: string;
  }>;
}

export interface IStorage {
  getItem(key: string): string | null;
  setItem(key: string, val: string): void;
  removeItem(key: string): void;
}

export class MemoryStorage implements IStorage {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.has(key) ? (this.map.get(key) || null) : null;
  }
  setItem(key: string, val: string): void {
    this.map.set(key, String(val));
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
}

export class ManageStudioDesktopLicenseClient {
  public baseUrl: string;
  public deviceId: string;
  public deviceName: string;
  public osInfo: string;
  public cacheKey: string;
  public storage: IStorage;

  constructor(options: { baseUrl?: string; deviceId?: string; deviceName?: string; osInfo?: string; customStorage?: IStorage } = {}) {
    this.baseUrl = (options.baseUrl || 'http://localhost:3001').replace(/\\/$/, '');
    this.storage = options.customStorage || (typeof localStorage !== 'undefined' ? localStorage : new MemoryStorage());
    this.deviceId = options.deviceId || this.getOrGenerateDeviceId();
    this.deviceName = options.deviceName || 'Windows Desktop PC';
    this.osInfo = options.osInfo || 'Windows 11 Pro';
    this.cacheKey = 'managestudio_license_cache_' + this.deviceId;
  }

  public getDeviceId(): string {
    return this.deviceId;
  }

  private getOrGenerateDeviceId(): string {
    const existing = this.storage ? this.storage.getItem('managestudio_device_id') : null;
    if (existing) return existing;
    const newId = 'dev_win_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    if (this.storage) {
      this.storage.setItem('managestudio_device_id', newId);
    }
    return newId;
  }

  public async activateDevice(authToken: string): Promise<LicenseVerifyResult> {
    try {
      const response = await fetch(this.baseUrl + '/api/license/activate-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify({
          deviceId: this.deviceId,
          deviceName: this.deviceName,
          osInfo: this.osInfo
        })
      });

      const data = await response.json();

      if (response.ok && data.success && data.isLicensed) {
        const cached = {
          isLicensed: true,
          deviceId: this.deviceId,
          subscription: data.subscription,
          lastVerifiedAt: Date.now()
        };
        this.storage.setItem(this.cacheKey, JSON.stringify(cached));
        return {
          success: true,
          isLicensed: true,
          modules: data.subscription?.modules || [],
          storageQuotaGb: data.subscription?.storageQuotaGb || 5,
          expiresAt: data.subscription?.expiresAt
        };
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
    } catch (_err) {
      return this.checkOfflineGracePeriod();
    }
  }

  public async verifyLicense(authToken: string): Promise<LicenseVerifyResult> {
    try {
      const response = await fetch(this.baseUrl + '/api/license/verify?deviceId=' + encodeURIComponent(this.deviceId), {
        headers: {
          'Authorization': 'Bearer ' + authToken
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
        return {
          success: true,
          isLicensed: true,
          modules: data.modules,
          storageQuotaGb: data.storageQuotaGb,
          expiresAt: data.expiresAt
        };
      }

      this.storage.removeItem(this.cacheKey);
      return {
        success: true,
        isLicensed: false,
        reason: data.reason || 'NOT_LICENSED',
        message: data.message || 'Subscription inactive or device revoked.'
      };
    } catch (_err) {
      return this.checkOfflineGracePeriod();
    }
  }

  public async deactivateDevice(authToken: string, targetDeviceId?: string): Promise<any> {
    const devId = targetDeviceId || this.deviceId;
    const response = await fetch(this.baseUrl + '/api/license/deactivate-device', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      },
      body: JSON.stringify({ deviceId: devId })
    });

    const data = await response.json();
    if (devId === this.deviceId) {
      this.storage.removeItem(this.cacheKey);
    }
    return data;
  }

  public isModuleEntitled(moduleKey: string, activeModules: string[] = []): boolean {
    const ALWAYS_INCLUDED = ['gallery', 'camera_ingest', 'studio_files'];
    if (ALWAYS_INCLUDED.includes(moduleKey)) return true;
    return activeModules.includes(moduleKey);
  }

  private checkOfflineGracePeriod(): LicenseVerifyResult {
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

export const licenseClient = new ManageStudioDesktopLicenseClient();
`;

fs.writeFileSync('E:/Studio Select/src/services/licenseService.ts', tsContent);
console.log('Successfully written strongly-typed licenseService.ts');
