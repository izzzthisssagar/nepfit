"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, Button } from "@/components/ui";
import {
  useMealPlanStore,
  systemMealPlans,
  getMealPlanById,
  type MealPlan,
  type DayPlan,
} from "@/store/mealPlanStore";

type GoalFilter = "all" | "weight_loss" | "muscle_gain" | "maintenance" | "diabetic_friendly" | "high_protein";

export default function MealPlansPage() {
  const [selectedGoal, setSelectedGoal] = useState<GoalFilter>("all");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showDayModal, setShowDayModal] = useState<{ plan: MealPlan; dayIndex: number } | null>(null);

  const {
    activePlanId,
    activePlanStartDate,
    savedPlans,
    startPlan,
    stopPlan,
    savePlan,
    unsavePlan,
    getCurrentDayPlan,
  } = useMealPlanStore();

  const currentDayPlan = getCurrentDayPlan();

  // Filter plans based on selected goal
  const filteredPlans = useMemo(() => {
    if (selectedGoal === "all") return systemMealPlans;
    return systemMealPlans.filter((plan) => plan.goal === selectedGoal);
  }, [selectedGoal]);

  // Get active plan details
  const activePlan = activePlanId ? getMealPlanById(activePlanId) : null;

  // Calculate total nutrition for a day
  const calculateDayNutrition = (day: DayPlan) => {
    const allMeals = [
      ...(day.breakfast || []),
      ...(day.morningSnack || []),
      ...(day.lunch || []),
      ...(day.afternoonSnack || []),
      ...(day.dinner || []),
      ...(day.eveningSnack || []),
    ];

    return {
      calories: allMeals.reduce((sum, item) => sum + item.calories, 0),
      protein: allMeals.reduce((sum, item) => sum + item.protein, 0),
      carbs: allMeals.reduce((sum, item) => sum + item.carbs, 0),
      fat: allMeals.reduce((sum, item) => sum + item.fat, 0),
    };
  };

  // Goal filter options
  const goalOptions: { value: GoalFilter; label: string; icon: string }[] = [
    { value: "all", label: "All Plans", icon: "📋" },
    { value: "weight_loss", label: "Weight Loss", icon: "📉" },
    { value: "muscle_gain", label: "Muscle Gain", icon: "💪" },
    { value: "maintenance", label: "Maintenance", icon: "⚖️" },
    { value: "diabetic_friendly", label: "Diabetic", icon: "💚" },
    { value: "high_protein", label: "High Protein", icon: "🥩" },
  ];

  // Meal type labels
  const mealTypes = [
    { key: "breakfast", label: "Breakfast", icon: "🌅" },
    { key: "morningSnack", label: "Morning Snack", icon: "🍎" },
    { key: "lunch", label: "Lunch", icon: "☀️" },
    { key: "afternoonSnack", label: "Afternoon Snack", icon: "🥜" },
    { key: "dinner", label: "Dinner", icon: "🌙" },
    { key: "eveningSnack", label: "Evening Snack", icon: "🥛" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Meal Plans</h1>
        <p className="text-neutral-500">Pre-made nutrition plans for your goals</p>
      </div>

      {/* Active Plan Card */}
      {activePlan && currentDayPlan && (
        <Card className="bg-gradient-to-r from-primary-50 to-orange-50 border-primary-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
                {activePlan.image}
              </div>
              <div>
                <p className="text-sm text-primary-600 font-medium">Active Plan</p>
                <h3 className="font-bold text-neutral-900">{activePlan.name}</h3>
                <p className="text-sm text-neutral-500">
                  Day {currentDayPlan.dayNumber} of {activePlan.days.length}
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={stopPlan}>
              Stop Plan
            </Button>
          </div>

          {/* Today's Meals */}
          <div className="bg-white rounded-xl p-4">
            <h4 className="font-medium text-neutral-900 mb-3">Today&apos;s Meals</h4>
            <div className="space-y-3">
              {mealTypes.map(({ key, label, icon }) => {
                const meals = currentDayPlan.plan[key as keyof DayPlan];
                if (!meals || meals.length === 0) return null;

                return (
                  <div key={key} className="flex items-start gap-3">
                    <span className="text-lg">{icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-700">{label}</p>
                      <p className="text-sm text-neutral-500">
                        {meals.map((m) => m.name).join(", ")}
                      </p>
                    </div>
                    <p className="text-sm text-neutral-500">
                      {meals.reduce((sum, m) => sum + m.calories, 0)} cal
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-100">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Today&apos;s Total</span>
                <span className="font-bold text-neutral-900">
                  {calculateDayNutrition(currentDayPlan.plan).calories} cal |{" "}
                  {calculateDayNutrition(currentDayPlan.plan).protein}g protein
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Goal Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {goalOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedGoal(option.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              selectedGoal === option.value
                ? "bg-primary-500 text-white"
                : "bg-white border border-neutral-200 hover:border-primary-300"
            }`}
          >
            <span>{option.icon}</span>
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>

      {/* Plan Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredPlans.map((plan) => {
          const isSaved = savedPlans.includes(plan.id);
          const isActive = activePlanId === plan.id;

          return (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isActive ? "ring-2 ring-primary-500 bg-primary-50/30" : ""
              }`}
              onClick={() => setSelectedPlanId(plan.id)}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-neutral-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                  {plan.image}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-neutral-900 truncate">{plan.name}</h3>
                    {isActive && (
                      <span className="px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 line-clamp-2 mb-2">{plan.description}</p>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                      {plan.dailyCalories} cal/day
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {plan.dailyProtein}g protein
                    </span>
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                      {plan.days.length} days
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-100">
                <Button
                  size="sm"
                  variant={isSaved ? "outline" : "ghost"}
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    isSaved ? unsavePlan(plan.id) : savePlan(plan.id);
                  }}
                >
                  {isSaved ? "★ Saved" : "☆ Save"}
                </Button>
                {isActive ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      stopPlan();
                    }}
                  >
                    Stop Plan
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      startPlan(plan.id);
                    }}
                  >
                    Start Plan
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {filteredPlans.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-4xl mb-4">🍽️</p>
          <p className="font-medium text-neutral-700">No plans found</p>
          <p className="text-sm text-neutral-500">Try selecting a different goal</p>
        </Card>
      )}

      {/* Plan Detail Modal */}
      {selectedPlanId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {(() => {
              const plan = getMealPlanById(selectedPlanId);
              if (!plan) return null;

              const isSaved = savedPlans.includes(plan.id);
              const isActive = activePlanId === plan.id;

              return (
                <>
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-neutral-100 rounded-xl flex items-center justify-center text-4xl">
                      {plan.image}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-neutral-900">{plan.name}</h2>
                      <p className="text-neutral-500 text-sm mt-1">{plan.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedPlanId(null)}
                      className="p-2 hover:bg-neutral-100 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    <div className="text-center p-3 bg-orange-50 rounded-xl">
                      <p className="text-lg font-bold text-orange-600">{plan.dailyCalories}</p>
                      <p className="text-xs text-neutral-500">Calories/day</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <p className="text-lg font-bold text-blue-600">{plan.dailyProtein}g</p>
                      <p className="text-xs text-neutral-500">Protein/day</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                      <p className="text-lg font-bold text-green-600">{plan.days.length}</p>
                      <p className="text-xs text-neutral-500">Days</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-xl">
                      <p className="text-lg font-bold text-purple-600 capitalize">{plan.difficulty}</p>
                      <p className="text-xs text-neutral-500">Difficulty</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {plan.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-neutral-100 text-neutral-600 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Days */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">Daily Plans</h3>
                    <div className="space-y-2">
                      {plan.days.map((day, index) => {
                        const nutrition = calculateDayNutrition(day);
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl cursor-pointer hover:bg-neutral-100"
                            onClick={() => setShowDayModal({ plan, dayIndex: index })}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </div>
                              <span className="font-medium text-neutral-900">Day {index + 1}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-neutral-500">
                                {nutrition.calories} cal | {nutrition.protein}g protein
                              </span>
                              <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant={isSaved ? "outline" : "ghost"}
                      className="flex-1"
                      onClick={() => (isSaved ? unsavePlan(plan.id) : savePlan(plan.id))}
                    >
                      {isSaved ? "★ Saved" : "☆ Save Plan"}
                    </Button>
                    {isActive ? (
                      <Button variant="outline" className="flex-1" onClick={stopPlan}>
                        Stop Plan
                      </Button>
                    ) : (
                      <Button
                        className="flex-1"
                        onClick={() => {
                          startPlan(plan.id);
                          setSelectedPlanId(null);
                        }}
                      >
                        Start This Plan
                      </Button>
                    )}
                  </div>
                </>
              );
            })()}
          </Card>
        </div>
      )}

      {/* Day Detail Modal */}
      {showDayModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-neutral-900">
                Day {showDayModal.dayIndex + 1} - {showDayModal.plan.name}
              </h3>
              <button
                onClick={() => setShowDayModal(null)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {mealTypes.map(({ key, label, icon }) => {
                const meals = showDayModal.plan.days[showDayModal.dayIndex][key as keyof DayPlan];
                if (!meals || meals.length === 0) return null;

                return (
                  <div key={key} className="bg-neutral-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{icon}</span>
                      <h4 className="font-medium text-neutral-900">{label}</h4>
                    </div>
                    <div className="space-y-2">
                      {meals.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white p-3 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-neutral-900">{item.name}</p>
                            <p className="text-sm text-neutral-500">{item.portion}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-neutral-900">{item.calories} cal</p>
                            <p className="text-xs text-neutral-500">
                              P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Day Total */}
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-orange-600">
                    {calculateDayNutrition(showDayModal.plan.days[showDayModal.dayIndex]).calories}
                  </p>
                  <p className="text-xs text-neutral-500">Calories</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600">
                    {calculateDayNutrition(showDayModal.plan.days[showDayModal.dayIndex]).protein}g
                  </p>
                  <p className="text-xs text-neutral-500">Protein</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">
                    {calculateDayNutrition(showDayModal.plan.days[showDayModal.dayIndex]).carbs}g
                  </p>
                  <p className="text-xs text-neutral-500">Carbs</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-yellow-600">
                    {calculateDayNutrition(showDayModal.plan.days[showDayModal.dayIndex]).fat}g
                  </p>
                  <p className="text-xs text-neutral-500">Fat</p>
                </div>
              </div>
            </div>

            <Button fullWidth className="mt-4" onClick={() => setShowDayModal(null)}>
              Close
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
