import { useState } from 'react';
import { toast } from 'sonner';
import { Settings, Bell, Shield, Palette, Database, Save } from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';

interface SettingSection {
  id: string;
  label: string;
  icon: React.ElementType;
}

const sections: SettingSection[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'data', label: 'Data & Export', icon: Database },
];

function Toggle({ label, sublabel, value, onChange }: { label: string; sublabel?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {sublabel && <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className="relative w-10 h-6 rounded-full transition-all duration-200 shrink-0"
        style={{ backgroundColor: value ? '#714B67' : '#D1D5DB' }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
          style={{ left: value ? '1.25rem' : '0.125rem' }}
        />
      </button>
    </div>
  );
}

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [orgName, setOrgName] = useState('Acme Corporation');
  const [timezone, setTimezone] = useState('UTC+0');
  const [currency, setCurrency] = useState('USD');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifBrowser, setNotifBrowser] = useState(true);
  const [notifWarranty, setNotifWarranty] = useState(true);
  const [notifOverdue, setNotifOverdue] = useState(true);
  const [notifMaintenance, setNotifMaintenance] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('8h');

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="p-6 max-w-screen-xl">
      <PageHeader
        title="Settings"
        subtitle="Manage your application preferences and configurations"
        breadcrumbs={[{ label: 'Settings' }]}
      />

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-2">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left mb-0.5"
                style={{
                  backgroundColor: activeSection === s.id ? '#F1EBEF' : 'transparent',
                  color: activeSection === s.id ? '#714B67' : '#6B7280',
                }}
              >
                <s.icon size={15} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100">
          {activeSection === 'general' && (
            <div className="p-6">
              <h3 className="font-semibold text-gray-800 mb-5">General Settings</h3>
              <div className="flex flex-col gap-5 max-w-md">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Organization Name</label>
                  <input value={orgName} onChange={e => setOrgName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Default Timezone</label>
                  <select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white">
                    {['UTC-8', 'UTC-5', 'UTC+0', 'UTC+1', 'UTC+5:30', 'UTC+8'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Currency</label>
                  <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white">
                    {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Fiscal Year Start</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white">
                    {['January', 'April', 'July', 'October'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="p-6">
              <h3 className="font-semibold text-gray-800 mb-5">Notification Preferences</h3>
              <div className="max-w-md">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Delivery</p>
                <Toggle label="Email Notifications" sublabel="Receive alerts via email" value={notifEmail} onChange={setNotifEmail} />
                <Toggle label="Browser Notifications" sublabel="Push notifications in browser" value={notifBrowser} onChange={setNotifBrowser} />

                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-5 mb-3">Events</p>
                <Toggle label="Warranty Expiry Alerts" sublabel="30 days before expiry" value={notifWarranty} onChange={setNotifWarranty} />
                <Toggle label="Overdue Return Alerts" sublabel="When assets are overdue" value={notifOverdue} onChange={setNotifOverdue} />
                <Toggle label="Maintenance Updates" sublabel="Status changes on requests" value={notifMaintenance} onChange={setNotifMaintenance} />
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="p-6">
              <h3 className="font-semibold text-gray-800 mb-5">Security Settings</h3>
              <div className="max-w-md">
                <Toggle label="Two-Factor Authentication" sublabel="Add extra layer of security" value={twoFA} onChange={setTwoFA} />
                <div className="mt-4">
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Session Timeout</label>
                  <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white">
                    {['1h', '4h', '8h', '24h', 'Never'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="mt-4">
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Change Password</label>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="p-6">
              <h3 className="font-semibold text-gray-800 mb-5">Appearance</h3>
              <div className="max-w-md">
                <p className="text-xs font-medium text-gray-600 mb-3">Theme</p>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {['Light', 'Dark', 'System'].map(t => (
                    <button key={t} className="py-3 rounded-xl border-2 text-sm font-medium transition-all" style={{ borderColor: t === 'Light' ? '#714B67' : '#E5E7EB', color: t === 'Light' ? '#714B67' : '#6B7280' }}>
                      {t}
                    </button>
                  ))}
                </div>
                <p className="text-xs font-medium text-gray-600 mb-3">Density</p>
                <div className="grid grid-cols-3 gap-3">
                  {['Compact', 'Normal', 'Comfortable'].map(d => (
                    <button key={d} className="py-3 rounded-xl border-2 text-sm font-medium transition-all" style={{ borderColor: d === 'Normal' ? '#714B67' : '#E5E7EB', color: d === 'Normal' ? '#714B67' : '#6B7280' }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'data' && (
            <div className="p-6">
              <h3 className="font-semibold text-gray-800 mb-5">Data & Export</h3>
              <div className="max-w-md flex flex-col gap-4">
                {[['Export Assets', 'Download all asset data as CSV', '#714B67'], ['Export Allocations', 'Download allocation history as CSV', '#714B67'], ['Export Reports', 'Download analytics as PDF', '#714B67']].map(([label, desc, color]) => (
                  <div key={label} className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                    <button onClick={() => toast.info(`Downloading ${label}...`)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all" style={{ backgroundColor: color as string }}>
                      Export
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="px-6 py-4 border-t border-gray-50 flex justify-end">
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all" style={{ backgroundColor: '#714B67' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5B3A53')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#714B67')}>
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
