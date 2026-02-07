"use client";

import { useState } from "react";

interface NutrientGoal {
  name: string;
  current: number;
  goal: number;
  unit: string;
  importance: string;
  icon: string;
}

interface FoodSafety {
  name: string;
  status: "safe" | "caution" | "avoid";
  reason: string;
  alternatives?: string[];
}

interface WeightEntry {
  date: Date;
  weight: number;
  note?: string;
}

interface PrenatalVitamin {
  name: string;
  taken: boolean;
  time: string;
}

const trimesterInfo = [
  {
    trimester: 1,
    weeks: "1-12",
    title: "First Trimester",
    calorieIncrease: 0,
    focus: ["Folate", "Iron", "Vitamin B6"],
    tips: "Focus on nutrient-dense foods. Small, frequent meals help with nausea.",
  },
  {
    trimester: 2,
    weeks: "13-26",
    title: "Second Trimester",
    calorieIncrease: 340,
    focus: ["Calcium", "Vitamin D", "Omega-3"],
    tips: "Baby is growing rapidly. Increase protein and calcium intake.",
  },
  {
    trimester: 3,
    weeks: "27-40",
    title: "Third Trimester",
    calorieIncrease: 450,
    focus: ["Iron", "Protein", "DHA"],
    tips: "Prepare for delivery. Focus on iron-rich foods and stay hydrated.",
  },
];

const nutrientGoals: NutrientGoal[] = [
  { name: "Folate", current: 520, goal: 600, unit: "mcg", importance: "Neural tube development", icon: "🥬" },
  { name: "Iron", current: 22, goal: 27, unit: "mg", importance: "Blood production", icon: "🥩" },
  { name: "Calcium", current: 850, goal: 1000, unit: "mg", importance: "Bone development", icon: "🥛" },
  { name: "Vitamin D", current: 480, goal: 600, unit: "IU", importance: "Calcium absorption", icon: "☀️" },
  { name: "DHA/Omega-3", current: 180, goal: 200, unit: "mg", importance: "Brain development", icon: "🐟" },
  { name: "Protein", current: 65, goal: 71, unit: "g", importance: "Tissue growth", icon: "🍗" },
];

const foodSafetyList: FoodSafety[] = [
  { name: "Raw sushi", status: "avoid", reason: "Risk of parasites and bacteria" },
  { name: "Deli meats", status: "caution", reason: "Listeria risk - heat until steaming", alternatives: ["Freshly cooked meats"] },
  { name: "Soft cheeses", status: "caution", reason: "Listeria risk if unpasteurized", alternatives: ["Pasteurized cheese", "Hard cheeses"] },
  { name: "High-mercury fish", status: "avoid", reason: "Mercury can harm brain development", alternatives: ["Salmon", "Sardines", "Tilapia"] },
  { name: "Raw eggs", status: "avoid", reason: "Salmonella risk", alternatives: ["Fully cooked eggs"] },
  { name: "Alcohol", status: "avoid", reason: "No safe amount during pregnancy" },
  { name: "Caffeine", status: "caution", reason: "Limit to 200mg/day", alternatives: ["Decaf coffee", "Herbal tea"] },
  { name: "Leafy greens", status: "safe", reason: "Excellent source of folate" },
  { name: "Lean proteins", status: "safe", reason: "Essential for baby's growth" },
  { name: "Whole grains", status: "safe", reason: "Fiber and B vitamins" },
];

const mockWeightHistory: WeightEntry[] = [
  { date: new Date(Date.now() - 70 * 86400000), weight: 140, note: "Pre-pregnancy" },
  { date: new Date(Date.now() - 56 * 86400000), weight: 141 },
  { date: new Date(Date.now() - 42 * 86400000), weight: 143 },
  { date: new Date(Date.now() - 28 * 86400000), weight: 146 },
  { date: new Date(Date.now() - 14 * 86400000), weight: 149 },
  { date: new Date(), weight: 152 },
];

export default function PregnancyPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "nutrients" | "foods" | "weight" | "vitamins">("overview");
  const [currentWeek, setCurrentWeek] = useState(20);
  const [selectedFoodFilter, setSelectedFoodFilter] = useState<"all" | "safe" | "caution" | "avoid">("all");

  const getCurrentTrimester = () => {
    if (currentWeek <= 12) return trimesterInfo[0];
    if (currentWeek <= 26) return trimesterInfo[1];
    return trimesterInfo[2];
  };

  const currentTrimester = getCurrentTrimester();
  const dueDate = new Date(Date.now() + (40 - currentWeek) * 7 * 86400000);
  const daysRemaining = Math.ceil((dueDate.getTime() - Date.now()) / 86400000);

  const getWeightGainRecommendation = (prePregnancyBMI: number = 22): { min: number; max: number } => {
    if (prePregnancyBMI < 18.5) return { min: 28, max: 40 };
    if (prePregnancyBMI < 25) return { min: 25, max: 35 };
    if (prePregnancyBMI < 30) return { min: 15, max: 25 };
    return { min: 11, max: 20 };
  };

  const weightGainRec = getWeightGainRecommendation();
  const currentWeightGain = mockWeightHistory[mockWeightHistory.length - 1].weight - mockWeightHistory[0].weight;

  const filteredFoods =
    selectedFoodFilter === "all"
      ? foodSafetyList
      : foodSafetyList.filter((f) => f.status === selectedFoodFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Pregnancy Nutrition</h1>
          <p className="text-gray-600 mt-1">Nutrition guidance for a healthy pregnancy</p>
        </div>

        {/* Pregnancy Progress */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-pink-100">Week {currentWeek} of 40</p>
              <h2 className="text-2xl font-bold">{currentTrimester.title}</h2>
            </div>
            <div className="text-right">
              <p className="text-pink-100">Due Date</p>
              <p className="text-xl font-semibold">
                {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
              <p className="text-sm text-pink-100">{daysRemaining} days to go</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-3 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${(currentWeek / 40) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-pink-100">
              <span>Week 1</span>
              <span>Week 13</span>
              <span>Week 27</span>
              <span>Week 40</span>
            </div>
          </div>

          {/* Baby Size */}
          <div className="mt-4 p-3 bg-white/20 rounded-xl">
            <p className="text-sm">
              🍌 Baby is about the size of a <strong>banana</strong> this week!
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview", icon: "🏠" },
            { id: "nutrients", label: "Nutrients", icon: "🥗" },
            { id: "foods", label: "Food Safety", icon: "🚦" },
            { id: "weight", label: "Weight", icon: "⚖️" },
            { id: "vitamins", label: "Prenatals", icon: "💊" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-pink-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-pink-50"
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
            {/* Daily Calorie Adjustment */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Daily Calorie Needs</h3>
              <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl">
                <div>
                  <p className="text-gray-600">Additional calories needed</p>
                  <p className="text-3xl font-bold text-pink-600">
                    +{currentTrimester.calorieIncrease}
                  </p>
                  <p className="text-sm text-gray-500">per day in {currentTrimester.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Total Daily Goal</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {2000 + currentTrimester.calorieIncrease} cal
                  </p>
                </div>
              </div>
            </div>

            {/* Focus Nutrients */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Key Nutrients for {currentTrimester.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentTrimester.focus.map((nutrient) => (
                  <span
                    key={nutrient}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-medium"
                  >
                    {nutrient}
                  </span>
                ))}
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-700">💡 {currentTrimester.tips}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-500">Weight Gain</p>
                <p className="text-2xl font-bold text-gray-900">+{currentWeightGain} lbs</p>
                <p className="text-xs text-green-600">On track</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-500">Water Intake</p>
                <p className="text-2xl font-bold text-gray-900">8/10</p>
                <p className="text-xs text-gray-500">glasses</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-500">Prenatal</p>
                <p className="text-2xl font-bold text-green-600">✓</p>
                <p className="text-xs text-gray-500">Taken today</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-500">Folate</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
                <p className="text-xs text-gray-500">of daily goal</p>
              </div>
            </div>

            {/* Today's Tips */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-3">💡 Today's Tips</h3>
              <ul className="space-y-2 text-sm">
                <li>• Eat small, frequent meals to help with nausea</li>
                <li>• Include iron-rich foods with vitamin C for better absorption</li>
                <li>• Stay hydrated - aim for 10 glasses of water daily</li>
                <li>• Snack on nuts and seeds for healthy fats and protein</li>
              </ul>
            </div>
          </div>
        )}

        {/* Nutrients Tab */}
        {activeTab === "nutrients" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Daily Nutrient Goals</h3>
              <div className="space-y-4">
                {nutrientGoals.map((nutrient) => {
                  const percentage = Math.min((nutrient.current / nutrient.goal) * 100, 100);
                  return (
                    <div key={nutrient.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span>{nutrient.icon}</span>
                          <span className="font-medium text-gray-700">{nutrient.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {nutrient.current}/{nutrient.goal} {nutrient.unit}
                        </span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            percentage >= 100
                              ? "bg-green-500"
                              : percentage >= 70
                              ? "bg-yellow-500"
                              : "bg-red-400"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{nutrient.importance}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Nutrient Info Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {nutrientGoals.slice(0, 4).map((nutrient) => (
                <div key={nutrient.name} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{nutrient.icon}</span>
                    <h4 className="font-semibold text-gray-900">{nutrient.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{nutrient.importance}</p>
                  <p className="text-xs text-gray-500">
                    Good sources: {nutrient.name === "Folate" ? "leafy greens, beans, fortified cereals" :
                      nutrient.name === "Iron" ? "lean red meat, spinach, beans" :
                      nutrient.name === "Calcium" ? "dairy, fortified plant milk, almonds" :
                      "fatty fish, fortified foods, sunlight"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Food Safety Tab */}
        {activeTab === "foods" && (
          <div className="space-y-6">
            {/* Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { id: "all", label: "All Foods" },
                { id: "safe", label: "✅ Safe" },
                { id: "caution", label: "⚠️ Caution" },
                { id: "avoid", label: "🚫 Avoid" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFoodFilter(filter.id as typeof selectedFoodFilter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedFoodFilter === filter.id
                      ? "bg-pink-600 text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Food List */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {filteredFoods.map((food) => (
                  <div key={food.name} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {food.status === "safe" ? "✅" : food.status === "caution" ? "⚠️" : "🚫"}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900">{food.name}</h4>
                          <p className="text-sm text-gray-600">{food.reason}</p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          food.status === "safe"
                            ? "bg-green-100 text-green-700"
                            : food.status === "caution"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {food.status}
                      </span>
                    </div>
                    {food.alternatives && (
                      <div className="mt-2 ml-11">
                        <p className="text-sm text-gray-500">
                          Alternatives: {food.alternatives.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Reference Card */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-3">Quick Reference</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium mb-2">✅ Safe</p>
                  <ul className="space-y-1 opacity-90">
                    <li>• Cooked fish (low mercury)</li>
                    <li>• Pasteurized dairy</li>
                    <li>• Well-cooked meats</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">⚠️ Caution</p>
                  <ul className="space-y-1 opacity-90">
                    <li>• Caffeine (&lt;200mg)</li>
                    <li>• Deli meats (heat first)</li>
                    <li>• Soft cheese (check label)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">🚫 Avoid</p>
                  <ul className="space-y-1 opacity-90">
                    <li>• Raw fish/sushi</li>
                    <li>• Alcohol</li>
                    <li>• High-mercury fish</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weight Tab */}
        {activeTab === "weight" && (
          <div className="space-y-6">
            {/* Current Weight */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Weight Tracking</h3>
                <button className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium">
                  + Log Weight
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Pre-pregnancy</p>
                  <p className="text-2xl font-bold text-gray-900">{mockWeightHistory[0].weight} lbs</p>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-xl">
                  <p className="text-sm text-gray-500">Current</p>
                  <p className="text-2xl font-bold text-pink-600">
                    {mockWeightHistory[mockWeightHistory.length - 1].weight} lbs
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Total Gain</p>
                  <p className="text-2xl font-bold text-green-600">+{currentWeightGain} lbs</p>
                </div>
              </div>
            </div>

            {/* Recommended Range */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recommended Weight Gain</h3>
              <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div
                  className="absolute h-full bg-green-200"
                  style={{
                    left: `${(weightGainRec.min / 45) * 100}%`,
                    width: `${((weightGainRec.max - weightGainRec.min) / 45) * 100}%`,
                  }}
                />
                <div
                  className="absolute top-0 bottom-0 w-1 bg-pink-600"
                  style={{ left: `${(currentWeightGain / 45) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>0 lbs</span>
                <span className="text-green-600 font-medium">
                  Target: {weightGainRec.min}-{weightGainRec.max} lbs
                </span>
                <span>45 lbs</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Based on normal pre-pregnancy BMI. Your gain of {currentWeightGain} lbs is{" "}
                <span className="text-green-600 font-medium">on track</span>!
              </p>
            </div>

            {/* Weight History Chart */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Weight History</h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {mockWeightHistory.map((entry, idx) => {
                  const minWeight = mockWeightHistory[0].weight - 5;
                  const maxWeight = mockWeightHistory[mockWeightHistory.length - 1].weight + 10;
                  const height = ((entry.weight - minWeight) / (maxWeight - minWeight)) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-pink-500 rounded-t-lg"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-gray-500 mt-2">
                        {entry.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Vitamins Tab */}
        {activeTab === "vitamins" && (
          <div className="space-y-6">
            {/* Today's Vitamins */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Today's Prenatal Vitamins</h3>
              <div className="space-y-3">
                {[
                  { name: "Prenatal Multivitamin", taken: true, time: "8:00 AM" },
                  { name: "DHA/Omega-3", taken: true, time: "8:00 AM" },
                  { name: "Vitamin D", taken: false, time: "8:00 AM" },
                  { name: "Iron Supplement", taken: false, time: "2:00 PM" },
                ].map((vitamin) => (
                  <div
                    key={vitamin.name}
                    className={`p-4 rounded-xl flex items-center justify-between ${
                      vitamin.taken ? "bg-green-50" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          vitamin.taken
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {vitamin.taken && "✓"}
                      </button>
                      <div>
                        <p className={`font-medium ${vitamin.taken ? "text-gray-500 line-through" : "text-gray-900"}`}>
                          {vitamin.name}
                        </p>
                        <p className="text-sm text-gray-500">{vitamin.time}</p>
                      </div>
                    </div>
                    {!vitamin.taken && (
                      <button className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                        Take Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Vitamin Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Essential Prenatal Nutrients</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: "Folic Acid", amount: "400-800 mcg", reason: "Prevents neural tube defects", icon: "🥬" },
                  { name: "Iron", amount: "27 mg", reason: "Supports increased blood volume", icon: "🩸" },
                  { name: "Calcium", amount: "1000 mg", reason: "Builds baby's bones & teeth", icon: "🦴" },
                  { name: "DHA", amount: "200-300 mg", reason: "Brain & eye development", icon: "🧠" },
                ].map((nutrient) => (
                  <div key={nutrient.name} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{nutrient.icon}</span>
                      <h4 className="font-medium text-gray-900">{nutrient.name}</h4>
                    </div>
                    <p className="text-sm text-pink-600 font-medium">{nutrient.amount}/day</p>
                    <p className="text-sm text-gray-600 mt-1">{nutrient.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reminder Settings */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">⏰ Set Reminders</h3>
              <p className="text-sm opacity-90 mb-4">
                Never miss your prenatal vitamins with daily reminders
              </p>
              <button className="px-4 py-2 bg-white text-pink-600 rounded-lg font-medium">
                Configure Reminders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
