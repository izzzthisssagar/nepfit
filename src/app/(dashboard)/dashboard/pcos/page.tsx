"use client";

import { useState } from "react";

type PCOSTab = "overview" | "tracking" | "diet" | "exercise" | "insights";

interface Symptom {
  id: string;
  name: string;
  icon: string;
  severity: 0 | 1 | 2 | 3;
  category: string;
}

interface PCOSFood {
  id: string;
  name: string;
  icon: string;
  category: string;
  benefit: string;
  type: "recommended" | "avoid" | "moderate";
}

interface Exercise {
  id: string;
  name: string;
  icon: string;
  duration: string;
  frequency: string;
  intensity: "low" | "moderate" | "high";
  benefits: string;
}

interface WeeklyInsight {
  week: string;
  symptomScore: number;
  dietScore: number;
  exerciseMinutes: number;
  mood: number;
}

const symptoms: Symptom[] = [
  { id: "s1", name: "Bloating", icon: "🫧", severity: 2, category: "Digestive" },
  { id: "s2", name: "Acne", icon: "😣", severity: 1, category: "Skin" },
  { id: "s3", name: "Mood Swings", icon: "😤", severity: 2, category: "Mental" },
  { id: "s4", name: "Cramps", icon: "😰", severity: 3, category: "Pain" },
  { id: "s5", name: "Fatigue", icon: "😴", severity: 2, category: "Energy" },
  { id: "s6", name: "Hair Loss", icon: "💇", severity: 1, category: "Hair" },
  { id: "s7", name: "Weight Gain", icon: "⚖️", severity: 1, category: "Weight" },
  { id: "s8", name: "Headache", icon: "🤕", severity: 0, category: "Pain" },
  { id: "s9", name: "Insomnia", icon: "🌙", severity: 1, category: "Sleep" },
  { id: "s10", name: "Cravings", icon: "🍫", severity: 2, category: "Appetite" },
];

const pcosFood: PCOSFood[] = [
  { id: "f1", name: "Turmeric (Besar)", icon: "🟡", category: "Anti-inflammatory", benefit: "Reduces inflammation and insulin resistance", type: "recommended" },
  { id: "f2", name: "Spinach (Palungo)", icon: "🥬", category: "Leafy Greens", benefit: "Iron and folate for hormonal balance", type: "recommended" },
  { id: "f3", name: "Lentils (Dal)", icon: "🫘", category: "Protein", benefit: "Low GI protein source, stabilizes blood sugar", type: "recommended" },
  { id: "f4", name: "Walnuts (Okhar)", icon: "🥜", category: "Healthy Fats", benefit: "Omega-3 fatty acids, reduce androgens", type: "recommended" },
  { id: "f5", name: "Flaxseeds (Alasi)", icon: "🌰", category: "Seeds", benefit: "Lignans help reduce testosterone levels", type: "recommended" },
  { id: "f6", name: "Cinnamon (Dalchini)", icon: "🫚", category: "Spices", benefit: "Improves insulin sensitivity", type: "recommended" },
  { id: "f7", name: "Berries", icon: "🫐", category: "Fruits", benefit: "Antioxidants, low glycemic index", type: "recommended" },
  { id: "f8", name: "Sweet Potato", icon: "🍠", category: "Complex Carbs", benefit: "Slow-release energy, rich in fiber", type: "recommended" },
  { id: "f9", name: "White Rice", icon: "🍚", category: "High GI", benefit: "Spikes blood sugar, switch to brown rice", type: "avoid" },
  { id: "f10", name: "Sugary Drinks", icon: "🥤", category: "Beverages", benefit: "Increases insulin resistance", type: "avoid" },
  { id: "f11", name: "Fried Foods", icon: "🍟", category: "Processed", benefit: "Increases inflammation and weight gain", type: "avoid" },
  { id: "f12", name: "Dairy Milk", icon: "🥛", category: "Dairy", benefit: "May increase androgens, try plant-based", type: "avoid" },
  { id: "f13", name: "Yogurt (Dahi)", icon: "🥣", category: "Dairy", benefit: "Probiotics helpful, but limit quantity", type: "moderate" },
  { id: "f14", name: "Coffee", icon: "☕", category: "Beverages", benefit: "Limit to 1 cup, may affect cortisol", type: "moderate" },
];

const exercises: Exercise[] = [
  { id: "e1", name: "Yoga", icon: "🧘", duration: "30-45 min", frequency: "5x/week", intensity: "low", benefits: "Reduces stress, improves hormonal balance, helps with mood" },
  { id: "e2", name: "Brisk Walking", icon: "🚶", duration: "30 min", frequency: "Daily", intensity: "low", benefits: "Improves insulin sensitivity, gentle on joints" },
  { id: "e3", name: "Strength Training", icon: "💪", duration: "30-40 min", frequency: "3x/week", intensity: "moderate", benefits: "Builds muscle, boosts metabolism, reduces insulin resistance" },
  { id: "e4", name: "Swimming", icon: "🏊", duration: "30 min", frequency: "3x/week", intensity: "moderate", benefits: "Full body workout, low impact, reduces cortisol" },
  { id: "e5", name: "Cycling", icon: "🚴", duration: "20-30 min", frequency: "3-4x/week", intensity: "moderate", benefits: "Cardiovascular health, weight management" },
  { id: "e6", name: "Pilates", icon: "🤸", duration: "30 min", frequency: "3x/week", intensity: "low", benefits: "Core strength, flexibility, stress reduction" },
];

const weeklyInsights: WeeklyInsight[] = [
  { week: "Week 1", symptomScore: 7.2, dietScore: 6.5, exerciseMinutes: 90, mood: 5 },
  { week: "Week 2", symptomScore: 6.8, dietScore: 7.0, exerciseMinutes: 120, mood: 6 },
  { week: "Week 3", symptomScore: 5.5, dietScore: 7.5, exerciseMinutes: 150, mood: 7 },
  { week: "Week 4", symptomScore: 4.8, dietScore: 8.0, exerciseMinutes: 180, mood: 8 },
];

const medications = [
  { name: "Metformin", dosage: "500mg", timing: "After lunch", icon: "💊", adherence: 92 },
  { name: "Inositol", dosage: "4g", timing: "Before breakfast", icon: "💊", adherence: 88 },
  { name: "Vitamin D3", dosage: "2000 IU", timing: "With breakfast", icon: "☀️", adherence: 95 },
  { name: "Omega-3", dosage: "1000mg", timing: "With dinner", icon: "🐟", adherence: 85 },
];

export default function PCOSPage() {
  const [activeTab, setActiveTab] = useState<PCOSTab>("overview");
  const [selectedCycleDay, setSelectedCycleDay] = useState(14);
  const [foodFilter, setFoodFilter] = useState<"all" | "recommended" | "avoid" | "moderate">("all");

  const tabs: { id: PCOSTab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "tracking", label: "Tracking", icon: "📝" },
    { id: "diet", label: "Diet Plan", icon: "🥗" },
    { id: "exercise", label: "Exercise", icon: "🏃" },
    { id: "insights", label: "Insights", icon: "💡" },
  ];

  const filteredFoods = foodFilter === "all" ? pcosFood : pcosFood.filter(f => f.type === foodFilter);
  const currentPhase = selectedCycleDay <= 5 ? "Menstrual" : selectedCycleDay <= 13 ? "Follicular" : selectedCycleDay <= 17 ? "Ovulatory" : "Luteal";
  const phaseColor = currentPhase === "Menstrual" ? "text-red-500" : currentPhase === "Follicular" ? "text-blue-500" : currentPhase === "Ovulatory" ? "text-emerald-500" : "text-amber-500";

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">🎀 PCOS Management</h1>
        <p className="text-pink-100">Track, manage, and improve your PCOS journey</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-pink-500 text-white"
                : "bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200"
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
          {/* Score & Phase */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <h2 className="text-lg font-semibold text-neutral-800 mb-3">📈 PCOS Wellness Score</h2>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white">
                  <span className="text-2xl font-bold">72</span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Score is improving! ⬆️</p>
                  <p className="text-xs text-neutral-400">+8 from last month</p>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={star <= 3 ? "text-amber-400" : "text-neutral-200"}>⭐</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <h2 className="text-lg font-semibold text-neutral-800 mb-3">🌸 Current Cycle Phase</h2>
              <div className="flex items-center gap-4">
                <div className={`text-3xl font-bold ${phaseColor}`}>{currentPhase}</div>
              </div>
              <p className="text-sm text-neutral-500 mt-2">Day {selectedCycleDay} of cycle</p>
              <div className="flex gap-1 mt-3">
                {Array.from({ length: 28 }, (_, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedCycleDay(i + 1)}
                    className={`flex-1 h-3 rounded-full cursor-pointer ${
                      i + 1 <= 5 ? "bg-red-300" :
                      i + 1 <= 13 ? "bg-blue-300" :
                      i + 1 <= 17 ? "bg-emerald-300" :
                      "bg-amber-300"
                    } ${i + 1 === selectedCycleDay ? "ring-2 ring-neutral-800 ring-offset-1" : ""}`}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-neutral-400 mt-1">
                <span>Menstrual</span>
                <span>Follicular</span>
                <span>Ovulatory</span>
                <span>Luteal</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Weight Trend", value: "↓ 0.5 kg", icon: "⚖️", color: "bg-emerald-50 text-emerald-600" },
              { label: "Symptoms This Week", value: "4 mild", icon: "📝", color: "bg-amber-50 text-amber-600" },
              { label: "Meals Logged", value: "18/21", icon: "🍽️", color: "bg-blue-50 text-blue-600" },
              { label: "Exercise Minutes", value: "145 min", icon: "🏃", color: "bg-pink-50 text-pink-600" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
                <span className="text-2xl">{stat.icon}</span>
                <p className="text-lg font-bold text-neutral-800 mt-2">{stat.value}</p>
                <p className="text-xs text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Medications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">💊 Medication Adherence</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {medications.map((med, i) => (
                <div key={i} className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{med.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{med.name} - {med.dosage}</p>
                      <p className="text-xs text-neutral-500">{med.timing}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${med.adherence >= 90 ? "text-emerald-600" : "text-amber-600"}`}>{med.adherence}%</p>
                    <p className="text-xs text-neutral-400">adherence</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tracking Tab */}
      {activeTab === "tracking" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">📝 Symptom Logger</h2>
            <p className="text-sm text-neutral-500 mb-4">Rate each symptom (0 = none, 3 = severe)</p>
            <div className="grid md:grid-cols-2 gap-3">
              {symptoms.map(symptom => (
                <div key={symptom.id} className="p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{symptom.icon}</span>
                      <span className="text-sm font-medium text-neutral-800">{symptom.name}</span>
                    </div>
                    <span className="text-xs text-neutral-400">{symptom.category}</span>
                  </div>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map(level => (
                      <button
                        key={level}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          symptom.severity === level
                            ? level === 0 ? "bg-emerald-500 text-white" :
                              level === 1 ? "bg-amber-400 text-white" :
                              level === 2 ? "bg-orange-500 text-white" :
                              "bg-red-500 text-white"
                            : "bg-white border border-neutral-200 text-neutral-500"
                        }`}
                      >
                        {level === 0 ? "None" : level === 1 ? "Mild" : level === 2 ? "Mod" : "Severe"}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full px-4 py-2.5 bg-pink-500 text-white rounded-xl text-sm font-medium hover:bg-pink-600 transition-colors">
              Log Today&apos;s Symptoms
            </button>
          </div>

          {/* Cycle Calendar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">📅 Cycle Calendar - February 2026</h2>
            <div className="grid grid-cols-7 gap-1 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="text-xs font-medium text-neutral-500 py-2">{day}</div>
              ))}
              {Array.from({ length: 28 }, (_, i) => {
                const day = i + 1;
                const isToday = day === 7;
                const hasPeriod = day >= 1 && day <= 5;
                const hasSymptom = [3, 8, 12, 16, 22].includes(day);
                return (
                  <div
                    key={i}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm cursor-pointer ${
                      isToday ? "bg-pink-500 text-white font-bold" :
                      hasPeriod ? "bg-red-100 text-red-600" :
                      "hover:bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    {day}
                    {hasSymptom && !isToday && <div className="w-1 h-1 bg-amber-400 rounded-full mt-0.5"></div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Diet Tab */}
      {activeTab === "diet" && (
        <div className="space-y-6">
          {/* Filter */}
          <div className="flex gap-2">
            {[
              { id: "all" as const, label: "All", icon: "🍽️" },
              { id: "recommended" as const, label: "Eat More", icon: "✅" },
              { id: "moderate" as const, label: "Moderate", icon: "⚠️" },
              { id: "avoid" as const, label: "Avoid", icon: "❌" },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFoodFilter(f.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  foodFilter === f.id ? "bg-pink-500 text-white" : "bg-white text-neutral-600 border border-neutral-200"
                }`}
              >
                <span>{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>

          {/* Food Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredFoods.map(food => (
              <div key={food.id} className={`bg-white rounded-2xl p-4 shadow-sm border ${
                food.type === "recommended" ? "border-emerald-200" :
                food.type === "avoid" ? "border-red-200" :
                "border-amber-200"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{food.icon}</span>
                  <div>
                    <h3 className="font-medium text-neutral-800">{food.name}</h3>
                    <p className="text-xs text-neutral-500">{food.category}</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-600">{food.benefit}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                  food.type === "recommended" ? "bg-emerald-50 text-emerald-600" :
                  food.type === "avoid" ? "bg-red-50 text-red-500" :
                  "bg-amber-50 text-amber-600"
                }`}>
                  {food.type}
                </span>
              </div>
            ))}
          </div>

          {/* Sample Meal Plan */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">📋 PCOS-Friendly Daily Meal Plan</h2>
            <div className="space-y-3">
              {[
                { meal: "Breakfast", time: "7:00 AM", items: "Oats with flaxseeds, berries, and cinnamon. Green tea.", icon: "🌅", calories: 350 },
                { meal: "Mid-Morning", time: "10:00 AM", items: "Walnuts + apple", icon: "🥜", calories: 180 },
                { meal: "Lunch", time: "12:30 PM", items: "Brown rice + dal + palungo ko saag + turmeric chicken", icon: "☀️", calories: 520 },
                { meal: "Snack", time: "4:00 PM", items: "Roasted chana + cucumber", icon: "🫘", calories: 150 },
                { meal: "Dinner", time: "7:00 PM", items: "Grilled fish + sweet potato + steamed broccoli", icon: "🌙", calories: 450 },
              ].map((meal, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-pink-50 rounded-xl">
                  <span className="text-2xl">{meal.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-neutral-800">{meal.meal}</h3>
                      <span className="text-xs text-neutral-500">{meal.time}</span>
                    </div>
                    <p className="text-sm text-neutral-600">{meal.items}</p>
                  </div>
                  <span className="text-sm font-medium text-pink-600">{meal.calories} cal</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Exercise Tab */}
      {activeTab === "exercise" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🏃 Recommended Exercises for PCOS</h2>
            <div className="space-y-3">
              {exercises.map(exercise => (
                <div key={exercise.id} className="p-4 bg-neutral-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{exercise.icon}</span>
                      <h3 className="font-medium text-neutral-800">{exercise.name}</h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      exercise.intensity === "low" ? "bg-emerald-50 text-emerald-600" :
                      exercise.intensity === "moderate" ? "bg-amber-50 text-amber-600" :
                      "bg-red-50 text-red-500"
                    }`}>
                      {exercise.intensity}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">{exercise.benefits}</p>
                  <div className="flex gap-4 text-xs text-neutral-500">
                    <span>⏱️ {exercise.duration}</span>
                    <span>📅 {exercise.frequency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">📅 Weekly Exercise Schedule</h2>
            <div className="grid grid-cols-7 gap-2">
              {[
                { day: "Mon", activity: "🧘 Yoga", done: true },
                { day: "Tue", activity: "💪 Strength", done: true },
                { day: "Wed", activity: "🚶 Walk", done: true },
                { day: "Thu", activity: "🏊 Swim", done: false },
                { day: "Fri", activity: "🧘 Yoga", done: false },
                { day: "Sat", activity: "🚴 Cycle", done: false },
                { day: "Sun", activity: "😌 Rest", done: false },
              ].map((d, i) => (
                <div key={i} className={`p-3 rounded-xl text-center ${d.done ? "bg-emerald-50 border border-emerald-200" : "bg-neutral-50 border border-neutral-200"}`}>
                  <p className="text-xs font-medium text-neutral-500">{d.day}</p>
                  <p className="text-lg mt-1">{d.activity.split(" ")[0]}</p>
                  <p className="text-xs text-neutral-600">{d.activity.split(" ").slice(1).join(" ")}</p>
                  {d.done && <span className="text-emerald-500 text-xs">✅</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === "insights" && (
        <div className="space-y-6">
          {/* Trend Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">📊 Monthly Trends</h2>
            <div className="space-y-4">
              {weeklyInsights.map((week, i) => (
                <div key={i} className="p-3 bg-neutral-50 rounded-xl">
                  <p className="text-sm font-medium text-neutral-700 mb-2">{week.week}</p>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-neutral-500">Symptoms</p>
                      <p className={`text-sm font-bold ${week.symptomScore <= 5 ? "text-emerald-600" : "text-amber-600"}`}>{week.symptomScore}/10</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Diet Score</p>
                      <p className="text-sm font-bold text-blue-600">{week.dietScore}/10</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Exercise</p>
                      <p className="text-sm font-bold text-purple-600">{week.exerciseMinutes} min</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Mood</p>
                      <p className="text-sm font-bold text-pink-600">{week.mood}/10</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🤖 AI Insights</h2>
            <div className="space-y-3">
              {[
                { title: "Diet-Symptom Correlation", insight: "Your bloating decreases by 40% when you avoid dairy for 3+ consecutive days. Consider plant-based alternatives.", icon: "📈", type: "positive" },
                { title: "Exercise Impact", insight: "Yoga sessions before bed are correlated with 25% better sleep quality. Keep up the evening routine!", icon: "🧘", type: "positive" },
                { title: "Cycle Pattern", insight: "Your symptoms tend to peak on days 20-24. Plan lighter meals and extra rest during luteal phase.", icon: "📅", type: "warning" },
                { title: "Supplement Timing", insight: "Taking inositol consistently has improved your insulin sensitivity markers by 15% this month.", icon: "💊", type: "positive" },
              ].map((insight, i) => (
                <div key={i} className={`p-4 rounded-xl ${
                  insight.type === "positive" ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{insight.icon}</span>
                    <h3 className="font-medium text-neutral-800">{insight.title}</h3>
                  </div>
                  <p className="text-sm text-neutral-600">{insight.insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200">
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">💡 PCOS Tips for This Phase</h2>
            <p className="text-sm text-neutral-500 mb-3">Current Phase: <span className={`font-medium ${phaseColor}`}>{currentPhase}</span></p>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>• Focus on anti-inflammatory foods like turmeric and ginger</li>
              <li>• Prioritize gentle movement - walks and yoga</li>
              <li>• Get 7-8 hours of quality sleep</li>
              <li>• Stay hydrated with herbal teas</li>
              <li>• Practice stress management techniques</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}