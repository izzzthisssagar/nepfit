// User Types
export interface User {
  id: string;
  email?: string;
  phone?: string;
  profile: UserProfile;
  targets: NutritionTargets;
  settings: UserSettings;
  subscription: Subscription;
  gamification: Gamification;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  displayName: string;
  gender: "male" | "female" | "other" | "prefer_not_to_say";
  dateOfBirth: Date;
  profilePicture?: string;

  // Location
  country: string;
  state?: string;
  city?: string;
  timezone: string;

  // Language
  language: "en" | "ne" | "hi";
  preferredUnits: "metric" | "imperial";

  // Physical Stats
  height: number; // cm
  currentWeight: number; // kg
  goalWeight: number;
  bodyFatPercent?: number;

  // Goals
  activityLevel: ActivityLevel;
  primaryGoal: GoalType;
  weeklyGoalKg: number;

  // Dietary
  dietType: DietType;
  cuisinePreferences: string[];
  foodAllergies: string[];
  foodRestrictions: string[];
  dislikedFoods: string[];
  spiceTolerance: "mild" | "medium" | "spicy" | "very_spicy";

  // Health
  healthConditions: HealthCondition[];
  medications?: string[];
  pregnancyStatus?: "pregnant" | "breastfeeding" | "postpartum" | null;

  // Lifestyle
  typicalWakeTime?: string;
  typicalSleepTime?: string;
  mealTimes?: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  cookingTimeAvailable: "quick" | "medium" | "elaborate";
  budgetPreference: "economy" | "moderate" | "premium";
  fastingType?: string;
}

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type GoalType =
  | "lose_weight"
  | "maintain"
  | "gain_weight"
  | "muscle_gain";

export type DietType =
  | "vegetarian"
  | "non_vegetarian"
  | "vegan"
  | "eggetarian"
  | "jain";

export type HealthCondition =
  | "diabetes_type1"
  | "diabetes_type2"
  | "pcos"
  | "hypothyroid"
  | "hyperthyroid"
  | "hypertension"
  | "heart_disease"
  | "kidney_disease";

export interface NutritionTargets {
  bmr: number;
  tdee: number;
  dailyCalories: number;
  macros: {
    protein: number; // grams
    carbs: number;
    fat: number;
    fiber: number;
  };
  water: number; // ml
  lastCalculated: Date;
}

export interface UserSettings {
  notifications: {
    push: boolean;
    email: boolean;
    whatsapp: boolean;
    mealReminders: boolean;
    waterReminders: boolean;
    waterInterval: number; // minutes
    weightReminder: boolean;
    weightReminderDay: string;
  };
  privacy: {
    profileVisibility: "public" | "friends" | "private";
    showProgress: boolean;
    showWeight: boolean;
    allowBuddyRequests: boolean;
  };
  theme: "light" | "dark" | "system";
  offlineMode: boolean;
}

export interface Subscription {
  plan: "free" | "premium" | "pro";
  status: "active" | "inactive" | "cancelled" | "expired";
  startDate?: Date;
  endDate?: Date;
  autoRenew: boolean;
}

export interface Gamification {
  points: number;
  level: number;
  badges: string[];
  streaks: {
    logging: Streak;
    calorieGoal: Streak;
    water: Streak;
    weighIn: Streak;
  };
  streakShields: number;
  activeChallenges: string[];
}

export interface Streak {
  current: number;
  longest: number;
  lastDate: Date;
}

// Food Types
export interface Food {
  id: string;
  name: string;
  nameNepali?: string;
  nameHindi?: string;
  slug: string;

  // Classification
  category: FoodCategory;
  subcategory?: string;
  cuisine: string[];
  region?: string[];
  mealType: MealType[];

  // Serving
  defaultServing: Serving;
  alternativePortions?: Serving[];

  // Nutrition per 100g
  nutritionPer100g: Nutrition;

  // Diabetes
  glycemicIndex?: number;
  glycemicLoad?: number;
  diabeticSuitability?: "safe" | "moderate" | "avoid";

  // Tags
  tags: string[];
  healthBenefits?: string[];
  healthWarnings?: string[];
  allergens: string[];

  // Festival/Fasting
  festivalAssociation?: string[];
  fastingSuitable: boolean;
  fastingTypes?: string[];

  // Media
  images: FoodImage[];

  // Verification
  verified: boolean;
  source: "IFCT" | "USDA" | "lab_tested" | "user_submitted" | "internal";

  // Usage
  timesLogged: number;
  popularityScore: number;
}

export type FoodCategory =
  | "main_course"
  | "breakfast"
  | "snack"
  | "dessert"
  | "beverage"
  | "side_dish"
  | "condiment"
  | "ingredient";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface Serving {
  name: string;
  grams: number;
  description?: string;
  visualGuide?: string;
  multiplier?: number;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;

  // Detailed
  saturatedFat?: number;
  transFat?: number;
  cholesterol?: number;

  // Vitamins
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  vitaminB12?: number;

  // Minerals
  calcium?: number;
  iron?: number;
  potassium?: number;
  magnesium?: number;
}

export interface FoodImage {
  url: string;
  type: "main" | "portion_guide" | "ingredients";
  credit?: string;
}

// Food Log Types
export interface FoodLog {
  id: string;
  userId: string;
  date: Date;
  mealType: MealType;
  foods: LoggedFood[];
  totalNutrition: Nutrition;
  notes?: string;
  mood?: "tired" | "normal" | "energetic";
  createdAt: Date;
  updatedAt: Date;
}

export interface LoggedFood {
  foodId: string;
  food: Food;
  servingSize: Serving;
  quantity: number;
  nutrition: Nutrition;
}

// Daily Summary
export interface DailySummary {
  date: Date;
  userId: string;
  consumed: Nutrition;
  targets: NutritionTargets;
  remaining: Nutrition;
  percentages: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: {
    breakfast: FoodLog[];
    lunch: FoodLog[];
    dinner: FoodLog[];
    snack: FoodLog[];
  };
  water: {
    consumed: number;
    target: number;
  };
  streak: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface LoginFormData {
  identifier: string; // email or phone
  password: string;
}

export interface SignupFormData {
  email?: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface OnboardingFormData {
  step: number;
  basicInfo: {
    dateOfBirth: Date;
    gender: string;
    country: string;
    city?: string;
  };
  physicalStats: {
    height: number;
    currentWeight: number;
    goalWeight: number;
    activityLevel: ActivityLevel;
    primaryGoal: GoalType;
    weeklyGoalKg: number;
  };
  dietary: {
    dietType: DietType;
    cuisinePreferences: string[];
    foodAllergies: string[];
    dislikedFoods: string[];
  };
  health: {
    healthConditions: HealthCondition[];
    medications?: string[];
  };
  lifestyle: {
    mealTimes: {
      breakfast: string;
      lunch: string;
      dinner: string;
    };
    cookingTimeAvailable: string;
    budgetPreference: string;
  };
}
