"use client";

import { useState } from "react";

type SettingsTab = "general" | "privacy" | "notifications" | "data" | "appearance";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  push: boolean;
  email: boolean;
  sms: boolean;
}

interface ConnectedService {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  lastSync: string;
}

interface BlockedUser {
  id: string;
  name: string;
  username: string;
  blockedDate: string;
}

const notificationSettings: NotificationSetting[] = [
  { id: "n1", label: "Meal Reminders", description: "Get reminded to log your meals", push: true, email: false, sms: false },
  { id: "n2", label: "Achievement Unlocked", description: "When you earn a new badge or streak", push: true, email: true, sms: false },
  { id: "n3", label: "Social Activity", description: "Friend requests, kudos, comments", push: true, email: true, sms: false },
  { id: "n4", label: "Challenge Updates", description: "Challenge invitations and results", push: true, email: true, sms: true },
  { id: "n5", label: "Expert Messages", description: "Messages from nutritionists", push: true, email: true, sms: true },
  { id: "n6", label: "Weekly Summary", description: "Your weekly progress report", push: false, email: true, sms: false },
  { id: "n7", label: "Marketing & Tips", description: "New features, tips, and offers", push: false, email: true, sms: false },
  { id: "n8", label: "Festival Alerts", description: "Upcoming festival food guides", push: true, email: false, sms: false },
];

const connectedServices: ConnectedService[] = [
  { id: "s1", name: "Google Fit", icon: "🏃", connected: true, lastSync: "2 minutes ago" },
  { id: "s2", name: "Apple Health", icon: "❤️", connected: false, lastSync: "Never" },
  { id: "s3", name: "Fitbit", icon: "⌚", connected: true, lastSync: "1 hour ago" },
  { id: "s4", name: "Samsung Health", icon: "📱", connected: false, lastSync: "Never" },
  { id: "s5", name: "Garmin", icon: "🏔️", connected: false, lastSync: "Never" },
  { id: "s6", name: "Google Account", icon: "🔵", connected: true, lastSync: "Active" },
];

const blockedUsers: BlockedUser[] = [
  { id: "b1", name: "Spam Account", username: "@spammer123", blockedDate: "2026-01-15" },
  { id: "b2", name: "Unknown User", username: "@random456", blockedDate: "2026-01-28" },
];

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ne", name: "नेपाली (Nepali)", flag: "🇳🇵" },
  { code: "hi", name: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { code: "bn", name: "বাংলা (Bengali)", flag: "🇧🇩" },
  { code: "ur", name: "اردو (Urdu)", flag: "🇵🇰" },
  { code: "si", name: "සිංහල (Sinhala)", flag: "🇱🇰" },
];

const accentColors = [
  { name: "Emerald", value: "#10b981" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Teal", value: "#14b8a6" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [language, setLanguage] = useState("en");
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("light");
  const [fontSize, setFontSize] = useState(16);
  const [compactMode, setCompactMode] = useState(false);
  const [accentColor, setAccentColor] = useState("#10b981");
  const [visibility, setVisibility] = useState<"public" | "friends" | "private">("friends");
  const [dataSharing, setDataSharing] = useState(false);
  const [activityStatus, setActivityStatus] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const tabs: { id: SettingsTab; label: string; icon: string }[] = [
    { id: "general", label: "General", icon: "⚙️" },
    { id: "privacy", label: "Privacy", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "data", label: "Data", icon: "💾" },
    { id: "appearance", label: "Appearance", icon: "🎨" },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-neutral-700 to-neutral-800 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">⚙️ Settings</h1>
        <p className="text-neutral-300">Manage your preferences and account</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-neutral-800 text-white"
                : "bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="space-y-6">
          {/* Profile Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">👤 Profile Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                <input type="text" defaultValue="Sajan Thapa" className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                <input type="email" defaultValue="sajan@example.com" className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                <input type="tel" defaultValue="+977 98XXXXXXXX" className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Date of Birth</label>
                <input type="date" defaultValue="1995-06-15" className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Gender</label>
                <select className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Timezone</label>
                <select className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm">
                  <option>Asia/Kathmandu (UTC+5:45)</option>
                  <option>Asia/Kolkata (UTC+5:30)</option>
                  <option>Asia/Dhaka (UTC+6:00)</option>
                  <option>Asia/Colombo (UTC+5:30)</option>
                </select>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors">Save Changes</button>
          </div>

          {/* Language */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🌐 Language</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                    language === lang.code
                      ? "bg-emerald-50 border-2 border-emerald-500 text-emerald-700"
                      : "bg-neutral-50 border-2 border-transparent text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Units */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">📏 Measurement Units</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setUnits("metric")}
                className={`flex-1 p-4 rounded-xl text-center transition-colors ${
                  units === "metric"
                    ? "bg-emerald-50 border-2 border-emerald-500"
                    : "bg-neutral-50 border-2 border-transparent"
                }`}
              >
                <p className="text-lg font-bold">Metric</p>
                <p className="text-xs text-neutral-500">kg, cm, °C</p>
              </button>
              <button
                onClick={() => setUnits("imperial")}
                className={`flex-1 p-4 rounded-xl text-center transition-colors ${
                  units === "imperial"
                    ? "bg-emerald-50 border-2 border-emerald-500"
                    : "bg-neutral-50 border-2 border-transparent"
                }`}
              >
                <p className="text-lg font-bold">Imperial</p>
                <p className="text-xs text-neutral-500">lbs, in, °F</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === "privacy" && (
        <div className="space-y-6">
          {/* Visibility */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">👁️ Account Visibility</h2>
            <div className="space-y-3">
              {[
                { id: "public" as const, label: "Public", icon: "🌍", desc: "Anyone can see your profile and progress" },
                { id: "friends" as const, label: "Friends Only", icon: "👥", desc: "Only your friends can see your activity" },
                { id: "private" as const, label: "Private", icon: "🔒", desc: "Your profile is hidden from everyone" },
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setVisibility(option.id)}
                  className={`w-full p-4 rounded-xl flex items-center gap-3 text-left transition-colors ${
                    visibility === option.id
                      ? "bg-emerald-50 border-2 border-emerald-500"
                      : "bg-neutral-50 border-2 border-transparent hover:bg-neutral-100"
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <p className="font-medium text-neutral-800">{option.label}</p>
                    <p className="text-xs text-neutral-500">{option.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🛡️ Privacy Controls</h2>
            <div className="space-y-4">
              {[
                { label: "Data Sharing", desc: "Allow anonymous data for research", enabled: dataSharing, toggle: () => setDataSharing(!dataSharing) },
                { label: "Activity Status", desc: "Show when you're online", enabled: activityStatus, toggle: () => setActivityStatus(!activityStatus) },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div>
                    <p className="font-medium text-neutral-800 text-sm">{item.label}</p>
                    <p className="text-xs text-neutral-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={item.toggle}
                    className={`w-12 h-6 rounded-full relative transition-colors ${item.enabled ? "bg-emerald-500" : "bg-neutral-300"}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${item.enabled ? "right-0.5" : "left-0.5"}`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Blocked Users */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🚫 Blocked Users ({blockedUsers.length})</h2>
            <div className="space-y-2">
              {blockedUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center text-sm">👤</div>
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{user.name}</p>
                      <p className="text-xs text-neutral-500">{user.username} • Blocked {new Date(user.blockedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50">Unblock</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🔔 Notification Preferences</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-2 text-sm font-medium text-neutral-700">Category</th>
                    <th className="text-center py-2 text-sm font-medium text-neutral-700 w-16">Push</th>
                    <th className="text-center py-2 text-sm font-medium text-neutral-700 w-16">Email</th>
                    <th className="text-center py-2 text-sm font-medium text-neutral-700 w-16">SMS</th>
                  </tr>
                </thead>
                <tbody>
                  {notificationSettings.map(setting => (
                    <tr key={setting.id} className="border-b border-neutral-50">
                      <td className="py-3">
                        <p className="text-sm font-medium text-neutral-800">{setting.label}</p>
                        <p className="text-xs text-neutral-500">{setting.description}</p>
                      </td>
                      <td className="text-center py-3">
                        <div className={`w-8 h-5 rounded-full mx-auto cursor-pointer ${setting.push ? "bg-emerald-500" : "bg-neutral-300"} relative`}>
                          <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 ${setting.push ? "right-0.5" : "left-0.5"}`}></div>
                        </div>
                      </td>
                      <td className="text-center py-3">
                        <div className={`w-8 h-5 rounded-full mx-auto cursor-pointer ${setting.email ? "bg-emerald-500" : "bg-neutral-300"} relative`}>
                          <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 ${setting.email ? "right-0.5" : "left-0.5"}`}></div>
                        </div>
                      </td>
                      <td className="text-center py-3">
                        <div className={`w-8 h-5 rounded-full mx-auto cursor-pointer ${setting.sms ? "bg-emerald-500" : "bg-neutral-300"} relative`}>
                          <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 ${setting.sms ? "right-0.5" : "left-0.5"}`}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors">Save Preferences</button>
              <button className="px-4 py-2 border border-neutral-200 rounded-xl text-sm text-neutral-600 hover:bg-neutral-50">Mute All</button>
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🌙 Quiet Hours</h2>
            <p className="text-sm text-neutral-500 mb-4">Pause notifications during specific times</p>
            <div className="flex gap-4 items-center">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">From</label>
                <input type="time" defaultValue="22:00" className="px-3 py-2 rounded-xl border border-neutral-200 text-sm" />
              </div>
              <span className="text-neutral-400 mt-4">→</span>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">To</label>
                <input type="time" defaultValue="07:00" className="px-3 py-2 rounded-xl border border-neutral-200 text-sm" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Tab */}
      {activeTab === "data" && (
        <div className="space-y-6">
          {/* Storage */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">💾 Storage Usage</h2>
            <div className="space-y-3">
              {[
                { category: "Food Logs", size: "2.4 MB", pct: 35, color: "bg-emerald-500" },
                { category: "Recipes", size: "1.8 MB", pct: 26, color: "bg-blue-500" },
                { category: "Health Data", size: "1.2 MB", pct: 18, color: "bg-purple-500" },
                { category: "Preferences", size: "0.8 MB", pct: 12, color: "bg-amber-500" },
                { category: "Cache", size: "0.6 MB", pct: 9, color: "bg-neutral-400" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-700">{item.category}</span>
                    <span className="text-neutral-500">{item.size}</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full">
                    <div className={`h-2 ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
              <p className="text-sm text-neutral-500 mt-2">Total: 6.8 MB of local storage used</p>
            </div>
          </div>

          {/* Connected Services */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🔗 Connected Services</h2>
            <div className="space-y-2">
              {connectedServices.map(service => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{service.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{service.name}</p>
                      <p className="text-xs text-neutral-500">Last sync: {service.lastSync}</p>
                    </div>
                  </div>
                  <button className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    service.connected
                      ? "bg-red-50 text-red-500 hover:bg-red-100"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  }`}>
                    {service.connected ? "Disconnect" : "Connect"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Export & Delete */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">📤 Data Management</h2>
            <div className="space-y-3">
              <button className="w-full p-4 bg-blue-50 rounded-xl text-left hover:bg-blue-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📥</span>
                  <div>
                    <p className="font-medium text-blue-700">Export My Data</p>
                    <p className="text-xs text-blue-500">Download all your data as JSON/CSV</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full p-4 bg-red-50 rounded-xl text-left hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-medium text-red-700">Delete Account</p>
                    <p className="text-xs text-red-500">Permanently delete your account and all data</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === "appearance" && (
        <div className="space-y-6">
          {/* Theme */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🎨 Theme</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "light" as const, label: "Light", icon: "☀️", preview: "bg-white" },
                { id: "dark" as const, label: "Dark", icon: "🌙", preview: "bg-neutral-800" },
                { id: "auto" as const, label: "Auto", icon: "🔄", preview: "bg-gradient-to-r from-white to-neutral-800" },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-4 rounded-xl text-center transition-colors ${
                    theme === t.id
                      ? "border-2 border-emerald-500 bg-emerald-50"
                      : "border-2 border-transparent bg-neutral-50"
                  }`}
                >
                  <div className={`w-12 h-8 ${t.preview} rounded-lg mx-auto mb-2 border border-neutral-200`}></div>
                  <p className="text-lg">{t.icon}</p>
                  <p className="text-sm font-medium text-neutral-700">{t.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🔤 Font Size</h2>
            <div className="flex items-center gap-4">
              <span className="text-xs text-neutral-500">A</span>
              <input
                type="range"
                min={12}
                max={24}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="flex-1 accent-emerald-500"
              />
              <span className="text-xl text-neutral-500">A</span>
            </div>
            <p className="text-center text-sm text-neutral-500 mt-2" style={{ fontSize: `${fontSize}px` }}>
              Preview Text ({fontSize}px)
            </p>
          </div>

          {/* Accent Color */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🌈 Accent Color</h2>
            <div className="flex gap-3 flex-wrap">
              {accentColors.map(color => (
                <button
                  key={color.value}
                  onClick={() => setAccentColor(color.value)}
                  className={`w-12 h-12 rounded-xl border-2 transition-all ${
                    accentColor === color.value ? "border-neutral-800 scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                ></button>
              ))}
            </div>
          </div>

          {/* Compact Mode */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-800">📐 Compact Mode</h2>
                <p className="text-sm text-neutral-500">Reduce spacing and padding for more content</p>
              </div>
              <button
                onClick={() => setCompactMode(!compactMode)}
                className={`w-12 h-6 rounded-full relative transition-colors ${compactMode ? "bg-emerald-500" : "bg-neutral-300"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${compactMode ? "right-0.5" : "left-0.5"}`}></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">⚠️</div>
              <h3 className="text-lg font-semibold text-neutral-800">Delete Account?</h3>
              <p className="text-sm text-neutral-500 mt-2">This action cannot be undone. All your data, progress, and achievements will be permanently deleted.</p>
            </div>
            <div className="space-y-2">
              <input type="text" placeholder='Type "DELETE" to confirm' className="w-full px-3 py-2 rounded-xl border border-red-200 text-sm text-center" />
              <button className="w-full px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors">Delete Permanently</button>
              <button onClick={() => setShowDeleteConfirm(false)} className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm text-neutral-600 hover:bg-neutral-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}