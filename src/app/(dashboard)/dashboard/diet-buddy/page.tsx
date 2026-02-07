"use client";

import { useState } from "react";

interface Buddy {
  id: string;
  name: string;
  avatar: string;
  city: string;
  goal: string;
  dietPreference: string;
  streak: number;
  loggedToday: boolean;
  lastActive: string;
  joinedDate: string;
  milestonesReached: number;
}

interface ActivityItem {
  id: string;
  buddyName: string;
  avatar: string;
  type: "milestone" | "streak" | "logged" | "goal" | "encouragement";
  message: string;
  timestamp: string;
  icon: string;
}

interface MatchCriteria {
  id: string;
  label: string;
  value: string;
  icon: string;
  options: string[];
}

interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  relation: string;
  streak: number;
  logsThisWeek: number;
  points: number;
  rank: number;
}

interface PrivacySetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const currentBuddy: Buddy = {
  id: "1",
  name: "Aarav S.",
  avatar: "👨",
  city: "Kathmandu",
  goal: "Weight Loss",
  dietPreference: "Vegetarian",
  streak: 12,
  loggedToday: true,
  lastActive: "2 hours ago",
  joinedDate: "2025-12-15",
  milestonesReached: 5,
};

const potentialMatches: Buddy[] = [
  { id: "2", name: "Priya K.", avatar: "👩", city: "Kathmandu", goal: "Weight Loss", dietPreference: "Vegetarian", streak: 8, loggedToday: false, lastActive: "5 hours ago", joinedDate: "2026-01-10", milestonesReached: 3 },
  { id: "3", name: "Rahul T.", avatar: "👨", city: "Pokhara", goal: "Muscle Gain", dietPreference: "Non-Veg", streak: 15, loggedToday: true, lastActive: "1 hour ago", joinedDate: "2025-11-20", milestonesReached: 8 },
  { id: "4", name: "Sneha M.", avatar: "👩", city: "Lalitpur", goal: "Healthy Living", dietPreference: "Vegan", streak: 22, loggedToday: true, lastActive: "30 min ago", joinedDate: "2025-10-01", milestonesReached: 12 },
  { id: "5", name: "Anonymous", avatar: "🙈", city: "Bhaktapur", goal: "Weight Loss", dietPreference: "Vegetarian", streak: 6, loggedToday: false, lastActive: "1 day ago", joinedDate: "2026-01-25", milestonesReached: 1 },
];

const activityFeed: ActivityItem[] = [
  { id: "1", buddyName: "Aarav S.", avatar: "👨", type: "streak", message: "reached a 12-day logging streak!", timestamp: "2 hours ago", icon: "🔥" },
  { id: "2", buddyName: "Aarav S.", avatar: "👨", type: "logged", message: "logged all 3 meals today", timestamp: "3 hours ago", icon: "✅" },
  { id: "3", buddyName: "You", avatar: "🧑", type: "milestone", message: "completed 7 days of consistent logging", timestamp: "Yesterday", icon: "🏆" },
  { id: "4", buddyName: "Aarav S.", avatar: "👨", type: "goal", message: "is 2kg away from goal weight!", timestamp: "2 days ago", icon: "🎯" },
  { id: "5", buddyName: "You", avatar: "🧑", type: "encouragement", message: "sent a nudge to Aarav", timestamp: "2 days ago", icon: "💪" },
  { id: "6", buddyName: "Aarav S.", avatar: "👨", type: "milestone", message: "logged 30 total days!", timestamp: "3 days ago", icon: "🎉" },
  { id: "7", buddyName: "You", avatar: "🧑", type: "streak", message: "reached a 9-day streak", timestamp: "4 days ago", icon: "🔥" },
];

const matchCriteria: MatchCriteria[] = [
  { id: "1", label: "Goal Type", value: "Weight Loss", icon: "🎯", options: ["Weight Loss", "Muscle Gain", "Healthy Living", "Disease Management"] },
  { id: "2", label: "Diet Preference", value: "Vegetarian", icon: "🥗", options: ["Vegetarian", "Non-Veg", "Vegan", "Flexitarian", "Any"] },
  { id: "3", label: "Activity Level", value: "Moderate", icon: "🏃", options: ["Sedentary", "Light", "Moderate", "Active", "Very Active"] },
  { id: "4", label: "Location", value: "Same City", icon: "📍", options: ["Same City", "Same Country", "Any Location"] },
];

const familyMembers: FamilyMember[] = [
  { id: "1", name: "You", avatar: "🧑", relation: "Self", streak: 9, logsThisWeek: 6, points: 450, rank: 1 },
  { id: "2", name: "Sita (Wife)", avatar: "👩", relation: "Spouse", streak: 7, logsThisWeek: 5, points: 380, rank: 2 },
  { id: "3", name: "Baba (Father)", avatar: "👴", relation: "Father", streak: 4, logsThisWeek: 4, points: 220, rank: 3 },
  { id: "4", name: "Aama (Mother)", avatar: "👵", relation: "Mother", streak: 11, logsThisWeek: 7, points: 520, rank: 4 },
];

const privacySettings: PrivacySetting[] = [
  { id: "1", label: "Share Logging Status", description: "Buddy can see if you logged meals (not what you ate)", enabled: true },
  { id: "2", label: "Share Streak Count", description: "Show your current logging streak to buddy", enabled: true },
  { id: "3", label: "Share Weight Trend", description: "Show direction only (losing/gaining), not actual numbers", enabled: false },
  { id: "4", label: "Share Meal Details", description: "Let buddy see what foods you logged", enabled: false },
  { id: "5", label: "Share Calorie Totals", description: "Show daily calorie totals to buddy", enabled: false },
];

const milestonesList = [
  { title: "7-Day Streak", icon: "🔥", achieved: true, date: "Jan 28" },
  { title: "30 Days Logged", icon: "📅", achieved: true, date: "Feb 3" },
  { title: "5kg Lost Together", icon: "⚖️", achieved: false, date: null },
  { title: "100 Meals Logged", icon: "🍽️", achieved: false, date: null },
  { title: "Both Hit Goal Weight", icon: "🏆", achieved: false, date: null },
];

export default function DietBuddyPage() {
  const [activeTab, setActiveTab] = useState<"buddy" | "find" | "activity" | "family">("buddy");
  const [privacy, setPrivacy] = useState<PrivacySetting[]>(privacySettings);
  const [nudgeSent, setNudgeSent] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<Record<string, string>>({
    "1": "Weight Loss",
    "2": "Vegetarian",
    "3": "Moderate",
    "4": "Same City",
  });

  const togglePrivacy = (id: string) => {
    setPrivacy((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const sendNudge = () => {
    setNudgeSent(true);
    setTimeout(() => setNudgeSent(false), 3000);
  };

  const myStreak = 9;
  const buddyStreak = currentBuddy.streak;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Diet Buddy</h1>
          <p className="text-neutral-500 mt-1">Stay accountable with a partner who gets it</p>
        </div>

        {/* Buddy Status Banner */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
              {currentBuddy.avatar}
            </div>
            <div className="flex-1">
              <p className="text-primary-100 text-sm">Your Buddy</p>
              <h2 className="text-2xl font-bold">{currentBuddy.name}</h2>
              <p className="text-primary-100 text-sm mt-1">
                {currentBuddy.loggedToday ? "Logged today" : "Hasn't logged today"} | {currentBuddy.city}
              </p>
            </div>
            <div className="text-center bg-white/20 rounded-xl p-3">
              <p className="text-2xl font-bold">{currentBuddy.streak}</p>
              <p className="text-xs text-primary-100">day streak</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "buddy", label: "My Buddy", icon: "👥" },
            { id: "find", label: "Find Buddy", icon: "🔍" },
            { id: "activity", label: "Activity", icon: "📋" },
            { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-primary-500 text-white shadow-lg"
                  : "bg-white text-neutral-600 hover:bg-primary-50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* My Buddy Tab */}
        {activeTab === "buddy" && (
          <div className="space-y-6">
            {/* Buddy Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-3xl">
                  {currentBuddy.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 text-lg">{currentBuddy.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <span>📍 {currentBuddy.city}</span>
                    <span>|</span>
                    <span>🎯 {currentBuddy.goal}</span>
                    <span>|</span>
                    <span>🥗 {currentBuddy.dietPreference}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentBuddy.loggedToday
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {currentBuddy.loggedToday ? "Active Today" : "Not Logged"}
                </div>
              </div>

              {/* Buddy Stats Comparison */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-neutral-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-neutral-500">Your Streak</p>
                  <p className="text-2xl font-bold text-primary-600">{myStreak}</p>
                </div>
                <div className="bg-neutral-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-neutral-500">vs</p>
                  <p className="text-2xl font-bold text-neutral-400">
                    {myStreak > buddyStreak ? "You Lead!" : myStreak === buddyStreak ? "Tied!" : "Buddy Leads!"}
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-neutral-500">Buddy Streak</p>
                  <p className="text-2xl font-bold text-primary-600">{buddyStreak}</p>
                </div>
              </div>

              {/* Encouragement Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={sendNudge}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    nudgeSent
                      ? "bg-green-100 text-green-700"
                      : "bg-primary-500 text-white hover:bg-primary-600"
                  }`}
                >
                  {nudgeSent ? "Nudge Sent!" : "Send Nudge"}
                </button>
                <button className="flex-1 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-medium hover:bg-neutral-200 transition-all">
                  Send Encouragement
                </button>
                <button className="py-3 px-4 bg-amber-100 text-amber-700 rounded-xl font-medium hover:bg-amber-200 transition-all">
                  Celebrate!
                </button>
              </div>
            </div>

            {/* Nudge Alert */}
            {!currentBuddy.loggedToday && (
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 flex items-center gap-4">
                <span className="text-2xl">⚡</span>
                <div className="flex-1">
                  <p className="font-medium text-amber-800">Your buddy hasn't logged today!</p>
                  <p className="text-sm text-amber-600">Send a friendly nudge to keep them on track</p>
                </div>
                <button
                  onClick={sendNudge}
                  className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600"
                >
                  Nudge
                </button>
              </div>
            )}

            {/* Milestones Together */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Milestones Together</h3>
              <div className="space-y-3">
                {milestonesList.map((milestone, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 p-4 rounded-xl ${
                      milestone.achieved
                        ? "bg-green-50 border border-green-200"
                        : "bg-neutral-50 border border-neutral-200"
                    }`}
                  >
                    <span className="text-2xl">{milestone.icon}</span>
                    <div className="flex-1">
                      <p className={`font-medium ${milestone.achieved ? "text-green-800" : "text-neutral-500"}`}>
                        {milestone.title}
                      </p>
                      {milestone.date && (
                        <p className="text-xs text-neutral-400">Achieved {milestone.date}</p>
                      )}
                    </div>
                    {milestone.achieved && (
                      <span className="text-green-600 text-sm font-medium">Completed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Privacy Controls</h3>
              <p className="text-sm text-neutral-500 mb-4">Control what your buddy can see</p>
              <div className="space-y-3">
                {privacy.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                    <div>
                      <p className="font-medium text-neutral-900">{setting.label}</p>
                      <p className="text-sm text-neutral-500">{setting.description}</p>
                    </div>
                    <button
                      onClick={() => togglePrivacy(setting.id)}
                      className={`w-12 h-7 rounded-full transition-all relative ${
                        setting.enabled ? "bg-primary-500" : "bg-neutral-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${
                          setting.enabled ? "right-1" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Find Buddy Tab */}
        {activeTab === "find" && (
          <div className="space-y-6">
            {/* Matching Criteria */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Matching Preferences</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {matchCriteria.map((criteria) => (
                  <div key={criteria.id} className="p-4 bg-neutral-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{criteria.icon}</span>
                      <span className="font-medium text-neutral-900">{criteria.label}</span>
                    </div>
                    <select
                      value={selectedCriteria[criteria.id]}
                      onChange={(e) =>
                        setSelectedCriteria((prev) => ({ ...prev, [criteria.id]: e.target.value }))
                      }
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm"
                    >
                      {criteria.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-all">
                Find Matching Buddies
              </button>
            </div>

            {/* Potential Matches */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Potential Matches</h3>
              <div className="space-y-4">
                {potentialMatches.map((match) => (
                  <div key={match.id} className="p-4 rounded-xl border border-neutral-200 hover:border-primary-300 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
                        {match.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-neutral-900">{match.name}</h4>
                          {match.loggedToday && (
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <span>{match.city}</span>
                          <span>|</span>
                          <span>{match.goal}</span>
                          <span>|</span>
                          <span>{match.dietPreference}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
                          <span>Streak: {match.streak} days</span>
                          <span>Milestones: {match.milestonesReached}</span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-all">
                        Connect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Anonymous Option */}
            <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6">
              <div className="flex items-center gap-4">
                <span className="text-3xl">🙈</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-neutral-900">Prefer to Stay Anonymous?</h4>
                  <p className="text-sm text-neutral-500">
                    Match with a buddy without revealing your identity. Share only your logging status and streaks.
                  </p>
                </div>
                <button className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800">
                  Anonymous Match
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Activity Feed</h3>
              <div className="space-y-4">
                {activityFeed.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                      {item.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-neutral-900">
                        <span className="font-medium">{item.buddyName}</span>{" "}
                        {item.message}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">{item.timestamp}</p>
                    </div>
                    <span className="text-xl">{item.icon}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buddy Stats */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-4">Partnership Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">54</p>
                  <p className="text-xs text-primary-100">Days as Buddies</p>
                </div>
                <div className="bg-white/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-primary-100">Nudges Sent</p>
                </div>
                <div className="bg-white/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-xs text-primary-100">Logging Rate</p>
                </div>
                <div className="bg-white/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-primary-100">Milestones</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Family Tab */}
        {activeTab === "family" && (
          <div className="space-y-6">
            {/* Family Leaderboard */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Family Leaderboard</h3>
              <div className="space-y-3">
                {familyMembers
                  .sort((a, b) => b.points - a.points)
                  .map((member, idx) => (
                    <div
                      key={member.id}
                      className={`flex items-center gap-4 p-4 rounded-xl ${
                        idx === 0
                          ? "bg-amber-50 border border-amber-200"
                          : "bg-neutral-50 border border-neutral-200"
                      }`}
                    >
                      <div className="w-8 h-8 flex items-center justify-center font-bold text-lg">
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                      </div>
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-xl">
                        {member.avatar}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-neutral-900">{member.name}</h4>
                        <p className="text-xs text-neutral-500">{member.relation}</p>
                      </div>
                      <div className="text-center px-3">
                        <p className="font-bold text-primary-600">{member.streak}</p>
                        <p className="text-xs text-neutral-400">streak</p>
                      </div>
                      <div className="text-center px-3">
                        <p className="font-bold text-neutral-900">{member.logsThisWeek}/7</p>
                        <p className="text-xs text-neutral-400">logs</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-600">{member.points}</p>
                        <p className="text-xs text-neutral-400">points</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Family Milestones */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Family Milestones</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "Family Streak", value: "4 days", desc: "All members logged", icon: "🔥", achieved: true },
                  { title: "Meals Together", value: "12", desc: "Shared meals logged", icon: "🍽️", achieved: true },
                  { title: "Total Points", value: "1,570", desc: "Combined family", icon: "⭐", achieved: true },
                  { title: "30-Day Family", value: "18/30", desc: "All log same day", icon: "🏆", achieved: false },
                ].map((milestone, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl p-4 text-center ${
                      milestone.achieved
                        ? "bg-primary-50 border border-primary-200"
                        : "bg-neutral-50 border border-neutral-200 opacity-60"
                    }`}
                  >
                    <span className="text-2xl">{milestone.icon}</span>
                    <p className="font-bold text-neutral-900 mt-2">{milestone.value}</p>
                    <p className="text-sm font-medium text-neutral-700">{milestone.title}</p>
                    <p className="text-xs text-neutral-400">{milestone.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Family Member */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
              <h4 className="font-semibold mb-2">Add Family Members</h4>
              <p className="text-sm text-primary-100 mb-4">
                Invite family members to join and track nutrition together
              </p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white text-primary-600 rounded-xl font-medium hover:bg-primary-50 transition-all">
                  Share Invite Link
                </button>
                <button className="px-4 py-2 bg-white/20 rounded-xl font-medium hover:bg-white/30 transition-all">
                  Enter Phone Number
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
