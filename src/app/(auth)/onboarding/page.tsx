"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import { useUserStore } from "@/store/userStore";
import type { ActivityLevel, GoalType, DietType, HealthCondition } from "@/types";

const steps = [
  { id: 1, title: "Basic Info", description: "Tell us about yourself" },
  { id: 2, title: "Physical Stats", description: "Your measurements" },
  { id: 3, title: "Goals", description: "What do you want to achieve?" },
  { id: 4, title: "Diet Preferences", description: "Your food preferences" },
  { id: 5, title: "Health", description: "Any health conditions?" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { updateProfile, calculateAndSetTargets, setOnboarded } = useUserStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Basic Info
    dateOfBirth: "",
    gender: "",
    country: "Nepal",
    city: "",

    // Physical Stats
    height: "",
    currentWeight: "",
    goalWeight: "",

    // Goals
    activityLevel: "moderate" as ActivityLevel,
    primaryGoal: "lose_weight" as GoalType,
    weeklyGoalKg: 0.5,

    // Diet
    dietType: "non_vegetarian" as DietType,
    cuisinePreferences: ["nepali"] as string[],
    foodAllergies: [] as string[],

    // Health
    healthConditions: [] as HealthCondition[],
  });

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);

    // Save profile
    updateProfile({
      dateOfBirth: new Date(formData.dateOfBirth),
      gender: formData.gender as "male" | "female" | "other",
      country: formData.country,
      city: formData.city,
      height: Number(formData.height),
      currentWeight: Number(formData.currentWeight),
      goalWeight: Number(formData.goalWeight),
      activityLevel: formData.activityLevel,
      primaryGoal: formData.primaryGoal,
      weeklyGoalKg: formData.weeklyGoalKg,
      dietType: formData.dietType,
      cuisinePreferences: formData.cuisinePreferences,
      foodAllergies: formData.foodAllergies,
      healthConditions: formData.healthConditions,
    });

    // Calculate nutrition targets
    calculateAndSetTargets();

    // Mark onboarding complete
    setOnboarded(true);

    // Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                step.id <= currentStep ? "text-primary-600" : "text-neutral-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 ${
                  step.id < currentStep
                    ? "bg-primary-500 text-white"
                    : step.id === currentStep
                    ? "bg-primary-500 text-white"
                    : "bg-neutral-200 text-neutral-500"
                }`}
              >
                {step.id < currentStep ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span className="text-xs hidden sm:block">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          />
        </div>
      </div>

      <Card padding="lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-neutral-500">{steps[currentStep - 1].description}</p>
        </div>

        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <Input
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              required
            />

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Gender
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["male", "female", "other"].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender })}
                    className={`p-3 rounded-xl border-2 text-center capitalize transition-all ${
                      formData.gender === gender
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Nepal">Nepal</option>
                  <option value="India">India</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <Input
                label="City"
                placeholder="Kathmandu"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {/* Step 2: Physical Stats */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <Input
              label="Height (cm)"
              type="number"
              placeholder="165"
              value={formData.height}
              onChange={(e) =>
                setFormData({ ...formData, height: e.target.value })
              }
              required
            />

            <Input
              label="Current Weight (kg)"
              type="number"
              placeholder="70"
              value={formData.currentWeight}
              onChange={(e) =>
                setFormData({ ...formData, currentWeight: e.target.value })
              }
              required
            />

            <Input
              label="Goal Weight (kg)"
              type="number"
              placeholder="65"
              value={formData.goalWeight}
              onChange={(e) =>
                setFormData({ ...formData, goalWeight: e.target.value })
              }
              required
            />

            {formData.currentWeight && formData.goalWeight && (
              <div className="bg-primary-50 rounded-xl p-4">
                <p className="text-sm text-primary-700">
                  {Number(formData.currentWeight) > Number(formData.goalWeight)
                    ? `You want to lose ${(
                        Number(formData.currentWeight) - Number(formData.goalWeight)
                      ).toFixed(1)} kg`
                    : Number(formData.currentWeight) < Number(formData.goalWeight)
                    ? `You want to gain ${(
                        Number(formData.goalWeight) - Number(formData.currentWeight)
                      ).toFixed(1)} kg`
                    : "You want to maintain your current weight"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Goals */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Primary Goal
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "lose_weight", label: "Lose Weight", icon: "📉" },
                  { value: "maintain", label: "Maintain", icon: "⚖️" },
                  { value: "gain_weight", label: "Gain Weight", icon: "📈" },
                  { value: "muscle_gain", label: "Build Muscle", icon: "💪" },
                ].map((goal) => (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        primaryGoal: goal.value as GoalType,
                      })
                    }
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.primaryGoal === goal.value
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{goal.icon}</span>
                    <span className="font-medium">{goal.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Activity Level
              </label>
              <div className="space-y-2">
                {[
                  { value: "sedentary", label: "Sedentary", desc: "Little or no exercise" },
                  { value: "light", label: "Lightly Active", desc: "Light exercise 1-3 days/week" },
                  { value: "moderate", label: "Moderately Active", desc: "Moderate exercise 3-5 days/week" },
                  { value: "active", label: "Very Active", desc: "Hard exercise 6-7 days/week" },
                  { value: "very_active", label: "Extra Active", desc: "Very hard exercise & physical job" },
                ].map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        activityLevel: level.value as ActivityLevel,
                      })
                    }
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                      formData.activityLevel === level.value
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <span className="font-medium block">{level.label}</span>
                    <span className="text-sm text-neutral-500">{level.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {formData.primaryGoal !== "maintain" && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Weekly Goal: {formData.weeklyGoalKg} kg/week
                </label>
                <input
                  type="range"
                  min="0.25"
                  max="1"
                  step="0.25"
                  value={formData.weeklyGoalKg}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weeklyGoalKg: Number(e.target.value),
                    })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                  <span>Slow (0.25kg)</span>
                  <span>Moderate (0.5kg)</span>
                  <span>Fast (1kg)</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Diet Preferences */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Diet Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "non_vegetarian", label: "Non-Vegetarian", icon: "🍗" },
                  { value: "vegetarian", label: "Vegetarian", icon: "🥗" },
                  { value: "eggetarian", label: "Eggetarian", icon: "🥚" },
                  { value: "vegan", label: "Vegan", icon: "🌱" },
                ].map((diet) => (
                  <button
                    key={diet.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        dietType: diet.value as DietType,
                      })
                    }
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      formData.dietType === diet.value
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <span className="text-2xl mb-1 block">{diet.icon}</span>
                    <span className="font-medium text-sm">{diet.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Cuisine Preferences
              </label>
              <div className="flex flex-wrap gap-2">
                {["nepali", "north_indian", "south_indian", "chinese", "western"].map(
                  (cuisine) => (
                    <button
                      key={cuisine}
                      type="button"
                      onClick={() => {
                        const prefs = formData.cuisinePreferences.includes(cuisine)
                          ? formData.cuisinePreferences.filter((c) => c !== cuisine)
                          : [...formData.cuisinePreferences, cuisine];
                        setFormData({ ...formData, cuisinePreferences: prefs });
                      }}
                      className={`px-4 py-2 rounded-full border-2 capitalize transition-all ${
                        formData.cuisinePreferences.includes(cuisine)
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      {cuisine.replace("_", " ")}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Food Allergies (if any)
              </label>
              <div className="flex flex-wrap gap-2">
                {["nuts", "dairy", "gluten", "seafood", "eggs", "soy"].map(
                  (allergy) => (
                    <button
                      key={allergy}
                      type="button"
                      onClick={() => {
                        const allergies = formData.foodAllergies.includes(allergy)
                          ? formData.foodAllergies.filter((a) => a !== allergy)
                          : [...formData.foodAllergies, allergy];
                        setFormData({ ...formData, foodAllergies: allergies });
                      }}
                      className={`px-4 py-2 rounded-full border-2 capitalize transition-all ${
                        formData.foodAllergies.includes(allergy)
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      {allergy}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Health Conditions */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Do you have any of these health conditions?
              </label>
              <p className="text-sm text-neutral-500 mb-4">
                This helps us personalize your meal recommendations
              </p>
              <div className="space-y-2">
                {[
                  { value: "diabetes_type2", label: "Type 2 Diabetes", icon: "🩸" },
                  { value: "diabetes_type1", label: "Type 1 Diabetes", icon: "🩸" },
                  { value: "pcos", label: "PCOS", icon: "♀️" },
                  { value: "hypothyroid", label: "Hypothyroid", icon: "🦋" },
                  { value: "hyperthyroid", label: "Hyperthyroid", icon: "🦋" },
                  { value: "hypertension", label: "High Blood Pressure", icon: "❤️" },
                ].map((condition) => (
                  <button
                    key={condition.value}
                    type="button"
                    onClick={() => {
                      const conditions = formData.healthConditions.includes(
                        condition.value as HealthCondition
                      )
                        ? formData.healthConditions.filter(
                            (c) => c !== condition.value
                          )
                        : [
                            ...formData.healthConditions,
                            condition.value as HealthCondition,
                          ];
                      setFormData({ ...formData, healthConditions: conditions });
                    }}
                    className={`w-full p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${
                      formData.healthConditions.includes(
                        condition.value as HealthCondition
                      )
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <span className="text-xl">{condition.icon}</span>
                    <span className="font-medium">{condition.label}</span>
                    {formData.healthConditions.includes(
                      condition.value as HealthCondition
                    ) && (
                      <svg
                        className="w-5 h-5 text-primary-500 ml-auto"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This information helps us provide better
                recommendations. Always consult your doctor for medical advice.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          {currentStep < 5 ? (
            <Button onClick={handleNext} className="flex-1">
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              isLoading={isLoading}
              className="flex-1"
            >
              Complete Setup
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
