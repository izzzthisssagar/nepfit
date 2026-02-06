"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, Button, Input, ProgressBar } from "@/components/ui";
import {
  useDiabetesStore,
  getBloodSugarStatus,
  glycemicIndexDatabase,
  getTodayDateString,
  type BloodSugarReading,
} from "@/store/diabetesStore";

type TabType = "tracker" | "gi_guide" | "medications" | "insights";

const readingTypes: { type: BloodSugarReading["type"]; label: string; icon: string }[] = [
  { type: "fasting", label: "Fasting", icon: "🌅" },
  { type: "pre_meal", label: "Pre-Meal", icon: "🍽️" },
  { type: "post_meal", label: "Post-Meal", icon: "⏰" },
  { type: "bedtime", label: "Bedtime", icon: "🌙" },
  { type: "random", label: "Random", icon: "📊" },
];

export default function DiabetesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("tracker");
  const [showAddReading, setShowAddReading] = useState(false);
  const [newReading, setNewReading] = useState({
    value: "",
    type: "fasting" as BloodSugarReading["type"],
    notes: "",
  });
  const [giFilter, setGiFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [giSearch, setGiSearch] = useState("");

  const {
    readings,
    medications,
    goals,
    dailyCarbLimit,
    carbsConsumed,
    addReading,
    deleteReading,
    getReadingsForDate,
    getAverageForPeriod,
    getCarbsForDate,
    getLowGIFoods,
    getMediumGIFoods,
    getHighGIFoods,
  } = useDiabetesStore();

  const today = getTodayDateString();
  const todayReadings = getReadingsForDate(today);
  const weekAverage = getAverageForPeriod(7);
  const monthAverage = getAverageForPeriod(30);
  const todayCarbs = getCarbsForDate(today);

  // Filter GI foods
  const filteredGIFoods = useMemo(() => {
    let foods = glycemicIndexDatabase;

    if (giFilter !== "all") {
      foods = foods.filter((f) => f.category === giFilter);
    }

    if (giSearch) {
      foods = foods.filter((f) =>
        f.name.toLowerCase().includes(giSearch.toLowerCase())
      );
    }

    return foods;
  }, [giFilter, giSearch]);

  const handleAddReading = () => {
    if (!newReading.value) return;

    addReading({
      value: parseInt(newReading.value),
      type: newReading.type,
      notes: newReading.notes || undefined,
      timestamp: new Date(),
      date: today,
    });

    setNewReading({ value: "", type: "fasting", notes: "" });
    setShowAddReading(false);
  };

  // Get last reading
  const lastReading = readings[0];
  const lastReadingStatus = lastReading
    ? getBloodSugarStatus(lastReading.value, lastReading.type)
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
          <span className="text-3xl">💉</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Diabetes Manager</h1>
          <p className="text-neutral-500">Track blood sugar & manage your diabetes</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center py-4">
          <div className={`text-3xl font-bold ${lastReadingStatus?.color || "text-neutral-400"}`}>
            {lastReading?.value || "--"}
          </div>
          <div className="text-sm text-neutral-500">Last Reading</div>
          <div className="text-xs text-neutral-400 mt-1">mg/dL</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-blue-600">{weekAverage || "--"}</div>
          <div className="text-sm text-neutral-500">7-Day Avg</div>
          <div className="text-xs text-neutral-400 mt-1">mg/dL</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-purple-600">{monthAverage || "--"}</div>
          <div className="text-sm text-neutral-500">30-Day Avg</div>
          <div className="text-xs text-neutral-400 mt-1">mg/dL</div>
        </Card>
        <Card className="text-center py-4">
          <div className={`text-3xl font-bold ${todayCarbs > dailyCarbLimit ? "text-red-600" : "text-green-600"}`}>
            {todayCarbs}
          </div>
          <div className="text-sm text-neutral-500">Carbs Today</div>
          <div className="text-xs text-neutral-400 mt-1">/ {dailyCarbLimit}g limit</div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-neutral-100 rounded-xl p-1 gap-1">
        {[
          { id: "tracker", label: "Tracker", icon: "📊" },
          { id: "gi_guide", label: "GI Guide", icon: "📚" },
          { id: "medications", label: "Meds", icon: "💊" },
          { id: "insights", label: "Insights", icon: "💡" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tracker Tab */}
      {activeTab === "tracker" && (
        <div className="space-y-6">
          {/* Add Reading Button */}
          <Button
            fullWidth
            size="lg"
            onClick={() => setShowAddReading(true)}
          >
            + Log Blood Sugar Reading
          </Button>

          {/* Today's Readings */}
          <Card>
            <CardHeader
              title="Today's Readings"
              subtitle={`${todayReadings.length} readings logged`}
            />
            {todayReadings.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <span className="text-4xl block mb-2">📊</span>
                <p>No readings logged today</p>
                <p className="text-sm">Tap above to log your blood sugar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayReadings.map((reading) => {
                  const status = getBloodSugarStatus(reading.value, reading.type);
                  const typeInfo = readingTypes.find((t) => t.type === reading.type);

                  return (
                    <div
                      key={reading.id}
                      className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                          {typeInfo?.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-2xl font-bold ${status.color}`}>
                              {reading.value}
                            </span>
                            <span className="text-neutral-400">mg/dL</span>
                          </div>
                          <p className="text-sm text-neutral-500">{typeInfo?.label}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          status.status === "normal"
                            ? "bg-green-100 text-green-700"
                            : status.status === "low"
                            ? "bg-blue-100 text-blue-700"
                            : status.status === "elevated"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {status.status}
                        </span>
                        <button
                          onClick={() => deleteReading(reading.id)}
                          className="block mt-2 text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Target Ranges */}
          <Card>
            <CardHeader title="Your Target Ranges" />
            <div className="space-y-3">
              {[
                { label: "Fasting", range: goals.fastingTarget },
                { label: "Pre-Meal", range: goals.preMealTarget },
                { label: "Post-Meal", range: goals.postMealTarget },
              ].map((target) => (
                <div key={target.label} className="flex items-center justify-between">
                  <span className="text-neutral-700">{target.label}</span>
                  <span className="font-medium text-primary-600">
                    {target.range.min} - {target.range.max} mg/dL
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* GI Guide Tab */}
      {activeTab === "gi_guide" && (
        <div className="space-y-6">
          {/* GI Explanation */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <h3 className="font-semibold text-neutral-900 mb-2">
              What is Glycemic Index (GI)?
            </h3>
            <p className="text-sm text-neutral-600">
              GI measures how quickly foods raise blood sugar. Choose low GI foods
              (55 or less) to keep blood sugar stable. Medium GI (56-69) foods are
              okay in moderation. Avoid high GI (70+) foods.
            </p>
          </Card>

          {/* Search and Filter */}
          <div className="flex gap-3">
            <Input
              placeholder="Search foods..."
              value={giSearch}
              onChange={(e) => setGiSearch(e.target.value)}
              className="flex-1"
            />
          </div>

          {/* GI Filter */}
          <div className="flex gap-2">
            {[
              { value: "all", label: "All", count: glycemicIndexDatabase.length },
              { value: "low", label: "Low GI ✓", count: getLowGIFoods().length },
              { value: "medium", label: "Medium", count: getMediumGIFoods().length },
              { value: "high", label: "High ⚠️", count: getHighGIFoods().length },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setGiFilter(filter.value as typeof giFilter)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  giFilter === filter.value
                    ? filter.value === "low"
                      ? "bg-green-500 text-white"
                      : filter.value === "medium"
                      ? "bg-yellow-500 text-white"
                      : filter.value === "high"
                      ? "bg-red-500 text-white"
                      : "bg-primary-500 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          {/* Food List */}
          <div className="space-y-3">
            {filteredGIFoods.map((food, idx) => (
              <Card
                key={idx}
                className={`${
                  food.category === "low"
                    ? "border-l-4 border-l-green-500"
                    : food.category === "medium"
                    ? "border-l-4 border-l-yellow-500"
                    : "border-l-4 border-l-red-500"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-neutral-900">{food.name}</h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          food.category === "low"
                            ? "bg-green-100 text-green-700"
                            : food.category === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        GI: {food.gi}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500">
                      {food.servingSize} • {food.carbsPerServing}g carbs
                    </p>
                    {food.tips && (
                      <p className="text-xs text-neutral-400 mt-1 italic">
                        💡 {food.tips}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Medications Tab */}
      {activeTab === "medications" && (
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Your Medications"
              subtitle="Track your diabetes medications"
            />
            {medications.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <span className="text-4xl block mb-2">💊</span>
                <p>No medications added yet</p>
                <p className="text-sm">Consult your doctor for medication advice</p>
              </div>
            ) : (
              <div className="space-y-3">
                {medications.map((med) => (
                  <div
                    key={med.id}
                    className={`p-4 rounded-xl ${
                      med.active ? "bg-green-50 border border-green-200" : "bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-neutral-900">{med.name}</h4>
                        <p className="text-sm text-neutral-500">
                          {med.dosage} • {med.frequency.replace("_", " ")}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          med.active
                            ? "bg-green-100 text-green-700"
                            : "bg-neutral-200 text-neutral-600"
                        }`}
                      >
                        {med.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Disclaimer */}
          <Card className="bg-yellow-50 border-yellow-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-semibold text-yellow-800">Medical Disclaimer</h4>
                <p className="text-sm text-yellow-700">
                  This app is for tracking purposes only. Always consult your doctor
                  before making changes to your medication or treatment plan.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === "insights" && (
        <div className="space-y-6">
          {/* Carb Tracking */}
          <Card>
            <CardHeader title="Daily Carb Intake" />
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-700">Today's Carbs</span>
                <span className="font-medium">
                  {todayCarbs}g / {dailyCarbLimit}g
                </span>
              </div>
              <ProgressBar
                value={todayCarbs}
                max={dailyCarbLimit}
                color={todayCarbs > dailyCarbLimit ? "secondary" : "primary"}
                showValue={false}
              />
            </div>
            <p className="text-sm text-neutral-500">
              {todayCarbs < dailyCarbLimit * 0.8
                ? "✅ Great job! You're within your carb limit."
                : todayCarbs <= dailyCarbLimit
                ? "⚠️ Approaching your daily limit. Choose low-carb options."
                : "❌ Over your limit. Consider reducing carbs in your next meal."}
            </p>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader title="💡 Diabetes-Friendly Tips" />
            <div className="space-y-3">
              {[
                "Eat smaller, more frequent meals to avoid blood sugar spikes",
                "Choose whole grains over refined grains",
                "Include protein and fiber with every meal",
                "Stay hydrated - drink plenty of water",
                "Monitor portions of rice and roti carefully",
                "Include bitter gourd (karela) in your diet",
                "Walk for 15-20 minutes after meals",
                "Get adequate sleep - it affects blood sugar",
              ].map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl"
                >
                  <span className="text-primary-500">•</span>
                  <p className="text-sm text-neutral-700">{tip}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Trends */}
          {readings.length >= 5 && (
            <Card>
              <CardHeader title="📈 Your Trends" />
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <span className="text-neutral-700">Fasting Average</span>
                  <span className="font-bold text-primary-600">
                    {Math.round(
                      readings
                        .filter((r) => r.type === "fasting")
                        .slice(0, 7)
                        .reduce((sum, r) => sum + r.value, 0) /
                        Math.max(1, readings.filter((r) => r.type === "fasting").slice(0, 7).length)
                    ) || "--"}{" "}
                    mg/dL
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <span className="text-neutral-700">Post-Meal Average</span>
                  <span className="font-bold text-primary-600">
                    {Math.round(
                      readings
                        .filter((r) => r.type === "post_meal")
                        .slice(0, 7)
                        .reduce((sum, r) => sum + r.value, 0) /
                        Math.max(1, readings.filter((r) => r.type === "post_meal").slice(0, 7).length)
                    ) || "--"}{" "}
                    mg/dL
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Add Reading Modal */}
      {showAddReading && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddReading(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
          <Card
            className="max-w-sm w-full"
          >
            <CardHeader title="Log Blood Sugar" />

            {/* Reading Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Reading Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {readingTypes.map((type) => (
                  <button
                    key={type.type}
                    onClick={() => setNewReading({ ...newReading, type: type.type })}
                    className={`p-2 rounded-xl text-center transition-all ${
                      newReading.type === type.type
                        ? "bg-primary-500 text-white"
                        : "bg-neutral-100 hover:bg-neutral-200"
                    }`}
                  >
                    <span className="text-xl block">{type.icon}</span>
                    <span className="text-xs">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Value Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Blood Sugar (mg/dL)
              </label>
              <input
                type="number"
                value={newReading.value}
                onChange={(e) => setNewReading({ ...newReading, value: e.target.value })}
                placeholder="120"
                className="w-full px-4 py-4 text-3xl font-bold text-center bg-white border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Preview Status */}
            {newReading.value && (
              <div className="mb-4">
                {(() => {
                  const status = getBloodSugarStatus(
                    parseInt(newReading.value),
                    newReading.type
                  );
                  return (
                    <div className={`p-3 rounded-xl text-center ${
                      status.status === "normal"
                        ? "bg-green-50 text-green-700"
                        : status.status === "low"
                        ? "bg-blue-50 text-blue-700"
                        : status.status === "elevated"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-red-50 text-red-700"
                    }`}>
                      {status.message}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Notes */}
            <div className="mb-4">
              <Input
                label="Notes (optional)"
                placeholder="e.g., After heavy meal"
                value={newReading.notes}
                onChange={(e) => setNewReading({ ...newReading, notes: e.target.value })}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowAddReading(false)}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                onClick={handleAddReading}
                disabled={!newReading.value}
              >
                Save Reading
              </Button>
            </div>
          </Card>
          </div>
        </div>
      )}
    </div>
  );
}
