"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, Button, Input } from "@/components/ui";
import { useFoodLogStore } from "@/store/foodLogStore";
import { useUserStore } from "@/store/userStore";
import { useWeightStore, getTodayDateString } from "@/store/weightStore";

// Time range options
type TimeRange = "week" | "month" | "3months";

// Chart types
type ChartType = "calories" | "macros" | "water" | "weight";

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [activeChart, setActiveChart] = useState<ChartType>("calories");
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [weightInput, setWeightInput] = useState("");
  const [weightNote, setWeightNote] = useState("");

  const { logs } = useFoodLogStore();
  const { targets, profile } = useUserStore();
  const { entries: weightEntries, addEntry, getLatestEntry, getWeightChange } = useWeightStore();

  const latestWeight = getLatestEntry();
  const weeklyChange = getWeightChange(7);
  const monthlyChange = getWeightChange(30);

  // Get dates for the selected time range
  const dateRange = useMemo(() => {
    const today = new Date();
    const dates: string[] = [];
    let daysToInclude = 7;

    if (timeRange === "month") daysToInclude = 30;
    if (timeRange === "3months") daysToInclude = 90;

    for (let i = daysToInclude - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }

    return dates;
  }, [timeRange]);

  // Aggregate data for charts
  const chartData = useMemo(() => {
    return dateRange.map((date) => {
      const log = logs[date];
      const weightEntry = weightEntries.find((w) => w.date === date);
      return {
        date,
        shortDate: new Date(date).toLocaleDateString("en-US", { weekday: "short", day: "numeric" }),
        calories: log?.totalNutrition.calories || 0,
        protein: log?.totalNutrition.protein || 0,
        carbs: log?.totalNutrition.carbohydrates || 0,
        fat: log?.totalNutrition.fat || 0,
        water: log?.water || 0,
        weight: weightEntry?.weight || null,
        logged: !!log && Object.values(log.meals).flat().length > 0,
      };
    });
  }, [dateRange, logs, weightEntries]);

  // Calculate statistics
  const stats = useMemo(() => {
    const loggedDays = chartData.filter((d) => d.logged);
    const totalDays = loggedDays.length;

    if (totalDays === 0) {
      return {
        avgCalories: 0,
        avgProtein: 0,
        avgCarbs: 0,
        avgFat: 0,
        avgWater: 0,
        streakDays: 0,
        bestDay: null,
        worstDay: null,
        totalCalories: 0,
        daysLogged: 0,
        consistency: 0,
      };
    }

    const totalCalories = loggedDays.reduce((sum, d) => sum + d.calories, 0);
    const totalProtein = loggedDays.reduce((sum, d) => sum + d.protein, 0);
    const totalCarbs = loggedDays.reduce((sum, d) => sum + d.carbs, 0);
    const totalFat = loggedDays.reduce((sum, d) => sum + d.fat, 0);
    const totalWater = loggedDays.reduce((sum, d) => sum + d.water, 0);

    // Calculate streak
    let streak = 0;
    for (let i = chartData.length - 1; i >= 0; i--) {
      if (chartData[i].logged) streak++;
      else break;
    }

    // Find best and worst days
    const sortedByCalories = [...loggedDays].sort((a, b) => b.calories - a.calories);
    const bestDay = sortedByCalories[0];
    const worstDay = sortedByCalories[sortedByCalories.length - 1];

    return {
      avgCalories: Math.round(totalCalories / totalDays),
      avgProtein: Math.round(totalProtein / totalDays),
      avgCarbs: Math.round(totalCarbs / totalDays),
      avgFat: Math.round(totalFat / totalDays),
      avgWater: Math.round((totalWater / totalDays) * 10) / 10,
      streakDays: streak,
      bestDay,
      worstDay,
      totalCalories,
      daysLogged: totalDays,
      consistency: Math.round((totalDays / chartData.length) * 100),
    };
  }, [chartData]);

  // Calculate max values for chart scaling
  const maxCalories = Math.max(...chartData.map((d) => d.calories), targets?.dailyCalories || 2000);
  const weightDataPoints = chartData.filter((d) => d.weight !== null);
  const minWeight = weightDataPoints.length > 0 ? Math.min(...weightDataPoints.map((d) => d.weight!)) - 2 : 60;
  const maxWeight = weightDataPoints.length > 0 ? Math.max(...weightDataPoints.map((d) => d.weight!)) + 2 : 80;

  // Handle weight logging
  const handleLogWeight = () => {
    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight <= 0) return;

    addEntry(getTodayDateString(), weight, weightNote || undefined);
    setWeightInput("");
    setWeightNote("");
    setShowWeightModal(false);
  };

  // Simple bar chart component
  const BarChart = ({
    data,
    valueKey,
    maxValue,
    color,
    goal,
  }: {
    data: typeof chartData;
    valueKey: keyof (typeof chartData)[0];
    maxValue: number;
    color: string;
    goal?: number;
  }) => {
    return (
      <div className="relative">
        {/* Goal line */}
        {goal && (
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-red-300 z-10"
            style={{ bottom: `${(goal / maxValue) * 100}%` }}
          >
            <span className="absolute -top-3 right-0 text-xs text-red-500 bg-white px-1">
              Goal: {goal}
            </span>
          </div>
        )}

        <div className="flex items-end gap-1 h-40">
          {data.map((item, idx) => {
            const value = Number(item[valueKey]) || 0;
            const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
            const isToday = idx === data.length - 1;

            return (
              <div key={item.date} className="flex-1 flex flex-col items-center group relative">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block z-20">
                  <div className="bg-neutral-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    {item.shortDate}: {value}
                  </div>
                </div>

                {/* Bar */}
                <div
                  className={`w-full rounded-t transition-all ${color} ${isToday ? "ring-2 ring-primary-500" : ""}`}
                  style={{ height: `${Math.max(height, 2)}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis labels (show only some) */}
        <div className="flex gap-1 mt-2">
          {data.map((item, idx) => {
            const showLabel =
              data.length <= 7 ||
              idx === 0 ||
              idx === data.length - 1 ||
              idx === Math.floor(data.length / 2);

            return (
              <div key={item.date} className="flex-1 text-center">
                {showLabel && (
                  <span className="text-xs text-neutral-500">
                    {new Date(item.date).getDate()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Weight line chart component
  const WeightChart = ({ data }: { data: typeof chartData }) => {
    const weightPoints = data.map((d, i) => ({
      ...d,
      index: i,
      hasWeight: d.weight !== null,
    }));

    return (
      <div className="relative">
        {/* Goal line */}
        {profile?.goalWeight && (
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-green-400 z-10"
            style={{
              bottom: `${((profile.goalWeight - minWeight) / (maxWeight - minWeight)) * 100}%`,
            }}
          >
            <span className="absolute -top-3 right-0 text-xs text-green-600 bg-white px-1">
              Goal: {profile.goalWeight}kg
            </span>
          </div>
        )}

        <div className="flex items-end gap-1 h-40 relative">
          {/* SVG for line */}
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            {weightPoints
              .filter((p) => p.hasWeight)
              .map((point, idx, arr) => {
                if (idx === 0) return null;
                const prevPoint = arr[idx - 1];
                const x1 = (prevPoint.index / (data.length - 1)) * 100;
                const y1 = 100 - ((prevPoint.weight! - minWeight) / (maxWeight - minWeight)) * 100;
                const x2 = (point.index / (data.length - 1)) * 100;
                const y2 = 100 - ((point.weight! - minWeight) / (maxWeight - minWeight)) * 100;

                return (
                  <line
                    key={point.date}
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                );
              })}
          </svg>

          {/* Data points */}
          {data.map((item, idx) => {
            const isToday = idx === data.length - 1;
            const hasWeight = item.weight !== null;
            const yPos = hasWeight
              ? ((item.weight! - minWeight) / (maxWeight - minWeight)) * 100
              : 0;

            return (
              <div key={item.date} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                {hasWeight && (
                  <>
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-20">
                      <div className="bg-neutral-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        {item.shortDate}: {item.weight}kg
                      </div>
                    </div>

                    {/* Point */}
                    <div
                      className={`absolute w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow ${
                        isToday ? "w-4 h-4 ring-2 ring-green-300" : ""
                      }`}
                      style={{ bottom: `${yPos}%`, transform: "translateY(50%)" }}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="flex gap-1 mt-2">
          {data.map((item, idx) => {
            const showLabel =
              data.length <= 7 ||
              idx === 0 ||
              idx === data.length - 1 ||
              idx === Math.floor(data.length / 2);

            return (
              <div key={item.date} className="flex-1 text-center">
                {showLabel && (
                  <span className="text-xs text-neutral-500">
                    {new Date(item.date).getDate()}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 -ml-10 flex flex-col justify-between text-xs text-neutral-400">
          <span>{maxWeight}kg</span>
          <span>{Math.round((maxWeight + minWeight) / 2)}kg</span>
          <span>{minWeight}kg</span>
        </div>
      </div>
    );
  };

  // Stacked bar chart for macros
  const MacroChart = ({ data }: { data: typeof chartData }) => {
    return (
      <div>
        <div className="flex items-end gap-1 h-40">
          {data.map((item, idx) => {
            const total = item.protein + item.carbs + item.fat;
            const maxTotal = Math.max(...data.map((d) => d.protein + d.carbs + d.fat), 200);
            const height = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
            const isToday = idx === data.length - 1;

            const proteinRatio = total > 0 ? (item.protein / total) * 100 : 33;
            const carbsRatio = total > 0 ? (item.carbs / total) * 100 : 33;
            const fatRatio = total > 0 ? (item.fat / total) * 100 : 34;

            return (
              <div key={item.date} className="flex-1 flex flex-col items-center group relative">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block z-20">
                  <div className="bg-neutral-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    <p>P: {item.protein.toFixed(0)}g</p>
                    <p>C: {item.carbs.toFixed(0)}g</p>
                    <p>F: {item.fat.toFixed(0)}g</p>
                  </div>
                </div>

                {/* Stacked Bar */}
                <div
                  className={`w-full rounded-t overflow-hidden flex flex-col ${isToday ? "ring-2 ring-primary-500" : ""}`}
                  style={{ height: `${Math.max(height, 2)}%` }}
                >
                  <div className="bg-blue-500" style={{ height: `${proteinRatio}%` }} />
                  <div className="bg-orange-500" style={{ height: `${carbsRatio}%` }} />
                  <div className="bg-yellow-500" style={{ height: `${fatRatio}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="flex gap-1 mt-2">
          {data.map((item, idx) => {
            const showLabel =
              data.length <= 7 ||
              idx === 0 ||
              idx === data.length - 1 ||
              idx === Math.floor(data.length / 2);

            return (
              <div key={item.date} className="flex-1 text-center">
                {showLabel && (
                  <span className="text-xs text-neutral-500">
                    {new Date(item.date).getDate()}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-xs text-neutral-600">Protein</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded" />
            <span className="text-xs text-neutral-600">Carbs</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded" />
            <span className="text-xs text-neutral-600">Fat</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Progress Tracking</h1>
          <p className="text-neutral-500">Track your nutrition journey over time</p>
        </div>
        <Button onClick={() => setShowWeightModal(true)} size="sm">
          + Log Weight
        </Button>
      </div>

      {/* Weight Summary Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
            <span className="text-3xl">⚖️</span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-green-700 mb-1">Current Weight</p>
            <p className="text-3xl font-bold text-green-800">
              {latestWeight ? `${latestWeight.weight} kg` : "Not logged"}
            </p>
            {profile?.goalWeight && latestWeight && (
              <p className="text-sm text-green-600 mt-1">
                {latestWeight.weight > profile.goalWeight
                  ? `${(latestWeight.weight - profile.goalWeight).toFixed(1)} kg to goal`
                  : latestWeight.weight < profile.goalWeight
                  ? `${(profile.goalWeight - latestWeight.weight).toFixed(1)} kg to goal`
                  : "🎉 Goal reached!"}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="px-4">
              <p className="text-sm text-neutral-500">7 Days</p>
              <p className={`text-lg font-bold ${weeklyChange?.change && weeklyChange.change < 0 ? "text-green-600" : weeklyChange?.change && weeklyChange.change > 0 ? "text-red-600" : "text-neutral-600"}`}>
                {weeklyChange ? `${weeklyChange.change > 0 ? "+" : ""}${weeklyChange.change.toFixed(1)} kg` : "—"}
              </p>
            </div>
            <div className="px-4">
              <p className="text-sm text-neutral-500">30 Days</p>
              <p className={`text-lg font-bold ${monthlyChange?.change && monthlyChange.change < 0 ? "text-green-600" : monthlyChange?.change && monthlyChange.change > 0 ? "text-red-600" : "text-neutral-600"}`}>
                {monthlyChange ? `${monthlyChange.change > 0 ? "+" : ""}${monthlyChange.change.toFixed(1)} kg` : "—"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Time Range Selector */}
      <div className="flex bg-neutral-100 rounded-xl p-1 gap-1">
        {[
          { value: "week" as TimeRange, label: "Week" },
          { value: "month" as TimeRange, label: "Month" },
          { value: "3months" as TimeRange, label: "3 Months" },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setTimeRange(option.value)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              timeRange === option.value
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-primary-600">{stats.avgCalories}</p>
          <p className="text-sm text-neutral-500">Avg Daily Calories</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.avgProtein}g</p>
          <p className="text-sm text-neutral-500">Avg Daily Protein</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-orange-600">{stats.streakDays}</p>
          <p className="text-sm text-neutral-500">Day Streak 🔥</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-green-600">{stats.consistency}%</p>
          <p className="text-sm text-neutral-500">Consistency</p>
        </Card>
      </div>

      {/* Chart Type Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { value: "calories" as ChartType, label: "Calories", icon: "🔥" },
          { value: "macros" as ChartType, label: "Macros", icon: "🥗" },
          { value: "water" as ChartType, label: "Water", icon: "💧" },
          { value: "weight" as ChartType, label: "Weight", icon: "⚖️" },
        ].map((type) => (
          <button
            key={type.value}
            onClick={() => setActiveChart(type.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeChart === type.value
                ? "bg-primary-500 text-white"
                : "bg-white border border-neutral-200 hover:border-primary-300"
            }`}
          >
            <span>{type.icon}</span>
            <span className="font-medium text-sm">{type.label}</span>
          </button>
        ))}
      </div>

      {/* Charts */}
      <Card>
        {activeChart === "calories" && (
          <>
            <CardHeader
              title="Daily Calories"
              subtitle={`Average: ${stats.avgCalories} cal/day`}
            />
            <BarChart
              data={chartData}
              valueKey="calories"
              maxValue={maxCalories * 1.2}
              color="bg-primary-500"
              goal={targets?.dailyCalories}
            />
          </>
        )}

        {activeChart === "macros" && (
          <>
            <CardHeader
              title="Macro Distribution"
              subtitle={`Avg P: ${stats.avgProtein}g | C: ${stats.avgCarbs}g | F: ${stats.avgFat}g`}
            />
            <MacroChart data={chartData} />
          </>
        )}

        {activeChart === "water" && (
          <>
            <CardHeader
              title="Water Intake"
              subtitle={`Average: ${stats.avgWater} glasses/day`}
            />
            <BarChart
              data={chartData}
              valueKey="water"
              maxValue={10}
              color="bg-blue-500"
              goal={8}
            />
          </>
        )}

        {activeChart === "weight" && (
          <>
            <CardHeader
              title="Weight Progress"
              subtitle={latestWeight ? `Current: ${latestWeight.weight} kg` : "Start logging your weight"}
              action={
                <Button size="sm" variant="ghost" onClick={() => setShowWeightModal(true)}>
                  + Log
                </Button>
              }
            />
            {weightDataPoints.length > 0 ? (
              <div className="pl-12">
                <WeightChart data={chartData} />
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <p className="text-4xl mb-4">⚖️</p>
                <p className="font-medium">No weight data yet</p>
                <p className="text-sm mb-4">Start logging your weight to see trends</p>
                <Button onClick={() => setShowWeightModal(true)} size="sm">
                  + Log Your First Weight
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Detailed Stats */}
      <Card>
        <CardHeader title="Detailed Statistics" subtitle={`Last ${dateRange.length} days`} />

        <div className="space-y-4">
          {/* Calories Breakdown */}
          <div className="p-4 bg-neutral-50 rounded-xl">
            <h4 className="font-medium text-neutral-900 mb-3">Calorie Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-neutral-900">{stats.totalCalories.toLocaleString()}</p>
                <p className="text-xs text-neutral-500">Total Calories</p>
              </div>
              <div>
                <p className="text-xl font-bold text-neutral-900">{stats.daysLogged}</p>
                <p className="text-xs text-neutral-500">Days Logged</p>
              </div>
              <div>
                <p className="text-xl font-bold text-neutral-900">{stats.avgCalories}</p>
                <p className="text-xs text-neutral-500">Daily Average</p>
              </div>
            </div>
          </div>

          {/* Macro Averages */}
          <div className="p-4 bg-neutral-50 rounded-xl">
            <h4 className="font-medium text-neutral-900 mb-3">Average Macros</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-600">Protein</span>
                  <span className="font-medium">{stats.avgProtein}g / {targets?.macros?.protein || 90}g</span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.min(100, (stats.avgProtein / (targets?.macros?.protein || 90)) * 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-600">Carbs</span>
                  <span className="font-medium">{stats.avgCarbs}g / {targets?.macros?.carbs || 200}g</span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${Math.min(100, (stats.avgCarbs / (targets?.macros?.carbs || 200)) * 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-600">Fat</span>
                  <span className="font-medium">{stats.avgFat}g / {targets?.macros?.fat || 60}g</span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${Math.min(100, (stats.avgFat / (targets?.macros?.fat || 60)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Best & Worst Days */}
          {stats.bestDay && stats.worstDay && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-xl">
                <h4 className="font-medium text-green-800 mb-2">🏆 Best Day</h4>
                <p className="text-sm text-green-600">{stats.bestDay.shortDate}</p>
                <p className="text-lg font-bold text-green-700">{stats.bestDay.calories} cal</p>
              </div>
              <div className="p-4 bg-red-50 rounded-xl">
                <h4 className="font-medium text-red-800 mb-2">📉 Lowest Day</h4>
                <p className="text-sm text-red-600">{stats.worstDay.shortDate}</p>
                <p className="text-lg font-bold text-red-700">{stats.worstDay.calories} cal</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Insights Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🧠</span>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-1">AI Insight</h3>
            <p className="text-neutral-600 text-sm">
              {stats.daysLogged === 0
                ? "Start logging your meals to get personalized insights and track your progress over time!"
                : stats.avgProtein < (targets?.macros?.protein || 90) * 0.8
                ? `Your average protein intake is ${stats.avgProtein}g, which is below your goal of ${targets?.macros?.protein || 90}g. Try adding more protein-rich foods like dal, paneer, or eggs.`
                : stats.consistency < 50
                ? "Your logging consistency is below 50%. Try to log meals every day for more accurate tracking and better insights!"
                : stats.avgCalories > (targets?.dailyCalories || 2000) * 1.1
                ? `You're averaging ${stats.avgCalories} calories, which is above your goal. Consider portion control or lighter meals.`
                : "Great job! You're maintaining good consistency and hitting your nutrition targets. Keep it up! 🎉"}
            </p>
          </div>
        </div>
      </Card>

      {/* No Data State */}
      {stats.daysLogged === 0 && (
        <Card className="text-center py-8">
          <p className="text-4xl mb-4">📊</p>
          <p className="font-medium text-neutral-700">No data to display</p>
          <p className="text-sm text-neutral-500 mb-4">
            Start logging your meals to see your progress
          </p>
          <Button onClick={() => (window.location.href = "/dashboard/log")}>
            Start Logging
          </Button>
        </Card>
      )}

      {/* Weight Logging Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader
              title="Log Your Weight"
              subtitle={`Date: ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}`}
            />

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder={latestWeight ? String(latestWeight.weight) : "70.0"}
                  className="w-full px-4 py-4 text-3xl font-bold text-center bg-white border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              {/* Quick buttons */}
              {latestWeight && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {[-0.5, -0.2, 0, 0.2, 0.5].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setWeightInput(String((latestWeight.weight + diff).toFixed(1)))}
                      className="px-3 py-1 text-sm rounded-full bg-neutral-100 hover:bg-neutral-200"
                    >
                      {diff === 0 ? "Same" : diff > 0 ? `+${diff}` : diff}
                    </button>
                  ))}
                </div>
              )}

              <Input
                label="Note (optional)"
                placeholder="e.g., Morning weight, after workout"
                value={weightNote}
                onChange={(e) => setWeightNote(e.target.value)}
              />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowWeightModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  onClick={handleLogWeight}
                  disabled={!weightInput || parseFloat(weightInput) <= 0}
                >
                  Save Weight
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
