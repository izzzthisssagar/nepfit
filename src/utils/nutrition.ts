import type { ActivityLevel, GoalType, NutritionTargets } from "@/types";

// Activity level multipliers
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Calculate BMR using Mifflin-St Jeor Equation
export function calculateBMR(
  weight: number, // kg
  height: number, // cm
  age: number,
  gender: "male" | "female" | "other"
): number {
  // Base calculation
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;

  // Gender adjustment
  if (gender === "male") {
    return baseBMR + 5;
  } else {
    return baseBMR - 161;
  }
}

// Calculate TDEE (Total Daily Energy Expenditure)
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

// Calculate daily calorie target based on goal
export function calculateCalorieTarget(
  tdee: number,
  goal: GoalType,
  weeklyGoalKg: number
): number {
  // 1 kg of body weight ≈ 7700 calories
  const dailyDeficit = (weeklyGoalKg * 7700) / 7;

  switch (goal) {
    case "lose_weight":
      // Ensure minimum 1200 calories for safety
      return Math.max(1200, Math.round(tdee - dailyDeficit));
    case "gain_weight":
    case "muscle_gain":
      return Math.round(tdee + Math.min(dailyDeficit, 500));
    case "maintain":
    default:
      return Math.round(tdee);
  }
}

// Calculate macros based on calorie target and goal
export function calculateMacros(
  calories: number,
  goal: GoalType,
  healthConditions: string[] = []
): { protein: number; carbs: number; fat: number; fiber: number } {
  let proteinPercent: number;
  let carbsPercent: number;
  let fatPercent: number;

  // Check for health conditions that affect macro distribution
  const hasDiabetes = healthConditions.some((c) =>
    c.includes("diabetes")
  );
  const hasPCOS = healthConditions.includes("pcos");

  if (hasDiabetes) {
    // Low carb, higher fat for blood sugar control
    proteinPercent = 0.3;
    carbsPercent = 0.35;
    fatPercent = 0.35;
  } else if (hasPCOS) {
    // Similar to diabetes - moderate carb
    proteinPercent = 0.3;
    carbsPercent = 0.35;
    fatPercent = 0.35;
  } else {
    // Default based on goal
    switch (goal) {
      case "muscle_gain":
        proteinPercent = 0.4;
        carbsPercent = 0.35;
        fatPercent = 0.25;
        break;
      case "lose_weight":
        proteinPercent = 0.35;
        carbsPercent = 0.4;
        fatPercent = 0.25;
        break;
      default:
        // Balanced
        proteinPercent = 0.3;
        carbsPercent = 0.4;
        fatPercent = 0.3;
    }
  }

  // Calculate grams (protein: 4 cal/g, carbs: 4 cal/g, fat: 9 cal/g)
  const protein = Math.round((calories * proteinPercent) / 4);
  const carbs = Math.round((calories * carbsPercent) / 4);
  const fat = Math.round((calories * fatPercent) / 9);
  const fiber = Math.round(calories / 1000 * 14); // ~14g fiber per 1000 cal

  return { protein, carbs, fat, fiber };
}

// Calculate water target based on weight and activity
export function calculateWaterTarget(
  weight: number,
  activityLevel: ActivityLevel
): number {
  // Base: 30-35ml per kg of body weight
  const baseWater = weight * 32;

  // Add extra for activity
  const activityBonus: Record<ActivityLevel, number> = {
    sedentary: 0,
    light: 250,
    moderate: 500,
    active: 750,
    very_active: 1000,
  };

  return Math.round(baseWater + activityBonus[activityLevel]);
}

// Get age from date of birth
export function getAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
  ) {
    age--;
  }

  return age;
}

// Calculate all nutrition targets
export function calculateNutritionTargets(
  weight: number,
  height: number,
  dateOfBirth: Date,
  gender: "male" | "female" | "other",
  activityLevel: ActivityLevel,
  goal: GoalType,
  weeklyGoalKg: number,
  healthConditions: string[] = []
): NutritionTargets {
  const age = getAge(dateOfBirth);
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const dailyCalories = calculateCalorieTarget(tdee, goal, weeklyGoalKg);
  const macros = calculateMacros(dailyCalories, goal, healthConditions);
  const water = calculateWaterTarget(weight, activityLevel);

  return {
    bmr: Math.round(bmr),
    tdee,
    dailyCalories,
    macros,
    water,
    lastCalculated: new Date(),
  };
}

// Format nutrition values for display
export function formatNutrition(value: number, unit: string = ""): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k${unit}`;
  }
  return `${Math.round(value)}${unit}`;
}

// Calculate percentage of target achieved
export function calculatePercentage(consumed: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(100, Math.round((consumed / target) * 100));
}

// Get remaining nutrition
export function getRemainingNutrition(
  consumed: number,
  target: number
): number {
  return Math.max(0, target - consumed);
}

// Check if user is within calorie goal (±10%)
export function isWithinCalorieGoal(consumed: number, target: number): boolean {
  const lowerBound = target * 0.9;
  const upperBound = target * 1.1;
  return consumed >= lowerBound && consumed <= upperBound;
}

// Get macro color based on percentage
export function getMacroColor(percentage: number): string {
  if (percentage < 50) return "text-red-500";
  if (percentage < 80) return "text-yellow-500";
  if (percentage <= 100) return "text-green-500";
  return "text-orange-500"; // Over target
}

// Get progress bar color
export function getProgressBarColor(percentage: number): string {
  if (percentage < 50) return "bg-red-500";
  if (percentage < 80) return "bg-yellow-500";
  if (percentage <= 100) return "bg-green-500";
  return "bg-orange-500";
}
