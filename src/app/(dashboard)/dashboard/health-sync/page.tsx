"use client";

import { useState } from "react";

type IntegrationType = "google_fit" | "apple_health" | "fitbit" | "garmin" | "samsung_health" | "mi_fit";
type DataType = "steps" | "calories" | "heart_rate" | "sleep" | "weight" | "water" | "workout";

interface Integration {
  id: IntegrationType;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  lastSync?: Date;
  dataTypes: DataType[];
  description: string;
}

interface HealthData {
  date: string;
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
  heartRate: { avg: number; min: number; max: number };
  sleep: { hours: number; quality: "poor" | "fair" | "good" | "excellent" };
  weight?: number;
  waterIntake: number;
  workouts: { type: string; duration: number; calories: number }[];
}

interface SyncSettings {
  autoSync: boolean;
  syncFrequency: "realtime" | "hourly" | "daily";
  dataTypes: DataType[];
  notifications: boolean;
}

const integrations: Integration[] = [
  {
    id: "google_fit",
    name: "Google Fit",
    icon: "🏃",
    color: "from-blue-500 to-green-500",
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 30),
    dataTypes: ["steps", "calories", "heart_rate", "sleep", "weight", "workout"],
    description: "Sync your fitness data from Google Fit including steps, heart rate, and workouts.",
  },
  {
    id: "apple_health",
    name: "Apple Health",
    icon: "❤️",
    color: "from-red-500 to-pink-500",
    connected: false,
    dataTypes: ["steps", "calories", "heart_rate", "sleep", "weight", "water", "workout"],
    description: "Connect to Apple Health for comprehensive health and fitness tracking.",
  },
  {
    id: "fitbit",
    name: "Fitbit",
    icon: "⌚",
    color: "from-teal-500 to-cyan-500",
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 60 * 2),
    dataTypes: ["steps", "calories", "heart_rate", "sleep", "weight", "water"],
    description: "Sync your Fitbit data including sleep tracking and activity metrics.",
  },
  {
    id: "garmin",
    name: "Garmin Connect",
    icon: "🧭",
    color: "from-blue-600 to-indigo-600",
    connected: false,
    dataTypes: ["steps", "calories", "heart_rate", "sleep", "workout"],
    description: "Connect your Garmin device for advanced workout and performance data.",
  },
  {
    id: "samsung_health",
    name: "Samsung Health",
    icon: "📱",
    color: "from-blue-400 to-purple-500",
    connected: false,
    dataTypes: ["steps", "calories", "heart_rate", "sleep", "weight", "water"],
    description: "Sync data from Samsung Health app and Galaxy wearables.",
  },
  {
    id: "mi_fit",
    name: "Mi Fitness",
    icon: "🟠",
    color: "from-orange-500 to-yellow-500",
    connected: false,
    dataTypes: ["steps", "calories", "heart_rate", "sleep", "weight"],
    description: "Connect your Mi Band or Xiaomi wearables for activity tracking.",
  },
];

const mockHealthData: HealthData[] = [
  {
    date: "2026-02-06",
    steps: 8432,
    caloriesBurned: 2340,
    activeMinutes: 45,
    heartRate: { avg: 72, min: 58, max: 142 },
    sleep: { hours: 7.5, quality: "good" },
    weight: 68.5,
    waterIntake: 2100,
    workouts: [
      { type: "Morning Walk", duration: 30, calories: 150 },
      { type: "Yoga", duration: 20, calories: 80 },
    ],
  },
  {
    date: "2026-02-05",
    steps: 10234,
    caloriesBurned: 2580,
    activeMinutes: 62,
    heartRate: { avg: 74, min: 56, max: 156 },
    sleep: { hours: 6.8, quality: "fair" },
    weight: 68.7,
    waterIntake: 1800,
    workouts: [
      { type: "Running", duration: 35, calories: 320 },
    ],
  },
  {
    date: "2026-02-04",
    steps: 6521,
    caloriesBurned: 2120,
    activeMinutes: 28,
    heartRate: { avg: 70, min: 54, max: 128 },
    sleep: { hours: 8.2, quality: "excellent" },
    waterIntake: 2400,
    workouts: [],
  },
  {
    date: "2026-02-03",
    steps: 12045,
    caloriesBurned: 2890,
    activeMinutes: 78,
    heartRate: { avg: 76, min: 58, max: 168 },
    sleep: { hours: 7.0, quality: "good" },
    weight: 68.9,
    waterIntake: 2200,
    workouts: [
      { type: "HIIT", duration: 25, calories: 280 },
      { type: "Cycling", duration: 45, calories: 350 },
    ],
  },
  {
    date: "2026-02-02",
    steps: 5892,
    caloriesBurned: 1980,
    activeMinutes: 22,
    heartRate: { avg: 68, min: 52, max: 118 },
    sleep: { hours: 5.5, quality: "poor" },
    waterIntake: 1500,
    workouts: [],
  },
  {
    date: "2026-02-01",
    steps: 9876,
    caloriesBurned: 2450,
    activeMinutes: 55,
    heartRate: { avg: 73, min: 56, max: 148 },
    sleep: { hours: 7.8, quality: "good" },
    weight: 69.1,
    waterIntake: 2000,
    workouts: [
      { type: "Swimming", duration: 40, calories: 300 },
    ],
  },
  {
    date: "2026-01-31",
    steps: 7654,
    caloriesBurned: 2210,
    activeMinutes: 38,
    heartRate: { avg: 71, min: 55, max: 135 },
    sleep: { hours: 7.2, quality: "good" },
    waterIntake: 1900,
    workouts: [
      { type: "Weight Training", duration: 45, calories: 200 },
    ],
  },
];

export default function HealthSyncPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "devices" | "data" | "settings">("overview");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [syncSettings, setSyncSettings] = useState<SyncSettings>({
    autoSync: true,
    syncFrequency: "hourly",
    dataTypes: ["steps", "calories", "heart_rate", "sleep"],
    notifications: true,
  });
  const [isSyncing, setIsSyncing] = useState(false);

  const connectedIntegrations = integrations.filter((i) => i.connected);
  const todayData = mockHealthData[0];
  const weeklyAvg = {
    steps: Math.round(mockHealthData.reduce((sum, d) => sum + d.steps, 0) / mockHealthData.length),
    calories: Math.round(mockHealthData.reduce((sum, d) => sum + d.caloriesBurned, 0) / mockHealthData.length),
    sleep: (mockHealthData.reduce((sum, d) => sum + d.sleep.hours, 0) / mockHealthData.length).toFixed(1),
    activeMinutes: Math.round(mockHealthData.reduce((sum, d) => sum + d.activeMinutes, 0) / mockHealthData.length),
  };

  const handleSync = async () => {
    setIsSyncing(true);
    // Simulate sync
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSyncing(false);
  };

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowConnectModal(true);
  };

  const getSleepQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "text-green-600 bg-green-100";
      case "good":
        return "text-blue-600 bg-blue-100";
      case "fair":
        return "text-yellow-600 bg-yellow-100";
      case "poor":
        return "text-red-600 bg-red-100";
      default:
        return "text-neutral-600 bg-neutral-100";
    }
  };

  const getDataTypeIcon = (type: DataType) => {
    switch (type) {
      case "steps":
        return "👟";
      case "calories":
        return "🔥";
      case "heart_rate":
        return "❤️";
      case "sleep":
        return "😴";
      case "weight":
        return "⚖️";
      case "water":
        return "💧";
      case "workout":
        return "🏋️";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Health Sync</h1>
          <p className="text-neutral-600">
            Connect your fitness devices and sync health data
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          <svg
            className={`w-5 h-5 ${isSyncing ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isSyncing ? "Syncing..." : "Sync Now"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 overflow-x-auto">
        {[
          { id: "overview", label: "Overview", icon: "📊" },
          { id: "devices", label: "Devices", icon: "📱" },
          { id: "data", label: "Health Data", icon: "📈" },
          { id: "settings", label: "Settings", icon: "⚙️" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
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

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Today's Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👟</span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Steps</p>
                  <p className="text-2xl font-bold text-neutral-900">{todayData.steps.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.min((todayData.steps / 10000) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1">Goal: 10,000 steps</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Calories</p>
                  <p className="text-2xl font-bold text-neutral-900">{todayData.caloriesBurned.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${Math.min((todayData.caloriesBurned / 2500) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1">Goal: 2,500 kcal</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">❤️</span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Heart Rate</p>
                  <p className="text-2xl font-bold text-neutral-900">{todayData.heartRate.avg} <span className="text-sm font-normal">bpm</span></p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="text-neutral-500">Min: {todayData.heartRate.min}</span>
                <span className="text-neutral-300">|</span>
                <span className="text-neutral-500">Max: {todayData.heartRate.max}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">😴</span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Sleep</p>
                  <p className="text-2xl font-bold text-neutral-900">{todayData.sleep.hours} <span className="text-sm font-normal">hrs</span></p>
                </div>
              </div>
              <div className="mt-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${getSleepQualityColor(todayData.sleep.quality)}`}>
                  {todayData.sleep.quality}
                </span>
              </div>
            </div>
          </div>

          {/* Weekly Averages */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">📅 7-Day Averages</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-neutral-50 rounded-xl">
                <p className="text-3xl font-bold text-blue-600">{weeklyAvg.steps.toLocaleString()}</p>
                <p className="text-sm text-neutral-500">Avg Steps</p>
              </div>
              <div className="text-center p-4 bg-neutral-50 rounded-xl">
                <p className="text-3xl font-bold text-orange-600">{weeklyAvg.calories.toLocaleString()}</p>
                <p className="text-sm text-neutral-500">Avg Calories</p>
              </div>
              <div className="text-center p-4 bg-neutral-50 rounded-xl">
                <p className="text-3xl font-bold text-purple-600">{weeklyAvg.sleep}</p>
                <p className="text-sm text-neutral-500">Avg Sleep (hrs)</p>
              </div>
              <div className="text-center p-4 bg-neutral-50 rounded-xl">
                <p className="text-3xl font-bold text-green-600">{weeklyAvg.activeMinutes}</p>
                <p className="text-sm text-neutral-500">Avg Active Mins</p>
              </div>
            </div>
          </div>

          {/* Today's Workouts */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">🏋️ Today&apos;s Workouts</h2>
            {todayData.workouts.length > 0 ? (
              <div className="space-y-3">
                {todayData.workouts.map((workout, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🏃</span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{workout.type}</p>
                        <p className="text-sm text-neutral-500">{workout.duration} minutes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-orange-600">{workout.calories} kcal</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <span className="text-4xl">🧘</span>
                <p className="mt-2">No workouts recorded today</p>
              </div>
            )}
          </div>

          {/* Connected Devices */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">📱 Connected Devices</h2>
              <button
                onClick={() => setActiveTab("devices")}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Manage →
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {connectedIntegrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full"
                >
                  <span>{integration.icon}</span>
                  <span className="font-medium text-green-700">{integration.name}</span>
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Devices Tab */}
      {activeTab === "devices" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden"
            >
              <div className={`h-20 bg-gradient-to-r ${integration.color} flex items-center justify-center`}>
                <span className="text-4xl">{integration.icon}</span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-neutral-900">{integration.name}</h3>
                  {integration.connected && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Connected
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-500 mb-3">{integration.description}</p>

                {/* Data Types */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {integration.dataTypes.map((type) => (
                    <span
                      key={type}
                      className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full"
                    >
                      {getDataTypeIcon(type)} {type.replace("_", " ")}
                    </span>
                  ))}
                </div>

                {integration.connected ? (
                  <div className="space-y-2">
                    <p className="text-xs text-neutral-500">
                      Last synced: {integration.lastSync?.toLocaleTimeString()}
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors">
                        Sync
                      </button>
                      <button className="flex-1 py-2 border border-red-200 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors">
                        Disconnect
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleConnect(integration)}
                    className="w-full py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Data Tab */}
      {activeTab === "data" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="p-4 border-b border-neutral-100">
              <h2 className="font-semibold text-neutral-900">Health History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Steps</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Calories</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Active Min</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Heart Rate</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Sleep</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {mockHealthData.map((data) => (
                    <tr key={data.date} className="hover:bg-neutral-50">
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900">
                        {new Date(data.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">
                        {data.steps.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">
                        {data.caloriesBurned.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">
                        {data.activeMinutes} min
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">
                        {data.heartRate.avg} bpm
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getSleepQualityColor(data.sleep.quality)}`}>
                          {data.sleep.hours}h - {data.sleep.quality}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">
                        {data.weight ? `${data.weight} kg` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export Data */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">📥 Export Your Data</h3>
            <p className="text-sm text-neutral-500 mb-4">
              Download your health data for personal records or to share with healthcare providers.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-sm">
                Export as CSV
              </button>
              <button className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-sm">
                Export as PDF
              </button>
              <button className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-sm">
                Export as JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Sync Settings</h2>

            {/* Auto Sync */}
            <div className="flex items-center justify-between py-4 border-b border-neutral-100">
              <div>
                <p className="font-medium text-neutral-900">Auto Sync</p>
                <p className="text-sm text-neutral-500">Automatically sync data from connected devices</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncSettings.autoSync}
                  onChange={(e) => setSyncSettings({ ...syncSettings, autoSync: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>

            {/* Sync Frequency */}
            <div className="py-4 border-b border-neutral-100">
              <p className="font-medium text-neutral-900 mb-2">Sync Frequency</p>
              <div className="flex gap-2">
                {["realtime", "hourly", "daily"].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setSyncSettings({ ...syncSettings, syncFrequency: freq as typeof syncSettings.syncFrequency })}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      syncSettings.syncFrequency === freq
                        ? "bg-primary-500 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Data Types to Sync */}
            <div className="py-4 border-b border-neutral-100">
              <p className="font-medium text-neutral-900 mb-3">Data Types to Sync</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(["steps", "calories", "heart_rate", "sleep", "weight", "water", "workout"] as DataType[]).map((type) => (
                  <label
                    key={type}
                    className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                      syncSettings.dataTypes.includes(type)
                        ? "bg-primary-50 border-2 border-primary-500"
                        : "bg-neutral-50 border-2 border-transparent"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={syncSettings.dataTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSyncSettings({
                            ...syncSettings,
                            dataTypes: [...syncSettings.dataTypes, type],
                          });
                        } else {
                          setSyncSettings({
                            ...syncSettings,
                            dataTypes: syncSettings.dataTypes.filter((t) => t !== type),
                          });
                        }
                      }}
                      className="sr-only"
                    />
                    <span>{getDataTypeIcon(type)}</span>
                    <span className="text-sm capitalize">{type.replace("_", " ")}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-neutral-900">Sync Notifications</p>
                <p className="text-sm text-neutral-500">Get notified when data is synced</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncSettings.notifications}
                  onChange={(e) => setSyncSettings({ ...syncSettings, notifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">🔒 Privacy & Data</h2>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-green-800">Your data is encrypted</p>
                    <p className="text-sm text-green-700">All health data is encrypted end-to-end and stored securely.</p>
                  </div>
                </div>
              </div>
              <button className="w-full py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors">
                Delete All Synced Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Modal */}
      {showConnectModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className={`h-24 bg-gradient-to-r ${selectedIntegration.color} flex items-center justify-center rounded-t-2xl`}>
              <span className="text-5xl">{selectedIntegration.icon}</span>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-neutral-900 text-center">
                Connect {selectedIntegration.name}
              </h2>
              <p className="text-neutral-500 text-center mt-2">
                {selectedIntegration.description}
              </p>

              <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
                <p className="text-sm font-medium text-neutral-700 mb-2">Data that will be synced:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedIntegration.dataTypes.map((type) => (
                    <span
                      key={type}
                      className="text-xs bg-white border border-neutral-200 px-2 py-1 rounded-full"
                    >
                      {getDataTypeIcon(type)} {type.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="flex-1 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Simulate connection
                    setShowConnectModal(false);
                  }}
                  className="flex-1 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                >
                  Connect
                </button>
              </div>

              <p className="text-xs text-neutral-400 text-center mt-4">
                By connecting, you agree to share your health data with NepFit
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
