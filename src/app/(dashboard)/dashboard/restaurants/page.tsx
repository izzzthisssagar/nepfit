"use client";

import { useState } from "react";

type CuisineType = "nepali" | "indian" | "chinese" | "continental" | "fast_food" | "cafe";
type DietFilter = "all" | "vegetarian" | "vegan" | "keto" | "low_carb" | "diabetic_friendly";
type PriceRange = "budget" | "moderate" | "premium";

interface Restaurant {
  id: string;
  name: string;
  cuisine: CuisineType[];
  rating: number;
  reviews: number;
  priceRange: PriceRange;
  distance: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  address: string;
  healthScore: number;
  dietOptions: DietFilter[];
  isOpen: boolean;
  featured?: boolean;
  offers?: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isHealthy: boolean;
  allergens: string[];
  image: string;
}

interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Green Kitchen Nepal",
    cuisine: ["nepali", "indian"],
    rating: 4.8,
    reviews: 234,
    priceRange: "moderate",
    distance: 1.2,
    deliveryTime: "25-35 min",
    deliveryFee: 50,
    image: "🥗",
    address: "Thamel, Kathmandu",
    healthScore: 92,
    dietOptions: ["vegetarian", "vegan", "diabetic_friendly"],
    isOpen: true,
    featured: true,
    offers: "20% off on first order",
  },
  {
    id: "2",
    name: "Protein House",
    cuisine: ["continental", "indian"],
    rating: 4.6,
    reviews: 189,
    priceRange: "premium",
    distance: 2.5,
    deliveryTime: "30-40 min",
    deliveryFee: 80,
    image: "💪",
    address: "Lazimpat, Kathmandu",
    healthScore: 88,
    dietOptions: ["keto", "low_carb"],
    isOpen: true,
    featured: true,
  },
  {
    id: "3",
    name: "Momo Central",
    cuisine: ["nepali", "chinese"],
    rating: 4.5,
    reviews: 456,
    priceRange: "budget",
    distance: 0.8,
    deliveryTime: "20-30 min",
    deliveryFee: 30,
    image: "🥟",
    address: "New Road, Kathmandu",
    healthScore: 75,
    dietOptions: ["vegetarian"],
    isOpen: true,
  },
  {
    id: "4",
    name: "Salad & More",
    cuisine: ["continental", "cafe"],
    rating: 4.7,
    reviews: 167,
    priceRange: "moderate",
    distance: 3.1,
    deliveryTime: "35-45 min",
    deliveryFee: 60,
    image: "🥬",
    address: "Jhamsikhel, Lalitpur",
    healthScore: 95,
    dietOptions: ["vegetarian", "vegan", "keto", "low_carb", "diabetic_friendly"],
    isOpen: true,
    offers: "Free delivery above Rs. 500",
  },
  {
    id: "5",
    name: "Thakali Kitchen",
    cuisine: ["nepali"],
    rating: 4.4,
    reviews: 312,
    priceRange: "budget",
    distance: 1.8,
    deliveryTime: "25-35 min",
    deliveryFee: 40,
    image: "🍛",
    address: "Pulchowk, Lalitpur",
    healthScore: 82,
    dietOptions: ["vegetarian", "diabetic_friendly"],
    isOpen: true,
  },
  {
    id: "6",
    name: "Fit Bites Cafe",
    cuisine: ["cafe", "continental"],
    rating: 4.9,
    reviews: 98,
    priceRange: "premium",
    distance: 4.2,
    deliveryTime: "40-50 min",
    deliveryFee: 100,
    image: "🍵",
    address: "Boudha, Kathmandu",
    healthScore: 96,
    dietOptions: ["vegetarian", "vegan", "keto", "low_carb"],
    isOpen: false,
  },
];

const mockMenuItems: MenuItem[] = [
  {
    id: "m1",
    name: "Grilled Chicken Salad",
    description: "Fresh greens with grilled chicken breast, cherry tomatoes, and light vinaigrette",
    price: 450,
    calories: 320,
    protein: 35,
    carbs: 12,
    fat: 15,
    isVegetarian: false,
    isVegan: false,
    isHealthy: true,
    allergens: [],
    image: "🥗",
  },
  {
    id: "m2",
    name: "Quinoa Buddha Bowl",
    description: "Protein-rich quinoa with roasted vegetables, chickpeas, and tahini dressing",
    price: 380,
    calories: 420,
    protein: 18,
    carbs: 52,
    fat: 16,
    isVegetarian: true,
    isVegan: true,
    isHealthy: true,
    allergens: ["sesame"],
    image: "🥣",
  },
  {
    id: "m3",
    name: "Steamed Chicken Momo",
    description: "Traditional Nepali dumplings with lean chicken filling",
    price: 220,
    calories: 280,
    protein: 22,
    carbs: 32,
    fat: 8,
    isVegetarian: false,
    isVegan: false,
    isHealthy: true,
    allergens: ["gluten"],
    image: "🥟",
  },
  {
    id: "m4",
    name: "Dal Bhat (Lite)",
    description: "Traditional meal with reduced rice portion and extra vegetables",
    price: 280,
    calories: 380,
    protein: 16,
    carbs: 58,
    fat: 10,
    isVegetarian: true,
    isVegan: true,
    isHealthy: true,
    allergens: [],
    image: "🍛",
  },
  {
    id: "m5",
    name: "Protein Smoothie Bowl",
    description: "Blended fruits with protein powder, granola, and fresh berries",
    price: 350,
    calories: 380,
    protein: 28,
    carbs: 45,
    fat: 8,
    isVegetarian: true,
    isVegan: false,
    isHealthy: true,
    allergens: ["dairy", "nuts"],
    image: "🍓",
  },
  {
    id: "m6",
    name: "Keto Chicken Wrap",
    description: "Lettuce wrap with grilled chicken, avocado, and cheese",
    price: 420,
    calories: 350,
    protein: 32,
    carbs: 8,
    fat: 22,
    isVegetarian: false,
    isVegan: false,
    isHealthy: true,
    allergens: ["dairy"],
    image: "🌯",
  },
];

export default function RestaurantsPage() {
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType | "all">("all");
  const [selectedDiet, setSelectedDiet] = useState<DietFilter>("all");
  const [selectedPrice, setSelectedPrice] = useState<PriceRange | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "health_score" | "delivery_time">("rating");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"restaurants" | "orders" | "favorites">("restaurants");

  const filteredRestaurants = mockRestaurants
    .filter((restaurant) => {
      if (selectedCuisine !== "all" && !restaurant.cuisine.includes(selectedCuisine)) return false;
      if (selectedDiet !== "all" && !restaurant.dietOptions.includes(selectedDiet)) return false;
      if (selectedPrice !== "all" && restaurant.priceRange !== selectedPrice) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.address.toLowerCase().includes(query) ||
          restaurant.cuisine.some((c) => c.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "distance":
          return a.distance - b.distance;
        case "health_score":
          return b.healthScore - a.healthScore;
        case "delivery_time":
          return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
        default:
          return 0;
      }
    });

  const addToCart = (menuItem: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((item) =>
          item.menuItem.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setCart((prev) => prev.filter((item) => item.menuItem.id !== menuItemId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const cartCalories = cart.reduce((sum, item) => sum + item.menuItem.calories * item.quantity, 0);

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-orange-600 bg-orange-100";
  };

  const getPriceSymbol = (range: PriceRange) => {
    switch (range) {
      case "budget":
        return "₹";
      case "moderate":
        return "₹₹";
      case "premium":
        return "₹₹₹";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Restaurants & Delivery</h1>
          <p className="text-neutral-600">
            Find healthy meals from restaurants near you
          </p>
        </div>
        <button
          onClick={() => setShowCart(true)}
          className="relative flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Cart ({cart.length})
          {cartCalories > 0 && (
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {cartCalories} kcal
            </span>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200">
        {[
          { id: "restaurants", label: "Restaurants", icon: "🍽️" },
          { id: "orders", label: "My Orders", icon: "📦" },
          { id: "favorites", label: "Favorites", icon: "❤️" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
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

      {activeTab === "restaurants" && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Cuisine Filter */}
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value as CuisineType | "all")}
                className="px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Cuisines</option>
                <option value="nepali">Nepali</option>
                <option value="indian">Indian</option>
                <option value="chinese">Chinese</option>
                <option value="continental">Continental</option>
                <option value="cafe">Cafe</option>
              </select>

              {/* Diet Filter */}
              <select
                value={selectedDiet}
                onChange={(e) => setSelectedDiet(e.target.value as DietFilter)}
                className="px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Diets</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="low_carb">Low Carb</option>
                <option value="diabetic_friendly">Diabetic Friendly</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
              >
                <option value="rating">Top Rated</option>
                <option value="distance">Nearest</option>
                <option value="health_score">Health Score</option>
                <option value="delivery_time">Fastest Delivery</option>
              </select>
            </div>
          </div>

          {/* Featured Restaurants */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">🌟 Featured Healthy Restaurants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockRestaurants
                .filter((r) => r.featured)
                .map((restaurant) => (
                  <div
                    key={restaurant.id}
                    onClick={() => setSelectedRestaurant(restaurant)}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{restaurant.image}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold">{restaurant.name}</h3>
                        <p className="text-sm text-white/80">{restaurant.deliveryTime} • {restaurant.distance} km</p>
                        {restaurant.offers && (
                          <p className="text-xs mt-1 bg-white/20 px-2 py-0.5 rounded-full inline-block">
                            🎁 {restaurant.offers}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`text-sm px-2 py-0.5 rounded-full ${getHealthScoreColor(restaurant.healthScore)}`}>
                          {restaurant.healthScore}% healthy
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Restaurant List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => setSelectedRestaurant(restaurant)}
                className={`bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden cursor-pointer hover:shadow-md transition-all ${
                  !restaurant.isOpen ? "opacity-60" : ""
                }`}
              >
                <div className="h-32 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center relative">
                  <span className="text-5xl">{restaurant.image}</span>
                  {!restaurant.isOpen && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">Closed</span>
                    </div>
                  )}
                  <span className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${getHealthScoreColor(restaurant.healthScore)}`}>
                    {restaurant.healthScore}% healthy
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-neutral-900">{restaurant.name}</h3>
                      <p className="text-sm text-neutral-500">{restaurant.cuisine.join(", ")}</p>
                    </div>
                    <span className="text-neutral-400">{getPriceSymbol(restaurant.priceRange)}</span>
                  </div>

                  <div className="flex items-center gap-3 mt-3 text-sm">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{restaurant.rating}</span>
                      <span className="text-neutral-400">({restaurant.reviews})</span>
                    </div>
                    <span className="text-neutral-300">•</span>
                    <span className="text-neutral-500">{restaurant.distance} km</span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-neutral-500">{restaurant.deliveryTime}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {restaurant.dietOptions.slice(0, 3).map((diet) => (
                      <span key={diet} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {diet.replace("_", " ")}
                      </span>
                    ))}
                  </div>

                  {restaurant.offers && (
                    <p className="mt-3 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                      🎁 {restaurant.offers}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "orders" && (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-neutral-100">
          <span className="text-5xl">📦</span>
          <h3 className="mt-4 text-lg font-semibold text-neutral-900">No orders yet</h3>
          <p className="text-neutral-500">Your order history will appear here</p>
          <button
            onClick={() => setActiveTab("restaurants")}
            className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
          >
            Browse Restaurants
          </button>
        </div>
      )}

      {activeTab === "favorites" && (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-neutral-100">
          <span className="text-5xl">❤️</span>
          <h3 className="mt-4 text-lg font-semibold text-neutral-900">No favorites yet</h3>
          <p className="text-neutral-500">Save your favorite restaurants for quick access</p>
          <button
            onClick={() => setActiveTab("restaurants")}
            className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
          >
            Explore Restaurants
          </button>
        </div>
      )}

      {/* Restaurant Detail Modal */}
      {selectedRestaurant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="h-40 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative">
              <span className="text-7xl">{selectedRestaurant.image}</span>
              <button
                onClick={() => setSelectedRestaurant(null)}
                className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">{selectedRestaurant.name}</h2>
                  <p className="text-neutral-500">{selectedRestaurant.address}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getHealthScoreColor(selectedRestaurant.healthScore)}`}>
                  {selectedRestaurant.healthScore}% healthy
                </span>
              </div>

              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium">{selectedRestaurant.rating}</span>
                  <span className="text-neutral-400">({selectedRestaurant.reviews} reviews)</span>
                </div>
                <span className="text-neutral-300">•</span>
                <span>{selectedRestaurant.deliveryTime}</span>
                <span className="text-neutral-300">•</span>
                <span>Rs. {selectedRestaurant.deliveryFee} delivery</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {selectedRestaurant.dietOptions.map((diet) => (
                  <span key={diet} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    {diet.replace("_", " ")}
                  </span>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-neutral-900 mt-6 mb-4">Menu</h3>
              <div className="space-y-4">
                {mockMenuItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
                    <span className="text-3xl">{item.image}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-neutral-900">{item.name}</h4>
                        {item.isHealthy && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Healthy
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 mt-1">{item.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                        <span>{item.calories} kcal</span>
                        <span>•</span>
                        <span>P: {item.protein}g</span>
                        <span>•</span>
                        <span>C: {item.carbs}g</span>
                        <span>•</span>
                        <span>F: {item.fat}g</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neutral-900">Rs. {item.price}</p>
                      <button
                        onClick={() => addToCart(item)}
                        className="mt-2 px-4 py-1 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-neutral-900">Your Order</h2>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-neutral-100 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl">🛒</span>
                  <p className="mt-2 text-neutral-600">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.menuItem.id} className="flex items-center gap-4 p-3 bg-neutral-50 rounded-xl">
                        <span className="text-2xl">{item.menuItem.image}</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-neutral-900">{item.menuItem.name}</h4>
                          <p className="text-sm text-neutral-500">
                            Rs. {item.menuItem.price} × {item.quantity} = Rs. {item.menuItem.price * item.quantity}
                          </p>
                          <p className="text-xs text-neutral-400">{item.menuItem.calories * item.quantity} kcal</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.menuItem.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <h4 className="font-medium text-green-800">Nutrition Summary</h4>
                    <p className="text-sm text-green-700">Total Calories: {cartCalories} kcal</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>Rs. {cartTotal}</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors">
                    Place Order
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
