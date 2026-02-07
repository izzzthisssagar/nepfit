"use client";

import { useState } from "react";
import { Card, CardHeader, Button } from "@/components/ui";

type TabType = "all" | "meal_reminders" | "health_alerts" | "social" | "system";

interface MockNotification {
  id: string;
  type: "meal_reminder" | "health_alert" | "social" | "achievement" | "system" | "water_reminder" | "streak";
  title: string;
  message: string;
  icon: string;
  read: boolean;
  timestamp: string;
  priority: "low" | "medium" | "high";
}

const mockNotifications: MockNotification[] = [
  {
    id: "1",
    type: "meal_reminder",
    title: "Lunch Time!",
    message: "Don't forget to log your lunch. You've consumed 680 cal so far today.",
    icon: "🍽️",
    read: false,
    timestamp: "5 min ago",
    priority: "medium",
  },
  {
    id: "2",
    type: "streak",
    title: "Streak at Risk!",
    message: "You haven't logged any meals today. Your 12-day streak is at risk! Log now to keep it going.",
    icon: "🔥",
    read: false,
    timestamp: "1 hour ago",
    priority: "high",
  },
  {
    id: "3",
    type: "social",
    title: "Friend Request",
    message: "Anisha Sharma wants to be your buddy on NepFit. Accept to share progress!",
    icon: "👥",
    read: false,
    timestamp: "2 hours ago",
    priority: "low",
  },
  {
    id: "4",
    type: "achievement",
    title: "Achievement Unlocked!",
    message: "Congratulations! You've earned the 'Week Warrior' badge for logging 7 days straight.",
    icon: "🏆",
    read: false,
    timestamp: "3 hours ago",
    priority: "medium",
  },
  {
    id: "5",
    type: "health_alert",
    title: "Blood Sugar Alert",
    message: "Your post-meal reading of 195 mg/dL is elevated. Consider a light walk and monitor closely.",
    icon: "⚠️",
    read: true,
    timestamp: "5 hours ago",
    priority: "high",
  },
  {
    id: "6",
    type: "water_reminder",
    title: "Hydration Reminder",
    message: "Time to drink water! You've had 4/8 glasses today. Stay hydrated!",
    icon: "💧",
    read: true,
    timestamp: "6 hours ago",
    priority: "low",
  },
  {
    id: "7",
    type: "system",
    title: "Weekly Report Ready",
    message: "Your weekly nutrition report is ready. You consumed an avg of 1,850 cal/day. Tap to view details.",
    icon: "📊",
    read: true,
    timestamp: "1 day ago",
    priority: "medium",
  },
  {
    id: "8",
    type: "meal_reminder",
    title: "Breakfast Reminder",
    message: "Good morning! Start your day right by logging breakfast. Try our oatmeal recipe suggestion!",
    icon: "🌅",
    read: true,
    timestamp: "1 day ago",
    priority: "medium",
  },
  {
    id: "9",
    type: "social",
    title: "Ramesh completed a challenge!",
    message: "Your buddy Ramesh completed the 'Hydration Hero' challenge. Send them a cheer!",
    icon: "🎉",
    read: true,
    timestamp: "2 days ago",
    priority: "low",
  },
  {
    id: "10",
    type: "health_alert",
    title: "Weight Trend Update",
    message: "You've lost 1.2 kg this month! You're on track to reach your goal by March. Keep it up!",
    icon: "📉",
    read: true,
    timestamp: "3 days ago",
    priority: "medium",
  },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [notifications, setNotifications] = useState<MockNotification[]>(mockNotifications);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    mealReminders: true,
    healthAlerts: true,
    social: true,
    achievements: true,
    system: true,
    waterReminders: true,
    streakAlerts: true,
  });
  const [quietHours, setQuietHours] = useState({
    enabled: false,
    start: "22:00",
    end: "07:00",
  });
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [frequency, setFrequency] = useState<"instant" | "hourly" | "daily">("instant");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "meal_reminders") return n.type === "meal_reminder" || n.type === "water_reminder";
    if (activeTab === "health_alerts") return n.type === "health_alert";
    if (activeTab === "social") return n.type === "social" || n.type === "achievement";
    if (activeTab === "system") return n.type === "system" || n.type === "streak";
    return true;
  });

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
          <span className="text-3xl">🔔</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
          <p className="text-neutral-500">{unreadCount} unread notifications</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="p-2 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-all"
          >
            <span className="text-xl">⚙️</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="secondary" fullWidth onClick={handleMarkAllRead}>
          Mark All Read
        </Button>
        <Button variant="secondary" fullWidth onClick={handleClearAll}>
          Clear All
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-neutral-100 rounded-xl p-1 gap-1 overflow-x-auto">
        {[
          { id: "all", label: "All", icon: "📬" },
          { id: "meal_reminders", label: "Meals", icon: "🍽️" },
          { id: "health_alerts", label: "Health", icon: "❤️" },
          { id: "social", label: "Social", icon: "👥" },
          { id: "system", label: "System", icon: "🔧" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Preferences Panel */}
      {showPreferences && (
        <Card className="border-primary-200 bg-primary-50/30">
          <CardHeader title="Notification Preferences" />

          {/* Toggle Each Type */}
          <div className="space-y-3 mb-6">
            {[
              { key: "mealReminders", label: "Meal Reminders", icon: "🍽️" },
              { key: "healthAlerts", label: "Health Alerts", icon: "❤️" },
              { key: "social", label: "Social Updates", icon: "👥" },
              { key: "achievements", label: "Achievements", icon: "🏆" },
              { key: "waterReminders", label: "Water Reminders", icon: "💧" },
              { key: "streakAlerts", label: "Streak Alerts", icon: "🔥" },
              { key: "system", label: "System", icon: "🔧" },
            ].map((pref) => (
              <div key={pref.key} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span>{pref.icon}</span>
                  <span className="text-neutral-700 text-sm">{pref.label}</span>
                </div>
                <button
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      [pref.key]: !preferences[pref.key as keyof typeof preferences],
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    preferences[pref.key as keyof typeof preferences]
                      ? "bg-primary-500"
                      : "bg-neutral-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${
                      preferences[pref.key as keyof typeof preferences]
                        ? "left-6"
                        : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Quiet Hours */}
          <div className="border-t border-neutral-200 pt-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-neutral-900">Quiet Hours</h4>
                <p className="text-xs text-neutral-500">Pause notifications during these hours</p>
              </div>
              <button
                onClick={() => setQuietHours({ ...quietHours, enabled: !quietHours.enabled })}
                className={`w-12 h-6 rounded-full transition-all relative ${
                  quietHours.enabled ? "bg-primary-500" : "bg-neutral-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${
                    quietHours.enabled ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
            </div>
            {quietHours.enabled && (
              <div className="flex items-center gap-3">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Start</label>
                  <input
                    type="time"
                    value={quietHours.start}
                    onChange={(e) => setQuietHours({ ...quietHours, start: e.target.value })}
                    className="px-3 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <span className="text-neutral-400 mt-5">to</span>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">End</label>
                  <input
                    type="time"
                    value={quietHours.end}
                    onChange={(e) => setQuietHours({ ...quietHours, end: e.target.value })}
                    className="px-3 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Push Notifications */}
          <div className="border-t border-neutral-200 pt-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-neutral-900">Push Notifications</h4>
                <p className="text-xs text-neutral-500">Receive browser push notifications</p>
              </div>
              <button
                onClick={() => setPushEnabled(!pushEnabled)}
                className={`w-12 h-6 rounded-full transition-all relative ${
                  pushEnabled ? "bg-primary-500" : "bg-neutral-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${
                    pushEnabled ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
            </div>
            {!pushEnabled && (
              <div className="mt-2 p-3 bg-yellow-50 rounded-xl">
                <p className="text-xs text-yellow-700">
                  Enable push notifications to receive real-time alerts even when the app is closed.
                </p>
              </div>
            )}
          </div>

          {/* Email Notifications */}
          <div className="border-t border-neutral-200 pt-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-neutral-900">Email Notifications</h4>
                <p className="text-xs text-neutral-500">Receive weekly summaries via email</p>
              </div>
              <button
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={`w-12 h-6 rounded-full transition-all relative ${
                  emailNotifs ? "bg-primary-500" : "bg-neutral-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${
                    emailNotifs ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Frequency */}
          <div className="border-t border-neutral-200 pt-4">
            <h4 className="font-medium text-neutral-900 mb-3">Notification Frequency</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "instant", label: "Instant" },
                { value: "hourly", label: "Hourly Digest" },
                { value: "daily", label: "Daily Digest" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFrequency(opt.value as typeof frequency)}
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                    frequency === opt.value
                      ? "bg-primary-500 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="text-center py-12">
            <span className="text-5xl block mb-3">🔕</span>
            <p className="text-neutral-500">No notifications</p>
            <p className="text-sm text-neutral-400">You're all caught up!</p>
          </Card>
        ) : (
          filteredNotifications.map((notif) => (
            <Card
              key={notif.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                !notif.read ? "border-l-4 border-l-primary-500 bg-primary-50/20" : ""
              }`}
              onClick={() => handleMarkRead(notif.id)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {notif.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className={`font-medium text-sm ${!notif.read ? "text-neutral-900" : "text-neutral-700"}`}>
                      {notif.title}
                    </h4>
                    {notif.priority === "high" && (
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-xs">
                        urgent
                      </span>
                    )}
                    {!notif.read && (
                      <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 line-clamp-2">{notif.message}</p>
                  <p className="text-xs text-neutral-400 mt-1">{notif.timestamp}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
