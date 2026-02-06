"use client";

import { useState } from "react";

type SleepQuality = "excellent" | "good" | "fair" | "poor";

interface SleepLog {
  id: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  duration: number;
  quality: SleepQuality;
  deepSleep: number;
  remSleep: number;
  lightSleep: number;
  awakeTime: number;
  factors: string[];
  notes?: string;
}

interface SleepGoal {
  targetHours: number;
  targetBedTime: string;
  targetWakeTime: string;
}

const mockSleepLogs: SleepLog[] = [
  {
    id: "1",
    date: "2026-02-07",
    bedTime: "22:30",
    wakeTime: "06:30",
    duration: 8,
    quality: "excellent",
    deepSleep: 1.5,
    remSleep: 2,
    lightSleep: 4,
    awakeTime: 0.5,
    factors: ["exercise", "no_caffeine"],
    notes: "Felt very refreshed",
  },
  {
    id: "2",
    date: "2026-02-06",
    bedTime: "23:15",
    wakeTime: "06:45",
    duration: 7.5,
    quality: "good",
    deepSleep: 1.2,
    remSleep: 1.8,
    lightSleep: 4,
    awakeTime: 0.5,
    factors: ["light_dinner"],
  },
  {
    id: "3",
    date: "2026-02-05",
    bedTime: "00:00",
    wakeTime: "07:00",
    duration: 7,
    quality: "fair",
    deepSleep: 1,
    remSleep: 1.5,
    lightSleep: 4,
    awakeTime: 0.5,
    factors: ["late_screen", "stress"],
    notes: "Hard to fall asleep",
  },
  {
    id: "4",
    date: "2026-02-04",
    bedTime: "23:00",
    wakeTime: "06:00",
    duration: 7,
    quality: "good",
    deepSleep: 1.3,
    remSleep: 1.7,
    lightSleep: 3.5,
    awakeTime: 0.5,
    factors: ["meditation"],
  },
  {
    id: "5",
    date: "2026-02-03",
    bedTime: "01:00",
    wakeTime: "08:00",
    duration: 7,
    quality: "poor",
    deepSleep: 0.8,
    remSleep: 1.2,
    lightSleep: 4.5,
    awakeTime: 0.5,
    factors: ["late_meal", "alcohol", "late_screen"],
    notes: "Woke up tired",
  },
  {
    id: "6",
    date: "2026-02-02",
    bedTime: "22:45",
    wakeTime: "06:15",
    duration: 7.5,
    quality: "good",
    deepSleep: 1.4,
    remSleep: 1.8,
    lightSleep: 3.8,
    awakeTime: 0.5,
    factors: ["exercise", "no_caffeine"],
  },
  {
    id: "7",
    date: "2026-02-01",
    bedTime: "23:30",
    wakeTime: "07:00",
    duration: 7.5,
    quality: "fair",
    deepSleep: 1.1,
    remSleep: 1.6,
    lightSleep: 4.3,
    awakeTime: 0.5,
    factors: ["stress"],
  },
];

const sleepFactors = [
  { id: "exercise", label: "Exercise", icon: "🏃", positive: true },
  { id: "meditation", label: "Meditation", icon: "🧘", positive: true },
  { id: "no_caffeine", label: "No Caffeine", icon: "☕", positive: true },
  { id: "light_dinner", label: "Light Dinner", icon: "🥗", positive: true },
  { id: "late_screen", label: "Late Screen Time", icon: "📱", positive: false },
  { id: "stress", label: "Stress", icon: "😰", positive: false },
  { id: "late_meal", label: "Late Heavy Meal", icon: "🍔", positive: false },
  { id: "alcohol", label: "Alcohol", icon: "🍷", positive: false },
];

export default function SleepPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "log" | "analysis" | "tips">("overview");
  const [showLogModal, setShowLogModal] = useState(false);
  const [sleepGoal] = useState<SleepGoal>({
    targetHours: 8,
    targetBedTime: "22:30",
    targetWakeTime: "06:30",
  });
  const [newLog, setNewLog] = useState({
    bedTime: "",
    wakeTime: "",
    quality: "good" as SleepQuality,
    factors: [] as string[],
    notes: "",
  });

  const todaySleep = mockSleepLogs[0];
  const weeklyAvg = mockSleepLogs.reduce((sum, log) => sum + log.duration, 0) / mockSleepLogs.length;
  const qualityScore = mockSleepLogs.filter((log) => log.quality === "excellent" || log.quality === "good").length;

  const getQualityColor = (quality: SleepQuality) => {
    switch (quality) {
      case "excellent":
        return "bg-green-100 text-green-700";
      case "good":
        return "bg-blue-100 text-blue-700";
      case "fair":
        return "bg-yellow-100 text-yellow-700";
      case "poor":
        return "bg-red-100 text-red-700";
    }
  };

  const getQualityIcon = (quality: SleepQuality) => {
    switch (quality) {
      case "excellent":
        return "😴";
      case "good":
        return "🙂";
      case "fair":
        return "😐";
      case "poor":
        return "😫";
    }
  };

  const toggleFactor = (factorId: string) => {
    setNewLog((prev) => ({
      ...prev,
      factors: prev.factors.includes(factorId)
        ? prev.factors.filter((f) => f !== factorId)
        : [...prev.factors, factorId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Sleep & Recovery</h1>
          <p className="text-neutral-600">Track your sleep patterns and improve rest quality</p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
        >
          + Log Sleep
        </button>
      </div>

      {/* Last Night Summary */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">🌙 Last Night&apos;s Sleep</h2>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="text-center">
            <div className="text-6xl mb-2">{getQualityIcon(todaySleep.quality)}</div>
            <span className={`px-3 py-1 rounded-full text-sm ${getQualityColor(todaySleep.quality)}`}>
              {todaySleep.quality}
            </span>
          </div>
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{todaySleep.duration}h</p>
              <p className="text-sm text-white/80">Total Sleep</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{todaySleep.bedTime}</p>
              <p className="text-sm text-white/80">Bed Time</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{todaySleep.wakeTime}</p>
              <p className="text-sm text-white/80">Wake Time</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{todaySleep.deepSleep}h</p>
              <p className="text-sm text-white/80">Deep Sleep</p>
            </div>
          </div>
        </div>

        {/* Sleep Stages */}
        <div className="mt-6">
          <p className="text-sm text-white/80 mb-2">Sleep Stages</p>
          <div className="h-4 flex rounded-full overflow-hidden">
            <div
              className="bg-indigo-300"
              style={{ width: `${(todaySleep.deepSleep / todaySleep.duration) * 100}%` }}
              title="Deep Sleep"
            />
            <div
              className="bg-purple-300"
              style={{ width: `${(todaySleep.remSleep / todaySleep.duration) * 100}%` }}
              title="REM Sleep"
            />
            <div
              className="bg-blue-300"
              style={{ width: `${(todaySleep.lightSleep / todaySleep.duration) * 100}%` }}
              title="Light Sleep"
            />
            <div
              className="bg-white/30"
              style={{ width: `${(todaySleep.awakeTime / todaySleep.duration) * 100}%` }}
              title="Awake"
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/60">
            <span>Deep: {todaySleep.deepSleep}h</span>
            <span>REM: {todaySleep.remSleep}h</span>
            <span>Light: {todaySleep.lightSleep}h</span>
            <span>Awake: {todaySleep.awakeTime}h</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 overflow-x-auto">
        {[
          { id: "overview", label: "Overview", icon: "📊" },
          { id: "log", label: "Sleep Log", icon: "📝" },
          { id: "analysis", label: "Analysis", icon: "📈" },
          { id: "tips", label: "Sleep Tips", icon: "💡" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "text-indigo-600 border-b-2 border-indigo-500"
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
          {/* Weekly Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⏰</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">{weeklyAvg.toFixed(1)}h</p>
                  <p className="text-sm text-neutral-500">Avg Sleep</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">{qualityScore}/7</p>
                  <p className="text-sm text-neutral-500">Good Nights</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">{sleepGoal.targetHours}h</p>
                  <p className="text-sm text-neutral-500">Daily Goal</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">5</p>
                  <p className="text-sm text-neutral-500">Day Streak</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">Weekly Sleep Duration</h3>
            <div className="flex items-end justify-between gap-2 h-40">
              {mockSleepLogs.slice(0, 7).reverse().map((log) => {
                const heightPercent = (log.duration / 10) * 100;
                return (
                  <div key={log.id} className="flex-1 flex flex-col items-center">
                    <div className="w-full h-32 bg-neutral-100 rounded-lg relative overflow-hidden">
                      <div
                        className={`absolute bottom-0 w-full rounded-lg ${getQualityColor(log.quality).split(" ")[0]}`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <p className="text-xs mt-2 text-neutral-500">
                      {new Date(log.date).toLocaleDateString("en-US", { weekday: "short" })}
                    </p>
                    <p className="text-xs text-neutral-400">{log.duration}h</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sleep Schedule */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">Your Sleep Schedule</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50 rounded-xl">
                <p className="text-sm text-indigo-600 font-medium">Target Bed Time</p>
                <p className="text-2xl font-bold text-indigo-900">{sleepGoal.targetBedTime}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl">
                <p className="text-sm text-orange-600 font-medium">Target Wake Time</p>
                <p className="text-2xl font-bold text-orange-900">{sleepGoal.targetWakeTime}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sleep Log Tab */}
      {activeTab === "log" && (
        <div className="space-y-4">
          {mockSleepLogs.map((log) => (
            <div key={log.id} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{getQualityIcon(log.quality)}</div>
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {new Date(log.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {log.bedTime} → {log.wakeTime} ({log.duration}h)
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getQualityColor(log.quality)}`}>
                  {log.quality}
                </span>
              </div>

              {log.factors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {log.factors.map((factorId) => {
                    const factor = sleepFactors.find((f) => f.id === factorId);
                    return factor ? (
                      <span
                        key={factorId}
                        className={`text-xs px-2 py-1 rounded-full ${
                          factor.positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {factor.icon} {factor.label}
                      </span>
                    ) : null;
                  })}
                </div>
              )}

              {log.notes && (
                <p className="mt-3 text-sm text-neutral-600 italic">&quot;{log.notes}&quot;</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === "analysis" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">Sleep Quality Factors</h3>
            <div className="space-y-4">
              {[
                { factor: "Exercise", impact: "+25%", positive: true },
                { factor: "No Caffeine After 2PM", impact: "+20%", positive: true },
                { factor: "Meditation Before Bed", impact: "+15%", positive: true },
                { factor: "Late Screen Time", impact: "-30%", positive: false },
                { factor: "Heavy Dinner", impact: "-20%", positive: false },
              ].map((item) => (
                <div key={item.factor} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <span className="text-neutral-700">{item.factor}</span>
                  <span className={`font-semibold ${item.positive ? "text-green-600" : "text-red-600"}`}>
                    {item.impact} sleep quality
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">AI Insights</h3>
            <div className="space-y-3">
              <div className="p-4 bg-indigo-50 rounded-xl">
                <p className="text-indigo-800">
                  💡 You sleep better when you exercise during the day. Try to maintain your workout routine.
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl">
                <p className="text-orange-800">
                  ⚠️ Late screen time on Feb 5 affected your sleep quality. Consider a digital sunset.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-green-800">
                  ✅ Your average wake time is consistent. This helps regulate your circadian rhythm.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips Tab */}
      {activeTab === "tips" && (
        <div className="space-y-4">
          {[
            {
              title: "Stick to a Sleep Schedule",
              description: "Go to bed and wake up at the same time every day, even on weekends.",
              icon: "⏰",
            },
            {
              title: "Create a Restful Environment",
              description: "Keep your bedroom cool, dark, and quiet. Consider using earplugs or a white noise machine.",
              icon: "🛏️",
            },
            {
              title: "Limit Screen Time Before Bed",
              description: "Avoid phones, tablets, and computers for at least 1 hour before sleep.",
              icon: "📱",
            },
            {
              title: "Watch Your Diet",
              description: "Avoid large meals, caffeine, and alcohol close to bedtime.",
              icon: "🍽️",
            },
            {
              title: "Exercise Regularly",
              description: "Regular physical activity can help you fall asleep faster and enjoy deeper sleep.",
              icon: "🏃",
            },
            {
              title: "Manage Stress",
              description: "Practice relaxation techniques like meditation, deep breathing, or yoga before bed.",
              icon: "🧘",
            },
          ].map((tip, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl">
                  {tip.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900">{tip.title}</h4>
                  <p className="text-sm text-neutral-600 mt-1">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Sleep Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Log Sleep</h2>
              <button onClick={() => setShowLogModal(false)} className="p-2 hover:bg-neutral-100 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Bed Time</label>
                  <input
                    type="time"
                    value={newLog.bedTime}
                    onChange={(e) => setNewLog({ ...newLog, bedTime: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Wake Time</label>
                  <input
                    type="time"
                    value={newLog.wakeTime}
                    onChange={(e) => setNewLog({ ...newLog, wakeTime: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Sleep Quality</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["excellent", "good", "fair", "poor"] as SleepQuality[]).map((quality) => (
                    <button
                      key={quality}
                      onClick={() => setNewLog({ ...newLog, quality })}
                      className={`p-3 rounded-xl text-center transition-all ${
                        newLog.quality === quality
                          ? "bg-indigo-500 text-white"
                          : "bg-neutral-100 hover:bg-neutral-200"
                      }`}
                    >
                      <span className="text-2xl">{getQualityIcon(quality)}</span>
                      <p className="text-xs mt-1 capitalize">{quality}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Factors</label>
                <div className="flex flex-wrap gap-2">
                  {sleepFactors.map((factor) => (
                    <button
                      key={factor.id}
                      onClick={() => toggleFactor(factor.id)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        newLog.factors.includes(factor.id)
                          ? factor.positive
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                          : "bg-neutral-100 hover:bg-neutral-200"
                      }`}
                    >
                      {factor.icon} {factor.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Notes (optional)</label>
                <textarea
                  value={newLog.notes}
                  onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                  placeholder="How did you feel?"
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl resize-none"
                  rows={3}
                />
              </div>
            </div>

            <button
              onClick={() => setShowLogModal(false)}
              className="w-full mt-6 py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-colors"
            >
              Save Sleep Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
