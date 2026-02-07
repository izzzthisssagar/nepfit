"use client";

import { useState } from "react";

interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
  price?: number;
  store?: string;
  notes?: string;
}

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate?: Date;
  lowStockThreshold?: number;
}

interface Store {
  id: string;
  name: string;
  distance: string;
  rating: number;
  address: string;
  hours: string;
  hasDelivery: boolean;
}

const categories = [
  { id: "produce", name: "Produce", icon: "🥬", color: "bg-green-100 text-green-700" },
  { id: "dairy", name: "Dairy", icon: "🥛", color: "bg-blue-100 text-blue-700" },
  { id: "meat", name: "Meat & Seafood", icon: "🥩", color: "bg-red-100 text-red-700" },
  { id: "bakery", name: "Bakery", icon: "🍞", color: "bg-amber-100 text-amber-700" },
  { id: "frozen", name: "Frozen", icon: "🧊", color: "bg-cyan-100 text-cyan-700" },
  { id: "pantry", name: "Pantry Staples", icon: "🥫", color: "bg-orange-100 text-orange-700" },
  { id: "beverages", name: "Beverages", icon: "🧃", color: "bg-purple-100 text-purple-700" },
  { id: "snacks", name: "Snacks", icon: "🍿", color: "bg-pink-100 text-pink-700" },
  { id: "household", name: "Household", icon: "🧹", color: "bg-gray-100 text-gray-700" },
];

const mockGroceryList: GroceryItem[] = [
  { id: "1", name: "Chicken Breast", quantity: 2, unit: "lbs", category: "meat", checked: false, price: 12.99 },
  { id: "2", name: "Broccoli", quantity: 2, unit: "heads", category: "produce", checked: false, price: 3.99 },
  { id: "3", name: "Brown Rice", quantity: 1, unit: "bag", category: "pantry", checked: true, price: 4.99 },
  { id: "4", name: "Greek Yogurt", quantity: 2, unit: "cups", category: "dairy", checked: false, price: 5.99 },
  { id: "5", name: "Eggs", quantity: 1, unit: "dozen", category: "dairy", checked: false, price: 4.49 },
  { id: "6", name: "Spinach", quantity: 1, unit: "bag", category: "produce", checked: false, price: 3.49 },
  { id: "7", name: "Almond Milk", quantity: 1, unit: "carton", category: "beverages", checked: true, price: 3.99 },
  { id: "8", name: "Whole Wheat Bread", quantity: 1, unit: "loaf", category: "bakery", checked: false, price: 4.29 },
];

const mockPantry: PantryItem[] = [
  { id: "1", name: "Olive Oil", quantity: 1, unit: "bottle", category: "pantry", lowStockThreshold: 1 },
  { id: "2", name: "Rice", quantity: 3, unit: "lbs", category: "pantry", lowStockThreshold: 2 },
  { id: "3", name: "Pasta", quantity: 4, unit: "boxes", category: "pantry", lowStockThreshold: 2 },
  { id: "4", name: "Canned Tomatoes", quantity: 6, unit: "cans", category: "pantry", lowStockThreshold: 3 },
  { id: "5", name: "Chicken Stock", quantity: 2, unit: "cartons", category: "pantry", lowStockThreshold: 2 },
  { id: "6", name: "Honey", quantity: 1, unit: "jar", category: "pantry", expiryDate: new Date(Date.now() + 90 * 86400000) },
];

const mockStores: Store[] = [
  { id: "1", name: "Whole Foods Market", distance: "0.8 mi", rating: 4.5, address: "123 Health St", hours: "7AM - 10PM", hasDelivery: true },
  { id: "2", name: "Trader Joe's", distance: "1.2 mi", rating: 4.7, address: "456 Organic Ave", hours: "8AM - 9PM", hasDelivery: false },
  { id: "3", name: "Safeway", distance: "0.5 mi", rating: 4.2, address: "789 Main St", hours: "6AM - 11PM", hasDelivery: true },
  { id: "4", name: "Costco", distance: "3.5 mi", rating: 4.6, address: "321 Bulk Blvd", hours: "10AM - 8:30PM", hasDelivery: true },
];

const suggestedItems = [
  "Bananas", "Apples", "Milk", "Bread", "Eggs", "Cheese", "Tomatoes", "Onions", "Garlic", "Lemons"
];

export default function GroceryPage() {
  const [activeTab, setActiveTab] = useState<"list" | "pantry" | "stores" | "history">("list");
  const [groceryList, setGroceryList] = useState<GroceryItem[]>(mockGroceryList);
  const [pantryItems] = useState<PantryItem[]>(mockPantry);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [newItemName, setNewItemName] = useState("");
  const [sortBy, setSortBy] = useState<"category" | "name" | "checked">("category");

  const toggleItem = (id: string) => {
    setGroceryList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setGroceryList((prev) => prev.filter((item) => item.id !== id));
  };

  const getCategory = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId) || categories[0];
  };

  const filteredList =
    selectedCategory === "all"
      ? groceryList
      : groceryList.filter((item) => item.category === selectedCategory);

  const sortedList = [...filteredList].sort((a, b) => {
    if (sortBy === "checked") return Number(a.checked) - Number(b.checked);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return a.category.localeCompare(b.category);
  });

  const totalItems = groceryList.length;
  const checkedItems = groceryList.filter((item) => item.checked).length;
  const totalPrice = groceryList
    .filter((item) => !item.checked)
    .reduce((sum, item) => sum + (item.price || 0), 0);

  const lowStockItems = pantryItems.filter(
    (item) => item.lowStockThreshold && item.quantity <= item.lowStockThreshold
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Grocery & Shopping</h1>
          <p className="text-gray-600 mt-1">Manage your shopping lists and pantry</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "list", label: "Shopping List", icon: "📝" },
            { id: "pantry", label: "Pantry", icon: "🏠" },
            { id: "stores", label: "Stores", icon: "🏪" },
            { id: "history", label: "History", icon: "📅" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-green-50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Shopping List Tab */}
        {activeTab === "list" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-500">Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {checkedItems}/{totalItems}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-500">Est. Total</p>
                <p className="text-2xl font-bold text-green-600">${totalPrice.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-500">Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0}%
                </p>
              </div>
            </div>

            {/* Quick Add */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Add item to list..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && newItemName) {
                      setGroceryList((prev) => [
                        ...prev,
                        {
                          id: Date.now().toString(),
                          name: newItemName,
                          quantity: 1,
                          unit: "item",
                          category: "pantry",
                          checked: false,
                        },
                      ]);
                      setNewItemName("");
                    }
                  }}
                />
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  + Add
                </button>
              </div>

              {/* Suggestions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestedItems.slice(0, 6).map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setGroceryList((prev) => [
                        ...prev,
                        {
                          id: Date.now().toString(),
                          name: item,
                          quantity: 1,
                          unit: "item",
                          category: "produce",
                          checked: false,
                        },
                      ]);
                    }}
                    className="px-3 py-1 bg-gray-100 hover:bg-green-100 rounded-full text-sm text-gray-700 transition-colors"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters & Sort */}
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                    selectedCategory === "all"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  All
                </button>
                {categories.slice(0, 5).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
              >
                <option value="category">Sort by Category</option>
                <option value="name">Sort by Name</option>
                <option value="checked">Sort by Status</option>
              </select>
            </div>

            {/* Shopping List */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {sortedList.map((item) => {
                  const category = getCategory(item.category);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 flex items-center gap-4 ${
                        item.checked ? "bg-gray-50" : ""
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          item.checked
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {item.checked && "✓"}
                      </button>
                      <span className={`px-2 py-1 rounded-full text-xs ${category.color}`}>
                        {category.icon}
                      </span>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            item.checked ? "text-gray-400 line-through" : "text-gray-900"
                          }`}
                        >
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                      {item.price && (
                        <span className="text-sm font-medium text-gray-600">
                          ${item.price.toFixed(2)}
                        </span>
                      )}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>

              {sortedList.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <span className="text-4xl">🛒</span>
                  <p className="mt-2">Your shopping list is empty</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-3 bg-white text-gray-700 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
                Share List
              </button>
              <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors">
                Start Shopping
              </button>
            </div>
          </div>
        )}

        {/* Pantry Tab */}
        {activeTab === "pantry" && (
          <div className="space-y-6">
            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">⚠️</span>
                  <h3 className="font-semibold text-amber-800">Low Stock Items</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lowStockItems.map((item) => (
                    <button
                      key={item.id}
                      className="px-3 py-2 bg-white rounded-lg text-sm flex items-center gap-2 hover:bg-amber-100 transition-colors"
                    >
                      <span>{item.name}</span>
                      <span className="text-amber-600">({item.quantity} left)</span>
                      <span className="text-green-600">+ Add</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pantry Categories */}
            <div className="grid md:grid-cols-2 gap-4">
              {categories.slice(0, 6).map((category) => {
                const items = pantryItems.filter((i) => i.category === category.id);
                return (
                  <div key={category.id} className="bg-white rounded-2xl shadow-sm p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full ${category.color}`}>
                        {category.icon} {category.name}
                      </span>
                      <span className="text-sm text-gray-500">{items.length} items</span>
                    </div>
                    <div className="space-y-2">
                      {items.length > 0 ? (
                        items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                          >
                            <span className="text-gray-700">{item.name}</span>
                            <span className="text-sm text-gray-500">
                              {item.quantity} {item.unit}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 text-center py-2">No items</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add to Pantry */}
            <button className="w-full p-4 bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-600 transition-colors">
              + Add Item to Pantry
            </button>
          </div>
        )}

        {/* Stores Tab */}
        {activeTab === "stores" && (
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search stores near you..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl"
                />
                <button className="px-4 py-3 bg-green-600 text-white rounded-xl font-medium">
                  Search
                </button>
              </div>
            </div>

            {/* Store List */}
            <div className="space-y-4">
              {mockStores.map((store) => (
                <div key={store.id} className="bg-white rounded-2xl shadow-sm p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{store.name}</h4>
                        {store.hasDelivery && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            Delivery
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{store.address}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>📍 {store.distance}</span>
                        <span>⭐ {store.rating}</span>
                        <span>🕐 {store.hours}</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
                      Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Comparison */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">💰 Price Comparison</h3>
              <p className="text-sm opacity-90 mb-4">
                Compare prices across stores for your shopping list
              </p>
              <button className="px-4 py-2 bg-white text-green-600 rounded-lg font-medium">
                Compare Prices
              </button>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Shopping History</h3>
              <p className="text-gray-600 text-sm">Your past shopping trips</p>
            </div>

            {[
              { date: "Feb 5, 2026", store: "Whole Foods", items: 12, total: 87.45 },
              { date: "Feb 1, 2026", store: "Trader Joe's", items: 8, total: 52.30 },
              { date: "Jan 28, 2026", store: "Safeway", items: 15, total: 95.20 },
              { date: "Jan 22, 2026", store: "Costco", items: 6, total: 145.80 },
            ].map((trip, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{trip.store}</p>
                    <p className="text-sm text-gray-500">{trip.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${trip.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{trip.items} items</p>
                  </div>
                </div>
                <button className="mt-3 text-sm text-green-600 font-medium">
                  View Details →
                </button>
              </div>
            ))}

            {/* Monthly Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Monthly Spending</h4>
              <div className="h-32 flex items-end justify-between gap-2">
                {[320, 280, 350, 290, 310, 380].map((amount, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-green-500 rounded-t-lg"
                      style={{ height: `${(amount / 400) * 100}%` }}
                    />
                    <span className="text-xs text-gray-500 mt-2">
                      {["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Add Item</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    placeholder="e.g., Chicken Breast"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-200 rounded-xl"
                      defaultValue={1}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select className="w-full p-3 border border-gray-200 rounded-xl">
                      <option>items</option>
                      <option>lbs</option>
                      <option>oz</option>
                      <option>cups</option>
                      <option>bags</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        className={`px-3 py-1 rounded-full text-sm ${cat.color} hover:opacity-80`}
                      >
                        {cat.icon} {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
