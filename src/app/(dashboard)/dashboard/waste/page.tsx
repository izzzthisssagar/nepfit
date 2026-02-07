"use client";

import { useState } from "react";

interface WasteEntry {
  id: string;
  date: string;
  foodItem: string;
  category: string;
  quantity: string;
  reason: string;
  cost: number;
  preventable: boolean;
  notes: string;
}

interface WasteCategory {
  name: string;
  icon: string;
  color: string;
  amount: number;
  percentage: number;
}

interface SavingTip {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: "high" | "medium" | "low";
  icon: string;
}

const mockWasteEntries: WasteEntry[] = [
  {
    id: "1",
    date: "2026-02-07",
    foodItem: "Lettuce",
    category: "Vegetables",
    quantity: "1 head",
    reason: "expired",
    cost: 2.99,
    preventable: true,
    notes: "Forgot it was in the fridge",
  },
  {
    id: "2",
    date: "2026-02-06",
    foodItem: "Bread",
    category: "Grains",
    quantity: "4 slices",
    reason: "moldy",
    cost: 1.50,
    preventable: true,
    notes: "Should have frozen it",
  },
  {
    id: "3",
    date: "2026-02-05",
    foodItem: "Leftover pasta",
    category: "Prepared",
    quantity: "2 cups",
    reason: "forgot",
    cost: 3.00,
    preventable: true,
    notes: "Made too much",
  },
  {
    id: "4",
    date: "2026-02-04",
    foodItem: "Banana peels",
    category: "Fruits",
    quantity: "3 peels",
    reason: "unavoidable",
    cost: 0,
    preventable: false,
    notes: "Composted",
  },
  {
    id: "5",
    date: "2026-02-03",
    foodItem: "Yogurt",
    category: "Dairy",
    quantity: "1 cup",
    reason: "expired",
    cost: 1.25,
    preventable: true,
    notes: "Didn't check date when buying",
  },
];

const wasteCategories: WasteCategory[] = [
  { name: "Vegetables", icon: "🥬", color: "bg-green-500", amount: 12.50, percentage: 35 },
  { name: "Fruits", icon: "🍎", color: "bg-red-500", amount: 8.25, percentage: 23 },
  { name: "Dairy", icon: "🥛", color: "bg-blue-500", amount: 6.75, percentage: 19 },
  { name: "Grains", icon: "🍞", color: "bg-amber-500", amount: 4.50, percentage: 13 },
  { name: "Prepared", icon: "🍲", color: "bg-purple-500", amount: 3.50, percentage: 10 },
];

const wasteReasons = [
  { value: "expired", label: "Expired", icon: "📅" },
  { value: "moldy", label: "Moldy/Spoiled", icon: "🦠" },
  { value: "forgot", label: "Forgot about it", icon: "🤔" },
  { value: "overcooked", label: "Overcooked/Burnt", icon: "🔥" },
  { value: "didnt_like", label: "Didn't like it", icon: "😕" },
  { value: "too_much", label: "Made too much", icon: "📏" },
  { value: "unavoidable", label: "Unavoidable (peels, bones)", icon: "♻️" },
];

const savingTips: SavingTip[] = [
  {
    id: "1",
    title: "First In, First Out",
    description: "Store newer items behind older ones. Use older products first to prevent expiration.",
    category: "Storage",
    impact: "high",
    icon: "📦",
  },
  {
    id: "2",
    title: "Freeze Before It's Too Late",
    description: "Freeze bread, meat, and produce before they spoil. Most foods freeze well for months.",
    category: "Storage",
    impact: "high",
    icon: "❄️",
  },
  {
    id: "3",
    title: "Plan Your Meals",
    description: "Create a weekly meal plan and shop with a list to avoid buying items you won't use.",
    category: "Planning",
    impact: "high",
    icon: "📋",
  },
  {
    id: "4",
    title: "Understand Expiration Dates",
    description: "'Best by' and 'sell by' dates are about quality, not safety. Trust your senses!",
    category: "Knowledge",
    impact: "medium",
    icon: "📅",
  },
  {
    id: "5",
    title: "Proper Produce Storage",
    description: "Store fruits and veggies correctly. Some need refrigeration, others countertop.",
    category: "Storage",
    impact: "medium",
    icon: "🥗",
  },
  {
    id: "6",
    title: "Embrace Imperfect Produce",
    description: "Ugly fruits and vegetables taste the same! Buy them at a discount.",
    category: "Shopping",
    impact: "low",
    icon: "🥕",
  },
  {
    id: "7",
    title: "Start Composting",
    description: "Turn unavoidable food scraps into nutrient-rich soil for your garden.",
    category: "Composting",
    impact: "medium",
    icon: "🌱",
  },
  {
    id: "8",
    title: "Leftover Makeover",
    description: "Transform leftovers into new meals. Stir-fries, soups, and casseroles are great options.",
    category: "Cooking",
    impact: "high",
    icon: "👨‍🍳",
  },
];

const monthlyData = [
  { month: "Sep", waste: 45, cost: 52 },
  { month: "Oct", waste: 38, cost: 44 },
  { month: "Nov", waste: 42, cost: 48 },
  { month: "Dec", waste: 55, cost: 62 },
  { month: "Jan", waste: 32, cost: 38 },
  { month: "Feb", waste: 28, cost: 35 },
];

export default function FoodWastePage() {
  const [activeTab, setActiveTab] = useState<"log" | "stats" | "tips" | "goals">("log");
  const [showAddWaste, setShowAddWaste] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month");

  const totalWaste = mockWasteEntries.reduce((sum, e) => sum + e.cost, 0);
  const preventableWaste = mockWasteEntries.filter(e => e.preventable).reduce((sum, e) => sum + e.cost, 0);
  const preventablePercentage = Math.round((preventableWaste / totalWaste) * 100);

  const getReasonIcon = (reason: string) => {
    return wasteReasons.find(r => r.value === reason)?.icon || "❓";
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-green-100 text-green-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "low": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            ♻️ Food Waste Tracker
          </h1>
          <p className="text-gray-600 mt-1">Reduce waste, save money, and help the environment</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-100">
            <div className="text-2xl mb-2">💸</div>
            <div className="text-2xl font-bold text-red-600">${totalWaste.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Wasted This Month</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100">
            <div className="text-2xl mb-2">⚠️</div>
            <div className="text-2xl font-bold text-amber-600">{preventablePercentage}%</div>
            <div className="text-sm text-gray-500">Was Preventable</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100">
            <div className="text-2xl mb-2">📉</div>
            <div className="text-2xl font-bold text-green-600">-18%</div>
            <div className="text-sm text-gray-500">vs Last Month</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100">
            <div className="text-2xl mb-2">🌍</div>
            <div className="text-2xl font-bold text-blue-600">2.4 kg</div>
            <div className="text-sm text-gray-500">CO₂ Saved</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "log", label: "Waste Log", icon: "📝" },
            { id: "stats", label: "Statistics", icon: "📊" },
            { id: "tips", label: "Saving Tips", icon: "💡" },
            { id: "goals", label: "Goals", icon: "🎯" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-green-500 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-green-50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Log Tab */}
        {activeTab === "log" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Recent Waste Entries</h3>
              <button
                onClick={() => setShowAddWaste(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
              >
                ➕ Log Waste
              </button>
            </div>

            <div className="space-y-3">
              {mockWasteEntries.map(entry => (
                <div key={entry.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{getReasonIcon(entry.reason)}</div>
                      <div>
                        <div className="font-semibold text-gray-800">{entry.foodItem}</div>
                        <div className="text-sm text-gray-500">
                          {entry.quantity} • {entry.category}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${entry.cost > 0 ? "text-red-600" : "text-gray-400"}`}>
                        {entry.cost > 0 ? `-$${entry.cost.toFixed(2)}` : "Free"}
                      </div>
                      <div className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        entry.preventable ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                      }`}>
                        {entry.preventable ? "Preventable" : "Unavoidable"}
                      </span>
                      <span className="text-sm text-gray-500">{wasteReasons.find(r => r.value === entry.reason)?.label}</span>
                    </div>
                    {entry.notes && (
                      <span className="text-sm text-gray-400 italic">{entry.notes}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Entry Buttons */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3">Quick Log</h4>
              <div className="flex flex-wrap gap-2">
                {["Expired produce", "Leftover meal", "Stale bread", "Spoiled dairy", "Overripe fruit"].map(item => (
                  <button
                    key={item}
                    onClick={() => setShowAddWaste(true)}
                    className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-green-100 transition-colors"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            {/* Period Selector */}
            <div className="flex gap-2">
              {[
                { id: "week", label: "This Week" },
                { id: "month", label: "This Month" },
                { id: "year", label: "This Year" },
              ].map(period => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id as typeof selectedPeriod)}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    selectedPeriod === period.id
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-600 hover:bg-green-50"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>

            {/* Waste by Category */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">Waste by Category</h4>
              <div className="space-y-4">
                {wasteCategories.map(category => (
                  <div key={category.name} className="flex items-center gap-4">
                    <span className="text-2xl w-10">{category.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-gray-600">${category.amount.toFixed(2)}</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full ${category.color} rounded-full transition-all`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 w-12 text-right">{category.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">6-Month Trend</h4>
              <div className="h-64 flex items-end justify-around gap-4">
                {monthlyData.map((data, idx) => (
                  <div key={data.month} className="flex flex-col items-center gap-2 flex-1">
                    <div className="text-sm font-semibold text-gray-700">${data.cost}</div>
                    <div className="w-full flex flex-col items-center">
                      <div
                        className={`w-full max-w-[40px] rounded-t transition-all ${
                          idx === monthlyData.length - 1 ? "bg-green-500" : "bg-green-300"
                        }`}
                        style={{ height: `${data.cost * 2.5}px` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-500">{data.month}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-green-600 font-medium">
                📉 You're trending down! Great progress!
              </div>
            </div>

            {/* Waste Reasons Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">Top Waste Reasons</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { reason: "Expired", count: 8, icon: "📅" },
                  { reason: "Forgot", count: 5, icon: "🤔" },
                  { reason: "Made too much", count: 4, icon: "📏" },
                  { reason: "Spoiled", count: 3, icon: "🦠" },
                ].map(item => (
                  <div key={item.reason} className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="font-semibold">{item.count}</div>
                    <div className="text-sm text-gray-500">{item.reason}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-6 text-white">
              <h4 className="font-semibold mb-4">🌍 Your Environmental Impact</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">2.4 kg</div>
                  <div className="text-sm opacity-80">CO₂ Prevented</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">890 L</div>
                  <div className="text-sm opacity-80">Water Saved</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">3.2 m²</div>
                  <div className="text-sm opacity-80">Land Preserved</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">$125</div>
                  <div className="text-sm opacity-80">Saved This Year</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === "tips" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">💡 Did You Know?</h3>
              <p className="opacity-90">
                The average household wastes about $1,500 worth of food annually.
                Small changes can make a big difference for your wallet and the planet!
              </p>
            </div>

            {/* Tips by Category */}
            <div className="grid md:grid-cols-2 gap-4">
              {savingTips.map(tip => (
                <div key={tip.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{tip.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{tip.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getImpactColor(tip.impact)}`}>
                          {tip.impact} impact
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{tip.description}</p>
                      <div className="mt-2">
                        <span className="text-xs text-gray-400">{tip.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Storage Guide */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">🧊 Storage Quick Guide</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="font-medium text-blue-700 mb-2">❄️ Refrigerate</div>
                  <div className="text-sm text-gray-600">Leafy greens, berries, dairy, eggs, cut fruits, most vegetables</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="font-medium text-amber-700 mb-2">🌡️ Counter</div>
                  <div className="text-sm text-gray-600">Bananas, tomatoes, potatoes, onions, garlic, whole melons</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="font-medium text-purple-700 mb-2">🧊 Freeze</div>
                  <div className="text-sm text-gray-600">Bread, meat, overripe bananas, soups, sauces, fresh herbs</div>
                </div>
              </div>
            </div>

            {/* Leftover Ideas */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">👨‍🍳 Leftover Transformation Ideas</h4>
              <div className="space-y-3">
                {[
                  { from: "Stale bread", to: "Croutons, breadcrumbs, French toast, bread pudding", icon: "🍞" },
                  { from: "Overripe bananas", to: "Banana bread, smoothies, pancakes, nice cream", icon: "🍌" },
                  { from: "Leftover rice", to: "Fried rice, rice pudding, stuffed peppers", icon: "🍚" },
                  { from: "Wilting vegetables", to: "Soups, stir-fries, omelets, vegetable stock", icon: "🥗" },
                ].map((idea, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <span className="text-2xl">{idea.icon}</span>
                    <div>
                      <span className="font-medium">{idea.from}</span>
                      <span className="text-gray-400 mx-2">→</span>
                      <span className="text-gray-600">{idea.to}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === "goals" && (
          <div className="space-y-6">
            {/* Monthly Goal */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">February Goal: Reduce waste to $25</h4>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                  In Progress
                </span>
              </div>
              <div className="relative">
                <div className="bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all flex items-center justify-end pr-2"
                    style={{ width: "72%" }}
                  >
                    <span className="text-xs text-white font-medium">$8.74</span>
                  </div>
                </div>
                <div className="absolute right-0 top-8 text-sm text-gray-500">Goal: $25</div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">$8.74</div>
                  <div className="text-sm text-gray-500">Current</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">$16.26</div>
                  <div className="text-sm text-gray-500">Remaining</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">21</div>
                  <div className="text-sm text-gray-500">Days Left</div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">🏆 Achievements</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: "🌱", title: "First Step", desc: "Logged first waste", earned: true },
                  { icon: "📉", title: "Trending Down", desc: "Reduce waste 2 months in a row", earned: true },
                  { icon: "💚", title: "Green Week", desc: "Under $10 waste for a week", earned: true },
                  { icon: "🌍", title: "Planet Saver", desc: "Save 10kg CO₂", earned: false },
                  { icon: "🎯", title: "Goal Getter", desc: "Hit monthly goal", earned: false },
                  { icon: "♻️", title: "Composter", desc: "Log 10 composted items", earned: true },
                  { icon: "📅", title: "30 Day Streak", desc: "Log waste 30 days", earned: false },
                  { icon: "🏅", title: "Zero Hero", desc: "Zero preventable waste day", earned: false },
                ].map((achievement, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl p-4 text-center ${
                      achievement.earned ? "bg-green-50 border-2 border-green-200" : "bg-gray-50 opacity-60"
                    }`}
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <div className="font-medium text-sm">{achievement.title}</div>
                    <div className="text-xs text-gray-500">{achievement.desc}</div>
                    {achievement.earned && (
                      <div className="mt-2 text-green-600 text-xs">✓ Earned</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">🎯 Active Challenges</h4>
              <div className="space-y-4">
                {[
                  {
                    title: "Use It Up Week",
                    desc: "Cook meals using only items already in your fridge/pantry",
                    progress: 4,
                    total: 7,
                    reward: "50 points",
                  },
                  {
                    title: "Freezer Hero",
                    desc: "Freeze 5 items before they spoil this week",
                    progress: 3,
                    total: 5,
                    reward: "30 points",
                  },
                  {
                    title: "Leftover Master",
                    desc: "Transform leftovers into new meals 3 times",
                    progress: 1,
                    total: 3,
                    reward: "25 points",
                  },
                ].map((challenge, idx) => (
                  <div key={idx} className="border rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold">{challenge.title}</div>
                        <div className="text-sm text-gray-500">{challenge.desc}</div>
                      </div>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        {challenge.reward}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {challenge.progress}/{challenge.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Set New Goal */}
            <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-6 text-white">
              <h4 className="font-semibold mb-2">Set Your March Goal</h4>
              <p className="text-sm opacity-80 mb-4">Based on your progress, we recommend a goal of $20 or less.</p>
              <div className="flex gap-3">
                {["$30", "$25", "$20", "$15"].map(goal => (
                  <button
                    key={goal}
                    className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Waste Modal */}
        {showAddWaste && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Log Food Waste</h3>
                <button onClick={() => setShowAddWaste(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Food Item</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-xl" placeholder="e.g., Lettuce, leftover pasta" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select className="w-full px-4 py-2 border rounded-xl">
                      <option value="">Select...</option>
                      <option value="vegetables">Vegetables</option>
                      <option value="fruits">Fruits</option>
                      <option value="dairy">Dairy</option>
                      <option value="grains">Grains</option>
                      <option value="protein">Protein</option>
                      <option value="prepared">Prepared Food</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input type="text" className="w-full px-4 py-2 border rounded-xl" placeholder="e.g., 1 cup, 2 slices" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <select className="w-full px-4 py-2 border rounded-xl">
                    {wasteReasons.map(reason => (
                      <option key={reason.value} value={reason.value}>
                        {reason.icon} {reason.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost ($)</label>
                  <input type="number" step="0.01" className="w-full px-4 py-2 border rounded-xl" placeholder="0.00" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="preventable" className="rounded" defaultChecked />
                  <label htmlFor="preventable" className="text-sm text-gray-700">This was preventable</label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                  <textarea className="w-full px-4 py-2 border rounded-xl" rows={2} placeholder="What happened?"></textarea>
                </div>
                <button className="w-full py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600">
                  Log Waste
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
