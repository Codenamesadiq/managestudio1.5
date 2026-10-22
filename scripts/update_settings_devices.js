import fs from 'node:fs';
import path from 'node:path';

const file = 'E:/Studio Select/src/components/AccountSubscriptionSettings.tsx';
let content = fs.readFileSync(file, 'utf8');

const marker = 'Active PC Slots: {activeDevicesCount || 1} / 3 Max';
const idx = content.indexOf(marker);

if (idx !== -1) {
  const closeDivIdx = content.indexOf('</div>', idx);
  if (closeDivIdx !== -1) {
    const insertPos = closeDivIdx + 6;
    const addition = `

                  {/* Registered PCs Section */}
                  <div className="mt-3 pt-3 border-t border-[#F4F4F5]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-[#18181B] flex items-center gap-1.5">
                        <HardDrive className="w-3 h-3 text-[#71717A]" />
                        <span>Registered PC Devices</span>
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {activeDevicesList && activeDevicesList.length > 0 ? (
                        activeDevicesList.map((dev: any) => (
                          <div key={dev.id || dev.deviceId} className="flex items-center justify-between p-2 rounded-xl bg-[#F9F9F8] border border-[#EAEAE7] text-[11px]">
                            <div>
                              <span className="font-semibold text-[#18181B]">{dev.deviceName || 'Windows PC'}</span>
                              <span className="text-[#71717A] ml-2 text-[10px]">({dev.osInfo || 'Desktop'})</span>
                            </div>
                            {dev.isActive ? (
                              <button
                                onClick={() => deactivateRemoteDevice(dev.deviceId)}
                                className="px-2 py-0.5 rounded-full text-[10px] font-medium text-red-600 hover:bg-red-50 border border-red-200 transition"
                              >
                                Unlink PC
                              </button>
                            ) : (
                              <span className="text-[10px] text-gray-400">Deactivated</span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-between p-2 rounded-xl bg-[#F9F9F8] border border-[#EAEAE7] text-[11px]">
                          <span className="font-semibold text-[#18181B]">This PC (Current Station)</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200">Active</span>
                        </div>
                      )}
                    </div>
                  </div>`;

    content = content.slice(0, insertPos) + addition + content.slice(insertPos);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Successfully inserted Registered PCs section into AccountSubscriptionSettings.tsx');
  }
} else {
  console.error('Marker not found!');
}
