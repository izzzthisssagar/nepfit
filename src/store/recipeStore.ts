import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecipeIngredient {
  name: string;
  amount: string;
  calories?: number;
  protein?: number;
}

export interface Recipe {
  id: string;
  name: string;
  nameNepali?: string;
  description: string;
  image: string;
  cuisine: "nepali" | "indian" | "fusion" | "healthy";
  category: "breakfast" | "lunch" | "dinner" | "snack" | "dessert" | "drink";
  difficulty: "easy" | "medium" | "hard";
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  calories: number; // per serving
  protein: number; // per serving
  carbs: number; // per serving
  fat: number; // per serving
  ingredients: RecipeIngredient[];
  instructions: string[];
  tips?: string[];
  tags: string[];
  dietaryInfo: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    lowCarb: boolean;
    highProtein: boolean;
  };
  healthBenefits?: string[];
  createdBy: "system" | "user";
  rating?: number;
  reviews?: number;
}

interface RecipeState {
  savedRecipes: string[];
  recentlyViewed: string[];

  // Actions
  saveRecipe: (recipeId: string) => void;
  unsaveRecipe: (recipeId: string) => void;
  addToRecentlyViewed: (recipeId: string) => void;
  isSaved: (recipeId: string) => boolean;
}

// Pre-built recipe database
export const systemRecipes: Recipe[] = [
  // BREAKFAST
  {
    id: "masala-oats",
    name: "Masala Oats",
    description: "A savory, spiced oatmeal packed with vegetables - perfect healthy breakfast option for weight loss",
    image: "🥣",
    cuisine: "fusion",
    category: "breakfast",
    difficulty: "easy",
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    calories: 220,
    protein: 8,
    carbs: 35,
    fat: 6,
    ingredients: [
      { name: "Rolled oats", amount: "1/2 cup", calories: 150, protein: 5 },
      { name: "Mixed vegetables (carrot, peas, beans)", amount: "1/4 cup", calories: 25, protein: 1 },
      { name: "Onion (chopped)", amount: "2 tbsp", calories: 10 },
      { name: "Tomato (chopped)", amount: "1 small", calories: 15 },
      { name: "Green chili", amount: "1", calories: 2 },
      { name: "Cumin seeds", amount: "1/2 tsp" },
      { name: "Turmeric", amount: "1/4 tsp" },
      { name: "Oil/Ghee", amount: "1 tsp", calories: 45 },
      { name: "Salt", amount: "to taste" },
      { name: "Water", amount: "1.5 cups" },
    ],
    instructions: [
      "Heat oil in a pan, add cumin seeds and let them splutter",
      "Add chopped onions and green chili, sauté until golden",
      "Add tomatoes and cook until soft",
      "Add mixed vegetables, turmeric, and salt. Cook for 2 minutes",
      "Add water and bring to a boil",
      "Add oats, stir well, and cook for 3-4 minutes until soft",
      "Garnish with coriander and serve hot",
    ],
    tips: [
      "Use quick oats for faster cooking",
      "Add a squeeze of lemon for extra flavor",
      "You can add boiled egg for more protein",
    ],
    tags: ["weight-loss", "quick", "fiber-rich", "vegetarian"],
    dietaryInfo: {
      vegetarian: true,
      vegan: true,
      glutenFree: false,
      dairyFree: true,
      lowCarb: false,
      highProtein: false,
    },
    healthBenefits: ["High fiber for digestion", "Sustained energy release", "Heart-healthy"],
    createdBy: "system",
    rating: 4.5,
    reviews: 234,
  },
  {
    id: "besan-cheela",
    name: "Besan Cheela",
    nameNepali: "बेसन चिला",
    description: "Protein-rich gram flour pancakes - a traditional Indian breakfast perfect for diabetics",
    image: "🥞",
    cuisine: "indian",
    category: "breakfast",
    difficulty: "easy",
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    calories: 180,
    protein: 10,
    carbs: 20,
    fat: 7,
    ingredients: [
      { name: "Besan (gram flour)", amount: "1 cup", calories: 350, protein: 22 },
      { name: "Onion (finely chopped)", amount: "1 medium", calories: 40 },
      { name: "Tomato (finely chopped)", amount: "1 small", calories: 15 },
      { name: "Green chili (chopped)", amount: "1-2" },
      { name: "Coriander leaves", amount: "2 tbsp" },
      { name: "Cumin powder", amount: "1/2 tsp" },
      { name: "Red chili powder", amount: "1/4 tsp" },
      { name: "Ajwain (carom seeds)", amount: "1/4 tsp" },
      { name: "Salt", amount: "to taste" },
      { name: "Oil for cooking", amount: "2 tsp" },
      { name: "Water", amount: "3/4 cup" },
    ],
    instructions: [
      "Mix besan with all spices, onion, tomato, chili, and coriander",
      "Add water gradually to make a smooth, pourable batter",
      "Heat a non-stick pan and grease lightly with oil",
      "Pour a ladleful of batter and spread in circular motion",
      "Cook on medium heat until the bottom is golden",
      "Flip and cook the other side for 1-2 minutes",
      "Serve hot with mint chutney or curd",
    ],
    tips: [
      "Let the batter rest for 5 minutes for softer cheelas",
      "Add grated vegetables for extra nutrition",
      "Use minimal oil for a healthier version",
    ],
    tags: ["diabetic-friendly", "high-protein", "gluten-free", "vegetarian"],
    dietaryInfo: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      dairyFree: true,
      lowCarb: true,
      highProtein: true,
    },
    healthBenefits: ["Low glycemic index", "High protein for muscle", "Good for diabetics"],
    createdBy: "system",
    rating: 4.7,
    reviews: 456,
  },
  // LUNCH/DINNER
  {
    id: "dal-bhat-tarkari",
    name: "Dal Bhat Tarkari",
    nameNepali: "दाल भात तरकारी",
    description: "The quintessential Nepali meal - perfectly balanced with lentils, rice, and seasonal vegetables",
    image: "🍛",
    cuisine: "nepali",
    category: "lunch",
    difficulty: "medium",
    prepTime: 15,
    cookTime: 40,
    servings: 2,
    calories: 450,
    protein: 16,
    carbs: 75,
    fat: 8,
    ingredients: [
      { name: "Rice", amount: "1 cup", calories: 200, protein: 4 },
      { name: "Yellow dal (masoor)", amount: "1/2 cup", calories: 170, protein: 12 },
      { name: "Mixed vegetables", amount: "1 cup", calories: 50, protein: 2 },
      { name: "Tomato", amount: "1 medium", calories: 20 },
      { name: "Onion", amount: "1 medium", calories: 40 },
      { name: "Garlic", amount: "3-4 cloves" },
      { name: "Ginger", amount: "1 inch piece" },
      { name: "Turmeric", amount: "1/2 tsp" },
      { name: "Cumin seeds", amount: "1 tsp" },
      { name: "Mustard oil/Ghee", amount: "2 tbsp" },
      { name: "Salt", amount: "to taste" },
      { name: "Green chili", amount: "2" },
    ],
    instructions: [
      "Wash rice and cook with 2 cups water until fluffy",
      "For dal: Boil dal with turmeric, salt, and tomato until soft",
      "Heat oil, add cumin, garlic, and dried chilies for tadka",
      "Pour tadka over dal and mix well",
      "For tarkari: Heat oil, add cumin, onion, and ginger-garlic",
      "Add vegetables, turmeric, salt, and cook until tender",
      "Serve rice with dal on top and tarkari on the side",
    ],
    tips: [
      "Use ghee for authentic flavor",
      "Add a squeeze of lemon to dal before serving",
      "Serve with achar (pickle) for complete meal",
    ],
    tags: ["traditional", "balanced", "comfort-food", "nepali"],
    dietaryInfo: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      dairyFree: true,
      lowCarb: false,
      highProtein: false,
    },
    healthBenefits: ["Complete protein when combined", "Sustained energy", "Rich in fiber"],
    createdBy: "system",
    rating: 4.9,
    reviews: 892,
  },
  {
    id: "chicken-curry",
    name: "Kukhura ko Masu",
    nameNepali: "कुखुराको मासु",
    description: "Authentic Nepali-style chicken curry with bold spices - high protein comfort food",
    image: "🍗",
    cuisine: "nepali",
    category: "dinner",
    difficulty: "medium",
    prepTime: 20,
    cookTime: 45,
    servings: 4,
    calories: 320,
    protein: 28,
    carbs: 10,
    fat: 20,
    ingredients: [
      { name: "Chicken (bone-in)", amount: "500g", calories: 550, protein: 100 },
      { name: "Onion (sliced)", amount: "2 large", calories: 80 },
      { name: "Tomato (pureed)", amount: "2 medium", calories: 40 },
      { name: "Ginger-garlic paste", amount: "2 tbsp" },
      { name: "Cumin powder", amount: "1 tsp" },
      { name: "Coriander powder", amount: "1 tsp" },
      { name: "Turmeric", amount: "1/2 tsp" },
      { name: "Red chili powder", amount: "1 tsp" },
      { name: "Garam masala", amount: "1/2 tsp" },
      { name: "Mustard oil", amount: "3 tbsp", calories: 120 },
      { name: "Fresh coriander", amount: "for garnish" },
      { name: "Salt", amount: "to taste" },
    ],
    instructions: [
      "Marinate chicken with turmeric, salt, and half the ginger-garlic paste for 30 min",
      "Heat mustard oil until smoking, then let it cool slightly",
      "Fry onions until deep golden brown",
      "Add remaining ginger-garlic paste, cook for 2 minutes",
      "Add all spice powders and tomato puree, cook until oil separates",
      "Add marinated chicken, mix well, and sear on high heat",
      "Add 1/2 cup water, cover and simmer until chicken is cooked",
      "Finish with garam masala and fresh coriander",
    ],
    tips: [
      "Use bone-in chicken for more flavor",
      "Let the oil separate at each stage for rich curry",
      "Rest the curry for 10 minutes before serving",
    ],
    tags: ["high-protein", "nepali", "non-vegetarian", "comfort-food"],
    dietaryInfo: {
      vegetarian: false,
      vegan: false,
      glutenFree: true,
      dairyFree: true,
      lowCarb: true,
      highProtein: true,
    },
    healthBenefits: ["High protein for muscle building", "Iron-rich", "B-vitamins"],
    createdBy: "system",
    rating: 4.8,
    reviews: 567,
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    description: "Grilled cottage cheese marinated in yogurt and spices - high protein vegetarian option",
    image: "🧀",
    cuisine: "indian",
    category: "dinner",
    difficulty: "medium",
    prepTime: 30,
    cookTime: 20,
    servings: 3,
    calories: 280,
    protein: 18,
    carbs: 8,
    fat: 20,
    ingredients: [
      { name: "Paneer (cubed)", amount: "250g", calories: 650, protein: 45 },
      { name: "Thick yogurt", amount: "1/2 cup", calories: 60, protein: 5 },
      { name: "Bell peppers", amount: "1 each color", calories: 30 },
      { name: "Onion (cubed)", amount: "1 large", calories: 40 },
      { name: "Kashmiri red chili powder", amount: "1 tbsp" },
      { name: "Garam masala", amount: "1 tsp" },
      { name: "Kasoori methi", amount: "1 tsp" },
      { name: "Ginger-garlic paste", amount: "1 tbsp" },
      { name: "Lemon juice", amount: "1 tbsp" },
      { name: "Oil", amount: "2 tbsp" },
      { name: "Chat masala", amount: "for garnish" },
    ],
    instructions: [
      "Mix yogurt with all spices, ginger-garlic paste, and oil",
      "Add paneer cubes and vegetables, coat well",
      "Marinate for minimum 2 hours or overnight",
      "Thread onto skewers alternating paneer and vegetables",
      "Grill on high heat or bake at 220°C for 15-20 minutes",
      "Baste with butter halfway through",
      "Sprinkle chat masala and lemon juice before serving",
    ],
    tips: [
      "Use hung curd for better marinade",
      "Don't over-grill or paneer becomes rubbery",
      "Add a pinch of sugar to balance the spices",
    ],
    tags: ["vegetarian", "high-protein", "low-carb", "grilled"],
    dietaryInfo: {
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      dairyFree: false,
      lowCarb: true,
      highProtein: true,
    },
    healthBenefits: ["High calcium", "Good protein source", "Low carb option"],
    createdBy: "system",
    rating: 4.6,
    reviews: 345,
  },
  // SNACKS
  {
    id: "momo",
    name: "Chicken Momo",
    nameNepali: "चिकन मोमो",
    description: "Beloved Nepali dumplings with spiced chicken filling - street food favorite",
    image: "🥟",
    cuisine: "nepali",
    category: "snack",
    difficulty: "hard",
    prepTime: 45,
    cookTime: 20,
    servings: 4,
    calories: 250,
    protein: 15,
    carbs: 28,
    fat: 9,
    ingredients: [
      { name: "All-purpose flour", amount: "2 cups", calories: 400 },
      { name: "Chicken mince", amount: "300g", calories: 450, protein: 60 },
      { name: "Onion (finely chopped)", amount: "1 large", calories: 40 },
      { name: "Garlic (minced)", amount: "4 cloves" },
      { name: "Ginger (minced)", amount: "1 inch" },
      { name: "Green onions", amount: "3 stalks" },
      { name: "Coriander leaves", amount: "1/4 cup" },
      { name: "Cumin powder", amount: "1/2 tsp" },
      { name: "Black pepper", amount: "1/4 tsp" },
      { name: "Soy sauce", amount: "1 tbsp" },
      { name: "Oil", amount: "2 tbsp" },
      { name: "Salt", amount: "to taste" },
    ],
    instructions: [
      "Make dough: Mix flour with water and a pinch of salt, knead until smooth",
      "Rest dough covered for 30 minutes",
      "For filling: Mix chicken with all vegetables and spices",
      "Add soy sauce and oil, mix well",
      "Roll small portions of dough into thin circles",
      "Place filling in center, pleat and seal edges",
      "Steam for 12-15 minutes until cooked through",
      "Serve hot with tomato achar",
    ],
    tips: [
      "Keep dough covered to prevent drying",
      "Don't overstuff the momos",
      "Steam in batches without overcrowding",
    ],
    tags: ["street-food", "nepali", "steamed", "popular"],
    dietaryInfo: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: true,
      lowCarb: false,
      highProtein: true,
    },
    healthBenefits: ["Good protein source", "Steamed is healthier than fried"],
    createdBy: "system",
    rating: 4.9,
    reviews: 1234,
  },
  {
    id: "sprout-salad",
    name: "Protein Sprout Salad",
    description: "Crunchy, nutritious sprouted legume salad - perfect protein-rich snack for fitness",
    image: "🥗",
    cuisine: "healthy",
    category: "snack",
    difficulty: "easy",
    prepTime: 15,
    cookTime: 0,
    servings: 2,
    calories: 150,
    protein: 12,
    carbs: 20,
    fat: 3,
    ingredients: [
      { name: "Mixed sprouts (moong, chana)", amount: "2 cups", calories: 200, protein: 18 },
      { name: "Cucumber (diced)", amount: "1/2 cup", calories: 8 },
      { name: "Tomato (diced)", amount: "1 medium", calories: 15 },
      { name: "Onion (finely chopped)", amount: "1/4 cup", calories: 15 },
      { name: "Green chili (chopped)", amount: "1" },
      { name: "Coriander leaves", amount: "2 tbsp" },
      { name: "Lemon juice", amount: "2 tbsp" },
      { name: "Chaat masala", amount: "1/2 tsp" },
      { name: "Roasted cumin powder", amount: "1/4 tsp" },
      { name: "Salt", amount: "to taste" },
    ],
    instructions: [
      "Rinse sprouts and drain well",
      "Lightly steam or blanch sprouts if preferred (optional)",
      "In a bowl, combine all chopped vegetables with sprouts",
      "Add lemon juice, chaat masala, cumin, and salt",
      "Toss well to combine",
      "Garnish with coriander leaves",
      "Serve immediately for best crunch",
    ],
    tips: [
      "Make your own sprouts for freshness",
      "Add pomegranate seeds for extra nutrition",
      "Can add boiled chickpeas for more protein",
    ],
    tags: ["high-protein", "raw", "weight-loss", "vegan"],
    dietaryInfo: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      dairyFree: true,
      lowCarb: false,
      highProtein: true,
    },
    healthBenefits: ["Enzyme-rich", "High fiber", "Excellent protein source"],
    createdBy: "system",
    rating: 4.4,
    reviews: 189,
  },
  // DRINKS
  {
    id: "protein-lassi",
    name: "Protein Lassi",
    description: "Traditional yogurt drink boosted with protein - perfect post-workout refreshment",
    image: "🥛",
    cuisine: "indian",
    category: "drink",
    difficulty: "easy",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    calories: 200,
    protein: 20,
    carbs: 18,
    fat: 5,
    ingredients: [
      { name: "Greek yogurt", amount: "1 cup", calories: 130, protein: 18 },
      { name: "Milk (cold)", amount: "1/2 cup", calories: 60, protein: 4 },
      { name: "Honey", amount: "1 tbsp", calories: 60 },
      { name: "Cardamom powder", amount: "1/4 tsp" },
      { name: "Ice cubes", amount: "4-5" },
      { name: "Rose water (optional)", amount: "few drops" },
    ],
    instructions: [
      "Add yogurt and milk to a blender",
      "Add honey, cardamom, and ice cubes",
      "Blend until smooth and frothy",
      "Add rose water if using",
      "Pour into a glass and serve immediately",
      "Garnish with crushed pistachios if desired",
    ],
    tips: [
      "Use hung curd for thicker lassi",
      "Adjust sweetness to taste",
      "Add protein powder for extra boost",
    ],
    tags: ["protein-rich", "probiotic", "refreshing", "post-workout"],
    dietaryInfo: {
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      dairyFree: false,
      lowCarb: false,
      highProtein: true,
    },
    healthBenefits: ["Probiotics for gut health", "High protein", "Cooling effect"],
    createdBy: "system",
    rating: 4.5,
    reviews: 278,
  },
  // HEALTHY OPTIONS
  {
    id: "grilled-fish",
    name: "Masala Grilled Fish",
    nameNepali: "माछाको तन्दुरी",
    description: "Spice-marinated fish grilled to perfection - lean protein for weight management",
    image: "🐟",
    cuisine: "indian",
    category: "dinner",
    difficulty: "medium",
    prepTime: 30,
    cookTime: 15,
    servings: 2,
    calories: 220,
    protein: 32,
    carbs: 5,
    fat: 8,
    ingredients: [
      { name: "Fish fillets (rohu/basa)", amount: "400g", calories: 400, protein: 60 },
      { name: "Thick yogurt", amount: "1/4 cup", calories: 30, protein: 3 },
      { name: "Ginger-garlic paste", amount: "1 tbsp" },
      { name: "Kashmiri red chili", amount: "1 tbsp" },
      { name: "Turmeric", amount: "1/2 tsp" },
      { name: "Garam masala", amount: "1/2 tsp" },
      { name: "Mustard oil", amount: "1 tbsp" },
      { name: "Lemon juice", amount: "2 tbsp" },
      { name: "Salt", amount: "to taste" },
    ],
    instructions: [
      "Clean fish and pat dry, make shallow cuts",
      "Mix yogurt with all spices and mustard oil",
      "Apply marinade generously on fish, inside cuts too",
      "Marinate for minimum 1 hour",
      "Heat grill or oven to high (220°C)",
      "Grill fish for 6-7 minutes each side",
      "Squeeze lemon juice and serve hot",
    ],
    tips: [
      "Use firm fish that won't break apart",
      "Baste with butter while grilling",
      "Don't overcook or fish becomes dry",
    ],
    tags: ["high-protein", "low-carb", "omega-3", "weight-loss"],
    dietaryInfo: {
      vegetarian: false,
      vegan: false,
      glutenFree: true,
      dairyFree: false,
      lowCarb: true,
      highProtein: true,
    },
    healthBenefits: ["Omega-3 fatty acids", "Lean protein", "Good for heart"],
    createdBy: "system",
    rating: 4.6,
    reviews: 234,
  },
  {
    id: "moong-dal-khichdi",
    name: "Moong Dal Khichdi",
    description: "Light and nutritious one-pot meal - perfect for digestive health and weight management",
    image: "🍚",
    cuisine: "indian",
    category: "lunch",
    difficulty: "easy",
    prepTime: 10,
    cookTime: 25,
    servings: 2,
    calories: 280,
    protein: 12,
    carbs: 48,
    fat: 5,
    ingredients: [
      { name: "Rice", amount: "1/2 cup", calories: 100, protein: 2 },
      { name: "Yellow moong dal", amount: "1/2 cup", calories: 170, protein: 12 },
      { name: "Ghee", amount: "1 tbsp", calories: 112 },
      { name: "Cumin seeds", amount: "1 tsp" },
      { name: "Turmeric", amount: "1/2 tsp" },
      { name: "Asafoetida", amount: "a pinch" },
      { name: "Ginger (grated)", amount: "1 tsp" },
      { name: "Green chili", amount: "1" },
      { name: "Salt", amount: "to taste" },
      { name: "Water", amount: "4 cups" },
    ],
    instructions: [
      "Wash rice and dal together until water runs clear",
      "Soak for 15 minutes if time permits",
      "Heat ghee in a pressure cooker, add cumin seeds",
      "Add asafoetida, ginger, and green chili",
      "Add rice-dal mixture and sauté for 2 minutes",
      "Add turmeric, salt, and water",
      "Pressure cook for 3-4 whistles",
      "Serve hot with ghee on top and pickle on side",
    ],
    tips: [
      "Adjust water for desired consistency",
      "Add vegetables for more nutrition",
      "Perfect sick day or detox meal",
    ],
    tags: ["comfort-food", "easy-to-digest", "ayurvedic", "one-pot"],
    dietaryInfo: {
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      dairyFree: false,
      lowCarb: false,
      highProtein: false,
    },
    healthBenefits: ["Easy to digest", "Complete protein", "Gut-friendly"],
    createdBy: "system",
    rating: 4.7,
    reviews: 567,
  },
];

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      savedRecipes: [],
      recentlyViewed: [],

      saveRecipe: (recipeId) => {
        set((state) => ({
          savedRecipes: state.savedRecipes.includes(recipeId)
            ? state.savedRecipes
            : [...state.savedRecipes, recipeId],
        }));
      },

      unsaveRecipe: (recipeId) => {
        set((state) => ({
          savedRecipes: state.savedRecipes.filter((id) => id !== recipeId),
        }));
      },

      addToRecentlyViewed: (recipeId) => {
        set((state) => {
          const filtered = state.recentlyViewed.filter((id) => id !== recipeId);
          return {
            recentlyViewed: [recipeId, ...filtered].slice(0, 10),
          };
        });
      },

      isSaved: (recipeId) => {
        return get().savedRecipes.includes(recipeId);
      },
    }),
    {
      name: "nepfit-recipe-storage",
    }
  )
);

// Helper functions
export const getRecipeById = (id: string): Recipe | undefined => {
  return systemRecipes.find((r) => r.id === id);
};

export const getRecipesByCategory = (category: Recipe["category"]): Recipe[] => {
  return systemRecipes.filter((r) => r.category === category);
};

export const getRecipesByCuisine = (cuisine: Recipe["cuisine"]): Recipe[] => {
  return systemRecipes.filter((r) => r.cuisine === cuisine);
};

export const searchRecipes = (query: string): Recipe[] => {
  const lowerQuery = query.toLowerCase();
  return systemRecipes.filter(
    (r) =>
      r.name.toLowerCase().includes(lowerQuery) ||
      r.description.toLowerCase().includes(lowerQuery) ||
      r.tags.some((t) => t.includes(lowerQuery))
  );
};
