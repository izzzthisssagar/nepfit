"use client";

import { useState } from "react";

interface Child {
  id: string;
  name: string;
  avatar: string;
  birthDate: string;
  age: string;
  gender: "male" | "female";
  height: number;
  weight: number;
  allergies: string[];
  preferences: string[];
  dislikes: string[];
  growthPercentile: number;
  dailyCalorieGoal: number;
}

interface MealEntry {
  id: string;
  childId: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  foods: {
    name: string;
    portion: string;
    eaten: "all" | "most" | "some" | "none";
    liked: boolean;
  }[];
  notes: string;
}

interface GrowthRecord {
  id: string;
  childId: string;
  date: string;
  height: number;
  weight: number;
  notes: string;
}

interface LunchIdea {
  id: string;
  name: string;
  category: string;
  ingredients: string[];
  prepTime: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  kidFriendly: number;
  tags: string[];
}

const mockChildren: Child[] = [
  {
    id: "1",
    name: "Emma",
    avatar: "👧",
    birthDate: "2019-03-15",
    age: "6 years",
    gender: "female",
    height: 115,
    weight: 21,
    allergies: ["Peanuts"],
    preferences: ["Pasta", "Fruit", "Cheese"],
    dislikes: ["Broccoli", "Mushrooms"],
    growthPercentile: 65,
    dailyCalorieGoal: 1400,
  },
  {
    id: "2",
    name: "Lucas",
    avatar: "👦",
    birthDate: "2021-08-22",
    age: "4 years",
    gender: "male",
    height: 102,
    weight: 16,
    allergies: [],
    preferences: ["Chicken", "Rice", "Bananas"],
    dislikes: ["Spinach"],
    growthPercentile: 72,
    dailyCalorieGoal: 1200,
  },
];

const mockMeals: MealEntry[] = [
  {
    id: "1",
    childId: "1",
    date: "2026-02-07",
    mealType: "breakfast",
    foods: [
      { name: "Oatmeal with berries", portion: "1 bowl", eaten: "all", liked: true },
      { name: "Milk", portion: "1 cup", eaten: "most", liked: true },
    ],
    notes: "Good appetite this morning",
  },
  {
    id: "2",
    childId: "1",
    date: "2026-02-07",
    mealType: "lunch",
    foods: [
      { name: "Turkey sandwich", portion: "1 whole", eaten: "most", liked: true },
      { name: "Apple slices", portion: "1 apple", eaten: "all", liked: true },
      { name: "Carrot sticks", portion: "5 sticks", eaten: "some", liked: false },
    ],
    notes: "School lunch - ate most of it",
  },
  {
    id: "3",
    childId: "2",
    date: "2026-02-07",
    mealType: "breakfast",
    foods: [
      { name: "Banana pancakes", portion: "2 small", eaten: "all", liked: true },
      { name: "Orange juice", portion: "1/2 cup", eaten: "all", liked: true },
    ],
    notes: "Loved the pancakes!",
  },
];

const mockGrowth: GrowthRecord[] = [
  { id: "1", childId: "1", date: "2026-02-01", height: 115, weight: 21, notes: "Regular checkup" },
  { id: "2", childId: "1", date: "2025-11-01", height: 113, weight: 20.2, notes: "" },
  { id: "3", childId: "1", date: "2025-08-01", height: 111, weight: 19.5, notes: "" },
  { id: "4", childId: "2", date: "2026-02-01", height: 102, weight: 16, notes: "Growing well" },
  { id: "5", childId: "2", date: "2025-11-01", height: 100, weight: 15.3, notes: "" },
];

const lunchIdeas: LunchIdea[] = [
  {
    id: "1",
    name: "Rainbow Veggie Wraps",
    category: "Wraps",
    ingredients: ["Tortilla", "Hummus", "Shredded carrots", "Cucumber", "Bell peppers", "Cheese"],
    prepTime: 10,
    nutrition: { calories: 280, protein: 10, carbs: 35, fat: 12 },
    kidFriendly: 4,
    tags: ["Vegetarian", "Colorful", "No-cook"],
  },
  {
    id: "2",
    name: "Mini Pizza Bagels",
    category: "Pizza",
    ingredients: ["Mini bagels", "Pizza sauce", "Mozzarella", "Pepperoni"],
    prepTime: 15,
    nutrition: { calories: 320, protein: 14, carbs: 38, fat: 14 },
    kidFriendly: 5,
    tags: ["Hot lunch", "Customizable", "Fun"],
  },
  {
    id: "3",
    name: "Teddy Bear Bento",
    category: "Bento",
    ingredients: ["Rice", "Nori", "Chicken nuggets", "Edamame", "Cherry tomatoes", "Berries"],
    prepTime: 20,
    nutrition: { calories: 380, protein: 18, carbs: 45, fat: 15 },
    kidFriendly: 5,
    tags: ["Cute", "Balanced", "Instagram-worthy"],
  },
  {
    id: "4",
    name: "Mac & Cheese Muffins",
    category: "Pasta",
    ingredients: ["Macaroni", "Cheese sauce", "Broccoli bits", "Breadcrumbs"],
    prepTime: 25,
    nutrition: { calories: 290, protein: 12, carbs: 32, fat: 14 },
    kidFriendly: 5,
    tags: ["Finger food", "Hidden veggies", "Batch cook"],
  },
  {
    id: "5",
    name: "Fruit & Yogurt Parfait",
    category: "Light",
    ingredients: ["Greek yogurt", "Granola", "Mixed berries", "Honey"],
    prepTime: 5,
    nutrition: { calories: 220, protein: 12, carbs: 35, fat: 6 },
    kidFriendly: 4,
    tags: ["Sweet", "No-cook", "Protein-rich"],
  },
];

const pickyEaterTips = [
  {
    title: "The One-Bite Rule",
    description: "Ask them to try just one bite of new foods. No pressure to finish, just taste.",
    icon: "🍴",
  },
  {
    title: "Make It Fun",
    description: "Use cookie cutters for sandwiches, create food art, or let them help cook.",
    icon: "🎨",
  },
  {
    title: "Hide & Seek Veggies",
    description: "Blend veggies into smoothies, sauces, or baked goods for hidden nutrition.",
    icon: "🥬",
  },
  {
    title: "Dip Everything",
    description: "Kids love dipping! Offer hummus, yogurt, or cheese sauce with veggies.",
    icon: "🫕",
  },
  {
    title: "Choice Power",
    description: "Let them choose between two healthy options. Feeling in control helps.",
    icon: "✨",
  },
  {
    title: "No Food Fights",
    description: "Keep mealtimes positive. Pressure backfires - stay calm and patient.",
    icon: "💚",
  },
];

const agePortionGuides = [
  {
    ageRange: "2-3 years",
    grains: "3 oz",
    vegetables: "1 cup",
    fruits: "1 cup",
    protein: "2 oz",
    dairy: "2 cups",
    calories: "1000-1400",
  },
  {
    ageRange: "4-8 years",
    grains: "4-5 oz",
    vegetables: "1.5 cups",
    fruits: "1-1.5 cups",
    protein: "3-4 oz",
    dairy: "2.5 cups",
    calories: "1200-1800",
  },
  {
    ageRange: "9-13 years",
    grains: "5-6 oz",
    vegetables: "2-2.5 cups",
    fruits: "1.5 cups",
    protein: "4-5 oz",
    dairy: "3 cups",
    calories: "1600-2200",
  },
];

export default function KidsNutritionPage() {
  const [activeTab, setActiveTab] = useState<"profiles" | "meals" | "growth" | "lunch" | "tips">("profiles");
  const [selectedChild, setSelectedChild] = useState<Child | null>(mockChildren[0]);
  const [showAddChild, setShowAddChild] = useState(false);
  const [showLogMeal, setShowLogMeal] = useState(false);
  const [showGrowthModal, setShowGrowthModal] = useState(false);

  const getEatenColor = (eaten: string) => {
    switch (eaten) {
      case "all": return "bg-green-100 text-green-700";
      case "most": return "bg-blue-100 text-blue-700";
      case "some": return "bg-yellow-100 text-yellow-700";
      case "none": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const childMeals = mockMeals.filter(m => m.childId === selectedChild?.id);
  const childGrowth = mockGrowth.filter(g => g.childId === selectedChild?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            👶 Kids Nutrition
          </h1>
          <p className="text-gray-600 mt-1">Track growth, meals, and make nutrition fun for your little ones</p>
        </div>

        {/* Quick Stats */}
        {selectedChild && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
              <div className="text-3xl mb-2">{selectedChild.avatar}</div>
              <div className="text-lg font-semibold text-gray-800">{selectedChild.name}</div>
              <div className="text-sm text-gray-500">{selectedChild.age}</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100">
              <div className="text-2xl mb-2">📏</div>
              <div className="text-lg font-semibold text-gray-800">{selectedChild.height} cm</div>
              <div className="text-sm text-gray-500">{selectedChild.weight} kg</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100">
              <div className="text-2xl mb-2">📈</div>
              <div className="text-lg font-semibold text-gray-800">{selectedChild.growthPercentile}th</div>
              <div className="text-sm text-gray-500">Growth Percentile</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-lg font-semibold text-gray-800">{selectedChild.dailyCalorieGoal}</div>
              <div className="text-sm text-gray-500">Daily Calories</div>
            </div>
          </div>
        )}

        {/* Child Selector */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {mockChildren.map(child => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                selectedChild?.id === child.id
                  ? "bg-purple-500 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-purple-50"
              }`}
            >
              <span className="text-xl">{child.avatar}</span>
              <span className="font-medium">{child.name}</span>
            </button>
          ))}
          <button
            onClick={() => setShowAddChild(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-purple-600 hover:bg-purple-50 border-2 border-dashed border-purple-300"
          >
            <span>➕</span>
            <span className="font-medium">Add Child</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "profiles", label: "Profile", icon: "👤" },
            { id: "meals", label: "Meals", icon: "🍽️" },
            { id: "growth", label: "Growth", icon: "📊" },
            { id: "lunch", label: "Lunch Ideas", icon: "🥪" },
            { id: "tips", label: "Picky Eaters", icon: "💡" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-purple-500 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-purple-50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profiles" && selectedChild && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Child Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-6xl">{selectedChild.avatar}</div>
                  <div>
                    <div className="text-xl font-semibold">{selectedChild.name}</div>
                    <div className="text-gray-500">{selectedChild.age} • {selectedChild.gender === "male" ? "Boy" : "Girl"}</div>
                    <div className="text-sm text-gray-400">Born: {new Date(selectedChild.birthDate).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <div className="text-sm text-gray-500">Height</div>
                    <div className="text-lg font-semibold">{selectedChild.height} cm</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Weight</div>
                    <div className="text-lg font-semibold">{selectedChild.weight} kg</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {selectedChild.allergies.length > 0 && (
                <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
                  <h4 className="font-semibold text-red-700 flex items-center gap-2 mb-2">
                    ⚠️ Allergies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedChild.allergies.map(allergy => (
                      <span key={allergy} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                <h4 className="font-semibold text-green-700 flex items-center gap-2 mb-2">
                  💚 Favorites
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedChild.preferences.map(pref => (
                    <span key={pref} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {pref}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200">
                <h4 className="font-semibold text-orange-700 flex items-center gap-2 mb-2">
                  🚫 Dislikes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedChild.dislikes.map(dislike => (
                    <span key={dislike} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                      {dislike}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Age-Appropriate Portions */}
            <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📏 Age-Appropriate Daily Portions</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm border-b">
                      <th className="pb-3 pr-4">Age Range</th>
                      <th className="pb-3 pr-4">Grains</th>
                      <th className="pb-3 pr-4">Vegetables</th>
                      <th className="pb-3 pr-4">Fruits</th>
                      <th className="pb-3 pr-4">Protein</th>
                      <th className="pb-3 pr-4">Dairy</th>
                      <th className="pb-3">Calories</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {agePortionGuides.map((guide, idx) => (
                      <tr key={idx} className={`border-b ${guide.ageRange === "4-8 years" && selectedChild.name === "Emma" ? "bg-purple-50" : ""}`}>
                        <td className="py-3 pr-4 font-medium">{guide.ageRange}</td>
                        <td className="py-3 pr-4">{guide.grains}</td>
                        <td className="py-3 pr-4">{guide.vegetables}</td>
                        <td className="py-3 pr-4">{guide.fruits}</td>
                        <td className="py-3 pr-4">{guide.protein}</td>
                        <td className="py-3 pr-4">{guide.dairy}</td>
                        <td className="py-3">{guide.calories}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Meals Tab */}
        {activeTab === "meals" && selectedChild && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Today's Meals</h3>
              <button
                onClick={() => setShowLogMeal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
              >
                ➕ Log Meal
              </button>
            </div>

            {childMeals.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center">
                <div className="text-4xl mb-3">🍽️</div>
                <div className="text-gray-500">No meals logged today</div>
                <button
                  onClick={() => setShowLogMeal(true)}
                  className="mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors"
                >
                  Log First Meal
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {childMeals.map(meal => (
                  <div key={meal.id} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {meal.mealType === "breakfast" ? "🌅" : meal.mealType === "lunch" ? "☀️" : meal.mealType === "dinner" ? "🌙" : "🍎"}
                        </span>
                        <div>
                          <div className="font-semibold capitalize">{meal.mealType}</div>
                          <div className="text-sm text-gray-500">{new Date(meal.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {meal.foods.map((food, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div className="flex items-center gap-2">
                            <span>{food.liked ? "😋" : "😐"}</span>
                            <span className="font-medium">{food.name}</span>
                            <span className="text-sm text-gray-500">({food.portion})</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEatenColor(food.eaten)}`}>
                            {food.eaten === "all" ? "Ate all" : food.eaten === "most" ? "Ate most" : food.eaten === "some" ? "Ate some" : "Didn't eat"}
                          </span>
                        </div>
                      ))}
                    </div>
                    {meal.notes && (
                      <div className="mt-3 pt-3 border-t text-sm text-gray-500 italic">
                        📝 {meal.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Nutrition Summary */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <h4 className="font-semibold mb-4">Today's Nutrition Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold">850</div>
                  <div className="text-sm opacity-80">Calories</div>
                  <div className="text-xs opacity-60">{selectedChild.dailyCalorieGoal} goal</div>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold">32g</div>
                  <div className="text-sm opacity-80">Protein</div>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold">2</div>
                  <div className="text-sm opacity-80">Fruit Servings</div>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold">1</div>
                  <div className="text-sm opacity-80">Veggie Servings</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Growth Tab */}
        {activeTab === "growth" && selectedChild && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Growth Tracking</h3>
              <button
                onClick={() => setShowGrowthModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
              >
                ➕ Log Measurement
              </button>
            </div>

            {/* Growth Chart Placeholder */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">Growth Chart</h4>
              <div className="h-64 bg-gradient-to-t from-purple-50 to-white rounded-xl flex items-end justify-around p-4 relative">
                <div className="absolute top-2 right-2 flex gap-4 text-sm">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-500 rounded-full"></span> Height</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-pink-500 rounded-full"></span> Weight</span>
                </div>
                {childGrowth.slice().reverse().map((record, idx) => (
                  <div key={record.id} className="flex flex-col items-center gap-2">
                    <div className="flex gap-1 items-end">
                      <div
                        className="w-6 bg-purple-500 rounded-t"
                        style={{ height: `${(record.height - 95) * 4}px` }}
                        title={`${record.height} cm`}
                      ></div>
                      <div
                        className="w-6 bg-pink-500 rounded-t"
                        style={{ height: `${record.weight * 8}px` }}
                        title={`${record.weight} kg`}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(record.date).toLocaleDateString("en-US", { month: "short" })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Records */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">Measurement History</h4>
              <div className="space-y-3">
                {childGrowth.map((record, idx) => (
                  <div key={record.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">📏</div>
                      <div>
                        <div className="font-medium">{new Date(record.date).toLocaleDateString()}</div>
                        {record.notes && <div className="text-sm text-gray-500">{record.notes}</div>}
                      </div>
                    </div>
                    <div className="flex gap-6 text-right">
                      <div>
                        <div className="font-semibold text-purple-600">{record.height} cm</div>
                        {idx < childGrowth.length - 1 && (
                          <div className="text-xs text-green-600">
                            +{(record.height - childGrowth[idx + 1].height).toFixed(1)} cm
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-pink-600">{record.weight} kg</div>
                        {idx < childGrowth.length - 1 && (
                          <div className="text-xs text-green-600">
                            +{(record.weight - childGrowth[idx + 1].weight).toFixed(1)} kg
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Percentile */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
              <h4 className="font-semibold mb-2">Growth Percentile</h4>
              <div className="text-4xl font-bold mb-2">{selectedChild.growthPercentile}th</div>
              <p className="text-sm opacity-80">
                {selectedChild.name} is taller than {selectedChild.growthPercentile}% of children the same age and gender.
              </p>
              <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${selectedChild.growthPercentile}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Lunch Ideas Tab */}
        {activeTab === "lunch" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">School Lunch Ideas</h3>
              <select className="px-4 py-2 border rounded-xl bg-white">
                <option>All Categories</option>
                <option>Wraps</option>
                <option>Bento</option>
                <option>Pasta</option>
                <option>Light</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lunchIdeas.map(idea => (
                <div key={idea.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">{idea.name}</h4>
                      <div className="text-sm text-gray-500">{idea.category}</div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < idea.kidFriendly ? "text-yellow-400" : "text-gray-200"}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {idea.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Ingredients:</span> {idea.ingredients.slice(0, 3).join(", ")}
                    {idea.ingredients.length > 3 && ` +${idea.ingredients.length - 3} more`}
                  </div>
                  <div className="flex justify-between text-sm border-t pt-3">
                    <span className="text-gray-500">⏱️ {idea.prepTime} min</span>
                    <span className="text-gray-500">🔥 {idea.nutrition.calories} cal</span>
                  </div>
                  <button className="w-full mt-3 py-2 bg-purple-100 text-purple-700 rounded-xl font-medium hover:bg-purple-200 transition-colors">
                    View Recipe
                  </button>
                </div>
              ))}
            </div>

            {/* Weekly Planner */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">📅 Weekly Lunch Planner</h4>
              <div className="grid grid-cols-5 gap-3">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, idx) => (
                  <div key={day} className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-2">{day}</div>
                    <div className="bg-gray-50 rounded-xl p-3 min-h-[100px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-purple-300 cursor-pointer transition-colors">
                      {idx < 3 ? (
                        <div className="text-sm font-medium text-gray-700">{lunchIdeas[idx].name}</div>
                      ) : (
                        <span className="text-gray-400 text-2xl">+</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Picky Eaters Tab */}
        {activeTab === "tips" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 text-white mb-6">
              <h3 className="text-xl font-bold mb-2">🌟 Picky Eater? You're Not Alone!</h3>
              <p className="opacity-90">
                Up to 50% of toddlers and preschoolers are described as "picky eaters."
                It's a normal developmental phase. Here are proven strategies to help.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pickyEaterTips.map((tip, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-3">{tip.icon}</div>
                  <h4 className="font-semibold text-gray-800 mb-2">{tip.title}</h4>
                  <p className="text-gray-600 text-sm">{tip.description}</p>
                </div>
              ))}
            </div>

            {/* Food Introduction Tracker */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">🥦 Food Introduction Tracker</h4>
              <p className="text-gray-600 text-sm mb-4">
                Track how many times you've offered new foods. Research shows it can take 10-15 exposures before a child accepts a new food!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { food: "Broccoli", tries: 7, accepted: false },
                  { food: "Spinach", tries: 4, accepted: false },
                  { food: "Bell Peppers", tries: 12, accepted: true },
                  { food: "Mushrooms", tries: 3, accepted: false },
                ].map((item, idx) => (
                  <div key={idx} className={`rounded-xl p-4 ${item.accepted ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"} border`}>
                    <div className="font-medium">{item.food}</div>
                    <div className="text-sm text-gray-500">{item.tries} tries</div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.accepted ? "bg-green-500" : "bg-purple-500"}`}
                        style={{ width: `${Math.min((item.tries / 15) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {item.accepted ? "✅ Accepted!" : `${15 - item.tries} more to go`}
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-medium hover:bg-purple-200 transition-colors">
                + Track New Food
              </button>
            </div>

            {/* Success Stories */}
            <div className="bg-purple-50 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-800 mb-4">🎉 Success Stories</h4>
              <div className="space-y-3">
                {[
                  { text: "Emma finally tried green beans after the 11th offer!", date: "2 days ago", emoji: "🎊" },
                  { text: "Lucas ate a whole serving of sweet potato!", date: "1 week ago", emoji: "🍠" },
                ].map((story, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl">{story.emoji}</span>
                    <div>
                      <div className="font-medium">{story.text}</div>
                      <div className="text-sm text-gray-500">{story.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Child Modal */}
        {showAddChild && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add Child</h3>
                <button onClick={() => setShowAddChild(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-xl" placeholder="Child's name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                  <input type="date" className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select className="w-full px-4 py-2 border rounded-xl">
                    <option value="female">Girl</option>
                    <option value="male">Boy</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-xl" placeholder="100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-xl" placeholder="15" />
                  </div>
                </div>
                <button className="w-full py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600">
                  Add Child
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Log Meal Modal */}
        {showLogMeal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Log Meal for {selectedChild?.name}</h3>
                <button onClick={() => setShowLogMeal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                  <select className="w-full px-4 py-2 border rounded-xl">
                    <option value="breakfast">🌅 Breakfast</option>
                    <option value="lunch">☀️ Lunch</option>
                    <option value="dinner">🌙 Dinner</option>
                    <option value="snack">🍎 Snack</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Food Items</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input type="text" className="flex-1 px-4 py-2 border rounded-xl" placeholder="Food name" />
                      <select className="px-3 py-2 border rounded-xl">
                        <option>All</option>
                        <option>Most</option>
                        <option>Some</option>
                        <option>None</option>
                      </select>
                    </div>
                  </div>
                  <button className="mt-2 text-purple-600 text-sm font-medium">+ Add another food</button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea className="w-full px-4 py-2 border rounded-xl" rows={2} placeholder="How did it go?"></textarea>
                </div>
                <button className="w-full py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600">
                  Save Meal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Growth Modal */}
        {showGrowthModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Log Measurement for {selectedChild?.name}</h3>
                <button onClick={() => setShowGrowthModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" className="w-full px-4 py-2 border rounded-xl" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-xl" placeholder={selectedChild?.height.toString()} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input type="number" step="0.1" className="w-full px-4 py-2 border rounded-xl" placeholder={selectedChild?.weight.toString()} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-xl" placeholder="e.g., Doctor's visit" />
                </div>
                <button className="w-full py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600">
                  Save Measurement
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
