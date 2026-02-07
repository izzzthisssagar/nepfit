"use client";

import { useState } from "react";

type ARTab = "camera" | "nutrition" | "portion" | "menu";

interface DetectedFood {
  id: string;
  name: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  position: { x: number; y: number; w: number; h: number };
}

interface PortionGuide {
  id: string;
  name: string;
  icon: string;
  reference: string;
  grams: number;
  visualCue: string;
}

interface CompatibleDevice {
  name: string;
  icon: string;
  arSupport: "full" | "partial" | "limited";
  minVersion: string;
}

interface CalibrationSetting {
  id: string;
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  unit: string;
}

const mockDetectedFoods: DetectedFood[] = [
  { id: "f1", name: "Dal Bhat", confidence: 94, calories: 450, protein: 18, carbs: 65, fat: 12, fiber: 8, position: { x: 15, y: 20, w: 35, h: 30 } },
  { id: "f2", name: "Achar (Pickle)", confidence: 87, calories: 45, protein: 1, carbs: 8, fat: 2, fiber: 2, position: { x: 55, y: 25, w: 20, h: 18 } },
  { id: "f3", name: "Saag (Greens)", confidence: 91, calories: 85, protein: 4, carbs: 10, fat: 4, fiber: 5, position: { x: 58, y: 50, w: 22, h: 20 } },
  { id: "f4", name: "Chicken Curry", confidence: 89, calories: 320, protein: 28, carbs: 12, fat: 18, fiber: 3, position: { x: 18, y: 55, w: 30, h: 25 } },
];

const portionGuides: PortionGuide[] = [
  { id: "p1", name: "Palm", icon: "🖐️", reference: "Protein portion", grams: 85, visualCue: "Size of your palm = 1 serving of meat/fish" },
  { id: "p2", name: "Fist", icon: "✊", reference: "Carb portion", grams: 150, visualCue: "Size of your fist = 1 cup of rice/grains" },
  { id: "p3", name: "Cupped Hand", icon: "🤲", reference: "Fruit/Snack portion", grams: 120, visualCue: "Cupped hand = 1 serving of fruit/nuts" },
  { id: "p4", name: "Thumb", icon: "👍", reference: "Fat portion", grams: 15, visualCue: "Size of your thumb = 1 tbsp of oil/butter" },
  { id: "p5", name: "Two Hands", icon: "🙌", reference: "Vegetable portion", grams: 200, visualCue: "Two open hands = 1 serving of leafy greens" },
  { id: "p6", name: "Fingertip", icon: "👆", reference: "Small condiment", grams: 5, visualCue: "Fingertip = 1 tsp of salt/sugar" },
];

const compatibleDevices: CompatibleDevice[] = [
  { name: "iPhone 12+", icon: "📱", arSupport: "full", minVersion: "iOS 16+" },
  { name: "iPhone SE (3rd gen)", icon: "📱", arSupport: "partial", minVersion: "iOS 16+" },
  { name: "iPad Pro (M1+)", icon: "📲", arSupport: "full", minVersion: "iPadOS 16+" },
  { name: "Samsung Galaxy S21+", icon: "📱", arSupport: "full", minVersion: "Android 12+" },
  { name: "Google Pixel 6+", icon: "📱", arSupport: "full", minVersion: "Android 12+" },
  { name: "OnePlus 10+", icon: "📱", arSupport: "partial", minVersion: "Android 13+" },
];

const tutorialSteps = [
  { step: 1, title: "Point Your Camera", description: "Aim your device camera at any food item or plate of food.", icon: "📷" },
  { step: 2, title: "Auto-Detection", description: "AI identifies food items and highlights them with bounding boxes.", icon: "🔍" },
  { step: 3, title: "Nutrition Overlay", description: "Tap any detected item to see nutrition info overlaid in AR.", icon: "📊" },
  { step: 4, title: "Log Instantly", description: "Confirm portions and log the meal with one tap.", icon: "✅" },
];

export default function ARFoodPage() {
  const [activeTab, setActiveTab] = useState<ARTab>("camera");
  const [isRealTime, setIsRealTime] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [selectedFood, setSelectedFood] = useState<DetectedFood | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [calibration, setCalibration] = useState<CalibrationSetting[]>([
    { id: "c1", label: "Detection Sensitivity", description: "Higher values detect more items", value: 75, min: 30, max: 100, unit: "%" },
    { id: "c2", label: "Overlay Opacity", description: "Transparency of nutrition labels", value: 85, min: 20, max: 100, unit: "%" },
    { id: "c3", label: "Scan Distance", description: "Maximum distance for food detection", value: 50, min: 15, max: 100, unit: "cm" },
    { id: "c4", label: "Label Font Size", description: "Text size of AR nutrition labels", value: 14, min: 10, max: 24, unit: "px" },
  ]);

  const totalCalories = mockDetectedFoods.reduce((sum, f) => sum + f.calories, 0);
  const totalProtein = mockDetectedFoods.reduce((sum, f) => sum + f.protein, 0);
  const totalCarbs = mockDetectedFoods.reduce((sum, f) => sum + f.carbs, 0);
  const totalFat = mockDetectedFoods.reduce((sum, f) => sum + f.fat, 0);

  const handleCalibrationChange = (id: string, value: number) => {
    setCalibration((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value } : s))
    );
  };

  const handleMenuScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">AR Food Visualization</h1>
          <p className="text-neutral-600">Point your camera at food to see instant nutrition info</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-500">{isRealTime ? "Real-time" : "Photo"}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isRealTime}
              onChange={(e) => setIsRealTime(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 overflow-x-auto">
        {([
          { id: "camera", label: "Camera View", icon: "📷" },
          { id: "nutrition", label: "Nutrition Overlay", icon: "📊" },
          { id: "portion", label: "Portion Guide", icon: "🍽️" },
          { id: "menu", label: "Menu Scan", icon: "📋" },
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

      {/* Camera View Tab */}
      {activeTab === "camera" && (
        <div className="space-y-6">
          {/* Mock AR Camera Interface */}
          <div className="bg-neutral-900 rounded-2xl overflow-hidden relative" style={{ minHeight: 400 }}>
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl">📷</span>
                <p className="text-neutral-400 mt-3 text-sm">Camera Preview (Mock)</p>
              </div>
            </div>

            {/* Detection Boxes */}
            {showOverlay && mockDetectedFoods.map((food) => (
              <button
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className="absolute border-2 border-green-400 rounded-lg bg-green-400/10 hover:bg-green-400/20 transition-colors cursor-pointer"
                style={{
                  left: `${food.position.x}%`,
                  top: `${food.position.y}%`,
                  width: `${food.position.w}%`,
                  height: `${food.position.h}%`,
                }}
              >
                <div className="absolute -top-6 left-0 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                  {food.name} ({food.confidence}%)
                </div>
              </button>
            ))}

            {/* Camera Controls */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <span className="text-xl">🔄</span>
              </button>
              <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                <div className="w-14 h-14 border-4 border-primary-500 rounded-full" />
              </button>
              <button
                onClick={() => setShowOverlay(!showOverlay)}
                className={`w-12 h-12 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors ${showOverlay ? "bg-primary-500/60" : "bg-white/20"}`}
              >
                <span className="text-xl">👁️</span>
              </button>
            </div>

            {/* Status Bar */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {isRealTime ? "Live Detection" : "Photo Mode"}
              </div>
              <div className="bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                {mockDetectedFoods.length} items detected
              </div>
            </div>
          </div>

          {/* Selected Food Detail */}
          {selectedFood && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">{selectedFood.name}</h3>
                  <p className="text-sm text-neutral-500">Confidence: {selectedFood.confidence}%</p>
                </div>
                <button
                  onClick={() => setSelectedFood(null)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-3 bg-orange-50 rounded-xl">
                  <p className="text-xl font-bold text-orange-600">{selectedFood.calories}</p>
                  <p className="text-xs text-neutral-500">kcal</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-xl">
                  <p className="text-xl font-bold text-red-600">{selectedFood.protein}g</p>
                  <p className="text-xs text-neutral-500">Protein</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <p className="text-xl font-bold text-blue-600">{selectedFood.carbs}g</p>
                  <p className="text-xs text-neutral-500">Carbs</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-xl">
                  <p className="text-xl font-bold text-yellow-600">{selectedFood.fat}g</p>
                  <p className="text-xs text-neutral-500">Fat</p>
                </div>
              </div>
              <button className="w-full mt-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-medium">
                Log This Food
              </button>
            </div>
          )}

          {/* Detected Foods List */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">Detected Foods</h2>
              <span className="text-sm text-primary-600 font-medium">{totalCalories} kcal total</span>
            </div>
            <div className="space-y-3">
              {mockDetectedFoods.map((food) => (
                <button
                  key={food.id}
                  onClick={() => setSelectedFood(food)}
                  className="w-full flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🍛</span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{food.name}</p>
                      <p className="text-sm text-neutral-500">
                        P: {food.protein}g &middot; C: {food.carbs}g &middot; F: {food.fat}g
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600">{food.calories} kcal</p>
                    <p className="text-xs text-neutral-400">{food.confidence}% match</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 p-4 bg-primary-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900">Meal Total</span>
                <span className="font-bold text-primary-600">{totalCalories} kcal</span>
              </div>
              <div className="flex gap-4 mt-2 text-sm text-neutral-600">
                <span>Protein: {totalProtein}g</span>
                <span>Carbs: {totalCarbs}g</span>
                <span>Fat: {totalFat}g</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nutrition Overlay Tab */}
      {activeTab === "nutrition" && (
        <div className="space-y-6">
          {/* Overlay Demo */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Nutrition Overlay Demo</h2>
            <p className="text-sm text-neutral-500 mb-4">See how nutrition information appears overlaid on food in AR view.</p>
            <div className="bg-neutral-100 rounded-xl p-6 relative" style={{ minHeight: 300 }}>
              <div className="flex items-center justify-center h-full">
                <span className="text-8xl">🍽️</span>
              </div>
              {/* Mock Overlay Labels */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-3 border border-neutral-200 max-w-[160px]">
                <p className="font-semibold text-neutral-900 text-sm">Dal Bhat</p>
                <div className="mt-1 space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Calories</span>
                    <span className="font-medium text-orange-600">450 kcal</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Protein</span>
                    <span className="font-medium text-red-600">18g</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Carbs</span>
                    <span className="font-medium text-blue-600">65g</span>
                  </div>
                </div>
                <div className="w-3 h-3 bg-white border-l border-b border-neutral-200 rotate-[-45deg] absolute -bottom-1.5 left-6" />
              </div>

              <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-3 border border-neutral-200 max-w-[160px]">
                <p className="font-semibold text-neutral-900 text-sm">Chicken Curry</p>
                <div className="mt-1 space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Calories</span>
                    <span className="font-medium text-orange-600">320 kcal</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Protein</span>
                    <span className="font-medium text-red-600">28g</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Fat</span>
                    <span className="font-medium text-yellow-600">18g</span>
                  </div>
                </div>
                <div className="w-3 h-3 bg-white border-l border-b border-neutral-200 rotate-[-45deg] absolute -bottom-1.5 right-6" />
              </div>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs px-4 py-2 rounded-full font-medium">
                Total: 770 kcal &middot; Tap to log
              </div>
            </div>
          </div>

          {/* Overlay Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Overlay Display Options</h2>
            <div className="space-y-4">
              {[
                { label: "Show Calories", key: "calories", checked: true },
                { label: "Show Macros (P/C/F)", key: "macros", checked: true },
                { label: "Show Fiber", key: "fiber", checked: false },
                { label: "Show Vitamins", key: "vitamins", checked: false },
                { label: "Show Allergens", key: "allergens", checked: true },
                { label: "Show Portion Size", key: "portion", checked: true },
              ].map((option) => (
                <div key={option.key} className="flex items-center justify-between py-2">
                  <span className="text-neutral-700">{option.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={option.checked} className="sr-only peer" />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Calibration Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">AR Calibration</h2>
            <div className="space-y-5">
              {calibration.map((setting) => (
                <div key={setting.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-700">{setting.label}</span>
                    <span className="text-sm font-semibold text-primary-600">{setting.value}{setting.unit}</span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-2">{setting.description}</p>
                  <input
                    type="range"
                    min={setting.min}
                    max={setting.max}
                    value={setting.value}
                    onChange={(e) => handleCalibrationChange(setting.id, Number(e.target.value))}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                  <div className="flex justify-between text-xs text-neutral-400 mt-1">
                    <span>{setting.min}{setting.unit}</span>
                    <span>{setting.max}{setting.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Portion Guide Tab */}
      {activeTab === "portion" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-primary-50 to-green-50 rounded-2xl p-6 border border-primary-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">Visual Portion Reference System</h2>
            <p className="text-sm text-neutral-600">
              Use your hand as a guide to estimate portions. AR will overlay these references on your food in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portionGuides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">{guide.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900">{guide.name}</h3>
                    <p className="text-sm text-primary-600 font-medium">{guide.reference}</p>
                    <p className="text-sm text-neutral-500 mt-1">{guide.visualCue}</p>
                    <div className="mt-2 inline-block bg-neutral-100 text-neutral-600 text-xs px-2 py-1 rounded-full">
                      ~{guide.grams}g per serving
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AR Portion Measurement */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">AR Portion Measurement</h2>
            <div className="bg-neutral-50 rounded-xl p-6 text-center">
              <span className="text-5xl">📐</span>
              <p className="text-neutral-700 font-medium mt-3">Smart Portion Detection</p>
              <p className="text-sm text-neutral-500 mt-1">
                Place a reference object (coin, card) next to your plate. AR will calculate exact portion sizes.
              </p>
              <button className="mt-4 px-6 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-sm font-medium">
                Try Portion Scan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Scan Tab */}
      {activeTab === "menu" && (
        <div className="space-y-6">
          {/* Scan Interface */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="bg-neutral-900 p-8 text-center relative" style={{ minHeight: 250 }}>
              <div className="absolute inset-4 border-2 border-dashed border-neutral-600 rounded-xl flex items-center justify-center">
                {isScanning ? (
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-white mt-4 text-sm">Scanning menu...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="text-5xl">📋</span>
                    <p className="text-neutral-400 mt-3 text-sm">Point camera at restaurant menu</p>
                    <button
                      onClick={handleMenuScan}
                      className="mt-4 px-6 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-sm font-medium"
                    >
                      Start Scanning
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-neutral-900 mb-3">Scanned Menu Items</h3>
              <div className="space-y-3">
                {[
                  { name: "Butter Chicken", cal: 490, price: "NPR 450", healthy: false },
                  { name: "Grilled Chicken Salad", cal: 285, price: "NPR 380", healthy: true },
                  { name: "Paneer Tikka", cal: 340, price: "NPR 350", healthy: true },
                  { name: "Chicken Biryani", cal: 580, price: "NPR 420", healthy: false },
                  { name: "Dal Tadka", cal: 220, price: "NPR 280", healthy: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.healthy ? "bg-green-500" : "bg-orange-500"}`} />
                      <div>
                        <p className="font-medium text-neutral-900">{item.name}</p>
                        <p className="text-xs text-neutral-500">{item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-semibold ${item.healthy ? "text-green-600" : "text-orange-600"}`}>
                        {item.cal} kcal
                      </span>
                      {item.healthy && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Recommended</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Restaurant Tips */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Smart Ordering Tips</h2>
            <div className="space-y-3">
              {[
                { tip: "Choose grilled over fried options to save 200+ calories", icon: "🔥" },
                { tip: "Ask for sauces and dressings on the side", icon: "🥗" },
                { tip: "Start with a soup or salad to reduce main course intake", icon: "🍜" },
                { tip: "Share large portions or take half home", icon: "📦" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                  <span className="text-xl">{item.icon}</span>
                  <p className="text-sm text-neutral-700">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tutorial / Onboarding */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">How AR Food Detection Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tutorialSteps.map((step) => (
            <div key={step.step} className="text-center p-4 bg-neutral-50 rounded-xl">
              <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto font-bold text-sm">
                {step.step}
              </div>
              <span className="text-3xl block mt-3">{step.icon}</span>
              <h4 className="font-semibold text-neutral-900 mt-2">{step.title}</h4>
              <p className="text-xs text-neutral-500 mt-1">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Compatible Devices */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Compatible Devices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {compatibleDevices.map((device, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{device.icon}</span>
                <div>
                  <p className="font-medium text-neutral-900 text-sm">{device.name}</p>
                  <p className="text-xs text-neutral-500">{device.minVersion}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                device.arSupport === "full"
                  ? "bg-green-100 text-green-700"
                  : device.arSupport === "partial"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-neutral-100 text-neutral-600"
              }`}>
                {device.arSupport}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
