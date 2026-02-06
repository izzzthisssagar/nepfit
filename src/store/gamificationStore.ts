import { create } from "zustand";
import { persist } from "zustand/middleware";

// Badge definitions
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "streak" | "logging" | "nutrition" | "water" | "milestone";
  requirement: number;
  unlockedAt?: Date;
}

// Achievement definitions
export const BADGE_DEFINITIONS: Omit<Badge, "unlockedAt">[] = [
  // Streak badges
  {
    id: "streak_3",
    name: "Getting Started",
    description: "Log food for 3 days in a row",
    icon: "🔥",
    category: "streak",
    requirement: 3,
  },
  {
    id: "streak_7",
    name: "Week Warrior",
    description: "Log food for 7 days in a row",
    icon: "⚡",
    category: "streak",
    requirement: 7,
  },
  {
    id: "streak_14",
    name: "Fortnight Fighter",
    description: "Log food for 14 days in a row",
    icon: "💪",
    category: "streak",
    requirement: 14,
  },
  {
    id: "streak_30",
    name: "Monthly Master",
    description: "Log food for 30 days in a row",
    icon: "🏆",
    category: "streak",
    requirement: 30,
  },
  {
    id: "streak_100",
    name: "Century Champion",
    description: "Log food for 100 days in a row",
    icon: "👑",
    category: "streak",
    requirement: 100,
  },

  // Logging badges
  {
    id: "first_log",
    name: "First Bite",
    description: "Log your first meal",
    icon: "🍽️",
    category: "logging",
    requirement: 1,
  },
  {
    id: "logs_10",
    name: "Regular Logger",
    description: "Log 10 meals total",
    icon: "📝",
    category: "logging",
    requirement: 10,
  },
  {
    id: "logs_50",
    name: "Consistent Tracker",
    description: "Log 50 meals total",
    icon: "📊",
    category: "logging",
    requirement: 50,
  },
  {
    id: "logs_100",
    name: "Logging Legend",
    description: "Log 100 meals total",
    icon: "🌟",
    category: "logging",
    requirement: 100,
  },

  // Nutrition badges
  {
    id: "protein_goal_1",
    name: "Protein Power",
    description: "Hit your protein goal",
    icon: "🥩",
    category: "nutrition",
    requirement: 1,
  },
  {
    id: "protein_goal_7",
    name: "Protein Pro",
    description: "Hit protein goal 7 times",
    icon: "💪",
    category: "nutrition",
    requirement: 7,
  },
  {
    id: "calorie_goal_1",
    name: "Balanced Day",
    description: "Stay within calorie goal",
    icon: "⚖️",
    category: "nutrition",
    requirement: 1,
  },
  {
    id: "calorie_goal_7",
    name: "Balanced Week",
    description: "Stay within calorie goal 7 times",
    icon: "🎯",
    category: "nutrition",
    requirement: 7,
  },

  // Water badges
  {
    id: "water_goal_1",
    name: "Hydration Station",
    description: "Drink 8 glasses of water",
    icon: "💧",
    category: "water",
    requirement: 1,
  },
  {
    id: "water_goal_7",
    name: "Water Warrior",
    description: "Hit water goal 7 times",
    icon: "🌊",
    category: "water",
    requirement: 7,
  },
  {
    id: "water_goal_30",
    name: "Hydration Hero",
    description: "Hit water goal 30 times",
    icon: "🏊",
    category: "water",
    requirement: 30,
  },

  // Milestone badges
  {
    id: "weight_logged",
    name: "Scale Starter",
    description: "Log your first weight entry",
    icon: "⚖️",
    category: "milestone",
    requirement: 1,
  },
  {
    id: "recipe_saved",
    name: "Recipe Collector",
    description: "Save your first recipe",
    icon: "📚",
    category: "milestone",
    requirement: 1,
  },
  {
    id: "meal_plan_started",
    name: "Plan Ahead",
    description: "Start a meal plan",
    icon: "📅",
    category: "milestone",
    requirement: 1,
  },
];

interface GamificationStats {
  totalMealsLogged: number;
  totalDaysLogged: number;
  proteinGoalsHit: number;
  calorieGoalsHit: number;
  waterGoalsHit: number;
  recipeSaved: number;
  mealPlanStarted: number;
  weightLogged: number;
}

interface GamificationState {
  // Current streak
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string | null;

  // Stats for badges
  stats: GamificationStats;

  // Earned badges
  earnedBadges: Badge[];

  // Recent badge (for notifications)
  recentBadge: Badge | null;
  clearRecentBadge: () => void;

  // Actions
  recordDailyLog: (date: string) => void;
  recordMealLogged: () => void;
  recordProteinGoalHit: () => void;
  recordCalorieGoalHit: () => void;
  recordWaterGoalHit: () => void;
  recordRecipeSaved: () => void;
  recordMealPlanStarted: () => void;
  recordWeightLogged: () => void;

  // Getters
  getStreak: () => number;
  getBadges: () => Badge[];
  getUnlockedBadges: () => Badge[];
  getLockedBadges: () => Omit<Badge, "unlockedAt">[];
  getProgress: (badgeId: string) => { current: number; required: number; percentage: number };
}

const getDateString = (date: Date = new Date()): string => {
  return date.toISOString().split("T")[0];
};

const getYesterdayString = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getYesterdayString();
};

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      lastLogDate: null,
      stats: {
        totalMealsLogged: 0,
        totalDaysLogged: 0,
        proteinGoalsHit: 0,
        calorieGoalsHit: 0,
        waterGoalsHit: 0,
        recipeSaved: 0,
        mealPlanStarted: 0,
        weightLogged: 0,
      },
      earnedBadges: [],
      recentBadge: null,

      clearRecentBadge: () => set({ recentBadge: null }),

      recordDailyLog: (date: string) => {
        set((state) => {
          const today = getDateString();
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = getDateString(yesterday);

          let newStreak = state.currentStreak;
          let newDaysLogged = state.stats.totalDaysLogged;

          // Check if this is a new day being logged
          if (state.lastLogDate !== date) {
            newDaysLogged += 1;

            // Update streak logic
            if (state.lastLogDate === yesterdayStr || state.lastLogDate === today) {
              // Continuing streak or same day
              if (state.lastLogDate !== today) {
                newStreak = state.currentStreak + 1;
              }
            } else if (date === today && !state.lastLogDate) {
              // First ever log
              newStreak = 1;
            } else if (date === today && state.lastLogDate !== yesterdayStr) {
              // Streak broken, start fresh
              newStreak = 1;
            }
          }

          const newLongestStreak = Math.max(state.longestStreak, newStreak);

          // Check for new streak badges
          let newBadge: Badge | null = null;
          const streakBadges = BADGE_DEFINITIONS.filter((b) => b.category === "streak");

          for (const badgeDef of streakBadges) {
            if (
              newStreak >= badgeDef.requirement &&
              !state.earnedBadges.find((b) => b.id === badgeDef.id)
            ) {
              newBadge = { ...badgeDef, unlockedAt: new Date() };
              break;
            }
          }

          return {
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
            lastLogDate: date === today ? today : state.lastLogDate,
            stats: {
              ...state.stats,
              totalDaysLogged: newDaysLogged,
            },
            earnedBadges: newBadge
              ? [...state.earnedBadges, newBadge]
              : state.earnedBadges,
            recentBadge: newBadge || state.recentBadge,
          };
        });
      },

      recordMealLogged: () => {
        set((state) => {
          const newTotal = state.stats.totalMealsLogged + 1;

          // Check for logging badges
          let newBadge: Badge | null = null;
          const loggingBadges = BADGE_DEFINITIONS.filter((b) => b.category === "logging");

          for (const badgeDef of loggingBadges) {
            if (
              newTotal >= badgeDef.requirement &&
              !state.earnedBadges.find((b) => b.id === badgeDef.id)
            ) {
              newBadge = { ...badgeDef, unlockedAt: new Date() };
              break;
            }
          }

          return {
            stats: {
              ...state.stats,
              totalMealsLogged: newTotal,
            },
            earnedBadges: newBadge
              ? [...state.earnedBadges, newBadge]
              : state.earnedBadges,
            recentBadge: newBadge || state.recentBadge,
          };
        });
      },

      recordProteinGoalHit: () => {
        set((state) => {
          const newCount = state.stats.proteinGoalsHit + 1;
          let newBadge: Badge | null = null;

          if (newCount === 1) {
            const badge = BADGE_DEFINITIONS.find((b) => b.id === "protein_goal_1");
            if (badge && !state.earnedBadges.find((b) => b.id === badge.id)) {
              newBadge = { ...badge, unlockedAt: new Date() };
            }
          } else if (newCount === 7) {
            const badge = BADGE_DEFINITIONS.find((b) => b.id === "protein_goal_7");
            if (badge && !state.earnedBadges.find((b) => b.id === badge.id)) {
              newBadge = { ...badge, unlockedAt: new Date() };
            }
          }

          return {
            stats: { ...state.stats, proteinGoalsHit: newCount },
            earnedBadges: newBadge ? [...state.earnedBadges, newBadge] : state.earnedBadges,
            recentBadge: newBadge || state.recentBadge,
          };
        });
      },

      recordCalorieGoalHit: () => {
        set((state) => {
          const newCount = state.stats.calorieGoalsHit + 1;
          let newBadge: Badge | null = null;

          if (newCount === 1) {
            const badge = BADGE_DEFINITIONS.find((b) => b.id === "calorie_goal_1");
            if (badge && !state.earnedBadges.find((b) => b.id === badge.id)) {
              newBadge = { ...badge, unlockedAt: new Date() };
            }
          } else if (newCount === 7) {
            const badge = BADGE_DEFINITIONS.find((b) => b.id === "calorie_goal_7");
            if (badge && !state.earnedBadges.find((b) => b.id === badge.id)) {
              newBadge = { ...badge, unlockedAt: new Date() };
            }
          }

          return {
            stats: { ...state.stats, calorieGoalsHit: newCount },
            earnedBadges: newBadge ? [...state.earnedBadges, newBadge] : state.earnedBadges,
            recentBadge: newBadge || state.recentBadge,
          };
        });
      },

      recordWaterGoalHit: () => {
        set((state) => {
          const newCount = state.stats.waterGoalsHit + 1;
          let newBadge: Badge | null = null;

          const waterBadges = ["water_goal_1", "water_goal_7", "water_goal_30"];
          for (const badgeId of waterBadges) {
            const badge = BADGE_DEFINITIONS.find((b) => b.id === badgeId);
            if (
              badge &&
              newCount >= badge.requirement &&
              !state.earnedBadges.find((b) => b.id === badge.id)
            ) {
              newBadge = { ...badge, unlockedAt: new Date() };
              break;
            }
          }

          return {
            stats: { ...state.stats, waterGoalsHit: newCount },
            earnedBadges: newBadge ? [...state.earnedBadges, newBadge] : state.earnedBadges,
            recentBadge: newBadge || state.recentBadge,
          };
        });
      },

      recordRecipeSaved: () => {
        set((state) => {
          const badge = BADGE_DEFINITIONS.find((b) => b.id === "recipe_saved");
          let newBadge: Badge | null = null;

          if (badge && !state.earnedBadges.find((b) => b.id === badge.id)) {
            newBadge = { ...badge, unlockedAt: new Date() };
          }

          return {
            stats: { ...state.stats, recipeSaved: state.stats.recipeSaved + 1 },
            earnedBadges: newBadge ? [...state.earnedBadges, newBadge] : state.earnedBadges,
            recentBadge: newBadge || state.recentBadge,
          };
        });
      },

      recordMealPlanStarted: () => {
        set((state) => {
          const badge = BADGE_DEFINITIONS.find((b) => b.id === "meal_plan_started");
          let newBadge: Badge | null = null;

          if (badge && !state.earnedBadges.find((b) => b.id === badge.id)) {
            newBadge = { ...badge, unlockedAt: new Date() };
          }

          return {
            stats: { ...state.stats, mealPlanStarted: state.stats.mealPlanStarted + 1 },
            earnedBadges: newBadge ? [...state.earnedBadges, newBadge] : state.earnedBadges,
            recentBadge: newBadge || state.recentBadge,
          };
        });
      },

      recordWeightLogged: () => {
        set((state) => {
          const badge = BADGE_DEFINITIONS.find((b) => b.id === "weight_logged");
          let newBadge: Badge | null = null;

          if (badge && !state.earnedBadges.find((b) => b.id === badge.id)) {
            newBadge = { ...badge, unlockedAt: new Date() };
          }

          return {
            stats: { ...state.stats, weightLogged: state.stats.weightLogged + 1 },
            earnedBadges: newBadge ? [...state.earnedBadges, newBadge] : state.earnedBadges,
            recentBadge: newBadge || state.recentBadge,
          };
        });
      },

      getStreak: () => get().currentStreak,

      getBadges: () => get().earnedBadges,

      getUnlockedBadges: () => get().earnedBadges,

      getLockedBadges: () => {
        const earned = get().earnedBadges;
        return BADGE_DEFINITIONS.filter((b) => !earned.find((e) => e.id === b.id));
      },

      getProgress: (badgeId: string) => {
        const state = get();
        const badge = BADGE_DEFINITIONS.find((b) => b.id === badgeId);

        if (!badge) return { current: 0, required: 0, percentage: 0 };

        let current = 0;
        switch (badge.category) {
          case "streak":
            current = state.currentStreak;
            break;
          case "logging":
            current = state.stats.totalMealsLogged;
            break;
          case "nutrition":
            if (badgeId.includes("protein")) {
              current = state.stats.proteinGoalsHit;
            } else {
              current = state.stats.calorieGoalsHit;
            }
            break;
          case "water":
            current = state.stats.waterGoalsHit;
            break;
          default:
            current = 0;
        }

        return {
          current: Math.min(current, badge.requirement),
          required: badge.requirement,
          percentage: Math.min(100, Math.round((current / badge.requirement) * 100)),
        };
      },
    }),
    {
      name: "nepfit-gamification-storage",
    }
  )
);
