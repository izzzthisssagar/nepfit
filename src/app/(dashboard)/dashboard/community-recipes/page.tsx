"use client";

import { useState } from "react";
import { Card, CardHeader, Button, Input } from "@/components/ui";
import { useSocialStore, type CommunityRecipe } from "@/store/socialStore";

// Mock community recipes
const MOCK_RECIPES: CommunityRecipe[] = [
  {
    id: "cr1",
    name: "Healthy Oats Chilla",
    description: "A protein-packed breakfast option that's quick and delicious",
    authorId: "u1",
    authorName: "Priya Sharma",
    ingredients: ["1 cup oats", "1/2 cup curd", "Vegetables (onion, tomato, capsicum)", "Green chili", "Salt to taste"],
    instructions: ["Blend oats into powder", "Mix with curd and water", "Add chopped veggies", "Cook on tawa like dosa"],
    nutrition: { calories: 280, protein: 12, carbs: 38, fat: 8 },
    servings: 2,
    prepTime: 10,
    cookTime: 15,
    tags: ["breakfast", "high-protein", "vegetarian"],
    likes: 245,
    saves: 89,
    comments: 23,
    images: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "cr2",
    name: "Quinoa Khichdi",
    description: "A healthy twist on traditional khichdi using quinoa",
    authorId: "u2",
    authorName: "Rajesh Thapa",
    ingredients: ["1 cup quinoa", "1/2 cup moong dal", "Vegetables", "Ghee", "Spices"],
    instructions: ["Wash quinoa and dal", "Pressure cook with veggies", "Season with ghee and cumin"],
    nutrition: { calories: 320, protein: 14, carbs: 45, fat: 10 },
    servings: 3,
    prepTime: 15,
    cookTime: 20,
    tags: ["lunch", "high-protein", "gluten-free"],
    likes: 189,
    saves: 67,
    comments: 15,
    images: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "cr3",
    name: "Green Smoothie Bowl",
    description: "Refreshing and nutritious smoothie bowl with local fruits",
    authorId: "u3",
    authorName: "Anita Gurung",
    ingredients: ["Spinach", "Banana", "Mango", "Curd", "Honey", "Chia seeds"],
    instructions: ["Blend spinach, banana, and curd", "Pour in bowl", "Top with mango and chia"],
    nutrition: { calories: 220, protein: 8, carbs: 42, fat: 4 },
    servings: 1,
    prepTime: 5,
    cookTime: 0,
    tags: ["breakfast", "vegan-option", "quick"],
    likes: 312,
    saves: 145,
    comments: 34,
    images: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "cr4",
    name: "Lentil Buddha Bowl",
    description: "A balanced meal with lentils, veggies, and tahini dressing",
    authorId: "u4",
    authorName: "Sagar KC",
    ingredients: ["Masoor dal", "Rice", "Roasted vegetables", "Tahini", "Lemon"],
    instructions: ["Cook dal and rice separately", "Roast seasonal veggies", "Assemble in bowl with dressing"],
    nutrition: { calories: 450, protein: 18, carbs: 58, fat: 16 },
    servings: 2,
    prepTime: 20,
    cookTime: 30,
    tags: ["dinner", "high-protein", "meal-prep"],
    likes: 178,
    saves: 92,
    comments: 21,
    images: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "cr5",
    name: "Diabetic-Friendly Roti Wrap",
    description: "Low GI wrap perfect for blood sugar management",
    authorId: "u5",
    authorName: "Maya Rai",
    ingredients: ["Multigrain roti", "Paneer", "Vegetables", "Mint chutney", "Sprouts"],
    instructions: ["Prepare multigrain roti", "Add grilled paneer and veggies", "Roll with chutney"],
    nutrition: { calories: 280, protein: 15, carbs: 28, fat: 12 },
    servings: 1,
    prepTime: 15,
    cookTime: 10,
    tags: ["lunch", "diabetic-friendly", "high-protein"],
    likes: 423,
    saves: 234,
    comments: 45,
    images: [],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

const RECIPE_TAGS = [
  "All", "breakfast", "lunch", "dinner", "snack", "high-protein",
  "vegetarian", "vegan-option", "diabetic-friendly", "quick", "meal-prep"
];

type SortOption = "popular" | "recent" | "most-saved";

export default function CommunityRecipesPage() {
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<CommunityRecipe | null>(null);

  const { likedRecipes, savedRecipes, likeRecipe, unlikeRecipe, saveRecipe, unsaveRecipe } = useSocialStore();

  // Filter and sort recipes
  const filteredRecipes = MOCK_RECIPES
    .filter((recipe) => {
      const matchesTag = selectedTag === "All" || recipe.tags.includes(selectedTag);
      const matchesSearch =
        searchQuery === "" ||
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTag && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.likes - a.likes;
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "most-saved":
          return b.saves - a.saves;
        default:
          return 0;
      }
    });

  const formatDate = (date: Date) => {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Community Recipes</h1>
          <p className="text-neutral-500">Discover and share healthy recipes</p>
        </div>
        <Button onClick={() => setShowSubmitForm(true)}>
          + Share Recipe
        </Button>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search recipes or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-4 py-2 rounded-xl border border-neutral-200 bg-white text-neutral-700"
        >
          <option value="popular">Most Popular</option>
          <option value="recent">Most Recent</option>
          <option value="most-saved">Most Saved</option>
        </select>
      </div>

      {/* Tags Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {RECIPE_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedTag === tag
                ? "bg-primary-500 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {tag === "All" ? "All Recipes" : `#${tag}`}
          </button>
        ))}
      </div>

      {/* Recipe Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredRecipes.map((recipe) => {
          const isLiked = likedRecipes.includes(recipe.id);
          const isSaved = savedRecipes.includes(recipe.id);

          return (
            <Card key={recipe.id} hover onClick={() => setSelectedRecipe(recipe)}>
              {/* Recipe Image Placeholder */}
              <div className="h-40 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-5xl">🍽️</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {recipe.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Title & Author */}
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">{recipe.name}</h3>
              <p className="text-sm text-neutral-500 mb-2">by {recipe.authorName}</p>
              <p className="text-sm text-neutral-600 line-clamp-2 mb-4">{recipe.description}</p>

              {/* Nutrition Quick View */}
              <div className="flex gap-4 text-xs text-neutral-500 mb-4">
                <span>🔥 {recipe.nutrition.calories} cal</span>
                <span>💪 {recipe.nutrition.protein}g protein</span>
                <span>⏱️ {recipe.prepTime + recipe.cookTime} min</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      isLiked ? unlikeRecipe(recipe.id) : likeRecipe(recipe.id);
                    }}
                    className={`flex items-center gap-1 ${isLiked ? "text-red-500" : "text-neutral-500"}`}
                  >
                    {isLiked ? "❤️" : "🤍"} {recipe.likes + (isLiked ? 1 : 0)}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      isSaved ? unsaveRecipe(recipe.id) : saveRecipe(recipe.id);
                    }}
                    className={`flex items-center gap-1 ${isSaved ? "text-primary-500" : "text-neutral-500"}`}
                  >
                    {isSaved ? "🔖" : "📑"} {recipe.saves + (isSaved ? 1 : 0)}
                  </button>
                  <span className="flex items-center gap-1 text-neutral-500">
                    💬 {recipe.comments}
                  </span>
                </div>
                <span className="text-xs text-neutral-400">{formatDate(recipe.createdAt)}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredRecipes.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No recipes found</h3>
          <p className="text-neutral-500">Try adjusting your filters or search</p>
        </Card>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="max-w-2xl w-full my-8 animate-bounce-in" padding="lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">{selectedRecipe.name}</h2>
                <p className="text-neutral-500">by {selectedRecipe.authorName}</p>
              </div>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="p-2 hover:bg-neutral-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <p className="text-neutral-600 mb-6">{selectedRecipe.description}</p>

            {/* Nutrition */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-primary-50 rounded-xl">
                <div className="text-xl font-bold text-primary-700">{selectedRecipe.nutrition.calories}</div>
                <div className="text-xs text-primary-600">Calories</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <div className="text-xl font-bold text-blue-700">{selectedRecipe.nutrition.protein}g</div>
                <div className="text-xs text-blue-600">Protein</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-xl">
                <div className="text-xl font-bold text-orange-700">{selectedRecipe.nutrition.carbs}g</div>
                <div className="text-xs text-orange-600">Carbs</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-xl">
                <div className="text-xl font-bold text-yellow-700">{selectedRecipe.nutrition.fat}g</div>
                <div className="text-xs text-yellow-600">Fat</div>
              </div>
            </div>

            {/* Time & Servings */}
            <div className="flex gap-6 mb-6 text-sm text-neutral-600">
              <span>⏱️ Prep: {selectedRecipe.prepTime} min</span>
              <span>🍳 Cook: {selectedRecipe.cookTime} min</span>
              <span>🍽️ Serves: {selectedRecipe.servings}</span>
            </div>

            {/* Ingredients */}
            <div className="mb-6">
              <h3 className="font-semibold text-neutral-900 mb-3">Ingredients</h3>
              <ul className="space-y-2">
                {selectedRecipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-2 text-neutral-700">
                    <span className="w-2 h-2 bg-primary-500 rounded-full" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="mb-6">
              <h3 className="font-semibold text-neutral-900 mb-3">Instructions</h3>
              <ol className="space-y-3">
                {selectedRecipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-neutral-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant={likedRecipes.includes(selectedRecipe.id) ? "secondary" : "outline"}
                onClick={() =>
                  likedRecipes.includes(selectedRecipe.id)
                    ? unlikeRecipe(selectedRecipe.id)
                    : likeRecipe(selectedRecipe.id)
                }
              >
                {likedRecipes.includes(selectedRecipe.id) ? "❤️ Liked" : "🤍 Like"}
              </Button>
              <Button
                variant={savedRecipes.includes(selectedRecipe.id) ? "primary" : "outline"}
                onClick={() =>
                  savedRecipes.includes(selectedRecipe.id)
                    ? unsaveRecipe(selectedRecipe.id)
                    : saveRecipe(selectedRecipe.id)
                }
              >
                {savedRecipes.includes(selectedRecipe.id) ? "🔖 Saved" : "📑 Save"}
              </Button>
              <Button variant="outline">💬 Comment</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Submit Recipe Modal */}
      {showSubmitForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full animate-bounce-in" padding="lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Share Your Recipe</h2>
              <button
                onClick={() => setShowSubmitForm(false)}
                className="p-2 hover:bg-neutral-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <Input label="Recipe Name" placeholder="e.g., Healthy Oats Chilla" />
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Describe your recipe..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Prep Time (min)" type="number" placeholder="10" />
                <Input label="Cook Time (min)" type="number" placeholder="15" />
              </div>
              <Input label="Servings" type="number" placeholder="2" />

              <p className="text-sm text-neutral-500">
                Add ingredients and instructions after creating the recipe.
              </p>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowSubmitForm(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={() => setShowSubmitForm(false)}>
                  Create Recipe
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
