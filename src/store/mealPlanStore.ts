import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MealPlanItem {
  foodId: string;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DayPlan {
  breakfast: MealPlanItem[];
  morningSnack?: MealPlanItem[];
  lunch: MealPlanItem[];
  afternoonSnack?: MealPlanItem[];
  dinner: MealPlanItem[];
  eveningSnack?: MealPlanItem[];
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  goal: "weight_loss" | "muscle_gain" | "maintenance" | "diabetic_friendly" | "high_protein";
  duration: "1_week" | "2_weeks" | "1_month";
  difficulty: "easy" | "moderate" | "challenging";
  cuisine: "nepali" | "indian" | "mixed";
  dailyCalories: number;
  dailyProtein: number;
  tags: string[];
  image: string;
  days: DayPlan[];
  createdBy: "system" | "user";
  premium: boolean;
}

interface MealPlanState {
  activePlanId: string | null;
  activePlanStartDate: string | null;
  savedPlans: string[];
  customPlans: MealPlan[];

  // Actions
  setActivePlan: (planId: string | null) => void;
  startPlan: (planId: string) => void;
  stopPlan: () => void;
  savePlan: (planId: string) => void;
  unsavePlan: (planId: string) => void;
  addCustomPlan: (plan: MealPlan) => void;
  removeCustomPlan: (planId: string) => void;
  getCurrentDayPlan: () => { dayNumber: number; plan: DayPlan } | null;
}

// Pre-made meal plans
export const systemMealPlans: MealPlan[] = [
  {
    id: "nepali-weight-loss",
    name: "Nepali Weight Loss Plan",
    description: "A calorie-controlled plan featuring traditional Nepali foods. Perfect for sustainable weight loss while enjoying familiar flavors.",
    goal: "weight_loss",
    duration: "1_week",
    difficulty: "easy",
    cuisine: "nepali",
    dailyCalories: 1500,
    dailyProtein: 75,
    tags: ["vegetarian-friendly", "home-cooking", "budget-friendly"],
    image: "🇳🇵",
    premium: false,
    createdBy: "system",
    days: [
      {
        breakfast: [
          { foodId: "chiura", name: "Chiura with curd", portion: "1 bowl", calories: 250, protein: 6, carbs: 45, fat: 5 },
          { foodId: "tea", name: "Chiya (no sugar)", portion: "1 cup", calories: 30, protein: 1, carbs: 5, fat: 1 },
        ],
        morningSnack: [
          { foodId: "fruits", name: "Seasonal fruits", portion: "1 bowl", calories: 80, protein: 1, carbs: 20, fat: 0 },
        ],
        lunch: [
          { foodId: "dal", name: "Dal (masoor)", portion: "1 katori", calories: 120, protein: 8, carbs: 18, fat: 2 },
          { foodId: "rice", name: "Rice", portion: "1 cup (cooked)", calories: 200, protein: 4, carbs: 45, fat: 0.5 },
          { foodId: "tarkari", name: "Mixed vegetable tarkari", portion: "1 katori", calories: 100, protein: 3, carbs: 15, fat: 4 },
          { foodId: "achar", name: "Tomato achar", portion: "2 tbsp", calories: 30, protein: 1, carbs: 5, fat: 1 },
        ],
        afternoonSnack: [
          { foodId: "muri", name: "Bhujeko muri", portion: "1 cup", calories: 100, protein: 2, carbs: 20, fat: 2 },
        ],
        dinner: [
          { foodId: "roti", name: "Whole wheat roti", portion: "2 pieces", calories: 180, protein: 6, carbs: 35, fat: 2 },
          { foodId: "sabji", name: "Palungo ko saag", portion: "1 katori", calories: 80, protein: 4, carbs: 8, fat: 3 },
          { foodId: "dal", name: "Dal", portion: "1/2 katori", calories: 60, protein: 4, carbs: 9, fat: 1 },
        ],
        eveningSnack: [
          { foodId: "milk", name: "Warm milk (low fat)", portion: "1 glass", calories: 100, protein: 8, carbs: 12, fat: 2 },
        ],
      },
      {
        breakfast: [
          { foodId: "oats", name: "Masala oats", portion: "1 bowl", calories: 220, protein: 8, carbs: 35, fat: 6 },
          { foodId: "tea", name: "Green tea", portion: "1 cup", calories: 5, protein: 0, carbs: 1, fat: 0 },
        ],
        morningSnack: [
          { foodId: "chana", name: "Roasted chana", portion: "1/4 cup", calories: 90, protein: 5, carbs: 15, fat: 1 },
        ],
        lunch: [
          { foodId: "dal", name: "Dal (chana)", portion: "1 katori", calories: 130, protein: 9, carbs: 20, fat: 3 },
          { foodId: "rice", name: "Brown rice", portion: "3/4 cup", calories: 160, protein: 3, carbs: 35, fat: 1 },
          { foodId: "chicken", name: "Chicken curry (no skin)", portion: "100g", calories: 180, protein: 25, carbs: 5, fat: 8 },
          { foodId: "salad", name: "Cucumber & tomato salad", portion: "1 bowl", calories: 40, protein: 1, carbs: 8, fat: 0 },
        ],
        afternoonSnack: [
          { foodId: "lassi", name: "Plain lassi (no sugar)", portion: "1 glass", calories: 100, protein: 6, carbs: 10, fat: 3 },
        ],
        dinner: [
          { foodId: "roti", name: "Bajra roti", portion: "2 pieces", calories: 160, protein: 5, carbs: 32, fat: 2 },
          { foodId: "sabji", name: "Bottle gourd (lauka) sabji", portion: "1 katori", calories: 70, protein: 2, carbs: 12, fat: 3 },
          { foodId: "raita", name: "Cucumber raita", portion: "1/2 cup", calories: 50, protein: 3, carbs: 5, fat: 2 },
        ],
      },
      {
        breakfast: [
          { foodId: "paratha", name: "Aloo paratha (less oil)", portion: "1 piece", calories: 200, protein: 5, carbs: 35, fat: 6 },
          { foodId: "curd", name: "Low-fat curd", portion: "1/2 cup", calories: 60, protein: 5, carbs: 6, fat: 2 },
        ],
        morningSnack: [
          { foodId: "fruits", name: "Apple", portion: "1 medium", calories: 95, protein: 0.5, carbs: 25, fat: 0 },
        ],
        lunch: [
          { foodId: "dal", name: "Mixed dal", portion: "1 katori", calories: 140, protein: 10, carbs: 22, fat: 2 },
          { foodId: "rice", name: "Rice", portion: "3/4 cup", calories: 150, protein: 3, carbs: 34, fat: 0.5 },
          { foodId: "fish", name: "Fish curry", portion: "100g", calories: 150, protein: 22, carbs: 3, fat: 6 },
          { foodId: "sabji", name: "Bhindi sabji", portion: "1 katori", calories: 80, protein: 2, carbs: 10, fat: 4 },
        ],
        afternoonSnack: [
          { foodId: "nuts", name: "Mixed nuts", portion: "10-12 pieces", calories: 100, protein: 3, carbs: 4, fat: 9 },
        ],
        dinner: [
          { foodId: "khichdi", name: "Moong dal khichdi", portion: "1 bowl", calories: 250, protein: 10, carbs: 42, fat: 4 },
          { foodId: "kadhi", name: "Kadhi", portion: "1/2 katori", calories: 80, protein: 3, carbs: 8, fat: 4 },
        ],
      },
      {
        breakfast: [
          { foodId: "upma", name: "Vegetable upma", portion: "1 bowl", calories: 200, protein: 5, carbs: 35, fat: 5 },
          { foodId: "tea", name: "Chiya (less sugar)", portion: "1 cup", calories: 40, protein: 1, carbs: 8, fat: 1 },
        ],
        morningSnack: [
          { foodId: "banana", name: "Banana", portion: "1 medium", calories: 105, protein: 1, carbs: 27, fat: 0 },
        ],
        lunch: [
          { foodId: "dal", name: "Toor dal", portion: "1 katori", calories: 120, protein: 8, carbs: 18, fat: 2 },
          { foodId: "rice", name: "Rice", portion: "1 cup", calories: 200, protein: 4, carbs: 45, fat: 0.5 },
          { foodId: "egg", name: "Egg curry (2 eggs)", portion: "2 eggs", calories: 200, protein: 14, carbs: 4, fat: 14 },
          { foodId: "salad", name: "Green salad", portion: "1 bowl", calories: 35, protein: 1, carbs: 7, fat: 0 },
        ],
        afternoonSnack: [
          { foodId: "makhana", name: "Roasted makhana", portion: "1 cup", calories: 90, protein: 3, carbs: 17, fat: 1 },
        ],
        dinner: [
          { foodId: "chapati", name: "Whole wheat chapati", portion: "2 pieces", calories: 140, protein: 4, carbs: 28, fat: 2 },
          { foodId: "paneer", name: "Palak paneer (less oil)", portion: "100g", calories: 200, protein: 12, carbs: 8, fat: 14 },
        ],
      },
      {
        breakfast: [
          { foodId: "idli", name: "Idli", portion: "3 pieces", calories: 180, protein: 6, carbs: 36, fat: 1 },
          { foodId: "sambar", name: "Sambar", portion: "1 katori", calories: 100, protein: 5, carbs: 15, fat: 3 },
        ],
        morningSnack: [
          { foodId: "papaya", name: "Papaya", portion: "1 cup", calories: 55, protein: 1, carbs: 14, fat: 0 },
        ],
        lunch: [
          { foodId: "rajma", name: "Rajma", portion: "1 katori", calories: 150, protein: 9, carbs: 25, fat: 3 },
          { foodId: "rice", name: "Jeera rice", portion: "3/4 cup", calories: 180, protein: 3, carbs: 38, fat: 2 },
          { foodId: "raita", name: "Boondi raita", portion: "1/2 cup", calories: 70, protein: 3, carbs: 8, fat: 3 },
        ],
        afternoonSnack: [
          { foodId: "sprouts", name: "Sprouted moong", portion: "1/2 cup", calories: 80, protein: 6, carbs: 12, fat: 0.5 },
        ],
        dinner: [
          { foodId: "roti", name: "Multigrain roti", portion: "2 pieces", calories: 160, protein: 5, carbs: 30, fat: 3 },
          { foodId: "sabji", name: "Cabbage sabji", portion: "1 katori", calories: 70, protein: 2, carbs: 10, fat: 3 },
          { foodId: "dal", name: "Dal tadka", portion: "1/2 katori", calories: 70, protein: 4, carbs: 10, fat: 2 },
        ],
        eveningSnack: [
          { foodId: "buttermilk", name: "Chaas (buttermilk)", portion: "1 glass", calories: 40, protein: 2, carbs: 5, fat: 1 },
        ],
      },
      {
        breakfast: [
          { foodId: "poha", name: "Vegetable poha", portion: "1 bowl", calories: 220, protein: 5, carbs: 40, fat: 5 },
          { foodId: "tea", name: "Masala tea (less sugar)", portion: "1 cup", calories: 50, protein: 1, carbs: 10, fat: 1 },
        ],
        morningSnack: [
          { foodId: "orange", name: "Orange", portion: "1 medium", calories: 60, protein: 1, carbs: 15, fat: 0 },
        ],
        lunch: [
          { foodId: "chole", name: "Chole (chickpea curry)", portion: "1 katori", calories: 160, protein: 9, carbs: 25, fat: 5 },
          { foodId: "rice", name: "Rice", portion: "3/4 cup", calories: 150, protein: 3, carbs: 34, fat: 0.5 },
          { foodId: "salad", name: "Onion & cucumber salad", portion: "1 bowl", calories: 40, protein: 1, carbs: 9, fat: 0 },
        ],
        afternoonSnack: [
          { foodId: "chana", name: "Boiled black chana chaat", portion: "1/2 cup", calories: 100, protein: 6, carbs: 15, fat: 2 },
        ],
        dinner: [
          { foodId: "thukpa", name: "Vegetable thukpa", portion: "1 bowl", calories: 280, protein: 10, carbs: 42, fat: 8 },
        ],
        eveningSnack: [
          { foodId: "milk", name: "Turmeric milk", portion: "1 glass", calories: 100, protein: 7, carbs: 12, fat: 3 },
        ],
      },
      {
        breakfast: [
          { foodId: "dosa", name: "Plain dosa", portion: "2 medium", calories: 200, protein: 4, carbs: 40, fat: 3 },
          { foodId: "chutney", name: "Coconut chutney", portion: "2 tbsp", calories: 50, protein: 1, carbs: 3, fat: 4 },
        ],
        morningSnack: [
          { foodId: "guava", name: "Guava", portion: "1 medium", calories: 55, protein: 2, carbs: 12, fat: 0.5 },
        ],
        lunch: [
          { foodId: "dal", name: "Dal fry", portion: "1 katori", calories: 140, protein: 9, carbs: 20, fat: 3 },
          { foodId: "rice", name: "Jeera rice", portion: "1 cup", calories: 200, protein: 4, carbs: 42, fat: 2 },
          { foodId: "chicken", name: "Chicken curry", portion: "100g", calories: 180, protein: 24, carbs: 5, fat: 8 },
          { foodId: "salad", name: "Mixed salad", portion: "1 bowl", calories: 40, protein: 1, carbs: 8, fat: 0 },
        ],
        afternoonSnack: [
          { foodId: "dhokla", name: "Dhokla", portion: "2 pieces", calories: 100, protein: 4, carbs: 18, fat: 2 },
        ],
        dinner: [
          { foodId: "roti", name: "Wheat roti", portion: "2 pieces", calories: 140, protein: 4, carbs: 28, fat: 2 },
          { foodId: "sabji", name: "Mixed vegetable sabji", portion: "1 katori", calories: 100, protein: 3, carbs: 12, fat: 5 },
          { foodId: "dahi", name: "Plain dahi", portion: "1/2 cup", calories: 70, protein: 4, carbs: 6, fat: 4 },
        ],
      },
    ],
  },
  {
    id: "muscle-gain-nepali",
    name: "Nepali Muscle Building Plan",
    description: "High-protein meal plan featuring traditional Nepali and Indian foods. Designed to support muscle growth with adequate calories.",
    goal: "muscle_gain",
    duration: "1_week",
    difficulty: "moderate",
    cuisine: "nepali",
    dailyCalories: 2500,
    dailyProtein: 150,
    tags: ["high-protein", "muscle-building", "active-lifestyle"],
    image: "💪",
    premium: false,
    createdBy: "system",
    days: [
      {
        breakfast: [
          { foodId: "eggs", name: "Boiled eggs", portion: "4 whole", calories: 280, protein: 24, carbs: 2, fat: 20 },
          { foodId: "paratha", name: "Aloo paratha", portion: "2 pieces", calories: 400, protein: 10, carbs: 60, fat: 16 },
          { foodId: "milk", name: "Full cream milk", portion: "1 glass", calories: 150, protein: 8, carbs: 12, fat: 8 },
        ],
        morningSnack: [
          { foodId: "banana", name: "Banana", portion: "2 medium", calories: 210, protein: 2, carbs: 54, fat: 0.5 },
          { foodId: "nuts", name: "Almonds & walnuts", portion: "30g", calories: 180, protein: 6, carbs: 6, fat: 16 },
        ],
        lunch: [
          { foodId: "rice", name: "Rice", portion: "2 cups", calories: 400, protein: 8, carbs: 90, fat: 1 },
          { foodId: "dal", name: "Dal (thick)", portion: "1.5 katori", calories: 200, protein: 14, carbs: 28, fat: 3 },
          { foodId: "chicken", name: "Chicken curry", portion: "200g", calories: 360, protein: 50, carbs: 10, fat: 16 },
          { foodId: "salad", name: "Fresh salad", portion: "1 bowl", calories: 50, protein: 2, carbs: 10, fat: 0 },
        ],
        afternoonSnack: [
          { foodId: "paneer", name: "Paneer tikka", portion: "150g", calories: 300, protein: 27, carbs: 6, fat: 20 },
          { foodId: "roti", name: "Whole wheat roti", portion: "1 piece", calories: 70, protein: 2, carbs: 14, fat: 1 },
        ],
        dinner: [
          { foodId: "rice", name: "Rice", portion: "1.5 cups", calories: 300, protein: 6, carbs: 68, fat: 0.5 },
          { foodId: "dal", name: "Dal makhani", portion: "1 katori", calories: 180, protein: 10, carbs: 22, fat: 6 },
          { foodId: "mutton", name: "Mutton curry", portion: "150g", calories: 350, protein: 35, carbs: 8, fat: 20 },
          { foodId: "raita", name: "Raita", portion: "1/2 cup", calories: 60, protein: 3, carbs: 6, fat: 3 },
        ],
        eveningSnack: [
          { foodId: "milk", name: "Protein shake with milk", portion: "1 glass", calories: 250, protein: 30, carbs: 20, fat: 5 },
        ],
      },
    ],
  },
  {
    id: "diabetic-friendly",
    name: "Diabetic Friendly Plan",
    description: "Low glycemic index meal plan with controlled carbohydrates. Suitable for people managing blood sugar levels.",
    goal: "diabetic_friendly",
    duration: "1_week",
    difficulty: "moderate",
    cuisine: "mixed",
    dailyCalories: 1600,
    dailyProtein: 80,
    tags: ["low-gi", "diabetic-friendly", "heart-healthy"],
    image: "💚",
    premium: false,
    createdBy: "system",
    days: [
      {
        breakfast: [
          { foodId: "besan-cheela", name: "Besan cheela", portion: "2 pieces", calories: 200, protein: 12, carbs: 20, fat: 8 },
          { foodId: "chutney", name: "Mint chutney", portion: "2 tbsp", calories: 20, protein: 0.5, carbs: 3, fat: 1 },
          { foodId: "tea", name: "Green tea", portion: "1 cup", calories: 5, protein: 0, carbs: 1, fat: 0 },
        ],
        morningSnack: [
          { foodId: "cucumber", name: "Cucumber sticks", portion: "1 cup", calories: 16, protein: 0.5, carbs: 3, fat: 0 },
          { foodId: "nuts", name: "Almonds (soaked)", portion: "10 pieces", calories: 70, protein: 2.5, carbs: 2, fat: 6 },
        ],
        lunch: [
          { foodId: "roti", name: "Multigrain roti", portion: "2 pieces", calories: 160, protein: 5, carbs: 30, fat: 3 },
          { foodId: "dal", name: "Moong dal (thick)", portion: "1 katori", calories: 110, protein: 8, carbs: 16, fat: 1.5 },
          { foodId: "sabji", name: "Bitter gourd (karela) sabji", portion: "1 katori", calories: 50, protein: 2, carbs: 8, fat: 2 },
          { foodId: "salad", name: "Mixed vegetable salad", portion: "1 bowl", calories: 40, protein: 2, carbs: 8, fat: 0 },
        ],
        afternoonSnack: [
          { foodId: "sprouts", name: "Sprout salad", portion: "1 cup", calories: 100, protein: 8, carbs: 14, fat: 1 },
        ],
        dinner: [
          { foodId: "jowar-roti", name: "Jowar roti", portion: "2 pieces", calories: 150, protein: 4, carbs: 30, fat: 1.5 },
          { foodId: "fish", name: "Grilled fish", portion: "120g", calories: 160, protein: 28, carbs: 0, fat: 5 },
          { foodId: "sabji", name: "Bottle gourd sabji", portion: "1 katori", calories: 60, protein: 2, carbs: 10, fat: 2 },
        ],
        eveningSnack: [
          { foodId: "buttermilk", name: "Plain buttermilk", portion: "1 glass", calories: 40, protein: 2, carbs: 5, fat: 1 },
        ],
      },
    ],
  },
  {
    id: "high-protein-veg",
    name: "High Protein Vegetarian",
    description: "Plant-based high protein meal plan featuring paneer, dal, soy, and legumes. Perfect for vegetarian fitness enthusiasts.",
    goal: "high_protein",
    duration: "1_week",
    difficulty: "easy",
    cuisine: "indian",
    dailyCalories: 1800,
    dailyProtein: 100,
    tags: ["vegetarian", "high-protein", "plant-based"],
    image: "🥗",
    premium: false,
    createdBy: "system",
    days: [
      {
        breakfast: [
          { foodId: "paneer-paratha", name: "Paneer stuffed paratha", portion: "2 pieces", calories: 400, protein: 18, carbs: 45, fat: 18 },
          { foodId: "curd", name: "Greek yogurt", portion: "1 cup", calories: 150, protein: 18, carbs: 8, fat: 5 },
        ],
        morningSnack: [
          { foodId: "soy-nuts", name: "Roasted soy nuts", portion: "30g", calories: 130, protein: 12, carbs: 8, fat: 6 },
        ],
        lunch: [
          { foodId: "rice", name: "Brown rice", portion: "1 cup", calories: 180, protein: 4, carbs: 38, fat: 1.5 },
          { foodId: "rajma", name: "Rajma (kidney beans)", portion: "1.5 katori", calories: 200, protein: 14, carbs: 30, fat: 4 },
          { foodId: "paneer", name: "Paneer bhurji", portion: "100g", calories: 250, protein: 18, carbs: 6, fat: 18 },
          { foodId: "salad", name: "Sprout salad", portion: "1 bowl", calories: 80, protein: 6, carbs: 12, fat: 0.5 },
        ],
        afternoonSnack: [
          { foodId: "lassi", name: "Protein lassi", portion: "1 glass", calories: 180, protein: 15, carbs: 18, fat: 5 },
        ],
        dinner: [
          { foodId: "roti", name: "Whole wheat roti", portion: "2 pieces", calories: 140, protein: 4, carbs: 28, fat: 2 },
          { foodId: "dal", name: "Chana dal", portion: "1.5 katori", calories: 200, protein: 14, carbs: 28, fat: 4 },
          { foodId: "tofu", name: "Tofu curry", portion: "150g", calories: 180, protein: 18, carbs: 6, fat: 10 },
        ],
        eveningSnack: [
          { foodId: "milk", name: "Soy milk", portion: "1 glass", calories: 100, protein: 8, carbs: 8, fat: 4 },
        ],
      },
    ],
  },
];

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set, get) => ({
      activePlanId: null,
      activePlanStartDate: null,
      savedPlans: [],
      customPlans: [],

      setActivePlan: (planId) => {
        set({ activePlanId: planId });
      },

      startPlan: (planId) => {
        set({
          activePlanId: planId,
          activePlanStartDate: new Date().toISOString().split("T")[0],
        });
      },

      stopPlan: () => {
        set({
          activePlanId: null,
          activePlanStartDate: null,
        });
      },

      savePlan: (planId) => {
        set((state) => ({
          savedPlans: state.savedPlans.includes(planId)
            ? state.savedPlans
            : [...state.savedPlans, planId],
        }));
      },

      unsavePlan: (planId) => {
        set((state) => ({
          savedPlans: state.savedPlans.filter((id) => id !== planId),
        }));
      },

      addCustomPlan: (plan) => {
        set((state) => ({
          customPlans: [...state.customPlans, plan],
        }));
      },

      removeCustomPlan: (planId) => {
        set((state) => ({
          customPlans: state.customPlans.filter((p) => p.id !== planId),
        }));
      },

      getCurrentDayPlan: () => {
        const { activePlanId, activePlanStartDate, customPlans } = get();
        if (!activePlanId || !activePlanStartDate) return null;

        const plan = [...systemMealPlans, ...customPlans].find(
          (p) => p.id === activePlanId
        );
        if (!plan) return null;

        const startDate = new Date(activePlanStartDate);
        const today = new Date();
        const daysDiff = Math.floor(
          (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        const dayNumber = (daysDiff % plan.days.length) + 1;
        const dayPlan = plan.days[daysDiff % plan.days.length];

        return { dayNumber, plan: dayPlan };
      },
    }),
    {
      name: "nepfit-mealplan-storage",
    }
  )
);

// Helper function to get all available plans
export const getAllMealPlans = (): MealPlan[] => {
  return systemMealPlans;
};

// Helper to get a specific plan by ID
export const getMealPlanById = (id: string): MealPlan | undefined => {
  return systemMealPlans.find((p) => p.id === id);
};
