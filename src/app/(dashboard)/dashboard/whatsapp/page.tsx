"use client";

import { useState } from "react";
import { Card, CardHeader, Button } from "@/components/ui";

type TabType = "setup" | "commands" | "history" | "settings";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  message: string;
  timestamp: string;
}

interface BotCommand {
  command: string;
  description: string;
  example: string;
  response: string;
}

const botCommands: BotCommand[] = [
  {
    command: "log food",
    description: "Log what you ate",
    example: "Log food: 2 roti, dal, sabji",
    response: "Logged! 2 Roti (240 cal), Dal (150 cal), Sabji (120 cal). Total: 510 cal. You've consumed 1,240/2,000 cal today.",
  },
  {
    command: "check calories",
    description: "Check today's calorie intake",
    example: "Check calories",
    response: "Today's intake: 1,240 cal / 2,000 cal goal. Remaining: 760 cal. Protein: 45g, Carbs: 160g, Fat: 38g.",
  },
  {
    command: "suggest meal",
    description: "Get a meal suggestion",
    example: "Suggest meal for dinner",
    response: "Dinner suggestion: Grilled chicken (200g) with brown rice (1 cup) and mixed salad. ~520 cal, 40g protein. Want the recipe?",
  },
  {
    command: "log weight",
    description: "Log your current weight",
    example: "Log weight: 68.5 kg",
    response: "Weight logged: 68.5 kg. You're down 0.3 kg from last week! Keep it up! Current BMI: 23.4 (Normal).",
  },
  {
    command: "water reminder",
    description: "Set water drinking reminders",
    example: "Water reminder every 2 hours",
    response: "Water reminder set! I'll remind you every 2 hours from 8 AM to 10 PM. Today's water: 4/8 glasses.",
  },
];

const mockHistory: ChatMessage[] = [
  { id: "1", sender: "user", message: "Log food: momo 8 pieces, chutney", timestamp: "10:30 AM" },
  { id: "2", sender: "bot", message: "Logged! Momo (8 pcs) - 320 cal, Chutney - 45 cal. Total: 365 cal added. Daily total: 1,605/2,000 cal.", timestamp: "10:30 AM" },
  { id: "3", sender: "bot", message: "Reminder: Time to drink water! You've had 3/8 glasses today.", timestamp: "12:00 PM" },
  { id: "4", sender: "user", message: "Check calories", timestamp: "12:05 PM" },
  { id: "5", sender: "bot", message: "Today so far: 1,605 cal consumed. Remaining: 395 cal. Tip: Try a light salad or soup for your next meal.", timestamp: "12:05 PM" },
  { id: "6", sender: "user", message: "Suggest meal for dinner", timestamp: "5:30 PM" },
  { id: "7", sender: "bot", message: "Based on your remaining 395 cal, try: Dal + 1 Roti + Palak Paneer (350 cal). Rich in protein and iron!", timestamp: "5:30 PM" },
  { id: "8", sender: "bot", message: "Great job today! You logged 3 meals and hit your protein goal. Streak: 12 days!", timestamp: "9:00 PM" },
];

const mockUsageStats = {
  messagesSent: 247,
  foodsLogged: 89,
  remindersReceived: 156,
  streakDays: 12,
};

export default function WhatsAppPage() {
  const [activeTab, setActiveTab] = useState<TabType>("setup");
  const [isConnected, setIsConnected] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [demoInput, setDemoInput] = useState("");
  const [demoResponse, setDemoResponse] = useState("");
  const [language, setLanguage] = useState("english");
  const [responseFormat, setResponseFormat] = useState("detailed");
  const [reminderTimes, setReminderTimes] = useState({
    breakfast: "08:00",
    lunch: "13:00",
    dinner: "19:00",
    water: "2",
  });
  const [notifPrefs, setNotifPrefs] = useState({
    mealReminders: true,
    waterReminders: true,
    dailySummary: true,
    weeklyReport: true,
    streakAlerts: true,
  });

  const handleSendOtp = () => {
    if (phoneNumber.length >= 10) {
      setShowOtp(true);
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length === 6) {
      setIsConnected(true);
      setShowOtp(false);
    }
  };

  const handleDemoCommand = () => {
    if (!demoInput.trim()) return;
    const lower = demoInput.toLowerCase();
    const matched = botCommands.find((cmd) => lower.includes(cmd.command));
    if (matched) {
      setDemoResponse(matched.response);
    } else {
      setDemoResponse("I didn't understand that command. Try: log food, check calories, suggest meal, log weight, or water reminder.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
          <span className="text-3xl">💬</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">WhatsApp Bot</h1>
          <p className="text-neutral-500">Log food & get reminders via WhatsApp</p>
        </div>
        <div className="ml-auto">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            isConnected
              ? "bg-green-100 text-green-700"
              : "bg-neutral-100 text-neutral-500"
          }`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-neutral-400"}`} />
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-green-600">{mockUsageStats.messagesSent}</div>
          <div className="text-sm text-neutral-500">Messages Sent</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-primary-600">{mockUsageStats.foodsLogged}</div>
          <div className="text-sm text-neutral-500">Foods Logged</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-blue-600">{mockUsageStats.remindersReceived}</div>
          <div className="text-sm text-neutral-500">Reminders</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-orange-600">{mockUsageStats.streakDays}</div>
          <div className="text-sm text-neutral-500">Day Streak</div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-neutral-100 rounded-xl p-1 gap-1">
        {[
          { id: "setup", label: "Setup", icon: "🔗" },
          { id: "commands", label: "Commands", icon: "📋" },
          { id: "history", label: "History", icon: "💬" },
          { id: "settings", label: "Settings", icon: "⚙️" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
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

      {/* Setup Tab */}
      {activeTab === "setup" && (
        <div className="space-y-6">
          {!isConnected ? (
            <>
              <Card>
                <CardHeader
                  title="Link Your Phone Number"
                  subtitle="Connect your WhatsApp to start logging food via chat"
                />
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number
                    </label>
                    <div className="flex gap-3">
                      <span className="flex items-center px-3 bg-neutral-100 rounded-xl text-neutral-600 text-sm">
                        +977
                      </span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="98XXXXXXXX"
                        className="flex-1 px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {!showOtp ? (
                    <Button fullWidth onClick={handleSendOtp}>
                      Send OTP
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Enter 6-digit OTP
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          maxLength={6}
                          placeholder="000000"
                          className="w-full px-4 py-4 text-2xl font-bold text-center tracking-[0.5em] bg-white border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <Button fullWidth onClick={handleVerifyOtp}>
                        Verify & Connect
                      </Button>
                      <p className="text-center text-sm text-neutral-400">
                        Didn't receive? Resend in 30s
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* QR Code Alternative */}
              <Card>
                <CardHeader
                  title="Or Scan QR Code"
                  subtitle="Scan with WhatsApp to connect instantly"
                />
                <div className="flex justify-center py-6">
                  <div className="w-48 h-48 bg-neutral-100 rounded-2xl border-2 border-dashed border-neutral-300 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-5xl block mb-2">📱</span>
                      <p className="text-sm text-neutral-400">QR Code</p>
                      <p className="text-xs text-neutral-400">Scan to connect</p>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <Card className="bg-green-50 border-green-200">
              <div className="text-center py-6">
                <span className="text-5xl block mb-3">✅</span>
                <h3 className="text-xl font-bold text-green-800 mb-1">Connected!</h3>
                <p className="text-green-600 mb-1">+977 {phoneNumber}</p>
                <p className="text-sm text-green-500">Your WhatsApp bot is active and ready</p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => setIsConnected(false)}
                >
                  Disconnect
                </Button>
              </div>
            </Card>
          )}

          {/* Try It Demo */}
          <Card>
            <CardHeader
              title="Try It Live"
              subtitle="Test bot commands before connecting"
            />
            <div className="space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDemoCommand()}
                  placeholder="Type a command... e.g., log food: 2 roti dal"
                  className="flex-1 px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Button onClick={handleDemoCommand}>Send</Button>
              </div>
              {demoResponse && (
                <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🤖</span>
                    <p className="text-sm text-green-800">{demoResponse}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Commands Tab */}
      {activeTab === "commands" && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <h3 className="font-semibold text-neutral-900 mb-2">How It Works</h3>
            <p className="text-sm text-neutral-600">
              Send a message to the NepFit bot on WhatsApp. The bot understands natural
              language commands in English and Nepali. Just type what you ate or ask a question!
            </p>
          </Card>

          {botCommands.map((cmd, idx) => (
            <Card key={idx}>
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-lg text-xs font-mono font-medium">
                    {cmd.command}
                  </span>
                  <span className="text-sm text-neutral-500">{cmd.description}</span>
                </div>
              </div>
              {/* Chat bubble example */}
              <div className="space-y-3 bg-neutral-50 rounded-2xl p-4">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-2xl rounded-tr-md max-w-[80%]">
                    <p className="text-sm">{cmd.example}</p>
                  </div>
                </div>
                {/* Bot response */}
                <div className="flex justify-start">
                  <div className="bg-white border border-neutral-200 px-4 py-2 rounded-2xl rounded-tl-md max-w-[80%]">
                    <p className="text-sm text-neutral-700">{cmd.response}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Message History"
              subtitle="Recent WhatsApp conversations"
            />
            <div className="space-y-3 bg-neutral-50 rounded-2xl p-4">
              {mockHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 max-w-[80%] ${
                      msg.sender === "user"
                        ? "bg-green-500 text-white rounded-2xl rounded-tr-md"
                        : "bg-white border border-neutral-200 rounded-2xl rounded-tl-md"
                    }`}
                  >
                    <p className={`text-sm ${msg.sender === "user" ? "text-white" : "text-neutral-700"}`}>
                      {msg.message}
                    </p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === "user" ? "text-green-100" : "text-neutral-400"
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          {/* Language */}
          <Card>
            <CardHeader title="Language Preference" />
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "english", label: "English" },
                { value: "nepali", label: "नेपाली" },
                { value: "both", label: "Both" },
              ].map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setLanguage(lang.value)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    language === lang.value
                      ? "bg-primary-500 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Response Format */}
          <Card>
            <CardHeader title="Response Format" />
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "brief", label: "Brief", desc: "Short replies" },
                { value: "detailed", label: "Detailed", desc: "Full nutrition info" },
              ].map((fmt) => (
                <button
                  key={fmt.value}
                  onClick={() => setResponseFormat(fmt.value)}
                  className={`py-3 px-4 rounded-xl text-left transition-all ${
                    responseFormat === fmt.value
                      ? "bg-primary-50 border-2 border-primary-500"
                      : "bg-neutral-50 border-2 border-transparent"
                  }`}
                >
                  <span className="font-medium text-neutral-900 block">{fmt.label}</span>
                  <span className="text-xs text-neutral-500">{fmt.desc}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Reminder Times */}
          <Card>
            <CardHeader title="Reminder Times" />
            <div className="space-y-4">
              {[
                { key: "breakfast", label: "Breakfast Reminder", icon: "🌅" },
                { key: "lunch", label: "Lunch Reminder", icon: "☀️" },
                { key: "dinner", label: "Dinner Reminder", icon: "🌙" },
              ].map((reminder) => (
                <div key={reminder.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{reminder.icon}</span>
                    <span className="text-neutral-700">{reminder.label}</span>
                  </div>
                  <input
                    type="time"
                    value={reminderTimes[reminder.key as keyof typeof reminderTimes]}
                    onChange={(e) =>
                      setReminderTimes({ ...reminderTimes, [reminder.key]: e.target.value })
                    }
                    className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              ))}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">💧</span>
                  <span className="text-neutral-700">Water Reminder (hours)</span>
                </div>
                <select
                  value={reminderTimes.water}
                  onChange={(e) => setReminderTimes({ ...reminderTimes, water: e.target.value })}
                  className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="1">Every 1 hour</option>
                  <option value="2">Every 2 hours</option>
                  <option value="3">Every 3 hours</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader title="Notification Preferences" />
            <div className="space-y-3">
              {[
                { key: "mealReminders", label: "Meal Reminders" },
                { key: "waterReminders", label: "Water Reminders" },
                { key: "dailySummary", label: "Daily Summary" },
                { key: "weeklyReport", label: "Weekly Report" },
                { key: "streakAlerts", label: "Streak Alerts" },
              ].map((pref) => (
                <div key={pref.key} className="flex items-center justify-between py-2">
                  <span className="text-neutral-700">{pref.label}</span>
                  <button
                    onClick={() =>
                      setNotifPrefs({
                        ...notifPrefs,
                        [pref.key]: !notifPrefs[pref.key as keyof typeof notifPrefs],
                      })
                    }
                    className={`w-12 h-6 rounded-full transition-all relative ${
                      notifPrefs[pref.key as keyof typeof notifPrefs]
                        ? "bg-primary-500"
                        : "bg-neutral-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${
                        notifPrefs[pref.key as keyof typeof notifPrefs]
                          ? "left-6"
                          : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
