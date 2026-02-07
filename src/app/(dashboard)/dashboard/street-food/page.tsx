"use client";

import { useState } from "react";

type StreetFoodTab = "explorer" | "healthcheck" | "alternatives" | "tracker";

interface StreetFoodItem {
  id: string;
  name: string;
  nameNe: string;
  icon: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  rating: number;
  origin: "Nepal" | "India" | "Both";
  healthScore: number;
  location: string;
  price: string;
  description: string;
}

interface HealthierAlternative {
  id: string;
  original: string;
  alternative: string;
  originalIcon: string;
  alternativeIcon: string;
  originalCalories: number;
  alternativeCalories: number;
  caloriesSaved: number;
  tip: string;
}

interface FoodSafetyTip {
  id: string;
  title: string;
  icon: string;
  description: string;
  severity: "important" | "moderate" | "tip";
}

interface LoggedStreetFood {
  id: string;
  name: string;
  icon: string;
  calories: number;
  date: string;
  cost: number;
  vendor: string;
}

const streetFoods: StreetFoodItem[] = [
  { id: "sf1", name: "Momo (Steamed)", nameNe: "मम", icon: "🥟", calories: 280, protein: 14, carbs: 32, fat: 10, rating: 4.8, origin: "Nepal", healthScore: 7, location: "Everywhere", price: "Rs. 100-150", description: "Steamed dumplings with spiced meat/veggie filling" },
  { id: "sf2", name: "Momo (Fried)", nameNe: "तरेको मम", icon: "🥟", calories: 420, protein: 14, carbs: 38, fat: 24, rating: 4.5, origin: "Nepal", healthScore: 4, location: "Everywhere", price: "Rs. 120-180", description: "Deep-fried dumplings, crispy and golden" },
  { id: "sf3", name: "Chatamari", nameNe: "चतामरी", icon: "🫓", calories: 320, protein: 12, carbs: 42, fat: 12, rating: 4.6, origin: "Nepal", healthScore: 6, location: "Kathmandu", price: "Rs. 80-150", description: "Newari rice crepe with minced meat and egg topping" },
  { id: "sf4", name: "Sel Roti", nameNe: "सेल रोटी", icon: "🍩", calories: 250, protein: 4, carbs: 45, fat: 8, rating: 4.3, origin: "Nepal", healthScore: 4, location: "Festivals/Streets", price: "Rs. 30-50", description: "Ring-shaped sweet fried rice bread" },
  { id: "sf5", name: "Pani Puri", nameNe: "पानी पुरी", icon: "🫧", calories: 180, protein: 4, carbs: 28, fat: 6, rating: 4.7, origin: "Both", healthScore: 5, location: "Street carts", price: "Rs. 30-60", description: "Crispy hollow shells filled with spiced water and chutney" },
  { id: "sf6", name: "Samosa", nameNe: "समोसा", icon: "🔺", calories: 310, protein: 6, carbs: 35, fat: 17, rating: 4.4, origin: "Both", healthScore: 4, location: "Tea shops", price: "Rs. 25-40", description: "Triangular fried pastry with spiced potato filling" },
  { id: "sf7", name: "Chaat", nameNe: "चाट", icon: "🥘", calories: 220, protein: 6, carbs: 32, fat: 8, rating: 4.5, origin: "India", healthScore: 6, location: "Street vendors", price: "Rs. 50-80", description: "Mixed crispy snack with chutneys and yogurt" },
  { id: "sf8", name: "Pakora", nameNe: "पकौडा", icon: "🧆", calories: 280, protein: 5, carbs: 22, fat: 20, rating: 4.2, origin: "Both", healthScore: 3, location: "Tea shops", price: "Rs. 50-80", description: "Deep-fried vegetable fritters in gram flour batter" },
  { id: "sf9", name: "Jalebi", nameNe: "जलेबी", icon: "🍥", calories: 350, protein: 2, carbs: 58, fat: 14, rating: 4.1, origin: "Both", healthScore: 2, location: "Sweet shops", price: "Rs. 40-60", description: "Spiral-shaped deep-fried sweet soaked in sugar syrup" },
  { id: "sf10", name: "Aloo Chop", nameNe: "आलु चप", icon: "🥔", calories: 260, protein: 5, carbs: 30, fat: 14, rating: 4.3, origin: "Both", healthScore: 4, location: "Street vendors", price: "Rs. 20-30", description: "Spiced potato cutlet, deep fried and crispy" },
  { id: "sf11", name: "Thukpa", nameNe: "थुक्पा", icon: "🍜", calories: 320, protein: 16, carbs: 38, fat: 12, rating: 4.6, origin: "Nepal", healthScore: 8, location: "Tibetan restaurants", price: "Rs. 100-150", description: "Hot noodle soup with vegetables and meat" },
  { id: "sf12", name: "Lassi", nameNe: "लस्सी", icon: "🥛", calories: 180, protein: 8, carbs: 24, fat: 6, rating: 4.4, origin: "Both", healthScore: 7, location: "Drink stalls", price: "Rs. 40-80", description: "Yogurt-based drink, sweet or salty" },
];

const healthierAlternatives: HealthierAlternative[] = [
  { id: "a1", original: "Fried Momo", alternative: "Steamed Momo", originalIcon: "🥟", alternativeIcon: "🥟", originalCalories: 420, alternativeCalories: 280, caloriesSaved: 140, tip: "Steam instead of fry - same great taste with 33% fewer calories!" },
  { id: "a2", original: "Samosa", alternative: "Baked Samosa", originalIcon: "🔺", alternativeIcon: "🔺", originalCalories: 310, alternativeCalories: 180, caloriesSaved: 130, tip: "Ask for baked version or make at home with phyllo dough" },
  { id: "a3", original: "Jalebi", alternative: "Fresh Fruit Chaat", originalIcon: "🍥", alternativeIcon: "🍉", originalCalories: 350, alternativeCalories: 120, caloriesSaved: 230, tip: "Swap sugar-soaked sweets for naturally sweet fruits with chaat masala" },
  { id: "a4", original: "Pakora (Deep Fried)", alternative: "Air-Fried Pakora", originalIcon: "🧆", alternativeIcon: "🧆", originalCalories: 280, alternativeCalories: 150, caloriesSaved: 130, tip: "Air fry at home for the same crunch with 50% less oil" },
  { id: "a5", original: "Sweet Lassi", alternative: "Plain Lassi + Honey", originalIcon: "🥛", alternativeIcon: "🥛", originalCalories: 220, alternativeCalories: 140, caloriesSaved: 80, tip: "Use a teaspoon of honey instead of sugar for natural sweetness" },
  { id: "a6", original: "Sel Roti (Fried)", alternative: "Baked Sel Roti", originalIcon: "🍩", alternativeIcon: "🍩", originalCalories: 250, alternativeCalories: 160, caloriesSaved: 90, tip: "Oven-bake at home for a lighter version of this festive treat" },
];

const foodSafetyTips: FoodSafetyTip[] = [
  { id: "t1", title: "Check Oil Freshness", icon: "🛢️", description: "Dark, thick oil means it has been reused many times. Fresh oil is lighter in color.", severity: "important" },
  { id: "t2", title: "Observe Vendor Hygiene", icon: "🧤", description: "Check if vendor uses gloves, clean utensils, and has a clean cooking area.", severity: "important" },
  { id: "t3", title: "Water Quality", icon: "💧", description: "Be cautious with pani puri and other water-based street foods. Contaminated water is a major risk.", severity: "important" },
  { id: "t4", title: "Peak Hours = Fresher Food", icon: "⏰", description: "Visit during peak hours (12-2 PM, 5-7 PM) when food is freshly prepared and has high turnover.", severity: "moderate" },
  { id: "t5", title: "Avoid Pre-cut Fruits", icon: "🍉", description: "Pre-cut fruits exposed to air and flies can harbor bacteria. Opt for whole fruits instead.", severity: "moderate" },
  { id: "t6", title: "Carry Hand Sanitizer", icon: "🧴", description: "Always clean your hands before eating street food, especially if no handwashing facility is available.", severity: "tip" },
];

const loggedStreetFoods: LoggedStreetFood[] = [
  { id: "lg1", name: "Steamed Momo", icon: "🥟", calories: 280, date: "2026-02-07", cost: 120, vendor: "Momo Pasal, Thamel" },
  { id: "lg2", name: "Pani Puri", icon: "🫧", calories: 180, date: "2026-02-06", cost: 50, vendor: "Asha Pani Puri, New Road" },
  { id: "lg3", name: "Thukpa", icon: "🍜", calories: 320, date: "2026-02-05", cost: 130, vendor: "Tibetan Kitchen, Boudha" },
  { id: "lg4", name: "Samosa", icon: "🔺", calories: 310, date: "2026-02-04", cost: 30, vendor: "Corner Tea Shop" },
  { id: "lg5", name: "Chatamari", icon: "🫓", calories: 320, date: "2026-02-03", cost: 100, vendor: "Newari Kitchen, Patan" },
];

export default function StreetFoodPage() {
  const [activeTab, setActiveTab] = useState<StreetFoodTab>("explorer");
  const [selectedFood, setSelectedFood] = useState<StreetFoodItem | null>(null);
  const [originFilter, setOriginFilter] = useState<"all" | "Nepal" | "India" | "Both">("all");
  const [sortBy, setSortBy] = useState<"rating" | "calories" | "healthScore">("rating");

  const tabs: { id: StreetFoodTab; label: string; icon: string }[] = [
    { id: "explorer", label: "Explorer", icon: "🗺️" },
    { id: "healthcheck", label: "Safety", icon: "🛡️" },
    { id: "alternatives", label: "Alternatives", icon: "♻️" },
    { id: "tracker", label: "Tracker", icon: "📝" },
  ];

  const filteredFoods = streetFoods
    .filter(f => originFilter === "all" || f.origin === originFilter)
    .sort((a, b) => sortBy === "calories" ? a.calories - b.calories : sortBy === "healthScore" ? b.healthScore - a.healthScore : b.rating - a.rating);

  const weeklyCalories = loggedStreetFoods.reduce((sum, f) => sum + f.calories, 0);
  const weeklySpend = loggedStreetFoods.reduce((sum, f) => sum + f.cost, 0);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">🍜 Street Food Mode</h1>
        <p className="text-orange-100">Your guide to healthier street food in Nepal &amp; India</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-orange-500 text-white"
                : "bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Explorer Tab */}
      {activeTab === "explorer" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1">
              {[
                { id: "all" as const, label: "All" },
                { id: "Nepal" as const, label: "🇳🇵 Nepal" },
                { id: "India" as const, label: "🇮🇳 India" },
                { id: "Both" as const, label: "Both" },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setOriginFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    originFilter === f.id ? "bg-orange-500 text-white" : "bg-white text-neutral-600 border border-neutral-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-1.5 rounded-lg text-xs border border-neutral-200 bg-white"
            >
              <option value="rating">Sort by Rating</option>
              <option value="calories">Sort by Calories</option>
              <option value="healthScore">Sort by Health Score</option>
            </select>
          </div>

          {/* Food Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredFoods.map(food => (
              <div
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 cursor-pointer hover:border-orange-200 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{food.icon}</span>
                    <div>
                      <h3 className="font-medium text-neutral-800">{food.name}</h3>
                      <p className="text-xs text-neutral-400">{food.nameNe}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    food.origin === "Nepal" ? "bg-red-50 text-red-600" :
                    food.origin === "India" ? "bg-orange-50 text-orange-600" :
                    "bg-purple-50 text-purple-600"
                  }`}>
                    {food.origin === "Nepal" ? "🇳🇵" : food.origin === "India" ? "🇮🇳" : "🌏"} {food.origin}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mb-3">{food.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 text-xs text-neutral-500">
                    <span>🔥 {food.calories} cal</span>
                    <span>⭐ {food.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-neutral-500">Health:</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 10 }, (_, i) => (
                        <div key={i} className={`w-1.5 h-3 rounded-full ${i < food.healthScore ? "bg-emerald-400" : "bg-neutral-200"}`}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Check Tab */}
      {activeTab === "healthcheck" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🛡️ Street Food Safety Guide</h2>
            <div className="space-y-3">
              {foodSafetyTips.map(tip => (
                <div key={tip.id} className={`p-4 rounded-xl ${
                  tip.severity === "important" ? "bg-red-50 border border-red-200" :
                  tip.severity === "moderate" ? "bg-amber-50 border border-amber-200" :
                  "bg-blue-50 border border-blue-200"
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{tip.icon}</span>
                    <h3 className="font-medium text-neutral-800">{tip.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      tip.severity === "important" ? "bg-red-100 text-red-600" :
                      tip.severity === "moderate" ? "bg-amber-100 text-amber-600" :
                      "bg-blue-100 text-blue-600"
                    }`}>
                      {tip.severity}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Red Flags */}
          <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
            <h2 className="text-lg font-semibold text-red-800 mb-3">🚩 Red Flags to Watch For</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { flag: "Dark, thick frying oil", icon: "🛢️" },
                { flag: "Flies around food", icon: "🪰" },
                { flag: "No handwashing facility", icon: "🚰" },
                { flag: "Food sitting out for hours", icon: "⏰" },
                { flag: "Vendor handling money and food", icon: "💰" },
                { flag: "Reusing plates without washing", icon: "🍽️" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm text-red-700">{item.flag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alternatives Tab */}
      {activeTab === "alternatives" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">♻️ Healthier Swaps</h2>
            <div className="space-y-3">
              {healthierAlternatives.map(alt => (
                <div key={alt.id} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <span className="text-2xl">{alt.originalIcon}</span>
                        <p className="text-xs text-red-500 font-medium mt-1">{alt.originalCalories} cal</p>
                      </div>
                      <div className="text-neutral-400">→</div>
                      <div className="text-center">
                        <span className="text-2xl">{alt.alternativeIcon}</span>
                        <p className="text-xs text-emerald-500 font-medium mt-1">{alt.alternativeCalories} cal</p>
                      </div>
                    </div>
                    <div className="bg-emerald-50 px-3 py-1.5 rounded-xl text-center">
                      <p className="text-lg font-bold text-emerald-600">-{alt.caloriesSaved}</p>
                      <p className="text-xs text-emerald-500">cal saved</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-red-500 line-through">{alt.original}</span>
                    <span className="text-emerald-600 font-medium">{alt.alternative}</span>
                  </div>
                  <p className="text-xs text-neutral-500 bg-neutral-50 p-2 rounded-lg">💡 {alt.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tracker Tab */}
      {activeTab === "tracker" && (
        <div className="space-y-6">
          {/* Weekly Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "This Week", value: `${loggedStreetFoods.length} items`, icon: "🍜", color: "text-orange-600" },
              { label: "Total Calories", value: weeklyCalories.toString(), icon: "🔥", color: "text-red-500" },
              { label: "Total Spent", value: `Rs. ${weeklySpend}`, icon: "💰", color: "text-emerald-600" },
              { label: "Avg Health Score", value: "5.8/10", icon: "📊", color: "text-blue-600" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
                <span className="text-2xl">{stat.icon}</span>
                <p className={`text-lg font-bold ${stat.color} mt-2`}>{stat.value}</p>
                <p className="text-xs text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Logs */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">📋 Recent Street Food Log</h2>
            <div className="space-y-2">
              {loggedStreetFoods.map(food => (
                <div key={food.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{food.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{food.name}</p>
                      <p className="text-xs text-neutral-500">{food.vendor} • {new Date(food.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">{food.calories} cal</p>
                    <p className="text-xs text-neutral-500">Rs. {food.cost}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Favorite Vendors */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">⭐ Favorite Vendors</h2>
            <div className="space-y-2">
              {[
                { name: "Momo Pasal, Thamel", visits: 12, rating: 4.5, specialty: "Steamed buff momo", hygiene: "Good" },
                { name: "Newari Kitchen, Patan", visits: 8, rating: 4.7, specialty: "Chatamari", hygiene: "Excellent" },
                { name: "Tibetan Kitchen, Boudha", visits: 6, rating: 4.6, specialty: "Thukpa", hygiene: "Good" },
              ].map((vendor, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{vendor.name}</p>
                    <p className="text-xs text-neutral-500">🍽️ {vendor.specialty} • {vendor.visits} visits</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">⭐ {vendor.rating}</p>
                    <p className={`text-xs ${vendor.hygiene === "Excellent" ? "text-emerald-500" : "text-amber-500"}`}>🧹 {vendor.hygiene}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Food Detail Modal */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{selectedFood.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-neutral-800">{selectedFood.name}</h3>
                <p className="text-sm text-neutral-400">{selectedFood.nameNe}</p>
              </div>
            </div>
            <p className="text-sm text-neutral-600 mb-4">{selectedFood.description}</p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-orange-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-orange-600">{selectedFood.calories}</p>
                <p className="text-xs text-neutral-500">Calories</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-blue-600">{selectedFood.protein}g</p>
                <p className="text-xs text-neutral-500">Protein</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-amber-600">{selectedFood.carbs}g</p>
                <p className="text-xs text-neutral-500">Carbs</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-red-500">{selectedFood.fat}g</p>
                <p className="text-xs text-neutral-500">Fat</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Health Score</span>
                <span className="font-medium">{selectedFood.healthScore}/10</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Price Range</span>
                <span className="font-medium">{selectedFood.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Found At</span>
                <span className="font-medium">{selectedFood.location}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600">Log This Food</button>
              <button onClick={() => setSelectedFood(null)} className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl text-sm text-neutral-600 hover:bg-neutral-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}