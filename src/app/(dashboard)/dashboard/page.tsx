"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, ProgressBar, Button } from "@/components/ui";
import { useUserStore } from "@/store/userStore";
import { useFoodLogStore, getTodayDateString, formatDateDisplay } from "@/store/foodLogStore";
import { useGamificationStore } from "@/store/gamificationStore";
import type { MealType } from "@/types";

const mealConfig: { type: MealType; label: string; icon: string; bgColor: string }[] = [
  { type: "breakfast", label: "Breakfast", icon: "☀️", bgColor: "bg-yellow-100" },
  { type: "lunch", label: "Lunch", icon: "🌞", bgColor: "bg-orange-100" },
  { type: "dinner", label: "Dinner", icon: "🌙", bgColor: "bg-purple-100" },
  { type: "snack", label: "Snacks", icon: "🍎", bgColor: "bg-green-100" },
];

export default function DashboardPage() {
  const { targets } = useUserStore();
  const { getDailyLog, addWater, removeWater } = useFoodLogStore();
  const {
    currentStreak,
    earnedBadges,
    recentBadge,
    clearRecentBadge,
    recordDailyLog,
    recordWaterGoalHit,
  } = useGamificationStore();

  const todayDate = getTodayDateString();
  const dailyLog = getDailyLog(todayDate);

  // Record daily log for streak tracking when there are logged items
  useEffect(() => {
    const totalItemsLogged = Object.values(dailyLog.meals).flat().length;
    if (totalItemsLogged > 0) {
      recordDailyLog(todayDate);
    }
  }, [dailyLog, todayDate, recordDailyLog]);

  // Check water goal
  useEffect(() => {
    if (dailyLog.water >= 8) {
      recordWaterGoalHit();
    }
  }, [dailyLog.water, recordWaterGoalHit]);

  // Default targets if not set
  const dailyTargets = targets || {
    dailyCalories: 1800,
    macros: { protein: 90, carbs: 200, fat: 60, fiber: 25 },
    water: 2400,
  };

  // Calculate consumed values
  const consumed = dailyLog.totalNutrition;
  const remaining = Math.max(0, dailyTargets.dailyCalories - consumed.calories);

  // Calculate percentages
  const caloriePercent = Math.min(100, Math.round((consumed.calories / dailyTargets.dailyCalories) * 100));
  const proteinPercent = Math.min(100, Math.round((consumed.protein / dailyTargets.macros.protein) * 100));
  const carbsPercent = Math.min(100, Math.round((consumed.carbohydrates / dailyTargets.macros.carbs) * 100));
  const fatPercent = Math.min(100, Math.round((consumed.fat / dailyTargets.macros.fat) * 100));

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Use real streak from gamification store
  const totalItemsLogged = Object.values(dailyLog.meals).flat().length;
  const streak = currentStreak;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {getGreeting()}! 👋
          </h1>
          <p className="text-neutral-500">{formatDateDisplay(todayDate)}</p>
        </div>
        <Link href="/dashboard/achievements">
          <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-xl hover:bg-orange-200 transition-all cursor-pointer">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold">{streak} day streak</span>
            <span className="text-xs">🏅 {earnedBadges.length}</span>
          </div>
        </Link>
      </div>

      {/* Main Calories Card */}
      <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0">
        <div className="text-center py-4">
          <p className="text-primary-100 mb-2">Remaining Calories</p>
          <div className="text-5xl font-bold mb-1">{remaining}</div>
          <p className="text-primary-100 text-sm">
            {consumed.calories} eaten · {dailyTargets.dailyCalories} goal
          </p>

          {/* Macro Summary */}
          <div className="mt-6 flex justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold">{caloriePercent}%</div>
              <div className="text-xs text-primary-100">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{proteinPercent}%</div>
              <div className="text-xs text-primary-100">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{carbsPercent}%</div>
              <div className="text-xs text-primary-100">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{fatPercent}%</div>
              <div className="text-xs text-primary-100">Fat</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Macros Card */}
      <Card>
        <CardHeader title="Macros" subtitle="Track your daily nutrition" />
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-neutral-700">Protein</span>
              <span className="text-neutral-500">
                {consumed.protein.toFixed(1)}g / {dailyTargets.macros.protein}g
              </span>
            </div>
            <ProgressBar
              value={consumed.protein}
              max={dailyTargets.macros.protein}
              showValue={false}
              color="primary"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-neutral-700">Carbs</span>
              <span className="text-neutral-500">
                {consumed.carbohydrates.toFixed(1)}g / {dailyTargets.macros.carbs}g
              </span>
            </div>
            <ProgressBar
              value={consumed.carbohydrates}
              max={dailyTargets.macros.carbs}
              showValue={false}
              color="secondary"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-neutral-700">Fat</span>
              <span className="text-neutral-500">
                {consumed.fat.toFixed(1)}g / {dailyTargets.macros.fat}g
              </span>
            </div>
            <ProgressBar
              value={consumed.fat}
              max={dailyTargets.macros.fat}
              showValue={false}
              color="primary"
            />
          </div>
        </div>
      </Card>

      {/* Meals Section */}
      <Card>
        <CardHeader
          title="Today's Meals"
          action={
            <Link href="/dashboard/log">
              <Button variant="ghost" size="sm">
                + Add Food
              </Button>
            </Link>
          }
        />
        <div className="space-y-3">
          {mealConfig.map((meal) => {
            const mealFoods = dailyLog.meals[meal.type];
            const mealCalories = mealFoods.reduce((sum, f) => sum + f.nutrition.calories, 0);
            const isLogged = mealFoods.length > 0;

            return (
              <div
                key={meal.type}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${meal.bgColor} rounded-xl flex items-center justify-center`}>
                    <span className="text-xl">{meal.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{meal.label}</p>
                    <p className="text-sm text-neutral-500">
                      {isLogged
                        ? `${mealCalories} cal · ${mealFoods.length} item${mealFoods.length > 1 ? "s" : ""}`
                        : "Not logged yet"}
                    </p>
                  </div>
                </div>
                {isLogged ? (
                  <span className="text-green-500">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                ) : (
                  <Link href="/dashboard/log">
                    <Button size="sm">+ Add</Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Water Tracking */}
      <Card>
        <CardHeader title="Water Intake" subtitle="Stay hydrated! Tap to add" />
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (i < dailyLog.water) {
                    removeWater(todayDate);
                  } else {
                    addWater(todayDate);
                  }
                }}
                className={`w-8 h-12 rounded-lg border-2 transition-all ${
                  i < dailyLog.water
                    ? "bg-blue-500 border-blue-500"
                    : "border-neutral-200 hover:border-blue-300 cursor-pointer"
                }`}
              >
                <span className="text-xl flex items-center justify-center h-full">
                  {i < dailyLog.water ? "💧" : ""}
                </span>
              </button>
            ))}
          </div>
          <div className="flex-1">
            <p className="font-medium text-neutral-900">
              {dailyLog.water} / 8 glasses
            </p>
            <p className="text-sm text-neutral-500">
              {8 - dailyLog.water > 0 ? `${8 - dailyLog.water} more to go` : "Goal reached! 🎉"}
            </p>
          </div>
        </div>
      </Card>

      {/* AI Insight Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-1">AI Insight</h3>
            <p className="text-neutral-600 text-sm">
              {consumed.calories === 0
                ? "Start logging your meals to get personalized insights and recommendations!"
                : consumed.protein < dailyTargets.macros.protein * 0.5
                ? "Try adding more protein-rich foods like dal, paneer, or eggs to meet your protein goal!"
                : consumed.calories > dailyTargets.dailyCalories
                ? "You've exceeded your calorie goal. Consider lighter options for your next meal."
                : "Great job tracking! You're on track to meet your goals today. Keep it up! 🎉"}
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/dashboard/log">
          <Button
            size="lg"
            className="w-full h-auto py-4"
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            }
          >
            Voice Log
          </Button>
        </Link>
        <Link href="/dashboard/log">
          <Button
            size="lg"
            variant="secondary"
            className="w-full h-auto py-4"
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
          >
            Photo Log
          </Button>
        </Link>
      </div>

      {/* Badge Notification */}
      {recentBadge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-sm w-full animate-bounce-in">
            <div className="text-center py-6">
              <div className="text-6xl mb-4 animate-pulse">{recentBadge.icon}</div>
              <div className="text-sm text-primary-600 font-medium mb-2">
                🎉 New Badge Unlocked!
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                {recentBadge.name}
              </h2>
              <p className="text-neutral-500 mb-6">{recentBadge.description}</p>
              <div className="flex gap-3 justify-center">
                <Button variant="secondary" onClick={clearRecentBadge}>
                  Close
                </Button>
                <Link href="/dashboard/achievements">
                  <Button onClick={clearRecentBadge}>View All Badges</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
