"use client";

import { useState } from "react";

interface GlucoseReading {
  id: string;
  value: number;
  unit: "mg/dL" | "mmol/L";
  timing: "fasting" | "before-meal" | "after-meal" | "bedtime" | "random";
  mealContext?: string;
  notes?: string;
  timestamp: Date;
}

interface A1CReading {
  id: string;
  value: number;
  date: Date;
  lab?: string;
}

interface GlucoseStats {
  average: number;
  inRange: number;
  high: number;
  low: number;
  estimatedA1C: number;
}

const mockReadings: GlucoseReading[] = [
  { id: "1", value: 95, unit: "mg/dL", timing: "fasting", timestamp: new Date(), notes: "Good morning reading" },
  { id: "2", value: 142, unit: "mg/dL", timing: "after-meal", mealContext: "Lunch - pasta", timestamp: new Date(Date.now() - 3600000) },
  { id: "3", value: 88, unit: "mg/dL", timing: "before-meal", timestamp: new Date(Date.now() - 7200000) },
  { id: "4", value: 156, unit: "mg/dL", timing: "after-meal", mealContext: "Dinner", timestamp: new Date(Date.now() - 86400000) },
  { id: "5", value: 92, unit: "mg/dL", timing: "fasting", timestamp: new Date(Date.now() - 86400000) },
  { id: "6", value: 118, unit: "mg/dL", timing: "bedtime", timestamp: new Date(Date.now() - 86400000 * 2) },
];

const mockA1CHistory: A1CReading[] = [
  { id: "1", value: 6.2, date: new Date(Date.now() - 90 * 86400000), lab: "Quest Diagnostics" },
  { id: "2", value: 6.5, date: new Date(Date.now() - 180 * 86400000), lab: "LabCorp" },
  { id: "3", value: 6.8, date: new Date(Date.now() - 270 * 86400000), lab: "Quest Diagnostics" },
];

const mockStats: GlucoseStats = {
  average: 112,
  inRange: 78,
  high: 15,
  low: 7,
  estimatedA1C: 5.8,
};

const timingLabels: Record<string, { label: string; icon: string; color: string }> = {
  fasting: { label: "Fasting", icon: "🌅", color: "bg-blue-100 text-blue-700" },
  "before-meal": { label: "Before Meal", icon: "🍽️", color: "bg-yellow-100 text-yellow-700" },
  "after-meal": { label: "After Meal", icon: "🍴", color: "bg-orange-100 text-orange-700" },
  bedtime: { label: "Bedtime", icon: "🌙", color: "bg-purple-100 text-purple-700" },
  random: { label: "Random", icon: "🎲", color: "bg-gray-100 text-gray-700" },
};

const targetRanges = {
  fasting: { low: 70, high: 100 },
  "before-meal": { low: 70, high: 130 },
  "after-meal": { low: 70, high: 180 },
  bedtime: { low: 90, high: 150 },
  random: { low: 70, high: 140 },
};

export default function BloodSugarPage() {
  const [activeTab, setActiveTab] = useState<"log" | "trends" | "a1c" | "insights">("log");
  const [readings] = useState<GlucoseReading[]>(mockReadings);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTiming, setSelectedTiming] = useState<string>("fasting");
  const [newReading, setNewReading] = useState("");
  const [unit, setUnit] = useState<"mg/dL" | "mmol/L">("mg/dL");

  const getReadingStatus = (value: number, timing: string): "low" | "normal" | "high" => {
    const range = targetRanges[timing as keyof typeof targetRanges] || targetRanges.random;
    if (value < range.low) return "low";
    if (value > range.high) return "high";
    return "normal";
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "low":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-green-600 bg-green-100";
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const convertToMmol = (mgdl: number): number => {
    return Math.round((mgdl / 18) * 10) / 10;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Blood Sugar Tracker</h1>
          <p className="text-gray-600 mt-1">Monitor your glucose levels</p>
        </div>

        {/* Quick Log Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full mb-6 p-4 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          <span className="text-2xl">🩸</span>
          Log Blood Sugar Reading
        </button>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "log", label: "Log", icon: "📝" },
            { id: "trends", label: "Trends", icon: "📈" },
            { id: "a1c", label: "A1C", icon: "🔬" },
            { id: "insights", label: "Insights", icon: "💡" },
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

        {/* Log Tab */}
        {activeTab === "log" && (
          <div className="space-y-6">
            {/* Today's Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-500">Average</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.average}</p>
                <p className="text-xs text-gray-500">mg/dL</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-500">In Range</p>
                <p className="text-2xl font-bold text-green-600">{mockStats.inRange}%</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-500">High</p>
                <p className="text-2xl font-bold text-orange-600">{mockStats.high}%</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-500">Low</p>
                <p className="text-2xl font-bold text-red-600">{mockStats.low}%</p>
              </div>
            </div>

            {/* Recent Readings */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Recent Readings</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {readings.map((reading) => {
                  const timing = timingLabels[reading.timing];
                  const status = getReadingStatus(reading.value, reading.timing);
                  return (
                    <div key={reading.id} className="p-4 flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center ${getStatusColor(
                          status
                        )}`}
                      >
                        <span className="text-2xl font-bold">{reading.value}</span>
                        <span className="text-xs">{reading.unit}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${timing.color}`}>
                            {timing.icon} {timing.label}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(reading.timestamp)} at {formatTime(reading.timestamp)}
                        </p>
                        {reading.mealContext && (
                          <p className="text-sm text-gray-600 mt-1">🍽️ {reading.mealContext}</p>
                        )}
                        {reading.notes && (
                          <p className="text-sm text-gray-500 italic mt-1">"{reading.notes}"</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === "trends" && (
          <div className="space-y-6">
            {/* Time Range Selector */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex gap-2">
                {["7 Days", "14 Days", "30 Days", "90 Days"].map((range) => (
                  <button
                    key={range}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Glucose Chart */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Glucose Levels</h3>
              <div className="relative h-48">
                {/* Target Range Band */}
                <div className="absolute left-0 right-0 top-1/4 bottom-1/4 bg-green-50 border-y border-green-200" />

                {/* Chart */}
                <div className="h-full flex items-end justify-between gap-1 relative z-10">
                  {[95, 142, 88, 156, 92, 118, 105, 134, 98, 127, 91, 145, 102, 115].map(
                    (value, idx) => {
                      const height = (value / 200) * 100;
                      const status = value > 140 ? "bg-orange-400" : value < 70 ? "bg-red-400" : "bg-green-500";
                      return (
                        <div
                          key={idx}
                          className="flex-1 flex flex-col items-center justify-end"
                        >
                          <div
                            className={`w-full ${status} rounded-t-sm transition-all`}
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Jan 25</span>
                <span>Feb 7</span>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span>In Range</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-400 rounded" />
                  <span>High</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-400 rounded" />
                  <span>Low</span>
                </div>
              </div>
            </div>

            {/* Time of Day Patterns */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Time of Day Patterns</h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { time: "Morning", avg: 98, icon: "🌅" },
                  { time: "Afternoon", avg: 125, icon: "☀️" },
                  { time: "Evening", avg: 142, icon: "🌆" },
                  { time: "Night", avg: 108, icon: "🌙" },
                ].map((period) => (
                  <div key={period.time} className="text-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-2xl">{period.icon}</span>
                    <p className="text-lg font-bold text-gray-900 mt-1">{period.avg}</p>
                    <p className="text-xs text-gray-500">{period.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Meal Impact */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Meal Impact</h3>
              <div className="space-y-4">
                {[
                  { meal: "High-carb meals", spike: 65, color: "bg-red-500" },
                  { meal: "Protein-rich meals", spike: 25, color: "bg-yellow-500" },
                  { meal: "Low-carb meals", spike: 15, color: "bg-green-500" },
                ].map((item) => (
                  <div key={item.meal}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.meal}</span>
                      <span className="font-medium">+{item.spike} mg/dL avg</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.spike}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* A1C Tab */}
        {activeTab === "a1c" && (
          <div className="space-y-6">
            {/* Current Estimated A1C */}
            <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl p-6 text-white">
              <p className="text-red-100">Estimated A1C (based on readings)</p>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-5xl font-bold">{mockStats.estimatedA1C}</span>
                <span className="text-xl mb-1">%</span>
              </div>
              <p className="text-red-100 text-sm mt-2">
                Based on average glucose of {mockStats.average} mg/dL
              </p>
            </div>

            {/* A1C Range Guide */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">A1C Reference Guide</h3>
              <div className="relative h-8 rounded-full overflow-hidden mb-4">
                <div className="absolute inset-0 flex">
                  <div className="flex-1 bg-green-400" />
                  <div className="flex-1 bg-yellow-400" />
                  <div className="flex-1 bg-orange-400" />
                  <div className="flex-1 bg-red-400" />
                </div>
                <div
                  className="absolute top-0 bottom-0 w-1 bg-black"
                  style={{ left: `${((mockStats.estimatedA1C - 4) / 6) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Normal (&lt;5.7%)</span>
                <span>Prediabetes (5.7-6.4%)</span>
                <span>Diabetes (&gt;6.5%)</span>
              </div>
            </div>

            {/* A1C History */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Lab Results History</h3>
              <div className="space-y-4">
                {mockA1CHistory.map((reading) => (
                  <div
                    key={reading.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {reading.date.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      {reading.lab && (
                        <p className="text-sm text-gray-500">{reading.lab}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">
                        {reading.value}%
                      </span>
                      {mockA1CHistory.indexOf(reading) > 0 && (
                        <p
                          className={`text-sm ${
                            reading.value < mockA1CHistory[mockA1CHistory.indexOf(reading) - 1].value
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {reading.value < mockA1CHistory[mockA1CHistory.indexOf(reading) - 1].value
                            ? "↓"
                            : "↑"}{" "}
                          from previous
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 p-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-red-300 hover:text-red-600 transition-colors">
                + Add Lab Result
              </button>
            </div>

            {/* A1C Chart */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">A1C Trend</h3>
              <div className="h-32 flex items-end justify-around gap-4">
                {mockA1CHistory
                  .slice()
                  .reverse()
                  .map((reading, idx) => (
                    <div key={reading.id} className="flex flex-col items-center">
                      <span className="text-sm font-medium text-gray-900 mb-2">
                        {reading.value}%
                      </span>
                      <div
                        className={`w-12 rounded-t-lg ${
                          reading.value < 5.7
                            ? "bg-green-500"
                            : reading.value < 6.5
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ height: `${(reading.value / 10) * 100}%` }}
                      />
                      <span className="text-xs text-gray-500 mt-2">
                        {reading.date.toLocaleDateString("en-US", { month: "short" })}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === "insights" && (
          <div className="space-y-6">
            {/* Alerts */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h4 className="font-semibold text-amber-800">Post-meal Spikes</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Your readings after high-carb meals are averaging 65 mg/dL above target.
                    Consider reducing portion sizes or choosing lower-GI foods.
                  </p>
                </div>
              </div>
            </div>

            {/* Positive Insights */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold text-green-800">Great Fasting Numbers</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your fasting glucose has been in the normal range 90% of the time this week.
                    Keep up the good work!
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recommendations</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: "🥗",
                    title: "Add more fiber",
                    desc: "Fiber helps slow glucose absorption. Try adding vegetables to every meal.",
                  },
                  {
                    icon: "🚶",
                    title: "Post-meal walks",
                    desc: "A 15-minute walk after meals can help lower blood sugar spikes.",
                  },
                  {
                    icon: "⏰",
                    title: "Consistent meal times",
                    desc: "Eating at regular times helps maintain stable glucose levels.",
                  },
                  {
                    icon: "💧",
                    title: "Stay hydrated",
                    desc: "Drinking water helps your kidneys flush out excess glucose.",
                  },
                ].map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-2xl">{rec.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{rec.title}</h4>
                      <p className="text-sm text-gray-600">{rec.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-4">Weekly Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <p className="text-sm opacity-80">Readings Logged</p>
                  <p className="text-2xl font-bold">28</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <p className="text-sm opacity-80">Time in Range</p>
                  <p className="text-2xl font-bold">78%</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <p className="text-sm opacity-80">Average</p>
                  <p className="text-2xl font-bold">112 mg/dL</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <p className="text-sm opacity-80">Variability</p>
                  <p className="text-2xl font-bold">Low</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Reading Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Log Blood Sugar</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-4">
                {/* Reading Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Sugar Level
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newReading}
                      onChange={(e) => setNewReading(e.target.value)}
                      className="flex-1 p-4 text-2xl font-bold text-center border border-gray-200 rounded-xl"
                      placeholder="120"
                    />
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as typeof unit)}
                      className="p-4 border border-gray-200 rounded-xl"
                    >
                      <option value="mg/dL">mg/dL</option>
                      <option value="mmol/L">mmol/L</option>
                    </select>
                  </div>
                </div>

                {/* Timing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    When did you test?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(timingLabels).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedTiming(key)}
                        className={`p-3 rounded-xl text-left transition-colors ${
                          selectedTiming === key
                            ? "bg-red-100 border-2 border-red-500"
                            : "bg-gray-50 border-2 border-transparent"
                        }`}
                      >
                        <span className="text-lg">{value.icon}</span>
                        <p className="text-sm font-medium mt-1">{value.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meal Context */}
                {(selectedTiming === "before-meal" || selectedTiming === "after-meal") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      What meal? (optional)
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 rounded-xl"
                      placeholder="e.g., Breakfast, Lunch with pasta"
                    />
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-200 rounded-xl resize-none"
                    rows={2}
                    placeholder="Any additional notes..."
                  />
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium"
                >
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
