"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader } from "@/components/ui";
import { useFoodLogStore } from "@/store/foodLogStore";
import { useWeightStore } from "@/store/weightStore";
import { useGamificationStore } from "@/store/gamificationStore";

type TimeRange = "week" | "month" | "3months" | "year";
type ChartType = "calories" | "macros" | "weight" | "streaks";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [activeChart, setActiveChart] = useState<ChartType>("calories");

  const { logs } = useFoodLogStore();
  const { entries: weightEntries } = useWeightStore();
  const { currentStreak, longestStreak, earnedBadges, stats } = useGamificationStore();

  // Calculate total points from stats
  const totalPoints = useMemo(() => {
    return (
      stats.totalMealsLogged * 10 +
      stats.proteinGoalsHit * 25 +
      stats.calorieGoalsHit * 25 +
      stats.waterGoalsHit * 15 +
      currentStreak * 5
    );
  }, [stats, currentStreak]);

  // Calculate date range
  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    switch (timeRange) {
      case "week":
        start.setDate(end.getDate() - 7);
        break;
      case "month":
        start.setMonth(end.getMonth() - 1);
        break;
      case "3months":
        start.setMonth(end.getMonth() - 3);
        break;
      case "year":
        start.setFullYear(end.getFullYear() - 1);
        break;
    }
    return { start, end };
  }, [timeRange]);

  // Calculate analytics data
  const analytics = useMemo(() => {
    const allLogs = Object.values(logs);
    const filteredLogs = allLogs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= dateRange.start && logDate <= dateRange.end;
    });

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalMeals = 0;

    const dailyData: Record<string, { calories: number; protein: number; carbs: number; fat: number; meals: number }> = {};

    filteredLogs.forEach((log) => {
      const dateKey = log.date;
      const mealCount = Object.values(log.meals).reduce((sum, mealFoods) => sum + mealFoods.length, 0);

      dailyData[dateKey] = {
        calories: log.totalNutrition.calories,
        protein: log.totalNutrition.protein,
        carbs: log.totalNutrition.carbohydrates,
        fat: log.totalNutrition.fat,
        meals: mealCount,
      };

      totalCalories += log.totalNutrition.calories;
      totalProtein += log.totalNutrition.protein;
      totalCarbs += log.totalNutrition.carbohydrates;
      totalFat += log.totalNutrition.fat;
      totalMeals += mealCount;
    });

    const days = filteredLogs.length || 1;

    const prevStart = new Date(dateRange.start);
    const duration = dateRange.end.getTime() - dateRange.start.getTime();
    prevStart.setTime(prevStart.getTime() - duration);

    const prevLogs = allLogs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= prevStart && logDate < dateRange.start;
    });

    const prevCalories = prevLogs.reduce((sum, log) => sum + log.totalNutrition.calories, 0);
    const caloriesTrend = prevCalories > 0 ? ((totalCalories - prevCalories) / prevCalories) * 100 : 0;

    return {
      dailyData,
      averageCalories: Math.round(totalCalories / days),
      averageProtein: Math.round(totalProtein / days),
      averageCarbs: Math.round(totalCarbs / days),
      averageFat: Math.round(totalFat / days),
      totalMeals,
      daysLogged: days,
      caloriesTrend: Math.round(caloriesTrend),
    };
  }, [logs, dateRange]);

  const weightAnalytics = useMemo(() => {
    const filtered = weightEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= dateRange.start && entryDate <= dateRange.end;
    });

    if (filtered.length === 0) return null;

    const sorted = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const change = last.weight - first.weight;

    return {
      current: last.weight,
      start: first.weight,
      change,
      changePercent: ((change / first.weight) * 100).toFixed(1),
      entries: sorted,
    };
  }, [weightEntries, dateRange]);

  const renderSimpleChart = (data: { label: string; value: number }[], maxValue: number, color: string) => (
    <div className="flex items-end gap-1 h-32">
      {data.slice(-14).map((item, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`w-full ${color} rounded-t transition-all hover:opacity-80`}
            style={{ height: `${Math.max(4, (item.value / maxValue) * 100)}%` }}
            title={`${item.label}: ${item.value}`}
          />
          {idx % 2 === 0 && (
            <span className="text-[10px] text-neutral-400 truncate w-full text-center">
              {item.label.split("-").pop()}
            </span>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Analytics</h1>
          <p className="text-neutral-500">Deep insights into your nutrition journey</p>
        </div>
        <div className="flex gap-2 bg-neutral-100 p-1 rounded-xl">
          {[{ value: "week", label: "7D" }, { value: "month", label: "1M" }, { value: "3months", label: "3M" }, { value: "year", label: "1Y" }].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value as TimeRange)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${timeRange === option.value ? "bg-white shadow text-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-primary-600">{analytics.averageCalories.toLocaleString()}</div>
          <div className="text-sm text-neutral-500">Avg. Daily Calories</div>
          {analytics.caloriesTrend !== 0 && (
            <div className={`text-xs mt-1 ${analytics.caloriesTrend > 0 ? "text-red-500" : "text-green-500"}`}>
              {analytics.caloriesTrend > 0 ? "↑" : "↓"} {Math.abs(analytics.caloriesTrend)}% vs prev
            </div>
          )}
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-blue-600">{analytics.averageProtein}g</div>
          <div className="text-sm text-neutral-500">Avg. Daily Protein</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-yellow-600">{currentStreak}</div>
          <div className="text-sm text-neutral-500">Current Streak</div>
          <div className="text-xs text-neutral-400 mt-1">Best: {longestStreak} days</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-purple-600">{totalPoints.toLocaleString()}</div>
          <div className="text-sm text-neutral-500">Total Points</div>
          <div className="text-xs text-neutral-400 mt-1">{earnedBadges.length} badges earned</div>
        </Card>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {[{ value: "calories", label: "Calories", icon: "🔥" }, { value: "macros", label: "Macros", icon: "📊" }, { value: "weight", label: "Weight", icon: "⚖️" }, { value: "streaks", label: "Activity", icon: "📈" }].map((chart) => (
          <button
            key={chart.value}
            onClick={() => setActiveChart(chart.value as ChartType)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${activeChart === chart.value ? "bg-primary-500 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}
          >
            <span>{chart.icon}</span>{chart.label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader title={activeChart === "calories" ? "Daily Calorie Intake" : activeChart === "macros" ? "Macronutrient Breakdown" : activeChart === "weight" ? "Weight Progress" : "Activity Overview"} />

        {activeChart === "calories" && (
          <div className="space-y-4">
            {Object.keys(analytics.dailyData).length > 0 ? (
              <>
                {renderSimpleChart(
                  Object.entries(analytics.dailyData).map(([date, data]) => ({ label: date, value: data.calories })),
                  Math.max(...Object.values(analytics.dailyData).map((d) => d.calories), 2000),
                  "bg-primary-500"
                )}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{Math.min(...Object.values(analytics.dailyData).map((d) => d.calories))}</div>
                    <div className="text-xs text-neutral-500">Lowest Day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary-600">{analytics.averageCalories}</div>
                    <div className="text-xs text-neutral-500">Average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{Math.max(...Object.values(analytics.dailyData).map((d) => d.calories))}</div>
                    <div className="text-xs text-neutral-500">Highest Day</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-neutral-500">
                <div className="text-4xl mb-4">📊</div>
                <p>No calorie data for this period</p>
                <p className="text-sm mt-2">Start logging meals to see your trends</p>
              </div>
            )}
          </div>
        )}

        {activeChart === "macros" && (
          <div className="space-y-6">
            <div className="h-8 rounded-full overflow-hidden flex">
              <div className="bg-blue-500 transition-all" style={{ width: `${((analytics.averageProtein * 4) / (analytics.averageProtein * 4 + analytics.averageCarbs * 4 + analytics.averageFat * 9 || 1)) * 100}%` }} />
              <div className="bg-yellow-500 transition-all" style={{ width: `${((analytics.averageCarbs * 4) / (analytics.averageProtein * 4 + analytics.averageCarbs * 4 + analytics.averageFat * 9 || 1)) * 100}%` }} />
              <div className="bg-red-500 transition-all" style={{ width: `${((analytics.averageFat * 9) / (analytics.averageProtein * 4 + analytics.averageCarbs * 4 + analytics.averageFat * 9 || 1)) * 100}%` }} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center"><span className="text-white font-bold">P</span></div>
                <div className="text-2xl font-bold text-blue-600">{analytics.averageProtein}g</div>
                <div className="text-sm text-blue-600">Protein</div>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 text-center">
                <div className="w-10 h-10 bg-yellow-500 rounded-full mx-auto mb-2 flex items-center justify-center"><span className="text-white font-bold">C</span></div>
                <div className="text-2xl font-bold text-yellow-600">{analytics.averageCarbs}g</div>
                <div className="text-sm text-yellow-600">Carbs</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <div className="w-10 h-10 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center"><span className="text-white font-bold">F</span></div>
                <div className="text-2xl font-bold text-red-600">{analytics.averageFat}g</div>
                <div className="text-sm text-red-600">Fat</div>
              </div>
            </div>
          </div>
        )}

        {activeChart === "weight" && (
          <div className="space-y-4">
            {weightAnalytics ? (
              <>
                <div className="flex items-center justify-between bg-neutral-50 rounded-xl p-4">
                  <div><div className="text-sm text-neutral-500">Starting</div><div className="text-xl font-semibold">{weightAnalytics.start} kg</div></div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${weightAnalytics.change < 0 ? "text-green-600" : weightAnalytics.change > 0 ? "text-red-600" : "text-neutral-600"}`}>
                      {weightAnalytics.change > 0 ? "+" : ""}{weightAnalytics.change.toFixed(1)} kg
                    </div>
                    <div className="text-xs text-neutral-500">({weightAnalytics.changePercent}%)</div>
                  </div>
                  <div className="text-right"><div className="text-sm text-neutral-500">Current</div><div className="text-xl font-semibold">{weightAnalytics.current} kg</div></div>
                </div>
                {renderSimpleChart(weightAnalytics.entries.map((entry) => ({ label: entry.date, value: entry.weight })), Math.max(...weightAnalytics.entries.map((e) => e.weight)) + 5, "bg-green-500")}
              </>
            ) : (
              <div className="text-center py-12 text-neutral-500"><div className="text-4xl mb-4">⚖️</div><p>No weight data for this period</p></div>
            )}
          </div>
        )}

        {activeChart === "streaks" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-primary-50 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-primary-600">{analytics.totalMeals}</div><div className="text-sm text-primary-600">Meals Logged</div></div>
              <div className="bg-green-50 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-green-600">{analytics.daysLogged}</div><div className="text-sm text-green-600">Active Days</div></div>
              <div className="bg-yellow-50 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-yellow-600">{currentStreak}</div><div className="text-sm text-yellow-600">Current Streak</div></div>
              <div className="bg-purple-50 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-purple-600">{longestStreak}</div><div className="text-sm text-purple-600">Best Streak</div></div>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Recent Achievements</h3>
              {earnedBadges.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {earnedBadges.slice(0, 6).map((badge) => (
                    <div key={badge.id} className="flex items-center gap-2 bg-neutral-50 rounded-xl px-3 py-2">
                      <span className="text-2xl">{badge.icon}</span>
                      <div><div className="text-sm font-medium">{badge.name}</div><div className="text-xs text-neutral-500">{badge.unlockedAt && new Date(badge.unlockedAt).toLocaleDateString()}</div></div>
                    </div>
                  ))}
                </div>
              ) : (<p className="text-neutral-500 text-sm">Complete challenges to earn badges!</p>)}
            </div>
          </div>
        )}
      </Card>

      <Card>
        <CardHeader title="AI Insights" subtitle="Personalized recommendations based on your data" />
        <div className="space-y-4">
          {analytics.averageCalories > 0 ? (
            <>
              {analytics.averageCalories < 1500 && (
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl">
                  <span className="text-2xl">⚠️</span>
                  <div><div className="font-medium text-yellow-800">Low Calorie Intake</div><div className="text-sm text-yellow-700 mt-1">Your average of {analytics.averageCalories} calories is below recommended. Consider adding nutrient-dense foods.</div></div>
                </div>
              )}
              {analytics.averageProtein < 50 && (
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <span className="text-2xl">💪</span>
                  <div><div className="font-medium text-blue-800">Increase Protein Intake</div><div className="text-sm text-blue-700 mt-1">Try adding more dal, paneer, eggs, or lean meats to boost protein to at least 50g daily.</div></div>
                </div>
              )}
              {currentStreak >= 7 && (
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                  <span className="text-2xl">🎉</span>
                  <div><div className="font-medium text-green-800">Great Consistency!</div><div className="text-sm text-green-700 mt-1">You've logged meals for {currentStreak} days in a row. Keep it up!</div></div>
                </div>
              )}
              {analytics.averageCalories >= 1500 && analytics.averageProtein >= 50 && currentStreak < 7 && (
                <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-xl">
                  <span className="text-2xl">✨</span>
                  <div><div className="font-medium text-primary-800">You're Doing Great!</div><div className="text-sm text-primary-700 mt-1">Your nutrition looks balanced. Focus on maintaining consistency.</div></div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-neutral-500"><div className="text-4xl mb-4">🔮</div><p>Start logging meals to receive personalized insights</p></div>
          )}
        </div>
      </Card>
    </div>
  );
}
