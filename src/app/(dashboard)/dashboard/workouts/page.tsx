"use client";

import { useState } from "react";

type WorkoutCategory = "cardio" | "strength" | "yoga" | "hiit" | "stretching" | "sports";
type DifficultyLevel = "beginner" | "intermediate" | "advanced";
type MuscleGroup = "full_body" | "upper_body" | "lower_body" | "core" | "arms" | "legs" | "back" | "chest";

interface Exercise {
  id: string;
  name: string;
  category: WorkoutCategory;
  muscleGroups: MuscleGroup[];
  difficulty: DifficultyLevel;
  duration: number;
  caloriesBurn: number;
  instructions: string[];
  image: string;
  videoUrl?: string;
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  category: WorkoutCategory;
  difficulty: DifficultyLevel;
  duration: number;
  exercises: { exercise: Exercise; sets: number; reps: number; rest: number }[];
  caloriesBurn: number;
  image: string;
  daysPerWeek: number;
  targetGoal: string;
}

interface WorkoutLog {
  id: string;
  date: Date;
  workout: WorkoutPlan | null;
  exercises: { exercise: Exercise; completed: boolean; actualSets?: number; actualReps?: number }[];
  duration: number;
  caloriesBurned: number;
  notes?: string;
}

const mockExercises: Exercise[] = [
  {
    id: "e1",
    name: "Jumping Jacks",
    category: "cardio",
    muscleGroups: ["full_body"],
    difficulty: "beginner",
    duration: 1,
    caloriesBurn: 10,
    instructions: ["Stand with feet together", "Jump while spreading arms and legs", "Return to starting position", "Repeat"],
    image: "🏃",
  },
  {
    id: "e2",
    name: "Push-ups",
    category: "strength",
    muscleGroups: ["chest", "arms", "core"],
    difficulty: "intermediate",
    duration: 1,
    caloriesBurn: 8,
    instructions: ["Start in plank position", "Lower body until chest nearly touches floor", "Push back up", "Keep core tight"],
    image: "💪",
  },
  {
    id: "e3",
    name: "Squats",
    category: "strength",
    muscleGroups: ["legs", "lower_body"],
    difficulty: "beginner",
    duration: 1,
    caloriesBurn: 8,
    instructions: ["Stand with feet shoulder-width apart", "Lower body as if sitting", "Keep knees over toes", "Return to standing"],
    image: "🦵",
  },
  {
    id: "e4",
    name: "Plank",
    category: "strength",
    muscleGroups: ["core", "full_body"],
    difficulty: "beginner",
    duration: 1,
    caloriesBurn: 5,
    instructions: ["Start in forearm position", "Keep body in straight line", "Engage core muscles", "Hold position"],
    image: "🧘",
  },
  {
    id: "e5",
    name: "Burpees",
    category: "hiit",
    muscleGroups: ["full_body"],
    difficulty: "advanced",
    duration: 1,
    caloriesBurn: 15,
    instructions: ["Start standing", "Drop to squat, hands on floor", "Jump feet back to plank", "Do push-up", "Jump feet forward", "Jump up with arms overhead"],
    image: "🔥",
  },
  {
    id: "e6",
    name: "Mountain Climbers",
    category: "hiit",
    muscleGroups: ["core", "legs", "arms"],
    difficulty: "intermediate",
    duration: 1,
    caloriesBurn: 12,
    instructions: ["Start in plank position", "Drive one knee toward chest", "Quickly switch legs", "Continue alternating"],
    image: "⛰️",
  },
  {
    id: "e7",
    name: "Sun Salutation",
    category: "yoga",
    muscleGroups: ["full_body"],
    difficulty: "beginner",
    duration: 5,
    caloriesBurn: 15,
    instructions: ["Start in mountain pose", "Reach arms up", "Fold forward", "Step back to plank", "Lower to floor", "Cobra pose", "Downward dog", "Return to standing"],
    image: "🌅",
  },
  {
    id: "e8",
    name: "Lunges",
    category: "strength",
    muscleGroups: ["legs", "lower_body"],
    difficulty: "beginner",
    duration: 1,
    caloriesBurn: 7,
    instructions: ["Stand tall", "Step forward with one leg", "Lower until both knees at 90°", "Push back to start", "Alternate legs"],
    image: "🚶",
  },
];

const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: "w1",
    name: "Morning Energy Boost",
    description: "Quick 15-minute workout to start your day with energy",
    category: "cardio",
    difficulty: "beginner",
    duration: 15,
    exercises: [
      { exercise: mockExercises[0], sets: 3, reps: 20, rest: 30 },
      { exercise: mockExercises[2], sets: 3, reps: 15, rest: 30 },
      { exercise: mockExercises[3], sets: 3, reps: 30, rest: 30 },
    ],
    caloriesBurn: 120,
    image: "🌅",
    daysPerWeek: 5,
    targetGoal: "Energy & Metabolism",
  },
  {
    id: "w2",
    name: "Fat Burning HIIT",
    description: "High-intensity interval training for maximum calorie burn",
    category: "hiit",
    difficulty: "intermediate",
    duration: 25,
    exercises: [
      { exercise: mockExercises[4], sets: 4, reps: 10, rest: 45 },
      { exercise: mockExercises[5], sets: 4, reps: 20, rest: 45 },
      { exercise: mockExercises[0], sets: 4, reps: 30, rest: 30 },
    ],
    caloriesBurn: 280,
    image: "🔥",
    daysPerWeek: 3,
    targetGoal: "Weight Loss",
  },
  {
    id: "w3",
    name: "Strength Builder",
    description: "Build muscle and increase strength with bodyweight exercises",
    category: "strength",
    difficulty: "intermediate",
    duration: 30,
    exercises: [
      { exercise: mockExercises[1], sets: 4, reps: 12, rest: 60 },
      { exercise: mockExercises[2], sets: 4, reps: 15, rest: 60 },
      { exercise: mockExercises[7], sets: 3, reps: 12, rest: 45 },
      { exercise: mockExercises[3], sets: 3, reps: 45, rest: 45 },
    ],
    caloriesBurn: 200,
    image: "💪",
    daysPerWeek: 4,
    targetGoal: "Muscle Building",
  },
  {
    id: "w4",
    name: "Yoga Flow",
    description: "Gentle yoga sequence for flexibility and relaxation",
    category: "yoga",
    difficulty: "beginner",
    duration: 20,
    exercises: [
      { exercise: mockExercises[6], sets: 5, reps: 1, rest: 0 },
    ],
    caloriesBurn: 80,
    image: "🧘",
    daysPerWeek: 7,
    targetGoal: "Flexibility & Relaxation",
  },
  {
    id: "w5",
    name: "Core Crusher",
    description: "Intense core workout for strong abs",
    category: "strength",
    difficulty: "advanced",
    duration: 20,
    exercises: [
      { exercise: mockExercises[3], sets: 4, reps: 60, rest: 30 },
      { exercise: mockExercises[5], sets: 4, reps: 25, rest: 30 },
    ],
    caloriesBurn: 150,
    image: "🎯",
    daysPerWeek: 3,
    targetGoal: "Core Strength",
  },
];

export default function WorkoutsPage() {
  const [activeTab, setActiveTab] = useState<"workouts" | "exercises" | "log" | "stats">("workouts");
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | "all">("all");
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);

  const filteredWorkouts = mockWorkoutPlans.filter((workout) => {
    if (selectedCategory !== "all" && workout.category !== selectedCategory) return false;
    if (selectedDifficulty !== "all" && workout.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const filteredExercises = mockExercises.filter((exercise) => {
    if (selectedCategory !== "all" && exercise.category !== selectedCategory) return false;
    if (selectedDifficulty !== "all" && exercise.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const weeklyStats = {
    workouts: 4,
    totalMinutes: 95,
    caloriesBurned: 680,
    streak: 5,
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "advanced":
        return "bg-red-100 text-red-700";
    }
  };

  const getCategoryIcon = (category: WorkoutCategory) => {
    switch (category) {
      case "cardio":
        return "🏃";
      case "strength":
        return "💪";
      case "yoga":
        return "🧘";
      case "hiit":
        return "🔥";
      case "stretching":
        return "🤸";
      case "sports":
        return "⚽";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Workouts & Fitness</h1>
          <p className="text-neutral-600">
            Exercise plans, calorie tracking, and fitness goals
          </p>
        </div>
        <button
          onClick={() => setSelectedWorkout(mockWorkoutPlans[0])}
          className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
        >
          🏋️ Quick Start Workout
        </button>
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏋️</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{weeklyStats.workouts}</p>
              <p className="text-sm text-neutral-500">Workouts</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{weeklyStats.totalMinutes}</p>
              <p className="text-sm text-neutral-500">Minutes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{weeklyStats.caloriesBurned}</p>
              <p className="text-sm text-neutral-500">Calories</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{weeklyStats.streak}</p>
              <p className="text-sm text-neutral-500">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 overflow-x-auto">
        {[
          { id: "workouts", label: "Workout Plans", icon: "📋" },
          { id: "exercises", label: "Exercises", icon: "🏃" },
          { id: "log", label: "Activity Log", icon: "📊" },
          { id: "stats", label: "Statistics", icon: "📈" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "text-primary-600 border-b-2 border-primary-500"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      {(activeTab === "workouts" || activeTab === "exercises") && (
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as WorkoutCategory | "all")}
            className="px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            <option value="cardio">Cardio</option>
            <option value="strength">Strength</option>
            <option value="yoga">Yoga</option>
            <option value="hiit">HIIT</option>
            <option value="stretching">Stretching</option>
          </select>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel | "all")}
            className="px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      )}

      {/* Workout Plans */}
      {activeTab === "workouts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkouts.map((workout) => (
            <div
              key={workout.id}
              onClick={() => setSelectedWorkout(workout)}
              className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden cursor-pointer hover:shadow-md transition-all"
            >
              <div className="h-32 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <span className="text-5xl">{workout.image}</span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(workout.difficulty)}`}>
                    {workout.difficulty}
                  </span>
                  <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                    {getCategoryIcon(workout.category)} {workout.category}
                  </span>
                </div>
                <h3 className="font-semibold text-neutral-900">{workout.name}</h3>
                <p className="text-sm text-neutral-500 mt-1">{workout.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-neutral-600">
                  <span>⏱️ {workout.duration} min</span>
                  <span>🔥 {workout.caloriesBurn} kcal</span>
                  <span>📅 {workout.daysPerWeek}x/week</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Exercises */}
      {activeTab === "exercises" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center text-3xl">
                  {exercise.image}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900">{exercise.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                    <span className="text-xs text-neutral-500">
                      🔥 {exercise.caloriesBurn} kcal/min
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {exercise.muscleGroups.slice(0, 2).map((muscle) => (
                      <span key={muscle} className="text-xs bg-neutral-100 px-2 py-0.5 rounded-full">
                        {muscle.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Log */}
      {activeTab === "log" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">This Week&apos;s Activity</h3>
            <div className="space-y-3">
              {[
                { day: "Today", workout: "Morning Energy Boost", duration: 15, calories: 120 },
                { day: "Yesterday", workout: "Yoga Flow", duration: 20, calories: 80 },
                { day: "Monday", workout: "Fat Burning HIIT", duration: 25, calories: 280 },
                { day: "Sunday", workout: "Strength Builder", duration: 30, calories: 200 },
              ].map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600">✓</span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{log.workout}</p>
                      <p className="text-sm text-neutral-500">{log.day}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-neutral-900">{log.duration} min</p>
                    <p className="text-sm text-orange-600">{log.calories} kcal</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      {activeTab === "stats" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">Monthly Progress</h3>
            <div className="space-y-4">
              {[
                { label: "Total Workouts", value: 16, target: 20, color: "bg-blue-500" },
                { label: "Minutes Exercised", value: 380, target: 500, color: "bg-green-500" },
                { label: "Calories Burned", value: 2720, target: 4000, color: "bg-orange-500" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-600">{stat.label}</span>
                    <span className="font-medium">{stat.value} / {stat.target}</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stat.color} rounded-full`}
                      style={{ width: `${Math.min((stat.value / stat.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">Favorite Workouts</h3>
            <div className="space-y-3">
              {mockWorkoutPlans.slice(0, 3).map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{workout.image}</span>
                    <span className="font-medium">{workout.name}</span>
                  </div>
                  <span className="text-sm text-neutral-500">8x completed</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Workout Detail Modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="h-40 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative">
              <span className="text-7xl">{selectedWorkout.image}</span>
              <button
                onClick={() => setSelectedWorkout(null)}
                className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-sm px-3 py-1 rounded-full ${getDifficultyColor(selectedWorkout.difficulty)}`}>
                  {selectedWorkout.difficulty}
                </span>
                <span className="text-sm bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full">
                  {selectedWorkout.category}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-neutral-900">{selectedWorkout.name}</h2>
              <p className="text-neutral-500 mt-2">{selectedWorkout.description}</p>

              <div className="flex items-center gap-6 mt-4 text-sm">
                <span>⏱️ {selectedWorkout.duration} min</span>
                <span>🔥 {selectedWorkout.caloriesBurn} kcal</span>
                <span>📅 {selectedWorkout.daysPerWeek}x/week</span>
                <span>🎯 {selectedWorkout.targetGoal}</span>
              </div>

              <h3 className="font-semibold text-neutral-900 mt-6 mb-4">Exercises</h3>
              <div className="space-y-3">
                {selectedWorkout.exercises.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                    <span className="text-2xl">{item.exercise.image}</span>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900">{item.exercise.name}</p>
                      <p className="text-sm text-neutral-500">
                        {item.sets} sets × {item.reps} {item.reps > 1 ? "reps" : "sec"} • {item.rest}s rest
                      </p>
                    </div>
                    <span className="text-sm text-orange-600">{item.exercise.caloriesBurn * item.sets * item.reps} kcal</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setIsWorkoutActive(true);
                  setCurrentExerciseIndex(0);
                }}
                className="w-full mt-6 py-4 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
              >
                🏋️ Start Workout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="h-32 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative">
              <span className="text-6xl">{selectedExercise.image}</span>
              <button
                onClick={() => setSelectedExercise(null)}
                className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-bold text-neutral-900">{selectedExercise.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-sm px-2 py-0.5 rounded-full ${getDifficultyColor(selectedExercise.difficulty)}`}>
                  {selectedExercise.difficulty}
                </span>
                <span className="text-sm text-orange-600">🔥 {selectedExercise.caloriesBurn} kcal/min</span>
              </div>

              <h3 className="font-semibold text-neutral-900 mt-4 mb-2">Instructions</h3>
              <ol className="space-y-2">
                {selectedExercise.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-neutral-600">
                    <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    {instruction}
                  </li>
                ))}
              </ol>

              <h3 className="font-semibold text-neutral-900 mt-4 mb-2">Target Muscles</h3>
              <div className="flex flex-wrap gap-2">
                {selectedExercise.muscleGroups.map((muscle) => (
                  <span key={muscle} className="text-sm bg-neutral-100 px-3 py-1 rounded-full">
                    {muscle.replace("_", " ")}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setSelectedExercise(null)}
                className="w-full mt-6 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
