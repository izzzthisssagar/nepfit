"use client";

import { useState } from "react";

interface BloodPressureReading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  timestamp: Date;
  position: "sitting" | "standing" | "lying";
  arm: "left" | "right";
  notes?: string;
}

interface HeartRateReading {
  id: string;
  bpm: number;
  type: "resting" | "active" | "post-exercise" | "sleep";
  timestamp: Date;
  duration?: number;
}

interface CardioSession {
  id: string;
  activity: string;
  duration: number;
  avgHeartRate: number;
  maxHeartRate: number;
  caloriesBurned: number;
  zone: string;
  timestamp: Date;
}

const mockBPReadings: BloodPressureReading[] = [
  { id: "1", systolic: 118, diastolic: 78, pulse: 72, timestamp: new Date(), position: "sitting", arm: "left" },
  { id: "2", systolic: 122, diastolic: 80, pulse: 75, timestamp: new Date(Date.now() - 86400000), position: "sitting", arm: "left" },
  { id: "3", systolic: 125, diastolic: 82, pulse: 70, timestamp: new Date(Date.now() - 86400000 * 2), position: "sitting", arm: "left" },
  { id: "4", systolic: 120, diastolic: 79, pulse: 68, timestamp: new Date(Date.now() - 86400000 * 3), position: "sitting", arm: "left" },
];

const mockHeartRateData: HeartRateReading[] = [
  { id: "1", bpm: 68, type: "resting", timestamp: new Date() },
  { id: "2", bpm: 142, type: "active", timestamp: new Date(Date.now() - 3600000), duration: 30 },
  { id: "3", bpm: 58, type: "sleep", timestamp: new Date(Date.now() - 28800000) },
];

const mockCardioSessions: CardioSession[] = [
  { id: "1", activity: "Running", duration: 35, avgHeartRate: 148, maxHeartRate: 172, caloriesBurned: 380, zone: "Cardio", timestamp: new Date() },
  { id: "2", activity: "Cycling", duration: 45, avgHeartRate: 132, maxHeartRate: 155, caloriesBurned: 420, zone: "Fat Burn", timestamp: new Date(Date.now() - 86400000) },
  { id: "3", activity: "HIIT", duration: 25, avgHeartRate: 158, maxHeartRate: 185, caloriesBurned: 310, zone: "Peak", timestamp: new Date(Date.now() - 86400000 * 2) },
];

const heartRateZones = [
  { name: "Rest", min: 0, max: 60, color: "bg-gray-400", description: "Recovery zone" },
  { name: "Fat Burn", min: 60, max: 70, color: "bg-blue-400", description: "50-60% max HR" },
  { name: "Cardio", min: 70, max: 80, color: "bg-green-500", description: "60-70% max HR" },
  { name: "Hard", min: 80, max: 90, color: "bg-orange-500", description: "70-85% max HR" },
  { name: "Peak", min: 90, max: 100, color: "bg-red-500", description: "85-100% max HR" },
];

const getBPCategory = (systolic: number, diastolic: number): { label: string; color: string } => {
  if (systolic < 120 && diastolic < 80) return { label: "Normal", color: "text-green-600 bg-green-100" };
  if (systolic < 130 && diastolic < 80) return { label: "Elevated", color: "text-yellow-600 bg-yellow-100" };
  if (systolic < 140 || diastolic < 90) return { label: "High (Stage 1)", color: "text-orange-600 bg-orange-100" };
  if (systolic >= 140 || diastolic >= 90) return { label: "High (Stage 2)", color: "text-red-600 bg-red-100" };
  return { label: "Normal", color: "text-green-600 bg-green-100" };
};

export default function HeartPage() {
  const [activeTab, setActiveTab] = useState<"bp" | "heartrate" | "cardio" | "health">("bp");
  const [showAddBPModal, setShowAddBPModal] = useState(false);
  const [showAddHRModal, setShowAddHRModal] = useState(false);

  const latestBP = mockBPReadings[0];
  const avgRestingHR = 68;
  const maxHR = 185; // Usually 220 - age

  const getHeartRateZone = (bpm: number): string => {
    const percentage = (bpm / maxHR) * 100;
    if (percentage < 60) return "Rest";
    if (percentage < 70) return "Fat Burn";
    if (percentage < 80) return "Cardio";
    if (percentage < 90) return "Hard";
    return "Peak";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-rose-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Heart Health</h1>
          <p className="text-gray-600 mt-1">Monitor your cardiovascular health</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-500">❤️</span>
              <span className="text-sm text-gray-500">Resting HR</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{avgRestingHR} <span className="text-sm font-normal">bpm</span></p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-pink-500">💓</span>
              <span className="text-sm text-gray-500">Blood Pressure</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {latestBP.systolic}/{latestBP.diastolic}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-orange-500">🔥</span>
              <span className="text-sm text-gray-500">Cardio This Week</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">105 <span className="text-sm font-normal">min</span></p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-500">💚</span>
              <span className="text-sm text-gray-500">Heart Score</span>
            </div>
            <p className="text-2xl font-bold text-green-600">Good</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "bp", label: "Blood Pressure", icon: "💓" },
            { id: "heartrate", label: "Heart Rate", icon: "❤️" },
            { id: "cardio", label: "Cardio", icon: "🏃" },
            { id: "health", label: "Heart Health", icon: "🫀" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-red-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-red-50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Blood Pressure Tab */}
        {activeTab === "bp" && (
          <div className="space-y-6">
            {/* Latest Reading */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Latest Reading</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${getBPCategory(latestBP.systolic, latestBP.diastolic).color}`}>
                  {getBPCategory(latestBP.systolic, latestBP.diastolic).label}
                </span>
              </div>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <p className="text-5xl font-bold text-gray-900">{latestBP.systolic}</p>
                  <p className="text-sm text-gray-500">Systolic</p>
                </div>
                <span className="text-3xl text-gray-300">/</span>
                <div className="text-center">
                  <p className="text-5xl font-bold text-gray-900">{latestBP.diastolic}</p>
                  <p className="text-sm text-gray-500">Diastolic</p>
                </div>
                <div className="text-center ml-4 pl-4 border-l border-gray-200">
                  <p className="text-3xl font-bold text-red-500">{latestBP.pulse}</p>
                  <p className="text-sm text-gray-500">Pulse</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 text-center mt-4">
                {latestBP.timestamp.toLocaleDateString()} • {latestBP.position} • {latestBP.arm} arm
              </p>
            </div>

            {/* Add Reading Button */}
            <button
              onClick={() => setShowAddBPModal(true)}
              className="w-full p-4 bg-red-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2"
            >
              + Log Blood Pressure
            </button>

            {/* BP History */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">History</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {mockBPReadings.map((reading) => {
                  const category = getBPCategory(reading.systolic, reading.diastolic);
                  return (
                    <div key={reading.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {reading.systolic}/{reading.diastolic} mmHg
                        </p>
                        <p className="text-sm text-gray-500">
                          Pulse: {reading.pulse} bpm • {reading.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${category.color}`}>
                        {category.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BP Guide */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Blood Pressure Categories</h3>
              <div className="space-y-3">
                {[
                  { label: "Normal", range: "<120 / <80", color: "bg-green-500" },
                  { label: "Elevated", range: "120-129 / <80", color: "bg-yellow-500" },
                  { label: "High (Stage 1)", range: "130-139 / 80-89", color: "bg-orange-500" },
                  { label: "High (Stage 2)", range: "≥140 / ≥90", color: "bg-red-500" },
                ].map((cat) => (
                  <div key={cat.label} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${cat.color}`} />
                    <span className="font-medium text-gray-700 w-28">{cat.label}</span>
                    <span className="text-gray-500">{cat.range} mmHg</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Heart Rate Tab */}
        {activeTab === "heartrate" && (
          <div className="space-y-6">
            {/* Current Heart Rate */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white">
              <p className="text-red-100">Resting Heart Rate</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-5xl font-bold">{avgRestingHR}</span>
                <span className="text-xl">bpm</span>
                <div className="ml-auto">
                  <span className="text-6xl animate-pulse">❤️</span>
                </div>
              </div>
              <p className="text-red-100 text-sm mt-2">Average over last 7 days</p>
            </div>

            {/* Heart Rate Zones */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Heart Rate Zones</h3>
              <div className="space-y-3">
                {heartRateZones.map((zone) => {
                  const minBPM = Math.round((zone.min / 100) * maxHR);
                  const maxBPM = Math.round((zone.max / 100) * maxHR);
                  return (
                    <div key={zone.name} className="flex items-center gap-3">
                      <div className={`w-4 h-8 rounded ${zone.color}`} />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">{zone.name}</span>
                          <span className="text-gray-500">{minBPM}-{maxBPM} bpm</span>
                        </div>
                        <p className="text-xs text-gray-400">{zone.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Based on max heart rate of {maxHR} bpm
              </p>
            </div>

            {/* Today's Heart Rate */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Today's Readings</h3>
              <div className="h-32 flex items-end justify-between gap-1">
                {Array.from({ length: 24 }, (_, i) => {
                  const hr = 60 + Math.random() * 40 + (i > 8 && i < 20 ? 20 : 0);
                  const zone = getHeartRateZone(hr);
                  const zoneColor = heartRateZones.find(z => z.name === zone)?.color || "bg-gray-400";
                  return (
                    <div
                      key={i}
                      className={`flex-1 ${zoneColor} rounded-t-sm`}
                      style={{ height: `${(hr / 180) * 100}%` }}
                      title={`${Math.round(hr)} bpm`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>12 AM</span>
                <span>6 AM</span>
                <span>12 PM</span>
                <span>6 PM</span>
                <span>Now</span>
              </div>
            </div>

            {/* Recent Readings */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Readings</h3>
              <div className="space-y-3">
                {mockHeartRateData.map((reading) => (
                  <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {reading.type === "resting" ? "😌" : reading.type === "active" ? "🏃" : "😴"}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{reading.type}</p>
                        <p className="text-sm text-gray-500">
                          {reading.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-red-500">{reading.bpm}</span>
                      <span className="text-sm text-gray-500 ml-1">bpm</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cardio Tab */}
        {activeTab === "cardio" && (
          <div className="space-y-6">
            {/* Weekly Summary */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-4">This Week's Cardio</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">105</p>
                  <p className="text-sm opacity-80">Minutes</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">1,110</p>
                  <p className="text-sm opacity-80">Calories</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">3</p>
                  <p className="text-sm opacity-80">Sessions</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Weekly Goal</span>
                  <span>105/150 min</span>
                </div>
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: "70%" }} />
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Recent Sessions</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {mockCardioSessions.map((session) => (
                  <div key={session.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {session.activity === "Running" ? "🏃" : session.activity === "Cycling" ? "🚴" : "💪"}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-900">{session.activity}</p>
                          <p className="text-sm text-gray-500">
                            {session.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        session.zone === "Peak" ? "bg-red-100 text-red-700" :
                        session.zone === "Cardio" ? "bg-green-100 text-green-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {session.zone} Zone
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-gray-900">{session.duration}</p>
                        <p className="text-xs text-gray-500">min</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-red-500">{session.avgHeartRate}</p>
                        <p className="text-xs text-gray-500">avg bpm</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-red-600">{session.maxHeartRate}</p>
                        <p className="text-xs text-gray-500">max bpm</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-orange-500">{session.caloriesBurned}</p>
                        <p className="text-xs text-gray-500">cal</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Log Session */}
            <button className="w-full p-4 bg-red-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2">
              + Log Cardio Session
            </button>
          </div>
        )}

        {/* Heart Health Tab */}
        {activeTab === "health" && (
          <div className="space-y-6">
            {/* Heart Health Score */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Heart Health Score</h3>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="88" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                    <circle
                      cx="96" cy="96" r="88" fill="none" stroke="#22c55e" strokeWidth="12"
                      strokeLinecap="round" strokeDasharray={2 * Math.PI * 88}
                      strokeDashoffset={2 * Math.PI * 88 * (1 - 0.78)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">78</span>
                    <span className="text-sm text-gray-500">out of 100</span>
                    <span className="text-green-600 font-medium mt-1">Good</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Factors */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Health Factors</h3>
              <div className="space-y-4">
                {[
                  { name: "Blood Pressure", score: 85, status: "Excellent", icon: "💓" },
                  { name: "Resting Heart Rate", score: 80, status: "Good", icon: "❤️" },
                  { name: "Cardio Fitness", score: 70, status: "Fair", icon: "🏃" },
                  { name: "Heart Rate Recovery", score: 75, status: "Good", icon: "📈" },
                ].map((factor) => (
                  <div key={factor.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span>{factor.icon}</span>
                        <span className="text-gray-700">{factor.name}</span>
                      </div>
                      <span className={`text-sm font-medium ${
                        factor.score >= 80 ? "text-green-600" : factor.score >= 60 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {factor.status}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          factor.score >= 80 ? "bg-green-500" : factor.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recommendations</h3>
              <div className="space-y-3">
                {[
                  { icon: "🏃", text: "Add 2 more cardio sessions per week to improve fitness" },
                  { icon: "🧘", text: "Practice stress-reduction techniques for better heart rate variability" },
                  { icon: "🥗", text: "Reduce sodium intake to maintain healthy blood pressure" },
                  { icon: "😴", text: "Aim for 7-9 hours of sleep for optimal heart recovery" },
                ].map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-xl">{rec.icon}</span>
                    <p className="text-gray-700">{rec.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Connect Devices */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">Connect Your Devices</h3>
              <p className="text-sm opacity-90 mb-4">
                Sync with wearables for automatic heart rate tracking
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white text-red-600 rounded-lg font-medium text-sm">
                  Apple Watch
                </button>
                <button className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium text-sm">
                  Fitbit
                </button>
                <button className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium text-sm">
                  Garmin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add BP Modal */}
        {showAddBPModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Log Blood Pressure</h3>
                <button onClick={() => setShowAddBPModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Systolic</label>
                    <input type="number" className="w-full p-3 text-center text-2xl border border-gray-200 rounded-xl" placeholder="120" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic</label>
                    <input type="number" className="w-full p-3 text-center text-2xl border border-gray-200 rounded-xl" placeholder="80" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pulse (optional)</label>
                  <input type="number" className="w-full p-3 border border-gray-200 rounded-xl" placeholder="72" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <select className="w-full p-3 border border-gray-200 rounded-xl">
                      <option>Sitting</option>
                      <option>Standing</option>
                      <option>Lying</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Arm</label>
                    <select className="w-full p-3 border border-gray-200 rounded-xl">
                      <option>Left</option>
                      <option>Right</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-3">
                <button onClick={() => setShowAddBPModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium">
                  Cancel
                </button>
                <button className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium">
                  Save Reading
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
