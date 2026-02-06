"use client";

import { useState } from "react";
import { Card, CardHeader, Button } from "@/components/ui";
import {
  festivals,
  getUpcomingFestivals,
  getTodaysFestival,
  type Festival,
} from "@/data/festivals";

export default function FestivalsPage() {
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const [filter, setFilter] = useState<"all" | "nepali" | "indian">("all");

  const todaysFestival = getTodaysFestival();
  const upcomingFestivals = getUpcomingFestivals(60);

  const filteredFestivals = festivals.filter(
    (f) => filter === "all" || f.type === filter || f.type === "both"
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const festivalDate = new Date(dateString);
    festivalDate.setHours(0, 0, 0, 0);
    const diff = Math.ceil((festivalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today!";
    if (diff === 1) return "Tomorrow";
    if (diff < 0) return "Passed";
    return `${diff} days away`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Festival Calendar</h1>
        <p className="text-neutral-500">
          Traditional foods & healthy eating tips for festivals
        </p>
      </div>

      {/* Today's Festival Alert */}
      {todaysFestival && (
        <Card className="bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
              🎉
            </div>
            <div className="flex-1">
              <p className="text-orange-100 text-sm">Today is</p>
              <h2 className="text-2xl font-bold">{todaysFestival.name}</h2>
              <p className="text-orange-100 text-sm mt-1">
                {todaysFestival.significance}
              </p>
            </div>
            <Button
              className="bg-white text-orange-600 hover:bg-orange-50"
              onClick={() => setSelectedFestival(todaysFestival)}
            >
              View Tips
            </Button>
          </div>
        </Card>
      )}

      {/* Upcoming Festivals */}
      {upcomingFestivals.length > 0 && (
        <Card>
          <CardHeader
            title="Upcoming Festivals"
            subtitle="Plan your healthy eating strategy"
          />
          <div className="space-y-3">
            {upcomingFestivals.slice(0, 3).map((festival) => (
              <button
                key={festival.id}
                onClick={() => setSelectedFestival(festival)}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-all text-left"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">
                    {festival.fastingDay ? "🙏" : "🎊"}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-neutral-900">
                      {festival.name}
                    </h3>
                    {festival.fastingDay && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        Fasting
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500">
                    {formatDate(festival.date)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-primary-600">
                    {getDaysUntil(festival.date)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { value: "all", label: "All Festivals" },
          { value: "nepali", label: "🇳🇵 Nepali" },
          { value: "indian", label: "🇮🇳 Indian" },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value as typeof filter)}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === option.value
                ? "bg-primary-500 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* All Festivals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFestivals.map((festival) => (
          <Card
            key={festival.id}
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => setSelectedFestival(festival)}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">
                  {festival.fastingDay ? "🙏" : "🎊"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-neutral-900 truncate">
                    {festival.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      festival.type === "nepali"
                        ? "bg-blue-100 text-blue-700"
                        : festival.type === "indian"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {festival.type === "both"
                      ? "Both"
                      : festival.type.charAt(0).toUpperCase() +
                        festival.type.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 mb-2">
                  {formatDate(festival.date)}
                </p>
                <p className="text-xs text-neutral-400 line-clamp-2">
                  {festival.significance}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                  <span>🍽️ {festival.traditionalFoods.length} foods</span>
                  <span>💡 {festival.healthTips.length} tips</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Festival Detail Modal */}
      {selectedFestival && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setSelectedFestival(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    {selectedFestival.name}
                  </h2>
                  {(selectedFestival.nameNepali ||
                    selectedFestival.nameHindi) && (
                    <p className="text-orange-100">
                      {selectedFestival.nameNepali || selectedFestival.nameHindi}
                    </p>
                  )}
                  <p className="text-sm text-orange-100 mt-2">
                    {formatDate(selectedFestival.date)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFestival(null)}
                  className="p-2 hover:bg-white/20 rounded-lg"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {selectedFestival.fastingDay && (
                <div className="mt-3 inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                  <span>🙏</span>
                  <span>Fasting Festival</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* About */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">About</h3>
                <p className="text-neutral-600 text-sm">
                  {selectedFestival.description}
                </p>
              </div>

              {/* Traditional Foods */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">
                  🍽️ Traditional Foods
                </h3>
                <div className="space-y-3">
                  {selectedFestival.traditionalFoods.map((food, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl ${
                        food.isHealthy
                          ? "bg-green-50 border border-green-200"
                          : "bg-orange-50 border border-orange-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-neutral-900">
                          {food.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          {food.calories && (
                            <span className="text-xs text-neutral-500">
                              ~{food.calories} cal
                            </span>
                          )}
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              food.isHealthy
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {food.isHealthy ? "✓ Healthy" : "Indulge"}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">
                        {food.description}
                      </p>
                      {food.tips && (
                        <p className="text-xs text-neutral-500 italic">
                          💡 {food.tips}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Health Tips */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">
                  💪 Health Tips
                </h3>
                <div className="bg-blue-50 rounded-xl p-4">
                  <ul className="space-y-2">
                    {selectedFestival.healthTips.map((tip, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-neutral-700"
                      >
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Regions */}
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <span>📍 Celebrated in:</span>
                <span>{selectedFestival.region.join(", ")}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t p-4">
              <Button
                fullWidth
                onClick={() => setSelectedFestival(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
