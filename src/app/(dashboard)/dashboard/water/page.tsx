"use client";

import { useState } from "react";

interface WaterLog {
  id: string;
  amount: number;
  time: Date;
  type: "water" | "tea" | "coffee" | "juice" | "milk" | "other";
}

interface DailyWaterData {
  date: string;
  total: number;
  goal: number;
  logs: WaterLog[];
}

const mockTodayLogs: WaterLog[] = [
  { id: "1", amount: 250, time: new Date(Date.now() - 1000 * 60 * 60 * 6), type: "water" },
  { id: "2", amount: 150, time: new Date(Date.now() - 1000 * 60 * 60 * 5), type: "tea" },
  { id: "3", amount: 250, time: new Date(Date.now() - 1000 * 60 * 60 * 4), type: "water" },
  { id: "4", amount: 200, time: new Date(Date.now() - 1000 * 60 * 60 * 3), type: "water" },
  { id: "5", amount: 100, time: new Date(Date.now() - 1000 * 60 * 60 * 2), type: "coffee" },
  { id: "6", amount: 250, time: new Date(Date.now() - 1000 * 60 * 60 * 1), type: "water" },
];

const mockWeeklyData: DailyWaterData[] = [
  { date: "2026-02-07", total: 1200, goal: 2500, logs: mockTodayLogs },
  { date: "2026-02-06", total: 2400, goal: 2500, logs: [] },
  { date: "2026-02-05", total: 2600, goal: 2500, logs: [] },
  { date: "2026-02-04", total: 1800, goal: 2500, logs: [] },
  { date: "2026-02-03", total: 2500, goal: 2500, logs: [] },
  { date: "2026-02-02", total: 2200, goal: 2500, logs: [] },
  { date: "2026-02-01", total: 1900, goal: 2500, logs: [] },
];

const drinkTypes = [
  { type: "water", icon: "💧", label: "Water", color: "bg-blue-500" },
  { type: "tea", icon: "🍵", label: "Tea", color: "bg-green-500" },
  { type: "coffee", icon: "☕", label: "Coffee", color: "bg-amber-700" },
  { type: "juice", icon: "🧃", label: "Juice", color: "bg-orange-500" },
  { type: "milk", icon: "🥛", label: "Milk", color: "bg-white border-2 border-neutral-200" },
  { type: "other", icon: "🥤", label: "Other", color: "bg-purple-500" },
];

const quickAmounts = [100, 150, 200, 250, 300, 500];

export default function WaterPage() {
  const [dailyGoal, setDailyGoal] = useState(2500);
  const [logs, setLogs] = useState<WaterLog[]>(mockTodayLogs);
  const [selectedType, setSelectedType] = useState<WaterLog["type"]>("water");
  const [customAmount, setCustomAmount] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderInterval, setReminderInterval] = useState(60);

  const todayTotal = logs.reduce((sum, log) => sum + log.amount, 0);
  const progressPercent = Math.min((todayTotal / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - todayTotal, 0);

  const weeklyAverage = Math.round(
    mockWeeklyData.reduce((sum, day) => sum + day.total, 0) / mockWeeklyData.length
  );

  const streakDays = mockWeeklyData.filter((day) => day.total >= day.goal).length;

  const addWater = (amount: number) => {
    const newLog: WaterLog = {
      id: Date.now().toString(),
      amount,
      time: new Date(),
      type: selectedType,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const removeLog = (id: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  const getDrinkIcon = (type: WaterLog["type"]) => {
    return drinkTypes.find((d) => d.type === type)?.icon || "💧";
  };

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Water & Hydration</h1>
          <p className="text-neutral-600">Track your daily water intake</p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </button>
      </div>

      {/* Main Progress Card */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Circular Progress */}
          <div className="relative w-48 h-48">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="white"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - progressPercent / 100)}`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl">💧</span>
              <span className="text-3xl font-bold">{todayTotal}</span>
              <span className="text-sm text-white/80">of {dailyGoal} ml</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{Math.round(progressPercent)}%</p>
              <p className="text-sm text-white/80">Completed</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{remaining}</p>
              <p className="text-sm text-white/80">ml Remaining</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{logs.length}</p>
              <p className="text-sm text-white/80">Drinks Today</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{streakDays}</p>
              <p className="text-sm text-white/80">Day Streak 🔥</p>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mt-6 p-3 bg-white/10 rounded-xl text-center">
          {progressPercent >= 100 ? (
            <p>🎉 Goal achieved! Great job staying hydrated!</p>
          ) : progressPercent >= 75 ? (
            <p>💪 Almost there! Just {remaining}ml to go!</p>
          ) : progressPercent >= 50 ? (
            <p>👍 Halfway there! Keep drinking!</p>
          ) : (
            <p>💧 Stay hydrated! Drink more water throughout the day.</p>
          )}
        </div>
      </div>

      {/* Quick Add Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Add</h2>

        {/* Drink Type Selection */}
        <div className="flex flex-wrap gap-2 mb-4">
          {drinkTypes.map((drink) => (
            <button
              key={drink.type}
              onClick={() => setSelectedType(drink.type as WaterLog["type"])}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                selectedType === drink.type
                  ? "bg-blue-500 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <span>{drink.icon}</span>
              <span>{drink.label}</span>
            </button>
          ))}
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => addWater(amount)}
              className="py-3 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition-colors"
            >
              +{amount}ml
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Custom amount (ml)"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => {
              if (customAmount) {
                addWater(parseInt(customAmount));
                setCustomAmount("");
              }
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Today's Log */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Today&apos;s Log</h2>
        {logs.length > 0 ? (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getDrinkIcon(log.type)}</span>
                  <div>
                    <p className="font-medium text-neutral-900">{log.amount} ml</p>
                    <p className="text-sm text-neutral-500">{getTimeAgo(log.time)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeLog(log.id)}
                  className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-500">
            <span className="text-4xl">💧</span>
            <p className="mt-2">No drinks logged yet today</p>
          </div>
        )}
      </div>

      {/* Weekly Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Weekly Overview</h2>
        <div className="flex items-end justify-between gap-2 h-40">
          {mockWeeklyData.map((day, index) => {
            const heightPercent = (day.total / day.goal) * 100;
            const isToday = index === 0;
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div className="w-full h-32 bg-neutral-100 rounded-lg relative overflow-hidden">
                  <div
                    className={`absolute bottom-0 w-full rounded-lg transition-all ${
                      heightPercent >= 100 ? "bg-green-500" : "bg-blue-500"
                    } ${isToday ? "opacity-100" : "opacity-70"}`}
                    style={{ height: `${Math.min(heightPercent, 100)}%` }}
                  />
                </div>
                <p className={`text-xs mt-2 ${isToday ? "font-bold text-blue-600" : "text-neutral-500"}`}>
                  {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <p className="text-xs text-neutral-400">{day.total}ml</p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-neutral-600">Below goal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span className="text-neutral-600">Goal reached</span>
          </div>
        </div>
      </div>

      {/* Hydration Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <h3 className="font-semibold text-blue-800 mb-2">💡 Hydration Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Drink a glass of water first thing in the morning</li>
          <li>• Keep a water bottle at your desk</li>
          <li>• Drink water before, during, and after exercise</li>
          <li>• Eat water-rich foods like cucumbers and watermelon</li>
        </ul>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Hydration Settings</h2>
              <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-neutral-100 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Daily Goal */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Daily Water Goal (ml)
                </label>
                <input
                  type="number"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(parseInt(e.target.value) || 2500)}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl"
                />
                <p className="text-xs text-neutral-500 mt-1">Recommended: 2000-3000ml for adults</p>
              </div>

              {/* Reminders */}
              <div className="flex items-center justify-between py-4 border-t border-neutral-100">
                <div>
                  <p className="font-medium text-neutral-900">Water Reminders</p>
                  <p className="text-sm text-neutral-500">Get reminded to drink water</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reminderEnabled}
                    onChange={(e) => setReminderEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              {/* Reminder Interval */}
              {reminderEnabled && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Reminder Interval
                  </label>
                  <select
                    value={reminderInterval}
                    onChange={(e) => setReminderInterval(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl"
                  >
                    <option value={30}>Every 30 minutes</option>
                    <option value={60}>Every 1 hour</option>
                    <option value={90}>Every 1.5 hours</option>
                    <option value={120}>Every 2 hours</option>
                  </select>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
