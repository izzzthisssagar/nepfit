"use client";

import { useState } from "react";

type KitchenTab = "devices" | "recipes" | "automation" | "shopping";

interface KitchenDevice {
  id: string;
  name: string;
  type: string;
  icon: string;
  brand: string;
  connected: boolean;
  status: "online" | "offline" | "active" | "standby";
  battery?: number;
  lastUsed: string;
  firmware: string;
}

interface RecipeStep {
  step: number;
  instruction: string;
  duration: number;
  device?: string;
  temperature?: number;
  mode?: string;
}

interface SmartRecipe {
  id: string;
  name: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings: number;
  totalTime: number;
  devices: string[];
  steps: RecipeStep[];
}

interface AutomationProfile {
  id: string;
  name: string;
  device: string;
  icon: string;
  temperature: number;
  time: number;
  mode: string;
  enabled: boolean;
}

interface FridgeItem {
  id: string;
  name: string;
  quantity: string;
  expiresIn: number;
  category: string;
  calories: number;
}

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
  fromDevice: string;
}

interface CookingHistory {
  id: string;
  recipe: string;
  date: string;
  calories: number;
  servings: number;
  duration: number;
  devices: string[];
}

const mockDevices: KitchenDevice[] = [
  { id: "d1", name: "NutriScale Pro", type: "Smart Scale", icon: "⚖️", brand: "Etekcity", connected: true, status: "online", lastUsed: "10 min ago", firmware: "v3.2.1" },
  { id: "d2", name: "AirFryer Max", type: "Air Fryer", icon: "🍟", brand: "Ninja", connected: true, status: "standby", lastUsed: "2 hours ago", firmware: "v2.1.0" },
  { id: "d3", name: "InstaPot Ultra", type: "Instant Pot", icon: "🍲", brand: "Instant Brands", connected: true, status: "active", lastUsed: "Now", firmware: "v4.0.3" },
  { id: "d4", name: "SmartOven 360", type: "Oven", icon: "🔥", brand: "June", connected: false, status: "offline", lastUsed: "Yesterday", firmware: "v5.1.2" },
  { id: "d5", name: "NutriBlend Pro", type: "Blender", icon: "🥤", brand: "Vitamix", connected: true, status: "standby", lastUsed: "3 hours ago", firmware: "v1.8.0" },
  { id: "d6", name: "SmartFridge Hub", type: "Smart Fridge", icon: "🧊", brand: "Samsung", connected: true, status: "online", lastUsed: "Always on", firmware: "v6.2.0" },
];

const mockRecipe: SmartRecipe = {
  id: "r1",
  name: "Healthy Chicken Bowl",
  image: "🍗",
  calories: 485,
  protein: 42,
  carbs: 38,
  fat: 16,
  servings: 2,
  totalTime: 35,
  devices: ["InstaPot Ultra", "NutriScale Pro"],
  steps: [
    { step: 1, instruction: "Weigh 300g chicken breast on smart scale", duration: 2, device: "NutriScale Pro" },
    { step: 2, instruction: "Season chicken with spices", duration: 3 },
    { step: 3, instruction: "Add chicken and 1 cup rice to Instant Pot", duration: 2, device: "InstaPot Ultra", temperature: 180, mode: "Pressure Cook" },
    { step: 4, instruction: "Cook on high pressure for 15 minutes", duration: 15, device: "InstaPot Ultra", temperature: 180, mode: "High Pressure" },
    { step: 5, instruction: "Natural release for 5 minutes", duration: 5, device: "InstaPot Ultra" },
    { step: 6, instruction: "Weigh vegetables on smart scale (200g)", duration: 2, device: "NutriScale Pro" },
    { step: 7, instruction: "Plate and serve with vegetables", duration: 3 },
  ],
};

const automationProfiles: AutomationProfile[] = [
  { id: "a1", name: "Morning Oats", device: "InstaPot Ultra", icon: "🌅", temperature: 100, time: 20, mode: "Slow Cook", enabled: true },
  { id: "a2", name: "Crispy Chicken", device: "AirFryer Max", icon: "🍗", temperature: 200, time: 18, mode: "Air Fry", enabled: true },
  { id: "a3", name: "Green Smoothie", device: "NutriBlend Pro", icon: "🥬", temperature: 0, time: 2, mode: "Blend High", enabled: false },
  { id: "a4", name: "Baked Fish", device: "SmartOven 360", icon: "🐟", temperature: 190, time: 22, mode: "Bake", enabled: true },
  { id: "a5", name: "Rice & Dal", device: "InstaPot Ultra", icon: "🍚", temperature: 180, time: 25, mode: "Pressure Cook", enabled: true },
  { id: "a6", name: "Protein Shake", device: "NutriBlend Pro", icon: "💪", temperature: 0, time: 1, mode: "Pulse", enabled: false },
];

const fridgeItems: FridgeItem[] = [
  { id: "fi1", name: "Chicken Breast", quantity: "500g", expiresIn: 2, category: "Protein", calories: 825 },
  { id: "fi2", name: "Greek Yogurt", quantity: "400g", expiresIn: 5, category: "Dairy", calories: 240 },
  { id: "fi3", name: "Spinach", quantity: "200g", expiresIn: 3, category: "Vegetables", calories: 46 },
  { id: "fi4", name: "Brown Rice", quantity: "1kg", expiresIn: 30, category: "Grains", calories: 3700 },
  { id: "fi5", name: "Eggs (12)", quantity: "12 pcs", expiresIn: 10, category: "Protein", calories: 936 },
  { id: "fi6", name: "Milk", quantity: "1L", expiresIn: 4, category: "Dairy", calories: 420 },
  { id: "fi7", name: "Bell Peppers", quantity: "3 pcs", expiresIn: 6, category: "Vegetables", calories: 93 },
  { id: "fi8", name: "Sweet Potatoes", quantity: "4 pcs", expiresIn: 14, category: "Vegetables", calories: 344 },
];

const mockShoppingList: ShoppingItem[] = [
  { id: "s1", name: "Salmon Fillets", quantity: "400g", category: "Protein", checked: false, fromDevice: "SmartFridge Hub" },
  { id: "s2", name: "Avocados", quantity: "4 pcs", category: "Produce", checked: false, fromDevice: "SmartFridge Hub" },
  { id: "s3", name: "Quinoa", quantity: "500g", category: "Grains", checked: true, fromDevice: "Manual" },
  { id: "s4", name: "Olive Oil", quantity: "500ml", category: "Pantry", checked: false, fromDevice: "SmartFridge Hub" },
  { id: "s5", name: "Broccoli", quantity: "300g", category: "Produce", checked: true, fromDevice: "Manual" },
  { id: "s6", name: "Almond Milk", quantity: "1L", category: "Dairy Alt", checked: false, fromDevice: "SmartFridge Hub" },
];

const cookingHistory: CookingHistory[] = [
  { id: "ch1", recipe: "Grilled Chicken Salad", date: "Today", calories: 380, servings: 1, duration: 25, devices: ["AirFryer Max", "NutriScale Pro"] },
  { id: "ch2", recipe: "Protein Smoothie", date: "Today", calories: 290, servings: 1, duration: 5, devices: ["NutriBlend Pro", "NutriScale Pro"] },
  { id: "ch3", recipe: "Dal Bhat", date: "Yesterday", calories: 450, servings: 2, duration: 35, devices: ["InstaPot Ultra"] },
  { id: "ch4", recipe: "Baked Salmon", date: "Yesterday", calories: 520, servings: 2, duration: 28, devices: ["SmartOven 360", "NutriScale Pro"] },
  { id: "ch5", recipe: "Veggie Stir Fry", date: "2 days ago", calories: 310, servings: 2, duration: 20, devices: ["NutriScale Pro"] },
];

export default function SmartKitchenPage() {
  const [activeTab, setActiveTab] = useState<KitchenTab>("devices");
  const [devices, setDevices] = useState(mockDevices);
  const [profiles, setProfiles] = useState(automationProfiles);
  const [shopping, setShopping] = useState(mockShoppingList);
  const [activeRecipeStep, setActiveRecipeStep] = useState(0);
  const [isRecipeActive, setIsRecipeActive] = useState(false);

  const toggleDeviceConnection = (id: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, connected: !d.connected, status: d.connected ? "offline" : "online" }
          : d
      )
    );
  };

  const toggleProfile = (id: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const toggleShoppingItem = (id: string) => {
    setShopping((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s))
    );
  };

  const startRecipe = () => {
    setIsRecipeActive(true);
    setActiveRecipeStep(0);
  };

  const nextStep = () => {
    if (activeRecipeStep < mockRecipe.steps.length - 1) {
      setActiveRecipeStep((prev) => prev + 1);
    } else {
      setIsRecipeActive(false);
      setActiveRecipeStep(0);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-100 text-green-700";
      case "active": return "bg-blue-100 text-blue-700";
      case "standby": return "bg-yellow-100 text-yellow-700";
      case "offline": return "bg-neutral-100 text-neutral-500";
      default: return "bg-neutral-100 text-neutral-500";
    }
  };

  const connectedCount = devices.filter((d) => d.connected).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Smart Kitchen</h1>
          <p className="text-neutral-600">Connect and control your kitchen devices</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-xl">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-700 font-medium">{connectedCount} devices online</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 overflow-x-auto">
        {([
          { id: "devices", label: "Devices", icon: "🔌" },
          { id: "recipes", label: "Recipes", icon: "📖" },
          { id: "automation", label: "Automation", icon: "⚡" },
          { id: "shopping", label: "Shopping", icon: "🛒" },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      {/* Devices Tab */}
      {activeTab === "devices" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device) => (
              <div key={device.id} className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className={`p-4 ${device.connected ? "bg-gradient-to-r from-primary-50 to-blue-50" : "bg-neutral-50"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                        <span className="text-2xl">{device.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">{device.name}</h3>
                        <p className="text-xs text-neutral-500">{device.brand} &middot; {device.type}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(device.status)}`}>
                      {device.status}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-neutral-500">Last used</span>
                    <span className="text-neutral-700">{device.lastUsed}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-neutral-500">Firmware</span>
                    <span className="text-neutral-700">{device.firmware}</span>
                  </div>
                  <button
                    onClick={() => toggleDeviceConnection(device.id)}
                    className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      device.connected
                        ? "border border-red-200 text-red-600 hover:bg-red-50"
                        : "bg-primary-500 text-white hover:bg-primary-600"
                    }`}
                  >
                    {device.connected ? "Disconnect" : "Connect"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Nutrition from Smart Scale */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Smart Scale Measurements</h2>
            <p className="text-sm text-neutral-500 mb-4">Recent food weighed on your NutriScale Pro with automatic nutrition tracking.</p>
            <div className="space-y-3">
              {[
                { food: "Chicken Breast", weight: "185g", calories: 305, time: "10 min ago" },
                { food: "Brown Rice (cooked)", weight: "220g", calories: 253, time: "2 hours ago" },
                { food: "Greek Yogurt", weight: "150g", calories: 90, time: "5 hours ago" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">⚖️</span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{item.food}</p>
                      <p className="text-sm text-neutral-500">{item.weight} &middot; {item.time}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-orange-600">{item.calories} kcal</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recipes Tab */}
      {activeTab === "recipes" && (
        <div className="space-y-6">
          {/* Recipe Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-primary-50 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <span className="text-4xl">{mockRecipe.image}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-neutral-900">{mockRecipe.name}</h2>
                  <p className="text-sm text-neutral-600">{mockRecipe.servings} servings &middot; {mockRecipe.totalTime} min</p>
                  <div className="flex gap-2 mt-2">
                    {mockRecipe.devices.map((d, i) => (
                      <span key={i} className="text-xs bg-white/80 px-2 py-0.5 rounded-full text-neutral-600">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 mt-4">
                <div className="text-center p-2 bg-white/80 rounded-lg">
                  <p className="font-bold text-orange-600">{mockRecipe.calories}</p>
                  <p className="text-xs text-neutral-500">kcal</p>
                </div>
                <div className="text-center p-2 bg-white/80 rounded-lg">
                  <p className="font-bold text-red-600">{mockRecipe.protein}g</p>
                  <p className="text-xs text-neutral-500">Protein</p>
                </div>
                <div className="text-center p-2 bg-white/80 rounded-lg">
                  <p className="font-bold text-blue-600">{mockRecipe.carbs}g</p>
                  <p className="text-xs text-neutral-500">Carbs</p>
                </div>
                <div className="text-center p-2 bg-white/80 rounded-lg">
                  <p className="font-bold text-yellow-600">{mockRecipe.fat}g</p>
                  <p className="text-xs text-neutral-500">Fat</p>
                </div>
              </div>
            </div>

            {/* Step-by-Step Mode */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-900">Step-by-Step Mode</h3>
                {!isRecipeActive ? (
                  <button
                    onClick={startRecipe}
                    className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-sm font-medium"
                  >
                    Start Cooking
                  </button>
                ) : (
                  <span className="text-sm text-primary-600 font-medium">
                    Step {activeRecipeStep + 1} of {mockRecipe.steps.length}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {mockRecipe.steps.map((step, idx) => (
                  <div
                    key={step.step}
                    className={`p-4 rounded-xl border transition-all ${
                      isRecipeActive && idx === activeRecipeStep
                        ? "bg-primary-50 border-primary-300 shadow-sm"
                        : isRecipeActive && idx < activeRecipeStep
                        ? "bg-green-50 border-green-200"
                        : "bg-neutral-50 border-neutral-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        isRecipeActive && idx < activeRecipeStep
                          ? "bg-green-500 text-white"
                          : isRecipeActive && idx === activeRecipeStep
                          ? "bg-primary-500 text-white animate-pulse"
                          : "bg-neutral-200 text-neutral-500"
                      }`}>
                        {isRecipeActive && idx < activeRecipeStep ? "✓" : step.step}
                      </div>
                      <div className="flex-1">
                        <p className="text-neutral-900">{step.instruction}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                            {step.duration} min
                          </span>
                          {step.device && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {step.device}
                            </span>
                          )}
                          {step.temperature && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                              {step.temperature}°C
                            </span>
                          )}
                          {step.mode && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                              {step.mode}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {isRecipeActive && (
                <button
                  onClick={nextStep}
                  className="w-full mt-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-medium"
                >
                  {activeRecipeStep < mockRecipe.steps.length - 1 ? "Next Step" : "Finish Cooking"}
                </button>
              )}
            </div>
          </div>

          {/* Cooking History */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Cooking History</h2>
            <div className="space-y-3">
              {cookingHistory.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                  <div>
                    <p className="font-medium text-neutral-900">{entry.recipe}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-neutral-500">{entry.date}</span>
                      <span className="text-xs text-neutral-300">|</span>
                      <span className="text-xs text-neutral-500">{entry.duration} min</span>
                      <span className="text-xs text-neutral-300">|</span>
                      <span className="text-xs text-neutral-500">{entry.servings} serving{entry.servings > 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex gap-1 mt-1.5">
                      {entry.devices.map((d, i) => (
                        <span key={i} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{d}</span>
                      ))}
                    </div>
                  </div>
                  <span className="font-semibold text-orange-600">{entry.calories} kcal</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Automation Tab */}
      {activeTab === "automation" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">Cooking Automation Profiles</h2>
            <p className="text-sm text-neutral-500 mb-4">Pre-configured cooking settings that auto-set your devices.</p>
            <div className="space-y-3">
              {profiles.map((profile) => (
                <div key={profile.id} className={`p-4 rounded-xl border transition-colors ${
                  profile.enabled ? "bg-white border-primary-200" : "bg-neutral-50 border-neutral-100"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        profile.enabled ? "bg-primary-100" : "bg-neutral-200"
                      }`}>
                        <span className="text-2xl">{profile.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{profile.name}</p>
                        <p className="text-sm text-neutral-500">{profile.device}</p>
                        <div className="flex gap-2 mt-1">
                          {profile.temperature > 0 && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                              {profile.temperature}°C
                            </span>
                          )}
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {profile.time} min
                          </span>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                            {profile.mode}
                          </span>
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.enabled}
                        onChange={() => toggleProfile(profile.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Fridge Ingredients */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">Smart Fridge Inventory</h2>
            <p className="text-sm text-neutral-500 mb-4">Ingredients tracked from your SmartFridge Hub.</p>
            <div className="space-y-3">
              {fridgeItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.expiresIn <= 2 ? "bg-red-500" : item.expiresIn <= 5 ? "bg-yellow-500" : "bg-green-500"
                    }`} />
                    <div>
                      <p className="font-medium text-neutral-900 text-sm">{item.name}</p>
                      <p className="text-xs text-neutral-500">{item.quantity} &middot; {item.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-700">{item.calories} kcal</p>
                    <p className={`text-xs ${item.expiresIn <= 2 ? "text-red-600 font-medium" : "text-neutral-500"}`}>
                      {item.expiresIn <= 2 ? "Expiring soon!" : `${item.expiresIn} days left`}
                    </p>
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
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Smart Shopping List</h2>
                <p className="text-sm text-neutral-500">Auto-generated from fridge inventory and meal plans</p>
              </div>
              <span className="text-sm text-neutral-500">
                {shopping.filter((s) => s.checked).length}/{shopping.length} done
              </span>
            </div>
            <div className="space-y-2">
              {shopping.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleShoppingItem(item.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors text-left ${
                    item.checked ? "bg-green-50 border border-green-200" : "bg-neutral-50 border border-neutral-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      item.checked ? "border-green-500 bg-green-500" : "border-neutral-300"
                    }`}>
                      {item.checked && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${item.checked ? "text-neutral-400 line-through" : "text-neutral-900"}`}>
                        {item.name}
                      </p>
                      <p className="text-xs text-neutral-500">{item.quantity} &middot; {item.category}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
                    {item.fromDevice}
                  </span>
                </button>
              ))}
            </div>
            <button className="w-full mt-4 py-3 border-2 border-dashed border-neutral-300 text-neutral-500 rounded-xl hover:border-primary-300 hover:text-primary-600 transition-colors text-sm">
              + Add Item Manually
            </button>
          </div>

          {/* Sync Info */}
          <div className="bg-gradient-to-r from-blue-50 to-primary-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🔄</span>
              <div>
                <h3 className="font-semibold text-neutral-900">Auto-Sync Shopping List</h3>
                <p className="text-sm text-neutral-600 mt-1">
                  Your shopping list updates automatically when your smart fridge detects low inventory or items nearing expiration.
                </p>
                <p className="text-xs text-neutral-500 mt-2">Last synced: 15 minutes ago from SmartFridge Hub</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
