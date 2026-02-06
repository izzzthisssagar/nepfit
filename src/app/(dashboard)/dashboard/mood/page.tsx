"use client";

import { useState } from "react";

type MoodLevel = 1 | 2 | 3 | 4 | 5;
type StressLevel = "low" | "moderate" | "high" | "very_high";
type EnergyLevel = "exhausted" | "tired" | "normal" | "energized" | "very_energized";

interface MoodEntry {
  id: string;
  date: string;
  time: string;
  mood: MoodLevel;
  stress: StressLevel;
  energy: EnergyLevel;
  emotions: string[];
  triggers: string[];
  activities: string[];
  notes?: string;
  mealRelated?: boolean;
}

const mockMoodEntries: MoodEntry[] = [
  {
    id: "1",
    date: "2026-02-07",
    time: "08:30",
    mood: 4,
    stress: "low",
    energy: "energized",
    emotions: ["happy", "calm", "motivated"],
    triggers: [],
    activities: ["exercise", "meditation"],
    notes: "Great morning after good sleep",
  },
  {
    id: "2",
    date: "2026-02-07",
    time: "14:00",
    mood: 3,
    stress: "moderate",
    energy: "normal",
    emotions: ["focused", "slightly_anxious"],
    triggers: ["work_deadline"],
    activities: ["work"],
    mealRelated: true,
  },
  {
    id: "3",
    date: "2026-02-06",
    time: "20:00",
    mood: 4,
    stress: "low",
    energy: "tired",
    emotions: ["content", "relaxed"],
    triggers: [],
    activities: ["family_time", "light_dinner"],
  },
  {
    id: "4",
    date: "2026-02-06",
    time: "12:00",
    mood: 2,
    stress: "high",
    energy: "tired",
    emotions: ["frustrated", "overwhelmed"],
    triggers: ["skipped_breakfast", "work_stress"],
    activities: ["work"],
    notes: "Should have eaten breakfast",
    mealRelated: true,
  },
  {
    id: "5",
    date: "2026-02-05",
    time: "18:00",
    mood: 5,
    stress: "low",
    energy: "very_energized",
    emotions: ["joyful", "grateful", "excited"],
    triggers: [],
    activities: ["exercise", "social"],
    notes: "Had a great workout and met friends",
  },
];

const moodEmojis: Record<MoodLevel, { emoji: string; label: string; color: string }> = {
  1: { emoji: "😢", label: "Very Bad", color: "bg-red-500" },
  2: { emoji: "😟", label: "Bad", color: "bg-orange-500" },
  3: { emoji: "😐", label: "Neutral", color: "bg-yellow-500" },
  4: { emoji: "🙂", label: "Good", color: "bg-green-400" },
  5: { emoji: "😄", label: "Great", color: "bg-green-500" },
};

const emotions = [
  { id: "happy", label: "Happy", icon: "😊" },
  { id: "calm", label: "Calm", icon: "😌" },
  { id: "motivated", label: "Motivated", icon: "💪" },
  { id: "focused", label: "Focused", icon: "🎯" },
  { id: "grateful", label: "Grateful", icon: "🙏" },
  { id: "joyful", label: "Joyful", icon: "🥳" },
  { id: "excited", label: "Excited", icon: "🤩" },
  { id: "content", label: "Content", icon: "☺️" },
  { id: "relaxed", label: "Relaxed", icon: "😎" },
  { id: "slightly_anxious", label: "Slightly Anxious", icon: "😬" },
  { id: "stressed", label: "Stressed", icon: "😰" },
  { id: "frustrated", label: "Frustrated", icon: "😤" },
  { id: "sad", label: "Sad", icon: "😢" },
  { id: "overwhelmed", label: "Overwhelmed", icon: "😵" },
  { id: "angry", label: "Angry", icon: "😠" },
  { id: "lonely", label: "Lonely", icon: "😔" },
];

const triggers = [
  { id: "skipped_meal", label: "Skipped Meal", icon: "🍽️" },
  { id: "poor_sleep", label: "Poor Sleep", icon: "😴" },
  { id: "work_stress", label: "Work Stress", icon: "💼" },
  { id: "work_deadline", label: "Deadline", icon: "⏰" },
  { id: "relationship", label: "Relationship", icon: "💔" },
  { id: "health", label: "Health Issue", icon: "🤒" },
  { id: "financial", label: "Financial", icon: "💰" },
  { id: "social", label: "Social Event", icon: "👥" },
  { id: "weather", label: "Weather", icon: "🌧️" },
  { id: "caffeine", label: "Too Much Caffeine", icon: "☕" },
  { id: "sugar_crash", label: "Sugar Crash", icon: "🍬" },
];

const activities = [
  { id: "exercise", label: "Exercise", icon: "🏃" },
  { id: "meditation", label: "Meditation", icon: "🧘" },
  { id: "work", label: "Work", icon: "💻" },
  { id: "social", label: "Socializing", icon: "👥" },
  { id: "family_time", label: "Family Time", icon: "👨‍👩‍👧" },
  { id: "reading", label: "Reading", icon: "📚" },
  { id: "nature", label: "Nature Walk", icon: "🌳" },
  { id: "hobby", label: "Hobby", icon: "🎨" },
  { id: "light_dinner", label: "Light Meal", icon: "🥗" },
  { id: "heavy_meal", label: "Heavy Meal", icon: "🍔" },
];

export default function MoodPage() {
  const [activeTab, setActiveTab] = useState<"track" | "history" | "insights" | "journal">("track");
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [selectedStress, setSelectedStress] = useState<StressLevel>("moderate");
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel>("normal");
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const todayEntries = mockMoodEntries.filter((e) => e.date === "2026-02-07");
  const avgMood = mockMoodEntries.reduce((sum, e) => sum + e.mood, 0) / mockMoodEntries.length;
  const moodTrend = mockMoodEntries.slice(0, 3).reduce((sum, e) => sum + e.mood, 0) / 3 -
    mockMoodEntries.slice(3, 6).reduce((sum, e) => sum + e.mood, 0) / 3;

  const toggleSelection = (
    item: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const getStressColor = (stress: StressLevel) => {
    switch (stress) {
      case "low":
        return "bg-green-100 text-green-700";
      case "moderate":
        return "bg-yellow-100 text-yellow-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "very_high":
        return "bg-red-100 text-red-700";
    }
  };

  const getEnergyIcon = (energy: EnergyLevel) => {
    switch (energy) {
      case "exhausted":
        return "🔋";
      case "tired":
        return "🪫";
      case "normal":
        return "⚡";
      case "energized":
        return "⚡⚡";
      case "very_energized":
        return "⚡⚡⚡";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Mood & Wellness</h1>
        <p className="text-neutral-600">Track your emotional wellbeing and discover patterns</p>
      </div>

      {/* Today's Summary */}
      <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">Today&apos;s Mood Summary</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-4xl">{todayEntries.length > 0 ? moodEmojis[todayEntries[0].mood].emoji : "❓"}</p>
            <p className="text-sm text-white/80 mt-2">Current Mood</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold">{todayEntries.length}</p>
            <p className="text-sm text-white/80">Check-ins Today</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold">{avgMood.toFixed(1)}</p>
            <p className="text-sm text-white/80">Avg This Week</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold">{moodTrend > 0 ? "↑" : moodTrend < 0 ? "↓" : "→"}</p>
            <p className="text-sm text-white/80">Trend</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 overflow-x-auto">
        {[
          { id: "track", label: "Track Mood", icon: "😊" },
          { id: "history", label: "History", icon: "📅" },
          { id: "insights", label: "Insights", icon: "📊" },
          { id: "journal", label: "Journal", icon: "📝" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "text-pink-600 border-b-2 border-pink-500"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Track Mood Tab */}
      {activeTab === "track" && (
        <div className="space-y-6">
          {/* Mood Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">How are you feeling?</h3>
            <div className="flex justify-between gap-2">
              {([1, 2, 3, 4, 5] as MoodLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedMood(level)}
                  className={`flex-1 p-4 rounded-xl transition-all ${
                    selectedMood === level
                      ? `${moodEmojis[level].color} text-white scale-110`
                      : "bg-neutral-100 hover:bg-neutral-200"
                  }`}
                >
                  <span className="text-4xl">{moodEmojis[level].emoji}</span>
                  <p className="text-xs mt-2">{moodEmojis[level].label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Stress Level */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">Stress Level</h3>
            <div className="flex flex-wrap gap-2">
              {(["low", "moderate", "high", "very_high"] as StressLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedStress(level)}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    selectedStress === level
                      ? "bg-pink-500 text-white"
                      : "bg-neutral-100 hover:bg-neutral-200"
                  }`}
                >
                  {level.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">Energy Level</h3>
            <div className="flex flex-wrap gap-2">
              {(["exhausted", "tired", "normal", "energized", "very_energized"] as EnergyLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedEnergy(level)}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    selectedEnergy === level
                      ? "bg-yellow-500 text-white"
                      : "bg-neutral-100 hover:bg-neutral-200"
                  }`}
                >
                  {getEnergyIcon(level)} {level.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Emotions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">What emotions are you feeling?</h3>
            <div className="flex flex-wrap gap-2">
              {emotions.map((emotion) => (
                <button
                  key={emotion.id}
                  onClick={() => toggleSelection(emotion.id, selectedEmotions, setSelectedEmotions)}
                  className={`px-3 py-2 rounded-xl text-sm transition-all ${
                    selectedEmotions.includes(emotion.id)
                      ? "bg-purple-500 text-white"
                      : "bg-neutral-100 hover:bg-neutral-200"
                  }`}
                >
                  {emotion.icon} {emotion.label}
                </button>
              ))}
            </div>
          </div>

          {/* Triggers */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">Any triggers? (optional)</h3>
            <div className="flex flex-wrap gap-2">
              {triggers.map((trigger) => (
                <button
                  key={trigger.id}
                  onClick={() => toggleSelection(trigger.id, selectedTriggers, setSelectedTriggers)}
                  className={`px-3 py-2 rounded-xl text-sm transition-all ${
                    selectedTriggers.includes(trigger.id)
                      ? "bg-red-500 text-white"
                      : "bg-neutral-100 hover:bg-neutral-200"
                  }`}
                >
                  {trigger.icon} {trigger.label}
                </button>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">What have you been doing?</h3>
            <div className="flex flex-wrap gap-2">
              {activities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => toggleSelection(activity.id, selectedActivities, setSelectedActivities)}
                  className={`px-3 py-2 rounded-xl text-sm transition-all ${
                    selectedActivities.includes(activity.id)
                      ? "bg-blue-500 text-white"
                      : "bg-neutral-100 hover:bg-neutral-200"
                  }`}
                >
                  {activity.icon} {activity.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">Notes (optional)</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling? What's on your mind?"
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl resize-none"
              rows={4}
            />
          </div>

          <button
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Save Check-in
          </button>
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {mockMoodEntries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{moodEmojis[entry.mood].emoji}</div>
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })} at {entry.time}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStressColor(entry.stress)}`}>
                        {entry.stress} stress
                      </span>
                      <span className="text-xs text-neutral-500">{getEnergyIcon(entry.energy)} {entry.energy}</span>
                    </div>
                  </div>
                </div>
                {entry.mealRelated && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                    🍽️ Meal related
                  </span>
                )}
              </div>

              {entry.emotions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {entry.emotions.map((emotionId) => {
                    const emotion = emotions.find((e) => e.id === emotionId);
                    return emotion ? (
                      <span key={emotionId} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        {emotion.icon} {emotion.label}
                      </span>
                    ) : null;
                  })}
                </div>
              )}

              {entry.notes && (
                <p className="mt-3 text-sm text-neutral-600 italic">&quot;{entry.notes}&quot;</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === "insights" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">Mood-Food Connection</h3>
            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-green-800">
                  ✅ Your mood is 40% better on days when you eat breakfast
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl">
                <p className="text-orange-800">
                  ⚠️ Skipping meals correlates with frustration and low energy
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-blue-800">
                  💡 Light dinners improve your evening mood scores
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">Activity Impact</h3>
            <div className="space-y-4">
              {[
                { activity: "Exercise", impact: "+45%", icon: "🏃" },
                { activity: "Meditation", impact: "+35%", icon: "🧘" },
                { activity: "Social Time", impact: "+30%", icon: "👥" },
                { activity: "Nature Walk", impact: "+25%", icon: "🌳" },
              ].map((item) => (
                <div key={item.activity} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <span className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span>{item.activity}</span>
                  </span>
                  <span className="text-green-600 font-semibold">{item.impact} mood</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">Weekly Mood Pattern</h3>
            <div className="flex items-end justify-between gap-2 h-32">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                const height = [3, 4, 3, 2, 4, 5, 4][i];
                return (
                  <div key={day} className="flex-1 flex flex-col items-center">
                    <div className="w-full h-24 bg-neutral-100 rounded-lg relative overflow-hidden">
                      <div
                        className={`absolute bottom-0 w-full rounded-lg ${moodEmojis[height as MoodLevel].color}`}
                        style={{ height: `${(height / 5) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs mt-2 text-neutral-500">{day}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Journal Tab */}
      {activeTab === "journal" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">✍️ Gratitude Journal</h3>
            <p className="text-neutral-500 mb-4">Write 3 things you&apos;re grateful for today</p>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-semibold">
                    {i}
                  </span>
                  <input
                    type="text"
                    placeholder={`I'm grateful for...`}
                    className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl"
                  />
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transition-colors">
              Save Gratitude
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">📝 Free Writing</h3>
            <textarea
              placeholder="Write your thoughts freely..."
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl resize-none"
              rows={6}
            />
            <button className="w-full mt-4 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
              Save Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
