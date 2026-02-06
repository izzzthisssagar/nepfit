import { create } from "zustand";
import { persist } from "zustand/middleware";

// ==========================================
// Diabetes Management Module
// ==========================================

export interface BloodSugarReading {
  id: string;
  value: number; // mg/dL
  type: "fasting" | "pre_meal" | "post_meal" | "bedtime" | "random";
  mealContext?: string;
  notes?: string;
  timestamp: Date;
  date: string; // YYYY-MM-DD
}

export interface MedicationEntry {
  id: string;
  name: string;
  dosage: string;
  frequency: "daily" | "twice_daily" | "with_meals" | "as_needed";
  timeOfDay: string[];
  notes?: string;
  active: boolean;
}

export interface DiabetesGoals {
  fastingTarget: { min: number; max: number };
  preMealTarget: { min: number; max: number };
  postMealTarget: { min: number; max: number };
  hba1cTarget: number;
}

export interface GlycemicIndexFood {
  name: string;
  gi: number; // 0-100
  category: "low" | "medium" | "high";
  servingSize: string;
  carbsPerServing: number;
  tips?: string;
}

// Pre-defined GI database for common Nepali/Indian foods
export const glycemicIndexDatabase: GlycemicIndexFood[] = [
  // Low GI Foods (55 or less)
  { name: "Moong Dal", gi: 38, category: "low", servingSize: "100g cooked", carbsPerServing: 20, tips: "Excellent protein source, very diabetes-friendly" },
  { name: "Chickpeas (Chana)", gi: 33, category: "low", servingSize: "100g cooked", carbsPerServing: 27, tips: "High fiber, keeps blood sugar stable" },
  { name: "Rajma (Kidney Beans)", gi: 29, category: "low", servingSize: "100g cooked", carbsPerServing: 22, tips: "Great source of plant protein" },
  { name: "Masoor Dal", gi: 30, category: "low", servingSize: "100g cooked", carbsPerServing: 20, tips: "Quick cooking, nutritious" },
  { name: "Toor Dal", gi: 42, category: "low", servingSize: "100g cooked", carbsPerServing: 22, tips: "Staple dal, moderate portions" },
  { name: "Bitter Gourd (Karela)", gi: 24, category: "low", servingSize: "100g", carbsPerServing: 4, tips: "Known to help lower blood sugar" },
  { name: "Spinach (Palak)", gi: 15, category: "low", servingSize: "100g", carbsPerServing: 1, tips: "Excellent choice, eat freely" },
  { name: "Cauliflower (Gobi)", gi: 15, category: "low", servingSize: "100g", carbsPerServing: 3, tips: "Low carb rice substitute" },
  { name: "Cabbage (Patta Gobi)", gi: 10, category: "low", servingSize: "100g", carbsPerServing: 4, tips: "Great for salads and sabji" },
  { name: "Cucumber (Kheera)", gi: 15, category: "low", servingSize: "100g", carbsPerServing: 2, tips: "Perfect for snacking" },
  { name: "Tomato", gi: 15, category: "low", servingSize: "100g", carbsPerServing: 3, tips: "Use freely in cooking" },
  { name: "Paneer", gi: 14, category: "low", servingSize: "100g", carbsPerServing: 1, tips: "Good protein, moderate fat" },
  { name: "Curd/Dahi", gi: 14, category: "low", servingSize: "100g", carbsPerServing: 5, tips: "Probiotic benefits too" },
  { name: "Eggs", gi: 0, category: "low", servingSize: "2 eggs", carbsPerServing: 1, tips: "Zero GI, excellent protein" },
  { name: "Chicken", gi: 0, category: "low", servingSize: "100g", carbsPerServing: 0, tips: "Lean protein choice" },
  { name: "Fish", gi: 0, category: "low", servingSize: "100g", carbsPerServing: 0, tips: "Omega-3 benefits" },
  { name: "Almonds (Badam)", gi: 15, category: "low", servingSize: "30g", carbsPerServing: 6, tips: "Healthy snack option" },
  { name: "Walnuts (Akhrot)", gi: 15, category: "low", servingSize: "30g", carbsPerServing: 4, tips: "Brain and heart healthy" },
  { name: "Methi (Fenugreek)", gi: 21, category: "low", servingSize: "100g", carbsPerServing: 6, tips: "Helps control blood sugar" },
  { name: "Apple", gi: 38, category: "low", servingSize: "1 medium", carbsPerServing: 21, tips: "Eat with skin for fiber" },
  { name: "Orange", gi: 43, category: "low", servingSize: "1 medium", carbsPerServing: 15, tips: "Vitamin C boost" },
  { name: "Guava (Amrood)", gi: 31, category: "low", servingSize: "1 medium", carbsPerServing: 14, tips: "Excellent for diabetics" },
  { name: "Papaya", gi: 42, category: "low", servingSize: "100g", carbsPerServing: 10, tips: "Digestive benefits" },
  { name: "Barley (Jau)", gi: 28, category: "low", servingSize: "100g cooked", carbsPerServing: 28, tips: "Great rice alternative" },
  { name: "Oats", gi: 55, category: "low", servingSize: "30g dry", carbsPerServing: 21, tips: "Steel cut is best" },

  // Medium GI Foods (56-69)
  { name: "Brown Rice", gi: 68, category: "medium", servingSize: "100g cooked", carbsPerServing: 23, tips: "Better than white rice" },
  { name: "Whole Wheat Roti", gi: 62, category: "medium", servingSize: "1 medium", carbsPerServing: 15, tips: "Limit to 2-3 per meal" },
  { name: "Basmati Rice", gi: 58, category: "medium", servingSize: "100g cooked", carbsPerServing: 28, tips: "Best rice option for diabetics" },
  { name: "Sweet Potato (Shakarkandi)", gi: 63, category: "medium", servingSize: "100g", carbsPerServing: 20, tips: "Better than regular potato" },
  { name: "Banana (Kela)", gi: 62, category: "medium", servingSize: "1 medium", carbsPerServing: 27, tips: "Green is lower GI than ripe" },
  { name: "Mango (Aam)", gi: 60, category: "medium", servingSize: "100g", carbsPerServing: 17, tips: "Limit portion size" },
  { name: "Pineapple", gi: 66, category: "medium", servingSize: "100g", carbsPerServing: 13, tips: "Eat in moderation" },
  { name: "Beetroot (Chukandar)", gi: 64, category: "medium", servingSize: "100g", carbsPerServing: 10, tips: "Nutritious but moderate portions" },
  { name: "Corn (Makka)", gi: 60, category: "medium", servingSize: "100g", carbsPerServing: 19, tips: "Fresh corn is better" },
  { name: "Peas (Matar)", gi: 68, category: "medium", servingSize: "100g", carbsPerServing: 14, tips: "Good protein and fiber" },
  { name: "Multigrain Bread", gi: 62, category: "medium", servingSize: "1 slice", carbsPerServing: 12, tips: "Check ingredients for whole grains" },

  // High GI Foods (70+)
  { name: "White Rice", gi: 89, category: "high", servingSize: "100g cooked", carbsPerServing: 28, tips: "⚠️ Avoid or limit severely" },
  { name: "White Bread", gi: 75, category: "high", servingSize: "1 slice", carbsPerServing: 14, tips: "⚠️ Switch to whole grain" },
  { name: "Potato (Aloo)", gi: 82, category: "high", servingSize: "100g", carbsPerServing: 17, tips: "⚠️ Limit portions, cool before eating" },
  { name: "Watermelon (Tarbooz)", gi: 76, category: "high", servingSize: "100g", carbsPerServing: 8, tips: "⚠️ High GI but low carb per serving" },
  { name: "Maida (Refined Flour)", gi: 85, category: "high", servingSize: "100g", carbsPerServing: 76, tips: "⚠️ Avoid - causes sugar spikes" },
  { name: "Instant Noodles", gi: 83, category: "high", servingSize: "100g", carbsPerServing: 55, tips: "⚠️ Highly processed, avoid" },
  { name: "Cornflakes", gi: 81, category: "high", servingSize: "30g", carbsPerServing: 26, tips: "⚠️ Choose oats instead" },
  { name: "Paratha", gi: 80, category: "high", servingSize: "1 medium", carbsPerServing: 30, tips: "⚠️ Oil + maida = sugar spike" },
  { name: "Puri", gi: 85, category: "high", servingSize: "2 pieces", carbsPerServing: 25, tips: "⚠️ Deep fried, avoid" },
  { name: "Jalebi", gi: 95, category: "high", servingSize: "50g", carbsPerServing: 45, tips: "⚠️ Pure sugar, strictly avoid" },
  { name: "Gulab Jamun", gi: 90, category: "high", servingSize: "2 pieces", carbsPerServing: 40, tips: "⚠️ Festival only, one piece max" },
];

// Blood sugar status helpers
export const getBloodSugarStatus = (value: number, type: BloodSugarReading["type"]): {
  status: "low" | "normal" | "elevated" | "high";
  message: string;
  color: string;
} => {
  const ranges = {
    fasting: { low: 70, normalMax: 100, elevatedMax: 126 },
    pre_meal: { low: 70, normalMax: 100, elevatedMax: 130 },
    post_meal: { low: 70, normalMax: 140, elevatedMax: 180 },
    bedtime: { low: 90, normalMax: 150, elevatedMax: 180 },
    random: { low: 70, normalMax: 140, elevatedMax: 200 },
  };

  const range = ranges[type];

  if (value < range.low) {
    return {
      status: "low",
      message: "Low - Consider having a snack",
      color: "text-blue-600",
    };
  } else if (value <= range.normalMax) {
    return {
      status: "normal",
      message: "Normal - Great job!",
      color: "text-green-600",
    };
  } else if (value <= range.elevatedMax) {
    return {
      status: "elevated",
      message: "Elevated - Monitor closely",
      color: "text-yellow-600",
    };
  } else {
    return {
      status: "high",
      message: "High - Consider consulting doctor",
      color: "text-red-600",
    };
  }
};

interface DiabetesState {
  // Blood sugar readings
  readings: BloodSugarReading[];

  // Medications
  medications: MedicationEntry[];

  // Goals
  goals: DiabetesGoals;

  // HbA1c history
  hba1cReadings: { value: number; date: string }[];

  // Daily carb tracking
  dailyCarbLimit: number;
  carbsConsumed: Record<string, number>; // date -> carbs

  // Actions
  addReading: (reading: Omit<BloodSugarReading, "id">) => void;
  deleteReading: (id: string) => void;
  addMedication: (med: Omit<MedicationEntry, "id">) => void;
  updateMedication: (id: string, med: Partial<MedicationEntry>) => void;
  deleteMedication: (id: string) => void;
  updateGoals: (goals: Partial<DiabetesGoals>) => void;
  addHba1c: (value: number, date: string) => void;
  setCarbLimit: (limit: number) => void;
  addCarbs: (date: string, carbs: number) => void;

  // Getters
  getReadingsForDate: (date: string) => BloodSugarReading[];
  getAverageForPeriod: (days: number) => number;
  getReadingsByType: (type: BloodSugarReading["type"]) => BloodSugarReading[];
  getCarbsForDate: (date: string) => number;
  getFoodGI: (foodName: string) => GlycemicIndexFood | undefined;
  getLowGIFoods: () => GlycemicIndexFood[];
  getMediumGIFoods: () => GlycemicIndexFood[];
  getHighGIFoods: () => GlycemicIndexFood[];
}

export const useDiabetesStore = create<DiabetesState>()(
  persist(
    (set, get) => ({
      readings: [],
      medications: [],
      goals: {
        fastingTarget: { min: 80, max: 100 },
        preMealTarget: { min: 80, max: 130 },
        postMealTarget: { min: 80, max: 180 },
        hba1cTarget: 7.0,
      },
      hba1cReadings: [],
      dailyCarbLimit: 130, // Default for diabetics
      carbsConsumed: {},

      addReading: (reading) => {
        set((state) => ({
          readings: [
            { ...reading, id: `bs_${Date.now()}` },
            ...state.readings,
          ].slice(0, 1000), // Keep last 1000 readings
        }));
      },

      deleteReading: (id) => {
        set((state) => ({
          readings: state.readings.filter((r) => r.id !== id),
        }));
      },

      addMedication: (med) => {
        set((state) => ({
          medications: [
            { ...med, id: `med_${Date.now()}` },
            ...state.medications,
          ],
        }));
      },

      updateMedication: (id, updates) => {
        set((state) => ({
          medications: state.medications.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        }));
      },

      deleteMedication: (id) => {
        set((state) => ({
          medications: state.medications.filter((m) => m.id !== id),
        }));
      },

      updateGoals: (newGoals) => {
        set((state) => ({
          goals: { ...state.goals, ...newGoals },
        }));
      },

      addHba1c: (value, date) => {
        set((state) => ({
          hba1cReadings: [
            { value, date },
            ...state.hba1cReadings.filter((r) => r.date !== date),
          ].slice(0, 20), // Keep last 20
        }));
      },

      setCarbLimit: (limit) => {
        set({ dailyCarbLimit: limit });
      },

      addCarbs: (date, carbs) => {
        set((state) => ({
          carbsConsumed: {
            ...state.carbsConsumed,
            [date]: (state.carbsConsumed[date] || 0) + carbs,
          },
        }));
      },

      getReadingsForDate: (date) => {
        return get().readings.filter((r) => r.date === date);
      },

      getAverageForPeriod: (days) => {
        const state = get();
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const cutoffStr = cutoff.toISOString().split("T")[0];

        const relevantReadings = state.readings.filter((r) => r.date >= cutoffStr);
        if (relevantReadings.length === 0) return 0;

        const sum = relevantReadings.reduce((acc, r) => acc + r.value, 0);
        return Math.round(sum / relevantReadings.length);
      },

      getReadingsByType: (type) => {
        return get().readings.filter((r) => r.type === type);
      },

      getCarbsForDate: (date) => {
        return get().carbsConsumed[date] || 0;
      },

      getFoodGI: (foodName) => {
        return glycemicIndexDatabase.find(
          (f) => f.name.toLowerCase().includes(foodName.toLowerCase())
        );
      },

      getLowGIFoods: () => {
        return glycemicIndexDatabase.filter((f) => f.category === "low");
      },

      getMediumGIFoods: () => {
        return glycemicIndexDatabase.filter((f) => f.category === "medium");
      },

      getHighGIFoods: () => {
        return glycemicIndexDatabase.filter((f) => f.category === "high");
      },
    }),
    {
      name: "nepfit-diabetes-storage",
    }
  )
);

// Helper to get date string
export const getTodayDateString = (): string => {
  return new Date().toISOString().split("T")[0];
};
