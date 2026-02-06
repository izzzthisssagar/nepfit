"use client";

import { useState, useRef } from "react";

interface FoodRecognition {
  id: string;
  name: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  nepaliName?: string;
}

interface VoiceLog {
  id: string;
  transcript: string;
  timestamp: Date;
  parsed: {
    food: string;
    quantity: string;
    meal: string;
  } | null;
  status: "processing" | "success" | "error";
}

interface MealSuggestion {
  id: string;
  title: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  reason: string;
  ingredients: string[];
  image: string;
  matchScore: number;
}

interface SmartReminder {
  id: string;
  type: "meal" | "water" | "exercise" | "sleep";
  message: string;
  time: string;
  enabled: boolean;
}

const mockRecognitions: FoodRecognition[] = [
  {
    id: "1",
    name: "Dal Bhat",
    confidence: 94,
    calories: 450,
    protein: 18,
    carbs: 72,
    fat: 8,
    serving: "1 plate",
    nepaliName: "दाल भात",
  },
  {
    id: "2",
    name: "Momo (Steamed)",
    confidence: 89,
    calories: 180,
    protein: 12,
    carbs: 22,
    fat: 5,
    serving: "6 pieces",
    nepaliName: "मोमो",
  },
  {
    id: "3",
    name: "Aloo Tama",
    confidence: 87,
    calories: 220,
    protein: 6,
    carbs: 32,
    fat: 9,
    serving: "1 bowl",
    nepaliName: "आलु तामा",
  },
];

const mockSuggestions: MealSuggestion[] = [
  {
    id: "1",
    title: "High-Protein Dal Bhat",
    description: "Traditional dal bhat with extra protein from paneer and boiled eggs",
    calories: 520,
    protein: 32,
    carbs: 65,
    fat: 12,
    reason: "Based on your goal to increase protein intake",
    ingredients: ["Rice", "Mixed Dal", "Paneer", "Boiled Egg", "Green Vegetables"],
    image: "🍛",
    matchScore: 95,
  },
  {
    id: "2",
    title: "Low-Carb Chicken Salad",
    description: "Grilled chicken with fresh vegetables and light dressing",
    calories: 320,
    protein: 35,
    carbs: 12,
    fat: 15,
    reason: "Matches your low-carb preference",
    ingredients: ["Chicken Breast", "Cucumber", "Tomato", "Lettuce", "Olive Oil"],
    image: "🥗",
    matchScore: 88,
  },
  {
    id: "3",
    title: "Vegetable Thukpa",
    description: "Warm noodle soup with seasonal vegetables",
    calories: 280,
    protein: 10,
    carbs: 45,
    fat: 6,
    reason: "Perfect for the cold weather today",
    ingredients: ["Noodles", "Mixed Vegetables", "Ginger", "Garlic", "Soy Sauce"],
    image: "🍜",
    matchScore: 82,
  },
  {
    id: "4",
    title: "Fruit & Yogurt Bowl",
    description: "Fresh seasonal fruits with probiotic-rich yogurt",
    calories: 220,
    protein: 8,
    carbs: 38,
    fat: 4,
    reason: "Good for your digestive health goal",
    ingredients: ["Greek Yogurt", "Banana", "Apple", "Honey", "Almonds"],
    image: "🍓",
    matchScore: 78,
  },
];

const mockReminders: SmartReminder[] = [
  { id: "1", type: "meal", message: "Time for breakfast! You usually eat around this time.", time: "07:30", enabled: true },
  { id: "2", type: "water", message: "Stay hydrated! You're 500ml behind your daily goal.", time: "10:00", enabled: true },
  { id: "3", type: "meal", message: "Lunch reminder based on your schedule", time: "12:30", enabled: true },
  { id: "4", type: "exercise", message: "Good time for a 15-min walk after lunch", time: "13:30", enabled: false },
  { id: "5", type: "water", message: "Afternoon hydration check", time: "15:00", enabled: true },
  { id: "6", type: "meal", message: "Healthy snack time!", time: "16:30", enabled: true },
  { id: "7", type: "meal", message: "Dinner reminder - try to eat before 8 PM", time: "19:00", enabled: true },
  { id: "8", type: "sleep", message: "Start winding down for better sleep", time: "22:00", enabled: true },
];

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState<"photo" | "voice" | "suggestions" | "reminders">("photo");
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recognitions, setRecognitions] = useState<FoodRecognition[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceLogs, setVoiceLogs] = useState<VoiceLog[]>([]);
  const [reminders, setReminders] = useState<SmartReminder[]>(mockReminders);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setCapturedImage(reader.result as string);
      analyzeImage();
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRecognitions(mockRecognitions);
    setIsAnalyzing(false);
  };

  const startVoiceRecording = () => {
    setIsListening(true);
    // Simulate voice recording and processing
    setTimeout(() => {
      const newLog: VoiceLog = {
        id: Date.now().toString(),
        transcript: "I had two rotis with mixed vegetable curry for lunch",
        timestamp: new Date(),
        parsed: {
          food: "Roti with Mixed Vegetable Curry",
          quantity: "2 rotis, 1 bowl curry",
          meal: "Lunch",
        },
        status: "success",
      };
      setVoiceLogs((prev) => [newLog, ...prev]);
      setIsListening(false);
    }, 3000);
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const getReminderIcon = (type: SmartReminder["type"]) => {
    switch (type) {
      case "meal":
        return "🍽️";
      case "water":
        return "💧";
      case "exercise":
        return "🏃";
      case "sleep":
        return "😴";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">AI Assistant</h1>
        <p className="text-neutral-600">
          Smart food recognition, voice logging, and personalized suggestions
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: "photo", icon: "📸", label: "Photo Recognition", color: "from-purple-500 to-pink-500" },
          { id: "voice", icon: "🎤", label: "Voice Logging", color: "from-blue-500 to-cyan-500" },
          { id: "suggestions", icon: "✨", label: "Smart Suggestions", color: "from-amber-500 to-orange-500" },
          { id: "reminders", icon: "⏰", label: "Smart Reminders", color: "from-green-500 to-teal-500" },
        ].map((feature) => (
          <button
            key={feature.id}
            onClick={() => setActiveTab(feature.id as typeof activeTab)}
            className={`relative p-4 rounded-2xl text-left transition-all ${
              activeTab === feature.id
                ? `bg-gradient-to-br ${feature.color} text-white shadow-lg scale-105`
                : "bg-white border border-neutral-100 hover:border-primary-200"
            }`}
          >
            <span className="text-3xl">{feature.icon}</span>
            <p className={`mt-2 font-semibold ${activeTab === feature.id ? "text-white" : "text-neutral-900"}`}>
              {feature.label}
            </p>
          </button>
        ))}
      </div>

      {/* Photo Recognition Tab */}
      {activeTab === "photo" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">📸 Food Photo Recognition</h2>
            <p className="text-neutral-500 mb-6">
              Take a photo of your meal and our AI will identify the food and estimate nutrition
            </p>

            {!capturedImage ? (
              <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-8">
                <div className="text-center">
                  <span className="text-6xl">📷</span>
                  <p className="mt-4 text-neutral-600">
                    Take a photo or upload an image of your meal
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                    <button
                      onClick={() => setIsCapturing(true)}
                      className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                    >
                      📸 Take Photo
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                    >
                      📁 Upload Image
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageCapture(file);
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={capturedImage}
                    alt="Captured meal"
                    className="w-full max-h-64 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => {
                      setCapturedImage(null);
                      setRecognitions([]);
                    }}
                    className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {isAnalyzing ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                    <p className="mt-4 text-neutral-600">Analyzing your meal...</p>
                  </div>
                ) : recognitions.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-neutral-900">Detected Foods:</h3>
                    {recognitions.map((food) => (
                      <div
                        key={food.id}
                        className="p-4 bg-neutral-50 rounded-xl"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-neutral-900">{food.name}</h4>
                              {food.nepaliName && (
                                <span className="text-sm text-neutral-500">({food.nepaliName})</span>
                              )}
                            </div>
                            <p className="text-sm text-neutral-500">{food.serving}</p>
                          </div>
                          <span className={`text-sm px-2 py-0.5 rounded-full ${
                            food.confidence >= 90
                              ? "bg-green-100 text-green-700"
                              : food.confidence >= 80
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-orange-100 text-orange-700"
                          }`}>
                            {food.confidence}% match
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-2 mt-4">
                          <div className="text-center p-2 bg-white rounded-lg">
                            <p className="text-lg font-bold text-orange-600">{food.calories}</p>
                            <p className="text-xs text-neutral-500">kcal</p>
                          </div>
                          <div className="text-center p-2 bg-white rounded-lg">
                            <p className="text-lg font-bold text-red-600">{food.protein}g</p>
                            <p className="text-xs text-neutral-500">Protein</p>
                          </div>
                          <div className="text-center p-2 bg-white rounded-lg">
                            <p className="text-lg font-bold text-blue-600">{food.carbs}g</p>
                            <p className="text-xs text-neutral-500">Carbs</p>
                          </div>
                          <div className="text-center p-2 bg-white rounded-lg">
                            <p className="text-lg font-bold text-yellow-600">{food.fat}g</p>
                            <p className="text-xs text-neutral-500">Fat</p>
                          </div>
                        </div>

                        <button className="w-full mt-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                          Add to Food Log
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <h3 className="font-semibold text-blue-800 mb-2">📝 Tips for better recognition</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Take photos in good lighting</li>
              <li>• Capture the entire plate/bowl</li>
              <li>• Avoid shadows and reflections</li>
              <li>• Take photos from directly above or at 45° angle</li>
            </ul>
          </div>
        </div>
      )}

      {/* Voice Logging Tab */}
      {activeTab === "voice" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">🎤 Voice Food Logging</h2>
            <p className="text-neutral-500 mb-6">
              Simply speak what you ate and our AI will log it for you
            </p>

            <div className="text-center py-8">
              <button
                onClick={startVoiceRecording}
                disabled={isListening}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-red-500 animate-pulse"
                    : "bg-primary-500 hover:bg-primary-600"
                }`}
              >
                <svg
                  className={`w-10 h-10 text-white ${isListening ? "animate-bounce" : ""}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </button>
              <p className="mt-4 text-neutral-600">
                {isListening ? "Listening... speak now" : "Tap to start speaking"}
              </p>
            </div>

            {/* Example Phrases */}
            <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
              <h3 className="font-medium text-neutral-700 mb-3">Try saying:</h3>
              <div className="space-y-2 text-sm text-neutral-600">
                <p>&quot;I had dal bhat with chicken curry for lunch&quot;</p>
                <p>&quot;Two cups of tea with breakfast&quot;</p>
                <p>&quot;Ate six momos as evening snack&quot;</p>
                <p>&quot;Had a bowl of fruits after dinner&quot;</p>
              </div>
            </div>
          </div>

          {/* Voice Logs History */}
          {voiceLogs.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <h3 className="font-semibold text-neutral-900 mb-4">Recent Voice Logs</h3>
              <div className="space-y-4">
                {voiceLogs.map((log) => (
                  <div key={log.id} className="p-4 bg-neutral-50 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          log.status === "success"
                            ? "bg-green-100"
                            : log.status === "error"
                            ? "bg-red-100"
                            : "bg-yellow-100"
                        }`}>
                          {log.status === "success" ? "✅" : log.status === "error" ? "❌" : "⏳"}
                        </div>
                        <div>
                          <p className="text-neutral-900">&quot;{log.transcript}&quot;</p>
                          <p className="text-xs text-neutral-500">
                            {log.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {log.parsed && log.status === "success" && (
                      <div className="mt-4 p-3 bg-white rounded-lg border border-neutral-100">
                        <p className="text-sm"><strong>Food:</strong> {log.parsed.food}</p>
                        <p className="text-sm"><strong>Quantity:</strong> {log.parsed.quantity}</p>
                        <p className="text-sm"><strong>Meal:</strong> {log.parsed.meal}</p>
                        <button className="mt-2 text-sm text-primary-600 hover:text-primary-700">
                          Add to Log →
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supported Languages */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">🌐 Supported Languages</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { code: "en", name: "English", flag: "🇬🇧" },
                { code: "ne", name: "नेपाली", flag: "🇳🇵" },
                { code: "hi", name: "हिंदी", flag: "🇮🇳" },
              ].map((lang) => (
                <span
                  key={lang.code}
                  className="flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded-full text-sm"
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Smart Suggestions Tab */}
      {activeTab === "suggestions" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">✨ Personalized Meal Suggestions</h2>
            <p className="text-neutral-500">
              AI-powered recommendations based on your goals, preferences, and eating patterns
            </p>
          </div>

          {/* Today's Goals Summary */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-4">Today&apos;s Nutrition Status</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/20 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold">1,240</p>
                <p className="text-sm text-white/80">of 2,000 kcal</p>
              </div>
              <div className="bg-white/20 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold">45g</p>
                <p className="text-sm text-white/80">of 120g protein</p>
              </div>
              <div className="bg-white/20 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold">160g</p>
                <p className="text-sm text-white/80">of 250g carbs</p>
              </div>
              <div className="bg-white/20 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold">35g</p>
                <p className="text-sm text-white/80">of 65g fat</p>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900">Recommended for You</h3>
            {mockSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center text-3xl">
                    {suggestion.image}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-neutral-900">{suggestion.title}</h4>
                      <span className="text-sm bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                        {suggestion.matchScore}% match
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 mt-1">{suggestion.description}</p>
                    <p className="text-xs text-primary-600 mt-2">💡 {suggestion.reason}</p>

                    {/* Nutrition */}
                    <div className="flex gap-4 mt-3 text-xs">
                      <span className="text-orange-600">{suggestion.calories} kcal</span>
                      <span className="text-red-600">{suggestion.protein}g protein</span>
                      <span className="text-blue-600">{suggestion.carbs}g carbs</span>
                      <span className="text-yellow-600">{suggestion.fat}g fat</span>
                    </div>

                    {/* Ingredients */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {suggestion.ingredients.slice(0, 4).map((ing) => (
                        <span key={ing} className="text-xs bg-neutral-100 px-2 py-0.5 rounded-full">
                          {ing}
                        </span>
                      ))}
                      {suggestion.ingredients.length > 4 && (
                        <span className="text-xs text-neutral-500">
                          +{suggestion.ingredients.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm">
                    View Recipe
                  </button>
                  <button className="flex-1 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
                    Log This Meal
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Refresh Suggestions */}
          <button className="w-full py-3 border border-primary-200 text-primary-600 rounded-xl hover:bg-primary-50 transition-colors">
            🔄 Get New Suggestions
          </button>
        </div>
      )}

      {/* Smart Reminders Tab */}
      {activeTab === "reminders" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">⏰ Smart Reminders</h2>
            <p className="text-neutral-500">
              AI-powered reminders based on your schedule and habits
            </p>
          </div>

          {/* Reminders List */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            {reminders.map((reminder, index) => (
              <div
                key={reminder.id}
                className={`flex items-center justify-between p-4 ${
                  index !== reminders.length - 1 ? "border-b border-neutral-100" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    reminder.type === "meal" ? "bg-orange-100" :
                    reminder.type === "water" ? "bg-blue-100" :
                    reminder.type === "exercise" ? "bg-green-100" :
                    "bg-purple-100"
                  }`}>
                    <span className="text-2xl">{getReminderIcon(reminder.type)}</span>
                  </div>
                  <div>
                    <p className={`font-medium ${reminder.enabled ? "text-neutral-900" : "text-neutral-400"}`}>
                      {reminder.message}
                    </p>
                    <p className={`text-sm ${reminder.enabled ? "text-neutral-500" : "text-neutral-400"}`}>
                      {reminder.time}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reminder.enabled}
                    onChange={() => toggleReminder(reminder.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            ))}
          </div>

          {/* Add Custom Reminder */}
          <button className="w-full py-4 border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-500 hover:border-primary-300 hover:text-primary-600 transition-colors">
            + Add Custom Reminder
          </button>

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-3">🧠 AI Insights</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white/10 rounded-xl p-3">
                <span className="text-xl">📊</span>
                <p className="text-sm">You tend to skip breakfast on weekends. Want me to adjust your reminders?</p>
              </div>
              <div className="flex items-start gap-3 bg-white/10 rounded-xl p-3">
                <span className="text-xl">💧</span>
                <p className="text-sm">Your water intake drops after 6 PM. I&apos;ve added an evening reminder.</p>
              </div>
              <div className="flex items-start gap-3 bg-white/10 rounded-xl p-3">
                <span className="text-xl">🌙</span>
                <p className="text-sm">Eating dinner earlier has improved your sleep quality by 15%.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {isCapturing && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 text-white">
            <button onClick={() => setIsCapturing(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span>Take Photo</span>
            <div className="w-6" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md aspect-square bg-neutral-800 rounded-2xl flex items-center justify-center">
              <p className="text-neutral-400">Camera Preview</p>
            </div>
          </div>
          <div className="p-8 flex justify-center">
            <button
              onClick={() => {
                setIsCapturing(false);
                // Simulate capture
                setCapturedImage("https://via.placeholder.com/400x300/10b981/ffffff?text=Food+Photo");
                analyzeImage();
              }}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
            >
              <div className="w-14 h-14 border-4 border-neutral-300 rounded-full" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
