import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Food, MealType, Nutrition, LoggedFood } from "@/types";

interface FoodLogEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  mealType: MealType;
  foods: LoggedFood[];
  createdAt: Date;
}

interface DailyLog {
  date: string;
  meals: {
    breakfast: LoggedFood[];
    lunch: LoggedFood[];
    dinner: LoggedFood[];
    snack: LoggedFood[];
  };
  water: number; // glasses
  totalNutrition: Nutrition;
}

interface FoodLogState {
  logs: Record<string, DailyLog>; // keyed by date string

  // Actions
  addFoodToMeal: (date: string, mealType: MealType, food: Food, servingGrams: number, quantity: number) => void;
  removeFoodFromMeal: (date: string, mealType: MealType, index: number) => void;
  addWater: (date: string) => void;
  removeWater: (date: string) => void;
  getDailyLog: (date: string) => DailyLog;
  getTotalNutrition: (date: string) => Nutrition;
  clearDay: (date: string) => void;
}

const emptyNutrition: Nutrition = {
  calories: 0,
  protein: 0,
  carbohydrates: 0,
  fat: 0,
  fiber: 0,
  sugar: 0,
  sodium: 0,
};

const createEmptyDailyLog = (date: string): DailyLog => ({
  date,
  meals: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  },
  water: 0,
  totalNutrition: { ...emptyNutrition },
});

// Calculate nutrition based on serving size
const calculateNutrition = (food: Food, servingGrams: number, quantity: number): Nutrition => {
  const multiplier = (servingGrams * quantity) / 100;
  const per100g = food.nutritionPer100g;

  return {
    calories: Math.round(per100g.calories * multiplier),
    protein: Math.round(per100g.protein * multiplier * 10) / 10,
    carbohydrates: Math.round(per100g.carbohydrates * multiplier * 10) / 10,
    fat: Math.round(per100g.fat * multiplier * 10) / 10,
    fiber: Math.round(per100g.fiber * multiplier * 10) / 10,
    sugar: Math.round(per100g.sugar * multiplier * 10) / 10,
    sodium: Math.round(per100g.sodium * multiplier),
  };
};

// Sum all nutrition from a daily log
const sumNutrition = (meals: DailyLog["meals"]): Nutrition => {
  const total = { ...emptyNutrition };

  Object.values(meals).forEach((mealFoods) => {
    mealFoods.forEach((loggedFood) => {
      total.calories += loggedFood.nutrition.calories;
      total.protein += loggedFood.nutrition.protein;
      total.carbohydrates += loggedFood.nutrition.carbohydrates;
      total.fat += loggedFood.nutrition.fat;
      total.fiber += loggedFood.nutrition.fiber;
      total.sugar += loggedFood.nutrition.sugar;
      total.sodium += loggedFood.nutrition.sodium;
    });
  });

  return total;
};

export const useFoodLogStore = create<FoodLogState>()(
  persist(
    (set, get) => ({
      logs: {},

      addFoodToMeal: (date, mealType, food, servingGrams, quantity) => {
        set((state) => {
          const existingLog = state.logs[date] || createEmptyDailyLog(date);
          const nutrition = calculateNutrition(food, servingGrams, quantity);

          const loggedFood: LoggedFood = {
            foodId: food.id,
            food,
            servingSize: { name: "custom", grams: servingGrams },
            quantity,
            nutrition,
          };

          const newMeals = {
            ...existingLog.meals,
            [mealType]: [...existingLog.meals[mealType], loggedFood],
          };

          const newLog: DailyLog = {
            ...existingLog,
            meals: newMeals,
            totalNutrition: sumNutrition(newMeals),
          };

          return {
            logs: {
              ...state.logs,
              [date]: newLog,
            },
          };
        });
      },

      removeFoodFromMeal: (date, mealType, index) => {
        set((state) => {
          const existingLog = state.logs[date];
          if (!existingLog) return state;

          const newMealFoods = [...existingLog.meals[mealType]];
          newMealFoods.splice(index, 1);

          const newMeals = {
            ...existingLog.meals,
            [mealType]: newMealFoods,
          };

          return {
            logs: {
              ...state.logs,
              [date]: {
                ...existingLog,
                meals: newMeals,
                totalNutrition: sumNutrition(newMeals),
              },
            },
          };
        });
      },

      addWater: (date) => {
        set((state) => {
          const existingLog = state.logs[date] || createEmptyDailyLog(date);
          return {
            logs: {
              ...state.logs,
              [date]: {
                ...existingLog,
                water: Math.min(existingLog.water + 1, 15),
              },
            },
          };
        });
      },

      removeWater: (date) => {
        set((state) => {
          const existingLog = state.logs[date];
          if (!existingLog) return state;
          return {
            logs: {
              ...state.logs,
              [date]: {
                ...existingLog,
                water: Math.max(existingLog.water - 1, 0),
              },
            },
          };
        });
      },

      getDailyLog: (date) => {
        const state = get();
        return state.logs[date] || createEmptyDailyLog(date);
      },

      getTotalNutrition: (date) => {
        const state = get();
        const log = state.logs[date];
        return log?.totalNutrition || { ...emptyNutrition };
      },

      clearDay: (date) => {
        set((state) => {
          const newLogs = { ...state.logs };
          delete newLogs[date];
          return { logs: newLogs };
        });
      },
    }),
    {
      name: "nepfit-food-log-storage",
    }
  )
);

// Helper to get today's date string
export const getTodayDateString = (): string => {
  return new Date().toISOString().split("T")[0];
};

// Helper to format date for display
export const formatDateDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateString === today.toISOString().split("T")[0]) {
    return "Today";
  } else if (dateString === yesterday.toISOString().split("T")[0]) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};
