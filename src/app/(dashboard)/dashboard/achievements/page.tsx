"use client";

import { useState } from "react";
import { Card, CardHeader, Button } from "@/components/ui";
import { useGamificationStore, BADGE_DEFINITIONS, type Badge } from "@/store/gamificationStore";

type BadgeCategory = "all" | "streak" | "logging" | "nutrition" | "water" | "milestone";

const categoryConfig: { type: BadgeCategory; label: string; icon: string }[] = [
  { type: "all", label: "All", icon: "🏅" },
  { type: "streak", label: "Streaks", icon: "🔥" },
  { type: "logging", label: "Logging", icon: "📝" },
  { type: "nutrition", label: "Nutrition", icon: "🥗" },
  { type: "water", label: "Hydration", icon: "💧" },
  { type: "milestone", label: "Milestones", icon: "🎯" },
];

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory>("all");
  const [selectedBadge, setSelectedBadge] = useState<(Badge | Omit<Badge, "unlockedAt">) | null>(null);

  const {
    currentStreak,
    longestStreak,
    stats,
    earnedBadges,
    getProgress,
  } = useGamificationStore();

  // Filter badges by category
  const filteredBadges = BADGE_DEFINITIONS.filter(
    (badge) => selectedCategory === "all" || badge.category === selectedCategory
  );

  // Check if badge is earned
  const isBadgeEarned = (badgeId: string) => {
    return earnedBadges.some((b) => b.id === badgeId);
  };

  // Get earned badge details
  const getEarnedBadge = (badgeId: string) => {
    return earnedBadges.find((b) => b.id === badgeId);
  };

  // Count badges by category
  const countByCategory = (category: BadgeCategory) => {
    if (category === "all") {
      return { earned: earnedBadges.length, total: BADGE_DEFINITIONS.length };
    }
    const categoryBadges = BADGE_DEFINITIONS.filter((b) => b.category === category);
    const earnedInCategory = earnedBadges.filter((b) => b.category === category);
    return { earned: earnedInCategory.length, total: categoryBadges.length };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Achievements</h1>
        <p className="text-neutral-500">Track your progress and earn badges</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-primary-600">{currentStreak}</div>
          <div className="text-sm text-neutral-500">Current Streak</div>
          <div className="text-xs text-neutral-400 mt-1">🔥 days</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-orange-600">{longestStreak}</div>
          <div className="text-sm text-neutral-500">Best Streak</div>
          <div className="text-xs text-neutral-400 mt-1">🏆 days</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-green-600">{earnedBadges.length}</div>
          <div className="text-sm text-neutral-500">Badges Earned</div>
          <div className="text-xs text-neutral-400 mt-1">/ {BADGE_DEFINITIONS.length} total</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-blue-600">{stats.totalMealsLogged}</div>
          <div className="text-sm text-neutral-500">Meals Logged</div>
          <div className="text-xs text-neutral-400 mt-1">📝 total</div>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
        {categoryConfig.map((category) => {
          const counts = countByCategory(category.type);
          return (
            <button
              key={category.type}
              onClick={() => setSelectedCategory(category.type)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === category.type
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
              <span className="ml-1 text-xs opacity-75">
                ({counts.earned}/{counts.total})
              </span>
            </button>
          );
        })}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const earned = isBadgeEarned(badge.id);
          const earnedBadge = getEarnedBadge(badge.id);
          const progress = getProgress(badge.id);

          return (
            <Card
              key={badge.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                earned ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200" : "opacity-60"
              }`}
              onClick={() => setSelectedBadge(earned ? earnedBadge! : badge)}
            >
              <div className="text-center py-4">
                <div
                  className={`text-5xl mb-3 ${
                    earned ? "" : "grayscale opacity-50"
                  }`}
                >
                  {badge.icon}
                </div>
                <h3 className="font-semibold text-neutral-900 mb-1">{badge.name}</h3>
                <p className="text-xs text-neutral-500 mb-3">{badge.description}</p>

                {earned ? (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Unlocked
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-neutral-500">
                      {progress.current} / {progress.required}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
          <Card className="max-w-sm w-full">
            <div className="text-center py-6">
              <div className="text-7xl mb-4">{selectedBadge.icon}</div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                {selectedBadge.name}
              </h2>
              <p className="text-neutral-500 mb-4">{selectedBadge.description}</p>

              {"unlockedAt" in selectedBadge && selectedBadge.unlockedAt ? (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Badge Unlocked!
                  </div>
                  <p className="text-xs text-neutral-400">
                    Earned on{" "}
                    {new Date(selectedBadge.unlockedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm text-neutral-500">
                    Keep going to unlock this badge!
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-3">
                    <div
                      className="bg-primary-500 h-3 rounded-full transition-all"
                      style={{
                        width: `${getProgress(selectedBadge.id).percentage}%`,
                      }}
                    />
                  </div>
                  <p className="text-sm text-neutral-600">
                    {getProgress(selectedBadge.id).current} /{" "}
                    {getProgress(selectedBadge.id).required} completed
                  </p>
                </div>
              )}

              <Button
                className="mt-6"
                variant="secondary"
                onClick={() => setSelectedBadge(null)}
              >
                Close
              </Button>
            </div>
          </Card>
          </div>
        </div>
      )}

      {/* Tips Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-1">Tips to Earn More Badges</h3>
            <ul className="text-neutral-600 text-sm space-y-1">
              <li>• Log your meals every day to build your streak</li>
              <li>• Track your water intake to earn hydration badges</li>
              <li>• Hit your protein goals for nutrition achievements</li>
              <li>• Save recipes and start meal plans for milestone badges</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
