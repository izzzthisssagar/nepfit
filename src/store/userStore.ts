import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, NutritionTargets, GoalType, ActivityLevel, DietType, HealthCondition } from "@/types";
import { calculateNutritionTargets } from "@/utils/nutrition";

interface UserState {
  // Auth state
  isAuthenticated: boolean;
  isOnboarded: boolean;

  // User profile
  profile: Partial<UserProfile> | null;
  targets: NutritionTargets | null;

  // Actions
  setAuthenticated: (value: boolean) => void;
  setOnboarded: (value: boolean) => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  calculateAndSetTargets: () => void;
  clearUser: () => void;
}

const defaultProfile: Partial<UserProfile> = {
  language: "en",
  preferredUnits: "metric",
  country: "Nepal",
  dietType: "non_vegetarian",
  spiceTolerance: "medium",
  activityLevel: "moderate",
  primaryGoal: "maintain",
  weeklyGoalKg: 0.5,
  healthConditions: [],
  cookingTimeAvailable: "medium",
  budgetPreference: "moderate",
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isOnboarded: false,
      profile: null,
      targets: null,

      setAuthenticated: (value) => set({ isAuthenticated: value }),

      setOnboarded: (value) => set({ isOnboarded: value }),

      setProfile: (profile) =>
        set({
          profile: { ...defaultProfile, ...profile },
        }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, ...updates }
            : { ...defaultProfile, ...updates },
        })),

      calculateAndSetTargets: () => {
        const { profile } = get();
        if (
          profile?.currentWeight &&
          profile?.height &&
          profile?.dateOfBirth &&
          profile?.gender &&
          profile?.activityLevel &&
          profile?.primaryGoal
        ) {
          const targets = calculateNutritionTargets(
            profile.currentWeight,
            profile.height,
            new Date(profile.dateOfBirth),
            profile.gender as "male" | "female" | "other",
            profile.activityLevel as ActivityLevel,
            profile.primaryGoal as GoalType,
            profile.weeklyGoalKg ?? 0.5,
            (profile.healthConditions as string[]) ?? []
          );
          set({ targets });
        }
      },

      clearUser: () =>
        set({
          isAuthenticated: false,
          isOnboarded: false,
          profile: null,
          targets: null,
        }),
    }),
    {
      name: "nepfit-user-storage",
      partialize: (state) => ({
        isOnboarded: state.isOnboarded,
        profile: state.profile,
        targets: state.targets,
      }),
    }
  )
);
