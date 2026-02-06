"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, Button, Input } from "@/components/ui";
import { useUserStore } from "@/store/userStore";

// Recipe data structure
interface Recipe {
  id: string;
  name: string;
  nameNepali?: string;
  description: string;
  image: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  category: "breakfast" | "lunch" | "dinner" | "snack" | "dessert";
  cuisine: "nepali" | "indian" | "fusion";
  tags: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  ingredients: {
    name: string;
    amount: string;
    unit: string;
    optional?: boolean;
  }[];
  instructions: string[];
  tips?: string[];
  healthBenefits?: string[];
  suitableFor: string[]; // dietary tags
}

// Sample recipes database
const recipes: Recipe[] = [
  {
    id: "dal-bhat-tarkari",
    name: "Dal Bhat Tarkari",
    nameNepali: "दाल भात तरकारी",
    description: "Traditional Nepali complete meal with lentil soup, steamed rice, and seasonal vegetables. A perfectly balanced meal.",
    image: "🍛",
    prepTime: 20,
    cookTime: 40,
    servings: 4,
    difficulty: "medium",
    category: "lunch",
    cuisine: "nepali",
    tags: ["traditional", "complete meal", "vegetarian", "high-protein"],
    nutrition: {
      calories: 450,
      protein: 18,
      carbs: 72,
      fat: 8,
      fiber: 12,
    },
    ingredients: [
      { name: "Basmati Rice", amount: "2", unit: "cups" },
      { name: "Yellow Lentils (Moong Dal)", amount: "1", unit: "cup" },
      { name: "Mixed Vegetables", amount: "2", unit: "cups" },
      { name: "Turmeric Powder", amount: "1", unit: "tsp" },
      { name: "Cumin Seeds", amount: "1", unit: "tsp" },
      { name: "Garlic", amount: "4", unit: "cloves" },
      { name: "Ginger", amount: "1", unit: "inch" },
      { name: "Ghee", amount: "2", unit: "tbsp" },
      { name: "Salt", amount: "to taste", unit: "" },
    ],
    instructions: [
      "Wash and soak rice for 30 minutes. Cook with 4 cups water until fluffy.",
      "Wash lentils and pressure cook with turmeric, salt, and 3 cups water for 3 whistles.",
      "For tadka, heat ghee, add cumin seeds, minced garlic, and ginger. Pour over dal.",
      "For tarkari, stir-fry vegetables with spices until tender-crisp.",
      "Serve dal and tarkari with hot rice. Add pickle (achar) on the side.",
    ],
    tips: [
      "Use ghee for authentic flavor",
      "Add a squeeze of lemon to dal before serving",
      "Include leafy greens for extra nutrition",
    ],
    healthBenefits: [
      "Complete protein from rice and dal combination",
      "High in fiber from vegetables and lentils",
      "Rich in essential vitamins and minerals",
    ],
    suitableFor: ["vegetarian", "gluten-free", "diabetic-friendly"],
  },
  {
    id: "momo",
    name: "Steamed Momos",
    nameNepali: "मोमो",
    description: "Healthy steamed dumplings with a protein-rich chicken and vegetable filling. A Nepali street food favorite.",
    image: "🥟",
    prepTime: 45,
    cookTime: 20,
    servings: 4,
    difficulty: "hard",
    category: "snack",
    cuisine: "nepali",
    tags: ["steamed", "protein-rich", "street food"],
    nutrition: {
      calories: 280,
      protein: 22,
      carbs: 28,
      fat: 9,
      fiber: 3,
    },
    ingredients: [
      { name: "All-purpose Flour", amount: "2", unit: "cups" },
      { name: "Chicken Mince", amount: "500", unit: "g" },
      { name: "Onion (finely chopped)", amount: "1", unit: "large" },
      { name: "Cabbage (finely chopped)", amount: "1", unit: "cup" },
      { name: "Ginger-Garlic Paste", amount: "1", unit: "tbsp" },
      { name: "Soy Sauce", amount: "1", unit: "tbsp" },
      { name: "Coriander Leaves", amount: "1/4", unit: "cup" },
      { name: "Black Pepper", amount: "1/2", unit: "tsp" },
      { name: "Salt", amount: "to taste", unit: "" },
    ],
    instructions: [
      "Make dough: Mix flour with water, knead until smooth. Rest for 30 min.",
      "Mix chicken with onion, cabbage, ginger-garlic, soy sauce, and spices.",
      "Roll small circles of dough, place filling, and pleat to seal.",
      "Steam in a momo steamer for 15-20 minutes until cooked through.",
      "Serve hot with tomato achar and sesame chutney.",
    ],
    tips: [
      "Don't overfill - it makes pleating difficult",
      "Keep dough covered to prevent drying",
      "Steam on high heat for best results",
    ],
    healthBenefits: [
      "Steaming retains nutrients better than frying",
      "High protein content from chicken",
      "Vegetables add fiber and vitamins",
    ],
    suitableFor: ["high-protein", "meal-prep"],
  },
  {
    id: "chana-masala",
    name: "Chana Masala",
    nameNepali: "चना मसाला",
    description: "Protein-packed chickpea curry with aromatic spices. Perfect for vegetarians and vegans.",
    image: "🥘",
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: "easy",
    category: "lunch",
    cuisine: "indian",
    tags: ["vegan", "protein-rich", "high-fiber"],
    nutrition: {
      calories: 320,
      protein: 15,
      carbs: 45,
      fat: 10,
      fiber: 14,
    },
    ingredients: [
      { name: "Chickpeas (soaked overnight)", amount: "2", unit: "cups" },
      { name: "Onion (diced)", amount: "2", unit: "medium" },
      { name: "Tomatoes (pureed)", amount: "3", unit: "medium" },
      { name: "Garam Masala", amount: "2", unit: "tsp" },
      { name: "Cumin Powder", amount: "1", unit: "tsp" },
      { name: "Coriander Powder", amount: "1", unit: "tsp" },
      { name: "Red Chili Powder", amount: "1/2", unit: "tsp" },
      { name: "Oil", amount: "3", unit: "tbsp" },
      { name: "Fresh Coriander", amount: "for garnish", unit: "" },
    ],
    instructions: [
      "Pressure cook soaked chickpeas until soft (about 20 minutes).",
      "Sauté onions until golden. Add all spices and cook for 1 minute.",
      "Add tomato puree and cook until oil separates.",
      "Add cooked chickpeas with some cooking liquid. Simmer for 15 min.",
      "Garnish with fresh coriander. Serve with roti or rice.",
    ],
    tips: [
      "Add amchur (dry mango powder) for tangy flavor",
      "Mash some chickpeas for thicker gravy",
      "Use canned chickpeas for quick preparation",
    ],
    healthBenefits: [
      "Excellent plant-based protein source",
      "Very high in dietary fiber",
      "Rich in iron and folate",
    ],
    suitableFor: ["vegan", "vegetarian", "gluten-free", "diabetic-friendly"],
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    nameNepali: "पनीर टिक्का",
    description: "Grilled cottage cheese marinated in yogurt and spices. High protein, low carb option.",
    image: "🧀",
    prepTime: 30,
    cookTime: 15,
    servings: 4,
    difficulty: "easy",
    category: "snack",
    cuisine: "indian",
    tags: ["vegetarian", "high-protein", "low-carb", "grilled"],
    nutrition: {
      calories: 250,
      protein: 18,
      carbs: 8,
      fat: 17,
      fiber: 2,
    },
    ingredients: [
      { name: "Paneer", amount: "400", unit: "g" },
      { name: "Thick Yogurt", amount: "1", unit: "cup" },
      { name: "Bell Peppers", amount: "2", unit: "medium" },
      { name: "Onion", amount: "1", unit: "large" },
      { name: "Tandoori Masala", amount: "2", unit: "tbsp" },
      { name: "Lemon Juice", amount: "2", unit: "tbsp" },
      { name: "Ginger-Garlic Paste", amount: "1", unit: "tbsp" },
      { name: "Oil", amount: "2", unit: "tbsp" },
      { name: "Salt", amount: "to taste", unit: "" },
    ],
    instructions: [
      "Cut paneer and vegetables into 1-inch cubes.",
      "Mix yogurt with tandoori masala, lemon juice, ginger-garlic, oil, and salt.",
      "Marinate paneer and veggies for at least 30 minutes (or overnight).",
      "Thread onto skewers. Grill or bake at 200°C for 12-15 minutes.",
      "Serve with mint chutney and lemon wedges.",
    ],
    tips: [
      "Don't squeeze paneer too much, it should stay soft",
      "Char slightly for smoky flavor",
      "Works great in air fryer at 180°C for 10 minutes",
    ],
    healthBenefits: [
      "Excellent source of protein and calcium",
      "Low in carbohydrates",
      "Bell peppers add vitamin C",
    ],
    suitableFor: ["vegetarian", "keto-friendly", "low-carb"],
  },
  {
    id: "masala-oats",
    name: "Masala Oats",
    description: "Savory Indian-style oatmeal with vegetables and spices. Quick, healthy breakfast option.",
    image: "🥣",
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: "easy",
    category: "breakfast",
    cuisine: "indian",
    tags: ["quick", "healthy", "high-fiber", "weight-loss"],
    nutrition: {
      calories: 220,
      protein: 8,
      carbs: 35,
      fat: 6,
      fiber: 6,
    },
    ingredients: [
      { name: "Rolled Oats", amount: "1", unit: "cup" },
      { name: "Mixed Vegetables (frozen OK)", amount: "1/2", unit: "cup" },
      { name: "Onion (chopped)", amount: "1", unit: "small" },
      { name: "Green Chili (optional)", amount: "1", unit: "" },
      { name: "Cumin Seeds", amount: "1/2", unit: "tsp" },
      { name: "Turmeric", amount: "1/4", unit: "tsp" },
      { name: "Oil", amount: "1", unit: "tsp" },
      { name: "Salt", amount: "to taste", unit: "" },
    ],
    instructions: [
      "Heat oil in a pan. Add cumin seeds and let them splutter.",
      "Add onion and green chili. Sauté until translucent.",
      "Add vegetables and turmeric. Cook for 2 minutes.",
      "Add oats and 2 cups water. Stir and simmer for 3-4 minutes.",
      "Season with salt. Serve hot with lemon juice.",
    ],
    tips: [
      "Use steel-cut oats for more texture",
      "Add peanuts for extra protein",
      "Top with fresh coriander",
    ],
    healthBenefits: [
      "High in beta-glucan for heart health",
      "Keeps you full longer",
      "Low glycemic index",
    ],
    suitableFor: ["vegetarian", "vegan", "diabetic-friendly", "weight-loss"],
  },
  {
    id: "egg-curry",
    name: "Egg Curry",
    nameNepali: "अण्डा करी",
    description: "Protein-rich egg curry with aromatic gravy. Simple, nutritious, and satisfying.",
    image: "🍳",
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    difficulty: "easy",
    category: "dinner",
    cuisine: "nepali",
    tags: ["protein-rich", "quick", "budget-friendly"],
    nutrition: {
      calories: 280,
      protein: 16,
      carbs: 12,
      fat: 19,
      fiber: 3,
    },
    ingredients: [
      { name: "Eggs", amount: "8", unit: "" },
      { name: "Onion (sliced)", amount: "2", unit: "medium" },
      { name: "Tomatoes (pureed)", amount: "2", unit: "medium" },
      { name: "Ginger-Garlic Paste", amount: "1", unit: "tbsp" },
      { name: "Turmeric", amount: "1/2", unit: "tsp" },
      { name: "Red Chili Powder", amount: "1", unit: "tsp" },
      { name: "Garam Masala", amount: "1/2", unit: "tsp" },
      { name: "Oil", amount: "3", unit: "tbsp" },
      { name: "Fresh Coriander", amount: "for garnish", unit: "" },
    ],
    instructions: [
      "Boil eggs, peel, and make small slits for flavor absorption.",
      "Fry eggs lightly until golden. Set aside.",
      "Sauté onions until golden. Add ginger-garlic and spices.",
      "Add tomato puree and cook until oil separates (5-7 min).",
      "Add eggs and 1 cup water. Simmer for 10 minutes. Garnish and serve.",
    ],
    tips: [
      "Score the eggs for better flavor absorption",
      "Add coconut milk for richer gravy",
      "Works great with rice or roti",
    ],
    healthBenefits: [
      "Complete protein from eggs",
      "Rich in B vitamins",
      "Good source of choline for brain health",
    ],
    suitableFor: ["gluten-free", "high-protein", "keto-friendly"],
  },
  {
    id: "green-smoothie",
    name: "Nepali Green Smoothie",
    description: "Nutrient-dense smoothie with local greens, banana, and yogurt. Perfect post-workout drink.",
    image: "🥤",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    difficulty: "easy",
    category: "breakfast",
    cuisine: "fusion",
    tags: ["quick", "healthy", "post-workout", "vegetarian"],
    nutrition: {
      calories: 180,
      protein: 12,
      carbs: 28,
      fat: 3,
      fiber: 4,
    },
    ingredients: [
      { name: "Spinach (Palungo)", amount: "1", unit: "cup" },
      { name: "Banana", amount: "1", unit: "medium" },
      { name: "Greek Yogurt", amount: "1/2", unit: "cup" },
      { name: "Honey", amount: "1", unit: "tbsp", optional: true },
      { name: "Chia Seeds", amount: "1", unit: "tbsp", optional: true },
      { name: "Water or Milk", amount: "1/2", unit: "cup" },
    ],
    instructions: [
      "Add all ingredients to a blender.",
      "Blend until smooth, about 1 minute.",
      "Add more liquid if too thick.",
      "Pour into a glass and drink immediately.",
    ],
    tips: [
      "Freeze banana for thicker smoothie",
      "Add protein powder for post-workout boost",
      "Use coconut milk for vegan version",
    ],
    healthBenefits: [
      "High in iron from spinach",
      "Potassium from banana for muscle recovery",
      "Probiotics from yogurt",
    ],
    suitableFor: ["vegetarian", "quick", "post-workout"],
  },
  {
    id: "chicken-thukpa",
    name: "Chicken Thukpa",
    nameNepali: "थुक्पा",
    description: "Hearty Himalayan noodle soup with chicken and vegetables. Comforting and nutritious.",
    image: "🍜",
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: "medium",
    category: "dinner",
    cuisine: "nepali",
    tags: ["soup", "comfort-food", "protein-rich"],
    nutrition: {
      calories: 380,
      protein: 28,
      carbs: 42,
      fat: 11,
      fiber: 4,
    },
    ingredients: [
      { name: "Chicken (bone-in)", amount: "500", unit: "g" },
      { name: "Noodles", amount: "200", unit: "g" },
      { name: "Onion", amount: "1", unit: "large" },
      { name: "Carrot", amount: "1", unit: "medium" },
      { name: "Cabbage", amount: "1", unit: "cup" },
      { name: "Ginger", amount: "2", unit: "inch" },
      { name: "Garlic", amount: "6", unit: "cloves" },
      { name: "Soy Sauce", amount: "2", unit: "tbsp" },
      { name: "Green Onions", amount: "for garnish", unit: "" },
    ],
    instructions: [
      "Boil chicken with ginger and garlic to make stock (30 min). Shred chicken.",
      "Strain stock. Sauté onions, add carrots and cabbage.",
      "Add stock and bring to boil. Season with soy sauce and salt.",
      "Cook noodles separately, drain, and add to bowls.",
      "Pour hot soup over noodles, top with chicken and green onions.",
    ],
    tips: [
      "Use bone-in chicken for richer stock",
      "Add chili oil for extra heat",
      "Top with a boiled egg for more protein",
    ],
    healthBenefits: [
      "Warming and immune-boosting",
      "High protein for muscle repair",
      "Hydrating broth",
    ],
    suitableFor: ["high-protein", "comfort-food"],
  },
];

// Filter categories
const categories = [
  { id: "all", label: "All", icon: "🍽️" },
  { id: "breakfast", label: "Breakfast", icon: "☀️" },
  { id: "lunch", label: "Lunch", icon: "🌞" },
  { id: "dinner", label: "Dinner", icon: "🌙" },
  { id: "snack", label: "Snacks", icon: "🍿" },
];

const dietaryFilters = [
  { id: "all", label: "All" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "high-protein", label: "High Protein" },
  { id: "low-carb", label: "Low Carb" },
  { id: "diabetic-friendly", label: "Diabetic Friendly" },
  { id: "gluten-free", label: "Gluten Free" },
];

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDiet, setSelectedDiet] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const { targets } = useUserStore();

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          recipe.name.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query) ||
          recipe.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory !== "all" && recipe.category !== selectedCategory) {
        return false;
      }

      // Dietary filter
      if (selectedDiet !== "all" && !recipe.suitableFor.includes(selectedDiet)) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedDiet]);

  // Get recommended recipes based on user goals
  const recommendedRecipes = useMemo(() => {
    if (!targets) return recipes.slice(0, 3);

    // Simple recommendation logic based on macro goals
    const proteinGoal = targets.macros?.protein || 90;
    const carbsGoal = targets.macros?.carbs || 200;

    return recipes
      .filter((r) => {
        // Recommend high protein if protein goal is high
        if (proteinGoal > 100 && r.nutrition.protein < 15) return false;
        // Recommend low carb if carbs goal is low
        if (carbsGoal < 150 && r.nutrition.carbs > 40) return false;
        return true;
      })
      .slice(0, 3);
  }, [targets]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  // Recipe Detail View
  if (selectedRecipe) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-0">
        {/* Back Button */}
        <button
          onClick={() => setSelectedRecipe(null)}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Recipes
        </button>

        {/* Recipe Header */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="text-6xl">{selectedRecipe.image}</div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-neutral-900">{selectedRecipe.name}</h1>
              {selectedRecipe.nameNepali && (
                <p className="text-lg text-neutral-500">{selectedRecipe.nameNepali}</p>
              )}
              <p className="text-neutral-600 mt-2">{selectedRecipe.description}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedRecipe.difficulty)}`}>
                  {selectedRecipe.difficulty.charAt(0).toUpperCase() + selectedRecipe.difficulty.slice(1)}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {selectedRecipe.cuisine.charAt(0).toUpperCase() + selectedRecipe.cuisine.slice(1)}
                </span>
                {selectedRecipe.suitableFor.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Time & Servings */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-neutral-900">{selectedRecipe.prepTime}m</p>
              <p className="text-sm text-neutral-500">Prep Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-neutral-900">{selectedRecipe.cookTime}m</p>
              <p className="text-sm text-neutral-500">Cook Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-neutral-900">{selectedRecipe.servings}</p>
              <p className="text-sm text-neutral-500">Servings</p>
            </div>
          </div>
        </Card>

        {/* Nutrition Per Serving */}
        <Card>
          <CardHeader title="Nutrition Per Serving" />
          <div className="grid grid-cols-5 gap-4 text-center">
            <div className="bg-primary-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-primary-600">{selectedRecipe.nutrition.calories}</p>
              <p className="text-xs text-primary-500">Calories</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-blue-600">{selectedRecipe.nutrition.protein}g</p>
              <p className="text-xs text-blue-500">Protein</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-orange-600">{selectedRecipe.nutrition.carbs}g</p>
              <p className="text-xs text-orange-500">Carbs</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-yellow-600">{selectedRecipe.nutrition.fat}g</p>
              <p className="text-xs text-yellow-500">Fat</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-green-600">{selectedRecipe.nutrition.fiber}g</p>
              <p className="text-xs text-green-500">Fiber</p>
            </div>
          </div>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader title="Ingredients" subtitle={`For ${selectedRecipe.servings} servings`} />
          <ul className="space-y-2">
            {selectedRecipe.ingredients.map((ing, idx) => (
              <li key={idx} className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-lg">
                <input type="checkbox" className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                <span className={`flex-1 ${ing.optional ? "text-neutral-500" : "text-neutral-900"}`}>
                  <span className="font-medium">{ing.amount} {ing.unit}</span> {ing.name}
                  {ing.optional && <span className="text-xs text-neutral-400 ml-2">(optional)</span>}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader title="Instructions" />
          <ol className="space-y-4">
            {selectedRecipe.instructions.map((step, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {idx + 1}
                </span>
                <p className="text-neutral-700 pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </Card>

        {/* Tips */}
        {selectedRecipe.tips && selectedRecipe.tips.length > 0 && (
          <Card className="bg-yellow-50 border-yellow-100">
            <CardHeader title="💡 Pro Tips" />
            <ul className="space-y-2">
              {selectedRecipe.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-neutral-700">
                  <span className="text-yellow-500">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Health Benefits */}
        {selectedRecipe.healthBenefits && selectedRecipe.healthBenefits.length > 0 && (
          <Card className="bg-green-50 border-green-100">
            <CardHeader title="🌿 Health Benefits" />
            <ul className="space-y-2">
              {selectedRecipe.healthBenefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2 text-neutral-700">
                  <span className="text-green-500">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    );
  }

  // Recipe List View
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Recipe Suggestions</h1>
        <p className="text-neutral-500">Healthy Nepali & Indian recipes tailored for you</p>
      </div>

      {/* Search */}
      <Card>
        <Input
          placeholder="Search recipes... (dal, momo, protein-rich...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
      </Card>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? "bg-primary-500 text-white"
                : "bg-white border border-neutral-200 hover:border-primary-300"
            }`}
          >
            <span>{cat.icon}</span>
            <span className="font-medium text-sm">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Dietary Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {dietaryFilters.map((diet) => (
          <button
            key={diet.id}
            onClick={() => setSelectedDiet(diet.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedDiet === diet.id
                ? "bg-green-500 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {diet.label}
          </button>
        ))}
      </div>

      {/* Recommended Section */}
      {!searchQuery && selectedCategory === "all" && selectedDiet === "all" && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
          <CardHeader title="🎯 Recommended For You" subtitle="Based on your nutrition goals" />
          <div className="grid gap-4 md:grid-cols-3">
            {recommendedRecipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="text-left p-4 bg-white rounded-xl hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-2">{recipe.image}</div>
                <h3 className="font-semibold text-neutral-900 text-sm">{recipe.name}</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  {recipe.nutrition.calories} cal • {recipe.nutrition.protein}g protein
                </p>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Recipe Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredRecipes.map((recipe) => (
          <Card
            key={recipe.id}
            className="hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setSelectedRecipe(recipe)}
          >
            <div className="flex gap-4">
              <div className="text-5xl">{recipe.image}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-900">{recipe.name}</h3>
                {recipe.nameNepali && (
                  <p className="text-sm text-neutral-500">{recipe.nameNepali}</p>
                )}
                <p className="text-xs text-neutral-600 mt-1 line-clamp-2">{recipe.description}</p>

                <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                  <span>⏱️ {recipe.prepTime + recipe.cookTime}m</span>
                  <span>🍽️ {recipe.servings} servings</span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {recipe.nutrition.calories} cal | P: {recipe.nutrition.protein}g
                  </span>
                </div>
              </div>
              <svg className="w-5 h-5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">🍳</p>
          <p className="text-neutral-600 font-medium">No recipes found</p>
          <p className="text-neutral-500 text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
