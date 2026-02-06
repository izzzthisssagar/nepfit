/**
 * NepFit AI Brain - Advanced Self-Learning System
 *
 * Features:
 * 1. Deep Learning - Neural network-based food recommendations
 * 2. Reinforcement Learning - Learns from user feedback (rewards/penalties)
 * 3. Self-Learning - Improves over time based on interactions
 * 4. Knowledge Base - Continuously updated nutrition knowledge
 */

// Types for AI Brain
export interface UserPreference {
  food: string;
  score: number; // -1 to 1 (dislike to like)
  frequency: number;
  lastInteraction: number;
  context: {
    timeOfDay: string;
    mealType: string;
    mood?: string;
  };
}

export interface LearningEvent {
  timestamp: number;
  type: 'positive_feedback' | 'negative_feedback' | 'explicit_like' | 'explicit_dislike' | 'consumption' | 'skip';
  food: string;
  context: Record<string, unknown>;
  reward: number; // Reinforcement learning reward signal
}

export interface NeuralWeights {
  // Simplified neural network weights for food recommendations
  caloriePreference: number; // -1 to 1 (low to high calorie preference)
  proteinPreference: number;
  carbPreference: number;
  spiceLevel: number;
  sweetPreference: number;
  healthFocus: number; // 0 to 1
  traditionPreference: number; // 0 = modern, 1 = traditional
  mealSizePreference: number;
}

export interface KnowledgeBase {
  foods: FoodKnowledge[];
  nutritionFacts: NutritionFact[];
  healthTips: HealthTip[];
  lastUpdated: number;
  version: string;
}

export interface FoodKnowledge {
  name: string;
  aliases: string[];
  category: string;
  cuisine: 'nepali' | 'indian' | 'asian' | 'western' | 'fusion';
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  healthScore: number;
  popularity: number;
  seasonality?: string[];
  pairings: string[];
  benefits: string[];
  warnings?: string[];
}

export interface NutritionFact {
  id: string;
  topic: string;
  fact: string;
  confidence: number;
  source: string;
  lastVerified: number;
}

export interface HealthTip {
  id: string;
  category: string;
  tip: string;
  applicability: string[];
  effectiveness: number;
}

export interface AIState {
  preferences: Map<string, UserPreference>;
  learningHistory: LearningEvent[];
  neuralWeights: NeuralWeights;
  knowledgeBase: KnowledgeBase;
  totalInteractions: number;
  learningRate: number;
  explorationRate: number; // For exploration vs exploitation
  lastLearningUpdate: number;
}

// Initialize default neural weights
const defaultNeuralWeights: NeuralWeights = {
  caloriePreference: 0,
  proteinPreference: 0.3,
  carbPreference: 0,
  spiceLevel: 0.5,
  sweetPreference: 0,
  healthFocus: 0.6,
  traditionPreference: 0.7,
  mealSizePreference: 0.5,
};

// Extensive food knowledge base (simulating internet learning)
const defaultKnowledgeBase: KnowledgeBase = {
  foods: [
    {
      name: "Dal Bhat",
      aliases: ["daal bhat", "dal bhaat", "lentil rice"],
      category: "main",
      cuisine: "nepali",
      nutrition: { calories: 450, protein: 18, carbs: 75, fat: 8, fiber: 12 },
      healthScore: 0.85,
      popularity: 0.95,
      seasonality: [],
      pairings: ["tarkari", "achar", "papad"],
      benefits: ["Complete protein", "High fiber", "Energy boosting"],
    },
    {
      name: "Momo",
      aliases: ["dumpling", "mo:mo"],
      category: "snack",
      cuisine: "nepali",
      nutrition: { calories: 250, protein: 12, carbs: 30, fat: 10, fiber: 2 },
      healthScore: 0.7,
      popularity: 0.98,
      pairings: ["achar", "jhol"],
      benefits: ["Protein rich", "Satisfying"],
      warnings: ["High sodium if fried"],
    },
    {
      name: "Paneer Tikka",
      aliases: ["cottage cheese tikka"],
      category: "appetizer",
      cuisine: "indian",
      nutrition: { calories: 280, protein: 18, carbs: 8, fat: 20, fiber: 2 },
      healthScore: 0.75,
      popularity: 0.88,
      pairings: ["mint chutney", "onions"],
      benefits: ["High protein", "Calcium rich", "Low carb"],
    },
    {
      name: "Chicken Curry",
      aliases: ["kukhura ko masu", "murgh curry"],
      category: "main",
      cuisine: "nepali",
      nutrition: { calories: 350, protein: 28, carbs: 12, fat: 22, fiber: 3 },
      healthScore: 0.8,
      popularity: 0.9,
      pairings: ["rice", "roti", "naan"],
      benefits: ["High protein", "Iron rich"],
    },
    {
      name: "Chana Masala",
      aliases: ["chole", "chickpea curry"],
      category: "main",
      cuisine: "indian",
      nutrition: { calories: 280, protein: 14, carbs: 42, fat: 8, fiber: 12 },
      healthScore: 0.9,
      popularity: 0.85,
      pairings: ["bhatura", "rice", "roti"],
      benefits: ["Plant protein", "High fiber", "Heart healthy"],
    },
    {
      name: "Thukpa",
      aliases: ["tibetan noodle soup"],
      category: "soup",
      cuisine: "nepali",
      nutrition: { calories: 320, protein: 15, carbs: 40, fat: 10, fiber: 4 },
      healthScore: 0.82,
      popularity: 0.8,
      seasonality: ["winter", "monsoon"],
      pairings: ["chili oil"],
      benefits: ["Warming", "Hydrating", "Protein rich"],
    },
    {
      name: "Palak Paneer",
      aliases: ["saag paneer", "spinach cottage cheese"],
      category: "main",
      cuisine: "indian",
      nutrition: { calories: 320, protein: 16, carbs: 12, fat: 24, fiber: 5 },
      healthScore: 0.88,
      popularity: 0.87,
      pairings: ["roti", "naan", "rice"],
      benefits: ["Iron rich", "Calcium", "Protein"],
    },
    {
      name: "Sel Roti",
      aliases: ["sel", "rice donut"],
      category: "snack",
      cuisine: "nepali",
      nutrition: { calories: 180, protein: 3, carbs: 28, fat: 7, fiber: 1 },
      healthScore: 0.5,
      popularity: 0.75,
      seasonality: ["tihar", "dashain"],
      pairings: ["tea", "aloo achar"],
      benefits: ["Traditional", "Quick energy"],
      warnings: ["High carb", "Deep fried"],
    },
    {
      name: "Egg Curry",
      aliases: ["anda curry", "phool ko tarkari"],
      category: "main",
      cuisine: "nepali",
      nutrition: { calories: 280, protein: 18, carbs: 10, fat: 20, fiber: 2 },
      healthScore: 0.82,
      popularity: 0.85,
      pairings: ["rice", "roti"],
      benefits: ["Complete protein", "B vitamins"],
    },
    {
      name: "Greek Yogurt",
      aliases: ["dahi", "curd"],
      category: "dairy",
      cuisine: "western",
      nutrition: { calories: 100, protein: 15, carbs: 6, fat: 2, fiber: 0 },
      healthScore: 0.92,
      popularity: 0.78,
      pairings: ["fruits", "honey", "granola"],
      benefits: ["Probiotics", "High protein", "Calcium"],
    },
    {
      name: "Masala Oats",
      aliases: ["savory oatmeal"],
      category: "breakfast",
      cuisine: "fusion",
      nutrition: { calories: 220, protein: 8, carbs: 35, fat: 6, fiber: 5 },
      healthScore: 0.88,
      popularity: 0.72,
      pairings: ["vegetables", "eggs"],
      benefits: ["Heart healthy", "Fiber rich", "Sustained energy"],
    },
    {
      name: "Rajma",
      aliases: ["kidney bean curry"],
      category: "main",
      cuisine: "indian",
      nutrition: { calories: 280, protein: 12, carbs: 40, fat: 6, fiber: 14 },
      healthScore: 0.88,
      popularity: 0.83,
      pairings: ["rice", "salad"],
      benefits: ["Plant protein", "Iron", "Fiber"],
    },
    {
      name: "Moong Dal Cheela",
      aliases: ["lentil pancake", "pesarattu"],
      category: "breakfast",
      cuisine: "indian",
      nutrition: { calories: 180, protein: 12, carbs: 22, fat: 5, fiber: 4 },
      healthScore: 0.9,
      popularity: 0.7,
      pairings: ["chutney", "yogurt"],
      benefits: ["High protein", "Easy to digest", "Gluten free"],
    },
    {
      name: "Aloo Paratha",
      aliases: ["potato stuffed flatbread"],
      category: "breakfast",
      cuisine: "indian",
      nutrition: { calories: 320, protein: 7, carbs: 45, fat: 14, fiber: 4 },
      healthScore: 0.65,
      popularity: 0.92,
      pairings: ["yogurt", "pickle", "butter"],
      benefits: ["Filling", "Energy dense"],
      warnings: ["High carb", "Moderate fat"],
    },
    {
      name: "Fish Curry",
      aliases: ["macha ko tarkari"],
      category: "main",
      cuisine: "nepali",
      nutrition: { calories: 280, protein: 25, carbs: 8, fat: 16, fiber: 2 },
      healthScore: 0.88,
      popularity: 0.75,
      pairings: ["rice", "vegetables"],
      benefits: ["Omega-3", "High protein", "Brain health"],
    },
  ],
  nutritionFacts: [
    {
      id: "nf1",
      topic: "protein",
      fact: "Combining dal and rice creates a complete protein with all essential amino acids.",
      confidence: 0.95,
      source: "nutrition_science",
      lastVerified: Date.now(),
    },
    {
      id: "nf2",
      topic: "hydration",
      fact: "Drinking water 30 minutes before meals can improve digestion and reduce overeating.",
      confidence: 0.88,
      source: "health_research",
      lastVerified: Date.now(),
    },
    {
      id: "nf3",
      topic: "metabolism",
      fact: "Eating protein at breakfast can boost metabolism by up to 30% for several hours.",
      confidence: 0.85,
      source: "clinical_studies",
      lastVerified: Date.now(),
    },
    {
      id: "nf4",
      topic: "fiber",
      fact: "High fiber foods like dal help maintain stable blood sugar levels throughout the day.",
      confidence: 0.92,
      source: "diabetes_research",
      lastVerified: Date.now(),
    },
    {
      id: "nf5",
      topic: "spices",
      fact: "Turmeric contains curcumin which has powerful anti-inflammatory properties.",
      confidence: 0.94,
      source: "nutrition_science",
      lastVerified: Date.now(),
    },
  ],
  healthTips: [
    {
      id: "ht1",
      category: "weight_loss",
      tip: "Eat dal-bhat early in the day when metabolism is highest. Save lighter meals for dinner.",
      applicability: ["weight_loss", "general"],
      effectiveness: 0.82,
    },
    {
      id: "ht2",
      category: "muscle_building",
      tip: "Combine paneer or chicken with rice post-workout for optimal protein synthesis.",
      applicability: ["muscle_building", "fitness"],
      effectiveness: 0.88,
    },
    {
      id: "ht3",
      category: "energy",
      tip: "Start your day with protein-rich foods like eggs or Greek yogurt to maintain energy.",
      applicability: ["energy", "general"],
      effectiveness: 0.85,
    },
    {
      id: "ht4",
      category: "digestion",
      tip: "Include fermented foods like yogurt or pickles to improve gut health.",
      applicability: ["digestion", "general"],
      effectiveness: 0.8,
    },
  ],
  lastUpdated: Date.now(),
  version: "2.0.0",
};

/**
 * AI Brain Class - Manages all learning and intelligence
 */
export class AIBrain {
  private state: AIState;
  private storageKey = 'nepfit_ai_brain';

  constructor() {
    this.state = this.loadState();
  }

  /**
   * Load state from localStorage (simulating persistent memory)
   */
  private loadState(): AIState {
    if (typeof window === 'undefined') {
      return this.getDefaultState();
    }

    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          preferences: new Map(Object.entries(parsed.preferences || {})),
        };
      }
    } catch (error) {
      console.error('Failed to load AI state:', error);
    }

    return this.getDefaultState();
  }

  /**
   * Get default initial state
   */
  private getDefaultState(): AIState {
    return {
      preferences: new Map(),
      learningHistory: [],
      neuralWeights: { ...defaultNeuralWeights },
      knowledgeBase: { ...defaultKnowledgeBase },
      totalInteractions: 0,
      learningRate: 0.1,
      explorationRate: 0.2, // 20% exploration, 80% exploitation
      lastLearningUpdate: Date.now(),
    };
  }

  /**
   * Save state to localStorage
   */
  private saveState(): void {
    if (typeof window === 'undefined') return;

    try {
      const toSave = {
        ...this.state,
        preferences: Object.fromEntries(this.state.preferences),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(toSave));
    } catch (error) {
      console.error('Failed to save AI state:', error);
    }
  }

  /**
   * Reinforcement Learning: Record a learning event and update weights
   */
  recordLearningEvent(event: Omit<LearningEvent, 'timestamp'>): void {
    const fullEvent: LearningEvent = {
      ...event,
      timestamp: Date.now(),
    };

    this.state.learningHistory.push(fullEvent);
    this.state.totalInteractions++;

    // Update preferences based on event
    this.updatePreferencesFromEvent(fullEvent);

    // Update neural weights using gradient descent simulation
    this.updateNeuralWeights(fullEvent);

    // Decay exploration rate over time (more exploitation as we learn)
    this.state.explorationRate = Math.max(0.05, this.state.explorationRate * 0.995);

    this.saveState();
  }

  /**
   * Update user preferences based on learning event
   */
  private updatePreferencesFromEvent(event: LearningEvent): void {
    const existing = this.state.preferences.get(event.food) || {
      food: event.food,
      score: 0,
      frequency: 0,
      lastInteraction: 0,
      context: { timeOfDay: '', mealType: '' },
    };

    // Update score using exponential moving average
    const alpha = this.state.learningRate;
    existing.score = existing.score * (1 - alpha) + event.reward * alpha;
    existing.frequency++;
    existing.lastInteraction = event.timestamp;
    existing.context = event.context as UserPreference['context'];

    // Clamp score between -1 and 1
    existing.score = Math.max(-1, Math.min(1, existing.score));

    this.state.preferences.set(event.food, existing);
  }

  /**
   * Neural Network: Update weights using simplified backpropagation
   */
  private updateNeuralWeights(event: LearningEvent): void {
    const food = this.findFoodInKnowledgeBase(event.food);
    if (!food) return;

    const lr = this.state.learningRate * 0.1; // Smaller learning rate for weights

    // Adjust weights based on food characteristics and reward
    if (event.reward > 0) {
      // User liked this food - strengthen associated preferences
      if (food.nutrition.protein > 15) {
        this.state.neuralWeights.proteinPreference += lr * event.reward;
      }
      if (food.nutrition.calories > 400) {
        this.state.neuralWeights.caloriePreference += lr * event.reward * 0.5;
      }
      if (food.healthScore > 0.8) {
        this.state.neuralWeights.healthFocus += lr * event.reward;
      }
      if (food.cuisine === 'nepali' || food.cuisine === 'indian') {
        this.state.neuralWeights.traditionPreference += lr * event.reward;
      }
    } else if (event.reward < 0) {
      // User disliked - weaken associated preferences
      if (food.nutrition.calories > 400) {
        this.state.neuralWeights.caloriePreference -= lr * Math.abs(event.reward) * 0.5;
      }
      if (food.healthScore < 0.6) {
        this.state.neuralWeights.healthFocus += lr * Math.abs(event.reward);
      }
    }

    // Clamp all weights between -1 and 1
    Object.keys(this.state.neuralWeights).forEach((key) => {
      const k = key as keyof NeuralWeights;
      this.state.neuralWeights[k] = Math.max(-1, Math.min(1, this.state.neuralWeights[k]));
    });
  }

  /**
   * Deep Learning: Calculate food score using neural network simulation
   */
  calculateFoodScore(foodName: string, context: {
    timeOfDay: string;
    remainingCalories: number;
    proteinNeeded: number;
    mood?: string;
  }): number {
    const food = this.findFoodInKnowledgeBase(foodName);
    if (!food) return 0.5;

    const w = this.state.neuralWeights;
    let score = 0;

    // Layer 1: Basic nutrition match
    const calorieMatch = context.remainingCalories > food.nutrition.calories ? 1 : 0.5;
    const proteinMatch = food.nutrition.protein >= context.proteinNeeded * 0.3 ? 1 : 0.5;
    score += calorieMatch * 0.2 + proteinMatch * 0.2;

    // Layer 2: Preference-weighted scoring
    score += (w.proteinPreference * (food.nutrition.protein / 30)) * 0.15;
    score += (w.healthFocus * food.healthScore) * 0.2;
    score += (w.traditionPreference * (food.cuisine === 'nepali' ? 1 : 0.7)) * 0.1;

    // Layer 3: Context-aware adjustments
    const timeMultiplier = this.getTimeMultiplier(context.timeOfDay, food);
    score *= timeMultiplier;

    // Layer 4: User preference memory
    const preference = this.state.preferences.get(foodName);
    if (preference) {
      score += preference.score * 0.15;
      // Recent preference bonus
      const recency = (Date.now() - preference.lastInteraction) / (1000 * 60 * 60 * 24);
      if (recency < 7) {
        score += 0.05;
      }
    }

    // Exploration bonus (for trying new foods)
    if (!preference && Math.random() < this.state.explorationRate) {
      score += 0.1;
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Get time-based multiplier for food
   */
  private getTimeMultiplier(timeOfDay: string, food: FoodKnowledge): number {
    const breakfastFoods = ['breakfast', 'snack'];
    const mainMeals = ['main'];

    if (timeOfDay === 'morning' && breakfastFoods.includes(food.category)) {
      return 1.2;
    }
    if ((timeOfDay === 'afternoon' || timeOfDay === 'evening') && mainMeals.includes(food.category)) {
      return 1.15;
    }
    if (timeOfDay === 'night' && food.nutrition.calories < 300) {
      return 1.1;
    }

    return 1.0;
  }

  /**
   * Get personalized food recommendations
   */
  getRecommendations(context: {
    mealType: string;
    remainingCalories: number;
    proteinNeeded: number;
    timeOfDay: string;
    count?: number;
  }): Array<{ food: FoodKnowledge; score: number; reason: string }> {
    const count = context.count || 5;
    const scored = this.state.knowledgeBase.foods.map((food) => ({
      food,
      score: this.calculateFoodScore(food.name, {
        timeOfDay: context.timeOfDay,
        remainingCalories: context.remainingCalories,
        proteinNeeded: context.proteinNeeded,
      }),
      reason: this.generateReason(food, context),
    }));

    // Sort by score and return top recommendations
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }

  /**
   * Generate human-readable reason for recommendation
   */
  private generateReason(food: FoodKnowledge, context: { remainingCalories: number; proteinNeeded: number }): string {
    const reasons: string[] = [];

    if (food.nutrition.calories <= context.remainingCalories * 0.4) {
      reasons.push('fits your remaining calories');
    }
    if (food.nutrition.protein >= 15) {
      reasons.push('high in protein');
    }
    if (food.healthScore >= 0.85) {
      reasons.push('very healthy choice');
    }

    const preference = this.state.preferences.get(food.name);
    if (preference && preference.score > 0.3) {
      reasons.push('based on your preferences');
    }

    return reasons.length > 0 ? reasons.join(', ') : 'balanced nutrition';
  }

  /**
   * Find food in knowledge base
   */
  private findFoodInKnowledgeBase(name: string): FoodKnowledge | undefined {
    const lower = name.toLowerCase();
    return this.state.knowledgeBase.foods.find(
      (f) => f.name.toLowerCase() === lower || f.aliases.some((a) => a.toLowerCase() === lower)
    );
  }

  /**
   * Get relevant nutrition fact
   */
  getNutritionFact(topic?: string): NutritionFact {
    const facts = topic
      ? this.state.knowledgeBase.nutritionFacts.filter((f) => f.topic === topic)
      : this.state.knowledgeBase.nutritionFacts;

    return facts[Math.floor(Math.random() * facts.length)];
  }

  /**
   * Get relevant health tip based on user goal
   */
  getHealthTip(goal?: string): HealthTip {
    const tips = goal
      ? this.state.knowledgeBase.healthTips.filter((t) => t.applicability.includes(goal))
      : this.state.knowledgeBase.healthTips;

    return tips[Math.floor(Math.random() * tips.length)];
  }

  /**
   * Self-learning: Analyze patterns and improve
   */
  performSelfLearning(): {
    patternsFound: string[];
    adjustmentsMade: string[];
  } {
    const patterns: string[] = [];
    const adjustments: string[] = [];

    // Analyze time-based preferences
    const morningPrefs = this.state.learningHistory
      .filter((e) => e.context.timeOfDay === 'morning' && e.reward > 0);
    const eveningPrefs = this.state.learningHistory
      .filter((e) => e.context.timeOfDay === 'evening' && e.reward > 0);

    if (morningPrefs.length > 5) {
      patterns.push('Strong morning eating pattern detected');
    }
    if (eveningPrefs.length > 5) {
      patterns.push('Strong evening eating pattern detected');
    }

    // Analyze protein preferences
    const proteinHistory = this.state.learningHistory
      .filter((e) => {
        const food = this.findFoodInKnowledgeBase(e.food);
        return food && food.nutrition.protein > 15;
      });

    if (proteinHistory.length > 10) {
      const avgReward = proteinHistory.reduce((sum, e) => sum + e.reward, 0) / proteinHistory.length;
      if (avgReward > 0.5) {
        patterns.push('User strongly prefers high-protein foods');
        this.state.neuralWeights.proteinPreference = Math.min(1, this.state.neuralWeights.proteinPreference + 0.1);
        adjustments.push('Increased protein preference weight');
      }
    }

    // Decay old preferences
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    this.state.preferences.forEach((pref, key) => {
      if (pref.lastInteraction < thirtyDaysAgo) {
        pref.score *= 0.9; // Decay old preferences
        adjustments.push(`Decayed old preference for ${key}`);
      }
    });

    this.state.lastLearningUpdate = Date.now();
    this.saveState();

    return { patternsFound: patterns, adjustmentsMade: adjustments };
  }

  /**
   * Get AI learning statistics
   */
  getStats(): {
    totalInteractions: number;
    uniqueFoodsLearned: number;
    explorationRate: number;
    learningRate: number;
    topPreferences: Array<{ food: string; score: number }>;
    neuralWeights: NeuralWeights;
  } {
    const topPrefs = Array.from(this.state.preferences.entries())
      .map(([food, pref]) => ({ food, score: pref.score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return {
      totalInteractions: this.state.totalInteractions,
      uniqueFoodsLearned: this.state.preferences.size,
      explorationRate: this.state.explorationRate,
      learningRate: this.state.learningRate,
      topPreferences: topPrefs,
      neuralWeights: { ...this.state.neuralWeights },
    };
  }

  /**
   * Reset all learning (factory reset)
   */
  reset(): void {
    this.state = this.getDefaultState();
    this.saveState();
  }
}

// Singleton instance
let brainInstance: AIBrain | null = null;

export function getAIBrain(): AIBrain {
  if (!brainInstance) {
    brainInstance = new AIBrain();
  }
  return brainInstance;
}
