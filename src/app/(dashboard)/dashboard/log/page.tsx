"use client";

import { useState, useMemo } from "react";
import { Button, Input, Card, CardHeader } from "@/components/ui";
import { searchFoods, getPopularFoods, foods as allFoods } from "@/data/foods";
import { useFoodLogStore, getTodayDateString } from "@/store/foodLogStore";
import { useGamificationStore } from "@/store/gamificationStore";
import type { Food, MealType, Nutrition } from "@/types";

const mealTypes: { type: MealType; label: string; icon: string; time: string }[] = [
  { type: "breakfast", label: "Breakfast", icon: "☀️", time: "6am - 10am" },
  { type: "lunch", label: "Lunch", icon: "🌞", time: "11am - 2pm" },
  { type: "dinner", label: "Dinner", icon: "🌙", time: "6pm - 9pm" },
  { type: "snack", label: "Snack", icon: "🍎", time: "Anytime" },
];

// Tab modes for food logging
type LogMode = "search" | "custom" | "meal_builder" | "quick_add" | "voice" | "photo";

// Component for a meal (used in meal builder)
interface MealComponent {
  id: string;
  food: Food;
  grams: number;
  nutrition: Nutrition;
}

export default function FoodLogPage() {
  // Basic states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<MealType>("breakfast");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [logMode, setLogMode] = useState<LogMode>("search");

  // Manual gram input
  const [manualGrams, setManualGrams] = useState<string>("");
  const [useManualGrams, setUseManualGrams] = useState(false);

  // Serving size selection
  const [selectedServingIndex, setSelectedServingIndex] = useState<number>(-1); // -1 = custom
  const [quantity, setQuantity] = useState(1);

  // Meal builder states
  const [mealComponents, setMealComponents] = useState<MealComponent[]>([]);
  const [mealName, setMealName] = useState("");
  const [componentSearchQuery, setComponentSearchQuery] = useState("");

  // Custom food states
  const [customFood, setCustomFood] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    grams: "100",
  });

  // Quick add states
  const [quickCalories, setQuickCalories] = useState("");
  const [quickName, setQuickName] = useState("");

  // Voice logging states
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [voiceProcessing, setVoiceProcessing] = useState(false);
  const [voiceParsedFood, setVoiceParsedFood] = useState<{name: string; grams: number; calories: number} | null>(null);

  // Photo logging states
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoAnalyzing, setPhotoAnalyzing] = useState(false);
  const [photoResult, setPhotoResult] = useState<{name: string; grams: number; calories: number; confidence: number} | null>(null);

  const { addFoodToMeal, removeFoodFromMeal, getDailyLog } = useFoodLogStore();
  const { recordMealLogged, recordDailyLog } = useGamificationStore();
  const todayDate = getTodayDateString();
  const dailyLog = getDailyLog(todayDate);

  // Helper to add food and record achievement
  const addFoodWithAchievement = (date: string, mealType: MealType, food: Food, grams: number, qty: number) => {
    addFoodToMeal(date, mealType, food, grams, qty);
    recordMealLogged();
    recordDailyLog(date);
  };

  // Search results
  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 2) {
      return getPopularFoods(10);
    }
    return searchFoods(searchQuery);
  }, [searchQuery]);

  // Component search results
  const componentSearchResults = useMemo(() => {
    if (componentSearchQuery.trim().length < 2) {
      return allFoods.slice(0, 6);
    }
    return searchFoods(componentSearchQuery).slice(0, 6);
  }, [componentSearchQuery]);

  // Calculate effective grams
  const effectiveGrams = useMemo(() => {
    if (!selectedFood) return 0;
    if (useManualGrams && manualGrams) {
      return parseFloat(manualGrams) || 0;
    }
    if (selectedServingIndex === -1) {
      return parseFloat(manualGrams) || selectedFood.defaultServing.grams;
    }
    if (selectedServingIndex === 0) {
      return selectedFood.defaultServing.grams * quantity;
    }
    const portion = selectedFood.alternativePortions?.[selectedServingIndex - 1];
    return portion ? portion.grams * quantity : selectedFood.defaultServing.grams * quantity;
  }, [selectedFood, useManualGrams, manualGrams, selectedServingIndex, quantity]);

  // Calculate nutrition preview
  const nutritionPreview = useMemo(() => {
    if (!selectedFood) return null;
    const multiplier = effectiveGrams / 100;
    return {
      calories: Math.round(selectedFood.nutritionPer100g.calories * multiplier),
      protein: Math.round(selectedFood.nutritionPer100g.protein * multiplier * 10) / 10,
      carbs: Math.round(selectedFood.nutritionPer100g.carbohydrates * multiplier * 10) / 10,
      fat: Math.round(selectedFood.nutritionPer100g.fat * multiplier * 10) / 10,
      fiber: Math.round(selectedFood.nutritionPer100g.fiber * multiplier * 10) / 10,
    };
  }, [selectedFood, effectiveGrams]);

  // Calculate meal builder total
  const mealBuilderTotal = useMemo(() => {
    return mealComponents.reduce(
      (acc, comp) => ({
        calories: acc.calories + comp.nutrition.calories,
        protein: acc.protein + comp.nutrition.protein,
        carbs: acc.carbs + comp.nutrition.carbohydrates,
        fat: acc.fat + comp.nutrition.fat,
        grams: acc.grams + comp.grams,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, grams: 0 }
    );
  }, [mealComponents]);

  // Handle food selection
  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setManualGrams(String(food.defaultServing.grams));
    setSelectedServingIndex(0);
    setQuantity(1);
    setUseManualGrams(false);
  };

  // Handle adding food to meal
  const handleAddFood = () => {
    if (!selectedFood) return;
    addFoodWithAchievement(todayDate, selectedMeal, selectedFood, effectiveGrams, 1);
    setSelectedFood(null);
    setSearchQuery("");
    setManualGrams("");
    setQuantity(1);
    setUseManualGrams(false);
  };

  // Add component to meal builder
  const addComponent = (food: Food, grams: number) => {
    const multiplier = grams / 100;
    const nutrition: Nutrition = {
      calories: Math.round(food.nutritionPer100g.calories * multiplier),
      protein: Math.round(food.nutritionPer100g.protein * multiplier * 10) / 10,
      carbohydrates: Math.round(food.nutritionPer100g.carbohydrates * multiplier * 10) / 10,
      fat: Math.round(food.nutritionPer100g.fat * multiplier * 10) / 10,
      fiber: Math.round(food.nutritionPer100g.fiber * multiplier * 10) / 10,
      sugar: Math.round(food.nutritionPer100g.sugar * multiplier * 10) / 10,
      sodium: Math.round(food.nutritionPer100g.sodium * multiplier),
    };

    setMealComponents([
      ...mealComponents,
      { id: `${food.id}-${Date.now()}`, food, grams, nutrition },
    ]);
    setComponentSearchQuery("");
  };

  // Remove component from meal builder
  const removeComponent = (id: string) => {
    setMealComponents(mealComponents.filter((c) => c.id !== id));
  };

  // Save meal builder as entry
  const saveMealBuilder = () => {
    if (mealComponents.length === 0) return;

    // Add each component individually
    mealComponents.forEach((comp) => {
      addFoodWithAchievement(todayDate, selectedMeal, comp.food, comp.grams, 1);
    });

    // Reset
    setMealComponents([]);
    setMealName("");
    setLogMode("search");
  };

  // Handle custom food add
  const handleAddCustomFood = () => {
    if (!customFood.name || !customFood.calories) return;

    // Create a temporary custom food object
    const tempFood: Food = {
      id: `custom-${Date.now()}`,
      name: customFood.name,
      slug: customFood.name.toLowerCase().replace(/\s+/g, "-"),
      category: "main_course",
      cuisine: [],
      mealType: [selectedMeal],
      defaultServing: { name: "serving", grams: parseFloat(customFood.grams) || 100 },
      alternativePortions: [],
      nutritionPer100g: {
        calories: (parseFloat(customFood.calories) / (parseFloat(customFood.grams) || 100)) * 100,
        protein: (parseFloat(customFood.protein || "0") / (parseFloat(customFood.grams) || 100)) * 100,
        carbohydrates: (parseFloat(customFood.carbs || "0") / (parseFloat(customFood.grams) || 100)) * 100,
        fat: (parseFloat(customFood.fat || "0") / (parseFloat(customFood.grams) || 100)) * 100,
        fiber: 0,
        sugar: 0,
        sodium: 0,
      },
      tags: ["custom"],
      fastingSuitable: false,
      allergens: [],
      images: [],
      verified: false,
      source: "user_submitted",
      timesLogged: 0,
      popularityScore: 0,
    };

    addFoodWithAchievement(todayDate, selectedMeal, tempFood, parseFloat(customFood.grams) || 100, 1);

    // Reset
    setCustomFood({ name: "", calories: "", protein: "", carbs: "", fat: "", grams: "100" });
    setLogMode("search");
  };

  // Handle quick add
  const handleQuickAdd = () => {
    if (!quickCalories) return;

    const tempFood: Food = {
      id: `quick-${Date.now()}`,
      name: quickName || `Quick Entry (${quickCalories} cal)`,
      slug: `quick-${Date.now()}`,
      category: "main_course",
      cuisine: [],
      mealType: [selectedMeal],
      defaultServing: { name: "serving", grams: 100 },
      alternativePortions: [],
      nutritionPer100g: {
        calories: parseFloat(quickCalories),
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
      },
      tags: ["quick_add"],
      fastingSuitable: false,
      allergens: [],
      images: [],
      verified: false,
      source: "user_submitted",
      timesLogged: 0,
      popularityScore: 0,
    };

    addFoodWithAchievement(todayDate, selectedMeal, tempFood, 100, 1);
    setQuickCalories("");
    setQuickName("");
    setLogMode("search");
  };

  // Handle voice recording
  const handleVoiceRecord = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setVoiceProcessing(true);

      // Simulate voice recognition processing
      setTimeout(() => {
        // Parse common voice inputs
        const samplePhrases = [
          { text: "I had 200 grams of rice for lunch", food: "Rice", grams: 200, calories: 260 },
          { text: "Ate 2 rotis with dal", food: "Roti with Dal", grams: 180, calories: 340 },
          { text: "Had a cup of chai", food: "Chai", grams: 150, calories: 90 },
          { text: "One bowl of chicken curry", food: "Chicken Curry", grams: 250, calories: 380 },
        ];
        const randomResult = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
        setVoiceText(randomResult.text);
        setVoiceParsedFood({ name: randomResult.food, grams: randomResult.grams, calories: randomResult.calories });
        setVoiceProcessing(false);
      }, 2000);
    } else {
      // Start recording
      setIsRecording(true);
      setVoiceText("");
      setVoiceParsedFood(null);
    }
  };

  // Handle voice food add
  const handleAddVoiceFood = () => {
    if (!voiceParsedFood) return;

    const tempFood: Food = {
      id: `voice-${Date.now()}`,
      name: voiceParsedFood.name,
      slug: `voice-${Date.now()}`,
      category: "main_course",
      cuisine: [],
      mealType: [selectedMeal],
      defaultServing: { name: "serving", grams: voiceParsedFood.grams },
      alternativePortions: [],
      nutritionPer100g: {
        calories: (voiceParsedFood.calories / voiceParsedFood.grams) * 100,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
      },
      tags: ["voice_logged"],
      fastingSuitable: false,
      allergens: [],
      images: [],
      verified: false,
      source: "user_submitted",
      timesLogged: 0,
      popularityScore: 0,
    };

    addFoodWithAchievement(todayDate, selectedMeal, tempFood, voiceParsedFood.grams, 1);
    setVoiceText("");
    setVoiceParsedFood(null);
    setLogMode("search");
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
      setPhotoAnalyzing(true);
      setPhotoResult(null);

      // Simulate AI photo analysis
      setTimeout(() => {
        const possibleResults = [
          { name: "Dal Bhat Tarkari", grams: 400, calories: 520, confidence: 92 },
          { name: "Momo (8 pieces)", grams: 200, calories: 340, confidence: 88 },
          { name: "Chicken Biryani", grams: 350, calories: 580, confidence: 85 },
          { name: "Mixed Vegetable Curry", grams: 200, calories: 180, confidence: 90 },
        ];
        const result = possibleResults[Math.floor(Math.random() * possibleResults.length)];
        setPhotoResult(result);
        setPhotoAnalyzing(false);
      }, 3000);
    };
    reader.readAsDataURL(file);
  };

  // Handle photo food add
  const handleAddPhotoFood = () => {
    if (!photoResult) return;

    const tempFood: Food = {
      id: `photo-${Date.now()}`,
      name: photoResult.name,
      slug: `photo-${Date.now()}`,
      category: "main_course",
      cuisine: [],
      mealType: [selectedMeal],
      defaultServing: { name: "serving", grams: photoResult.grams },
      alternativePortions: [],
      nutritionPer100g: {
        calories: (photoResult.calories / photoResult.grams) * 100,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
      },
      tags: ["photo_logged"],
      fastingSuitable: false,
      allergens: [],
      images: [],
      verified: false,
      source: "user_submitted",
      timesLogged: 0,
      popularityScore: 0,
    };

    addFoodWithAchievement(todayDate, selectedMeal, tempFood, photoResult.grams, 1);
    setPhotoPreview(null);
    setPhotoResult(null);
    setLogMode("search");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Log Food</h1>
        <p className="text-neutral-500">Track what you eat with precision</p>
      </div>

      {/* Meal Type Selection */}
      <div className="grid grid-cols-4 gap-2">
        {mealTypes.map((meal) => (
          <button
            key={meal.type}
            onClick={() => setSelectedMeal(meal.type)}
            className={`p-3 rounded-xl text-center transition-all ${
              selectedMeal === meal.type
                ? "bg-primary-500 text-white shadow-lg"
                : "bg-white border border-neutral-200 hover:border-primary-300"
            }`}
          >
            <span className="text-2xl block mb-1">{meal.icon}</span>
            <span className="text-sm font-medium block">{meal.label}</span>
            <span className={`text-xs ${selectedMeal === meal.type ? "text-primary-100" : "text-neutral-400"}`}>
              {dailyLog.meals[meal.type].length} items
            </span>
          </button>
        ))}
      </div>

      {/* Log Mode Tabs */}
      <div className="flex bg-neutral-100 rounded-xl p-1 gap-1 overflow-x-auto">
        {[
          { mode: "search" as LogMode, label: "Search", icon: "🔍" },
          { mode: "voice" as LogMode, label: "Voice", icon: "🎤" },
          { mode: "photo" as LogMode, label: "Photo", icon: "📷" },
          { mode: "meal_builder" as LogMode, label: "Build", icon: "🍽️" },
          { mode: "custom" as LogMode, label: "Custom", icon: "✏️" },
          { mode: "quick_add" as LogMode, label: "Quick", icon: "⚡" },
        ].map((tab) => (
          <button
            key={tab.mode}
            onClick={() => {
              setLogMode(tab.mode);
              setSelectedFood(null);
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
              logMode === tab.mode
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search Mode */}
      {logMode === "search" && (
        <>
          <Card>
            <Input
              placeholder="Search foods... (rice, dal, momo, 250g chicken...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            <p className="text-xs text-neutral-400 mt-2">
              Tip: You can search &quot;250g rice&quot; or &quot;chicken 150 grams&quot;
            </p>
          </Card>

          {/* Selected Food Panel with Manual Gram Input */}
          {selectedFood && (
            <Card className="border-2 border-primary-500">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">{selectedFood.name}</h3>
                  {selectedFood.nameNepali && (
                    <p className="text-sm text-neutral-500">{selectedFood.nameNepali}</p>
                  )}
                  <p className="text-xs text-neutral-400 mt-1">
                    Per 100g: {selectedFood.nutritionPer100g.calories} cal |
                    P: {selectedFood.nutritionPer100g.protein}g |
                    C: {selectedFood.nutritionPer100g.carbohydrates}g |
                    F: {selectedFood.nutritionPer100g.fat}g
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFood(null)}
                  className="p-1 hover:bg-neutral-100 rounded-lg"
                >
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Serving Size Options */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Serving Size
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    onClick={() => {
                      setSelectedServingIndex(0);
                      setManualGrams(String(selectedFood.defaultServing.grams));
                      setUseManualGrams(false);
                    }}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedServingIndex === 0 && !useManualGrams
                        ? "bg-primary-500 text-white"
                        : "bg-neutral-100 hover:bg-neutral-200"
                    }`}
                  >
                    {selectedFood.defaultServing.name} ({selectedFood.defaultServing.grams}g)
                  </button>
                  {selectedFood.alternativePortions?.map((portion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedServingIndex(idx + 1);
                        setManualGrams(String(portion.grams));
                        setUseManualGrams(false);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedServingIndex === idx + 1 && !useManualGrams
                          ? "bg-primary-500 text-white"
                          : "bg-neutral-100 hover:bg-neutral-200"
                      }`}
                    >
                      {portion.name} ({portion.grams}g)
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setUseManualGrams(true);
                      setSelectedServingIndex(-1);
                    }}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      useManualGrams
                        ? "bg-primary-500 text-white"
                        : "bg-neutral-100 hover:bg-neutral-200"
                    }`}
                  >
                    Custom grams
                  </button>
                </div>

                {/* Manual Gram Input */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="number"
                        value={manualGrams}
                        onChange={(e) => {
                          setManualGrams(e.target.value);
                          setUseManualGrams(true);
                        }}
                        placeholder="Enter grams"
                        className="w-full px-4 py-3 pr-12 bg-white border-2 border-neutral-200 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">
                        grams
                      </span>
                    </div>
                  </div>
                  {!useManualGrams && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-500">×</span>
                      <button
                        onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
                        className="w-10 h-10 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-xl font-semibold w-10 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 0.5)}
                        className="w-10 h-10 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick gram buttons */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {[50, 100, 150, 200, 250, 300].map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        setManualGrams(String(g));
                        setUseManualGrams(true);
                      }}
                      className="px-3 py-1 text-xs rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all"
                    >
                      {g}g
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Weight Display */}
              <div className="bg-blue-50 rounded-xl p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">Total Weight:</span>
                  <span className="text-xl font-bold text-blue-700">{effectiveGrams}g</span>
                </div>
              </div>

              {/* Nutrition Preview */}
              {nutritionPreview && (
                <div className="bg-neutral-50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-neutral-600 mb-3 font-medium">
                    Nutrition for {effectiveGrams}g:
                  </p>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-xl font-bold text-primary-600">{nutritionPreview.calories}</p>
                      <p className="text-xs text-neutral-500">Calories</p>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-xl font-bold text-blue-600">{nutritionPreview.protein}g</p>
                      <p className="text-xs text-neutral-500">Protein</p>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-xl font-bold text-orange-600">{nutritionPreview.carbs}g</p>
                      <p className="text-xs text-neutral-500">Carbs</p>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-xl font-bold text-yellow-600">{nutritionPreview.fat}g</p>
                      <p className="text-xs text-neutral-500">Fat</p>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-xl font-bold text-green-600">{nutritionPreview.fiber}g</p>
                      <p className="text-xs text-neutral-500">Fiber</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Button */}
              <Button onClick={handleAddFood} fullWidth size="lg">
                Add {effectiveGrams}g to {mealTypes.find((m) => m.type === selectedMeal)?.label}
              </Button>
            </Card>
          )}

          {/* Search Results */}
          {!selectedFood && (
            <Card>
              <CardHeader
                title={searchQuery.trim().length < 2 ? "Popular Foods" : `Results for "${searchQuery}"`}
                subtitle={`${searchResults.length} foods found`}
              />

              <div className="space-y-2">
                {searchResults.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => handleSelectFood(food)}
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-all text-left border border-transparent hover:border-neutral-200"
                  >
                    <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center text-2xl">
                      {food.category === "main_course" && "🍛"}
                      {food.category === "breakfast" && "🥣"}
                      {food.category === "snack" && "🍿"}
                      {food.category === "beverage" && "☕"}
                      {food.category === "dessert" && "🍮"}
                      {food.category === "side_dish" && "🥗"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 truncate">{food.name}</p>
                      <p className="text-sm text-neutral-500">
                        {food.defaultServing.name} ({food.defaultServing.grams}g) • {Math.round(food.nutritionPer100g.calories * food.defaultServing.grams / 100)} cal
                      </p>
                      <p className="text-xs text-neutral-400">
                        Per 100g: {food.nutritionPer100g.calories} cal
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* Meal Builder Mode */}
      {logMode === "meal_builder" && (
        <Card>
          <CardHeader
            title="Build Your Meal"
            subtitle="Add individual components with exact weights"
          />

          {/* Meal Name */}
          <Input
            label="Meal Name (optional)"
            placeholder="e.g., Dal Bhat Tarkari Set"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className="mb-4"
          />

          {/* Component Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Add Components
            </label>
            <Input
              placeholder="Search ingredients... (rice, dal, sabji...)"
              value={componentSearchQuery}
              onChange={(e) => setComponentSearchQuery(e.target.value)}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />

            {componentSearchQuery && (
              <div className="mt-2 border rounded-xl divide-y">
                {componentSearchResults.map((food) => (
                  <ComponentAddRow
                    key={food.id}
                    food={food}
                    onAdd={(grams) => addComponent(food, grams)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Added Components */}
          {mealComponents.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Components ({mealComponents.length})
              </label>
              <div className="space-y-2">
                {mealComponents.map((comp) => (
                  <div
                    key={comp.id}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900">{comp.food.name}</p>
                      <p className="text-sm text-neutral-500">
                        {comp.grams}g • {comp.nutrition.calories} cal • P: {comp.nutrition.protein}g
                      </p>
                    </div>
                    <button
                      onClick={() => removeComponent(comp.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Nutrition */}
          {mealComponents.length > 0 && (
            <div className="bg-primary-50 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-primary-700 mb-2">
                Meal Total ({mealBuilderTotal.grams}g):
              </p>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-primary-600">{mealBuilderTotal.calories}</p>
                  <p className="text-xs text-primary-500">Calories</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-primary-600">{mealBuilderTotal.protein.toFixed(1)}g</p>
                  <p className="text-xs text-primary-500">Protein</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-primary-600">{mealBuilderTotal.carbs.toFixed(1)}g</p>
                  <p className="text-xs text-primary-500">Carbs</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-primary-600">{mealBuilderTotal.fat.toFixed(1)}g</p>
                  <p className="text-xs text-primary-500">Fat</p>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={saveMealBuilder}
            fullWidth
            size="lg"
            disabled={mealComponents.length === 0}
          >
            Add Meal to {mealTypes.find((m) => m.type === selectedMeal)?.label}
          </Button>
        </Card>
      )}

      {/* Custom Food Mode */}
      {logMode === "custom" && (
        <Card>
          <CardHeader
            title="Add Custom Food"
            subtitle="Enter nutrition information manually"
          />

          <div className="space-y-4">
            <Input
              label="Food Name *"
              placeholder="e.g., Homemade Khichdi"
              value={customFood.name}
              onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
            />

            <Input
              label="Amount (grams) *"
              type="number"
              placeholder="100"
              value={customFood.grams}
              onChange={(e) => setCustomFood({ ...customFood, grams: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Calories *"
                type="number"
                placeholder="250"
                value={customFood.calories}
                onChange={(e) => setCustomFood({ ...customFood, calories: e.target.value })}
              />
              <Input
                label="Protein (g)"
                type="number"
                placeholder="10"
                value={customFood.protein}
                onChange={(e) => setCustomFood({ ...customFood, protein: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Carbs (g)"
                type="number"
                placeholder="30"
                value={customFood.carbs}
                onChange={(e) => setCustomFood({ ...customFood, carbs: e.target.value })}
              />
              <Input
                label="Fat (g)"
                type="number"
                placeholder="8"
                value={customFood.fat}
                onChange={(e) => setCustomFood({ ...customFood, fat: e.target.value })}
              />
            </div>

            {/* Preview */}
            {customFood.calories && (
              <div className="bg-neutral-50 rounded-xl p-4">
                <p className="text-sm font-medium text-neutral-700 mb-2">Preview:</p>
                <p className="text-neutral-600">
                  {customFood.name || "Custom Food"} - {customFood.grams}g
                </p>
                <p className="text-sm text-neutral-500">
                  {customFood.calories} cal | P: {customFood.protein || 0}g | C: {customFood.carbs || 0}g | F: {customFood.fat || 0}g
                </p>
              </div>
            )}

            <Button
              onClick={handleAddCustomFood}
              fullWidth
              size="lg"
              disabled={!customFood.name || !customFood.calories}
            >
              Add Custom Food to {mealTypes.find((m) => m.type === selectedMeal)?.label}
            </Button>
          </div>
        </Card>
      )}

      {/* Quick Add Mode */}
      {logMode === "quick_add" && (
        <Card>
          <CardHeader
            title="Quick Calorie Entry"
            subtitle="Just log calories when you're in a hurry"
          />

          <div className="space-y-4">
            <Input
              label="Name (optional)"
              placeholder="e.g., Restaurant meal"
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Calories *
              </label>
              <input
                type="number"
                value={quickCalories}
                onChange={(e) => setQuickCalories(e.target.value)}
                placeholder="500"
                className="w-full px-4 py-4 text-3xl font-bold text-center bg-white border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Quick buttons */}
            <div className="flex flex-wrap gap-2">
              {[100, 200, 300, 400, 500, 600, 700, 800].map((cal) => (
                <button
                  key={cal}
                  onClick={() => setQuickCalories(String(cal))}
                  className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-sm font-medium"
                >
                  {cal} cal
                </button>
              ))}
            </div>

            <Button
              onClick={handleQuickAdd}
              fullWidth
              size="lg"
              disabled={!quickCalories}
            >
              Add {quickCalories || "0"} Calories to {mealTypes.find((m) => m.type === selectedMeal)?.label}
            </Button>
          </div>
        </Card>
      )}

      {/* Voice Logging Mode */}
      {logMode === "voice" && (
        <Card>
          <CardHeader
            title="Voice Logging"
            subtitle="Say what you ate and we'll log it"
          />

          <div className="space-y-6 text-center py-4">
            {/* Microphone Button */}
            <button
              onClick={handleVoiceRecord}
              disabled={voiceProcessing}
              className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all ${
                isRecording
                  ? "bg-red-500 animate-pulse"
                  : voiceProcessing
                  ? "bg-neutral-300"
                  : "bg-primary-500 hover:bg-primary-600"
              }`}
            >
              {voiceProcessing ? (
                <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              )}
            </button>

            <p className="text-neutral-600">
              {isRecording
                ? "🔴 Listening... Tap to stop"
                : voiceProcessing
                ? "Processing your voice..."
                : "Tap the microphone and say what you ate"}
            </p>

            {/* Example phrases */}
            {!voiceText && !isRecording && !voiceProcessing && (
              <div className="bg-neutral-50 rounded-xl p-4 text-left">
                <p className="text-sm font-medium text-neutral-700 mb-2">Try saying:</p>
                <ul className="text-sm text-neutral-500 space-y-1">
                  <li>• "I had 200 grams of rice for lunch"</li>
                  <li>• "Ate 2 rotis with dal"</li>
                  <li>• "One bowl of chicken curry"</li>
                  <li>• "Had a cup of chai with 2 biscuits"</li>
                </ul>
              </div>
            )}

            {/* Transcribed text */}
            {voiceText && (
              <div className="bg-blue-50 rounded-xl p-4 text-left">
                <p className="text-sm font-medium text-blue-700 mb-2">You said:</p>
                <p className="text-blue-900 italic">"{voiceText}"</p>
              </div>
            )}

            {/* Parsed result */}
            {voiceParsedFood && (
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm font-medium text-green-700 mb-3">Detected:</p>
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="font-semibold text-neutral-900">{voiceParsedFood.name}</p>
                    <p className="text-sm text-neutral-500">{voiceParsedFood.grams}g • {voiceParsedFood.calories} cal</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => { setVoiceText(""); setVoiceParsedFood(null); }}>
                      Try Again
                    </Button>
                    <Button size="sm" onClick={handleAddVoiceFood}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Note */}
            <p className="text-xs text-neutral-400">
              🎤 Voice recognition demo mode. In production, this would use Web Speech API.
            </p>
          </div>
        </Card>
      )}

      {/* Photo Logging Mode */}
      {logMode === "photo" && (
        <Card>
          <CardHeader
            title="Photo Logging"
            subtitle="Take a photo of your food for instant logging"
          />

          <div className="space-y-6">
            {/* Photo Upload Area */}
            {!photoPreview && (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-primary-400 hover:bg-primary-50 transition-all">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="font-medium text-neutral-700 mb-1">Take or upload a photo</p>
                  <p className="text-sm text-neutral-500">Our AI will identify the food and estimate calories</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}

            {/* Photo Preview */}
            {photoPreview && (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Food preview"
                  className="w-full h-64 object-cover rounded-xl"
                />
                {!photoAnalyzing && !photoResult && (
                  <button
                    onClick={() => setPhotoPreview(null)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {/* Analyzing Overlay */}
                {photoAnalyzing && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <svg className="w-12 h-12 animate-spin mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="font-medium">Analyzing your food...</p>
                      <p className="text-sm text-white/70">AI is identifying ingredients</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Analysis Result */}
            {photoResult && (
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-green-700">AI Detection Result</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {photoResult.confidence}% confident
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-neutral-900 text-lg">{photoResult.name}</p>
                    <p className="text-neutral-500">
                      Estimated: {photoResult.grams}g • {photoResult.calories} calories
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => {
                      setPhotoPreview(null);
                      setPhotoResult(null);
                    }}
                  >
                    Retake Photo
                  </Button>
                  <Button fullWidth onClick={handleAddPhotoFood}>
                    Add to {mealTypes.find((m) => m.type === selectedMeal)?.label}
                  </Button>
                </div>
              </div>
            )}

            {/* Tips */}
            {!photoPreview && (
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm font-medium text-blue-700 mb-2">📷 Photo Tips:</p>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• Good lighting helps accuracy</li>
                  <li>• Include all items in the frame</li>
                  <li>• Top-down angle works best</li>
                  <li>• Avoid blurry photos</li>
                </ul>
              </div>
            )}

            {/* Note */}
            <p className="text-xs text-neutral-400 text-center">
              📸 Photo recognition demo mode. In production, this would use AI vision models.
            </p>
          </div>
        </Card>
      )}

      {/* Today's Log Summary */}
      <Card>
        <CardHeader
          title="Today's Log"
          action={
            <span className="text-sm text-neutral-500">
              {Object.values(dailyLog.meals).flat().length} items • {dailyLog.totalNutrition.calories} cal
            </span>
          }
        />

        {mealTypes.map((meal) => {
          const mealFoods = dailyLog.meals[meal.type];
          if (mealFoods.length === 0) return null;

          const mealCalories = mealFoods.reduce((sum, f) => sum + f.nutrition.calories, 0);
          const mealProtein = mealFoods.reduce((sum, f) => sum + f.nutrition.protein, 0);

          return (
            <div key={meal.type} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{meal.icon}</span>
                  <span className="font-medium text-neutral-900">{meal.label}</span>
                </div>
                <span className="text-sm text-neutral-500">{mealCalories} cal | {mealProtein.toFixed(1)}g protein</span>
              </div>
              <div className="space-y-1 pl-8">
                {mealFoods.map((food, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm py-2 px-3 bg-neutral-50 rounded-lg">
                    <div className="flex-1">
                      <span className="text-neutral-900 font-medium">{food.food.name}</span>
                      <span className="text-neutral-400 ml-2">
                        {food.servingSize.grams}g
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-600">{food.nutrition.calories} cal</span>
                      <button
                        onClick={() => removeFoodFromMeal(todayDate, meal.type, idx)}
                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {Object.values(dailyLog.meals).flat().length === 0 && (
          <div className="text-center py-6 text-neutral-500">
            <p className="text-4xl mb-2">🍽️</p>
            <p>No foods logged today</p>
            <p className="text-sm">Start by searching for a food above</p>
          </div>
        )}
      </Card>
    </div>
  );
}

// Component for adding ingredients with gram input
function ComponentAddRow({ food, onAdd }: { food: Food; onAdd: (grams: number) => void }) {
  const [grams, setGrams] = useState(String(food.defaultServing.grams));

  return (
    <div className="flex items-center gap-3 p-3">
      <div className="flex-1">
        <p className="font-medium text-neutral-900 text-sm">{food.name}</p>
        <p className="text-xs text-neutral-500">
          Per 100g: {food.nutritionPer100g.calories} cal
        </p>
      </div>
      <input
        type="number"
        value={grams}
        onChange={(e) => setGrams(e.target.value)}
        className="w-20 px-2 py-1 text-sm border rounded-lg text-center"
        placeholder="grams"
      />
      <span className="text-xs text-neutral-400">g</span>
      <Button
        size="sm"
        onClick={() => onAdd(parseFloat(grams) || food.defaultServing.grams)}
      >
        Add
      </Button>
    </div>
  );
}
