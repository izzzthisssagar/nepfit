"use client";

import { useState } from "react";

interface JournalEntry {
  id: string;
  date: Date;
  meals: MealEntry[];
  mood: string;
  energy: number;
  notes: string;
  tags: string[];
  photos: string[];
}

interface MealEntry {
  id: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  time: string;
  foods: string[];
  calories: number;
  satisfaction: number;
  hungerBefore: number;
  hungerAfter: number;
  notes?: string;
}

interface FoodTemplate {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

const mealTypes = [
  { id: "breakfast", name: "Breakfast", icon: "🌅", color: "bg-yellow-100 text-yellow-700" },
  { id: "lunch", name: "Lunch", icon: "☀️", color: "bg-orange-100 text-orange-700" },
  { id: "dinner", name: "Dinner", icon: "🌙", color: "bg-purple-100 text-purple-700" },
  { id: "snack", name: "Snack", icon: "🍎", color: "bg-green-100 text-green-700" },
];

const foodTemplates: FoodTemplate[] = [
  { id: "1", name: "Oatmeal", emoji: "🥣", category: "Breakfast" },
  { id: "2", name: "Eggs", emoji: "🍳", category: "Breakfast" },
  { id: "3", name: "Toast", emoji: "🍞", category: "Breakfast" },
  { id: "4", name: "Salad", emoji: "🥗", category: "Lunch" },
  { id: "5", name: "Sandwich", emoji: "🥪", category: "Lunch" },
  { id: "6", name: "Soup", emoji: "🍲", category: "Lunch" },
  { id: "7", name: "Chicken", emoji: "🍗", category: "Dinner" },
  { id: "8", name: "Fish", emoji: "🐟", category: "Dinner" },
  { id: "9", name: "Rice", emoji: "🍚", category: "Dinner" },
  { id: "10", name: "Pasta", emoji: "🍝", category: "Dinner" },
  { id: "11", name: "Vegetables", emoji: "🥦", category: "Dinner" },
  { id: "12", name: "Fruit", emoji: "🍎", category: "Snack" },
  { id: "13", name: "Nuts", emoji: "🥜", category: "Snack" },
  { id: "14", name: "Yogurt", emoji: "🥛", category: "Snack" },
  { id: "15", name: "Coffee", emoji: "☕", category: "Drinks" },
  { id: "16", name: "Water", emoji: "💧", category: "Drinks" },
];

const mockEntries: JournalEntry[] = [
  {
    id: "1",
    date: new Date(),
    meals: [
      {
        id: "m1",
        type: "breakfast",
        time: "08:30",
        foods: ["Oatmeal with berries", "Black coffee"],
        calories: 350,
        satisfaction: 4,
        hungerBefore: 4,
        hungerAfter: 1,
        notes: "Added extra berries today",
      },
      {
        id: "m2",
        type: "lunch",
        time: "12:30",
        foods: ["Grilled chicken salad", "Whole wheat bread"],
        calories: 520,
        satisfaction: 5,
        hungerBefore: 3,
        hungerAfter: 2,
      },
    ],
    mood: "😊",
    energy: 4,
    notes: "Feeling good today, stayed hydrated",
    tags: ["healthy", "high-protein"],
    photos: [],
  },
  {
    id: "2",
    date: new Date(Date.now() - 86400000),
    meals: [
      {
        id: "m3",
        type: "breakfast",
        time: "09:00",
        foods: ["Scrambled eggs", "Avocado toast"],
        calories: 420,
        satisfaction: 5,
        hungerBefore: 5,
        hungerAfter: 1,
      },
      {
        id: "m4",
        type: "lunch",
        time: "13:00",
        foods: ["Quinoa bowl", "Grilled vegetables"],
        calories: 480,
        satisfaction: 4,
        hungerBefore: 3,
        hungerAfter: 2,
      },
      {
        id: "m5",
        type: "dinner",
        time: "19:00",
        foods: ["Salmon", "Brown rice", "Steamed broccoli"],
        calories: 650,
        satisfaction: 5,
        hungerBefore: 4,
        hungerAfter: 1,
      },
    ],
    mood: "😄",
    energy: 5,
    notes: "Great eating day! Hit all my nutrition goals.",
    tags: ["balanced", "meal-prep"],
    photos: [],
  },
];

const tags = [
  "healthy",
  "high-protein",
  "low-carb",
  "vegetarian",
  "vegan",
  "meal-prep",
  "homemade",
  "restaurant",
  "cheat-day",
  "balanced",
];

export default function JournalPage() {
  const [activeTab, setActiveTab] = useState<"today" | "history" | "insights" | "templates">("today");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string>("breakfast");
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(mockEntries[0]);
  const [journalNote, setJournalNote] = useState(currentEntry?.notes || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(currentEntry?.tags || []);

  const [newMeal, setNewMeal] = useState({
    foods: "",
    time: "",
    hungerBefore: 3,
    satisfaction: 3,
    notes: "",
  });

  const getMealTypeInfo = (type: string) => {
    return mealTypes.find((m) => m.id === type) || mealTypes[0];
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getTotalCalories = (meals: MealEntry[]): number => {
    return meals.reduce((sum, meal) => sum + meal.calories, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Food Journal</h1>
          <p className="text-gray-600 mt-1">Track your meals and eating habits</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "today", label: "Today", icon: "📝" },
            { id: "history", label: "History", icon: "📅" },
            { id: "insights", label: "Insights", icon: "📊" },
            { id: "templates", label: "Quick Add", icon: "⚡" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-emerald-50"
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
            {/* Date Selector */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center justify-between">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900">{formatDate(selectedDate)}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Daily Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <p className="text-2xl font-bold text-emerald-600">
                  {currentEntry ? getTotalCalories(currentEntry.meals) : 0}
                </p>
                <p className="text-sm text-gray-500">Calories</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <p className="text-2xl font-bold text-emerald-600">
                  {currentEntry?.meals.length || 0}
                </p>
                <p className="text-sm text-gray-500">Meals</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <p className="text-2xl">{currentEntry?.mood || "😐"}</p>
                <p className="text-sm text-gray-500">Mood</p>
              </div>
            </div>

            {/* Meals List */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Today's Meals</h3>
                <button
                  onClick={() => setShowMealModal(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  + Add Meal
                </button>
              </div>

              {/* Meal Types Grid */}
              <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {mealTypes.map((type) => {
                  const meal = currentEntry?.meals.find((m) => m.type === type.id);
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedMealType(type.id);
                        setShowMealModal(true);
                      }}
                      className={`p-4 rounded-xl text-left transition-all ${
                        meal
                          ? "bg-emerald-50 border-2 border-emerald-200"
                          : "bg-gray-50 border-2 border-dashed border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{type.icon}</span>
                        <span className="font-medium text-gray-900">{type.name}</span>
                      </div>
                      {meal ? (
                        <>
                          <p className="text-sm text-gray-600 truncate">
                            {meal.foods.join(", ")}
                          </p>
                          <p className="text-sm text-emerald-600 font-medium mt-1">
                            {meal.calories} cal
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-400">Tap to add</p>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Logged Meals Detail */}
              {currentEntry && currentEntry.meals.length > 0 && (
                <div className="border-t border-gray-100 divide-y divide-gray-100">
                  {currentEntry.meals.map((meal) => {
                    const typeInfo = getMealTypeInfo(meal.type);
                    return (
                      <div key={meal.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${typeInfo.color}`}
                            >
                              {typeInfo.icon} {typeInfo.name}
                            </span>
                            <div>
                              <p className="text-sm text-gray-500">{meal.time}</p>
                              <ul className="mt-1 space-y-1">
                                {meal.foods.map((food, idx) => (
                                  <li key={idx} className="text-gray-900">
                                    {food}
                                  </li>
                                ))}
                              </ul>
                              {meal.notes && (
                                <p className="text-sm text-gray-500 italic mt-2">
                                  "{meal.notes}"
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{meal.calories} cal</p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-sm text-gray-500">Satisfaction:</span>
                              <span className="text-sm">{"⭐".repeat(meal.satisfaction)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Daily Notes */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Daily Notes</h3>
              <textarea
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                placeholder="How did you feel about your eating today? Any observations?"
                className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                rows={3}
              />

              {/* Tags */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Energy & Mood */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Energy Level</h3>
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      className={`w-12 h-12 rounded-full text-lg font-medium transition-colors ${
                        currentEntry?.energy === level
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-emerald-100"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Mood After Eating</h3>
                <div className="flex justify-between">
                  {["😫", "😕", "😐", "😊", "😄"].map((mood) => (
                    <button
                      key={mood}
                      className={`w-12 h-12 rounded-full text-2xl transition-all ${
                        currentEntry?.mood === mood
                          ? "bg-emerald-100 scale-110"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-4">
            {/* Month View */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">February 2026</h3>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">←</button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">→</button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <div key={day} className="text-center text-sm text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 5; // Offset for starting day
                  const hasEntry = [1, 2, 3, 5, 6, 7].includes(day);
                  return (
                    <button
                      key={i}
                      className={`aspect-square rounded-lg text-sm flex items-center justify-center ${
                        day > 0 && day <= 28
                          ? hasEntry
                            ? "bg-emerald-100 text-emerald-700 font-medium"
                            : "hover:bg-gray-100 text-gray-700"
                          : "text-gray-300"
                      }`}
                    >
                      {day > 0 && day <= 28 ? day : ""}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Entry List */}
            <div className="space-y-4">
              {mockEntries.map((entry) => (
                <div key={entry.id} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{formatDate(entry.date)}</h4>
                      <p className="text-sm text-gray-500">
                        {entry.meals.length} meals • {getTotalCalories(entry.meals)} calories
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{entry.mood}</span>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                        Energy: {entry.energy}/5
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {entry.meals.map((meal) => {
                      const typeInfo = getMealTypeInfo(meal.type);
                      return (
                        <span
                          key={meal.id}
                          className={`px-3 py-1 rounded-full text-sm ${typeInfo.color}`}
                        >
                          {typeInfo.icon} {meal.calories} cal
                        </span>
                      );
                    })}
                  </div>

                  {entry.notes && (
                    <p className="text-gray-600 text-sm italic">"{entry.notes}"</p>
                  )}

                  {entry.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === "insights" && (
          <div className="space-y-6">
            {/* Weekly Overview */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Weekly Calories</h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {[1800, 2100, 1950, 2200, 1750, 2400, 1900].map((cal, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-emerald-500 rounded-t-lg transition-all"
                      style={{ height: `${(cal / 2500) * 100}%` }}
                    />
                    <span className="text-xs text-gray-500 mt-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
                    </span>
                    <span className="text-xs text-gray-400">{cal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Eating Patterns */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Meal Distribution</h3>
                <div className="space-y-3">
                  {[
                    { name: "Breakfast", percent: 25, color: "bg-yellow-500" },
                    { name: "Lunch", percent: 35, color: "bg-orange-500" },
                    { name: "Dinner", percent: 30, color: "bg-purple-500" },
                    { name: "Snacks", percent: 10, color: "bg-green-500" },
                  ].map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-medium">{item.percent}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Top Foods This Week</h3>
                <div className="space-y-3">
                  {[
                    { food: "Chicken Breast", count: 5, emoji: "🍗" },
                    { food: "Brown Rice", count: 4, emoji: "🍚" },
                    { food: "Salad", count: 4, emoji: "🥗" },
                    { food: "Eggs", count: 3, emoji: "🍳" },
                    { food: "Oatmeal", count: 3, emoji: "🥣" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.emoji}</span>
                        <span className="text-gray-700">{item.food}</span>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                        {item.count}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mood & Energy Correlation */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Mood & Energy Trends</h3>
              <div className="grid grid-cols-7 gap-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
                  <div key={day} className="text-center">
                    <p className="text-sm text-gray-500 mb-2">{day}</p>
                    <div className="text-2xl mb-1">
                      {["😊", "😄", "😐", "😊", "😄", "😕", "😊"][idx]}
                    </div>
                    <div className="flex justify-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full mx-0.5 ${
                            i < [4, 5, 3, 4, 5, 2, 4][idx]
                              ? "bg-emerald-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-semibold mb-1">Consistency</h4>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm opacity-80">meals logged this week</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
                <div className="text-3xl mb-2">🔥</div>
                <h4 className="font-semibold mb-1">Streak</h4>
                <p className="text-2xl font-bold">7 days</p>
                <p className="text-sm opacity-80">logging streak</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
                <div className="text-3xl mb-2">⭐</div>
                <h4 className="font-semibold mb-1">Avg Satisfaction</h4>
                <p className="text-2xl font-bold">4.2/5</p>
                <p className="text-sm opacity-80">meal satisfaction</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Add Tab */}
        {activeTab === "templates" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Quick Add Foods</h3>
              <p className="text-gray-600 text-sm mb-4">
                Tap to quickly add common foods to your journal
              </p>

              {["Breakfast", "Lunch", "Dinner", "Snack", "Drinks"].map((category) => (
                <div key={category} className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {foodTemplates
                      .filter((f) => f.category === category)
                      .map((food) => (
                        <button
                          key={food.id}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-emerald-50 rounded-full transition-colors"
                        >
                          <span>{food.emoji}</span>
                          <span className="text-gray-700">{food.name}</span>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Foods */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Foods</h3>
              <div className="space-y-2">
                {[
                  "Grilled Chicken Salad",
                  "Oatmeal with Berries",
                  "Scrambled Eggs",
                  "Quinoa Bowl",
                  "Avocado Toast",
                ].map((food, idx) => (
                  <button
                    key={idx}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-emerald-50 rounded-xl transition-colors"
                  >
                    <span className="text-gray-700">{food}</span>
                    <span className="text-emerald-600">+</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Create Custom Template */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">Create Custom Template</h3>
              <p className="text-sm opacity-90 mb-4">
                Save your favorite meals for quick logging
              </p>
              <button className="px-4 py-2 bg-white text-emerald-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                + Create Template
              </button>
            </div>
          </div>
        )}

        {/* Add Meal Modal */}
        {showMealModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  Add {getMealTypeInfo(selectedMealType).name}
                </h3>
                <button
                  onClick={() => setShowMealModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Meal Type Selector */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {mealTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedMealType(type.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${
                        selectedMealType === type.id
                          ? type.color
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {type.icon} {type.name}
                    </button>
                  ))}
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newMeal.time}
                    onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                  />
                </div>

                {/* Foods */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What did you eat?
                  </label>
                  <textarea
                    value={newMeal.foods}
                    onChange={(e) => setNewMeal({ ...newMeal, foods: e.target.value })}
                    placeholder="e.g., Grilled chicken, brown rice, steamed vegetables"
                    className="w-full p-3 border border-gray-200 rounded-xl resize-none"
                    rows={3}
                  />
                </div>

                {/* Hunger Before */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hunger level before eating: {newMeal.hungerBefore}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={newMeal.hungerBefore}
                    onChange={(e) =>
                      setNewMeal({ ...newMeal, hungerBefore: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Not hungry</span>
                    <span>Very hungry</span>
                  </div>
                </div>

                {/* Satisfaction */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal satisfaction: {newMeal.satisfaction}/5
                  </label>
                  <div className="flex justify-between">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => setNewMeal({ ...newMeal, satisfaction: level })}
                        className={`text-2xl transition-transform ${
                          newMeal.satisfaction >= level ? "scale-110" : "opacity-30"
                        }`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <input
                    type="text"
                    value={newMeal.notes}
                    onChange={(e) => setNewMeal({ ...newMeal, notes: e.target.value })}
                    placeholder="Any observations about this meal?"
                    className="w-full p-3 border border-gray-200 rounded-xl"
                  />
                </div>

                {/* Quick Add */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Quick add:</p>
                  <div className="flex flex-wrap gap-2">
                    {foodTemplates.slice(0, 8).map((food) => (
                      <button
                        key={food.id}
                        onClick={() =>
                          setNewMeal({
                            ...newMeal,
                            foods: newMeal.foods
                              ? `${newMeal.foods}, ${food.name}`
                              : food.name,
                          })
                        }
                        className="px-3 py-1 bg-gray-100 hover:bg-emerald-100 rounded-full text-sm"
                      >
                        {food.emoji} {food.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setShowMealModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowMealModal(false)}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-medium"
                >
                  Save Meal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
