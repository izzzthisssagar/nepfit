"use client";

import { useState } from "react";

type WearableTab = "dashboard" | "watchface" | "actions" | "complications" | "settings";

interface WearableDevice {
  id: string;
  name: string;
  brand: string;
  icon: string;
  battery: number;
  connected: boolean;
  lastSync: string;
  firmware: string;
  model: string;
}

interface WatchFaceMetric {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
  value: string;
  color: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
  description: string;
  tapCount: "single" | "double" | "long";
}

interface Complication {
  id: string;
  name: string;
  type: "circular" | "inline" | "rectangular";
  metric: string;
  value: string;
  icon: string;
  color: string;
}

interface SupportedDevice {
  name: string;
  icon: string;
  minVersion: string;
  features: string[];
  status: "supported" | "coming_soon" | "beta";
}

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const mockDevice: WearableDevice = {
  id: "w1",
  name: "Apple Watch Series 9",
  brand: "Apple",
  icon: "⌚",
  battery: 72,
  connected: true,
  lastSync: "2 minutes ago",
  firmware: "watchOS 11.2",
  model: "45mm GPS + Cellular",
};

const mockWatchMetrics: WatchFaceMetric[] = [
  { id: "wm1", label: "Calories", icon: "🔥", enabled: true, value: "1,450 kcal", color: "bg-orange-500" },
  { id: "wm2", label: "Steps", icon: "👟", enabled: true, value: "8,432", color: "bg-blue-500" },
  { id: "wm3", label: "Water", icon: "💧", enabled: true, value: "6/8 glasses", color: "bg-cyan-500" },
  { id: "wm4", label: "Protein", icon: "🥩", enabled: false, value: "65/120g", color: "bg-red-500" },
  { id: "wm5", label: "Carbs", icon: "🍞", enabled: false, value: "180/250g", color: "bg-yellow-500" },
  { id: "wm6", label: "Heart Rate", icon: "❤️", enabled: true, value: "72 bpm", color: "bg-red-600" },
];

const mockQuickActions: QuickAction[] = [
  { id: "qa1", label: "Log Meal", icon: "🍽️", enabled: true, description: "Quick log a meal from preset favorites", tapCount: "single" },
  { id: "qa2", label: "Log Water", icon: "💧", enabled: true, description: "Add a glass of water intake", tapCount: "single" },
  { id: "qa3", label: "Start Workout", icon: "🏃", enabled: true, description: "Begin a workout session with auto-tracking", tapCount: "double" },
  { id: "qa4", label: "Take Photo", icon: "📷", enabled: false, description: "Open camera for food scanning", tapCount: "single" },
  { id: "qa5", label: "Voice Log", icon: "🎙️", enabled: false, description: "Log food using voice commands", tapCount: "long" },
  { id: "qa6", label: "Barcode Scan", icon: "📊", enabled: true, description: "Scan food barcode from wrist", tapCount: "double" },
];

const mockComplications: Complication[] = [
  { id: "comp1", name: "Daily Calories", type: "circular", metric: "calories", value: "1,450", icon: "🔥", color: "bg-orange-500" },
  { id: "comp2", name: "Steps Today", type: "circular", metric: "steps", value: "8.4K", icon: "👟", color: "bg-blue-500" },
  { id: "comp3", name: "Water Intake", type: "circular", metric: "water", value: "6/8", icon: "💧", color: "bg-cyan-500" },
  { id: "comp4", name: "Macro Summary", type: "inline", metric: "macros", value: "P:65 C:180 F:45", icon: "📊", color: "bg-primary-500" },
  { id: "comp5", name: "Next Meal", type: "inline", metric: "meal", value: "Lunch in 45 min", icon: "⏰", color: "bg-green-500" },
  { id: "comp6", name: "Daily Progress", type: "rectangular", metric: "progress", value: "68%", icon: "📈", color: "bg-purple-500" },
  { id: "comp7", name: "Calorie Budget", type: "rectangular", metric: "budget", value: "550 kcal left", icon: "🎯", color: "bg-primary-600" },
];

const supportedDevices: SupportedDevice[] = [
  { name: "Apple Watch Series 6+", icon: "⌚", minVersion: "watchOS 9+", features: ["Full app", "Complications", "Quick actions", "Siri"], status: "supported" },
  { name: "WearOS 3+ Devices", icon: "⌚", minVersion: "WearOS 3.0+", features: ["Full app", "Tiles", "Quick actions", "Assistant"], status: "supported" },
  { name: "Garmin Watches", icon: "🧭", minVersion: "Connect IQ 4.0+", features: ["Data fields", "Widget", "Quick log"], status: "supported" },
  { name: "Fitbit Versa 3+", icon: "📱", minVersion: "Fitbit OS 5.3+", features: ["App", "Quick log", "Notifications"], status: "beta" },
  { name: "Samsung Galaxy Watch 4+", icon: "⌚", minVersion: "WearOS 3.5+", features: ["Full app", "Tiles", "Bixby"], status: "supported" },
  { name: "Amazfit GTR 4", icon: "⌚", minVersion: "Zepp OS 2.0+", features: ["Widget", "Notifications"], status: "coming_soon" },
];

const mockNotificationSettings: NotificationSetting[] = [
  { id: "n1", label: "Meal Reminders", description: "Get notified when it is time to eat", enabled: true },
  { id: "n2", label: "Water Reminders", description: "Hourly hydration reminders", enabled: true },
  { id: "n3", label: "Calorie Alerts", description: "Alert when approaching daily limit", enabled: true },
  { id: "n4", label: "Workout Summary", description: "Post-workout nutrition suggestions", enabled: false },
  { id: "n5", label: "Goal Celebrations", description: "Celebrate when daily goals are met", enabled: true },
  { id: "n6", label: "Inactivity Alerts", description: "Remind to move after long sitting", enabled: false },
];

export default function WearablePage() {
  const [activeTab, setActiveTab] = useState<WearableTab>("dashboard");
  const [watchMetrics, setWatchMetrics] = useState(mockWatchMetrics);
  const [quickActions, setQuickActions] = useState(mockQuickActions);
  const [notifications, setNotifications] = useState(mockNotificationSettings);
  const [isPairing, setIsPairing] = useState(false);
  const [pairingStep, setPairingStep] = useState(0);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [alwaysOnDisplay, setAlwaysOnDisplay] = useState(false);

  const toggleMetric = (id: string) => {
    setWatchMetrics((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const toggleAction = (id: string) => {
    setQuickActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  const startPairing = () => {
    setIsPairing(true);
    setPairingStep(1);
    setTimeout(() => setPairingStep(2), 1500);
    setTimeout(() => setPairingStep(3), 3000);
    setTimeout(() => {
      setPairingStep(4);
      setTimeout(() => setIsPairing(false), 2000);
    }, 4500);
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return "bg-green-500";
    if (level > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Wearable App</h1>
          <p className="text-neutral-600">Manage your smartwatch companion app</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${mockDevice.connected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
          <span className="text-sm text-neutral-600">{mockDevice.connected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 overflow-x-auto">
        {([
          { id: "dashboard", label: "Dashboard", icon: "📊" },
          { id: "watchface", label: "Watch Face", icon: "⌚" },
          { id: "actions", label: "Quick Actions", icon: "⚡" },
          { id: "complications", label: "Complications", icon: "🔧" },
          { id: "settings", label: "Settings", icon: "⚙️" },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "text-primary-600 border-b-2 border-primary-500"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Device Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-neutral-900 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">{mockDevice.icon}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-neutral-900">{mockDevice.name}</h2>
                <p className="text-sm text-neutral-500">{mockDevice.model}</p>
                <p className="text-xs text-neutral-400 mt-1">{mockDevice.firmware}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <div className="w-8 h-4 bg-neutral-200 rounded-sm overflow-hidden relative">
                    <div className={`h-full ${getBatteryColor(mockDevice.battery)} rounded-sm`} style={{ width: `${mockDevice.battery}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-neutral-900">{mockDevice.battery}%</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">Synced {mockDevice.lastSync}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats from Watch */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {watchMetrics.filter((m) => m.enabled).map((metric) => (
              <div key={metric.id} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{metric.icon}</span>
                  <span className="text-sm text-neutral-500">{metric.label}</span>
                </div>
                <p className="text-xl font-bold text-neutral-900">{metric.value}</p>
                <div className="mt-2 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div className={`h-full ${metric.color} rounded-full`} style={{ width: `${60 + Math.random() * 30}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Log from Wrist */}
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-6 border border-primary-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">Quick Log from Wrist</h2>
            <p className="text-sm text-neutral-600 mb-4">
              Log meals, water, and workouts directly from your smartwatch with one tap.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Log Meal", icon: "🍽️", count: "3 today" },
                { label: "Log Water", icon: "💧", count: "6 glasses" },
                { label: "Log Workout", icon: "🏃", count: "1 session" },
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 text-center">
                  <span className="text-3xl">{item.icon}</span>
                  <p className="font-medium text-neutral-900 mt-2 text-sm">{item.label}</p>
                  <p className="text-xs text-neutral-500 mt-1">{item.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pairing Flow */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Device Pairing</h2>
            {isPairing ? (
              <div className="space-y-4">
                {[
                  { step: 1, label: "Searching for devices..." },
                  { step: 2, label: "Device found. Connecting..." },
                  { step: 3, label: "Syncing NepFit data..." },
                  { step: 4, label: "Pairing complete!" },
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      pairingStep >= s.step
                        ? pairingStep === s.step
                          ? "bg-primary-500 text-white animate-pulse"
                          : "bg-green-500 text-white"
                        : "bg-neutral-200 text-neutral-400"
                    }`}>
                      {pairingStep > s.step ? "✓" : s.step}
                    </div>
                    <span className={`text-sm ${pairingStep >= s.step ? "text-neutral-900" : "text-neutral-400"}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-neutral-500 mb-4">Pair a new wearable device to sync nutrition data.</p>
                <button
                  onClick={startPairing}
                  className="px-6 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-sm font-medium"
                >
                  Pair New Device
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Watch Face Tab */}
      {activeTab === "watchface" && (
        <div className="space-y-6">
          {/* Watch Face Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Watch Face Preview</h2>
            <div className="flex justify-center">
              <div className="w-56 h-56 bg-neutral-900 rounded-[56px] p-4 relative shadow-2xl border-4 border-neutral-700">
                <div className="w-full h-full rounded-[42px] bg-gradient-to-br from-neutral-800 to-neutral-900 flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Time */}
                  <p className="text-white text-3xl font-bold tracking-wider">10:42</p>
                  <p className="text-neutral-400 text-xs mt-0.5">Thursday, Feb 6</p>
                  {/* Metric Slots */}
                  <div className="flex gap-3 mt-3">
                    {watchMetrics
                      .filter((m) => m.enabled)
                      .slice(0, 3)
                      .map((m) => (
                        <div key={m.id} className="text-center">
                          <span className="text-sm">{m.icon}</span>
                          <p className="text-white text-[10px] font-medium mt-0.5">
                            {m.value.split(" ")[0]}
                          </p>
                        </div>
                      ))}
                  </div>
                  {/* Progress Ring */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                    <div className="w-16 h-1 bg-neutral-700 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-primary-500 rounded-full" />
                    </div>
                  </div>
                </div>
                {/* Crown Button */}
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-2 h-8 bg-neutral-600 rounded-r-sm" />
              </div>
            </div>
          </div>

          {/* Customize Metrics */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Customize Watch Face Metrics</h2>
            <p className="text-sm text-neutral-500 mb-4">Choose which metrics to display on your watch face.</p>
            <div className="space-y-3">
              {watchMetrics.map((metric) => (
                <div key={metric.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${metric.enabled ? metric.color : "bg-neutral-300"} rounded-lg flex items-center justify-center`}>
                      <span className="text-xl">{metric.icon}</span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{metric.label}</p>
                      <p className="text-sm text-neutral-500">{metric.value}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={metric.enabled}
                      onChange={() => toggleMetric(metric.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Tab */}
      {activeTab === "actions" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">Quick Actions</h2>
            <p className="text-sm text-neutral-500 mb-4">Configure actions accessible from your wrist with taps and gestures.</p>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <div key={action.id} className={`p-4 rounded-xl border transition-colors ${
                  action.enabled ? "bg-white border-primary-200" : "bg-neutral-50 border-neutral-100"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        action.enabled ? "bg-primary-100" : "bg-neutral-200"
                      }`}>
                        <span className="text-2xl">{action.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{action.label}</p>
                        <p className="text-sm text-neutral-500">{action.description}</p>
                        <div className="mt-1">
                          <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                            {action.tapCount === "single" ? "Single Tap" : action.tapCount === "double" ? "Double Tap" : "Long Press"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={action.enabled}
                        onChange={() => toggleAction(action.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Complications Tab */}
      {activeTab === "complications" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">Watch Complications</h2>
            <p className="text-sm text-neutral-500 mb-4">Small widgets that display nutrition data on your watch face.</p>

            {/* Circular Complications */}
            <h3 className="font-medium text-neutral-700 mb-3 mt-6">Circular</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {mockComplications.filter((c) => c.type === "circular").map((comp) => (
                <div key={comp.id} className="text-center">
                  <div className="w-20 h-20 mx-auto bg-neutral-900 rounded-full flex flex-col items-center justify-center border-4 border-neutral-700 relative">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#374151" strokeWidth="3" />
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray={`${(65 + Math.random() * 30) * 2.136} 213.6`} strokeDashoffset="0" transform="rotate(-90 40 40)" strokeLinecap="round" />
                    </svg>
                    <span className="text-sm">{comp.icon}</span>
                    <p className="text-white text-[10px] font-bold">{comp.value}</p>
                  </div>
                  <p className="text-xs text-neutral-600 mt-2">{comp.name}</p>
                </div>
              ))}
            </div>

            {/* Inline Complications */}
            <h3 className="font-medium text-neutral-700 mb-3">Inline</h3>
            <div className="space-y-3 mb-6">
              {mockComplications.filter((c) => c.type === "inline").map((comp) => (
                <div key={comp.id} className="bg-neutral-900 rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="text-lg">{comp.icon}</span>
                  <p className="text-white text-sm font-medium">{comp.name}:</p>
                  <p className="text-neutral-300 text-sm">{comp.value}</p>
                </div>
              ))}
            </div>

            {/* Rectangular Complications */}
            <h3 className="font-medium text-neutral-700 mb-3">Rectangular</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockComplications.filter((c) => c.type === "rectangular").map((comp) => (
                <div key={comp.id} className="bg-neutral-900 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{comp.icon}</span>
                    <p className="text-neutral-400 text-xs">{comp.name}</p>
                  </div>
                  <p className="text-white text-xl font-bold">{comp.value}</p>
                  <div className="mt-2 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                    <div className={`h-full ${comp.color} rounded-full`} style={{ width: `${50 + Math.random() * 40}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          {/* Notification Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Wearable Notifications</h2>
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div key={notif.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                  <div>
                    <p className="font-medium text-neutral-900">{notif.label}</p>
                    <p className="text-sm text-neutral-500">{notif.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notif.enabled}
                      onChange={() => toggleNotification(notif.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Display Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Display Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <div>
                  <p className="font-medium text-neutral-900">Haptic Feedback</p>
                  <p className="text-sm text-neutral-500">Vibrate on logging actions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={hapticFeedback} onChange={(e) => setHapticFeedback(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-neutral-900">Always-on Display</p>
                  <p className="text-sm text-neutral-500">Keep NepFit metrics visible (uses more battery)</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={alwaysOnDisplay} onChange={(e) => setAlwaysOnDisplay(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Supported Devices */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Supported Devices</h2>
            <div className="space-y-3">
              {supportedDevices.map((device, idx) => (
                <div key={idx} className="p-4 bg-neutral-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{device.icon}</span>
                      <div>
                        <p className="font-medium text-neutral-900">{device.name}</p>
                        <p className="text-xs text-neutral-500">{device.minVersion}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      device.status === "supported"
                        ? "bg-green-100 text-green-700"
                        : device.status === "beta"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-neutral-100 text-neutral-600"
                    }`}>
                      {device.status === "coming_soon" ? "Coming Soon" : device.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {device.features.map((f, fi) => (
                      <span key={fi} className="text-xs bg-white border border-neutral-200 text-neutral-600 px-2 py-0.5 rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
