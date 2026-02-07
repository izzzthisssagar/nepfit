"use client";

import { useState } from "react";

interface PrepItem {
  id: string;
  name: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  storage: string;
  reheating: string;
  icon: string;
}

interface PrepStep {
  id: string;
  time: string;
  task: string;
  parallel?: string;
  duration: number;
  category: "cook" | "prep" | "store";
}

interface DayPlan {
  day: string;
  meals: { type: string; items: string[]; prepped: boolean }[];
}

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
  usedIn: string[];
}

const batchCookItems: PrepItem[] = [
  { id: "1", name: "Dal (Masoor/Moong)", servings: 4, prepTime: 10, cookTime: 25, storage: "Fridge 3 days, Freezer 1 month", reheating: "Microwave 2 min or stovetop with splash of water", icon: "🍲" },
  { id: "2", name: "Steamed Rice", servings: 4, prepTime: 5, cookTime: 20, storage: "Fridge 3 days, Freezer 2 months", reheating: "Microwave with damp paper towel, 1.5 min", icon: "🍚" },
  { id: "3", name: "Mixed Sabzi (Seasonal)", servings: 4, prepTime: 15, cookTime: 20, storage: "Fridge 3 days only", reheating: "Stovetop 3-4 min on medium heat", icon: "🥘" },
  { id: "4", name: "Boiled Eggs", servings: 6, prepTime: 2, cookTime: 12, storage: "Fridge 5 days (peeled or unpeeled)", reheating: "Eat cold or warm in microwave 20 sec", icon: "🥚" },
];

const prepOnlyItems = [
  { name: "Cut Onions (3 days worth)", quantity: "4 medium", storage: "Airtight container, fridge 3 days", icon: "🧅" },
  { name: "Chop Salad Veggies", quantity: "Cucumber, tomato, carrot", storage: "Separate containers, fridge 2 days", icon: "🥗" },
  { name: "Marinate Chicken", quantity: "500g with spices & yogurt", storage: "Fridge 2 days, cook within 48 hrs", icon: "🍗" },
  { name: "Wash & Dry Greens", quantity: "1 bunch saag/palak", storage: "Paper towel lined container, 4 days", icon: "🥬" },
  { name: "Grate Ginger-Garlic Paste", quantity: "1 cup batch", storage: "Ice cube tray, freeze 1 month", icon: "🧄" },
];

const sundayPrepSteps: PrepStep[] = [
  { id: "1", time: "0:00", task: "Soak dal, wash rice, boil water for eggs", duration: 5, category: "prep" },
  { id: "2", time: "0:05", task: "Start boiling eggs", parallel: "Chop onions, garlic, ginger for the week", duration: 15, category: "cook" },
  { id: "3", time: "0:20", task: "Start cooking dal with tempering", parallel: "Start rice in rice cooker", duration: 5, category: "cook" },
  { id: "4", time: "0:25", task: "Remove eggs, cool in ice bath", parallel: "Chop vegetables for sabzi", duration: 15, category: "prep" },
  { id: "5", time: "0:40", task: "Start cooking mixed sabzi", parallel: "Chop salad veggies for the week", duration: 20, category: "cook" },
  { id: "6", time: "1:00", task: "Marinate chicken for next 2 days", parallel: "Check dal, stir and adjust water", duration: 10, category: "prep" },
  { id: "7", time: "1:10", task: "Make ginger-garlic paste batch", parallel: "Wash and dry greens", duration: 15, category: "prep" },
  { id: "8", time: "1:25", task: "Turn off sabzi, let dal simmer", parallel: "Peel eggs if desired", duration: 10, category: "cook" },
  { id: "9", time: "1:35", task: "Portion everything into containers", parallel: "Label with dates", duration: 15, category: "store" },
  { id: "10", time: "1:50", task: "Clean up kitchen, store everything", duration: 10, category: "store" },
];

const weekPlan: DayPlan[] = [
  { day: "Monday", meals: [
    { type: "Lunch", items: ["Dal + Rice + Sabzi"], prepped: true },
    { type: "Dinner", items: ["Marinated Chicken + Rice + Salad"], prepped: true },
    { type: "Snack", items: ["Boiled Egg + Fruit"], prepped: true },
  ]},
  { day: "Tuesday", meals: [
    { type: "Lunch", items: ["Dal + Rice + Boiled Egg"], prepped: true },
    { type: "Dinner", items: ["Sabzi + Roti (fresh) + Salad"], prepped: true },
    { type: "Snack", items: ["Yogurt + Fruit"], prepped: false },
  ]},
  { day: "Wednesday", meals: [
    { type: "Lunch", items: ["Dal + Rice + Sabzi (last day)"], prepped: true },
    { type: "Dinner", items: ["Chicken + Rice + Greens"], prepped: true },
    { type: "Snack", items: ["Boiled Eggs (2)"], prepped: true },
  ]},
  { day: "Thursday", meals: [
    { type: "Lunch", items: ["Fresh cook or leftover remix"], prepped: false },
    { type: "Dinner", items: ["Quick dal fry + Rice"], prepped: false },
    { type: "Snack", items: ["Boiled Egg + Nuts"], prepped: true },
  ]},
  { day: "Friday", meals: [
    { type: "Lunch", items: ["Egg fried rice (use prepped rice)"], prepped: true },
    { type: "Dinner", items: ["Fresh cook or eat out"], prepped: false },
    { type: "Snack", items: ["Fruit + Yogurt"], prepped: false },
  ]},
];

const shoppingList: ShoppingItem[] = [
  { id: "1", name: "Masoor Dal", quantity: "500g", category: "Lentils & Grains", checked: false, usedIn: ["Dal"] },
  { id: "2", name: "Basmati Rice", quantity: "1 kg", category: "Lentils & Grains", checked: false, usedIn: ["Rice"] },
  { id: "3", name: "Eggs", quantity: "12 pcs", category: "Protein", checked: false, usedIn: ["Boiled Eggs", "Egg Fried Rice"] },
  { id: "4", name: "Chicken Breast", quantity: "500g", category: "Protein", checked: false, usedIn: ["Marinated Chicken"] },
  { id: "5", name: "Yogurt", quantity: "500g", category: "Dairy", checked: false, usedIn: ["Marinade", "Snack"] },
  { id: "6", name: "Onions", quantity: "1 kg", category: "Vegetables", checked: false, usedIn: ["Dal", "Sabzi", "Chicken"] },
  { id: "7", name: "Tomatoes", quantity: "500g", category: "Vegetables", checked: false, usedIn: ["Dal", "Sabzi", "Salad"] },
  { id: "8", name: "Mixed Vegetables (Seasonal)", quantity: "750g", category: "Vegetables", checked: false, usedIn: ["Sabzi"] },
  { id: "9", name: "Cucumber", quantity: "2 pcs", category: "Vegetables", checked: false, usedIn: ["Salad"] },
  { id: "10", name: "Carrot", quantity: "3 pcs", category: "Vegetables", checked: false, usedIn: ["Salad", "Sabzi"] },
  { id: "11", name: "Ginger", quantity: "100g", category: "Spices", checked: false, usedIn: ["Paste", "Dal", "Chicken"] },
  { id: "12", name: "Garlic", quantity: "1 head", category: "Spices", checked: false, usedIn: ["Paste", "Dal", "Sabzi"] },
  { id: "13", name: "Saag/Palak", quantity: "1 bunch", category: "Vegetables", checked: false, usedIn: ["Greens side"] },
  { id: "14", name: "Cooking Oil", quantity: "500ml", category: "Pantry", checked: false, usedIn: ["All cooking"] },
  { id: "15", name: "Turmeric, Cumin, Chili", quantity: "Check stock", category: "Spices", checked: false, usedIn: ["All dishes"] },
];

const ingredientOverlap = [
  { ingredient: "Onions", usedIn: ["Dal", "Sabzi", "Chicken Marinade", "Egg Fried Rice"], savings: "Buy 1kg instead of separate purchases" },
  { ingredient: "Tomatoes", usedIn: ["Dal", "Sabzi", "Salad"], savings: "Buy 500g, use across 3 recipes" },
  { ingredient: "Ginger-Garlic", usedIn: ["Dal", "Sabzi", "Chicken", "Fried Rice"], savings: "Make paste once, use all week" },
  { ingredient: "Rice", usedIn: ["Lunch meals", "Dinner sides", "Egg Fried Rice"], savings: "Cook once, portion for 4+ meals" },
  { ingredient: "Yogurt", usedIn: ["Chicken Marinade", "Raita", "Snack"], savings: "1 tub serves 3 purposes" },
];

export default function MealPrepPage() {
  const [activeTab, setActiveTab] = useState<"plans" | "prep" | "batch" | "shopping">("plans");
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("Monday");

  const toggleShoppingItem = (id: string) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const totalPrepTime = batchCookItems.reduce((sum, item) => sum + item.prepTime + item.cookTime, 0);
  const dailyCookTime = 45;
  const weeklyTimeSaved = (dailyCookTime * 5) - 120;
  const totalCost = 485;
  const costPerMeal = Math.round(totalCost / 15);

  const checkedCount = checkedItems.length;
  const totalItems = shoppingList.length;

  const groupedShopping = shoppingList.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Meal Prep Assistant</h1>
          <p className="text-neutral-500 mt-1">Cook once, eat healthy all week</p>
        </div>

        {/* Time Saved Banner */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-primary-100 text-sm">This Week's Prep</p>
              <h2 className="text-2xl font-bold">Sunday Batch Cook</h2>
              <p className="text-primary-100 mt-1">2 hours prep = 5 days of meals ready</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/20 rounded-xl p-3">
                <p className="text-2xl font-bold">{weeklyTimeSaved}</p>
                <p className="text-xs text-primary-100">min saved</p>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <p className="text-2xl font-bold">15</p>
                <p className="text-xs text-primary-100">meals ready</p>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <p className="text-2xl font-bold">Rs.{costPerMeal}</p>
                <p className="text-xs text-primary-100">per meal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "plans", label: "Plans", icon: "📋" },
            { id: "prep", label: "Prep Guide", icon: "👨‍🍳" },
            { id: "batch", label: "Batch Cook", icon: "🍳" },
            { id: "shopping", label: "Shopping", icon: "🛒" },
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

        {/* Plans Tab */}
        {activeTab === "plans" && (
          <div className="space-y-6">
            {/* Week View */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Weekly Meal Plan</h3>
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {weekPlan.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      selectedDay === day.day
                        ? "bg-primary-500 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {day.day}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {weekPlan
                  .find((d) => d.day === selectedDay)
                  ?.meals.map((meal, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border ${
                        meal.prepped
                          ? "bg-green-50 border-green-200"
                          : "bg-neutral-50 border-neutral-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-neutral-500">{meal.type}</span>
                          <p className="font-medium text-neutral-900">{meal.items.join(", ")}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            meal.prepped
                              ? "bg-green-100 text-green-700"
                              : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {meal.prepped ? "Prepped" : "Fresh Cook"}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Time Saved Calculator */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Time Saved Calculator</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-neutral-500">Daily Cooking</p>
                  <p className="text-2xl font-bold text-red-600">225 min</p>
                  <p className="text-xs text-neutral-400">45 min x 5 days</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-neutral-500">Batch Prep</p>
                  <p className="text-2xl font-bold text-green-600">120 min</p>
                  <p className="text-xs text-neutral-400">One Sunday session</p>
                </div>
                <div className="bg-primary-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-neutral-500">Time Saved</p>
                  <p className="text-2xl font-bold text-primary-600">{weeklyTimeSaved} min</p>
                  <p className="text-xs text-neutral-400">per week</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-neutral-500">Monthly Savings</p>
                  <p className="text-2xl font-bold text-amber-600">{weeklyTimeSaved * 4} min</p>
                  <p className="text-xs text-neutral-400">{Math.round((weeklyTimeSaved * 4) / 60)} hours!</p>
                </div>
              </div>
            </div>

            {/* Cost Per Meal */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Cost Breakdown</h3>
              <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl mb-4">
                <div>
                  <p className="text-neutral-600">Total Ingredients Cost</p>
                  <p className="text-3xl font-bold text-primary-600">Rs. {totalCost}</p>
                </div>
                <div className="text-right">
                  <p className="text-neutral-600">Per Meal Cost</p>
                  <p className="text-2xl font-bold text-neutral-900">Rs. {costPerMeal}</p>
                  <p className="text-xs text-green-600">60% cheaper than eating out</p>
                </div>
              </div>
            </div>

            {/* Ingredient Overlap */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Ingredient Overlap Optimizer</h3>
              <p className="text-sm text-neutral-500 mb-4">These ingredients are shared across recipes, reducing waste</p>
              <div className="space-y-3">
                {ingredientOverlap.map((item, idx) => (
                  <div key={idx} className="p-4 bg-neutral-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-neutral-900">{item.ingredient}</h4>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {item.usedIn.length} recipes
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.usedIn.map((recipe, rIdx) => (
                        <span key={rIdx} className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                          {recipe}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-neutral-400">{item.savings}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Prep Guide Tab */}
        {activeTab === "prep" && (
          <div className="space-y-6">
            {/* Sunday Prep Session */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-neutral-900">Sunday Prep Session</h3>
                  <p className="text-sm text-neutral-500">Total time: ~2 hours</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-primary-600">
                    {completedSteps.length}/{sundayPrepSteps.length} steps done
                  </span>
                  <div className="h-2 w-32 bg-neutral-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full transition-all"
                      style={{ width: `${(completedSteps.length / sundayPrepSteps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {sundayPrepSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      completedSteps.includes(step.id)
                        ? "bg-green-50 border-green-200"
                        : "bg-neutral-50 border-neutral-200 hover:border-primary-300"
                    }`}
                    onClick={() => toggleStep(step.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          completedSteps.includes(step.id)
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-neutral-300"
                        }`}
                      >
                        {completedSteps.includes(step.id) && "✓"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded">
                            {step.time}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            step.category === "cook" ? "bg-orange-100 text-orange-700" :
                            step.category === "prep" ? "bg-blue-100 text-blue-700" :
                            "bg-purple-100 text-purple-700"
                          }`}>
                            {step.category}
                          </span>
                          <span className="text-xs text-neutral-400">{step.duration} min</span>
                        </div>
                        <p className={`font-medium ${completedSteps.includes(step.id) ? "text-neutral-400 line-through" : "text-neutral-900"}`}>
                          {step.task}
                        </p>
                        {step.parallel && (
                          <p className="text-sm text-primary-600 mt-1">
                            Parallel: {step.parallel}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What to Prep (Not Cook) */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Prep-Only Items</h3>
              <p className="text-sm text-neutral-500 mb-4">These items just need cutting, washing, or marinating</p>
              <div className="space-y-3">
                {prepOnlyItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900">{item.name}</h4>
                      <p className="text-sm text-neutral-500">{item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-400">{item.storage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Batch Cook Tab */}
        {activeTab === "batch" && (
          <div className="space-y-6">
            {/* Cook Once Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
              <h3 className="font-semibold text-lg mb-2">Cook Once, Eat 3 Days</h3>
              <p className="text-primary-100 text-sm">
                Total prep + cook time: ~{totalPrepTime} min for {batchCookItems.reduce((s, i) => s + i.servings, 0)} servings
              </p>
            </div>

            {/* Batch Items */}
            <div className="space-y-4">
              {batchCookItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-neutral-900">{item.name}</h4>
                        <span className="text-sm bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                          {item.servings} servings
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="text-sm">
                          <span className="text-neutral-500">Prep: </span>
                          <span className="text-neutral-900 font-medium">{item.prepTime} min</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-neutral-500">Cook: </span>
                          <span className="text-neutral-900 font-medium">{item.cookTime} min</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs font-medium text-blue-700 mb-1">Storage</p>
                          <p className="text-sm text-neutral-700">{item.storage}</p>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-lg">
                          <p className="text-xs font-medium text-amber-700 mb-1">Reheating</p>
                          <p className="text-sm text-neutral-700">{item.reheating}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Storage Tips */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">General Storage Tips</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Cool Before Storing", desc: "Let food cool to room temp before refrigerating to prevent bacterial growth", icon: "❄️" },
                  { title: "Airtight Containers", desc: "Use glass containers with snap lids for best freshness and easy reheating", icon: "📦" },
                  { title: "Label Everything", desc: "Write the date and contents on each container for easy tracking", icon: "🏷️" },
                  { title: "Freeze Portions", desc: "Freeze extra portions flat in bags for quick thawing and space saving", icon: "🧊" },
                ].map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl">
                    <span className="text-xl">{tip.icon}</span>
                    <div>
                      <h4 className="font-medium text-neutral-900">{tip.title}</h4>
                      <p className="text-sm text-neutral-500">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Shopping Tab */}
        {activeTab === "shopping" && (
          <div className="space-y-6">
            {/* Shopping Progress */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-neutral-900">Shopping List</h3>
                  <p className="text-sm text-neutral-500">Auto-generated from your prep plan</p>
                </div>
                <span className="text-sm font-medium text-primary-600">
                  {checkedCount}/{totalItems} items
                </span>
              </div>
              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all"
                  style={{ width: `${(checkedCount / totalItems) * 100}%` }}
                />
              </div>
            </div>

            {/* Grouped Shopping List */}
            {Object.entries(groupedShopping).map(([category, items]) => (
              <div key={category} className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
                <h4 className="font-semibold text-neutral-900 mb-3">{category}</h4>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleShoppingItem(item.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        checkedItems.includes(item.id)
                          ? "bg-green-50"
                          : "bg-neutral-50 hover:bg-neutral-100"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          checkedItems.includes(item.id)
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-neutral-300"
                        }`}
                      >
                        {checkedItems.includes(item.id) && "✓"}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${checkedItems.includes(item.id) ? "text-neutral-400 line-through" : "text-neutral-900"}`}>
                          {item.name}
                        </p>
                        <p className="text-xs text-neutral-400">
                          Used in: {item.usedIn.join(", ")}
                        </p>
                      </div>
                      <span className="text-sm text-neutral-500">{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Estimated Total */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold mb-1">Estimated Total</h4>
                  <p className="text-sm text-primary-100">For the entire week of batch cooking</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">Rs. {totalCost}</p>
                  <p className="text-sm text-primary-100">Rs. {costPerMeal}/meal avg</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
