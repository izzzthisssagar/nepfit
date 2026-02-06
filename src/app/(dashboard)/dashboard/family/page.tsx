"use client";

import { useState } from "react";

type FamilyRole = "admin" | "parent" | "child" | "member";
type AgeGroup = "child" | "teen" | "adult" | "senior";

interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  role: FamilyRole;
  ageGroup: AgeGroup;
  age: number;
  calorieGoal: number;
  todayCalories: number;
  dietaryRestrictions: string[];
  isActive: boolean;
}

interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  addedBy: string;
  purchased: boolean;
  price?: number;
}

interface SharedMealPlan {
  id: string;
  date: string;
  breakfast: { name: string; servings: number };
  lunch: { name: string; servings: number };
  dinner: { name: string; servings: number };
  snacks: { name: string; servings: number }[];
}

const mockFamilyMembers: FamilyMember[] = [
  {
    id: "1",
    name: "Raj Sharma",
    avatar: "👨",
    role: "admin",
    ageGroup: "adult",
    age: 38,
    calorieGoal: 2200,
    todayCalories: 1450,
    dietaryRestrictions: [],
    isActive: true,
  },
  {
    id: "2",
    name: "Priya Sharma",
    avatar: "👩",
    role: "parent",
    ageGroup: "adult",
    age: 35,
    calorieGoal: 1800,
    todayCalories: 1200,
    dietaryRestrictions: ["vegetarian"],
    isActive: true,
  },
  {
    id: "3",
    name: "Arjun Sharma",
    avatar: "👦",
    role: "child",
    ageGroup: "teen",
    age: 14,
    calorieGoal: 2400,
    todayCalories: 1800,
    dietaryRestrictions: [],
    isActive: true,
  },
  {
    id: "4",
    name: "Ananya Sharma",
    avatar: "👧",
    role: "child",
    ageGroup: "child",
    age: 8,
    calorieGoal: 1600,
    todayCalories: 900,
    dietaryRestrictions: ["nut_allergy"],
    isActive: false,
  },
  {
    id: "5",
    name: "Dadi (Grandmother)",
    avatar: "👵",
    role: "member",
    ageGroup: "senior",
    age: 68,
    calorieGoal: 1600,
    todayCalories: 1100,
    dietaryRestrictions: ["diabetic", "low_sodium"],
    isActive: true,
  },
];

const mockGroceryList: GroceryItem[] = [
  { id: "g1", name: "Rice (Basmati)", quantity: 5, unit: "kg", category: "Grains", addedBy: "Priya", purchased: false, price: 450 },
  { id: "g2", name: "Dal (Masoor)", quantity: 1, unit: "kg", category: "Pulses", addedBy: "Priya", purchased: false, price: 180 },
  { id: "g3", name: "Milk", quantity: 4, unit: "liters", category: "Dairy", addedBy: "Raj", purchased: true, price: 240 },
  { id: "g4", name: "Eggs", quantity: 30, unit: "pcs", category: "Protein", addedBy: "Raj", purchased: false, price: 300 },
  { id: "g5", name: "Chicken", quantity: 1, unit: "kg", category: "Protein", addedBy: "Arjun", purchased: false, price: 350 },
  { id: "g6", name: "Spinach", quantity: 500, unit: "g", category: "Vegetables", addedBy: "Dadi", purchased: true, price: 40 },
  { id: "g7", name: "Tomatoes", quantity: 1, unit: "kg", category: "Vegetables", addedBy: "Priya", purchased: false, price: 60 },
  { id: "g8", name: "Onions", quantity: 2, unit: "kg", category: "Vegetables", addedBy: "Priya", purchased: false, price: 80 },
  { id: "g9", name: "Yogurt", quantity: 1, unit: "kg", category: "Dairy", addedBy: "Dadi", purchased: false, price: 90 },
  { id: "g10", name: "Fruits (Mixed)", quantity: 2, unit: "kg", category: "Fruits", addedBy: "Ananya", purchased: false, price: 200 },
];

const mockMealPlans: SharedMealPlan[] = [
  {
    id: "mp1",
    date: "2026-02-07",
    breakfast: { name: "Poha with Tea", servings: 5 },
    lunch: { name: "Dal Bhat with Vegetables", servings: 5 },
    dinner: { name: "Roti with Paneer Curry", servings: 5 },
    snacks: [{ name: "Fruits", servings: 5 }, { name: "Biscuits", servings: 3 }],
  },
  {
    id: "mp2",
    date: "2026-02-08",
    breakfast: { name: "Paratha with Curd", servings: 5 },
    lunch: { name: "Rice with Chicken Curry", servings: 4 },
    dinner: { name: "Khichdi", servings: 5 },
    snacks: [{ name: "Samosa", servings: 3 }],
  },
];

export default function FamilyPage() {
  const [activeTab, setActiveTab] = useState<"members" | "grocery" | "meals" | "nutrition">("members");
  const [familyMembers, setFamilyMembers] = useState(mockFamilyMembers);
  const [groceryList, setGroceryList] = useState(mockGroceryList);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddGroceryModal, setShowAddGroceryModal] = useState(false);
  const [newGroceryItem, setNewGroceryItem] = useState({ name: "", quantity: 1, unit: "kg", category: "Vegetables" });

  const toggleGroceryPurchased = (id: string) => {
    setGroceryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, purchased: !item.purchased } : item))
    );
  };

  const familyTotalCalories = familyMembers.reduce((sum, m) => sum + m.todayCalories, 0);
  const familyCalorieGoal = familyMembers.reduce((sum, m) => sum + m.calorieGoal, 0);
  const groceryTotal = groceryList.reduce((sum, item) => sum + (item.price || 0), 0);
  const groceryRemaining = groceryList.filter((item) => !item.purchased).reduce((sum, item) => sum + (item.price || 0), 0);

  const getRoleColor = (role: FamilyRole) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      case "parent":
        return "bg-blue-100 text-blue-700";
      case "child":
        return "bg-green-100 text-green-700";
      case "member":
        return "bg-neutral-100 text-neutral-700";
    }
  };

  const getAgeGroupIcon = (ageGroup: AgeGroup) => {
    switch (ageGroup) {
      case "child":
        return "🧒";
      case "teen":
        return "🧑";
      case "adult":
        return "👨";
      case "senior":
        return "👴";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Family & Household</h1>
          <p className="text-neutral-600">
            Manage nutrition for your whole family
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddMemberModal(true)}
            className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
          >
            👨‍👩‍👧‍👦 Add Member
          </button>
        </div>
      </div>

      {/* Family Summary */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">👨‍👩‍👧‍👦 Sharma Family</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold">{familyMembers.length}</p>
            <p className="text-sm text-white/80">Members</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold">{familyTotalCalories.toLocaleString()}</p>
            <p className="text-sm text-white/80">Today&apos;s Calories</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold">{Math.round((familyTotalCalories / familyCalorieGoal) * 100)}%</p>
            <p className="text-sm text-white/80">Goal Progress</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold">Rs. {groceryRemaining}</p>
            <p className="text-sm text-white/80">Grocery Pending</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 overflow-x-auto">
        {[
          { id: "members", label: "Members", icon: "👥" },
          { id: "grocery", label: "Grocery List", icon: "🛒" },
          { id: "meals", label: "Meal Planning", icon: "🍽️" },
          { id: "nutrition", label: "Family Nutrition", icon: "📊" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "text-primary-600 border-b-2 border-primary-500"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Members Tab */}
      {activeTab === "members" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {familyMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-3xl">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-neutral-900">{member.name}</h3>
                    {member.isActive && (
                      <span className="w-2 h-2 bg-green-500 rounded-full" title="Active now" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                    <span className="text-xs text-neutral-500">{member.age} years</span>
                  </div>
                </div>
              </div>

              {/* Today's Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-500">Today&apos;s Calories</span>
                  <span className="font-medium">{member.todayCalories} / {member.calorieGoal}</span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      member.todayCalories / member.calorieGoal > 1
                        ? "bg-red-500"
                        : member.todayCalories / member.calorieGoal > 0.8
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${Math.min((member.todayCalories / member.calorieGoal) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Dietary Restrictions */}
              {member.dietaryRestrictions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {member.dietaryRestrictions.map((restriction) => (
                    <span key={restriction} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                      {restriction.replace("_", " ")}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Add Member Card */}
          <div
            onClick={() => setShowAddMemberModal(true)}
            className="bg-neutral-50 rounded-2xl p-4 border-2 border-dashed border-neutral-200 cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-all flex items-center justify-center min-h-[200px]"
          >
            <div className="text-center">
              <span className="text-4xl">➕</span>
              <p className="mt-2 text-neutral-600">Add Family Member</p>
            </div>
          </div>
        </div>
      )}

      {/* Grocery List Tab */}
      {activeTab === "grocery" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">
                {groceryList.filter((i) => i.purchased).length} of {groceryList.length} items purchased
              </p>
              <p className="text-lg font-semibold text-neutral-900">
                Total: Rs. {groceryTotal} (Remaining: Rs. {groceryRemaining})
              </p>
            </div>
            <button
              onClick={() => setShowAddGroceryModal(true)}
              className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
            >
              + Add Item
            </button>
          </div>

          {/* Group by category */}
          {["Vegetables", "Grains", "Pulses", "Dairy", "Protein", "Fruits"].map((category) => {
            const items = groceryList.filter((item) => item.category === category);
            if (items.length === 0) return null;
            return (
              <div key={category} className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-100">
                  <h3 className="font-semibold text-neutral-900">{category}</h3>
                </div>
                <div className="divide-y divide-neutral-100">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleGroceryPurchased(item.id)}
                      className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-neutral-50 transition-colors ${
                        item.purchased ? "bg-green-50" : ""
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        item.purchased ? "bg-green-500 border-green-500" : "border-neutral-300"
                      }`}>
                        {item.purchased && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${item.purchased ? "text-neutral-400 line-through" : "text-neutral-900"}`}>
                          {item.name}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {item.quantity} {item.unit} • Added by {item.addedBy}
                        </p>
                      </div>
                      {item.price && (
                        <span className={`font-medium ${item.purchased ? "text-neutral-400" : "text-neutral-900"}`}>
                          Rs. {item.price}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Meal Planning Tab */}
      {activeTab === "meals" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-neutral-900">This Week&apos;s Family Meals</h3>
            <button className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
              + Plan Meals
            </button>
          </div>

          {mockMealPlans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-neutral-900">
                  {new Date(plan.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                </h4>
                <span className="text-sm text-neutral-500">{plan.breakfast.servings} servings</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-3 bg-yellow-50 rounded-xl">
                  <p className="text-xs text-yellow-600 font-medium mb-1">🌅 Breakfast</p>
                  <p className="text-sm text-neutral-900">{plan.breakfast.name}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl">
                  <p className="text-xs text-orange-600 font-medium mb-1">☀️ Lunch</p>
                  <p className="text-sm text-neutral-900">{plan.lunch.name}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <p className="text-xs text-purple-600 font-medium mb-1">🌙 Dinner</p>
                  <p className="text-sm text-neutral-900">{plan.dinner.name}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <p className="text-xs text-green-600 font-medium mb-1">🍎 Snacks</p>
                  <p className="text-sm text-neutral-900">{plan.snacks.map((s) => s.name).join(", ")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Family Nutrition Tab */}
      {activeTab === "nutrition" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">Family Nutrition Overview</h3>
            <div className="space-y-4">
              {familyMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-4">
                  <span className="text-2xl">{member.avatar}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{member.name}</span>
                      <span>{member.todayCalories} / {member.calorieGoal} kcal</span>
                    </div>
                    <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          member.todayCalories / member.calorieGoal > 1
                            ? "bg-red-500"
                            : member.todayCalories / member.calorieGoal > 0.8
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                        style={{ width: `${Math.min((member.todayCalories / member.calorieGoal) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dietary Alerts */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <h3 className="font-semibold text-orange-800 mb-3">⚠️ Dietary Alerts</h3>
            <div className="space-y-2">
              <p className="text-sm text-orange-700">• Ananya has a nut allergy - avoid nuts in meals</p>
              <p className="text-sm text-orange-700">• Dadi needs low-sodium diabetic-friendly meals</p>
              <p className="text-sm text-orange-700">• Priya follows a vegetarian diet</p>
            </div>
          </div>

          {/* Age-Based Recommendations */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <h3 className="font-semibold text-blue-800 mb-3">💡 Age-Based Recommendations</h3>
            <div className="space-y-2">
              <p className="text-sm text-blue-700">• Children (Ananya): Ensure adequate calcium and iron intake</p>
              <p className="text-sm text-blue-700">• Teens (Arjun): Higher protein needs for growth - 1.2g/kg body weight</p>
              <p className="text-sm text-blue-700">• Seniors (Dadi): Focus on fiber, vitamin D, and B12</p>
            </div>
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-4xl">
                  {selectedMember.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">{selectedMember.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-sm px-2 py-0.5 rounded-full ${getRoleColor(selectedMember.role)}`}>
                      {selectedMember.role}
                    </span>
                    <span className="text-sm text-neutral-500">{selectedMember.age} years old</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-sm text-neutral-500">Daily Calorie Goal</p>
                  <p className="text-2xl font-bold text-neutral-900">{selectedMember.calorieGoal} kcal</p>
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-sm text-neutral-500">Today&apos;s Progress</p>
                  <p className="text-2xl font-bold text-neutral-900">{selectedMember.todayCalories} kcal</p>
                  <div className="h-2 bg-neutral-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${Math.min((selectedMember.todayCalories / selectedMember.calorieGoal) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {selectedMember.dietaryRestrictions.length > 0 && (
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <p className="text-sm text-orange-600 font-medium mb-2">Dietary Restrictions</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.dietaryRestrictions.map((r) => (
                        <span key={r} className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                          {r.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="flex-1 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Add Family Member</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                <input type="text" className="w-full px-4 py-2 border border-neutral-200 rounded-xl" placeholder="Enter name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Age</label>
                <input type="number" className="w-full px-4 py-2 border border-neutral-200 rounded-xl" placeholder="Enter age" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Role</label>
                <select className="w-full px-4 py-2 border border-neutral-200 rounded-xl">
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                  <option value="member">Member</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="flex-1 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Grocery Modal */}
      {showAddGroceryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Add Grocery Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Item Name</label>
                <input
                  type="text"
                  value={newGroceryItem.name}
                  onChange={(e) => setNewGroceryItem({ ...newGroceryItem, name: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl"
                  placeholder="Enter item name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newGroceryItem.quantity}
                    onChange={(e) => setNewGroceryItem({ ...newGroceryItem, quantity: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Unit</label>
                  <select
                    value={newGroceryItem.unit}
                    onChange={(e) => setNewGroceryItem({ ...newGroceryItem, unit: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="liters">liters</option>
                    <option value="pcs">pcs</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
                <select
                  value={newGroceryItem.category}
                  onChange={(e) => setNewGroceryItem({ ...newGroceryItem, category: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains">Grains</option>
                  <option value="Pulses">Pulses</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Protein">Protein</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddGroceryModal(false)}
                className="flex-1 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setGroceryList((prev) => [
                    ...prev,
                    {
                      id: `g${Date.now()}`,
                      ...newGroceryItem,
                      addedBy: "You",
                      purchased: false,
                    },
                  ]);
                  setShowAddGroceryModal(false);
                  setNewGroceryItem({ name: "", quantity: 1, unit: "kg", category: "Vegetables" });
                }}
                className="flex-1 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
