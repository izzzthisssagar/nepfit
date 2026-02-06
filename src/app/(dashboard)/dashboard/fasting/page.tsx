"use client";

import { useState, useEffect } from "react";

interface FastingProtocol {
  id: string;
  name: string;
  fastingHours: number;
  eatingHours: number;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  benefits: string[];
}

interface FastingSession {
  id: string;
  protocol: string;
  startTime: Date;
  endTime: Date;
  completed: boolean;
  notes?: string;
}

interface FastingStats {
  totalFasts: number;
  longestStreak: number;
  currentStreak: number;
  totalHoursFasted: number;
  averageFastDuration: number;
}

const protocols: FastingProtocol[] = [
  {
    id: "16-8",
    name: "16:8 Method",
    fastingHours: 16,
    eatingHours: 8,
    description: "Fast for 16 hours, eat within an 8-hour window",
    difficulty: "beginner",
    benefits: ["Weight loss", "Improved metabolism", "Easy to maintain"],
  },
  {
    id: "18-6",
    name: "18:6 Method",
    fastingHours: 18,
    eatingHours: 6,
    description: "Fast for 18 hours, eat within a 6-hour window",
    difficulty: "intermediate",
    benefits: ["Enhanced autophagy", "Better insulin sensitivity", "Mental clarity"],
  },
  {
    id: "20-4",
    name: "20:4 Warrior",
    fastingHours: 20,
    eatingHours: 4,
    description: "Fast for 20 hours, eat within a 4-hour window",
    difficulty: "advanced",
    benefits: ["Maximum fat burning", "Growth hormone boost", "Deep ketosis"],
  },
  {
    id: "omad",
    name: "OMAD",
    fastingHours: 23,
    eatingHours: 1,
    description: "One Meal A Day - eat all calories in one sitting",
    difficulty: "advanced",
    benefits: ["Simplified eating", "Maximum autophagy", "Time efficiency"],
  },
  {
    id: "5-2",
    name: "5:2 Diet",
    fastingHours: 24,
    eatingHours: 0,
    description: "Eat normally 5 days, restrict to 500-600 cal 2 days",
    difficulty: "intermediate",
    benefits: ["Flexible schedule", "Sustainable long-term", "Cognitive benefits"],
  },
  {
    id: "custom",
    name: "Custom Fast",
    fastingHours: 0,
    eatingHours: 0,
    description: "Set your own fasting and eating windows",
    difficulty: "beginner",
    benefits: ["Personalized", "Flexible", "Adaptable"],
  },
];

const mockHistory: FastingSession[] = [
  {
    id: "1",
    protocol: "16:8 Method",
    startTime: new Date(Date.now() - 86400000 * 2),
    endTime: new Date(Date.now() - 86400000 * 2 + 16 * 3600000),
    completed: true,
    notes: "Felt great, had black coffee",
  },
  {
    id: "2",
    protocol: "16:8 Method",
    startTime: new Date(Date.now() - 86400000),
    endTime: new Date(Date.now() - 86400000 + 16 * 3600000),
    completed: true,
  },
  {
    id: "3",
    protocol: "18:6 Method",
    startTime: new Date(Date.now() - 86400000 * 3),
    endTime: new Date(Date.now() - 86400000 * 3 + 18 * 3600000),
    completed: true,
    notes: "Challenging but rewarding",
  },
];

const mockStats: FastingStats = {
  totalFasts: 47,
  longestStreak: 12,
  currentStreak: 5,
  totalHoursFasted: 752,
  averageFastDuration: 16.5,
};

export default function FastingPage() {
  const [activeTab, setActiveTab] = useState<"timer" | "protocols" | "history" | "insights">("timer");
  const [selectedProtocol, setSelectedProtocol] = useState<FastingProtocol>(protocols[0]);
  const [isFasting, setIsFasting] = useState(false);
  const [fastStartTime, setFastStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [customHours, setCustomHours] = useState(16);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFasting && fastStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - fastStartTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFasting, fastStartTime]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = (): number => {
    if (!isFasting) return 0;
    const targetSeconds = selectedProtocol.fastingHours * 3600;
    return Math.min((elapsedTime / targetSeconds) * 100, 100);
  };

  const startFast = () => {
    setIsFasting(true);
    setFastStartTime(new Date());
    setElapsedTime(0);
  };

  const endFast = () => {
    setIsFasting(false);
    setFastStartTime(null);
    setElapsedTime(0);
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFastingPhase = (): { phase: string; description: string; color: string } => {
    const hours = elapsedTime / 3600;
    if (hours < 4) {
      return { phase: "Fed State", description: "Body is digesting food", color: "#22c55e" };
    } else if (hours < 8) {
      return { phase: "Early Fasting", description: "Insulin dropping, starting fat burn", color: "#84cc16" };
    } else if (hours < 12) {
      return { phase: "Fasting State", description: "Fat burning increasing", color: "#eab308" };
    } else if (hours < 16) {
      return { phase: "Fat Burning", description: "Strong fat oxidation", color: "#f97316" };
    } else if (hours < 20) {
      return { phase: "Ketosis", description: "Body using ketones for fuel", color: "#ef4444" };
    } else {
      return { phase: "Deep Ketosis", description: "Maximum autophagy & fat burn", color: "#dc2626" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Fasting Timer</h1>
          <p className="text-gray-600 mt-1">Track your intermittent fasting journey</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "timer", label: "Timer", icon: "⏱️" },
            { id: "protocols", label: "Protocols", icon: "📋" },
            { id: "history", label: "History", icon: "📅" },
            { id: "insights", label: "Insights", icon: "📊" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-orange-50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Timer Tab */}
        {activeTab === "timer" && (
          <div className="space-y-6">
            {/* Main Timer Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <div className="text-center">
                {/* Protocol Selector */}
                <button
                  onClick={() => setShowProtocolModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors mb-6"
                >
                  <span>🎯</span>
                  {selectedProtocol.name}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Circular Progress */}
                <div className="relative w-64 h-64 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="12"
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      fill="none"
                      stroke={isFasting ? getFastingPhase().color : "#d1d5db"}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 120}
                      strokeDashoffset={2 * Math.PI * 120 * (1 - getProgress() / 100)}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl md:text-5xl font-bold text-gray-900">
                      {formatTime(elapsedTime)}
                    </span>
                    {isFasting && (
                      <>
                        <span className="text-sm text-gray-500 mt-2">
                          Goal: {selectedProtocol.fastingHours}h
                        </span>
                        <span
                          className="text-sm font-medium mt-1"
                          style={{ color: getFastingPhase().color }}
                        >
                          {getFastingPhase().phase}
                        </span>
                      </>
                    )}
                    {!isFasting && (
                      <span className="text-gray-500 mt-2">Ready to start</span>
                    )}
                  </div>
                </div>

                {/* Fasting Phase Info */}
                {isFasting && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">{getFastingPhase().description}</p>
                  </div>
                )}

                {/* Control Buttons */}
                <div className="flex justify-center gap-4">
                  {!isFasting ? (
                    <button
                      onClick={startFast}
                      className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-semibold hover:bg-orange-700 transition-colors shadow-lg"
                    >
                      Start Fasting
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={endFast}
                        className="px-8 py-4 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition-colors"
                      >
                        End Fast
                      </button>
                      <button className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors">
                        Add Note
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Fasting Phases Guide */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fasting Phases</h3>
              <div className="space-y-3">
                {[
                  { hours: "0-4h", phase: "Fed State", desc: "Body digesting food", color: "#22c55e" },
                  { hours: "4-8h", phase: "Early Fasting", desc: "Insulin starts dropping", color: "#84cc16" },
                  { hours: "8-12h", phase: "Fasting State", desc: "Fat burning begins", color: "#eab308" },
                  { hours: "12-16h", phase: "Fat Burning Zone", desc: "Strong fat oxidation", color: "#f97316" },
                  { hours: "16-20h", phase: "Ketosis", desc: "Using ketones for fuel", color: "#ef4444" },
                  { hours: "20h+", phase: "Deep Ketosis", desc: "Autophagy activated", color: "#dc2626" },
                ].map((phase, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: phase.color }}
                    />
                    <span className="w-16 text-sm font-medium text-gray-600">{phase.hours}</span>
                    <span className="font-medium text-gray-900">{phase.phase}</span>
                    <span className="text-sm text-gray-500">- {phase.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Current Streak", value: `${mockStats.currentStreak} days`, icon: "🔥" },
                { label: "Total Fasts", value: mockStats.totalFasts.toString(), icon: "✅" },
                { label: "Hours Fasted", value: mockStats.totalHoursFasted.toString(), icon: "⏱️" },
                { label: "Avg Duration", value: `${mockStats.averageFastDuration}h`, icon: "📊" },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{stat.icon}</span>
                    <span className="text-sm text-gray-600">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Protocols Tab */}
        {activeTab === "protocols" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Protocol</h3>
              <p className="text-gray-600">
                Select an intermittent fasting protocol that fits your lifestyle
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {protocols.map((protocol) => (
                <div
                  key={protocol.id}
                  className={`bg-white rounded-2xl shadow-sm p-6 cursor-pointer transition-all border-2 ${
                    selectedProtocol.id === protocol.id
                      ? "border-orange-500 bg-orange-50"
                      : "border-transparent hover:border-orange-200"
                  }`}
                  onClick={() => setSelectedProtocol(protocol)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{protocol.name}</h4>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(
                          protocol.difficulty
                        )}`}
                      >
                        {protocol.difficulty}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-orange-600">
                        {protocol.fastingHours}h
                      </span>
                      <p className="text-xs text-gray-500">fasting</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{protocol.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {protocol.benefits.map((benefit, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                  {selectedProtocol.id === protocol.id && (
                    <div className="mt-4 pt-4 border-t border-orange-200">
                      <span className="text-sm text-orange-600 font-medium">✓ Selected</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Custom Fast Settings */}
            {selectedProtocol.id === "custom" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Custom Fast Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fasting Duration: {customHours} hours
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="72"
                      value={customHours}
                      onChange={(e) => setCustomHours(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>12h</span>
                      <span>24h</span>
                      <span>36h</span>
                      <span>48h</span>
                      <span>72h</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Fasting History</h3>
                  <p className="text-gray-600 text-sm">Your completed fasts</p>
                </div>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>All Time</option>
                </select>
              </div>
            </div>

            {/* Calendar View */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h4 className="font-semibold text-gray-900 mb-4">This Week</h4>
              <div className="grid grid-cols-7 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="text-center text-sm text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                {[true, true, false, true, true, false, null].map((completed, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square rounded-xl flex items-center justify-center ${
                      completed === true
                        ? "bg-green-100 text-green-600"
                        : completed === false
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {completed === true ? "✓" : completed === false ? "✗" : "-"}
                  </div>
                ))}
              </div>
            </div>

            {/* History List */}
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
              {mockHistory.map((session) => (
                <div key={session.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            session.completed ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <span className="font-medium text-gray-900">{session.protocol}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {session.startTime.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      {session.notes && (
                        <p className="text-sm text-gray-600 mt-2 italic">"{session.notes}"</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-orange-600">
                        {Math.round(
                          (session.endTime.getTime() - session.startTime.getTime()) / 3600000
                        )}
                        h
                      </span>
                      <p className="text-xs text-gray-500">duration</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === "insights" && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="text-3xl mb-2">🔥</div>
                <p className="text-sm text-gray-500">Longest Streak</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.longestStreak} days</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="text-3xl mb-2">⏱️</div>
                <p className="text-sm text-gray-500">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalHoursFasted}h</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 col-span-2 md:col-span-1">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-sm text-gray-500">Avg Fast</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.averageFastDuration}h</p>
              </div>
            </div>

            {/* Weekly Chart */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Overview</h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {[16, 18, 0, 16, 20, 0, 16].map((hours, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        hours > 0 ? "bg-orange-500" : "bg-gray-200"
                      }`}
                      style={{ height: `${(hours / 24) * 100}%`, minHeight: hours > 0 ? "20px" : "8px" }}
                    />
                    <span className="text-xs text-gray-500 mt-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Achieved */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits Unlocked</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Fat Burning", progress: 85, icon: "🔥" },
                  { title: "Autophagy", progress: 72, icon: "🔄" },
                  { title: "Mental Clarity", progress: 90, icon: "🧠" },
                  { title: "Energy Levels", progress: 78, icon: "⚡" },
                ].map((benefit, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>{benefit.icon}</span>
                        <span className="font-medium text-gray-900">{benefit.title}</span>
                      </div>
                      <span className="text-sm text-orange-600 font-medium">{benefit.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${benefit.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Stay hydrated with water, black coffee, or unsweetened tea during fasts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Break your fast with protein-rich foods for better satiety</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Schedule eating windows around your social activities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Listen to your body - it's okay to adjust your protocol</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Protocol Selection Modal */}
        {showProtocolModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Select Protocol</h3>
                <button
                  onClick={() => setShowProtocolModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-2">
                {protocols.map((protocol) => (
                  <button
                    key={protocol.id}
                    onClick={() => {
                      setSelectedProtocol(protocol);
                      setShowProtocolModal(false);
                    }}
                    className={`w-full p-4 rounded-xl text-left transition-colors ${
                      selectedProtocol.id === protocol.id
                        ? "bg-orange-100 border-2 border-orange-500"
                        : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{protocol.name}</span>
                      <span className="text-orange-600 font-bold">{protocol.fastingHours}h</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{protocol.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
