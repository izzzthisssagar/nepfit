"use client";

import { useState } from "react";

interface Measurement {
  id: string;
  type: string;
  value: number;
  unit: string;
  date: Date;
}

interface BodyPart {
  id: string;
  name: string;
  icon: string;
  current: number;
  goal?: number;
  unit: string;
  history: { date: Date; value: number }[];
}

interface ProgressPhoto {
  id: string;
  date: Date;
  type: "front" | "side" | "back";
  notes?: string;
}

const bodyParts: BodyPart[] = [
  {
    id: "weight",
    name: "Weight",
    icon: "⚖️",
    current: 165,
    goal: 155,
    unit: "lbs",
    history: [
      { date: new Date(Date.now() - 30 * 86400000), value: 172 },
      { date: new Date(Date.now() - 20 * 86400000), value: 170 },
      { date: new Date(Date.now() - 10 * 86400000), value: 167 },
      { date: new Date(), value: 165 },
    ],
  },
  {
    id: "chest",
    name: "Chest",
    icon: "👕",
    current: 40,
    goal: 42,
    unit: "in",
    history: [
      { date: new Date(Date.now() - 30 * 86400000), value: 39 },
      { date: new Date(), value: 40 },
    ],
  },
  {
    id: "waist",
    name: "Waist",
    icon: "📏",
    current: 32,
    goal: 30,
    unit: "in",
    history: [
      { date: new Date(Date.now() - 30 * 86400000), value: 34 },
      { date: new Date(), value: 32 },
    ],
  },
  {
    id: "hips",
    name: "Hips",
    icon: "🩳",
    current: 38,
    goal: 36,
    unit: "in",
    history: [
      { date: new Date(Date.now() - 30 * 86400000), value: 40 },
      { date: new Date(), value: 38 },
    ],
  },
  {
    id: "biceps",
    name: "Biceps",
    icon: "💪",
    current: 14,
    goal: 15,
    unit: "in",
    history: [
      { date: new Date(Date.now() - 30 * 86400000), value: 13.5 },
      { date: new Date(), value: 14 },
    ],
  },
  {
    id: "thighs",
    name: "Thighs",
    icon: "🦵",
    current: 22,
    goal: 21,
    unit: "in",
    history: [
      { date: new Date(Date.now() - 30 * 86400000), value: 23 },
      { date: new Date(), value: 22 },
    ],
  },
  {
    id: "neck",
    name: "Neck",
    icon: "👔",
    current: 15.5,
    unit: "in",
    history: [{ date: new Date(), value: 15.5 }],
  },
  {
    id: "calves",
    name: "Calves",
    icon: "🦶",
    current: 14.5,
    unit: "in",
    history: [{ date: new Date(), value: 14.5 }],
  },
];

const bodyComposition = {
  bodyFat: { current: 22, goal: 18, unit: "%" },
  muscleMass: { current: 68, goal: 72, unit: "lbs" },
  boneMass: { current: 7.2, unit: "lbs" },
  waterWeight: { current: 55, unit: "%" },
  bmr: { current: 1650, unit: "cal" },
  bmi: { current: 24.2, unit: "" },
};

const mockPhotos: ProgressPhoto[] = [
  { id: "1", date: new Date(Date.now() - 30 * 86400000), type: "front", notes: "Starting point" },
  { id: "2", date: new Date(Date.now() - 30 * 86400000), type: "side" },
  { id: "3", date: new Date(Date.now() - 15 * 86400000), type: "front", notes: "2 weeks progress" },
  { id: "4", date: new Date(), type: "front", notes: "Current" },
];

export default function BodyPage() {
  const [activeTab, setActiveTab] = useState<"measurements" | "photos" | "composition" | "goals">("measurements");
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [measurementUnit, setMeasurementUnit] = useState<"imperial" | "metric">("imperial");

  const getProgress = (current: number, goal: number, isLower: boolean = true): number => {
    if (isLower) {
      return Math.min(100, ((goal - current) / goal) * -100 + 100);
    }
    return Math.min(100, (current / goal) * 100);
  };

  const getChangeIndicator = (part: BodyPart): { value: number; direction: "up" | "down" | "same" } => {
    if (part.history.length < 2) return { value: 0, direction: "same" };
    const latest = part.history[part.history.length - 1].value;
    const previous = part.history[part.history.length - 2].value;
    const diff = latest - previous;
    return {
      value: Math.abs(diff),
      direction: diff > 0 ? "up" : diff < 0 ? "down" : "same",
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Body Measurements</h1>
          <p className="text-gray-600 mt-1">Track your body transformation journey</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "measurements", label: "Measurements", icon: "📏" },
            { id: "photos", label: "Progress Photos", icon: "📸" },
            { id: "composition", label: "Body Composition", icon: "🧬" },
            { id: "goals", label: "Goals", icon: "🎯" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-indigo-50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Measurements Tab */}
        {activeTab === "measurements" && (
          <div className="space-y-6">
            {/* Unit Toggle */}
            <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
              <span className="font-medium text-gray-700">Measurement Units</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setMeasurementUnit("imperial")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    measurementUnit === "imperial"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  Imperial
                </button>
                <button
                  onClick={() => setMeasurementUnit("metric")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    measurementUnit === "metric"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  Metric
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bodyParts.slice(0, 4).map((part) => {
                const change = getChangeIndicator(part);
                return (
                  <div
                    key={part.id}
                    className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedPart(part)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{part.icon}</span>
                      <span className="text-sm text-gray-500">{part.name}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {part.current}
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        {part.unit}
                      </span>
                    </p>
                    {change.direction !== "same" && (
                      <p
                        className={`text-sm mt-1 ${
                          change.direction === "down"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {change.direction === "down" ? "↓" : "↑"} {change.value}{" "}
                        {part.unit}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* All Measurements */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">All Measurements</h3>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium"
                >
                  + Add New
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {bodyParts.map((part) => {
                  const change = getChangeIndicator(part);
                  const progress = part.goal
                    ? getProgress(
                        part.current,
                        part.goal,
                        ["weight", "waist", "hips", "thighs"].includes(part.id)
                      )
                    : 0;

                  return (
                    <div
                      key={part.id}
                      className="p-4 flex items-center gap-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedPart(part)}
                    >
                      <span className="text-2xl w-10">{part.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{part.name}</span>
                          <span className="text-lg font-semibold text-gray-900">
                            {part.current} {part.unit}
                          </span>
                        </div>
                        {part.goal && (
                          <div className="mt-2">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-500 rounded-full"
                                style={{ width: `${Math.max(0, progress)}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Goal: {part.goal} {part.unit}
                            </p>
                          </div>
                        )}
                      </div>
                      {change.direction !== "same" && (
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            change.direction === "down"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {change.direction === "down" ? "↓" : "↑"} {change.value}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Body Visualization */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Body Map</h3>
              <div className="flex justify-center">
                <div className="relative w-48 h-80">
                  {/* Simple body outline */}
                  <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20">
                    🧍
                  </div>
                  {/* Measurement points */}
                  {[
                    { part: "neck", top: "12%", left: "50%" },
                    { part: "chest", top: "28%", left: "50%" },
                    { part: "biceps", top: "35%", left: "20%" },
                    { part: "waist", top: "42%", left: "50%" },
                    { part: "hips", top: "52%", left: "50%" },
                    { part: "thighs", top: "65%", left: "35%" },
                    { part: "calves", top: "82%", left: "35%" },
                  ].map((point) => {
                    const bodyPart = bodyParts.find((p) => p.id === point.part);
                    return (
                      <button
                        key={point.part}
                        onClick={() => bodyPart && setSelectedPart(bodyPart)}
                        style={{ top: point.top, left: point.left }}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-500 text-white rounded-full text-xs font-medium flex items-center justify-center hover:bg-indigo-600 transition-colors"
                      >
                        {bodyPart?.current}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Photos Tab */}
        {activeTab === "photos" && (
          <div className="space-y-6">
            {/* Upload New Photo */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Add Progress Photo</h3>
              <div className="grid grid-cols-3 gap-4">
                {["front", "side", "back"].map((type) => (
                  <button
                    key={type}
                    className="aspect-[3/4] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                  >
                    <span className="text-3xl">📷</span>
                    <span className="text-sm text-gray-600 capitalize">{type} View</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Timeline */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Photo Timeline</h3>
              <div className="space-y-6">
                {[
                  { date: "Today", photos: mockPhotos.filter((p) => p.date.toDateString() === new Date().toDateString()) },
                  { date: "2 Weeks Ago", photos: mockPhotos.filter((p) => p.date.toDateString() === new Date(Date.now() - 15 * 86400000).toDateString()) },
                  { date: "1 Month Ago", photos: mockPhotos.filter((p) => p.date.toDateString() === new Date(Date.now() - 30 * 86400000).toDateString()) },
                ].map((group) => (
                  group.photos.length > 0 && (
                    <div key={group.date}>
                      <h4 className="text-sm font-medium text-gray-500 mb-3">{group.date}</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {group.photos.map((photo) => (
                          <div
                            key={photo.id}
                            className="aspect-[3/4] bg-gray-100 rounded-xl flex flex-col items-center justify-center relative overflow-hidden"
                          >
                            <span className="text-4xl">🧍</span>
                            <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded capitalize">
                              {photo.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Comparison Tool */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">📊 Compare Progress</h3>
              <p className="text-sm opacity-90 mb-4">
                Select two photos to see your transformation side by side
              </p>
              <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium">
                Start Comparison
              </button>
            </div>
          </div>
        )}

        {/* Body Composition Tab */}
        {activeTab === "composition" && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(bodyComposition).map(([key, data]) => (
                <div key={key} className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {data.current}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      {data.unit}
                    </span>
                  </p>
                  {(data as any).goal && (
                    <p className="text-sm text-indigo-600 mt-1">
                      Goal: {(data as any).goal}
                      {data.unit}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Body Fat Distribution */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Body Composition Breakdown</h3>
              <div className="space-y-4">
                {[
                  { name: "Muscle Mass", value: 45, color: "bg-red-500" },
                  { name: "Body Fat", value: 22, color: "bg-yellow-500" },
                  { name: "Water", value: 55, color: "bg-blue-500" },
                  { name: "Bone Mass", value: 5, color: "bg-gray-500" },
                ].map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.name}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BMI Indicator */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">BMI Analysis</h3>
              <div className="relative h-8 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 w-1 bg-black"
                  style={{ left: `${((bodyComposition.bmi.current - 15) / 25) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
              <div className="mt-4 p-4 bg-green-50 rounded-xl">
                <p className="text-green-800">
                  Your BMI of <strong>{bodyComposition.bmi.current}</strong> is in the{" "}
                  <strong>Normal</strong> range. Keep up the good work!
                </p>
              </div>
            </div>

            {/* Sync with Devices */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Smart Scale Sync</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚖️</span>
                  <div>
                    <p className="font-medium text-gray-900">Connect Smart Scale</p>
                    <p className="text-sm text-gray-500">
                      Auto-sync body composition data
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
                  Connect
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === "goals" && (
          <div className="space-y-6">
            {/* Goal Summary */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">Your Transformation Goals</h3>
              <p className="text-sm opacity-90">
                Track your progress towards your ideal body
              </p>
            </div>

            {/* Active Goals */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Active Goals</h3>
              <div className="space-y-4">
                {bodyParts
                  .filter((p) => p.goal)
                  .map((part) => {
                    const isLower = ["weight", "waist", "hips", "thighs"].includes(part.id);
                    const progress = getProgress(part.current, part.goal!, isLower);
                    const remaining = isLower
                      ? part.current - part.goal!
                      : part.goal! - part.current;

                    return (
                      <div key={part.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{part.icon}</span>
                            <span className="font-medium text-gray-900">{part.name}</span>
                          </div>
                          <span className="text-sm text-indigo-600 font-medium">
                            {Math.round(progress)}% complete
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${Math.max(0, progress)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>
                            Current: {part.current} {part.unit}
                          </span>
                          <span>
                            Goal: {part.goal} {part.unit}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          {remaining > 0
                            ? `${Math.abs(remaining).toFixed(1)} ${part.unit} ${
                                isLower ? "to lose" : "to gain"
                              }`
                            : "Goal achieved! 🎉"}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Add New Goal */}
            <button className="w-full p-4 bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
              + Set New Goal
            </button>

            {/* Milestones */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Milestones Achieved</h3>
              <div className="space-y-3">
                {[
                  { icon: "🏆", title: "Lost 5 lbs", date: "Jan 15, 2026" },
                  { icon: "💪", title: "Waist down 2 inches", date: "Jan 28, 2026" },
                  { icon: "🎯", title: "First month complete", date: "Feb 1, 2026" },
                ].map((milestone, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-xl"
                  >
                    <span className="text-2xl">{milestone.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{milestone.title}</p>
                      <p className="text-sm text-gray-500">{milestone.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedPart && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedPart.icon}</span>
                  <h3 className="font-semibold text-gray-900">{selectedPart.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedPart(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-4">
                {/* Current Value */}
                <div className="text-center py-4">
                  <p className="text-4xl font-bold text-gray-900">
                    {selectedPart.current}
                    <span className="text-lg font-normal text-gray-500 ml-1">
                      {selectedPart.unit}
                    </span>
                  </p>
                  {selectedPart.goal && (
                    <p className="text-sm text-gray-500 mt-1">
                      Goal: {selectedPart.goal} {selectedPart.unit}
                    </p>
                  )}
                </div>

                {/* History Chart */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">History</h4>
                  <div className="h-32 flex items-end justify-between gap-2">
                    {selectedPart.history.map((entry, idx) => {
                      const maxVal = Math.max(...selectedPart.history.map((h) => h.value));
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-indigo-500 rounded-t-lg"
                            style={{ height: `${(entry.value / maxVal) * 100}%` }}
                          />
                          <span className="text-xs text-gray-500 mt-2">
                            {entry.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Add New Entry */}
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Log New Measurement
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder={`${selectedPart.current}`}
                      className="flex-1 p-3 border border-gray-200 rounded-xl"
                    />
                    <button className="px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Measurement Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Add Measurement</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Body Part
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {bodyParts.map((part) => (
                      <button
                        key={part.id}
                        className="p-3 bg-gray-50 hover:bg-indigo-50 rounded-xl text-center transition-colors"
                      >
                        <span className="text-xl">{part.icon}</span>
                        <p className="text-xs text-gray-600 mt-1">{part.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Measurement
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    placeholder="Enter value"
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
                <button className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
