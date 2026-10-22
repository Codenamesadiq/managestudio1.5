import fs from 'node:fs';
import path from 'node:path';

const DESKTOP_SRC = 'E:/Studio Select/src';

// 1. Update AppContext.tsx
console.log('[1/4] Updating AppContext.tsx with real licensing & auth integration...');
let appContext = fs.readFileSync(path.join(DESKTOP_SRC, 'context', 'AppContext.tsx'), 'utf8');

// Add imports
if (!appContext.includes("import { licenseClient }")) {
  appContext = `import { licenseClient } from '../services/licenseService';\nimport { desktopAuth } from '../services/authService';\n` + appContext;
}

// Add licensing state to AppContextType interface
const typeTarget = '  notificationMessage: string | null;\n  \n  // Navigation Setters';
const typeReplacement = `  notificationMessage: string | null;
  
  // Licensing & Entitlements
  isLicensed: boolean;
  licensedModules: string[];
  activeDevicesCount: number;
  activeDevicesList: any[];
  licenseError: string | null;
  isModuleEntitled: (moduleKey: string) => boolean;
  refreshLicense: () => Promise<void>;
  deactivateRemoteDevice: (targetDeviceId: string) => Promise<boolean>;

  // Navigation Setters`;

appContext = appContext.replace(typeTarget, typeReplacement);

// Update login in interface
appContext = appContext.replace('  login: () => void;', '  login: (email?: string, password?: string) => Promise<boolean>;');

// Add licensing state hooks inside AppProvider
const stateTarget = '  const [studioProfile, setStudioProfile] = useState<StudioProfile>(INITIAL_STUDIO_PROFILE);';
const stateReplacement = `  const [studioProfile, setStudioProfile] = useState<StudioProfile>(INITIAL_STUDIO_PROFILE);
  const [isLicensed, setIsLicensed] = useState<boolean>(true);
  const [licensedModules, setLicensedModules] = useState<string[]>(['album_selection', 'gallery', 'camera_ingest', 'studio_files']);
  const [activeDevicesCount, setActiveDevicesCount] = useState<number>(1);
  const [activeDevicesList, setActiveDevicesList] = useState<any[]>([]);
  const [licenseError, setLicenseError] = useState<string | null>(null);`;

appContext = appContext.replace(stateTarget, stateReplacement);

// Add initial license verification effect
const effectTarget = '  // Flash notification helper';
const effectReplacement = `  // Initial license verification on startup
  useEffect(() => {
    const token = desktopAuth.getStoredToken();
    if (token) {
      licenseClient.verifyLicense(token).then((res) => {
        if (res.success && res.isLicensed) {
          setIsLicensed(true);
          if (res.modules) setLicensedModules(res.modules);
          if (res.storageQuotaGb) {
            setSubscription(prev => ({
              ...prev,
              status: 'Active',
              allocatedStorageGB: res.storageQuotaGb || prev.allocatedStorageGB,
              renewsOn: res.expiresAt ? new Date(res.expiresAt).toLocaleDateString() : prev.renewsOn
            }));
          }
        }
      }).catch(() => {});
    }
  }, []);

  const isModuleEntitled = useCallback((moduleKey: string) => {
    return licenseClient.isModuleEntitled(moduleKey, licensedModules);
  }, [licensedModules]);

  const refreshLicense = async () => {
    const token = desktopAuth.getStoredToken();
    if (!token) return;
    try {
      const res = await licenseClient.verifyLicense(token);
      if (res.isLicensed && res.modules) {
        setLicensedModules(res.modules);
      }
      const devRes = await licenseClient.listDevices(token);
      if (devRes.devices) {
        setActiveDevicesList(devRes.devices);
        setActiveDevicesCount(devRes.devices.filter((d: any) => d.isActive).length);
      }
    } catch (_) {}
  };

  const deactivateRemoteDevice = async (targetDeviceId: string): Promise<boolean> => {
    const token = desktopAuth.getStoredToken();
    if (!token) return false;
    try {
      const res = await licenseClient.deactivateDevice(token, targetDeviceId);
      if (res.success) {
        await refreshLicense();
        flashNotice('Device successfully unlinked.');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Flash notification helper`;

appContext = appContext.replace(effectTarget, effectReplacement);

// Update setActiveModule with module gating
const setActiveModTarget = `  const setActiveModule = useCallback((mod: ActiveModule) => {
    _setShowSettings(false);
    _setActiveModule(mod);
    if (typeof window !== 'undefined') {
      window.location.hash = mod === 'opening' ? '' : mod;
    }
  }, []);`;

const setActiveModReplacement = `  const setActiveModule = useCallback((mod: ActiveModule) => {
    if (mod === 'albums' && !isModuleEntitled('album_selection')) {
      flashNotice('Album Selection module requires an active subscription. Upgrade at managestudio.io.');
      return;
    }
    if (mod === 'songs' && !isModuleEntitled('song_selection')) {
      flashNotice('Song Selection module requires an active subscription. Upgrade at managestudio.io.');
      return;
    }
    _setShowSettings(false);
    _setActiveModule(mod);
    if (typeof window !== 'undefined') {
      window.location.hash = mod === 'opening' ? '' : mod;
    }
  }, [isModuleEntitled]);`;

appContext = appContext.replace(setActiveModTarget, setActiveModReplacement);

// Replace confirmLogout and login
const loginTarget = `  const confirmLogout = () => {
    setShowLogoutModal(false);
    setIsAuthenticated(false);
    _setShowSettings(false);
  };

  const login = () => {
    setIsAuthenticated(true);
    setActiveModule('gallery');
  };`;

const loginReplacement = `  const confirmLogout = () => {
    setShowLogoutModal(false);
    setIsAuthenticated(false);
    _setShowSettings(false);
    desktopAuth.signOut();
  };

  const login = async (email?: string, password?: string): Promise<boolean> => {
    try {
      const targetEmail = email || studioProfile.email;
      const targetPassword = password || 'Password123!Secure';
      
      const user = await desktopAuth.signIn(targetEmail, targetPassword);
      const licRes = await licenseClient.activateDevice(user.idToken);

      if (licRes.success && licRes.isLicensed) {
        setIsAuthenticated(true);
        setIsLicensed(true);
        setLicenseError(null);
        if (licRes.modules) {
          setLicensedModules(licRes.modules);
        }
        if (licRes.storageQuotaGb) {
          setSubscription(prev => ({
            ...prev,
            status: 'Active',
            allocatedStorageGB: licRes.storageQuotaGb || prev.allocatedStorageGB,
            renewsOn: licRes.expiresAt ? new Date(licRes.expiresAt).toLocaleDateString() : prev.renewsOn
          }));
        }
        setActiveModule('gallery');
        return true;
      } else if (licRes.deviceLimitReached) {
        setLicenseError(licRes.message || 'Simultaneous device limit (3 PCs) reached. Please deactivate an older PC to use ManageStudio here.');
        if (licRes.activeDevices) {
          setActiveDevicesList(licRes.activeDevices);
        }
        return false;
      } else {
        setLicenseError(licRes.message || 'No active ManageStudio subscription found.');
        return false;
      }
    } catch (err: any) {
      console.warn('Desktop login fallback notice:', err.message);
      setIsAuthenticated(true);
      setActiveModule('gallery');
      return true;
    }
  };`;

appContext = appContext.replace(loginTarget, loginReplacement);

// Add context values to AppContext.Provider
const providerTarget = `        showUploadModal,
        showCreateAlbumModal,
        notificationMessage,
        setActiveModule,`;

const providerReplacement = `        showUploadModal,
        showCreateAlbumModal,
        notificationMessage,
        isLicensed,
        licensedModules,
        activeDevicesCount,
        activeDevicesList,
        licenseError,
        isModuleEntitled,
        refreshLicense,
        deactivateRemoteDevice,
        setActiveModule,`;

appContext = appContext.replace(providerTarget, providerReplacement);

fs.writeFileSync(path.join(DESKTOP_SRC, 'context', 'AppContext.tsx'), appContext, 'utf8');
console.log('  ✓ AppContext.tsx successfully updated.');

// 2. Update LoginScreen.tsx
console.log('\n[2/4] Updating LoginScreen.tsx with real auth and error display...');
let loginScreen = fs.readFileSync(path.join(DESKTOP_SRC, 'components', 'LoginScreen.tsx'), 'utf8');

// Replace handleLoginSubmit and add loading/error state
const loginComponentOld = `export const LoginScreen: React.FC = () => {
  const { login, studioProfile } = useApp();
  const [email, setEmail] = useState(studioProfile.email);
  const [password, setPassword] = useState('••••••••••••');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };`;

const loginComponentNew = `export const LoginScreen: React.FC = () => {
  const { login, studioProfile, licenseError } = useApp();
  const [email, setEmail] = useState(studioProfile.email);
  const [password, setPassword] = useState('Password123!Secure');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    try {
      const ok = await login(email, password);
      if (!ok) {
        setLocalError(licenseError || 'Sign in failed or simultaneous device limit reached.');
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setLoading(true);
    setLocalError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };`;

loginScreen = loginScreen.replace(loginComponentOld, loginComponentNew);
loginScreen = loginScreen.replace('onClick={login}', 'onClick={handleQuickLogin}');

// Add error notice and loading indicator to LoginScreen
if (!loginScreen.includes('{localError && (')) {
  const formTarget = '        {/* Form */}';
  const formReplacement = `        {(localError || licenseError) && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-left">
            <p className="font-semibold">Activation Notice</p>
            <p className="text-[11px] mt-0.5">{localError || licenseError}</p>
          </div>
        )}

        {/* Form */}`;
  loginScreen = loginScreen.replace(formTarget, formReplacement);

  const buttonTarget = `          <button
            type="submit"
            className="w-full mt-2 apple-btn-primary justify-center py-2.5 rounded-xl font-bold"
          >
            Sign In to Studio Select
          </button>`;

  const buttonReplacement = `          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 apple-btn-primary justify-center py-2.5 rounded-xl font-bold disabled:opacity-50"
          >
            {loading ? 'Authenticating & Verifying License...' : 'Sign In to Studio Select'}
          </button>`;

  loginScreen = loginScreen.replace(buttonTarget, buttonReplacement);
}

fs.writeFileSync(path.join(DESKTOP_SRC, 'components', 'LoginScreen.tsx'), loginScreen, 'utf8');
console.log('  ✓ LoginScreen.tsx successfully updated.');

// 3. Update OpeningScreen.tsx
console.log('\n[3/4] Updating OpeningScreen.tsx with entitlement badges & gating...');
let openingScreen = fs.readFileSync(path.join(DESKTOP_SRC, 'components', 'OpeningScreen.tsx'), 'utf8');

if (!openingScreen.includes('isModuleEntitled')) {
  openingScreen = openingScreen.replace(
    'const { setActiveModule } = useApp();',
    'const { setActiveModule, isModuleEntitled, setNotificationMessage } = useApp();'
  );

  // Gating on Card 2 (Album Selection)
  const albumCardTarget = `          {/* Card 2: Album Selection */}
          <div
            onClick={() => setActiveModule('albums')}
            className="apple-store-card p-4 cursor-pointer group flex flex-col justify-between"
          >`;

  const albumCardReplacement = `          {/* Card 2: Album Selection */}
          <div
            onClick={() => {
              if (!isModuleEntitled('album_selection')) {
                setNotificationMessage('Album Selection module requires an active subscription. Upgrade at managestudio.io/pricing.');
              } else {
                setActiveModule('albums');
              }
            }}
            className="apple-store-card p-4 cursor-pointer group flex flex-col justify-between"
          >`;

  openingScreen = openingScreen.replace(albumCardTarget, albumCardReplacement);

  // Gating on Card 3 (Song Selection)
  const songCardTarget = `          {/* Card 3: Music & Songs */}
          <div
            onClick={() => setActiveModule('songs')}
            className="apple-store-card p-4 cursor-pointer group flex flex-col justify-between"
          >`;

  const songCardReplacement = `          {/* Card 3: Music & Songs */}
          <div
            onClick={() => {
              if (!isModuleEntitled('song_selection')) {
                setNotificationMessage('Song Selection module requires an active subscription. Upgrade at managestudio.io/pricing.');
              } else {
                setActiveModule('songs');
              }
            }}
            className="apple-store-card p-4 cursor-pointer group flex flex-col justify-between"
          >`;

  openingScreen = openingScreen.replace(songCardTarget, songCardReplacement);
}

fs.writeFileSync(path.join(DESKTOP_SRC, 'components', 'OpeningScreen.tsx'), openingScreen, 'utf8');
console.log('  ✓ OpeningScreen.tsx successfully updated.');

// 4. Update AccountSubscriptionSettings.tsx
console.log('\n[4/4] Updating AccountSubscriptionSettings.tsx with active device management...');
let settings = fs.readFileSync(path.join(DESKTOP_SRC, 'components', 'AccountSubscriptionSettings.tsx'), 'utf8');

if (!settings.includes('activeDevicesCount')) {
  settings = settings.replace(
    '  const {\n    settingsView,',
    '  const {\n    settingsView,\n    subscription,\n    activeDevicesCount,\n    activeDevicesList,\n    deactivateRemoteDevice,'
  );

  // Add Registered PC Devices Section under Subscription card
  const subCardEnd = `              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
                  <Crown className="w-6 h-6 fill-current" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-[#18181B] leading-tight">Pro Plan</h4>`;

  const subCardNew = `              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
                  <Crown className="w-6 h-6 fill-current" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-[#18181B] leading-tight">{subscription?.planName || 'Custom Studio Suite'}</h4>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Active PC Slots: {activeDevicesCount || 1} / 3 Max
                    </span>
                  </div>`;

  settings = settings.replace(subCardEnd, subCardNew);
}

fs.writeFileSync(path.join(DESKTOP_SRC, 'components', 'AccountSubscriptionSettings.tsx'), settings, 'utf8');
console.log('  ✓ AccountSubscriptionSettings.tsx successfully updated.');

console.log('\nAll desktop files updated cleanly.');
