"use client";

import { useState, useEffect } from "react";

interface Recipe {
  id: string;
  name: string;
  image: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  ingredients: Ingredient[];
  steps: CookingStep[];
}

interface Ingredient {
  name: string;
  amount: string;
  checked: boolean;
}

interface CookingStep {
  id: number;
  instruction: string;
  duration?: number;
  tip?: string;
  image?: string;
}

interface Timer {
  id: string;
  name: string;
  duration: number;
  remaining: number;
  isRunning: boolean;
  stepId?: number;
}

const sampleRecipe: Recipe = {
  id: "1",
  name: "Grilled Lemon Herb Chicken",
  image: "🍗",
  prepTime: 15,
  cookTime: 25,
  servings: 4,
  difficulty: "easy",
  ingredients: [
    { name: "Chicken breast", amount: "4 pieces (6oz each)", checked: false },
    { name: "Olive oil", amount: "3 tablespoons", checked: false },
    { name: "Lemon juice", amount: "2 tablespoons", checked: false },
    { name: "Garlic", amount: "4 cloves, minced", checked: false },
    { name: "Fresh rosemary", amount: "2 tablespoons, chopped", checked: false },
    { name: "Fresh thyme", amount: "1 tablespoon, chopped", checked: false },
    { name: "Salt", amount: "1 teaspoon", checked: false },
    { name: "Black pepper", amount: "1/2 teaspoon", checked: false },
    { name: "Lemon zest", amount: "1 tablespoon", checked: false },
  ],
  steps: [
    {
      id: 1,
      instruction: "In a large bowl, combine olive oil, lemon juice, minced garlic, rosemary, thyme, salt, pepper, and lemon zest. Mix well to create the marinade.",
      tip: "Use fresh herbs for the best flavor. Dried herbs can be substituted at 1/3 the amount.",
    },
    {
      id: 2,
      instruction: "Place chicken breasts in the marinade, ensuring they are fully coated. Cover and refrigerate for at least 30 minutes, or up to 4 hours for best results.",
      duration: 30,
      tip: "Longer marinating time means more flavorful chicken!",
    },
    {
      id: 3,
      instruction: "Remove chicken from refrigerator 15 minutes before cooking to bring to room temperature. This ensures even cooking.",
      duration: 15,
    },
    {
      id: 4,
      instruction: "Preheat your grill or grill pan to medium-high heat (around 400°F/200°C). Brush grates with oil to prevent sticking.",
      duration: 5,
      tip: "A hot grill creates those beautiful grill marks!",
    },
    {
      id: 5,
      instruction: "Place chicken on the grill. Cook for 6-7 minutes on the first side without moving, until grill marks form.",
      duration: 7,
      tip: "Resist the urge to move the chicken - let it develop a nice sear.",
    },
    {
      id: 6,
      instruction: "Flip the chicken and cook for another 6-7 minutes, or until internal temperature reaches 165°F (74°C).",
      duration: 7,
      tip: "Use a meat thermometer for perfect results every time.",
    },
    {
      id: 7,
      instruction: "Remove from grill and let rest for 5 minutes before slicing. This allows juices to redistribute throughout the meat.",
      duration: 5,
      tip: "Resting is crucial - don't skip this step!",
    },
    {
      id: 8,
      instruction: "Slice and serve with fresh lemon wedges and your favorite sides. Enjoy your perfectly grilled lemon herb chicken!",
    },
  ],
};

const substitutions: Record<string, string[]> = {
  "Olive oil": ["Avocado oil", "Coconut oil", "Butter"],
  "Fresh rosemary": ["Dried rosemary (1 tsp)", "Italian seasoning"],
  "Fresh thyme": ["Dried thyme (1 tsp)", "Oregano"],
  "Lemon juice": ["Lime juice", "White wine vinegar"],
};

export default function CookingPage() {
  const [activeTab, setActiveTab] = useState<"recipes" | "cooking" | "timers">("recipes");
  const [currentRecipe, setCurrentRecipe] = useState<Recipe>(sampleRecipe);
  const [currentStep, setCurrentStep] = useState(0);
  const [ingredients, setIngredients] = useState<Ingredient[]>(sampleRecipe.ingredients);
  const [timers, setTimers] = useState<Timer[]>([]);
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [showSubstitutions, setShowSubstitutions] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) =>
        prev.map((timer) => {
          if (timer.isRunning && timer.remaining > 0) {
            return { ...timer, remaining: timer.remaining - 1 };
          }
          return timer;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const addTimer = (name: string, duration: number, stepId?: number) => {
    const newTimer: Timer = {
      id: Date.now().toString(),
      name,
      duration: duration * 60,
      remaining: duration * 60,
      isRunning: true,
      stepId,
    };
    setTimers((prev) => [...prev, newTimer]);
  };

  const toggleTimer = (id: string) => {
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id ? { ...timer, isRunning: !timer.isRunning } : timer
      )
    );
  };

  const removeTimer = (id: string) => {
    setTimers((prev) => prev.filter((timer) => timer.id !== id));
  };

  const toggleIngredient = (index: number) => {
    setIngredients((prev) =>
      prev.map((ing, i) =>
        i === index ? { ...ing, checked: !ing.checked } : ing
      )
    );
  };

  const nextStep = () => {
    if (currentStep < currentRecipe.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const startCookingMode = () => {
    setIsCookingMode(true);
    setCurrentStep(0);
    setActiveTab("cooking");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Cooking Mode</h1>
          <p className="text-gray-600 mt-1">Step-by-step cooking assistance</p>
        </div>

        {/* Tabs */}
        {!isCookingMode && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: "recipes", label: "Recipes", icon: "📖" },
              { id: "cooking", label: "Cook Now", icon: "👨‍🍳" },
              { id: "timers", label: "Timers", icon: "⏱️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-orange-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-orange-50"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Cooking Mode View */}
        {isCookingMode ? (
          <div className="space-y-6">
            {/* Exit Button */}
            <button
              onClick={() => setIsCookingMode(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              ← Exit Cooking Mode
            </button>

            {/* Recipe Title */}
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <span className="text-5xl">{currentRecipe.image}</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-3">
                {currentRecipe.name}
              </h2>
              <div className="flex justify-center gap-4 mt-2 text-sm text-gray-500">
                <span>Step {currentStep + 1} of {currentRecipe.steps.length}</span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all"
                  style={{
                    width: `${((currentStep + 1) / currentRecipe.steps.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Current Step */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                  {currentStep + 1}
                </span>
                <h3 className="text-lg font-semibold text-gray-900">Current Step</h3>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">
                {currentRecipe.steps[currentStep].instruction}
              </p>

              {currentRecipe.steps[currentStep].tip && (
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-sm text-amber-800">
                    💡 <strong>Tip:</strong> {currentRecipe.steps[currentStep].tip}
                  </p>
                </div>
              )}

              {/* Timer for current step */}
              {currentRecipe.steps[currentStep].duration && (
                <div className="mt-4">
                  <button
                    onClick={() =>
                      addTimer(
                        `Step ${currentStep + 1}`,
                        currentRecipe.steps[currentStep].duration!,
                        currentStep + 1
                      )
                    }
                    className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 transition-colors"
                  >
                    ⏱️ Start {currentRecipe.steps[currentStep].duration} min timer
                  </button>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex-1 px-6 py-4 rounded-xl font-medium transition-colors ${
                  currentStep === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                ← Previous
              </button>
              <button
                onClick={nextStep}
                disabled={currentStep === currentRecipe.steps.length - 1}
                className={`flex-1 px-6 py-4 rounded-xl font-medium transition-colors ${
                  currentStep === currentRecipe.steps.length - 1
                    ? "bg-green-500 text-white"
                    : "bg-orange-600 text-white hover:bg-orange-700"
                }`}
              >
                {currentStep === currentRecipe.steps.length - 1
                  ? "✓ Complete!"
                  : "Next →"}
              </button>
            </div>

            {/* Active Timers (Floating) */}
            {timers.length > 0 && (
              <div className="fixed bottom-4 right-4 space-y-2">
                {timers.map((timer) => (
                  <div
                    key={timer.id}
                    className={`p-4 rounded-xl shadow-lg ${
                      timer.remaining === 0
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-mono font-bold">
                        {formatTime(timer.remaining)}
                      </span>
                      <span className="text-sm">{timer.name}</span>
                      <button
                        onClick={() => toggleTimer(timer.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {timer.isRunning ? "⏸️" : "▶️"}
                      </button>
                      <button
                        onClick={() => removeTimer(timer.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Voice Control Toggle */}
            <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Voice Control</h4>
                <p className="text-sm text-gray-500">Say "next step" or "start timer"</p>
              </div>
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`w-14 h-8 rounded-full transition-colors ${
                  voiceEnabled ? "bg-orange-500" : "bg-gray-200"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform ${
                    voiceEnabled ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Recipes Tab */}
            {activeTab === "recipes" && (
              <div className="space-y-6">
                {/* Recipe Card */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <span className="text-6xl">{currentRecipe.image}</span>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900">
                          {currentRecipe.name}
                        </h2>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                          <span>⏱️ Prep: {currentRecipe.prepTime} min</span>
                          <span>🔥 Cook: {currentRecipe.cookTime} min</span>
                          <span>👥 Serves: {currentRecipe.servings}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full ${
                              currentRecipe.difficulty === "easy"
                                ? "bg-green-100 text-green-700"
                                : currentRecipe.difficulty === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {currentRecipe.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Serving Adjuster */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-2">Adjust servings:</p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() =>
                            setServingMultiplier((prev) => Math.max(0.5, prev - 0.5))
                          }
                          className="w-10 h-10 bg-white rounded-full border border-gray-200 font-bold"
                        >
                          -
                        </button>
                        <span className="text-xl font-bold">
                          {currentRecipe.servings * servingMultiplier} servings
                        </span>
                        <button
                          onClick={() => setServingMultiplier((prev) => prev + 0.5)}
                          className="w-10 h-10 bg-white rounded-full border border-gray-200 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Ingredients
                  </h3>
                  <div className="space-y-3">
                    {ingredients.map((ing, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                          ing.checked ? "bg-green-50" : "bg-gray-50"
                        }`}
                      >
                        <button
                          onClick={() => toggleIngredient(idx)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            ing.checked
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {ing.checked && "✓"}
                        </button>
                        <span
                          className={`flex-1 ${
                            ing.checked ? "text-gray-400 line-through" : "text-gray-700"
                          }`}
                        >
                          {ing.name}
                        </span>
                        <span className="text-sm text-gray-500">{ing.amount}</span>
                        {substitutions[ing.name] && (
                          <button
                            onClick={() =>
                              setShowSubstitutions(
                                showSubstitutions === ing.name ? null : ing.name
                              )
                            }
                            className="text-xs text-orange-600 hover:underline"
                          >
                            Subs
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Substitution Modal */}
                  {showSubstitutions && (
                    <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                      <p className="text-sm font-medium text-orange-800 mb-2">
                        Substitutions for {showSubstitutions}:
                      </p>
                      <ul className="text-sm text-orange-700 space-y-1">
                        {substitutions[showSubstitutions]?.map((sub, idx) => (
                          <li key={idx}>• {sub}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Steps Preview */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Steps ({currentRecipe.steps.length})
                  </h3>
                  <div className="space-y-3">
                    {currentRecipe.steps.slice(0, 3).map((step, idx) => (
                      <div key={step.id} className="flex gap-3">
                        <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {step.instruction}
                        </p>
                      </div>
                    ))}
                    {currentRecipe.steps.length > 3 && (
                      <p className="text-sm text-gray-500 pl-11">
                        +{currentRecipe.steps.length - 3} more steps...
                      </p>
                    )}
                  </div>
                </div>

                {/* Start Cooking Button */}
                <button
                  onClick={startCookingMode}
                  className="w-full p-4 bg-orange-600 text-white rounded-2xl font-semibold text-lg hover:bg-orange-700 transition-colors shadow-lg"
                >
                  👨‍🍳 Start Cooking Mode
                </button>
              </div>
            )}

            {/* Cook Now Tab */}
            {activeTab === "cooking" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <span className="text-6xl">👨‍🍳</span>
                  <h3 className="text-xl font-semibold text-gray-900 mt-4">
                    Ready to Cook?
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Select a recipe and enter step-by-step cooking mode
                  </p>
                  <button
                    onClick={startCookingMode}
                    className="mt-6 px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
                  >
                    Start with {currentRecipe.name}
                  </button>
                </div>

                {/* Recent Recipes */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Recipes</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Grilled Lemon Herb Chicken", emoji: "🍗", time: 40 },
                      { name: "Vegetable Stir Fry", emoji: "🥦", time: 20 },
                      { name: "Pasta Primavera", emoji: "🍝", time: 30 },
                    ].map((recipe, idx) => (
                      <button
                        key={idx}
                        className="w-full p-4 bg-gray-50 hover:bg-orange-50 rounded-xl flex items-center gap-3 transition-colors"
                      >
                        <span className="text-3xl">{recipe.emoji}</span>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-gray-900">{recipe.name}</p>
                          <p className="text-sm text-gray-500">{recipe.time} min</p>
                        </div>
                        <span className="text-orange-600">Cook →</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Timers Tab */}
            {activeTab === "timers" && (
              <div className="space-y-6">
                {/* Quick Timers */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Timers</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {[1, 3, 5, 10, 15, 30].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => addTimer(`${mins} min timer`, mins)}
                        className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl text-center transition-colors"
                      >
                        <p className="text-xl font-bold text-orange-600">{mins}</p>
                        <p className="text-sm text-gray-600">min</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Timer */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Custom Timer</h3>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Minutes"
                      className="flex-1 p-3 border border-gray-200 rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="Label (optional)"
                      className="flex-1 p-3 border border-gray-200 rounded-xl"
                    />
                    <button className="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium">
                      Start
                    </button>
                  </div>
                </div>

                {/* Active Timers */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Active Timers</h3>
                  {timers.length > 0 ? (
                    <div className="space-y-3">
                      {timers.map((timer) => (
                        <div
                          key={timer.id}
                          className={`p-4 rounded-xl flex items-center justify-between ${
                            timer.remaining === 0
                              ? "bg-red-100 border-2 border-red-300"
                              : "bg-gray-50"
                          }`}
                        >
                          <div>
                            <p className="font-medium text-gray-900">{timer.name}</p>
                            <p className="text-sm text-gray-500">
                              {timer.remaining === 0
                                ? "Timer complete!"
                                : `${Math.floor(timer.remaining / 60)}:${(
                                    timer.remaining % 60
                                  )
                                    .toString()
                                    .padStart(2, "0")} remaining`}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-3xl font-mono font-bold text-orange-600">
                              {formatTime(timer.remaining)}
                            </span>
                            <button
                              onClick={() => toggleTimer(timer.id)}
                              className="p-2 bg-white rounded-lg border border-gray-200"
                            >
                              {timer.isRunning ? "⏸️" : "▶️"}
                            </button>
                            <button
                              onClick={() => removeTimer(timer.id)}
                              className="p-2 bg-white rounded-lg border border-gray-200 text-red-500"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <span className="text-4xl">⏱️</span>
                      <p className="mt-2">No active timers</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
