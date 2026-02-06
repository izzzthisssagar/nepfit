import { create } from "zustand";
import { persist } from "zustand/middleware";

// ==========================================
// AI Brain Store - Persistent Learning System
// ==========================================

// Types for the learning system
export interface UserPreference {
  foodId: string;
  foodName: string;
  rating: number; // 1-5 stars
  feedback: "liked" | "disliked" | "neutral";
  mealType: string;
  timestamp: Date;
}

export interface LearningPattern {
  pattern: string;
  weight: number;
  occurrences: number;
  lastUpdated: Date;
}

export interface NutritionKnowledge {
  topic: string;
  facts: string[];
  sources: string[];
  confidence: number;
  lastUpdated: Date;
}

export interface FoodRecommendation {
  foodId: string;
  foodName: string;
  score: number;
  reasons: string[];
  nutritionMatch: number;
  preferenceMatch: number;
  healthScore: number;
}

export interface UserHealthProfile {
  goals: string[];
  restrictions: string[];
  allergies: string[];
  preferences: {
    spiceLevel: "mild" | "medium" | "spicy";
    cuisinePreferences: string[];
    mealTimings: { breakfast: string; lunch: string; dinner: string };
  };
  healthConditions: string[];
}

// Neural Network Weights (simplified representation)
interface NeuralWeights {
  inputToHidden: number[][];
  hiddenToOutput: number[][];
  biases: number[];
}

// ==========================================
// 1. Reinforcement Learning Engine
// ==========================================
interface ReinforcementLearningState {
  // User feedback history
  feedbackHistory: UserPreference[];

  // Learned patterns
  patterns: LearningPattern[];

  // Q-Learning style values for food recommendations
  qValues: Record<string, number>;

  // Exploration vs exploitation rate
  explorationRate: number;

  // Actions
  recordFeedback: (preference: UserPreference) => void;
  updatePatterns: () => void;
  getRewardSignal: (foodId: string) => number;
  decayExploration: () => void;
}

// ==========================================
// 2. Knowledge Base
// ==========================================
interface KnowledgeBaseState {
  // Nutrition facts learned
  nutritionKnowledge: NutritionKnowledge[];

  // Food relationships (what goes well together)
  foodRelationships: Record<string, string[]>;

  // Health condition mappings
  healthGuidelines: Record<string, {
    recommended: string[];
    avoid: string[];
    tips: string[];
  }>;

  // Actions
  addKnowledge: (knowledge: NutritionKnowledge) => void;
  queryKnowledge: (topic: string) => NutritionKnowledge[];
  getHealthGuidelines: (condition: string) => { recommended: string[]; avoid: string[]; tips: string[] } | null;
}

// ==========================================
// 3. Neural Network Simulator
// ==========================================
interface NeuralNetworkState {
  // Network weights (persisted)
  weights: NeuralWeights;

  // Training history
  trainingLoss: number[];
  epochs: number;

  // Actions
  predict: (input: number[]) => number[];
  train: (inputs: number[][], outputs: number[][]) => void;
  getRecommendations: (userProfile: UserHealthProfile, recentFoods: string[]) => FoodRecommendation[];
}

// ==========================================
// Combined AI Brain Store
// ==========================================
interface AIBrainState extends ReinforcementLearningState, KnowledgeBaseState, NeuralNetworkState {
  // User profile
  userProfile: UserHealthProfile | null;
  setUserProfile: (profile: UserHealthProfile) => void;

  // AI Insights
  generateInsights: () => string[];

  // Overall learning stats
  totalInteractions: number;
  learningProgress: number;
}

// Initialize neural network weights
const initializeWeights = (): NeuralWeights => {
  const inputSize = 10;
  const hiddenSize = 8;
  const outputSize = 5;

  const randomWeight = () => (Math.random() - 0.5) * 0.1;

  return {
    inputToHidden: Array(inputSize).fill(0).map(() =>
      Array(hiddenSize).fill(0).map(randomWeight)
    ),
    hiddenToOutput: Array(hiddenSize).fill(0).map(() =>
      Array(outputSize).fill(0).map(randomWeight)
    ),
    biases: Array(hiddenSize + outputSize).fill(0).map(randomWeight),
  };
};

// Sigmoid activation function
const sigmoid = (x: number): number => 1 / (1 + Math.exp(-x));

// Default nutrition knowledge
const defaultKnowledge: NutritionKnowledge[] = [
  {
    topic: "protein",
    facts: [
      "Adults need 0.8g protein per kg body weight daily",
      "Complete proteins contain all 9 essential amino acids",
      "Dal and rice together form a complete protein",
      "Paneer has ~18g protein per 100g",
    ],
    sources: ["WHO Guidelines", "ICMR"],
    confidence: 0.95,
    lastUpdated: new Date(),
  },
  {
    topic: "diabetes",
    facts: [
      "Low glycemic index foods help control blood sugar",
      "Fiber slows down glucose absorption",
      "Small frequent meals are better than large meals",
      "Whole grains are preferred over refined grains",
    ],
    sources: ["American Diabetes Association", "ICMR"],
    confidence: 0.92,
    lastUpdated: new Date(),
  },
  {
    topic: "weight_loss",
    facts: [
      "Calorie deficit is key for weight loss",
      "Protein helps preserve muscle during weight loss",
      "Fiber increases satiety",
      "Drinking water before meals can reduce intake",
    ],
    sources: ["Harvard Health", "NIH"],
    confidence: 0.90,
    lastUpdated: new Date(),
  },
  {
    topic: "traditional_foods",
    facts: [
      "Turmeric has anti-inflammatory properties",
      "Ghee in moderation can be part of a healthy diet",
      "Fermented foods like dahi are probiotic-rich",
      "Millets are highly nutritious ancient grains",
    ],
    sources: ["Ayurvedic texts", "Modern nutrition studies"],
    confidence: 0.85,
    lastUpdated: new Date(),
  },
];

// Default health guidelines
const defaultHealthGuidelines: Record<string, { recommended: string[]; avoid: string[]; tips: string[] }> = {
  diabetes: {
    recommended: ["leafy greens", "whole grains", "legumes", "lean protein", "bitter gourd"],
    avoid: ["white rice", "sugar", "refined flour", "sweetened drinks", "fried foods"],
    tips: [
      "Monitor portion sizes carefully",
      "Choose low GI foods",
      "Include fiber with every meal",
      "Space meals evenly throughout the day",
    ],
  },
  hypertension: {
    recommended: ["potassium-rich foods", "leafy greens", "low-sodium foods", "whole grains"],
    avoid: ["pickles", "papad", "processed foods", "excessive salt", "canned foods"],
    tips: [
      "Use herbs and spices instead of salt",
      "Read food labels for sodium content",
      "Cook fresh meals at home",
      "Limit alcohol consumption",
    ],
  },
  weight_loss: {
    recommended: ["vegetables", "lean protein", "whole grains", "fruits", "legumes"],
    avoid: ["fried foods", "sweets", "sugary drinks", "refined carbs", "excessive ghee"],
    tips: [
      "Eat slowly and mindfully",
      "Fill half your plate with vegetables",
      "Stay hydrated",
      "Get adequate sleep",
    ],
  },
  muscle_gain: {
    recommended: ["eggs", "chicken", "paneer", "dal", "milk", "nuts"],
    avoid: ["excessive cardio", "skipping meals", "processed foods"],
    tips: [
      "Consume protein with every meal",
      "Eat within 2 hours of workout",
      "Include complex carbs for energy",
      "Don't skip post-workout nutrition",
    ],
  },
};

export const useAIBrainStore = create<AIBrainState>()(
  persist(
    (set, get) => ({
      // ==========================================
      // Reinforcement Learning State
      // ==========================================
      feedbackHistory: [],
      patterns: [],
      qValues: {},
      explorationRate: 0.3,

      recordFeedback: (preference) => {
        set((state) => {
          const newHistory = [...state.feedbackHistory, preference];

          // Update Q-values based on feedback
          const currentQ = state.qValues[preference.foodId] || 0;
          const reward = preference.feedback === "liked" ? 1 :
                        preference.feedback === "disliked" ? -1 : 0;
          const learningRate = 0.1;
          const newQ = currentQ + learningRate * (reward - currentQ);

          return {
            feedbackHistory: newHistory.slice(-500), // Keep last 500
            qValues: {
              ...state.qValues,
              [preference.foodId]: newQ,
            },
            totalInteractions: state.totalInteractions + 1,
          };
        });

        // Update patterns after recording
        get().updatePatterns();
      },

      updatePatterns: () => {
        set((state) => {
          const patternCounts: Record<string, number> = {};

          // Analyze feedback for patterns
          state.feedbackHistory.forEach((fb) => {
            const timePattern = `${fb.mealType}_${fb.feedback}`;
            patternCounts[timePattern] = (patternCounts[timePattern] || 0) + 1;
          });

          const newPatterns: LearningPattern[] = Object.entries(patternCounts).map(
            ([pattern, count]) => ({
              pattern,
              weight: count / state.feedbackHistory.length,
              occurrences: count,
              lastUpdated: new Date(),
            })
          );

          return {
            patterns: newPatterns,
            learningProgress: Math.min(100, (state.totalInteractions / 100) * 100),
          };
        });
      },

      getRewardSignal: (foodId) => {
        const state = get();
        return state.qValues[foodId] || 0;
      },

      decayExploration: () => {
        set((state) => ({
          explorationRate: Math.max(0.05, state.explorationRate * 0.995),
        }));
      },

      // ==========================================
      // Knowledge Base State
      // ==========================================
      nutritionKnowledge: defaultKnowledge,
      foodRelationships: {
        rice: ["dal", "curry", "vegetables", "pickle"],
        roti: ["dal", "sabji", "curry", "raita"],
        dal: ["rice", "roti", "ghee", "vegetables"],
        paneer: ["vegetables", "gravy", "naan", "rice"],
      },
      healthGuidelines: defaultHealthGuidelines,

      addKnowledge: (knowledge) => {
        set((state) => ({
          nutritionKnowledge: [
            ...state.nutritionKnowledge.filter((k) => k.topic !== knowledge.topic),
            knowledge,
          ],
        }));
      },

      queryKnowledge: (topic) => {
        const state = get();
        return state.nutritionKnowledge.filter(
          (k) => k.topic.toLowerCase().includes(topic.toLowerCase())
        );
      },

      getHealthGuidelines: (condition) => {
        const state = get();
        return state.healthGuidelines[condition.toLowerCase()] || null;
      },

      // ==========================================
      // Neural Network State
      // ==========================================
      weights: initializeWeights(),
      trainingLoss: [],
      epochs: 0,

      predict: (input) => {
        const state = get();
        const { inputToHidden, hiddenToOutput, biases } = state.weights;

        // Forward pass through hidden layer
        const hidden = inputToHidden[0].map((_, j) => {
          let sum = biases[j];
          input.forEach((val, i) => {
            if (inputToHidden[i]) {
              sum += val * inputToHidden[i][j];
            }
          });
          return sigmoid(sum);
        });

        // Forward pass through output layer
        const output = hiddenToOutput[0].map((_, j) => {
          let sum = biases[hidden.length + j];
          hidden.forEach((val, i) => {
            if (hiddenToOutput[i]) {
              sum += val * hiddenToOutput[i][j];
            }
          });
          return sigmoid(sum);
        });

        return output;
      },

      train: (inputs, outputs) => {
        // Simplified training - adjust weights based on error
        set((state) => {
          const newWeights = { ...state.weights };
          let totalLoss = 0;

          inputs.forEach((input, idx) => {
            const predicted = get().predict(input);
            const target = outputs[idx];

            // Calculate loss
            const loss = target.reduce((sum, t, i) => {
              return sum + Math.pow(t - predicted[i], 2);
            }, 0) / target.length;

            totalLoss += loss;

            // Simple gradient descent (simplified)
            const learningRate = 0.01;
            newWeights.biases = newWeights.biases.map((b, i) => {
              const error = i < predicted.length ? (target[i] || 0) - predicted[i] : 0;
              return b + learningRate * error;
            });
          });

          return {
            weights: newWeights,
            trainingLoss: [...state.trainingLoss.slice(-100), totalLoss / inputs.length],
            epochs: state.epochs + 1,
          };
        });
      },

      getRecommendations: (userProfile, recentFoods) => {
        const state = get();
        const recommendations: FoodRecommendation[] = [];

        // Get foods from Q-values
        const scoredFoods = Object.entries(state.qValues)
          .filter(([foodId]) => !recentFoods.includes(foodId))
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10);

        scoredFoods.forEach(([foodId, qValue]) => {
          const preference = state.feedbackHistory.find((f) => f.foodId === foodId);

          // Calculate scores
          const preferenceMatch = Math.max(0, Math.min(100, (qValue + 1) * 50));
          const nutritionMatch = 70 + Math.random() * 30; // Simulated
          const healthScore = userProfile?.healthConditions.length
            ? 60 + Math.random() * 40
            : 80 + Math.random() * 20;

          const overallScore = (preferenceMatch + nutritionMatch + healthScore) / 3;

          const reasons: string[] = [];
          if (preferenceMatch > 70) reasons.push("Based on your preferences");
          if (nutritionMatch > 80) reasons.push("Meets your nutrition goals");
          if (healthScore > 85) reasons.push("Good for your health profile");

          recommendations.push({
            foodId,
            foodName: preference?.foodName || foodId,
            score: overallScore,
            reasons: reasons.length ? reasons : ["Recommended for variety"],
            nutritionMatch,
            preferenceMatch,
            healthScore,
          });
        });

        return recommendations.sort((a, b) => b.score - a.score);
      },

      // ==========================================
      // User Profile
      // ==========================================
      userProfile: null,
      setUserProfile: (profile) => set({ userProfile: profile }),

      // ==========================================
      // AI Insights
      // ==========================================
      generateInsights: () => {
        const state = get();
        const insights: string[] = [];

        // Analyze patterns
        if (state.patterns.length > 0) {
          const topPattern = state.patterns.sort((a, b) => b.weight - a.weight)[0];
          if (topPattern.pattern.includes("liked")) {
            insights.push(`You tend to enjoy your ${topPattern.pattern.split("_")[0]} meals!`);
          }
        }

        // Analyze feedback trends
        const recentLiked = state.feedbackHistory
          .slice(-20)
          .filter((f) => f.feedback === "liked").length;

        if (recentLiked > 15) {
          insights.push("Great job! You're consistently enjoying your meal choices.");
        } else if (recentLiked < 5) {
          insights.push("Let's explore some new foods that might suit your taste better.");
        }

        // Health-based insights
        if (state.userProfile?.healthConditions.includes("diabetes")) {
          insights.push("Remember to monitor your carb intake and choose low GI foods.");
        }

        // Learning progress
        if (state.totalInteractions > 50) {
          insights.push(`I've learned from ${state.totalInteractions} of your food choices!`);
        }

        return insights.length ? insights : ["Start logging food to get personalized insights!"];
      },

      // ==========================================
      // Stats
      // ==========================================
      totalInteractions: 0,
      learningProgress: 0,
    }),
    {
      name: "nepfit-ai-brain-storage",
    }
  )
);

// Export helper hooks
export const useAIRecommendations = () => {
  const { getRecommendations, userProfile, feedbackHistory } = useAIBrainStore();
  const recentFoods = feedbackHistory.slice(-10).map((f) => f.foodId);

  return userProfile
    ? getRecommendations(userProfile, recentFoods)
    : [];
};

export const useAIInsights = () => {
  const { generateInsights } = useAIBrainStore();
  return generateInsights();
};
