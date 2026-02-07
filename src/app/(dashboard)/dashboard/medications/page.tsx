"use client";

import { useState } from "react";

interface Medication {
  id: string;
  name: string;
  type: "medication" | "supplement" | "vitamin";
  dosage: string;
  frequency: string;
  times: string[];
  instructions?: string;
  startDate: Date;
  endDate?: Date;
  refillDate?: Date;
  remainingDoses?: number;
  takenToday: boolean[];
  sideEffects?: string[];
  notes?: string;
}

interface Reminder {
  id: string;
  medicationId: string;
  time: string;
  enabled: boolean;
}

interface Interaction {
  medication1: string;
  medication2: string;
  severity: "low" | "moderate" | "high";
  description: string;
}

const mockMedications: Medication[] = [
  {
    id: "1",
    name: "Vitamin D3",
    type: "vitamin",
    dosage: "5000 IU",
    frequency: "daily",
    times: ["08:00"],
    instructions: "Take with food for better absorption",
    startDate: new Date(Date.now() - 90 * 86400000),
    remainingDoses: 45,
    takenToday: [true],
    notes: "For bone health and immune support",
  },
  {
    id: "2",
    name: "Omega-3 Fish Oil",
    type: "supplement",
    dosage: "1000mg",
    frequency: "twice daily",
    times: ["08:00", "20:00"],
    instructions: "Take with meals to reduce fishy aftertaste",
    startDate: new Date(Date.now() - 60 * 86400000),
    remainingDoses: 30,
    takenToday: [true, false],
  },
  {
    id: "3",
    name: "Magnesium Glycinate",
    type: "supplement",
    dosage: "400mg",
    frequency: "daily",
    times: ["21:00"],
    instructions: "Take before bed for better sleep",
    startDate: new Date(Date.now() - 30 * 86400000),
    remainingDoses: 25,
    takenToday: [false],
    notes: "Helps with muscle recovery and sleep quality",
  },
  {
    id: "4",
    name: "Multivitamin",
    type: "vitamin",
    dosage: "1 tablet",
    frequency: "daily",
    times: ["08:00"],
    startDate: new Date(Date.now() - 120 * 86400000),
    remainingDoses: 60,
    takenToday: [true],
  },
  {
    id: "5",
    name: "Probiotic",
    type: "supplement",
    dosage: "10 billion CFU",
    frequency: "daily",
    times: ["07:00"],
    instructions: "Take on empty stomach",
    startDate: new Date(Date.now() - 45 * 86400000),
    remainingDoses: 15,
    refillDate: new Date(Date.now() + 15 * 86400000),
    takenToday: [true],
  },
];

const mockInteractions: Interaction[] = [
  {
    medication1: "Vitamin D3",
    medication2: "Magnesium Glycinate",
    severity: "low",
    description: "Taking together may enhance absorption of both. This is generally beneficial.",
  },
];

const typeColors: Record<string, { bg: string; text: string; icon: string }> = {
  medication: { bg: "bg-red-100", text: "text-red-700", icon: "💊" },
  supplement: { bg: "bg-green-100", text: "text-green-700", icon: "🌿" },
  vitamin: { bg: "bg-yellow-100", text: "text-yellow-700", icon: "✨" },
};

export default function MedicationsPage() {
  const [activeTab, setActiveTab] = useState<"today" | "all" | "reminders" | "history">("today");
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const toggleDose = (medId: string, doseIndex: number) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id === medId) {
          const newTakenToday = [...med.takenToday];
          newTakenToday[doseIndex] = !newTakenToday[doseIndex];
          return { ...med, takenToday: newTakenToday };
        }
        return med;
      })
    );
  };

  const getTodayProgress = (): { taken: number; total: number } => {
    let taken = 0;
    let total = 0;
    medications.forEach((med) => {
      total += med.takenToday.length;
      taken += med.takenToday.filter(Boolean).length;
    });
    return { taken, total };
  };

  const progress = getTodayProgress();

  const getLowStockMeds = (): Medication[] => {
    return medications.filter((med) => med.remainingDoses && med.remainingDoses <= 14);
  };

  const getUpcomingDoses = (): { med: Medication; time: string; index: number }[] => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const upcoming: { med: Medication; time: string; index: number }[] = [];

    medications.forEach((med) => {
      med.times.forEach((time, index) => {
        const [hours, mins] = time.split(":").map(Number);
        const timeMinutes = hours * 60 + mins;
        if (timeMinutes > currentTime && !med.takenToday[index]) {
          upcoming.push({ med, time, index });
        }
      });
    });

    return upcoming.sort((a, b) => {
      const [aH, aM] = a.time.split(":").map(Number);
      const [bH, bM] = b.time.split(":").map(Number);
      return aH * 60 + aM - (bH * 60 + bM);
    });
  };

  const filteredMedications =
    filterType === "all"
      ? medications
      : medications.filter((med) => med.type === filterType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Medications & Supplements</h1>
          <p className="text-gray-600 mt-1">Track your daily medications and supplements</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "today", label: "Today", icon: "📅" },
            { id: "all", label: "All Items", icon: "💊" },
            { id: "reminders", label: "Reminders", icon: "⏰" },
            { id: "history", label: "History", icon: "📊" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-rose-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-rose-50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Today Tab */}
        {activeTab === "today" && (
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-100">Today's Progress</p>
                  <p className="text-3xl font-bold mt-1">
                    {progress.taken} / {progress.total} doses
                  </p>
                </div>
                <div className="w-20 h-20 relative">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="white"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 36}
                      strokeDashoffset={
                        2 * Math.PI * 36 * (1 - progress.taken / progress.total)
                      }
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                    {Math.round((progress.taken / progress.total) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Upcoming Doses */}
            {getUpcomingDoses().length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3">⏰ Upcoming</h3>
                <div className="space-y-2">
                  {getUpcomingDoses()
                    .slice(0, 3)
                    .map(({ med, time, index }) => (
                      <div
                        key={`${med.id}-${index}`}
                        className="flex items-center justify-between p-3 bg-amber-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{typeColors[med.type].icon}</span>
                          <div>
                            <p className="font-medium text-gray-900">{med.name}</p>
                            <p className="text-sm text-gray-500">{med.dosage}</p>
                          </div>
                        </div>
                        <span className="text-amber-600 font-medium">{time}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Today's Medications */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {medications.map((med) => (
                  <div key={med.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <span
                        className={`p-2 rounded-lg ${typeColors[med.type].bg}`}
                      >
                        <span className="text-xl">{typeColors[med.type].icon}</span>
                      </span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{med.name}</h4>
                            <p className="text-sm text-gray-500">
                              {med.dosage} • {med.frequency}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              typeColors[med.type].bg
                            } ${typeColors[med.type].text}`}
                          >
                            {med.type}
                          </span>
                        </div>

                        {/* Dose Checkboxes */}
                        <div className="flex gap-2 mt-3">
                          {med.times.map((time, idx) => (
                            <button
                              key={idx}
                              onClick={() => toggleDose(med.id, idx)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                                med.takenToday[idx]
                                  ? "bg-green-100 border-green-300 text-green-700"
                                  : "bg-gray-50 border-gray-200 text-gray-600"
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  med.takenToday[idx]
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "border-gray-300"
                                }`}
                              >
                                {med.takenToday[idx] && "✓"}
                              </span>
                              <span className="text-sm">{time}</span>
                            </button>
                          ))}
                        </div>

                        {med.instructions && (
                          <p className="text-sm text-gray-500 mt-2 italic">
                            💡 {med.instructions}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Stock Alert */}
            {getLowStockMeds().length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <h3 className="font-semibold text-amber-800 mb-3">⚠️ Low Stock Alert</h3>
                <div className="space-y-2">
                  {getLowStockMeds().map((med) => (
                    <div
                      key={med.id}
                      className="flex items-center justify-between p-3 bg-white rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <span>{typeColors[med.type].icon}</span>
                        <span className="text-gray-700">{med.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-amber-600">
                          {med.remainingDoses} doses left
                        </p>
                        {med.refillDate && (
                          <p className="text-xs text-gray-500">
                            Refill by{" "}
                            {med.refillDate.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* All Items Tab */}
        {activeTab === "all" && (
          <div className="space-y-6">
            {/* Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { id: "all", label: "All" },
                { id: "medication", label: "💊 Medications" },
                { id: "supplement", label: "🌿 Supplements" },
                { id: "vitamin", label: "✨ Vitamins" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilterType(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filterType === filter.id
                      ? "bg-rose-600 text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Medications List */}
            <div className="space-y-4">
              {filteredMedications.map((med) => (
                <div
                  key={med.id}
                  className="bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedMed(med)}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`p-3 rounded-xl ${typeColors[med.type].bg}`}
                    >
                      <span className="text-2xl">{typeColors[med.type].icon}</span>
                    </span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{med.name}</h4>
                          <p className="text-sm text-gray-500">{med.dosage}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            typeColors[med.type].bg
                          } ${typeColors[med.type].text}`}
                        >
                          {med.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-gray-100 rounded-full">
                          📅 {med.frequency}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded-full">
                          ⏰ {med.times.join(", ")}
                        </span>
                        {med.remainingDoses && (
                          <span
                            className={`px-2 py-1 rounded-full ${
                              med.remainingDoses <= 14
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100"
                            }`}
                          >
                            📦 {med.remainingDoses} left
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full p-4 bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200 text-gray-500 hover:border-rose-300 hover:text-rose-600 transition-colors"
            >
              + Add Medication or Supplement
            </button>

            {/* Interactions Warning */}
            {mockInteractions.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  ⚠️ Potential Interactions
                </h3>
                {mockInteractions.map((interaction, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl ${
                      interaction.severity === "high"
                        ? "bg-red-50 border border-red-200"
                        : interaction.severity === "moderate"
                        ? "bg-amber-50 border border-amber-200"
                        : "bg-blue-50 border border-blue-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">
                        {interaction.medication1} + {interaction.medication2}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          interaction.severity === "high"
                            ? "bg-red-200 text-red-700"
                            : interaction.severity === "moderate"
                            ? "bg-amber-200 text-amber-700"
                            : "bg-blue-200 text-blue-700"
                        }`}
                      >
                        {interaction.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{interaction.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reminders Tab */}
        {activeTab === "reminders" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Reminder Settings</h3>
              <div className="space-y-4">
                {medications.map((med) => (
                  <div key={med.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span>{typeColors[med.type].icon}</span>
                        <span className="font-medium text-gray-900">{med.name}</span>
                      </div>
                      <button
                        className={`w-12 h-7 rounded-full transition-colors bg-rose-500`}
                      >
                        <div className="w-5 h-5 bg-white rounded-full shadow-sm transform translate-x-6" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {med.times.map((time, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white rounded-full text-sm text-gray-600"
                        >
                          ⏰ {time}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { name: "Push Notifications", enabled: true },
                  { name: "Sound Alert", enabled: true },
                  { name: "Vibration", enabled: false },
                  { name: "Remind Again After 15 min", enabled: true },
                  { name: "Low Stock Alerts", enabled: true },
                ].map((setting, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-gray-700">{setting.name}</span>
                    <button
                      className={`w-12 h-7 rounded-full transition-colors ${
                        setting.enabled ? "bg-rose-500" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                          setting.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-6">
            {/* Adherence Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <p className="text-2xl font-bold text-green-600">92%</p>
                <p className="text-sm text-gray-500">This Week</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <p className="text-2xl font-bold text-green-600">88%</p>
                <p className="text-sm text-gray-500">This Month</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <p className="text-2xl font-bold text-green-600">14</p>
                <p className="text-sm text-gray-500">Day Streak</p>
              </div>
            </div>

            {/* Weekly Calendar */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">This Week</h3>
              <div className="grid grid-cols-7 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="text-center text-sm text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                {[100, 100, 80, 100, 100, 60, null].map((percent, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square rounded-xl flex items-center justify-center ${
                      percent === null
                        ? "bg-gray-50 text-gray-400"
                        : percent === 100
                        ? "bg-green-100 text-green-600"
                        : percent >= 80
                        ? "bg-amber-100 text-amber-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {percent !== null ? `${percent}%` : "-"}
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Log */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { med: "Vitamin D3", time: "8:00 AM", status: "taken", date: "Today" },
                  { med: "Omega-3", time: "8:00 AM", status: "taken", date: "Today" },
                  { med: "Probiotic", time: "7:00 AM", status: "taken", date: "Today" },
                  { med: "Magnesium", time: "9:00 PM", status: "taken", date: "Yesterday" },
                  { med: "Omega-3", time: "8:00 PM", status: "missed", date: "Yesterday" },
                ].map((log, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          log.status === "taken" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{log.med}</p>
                        <p className="text-sm text-gray-500">{log.date} at {log.time}</p>
                      </div>
                    </div>
                    <span
                      className={`text-sm capitalize ${
                        log.status === "taken" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Add New Item</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <div className="flex gap-2">
                    {[
                      { id: "medication", label: "💊 Medication" },
                      { id: "supplement", label: "🌿 Supplement" },
                      { id: "vitamin", label: "✨ Vitamin" },
                    ].map((type) => (
                      <button
                        key={type.id}
                        className="flex-1 px-3 py-2 bg-gray-100 hover:bg-rose-100 rounded-lg text-sm"
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    placeholder="e.g., Vitamin D3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dosage
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 rounded-xl"
                      placeholder="e.g., 5000 IU"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency
                    </label>
                    <select className="w-full p-3 border border-gray-200 rounded-xl">
                      <option>Daily</option>
                      <option>Twice daily</option>
                      <option>Weekly</option>
                      <option>As needed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time(s)
                  </label>
                  <input
                    type="time"
                    className="w-full p-3 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructions (optional)
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-200 rounded-xl resize-none"
                    rows={2}
                    placeholder="e.g., Take with food"
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
                <button className="flex-1 px-4 py-3 bg-rose-600 text-white rounded-xl font-medium">
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedMed && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{selectedMed.name}</h3>
                <button
                  onClick={() => setSelectedMed(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <span className="text-4xl">{typeColors[selectedMed.type].icon}</span>
                  <div>
                    <p className="text-xl font-bold text-gray-900">{selectedMed.dosage}</p>
                    <p className="text-gray-500">{selectedMed.frequency}</p>
                  </div>
                </div>

                {selectedMed.instructions && (
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Instructions:</strong> {selectedMed.instructions}
                    </p>
                  </div>
                )}

                {selectedMed.notes && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">
                      📝 <strong>Notes:</strong> {selectedMed.notes}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <p className="text-sm text-gray-500">Started</p>
                    <p className="font-medium">
                      {selectedMed.startDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {selectedMed.remainingDoses && (
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <p className="text-sm text-gray-500">Remaining</p>
                      <p className="font-medium">{selectedMed.remainingDoses} doses</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium">
                    Edit
                  </button>
                  <button className="flex-1 px-4 py-3 bg-red-100 text-red-600 rounded-xl font-medium">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
