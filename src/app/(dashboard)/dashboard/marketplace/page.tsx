"use client";

import { useState } from "react";

type ProductType = "recipe" | "meal_plan" | "consultation" | "ebook" | "course";
type ProductCategory = "weight_loss" | "muscle_gain" | "diabetes" | "vegan" | "keto" | "traditional";

interface Product {
  id: string;
  title: string;
  description: string;
  type: ProductType;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  currency: "NPR" | "INR";
  seller: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    rating: number;
  };
  rating: number;
  reviews: number;
  sales: number;
  image: string;
  tags: string[];
  featured?: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const mockProducts: Product[] = [
  {
    id: "1",
    title: "30-Day Weight Loss Meal Plan",
    description: "Complete meal plan with 90 recipes, shopping lists, and calorie tracking. Designed for sustainable weight loss with Nepali ingredients.",
    type: "meal_plan",
    category: "weight_loss",
    price: 1499,
    originalPrice: 2499,
    currency: "NPR",
    seller: {
      id: "s1",
      name: "Dr. Priya Sharma",
      avatar: "PS",
      verified: true,
      rating: 4.9,
    },
    rating: 4.8,
    reviews: 234,
    sales: 1205,
    image: "🥗",
    tags: ["weight loss", "nepali", "beginner friendly"],
    featured: true,
  },
  {
    id: "2",
    title: "Diabetic-Friendly Recipe Collection",
    description: "50+ low-glycemic recipes perfect for managing blood sugar. Includes GI index for each recipe.",
    type: "recipe",
    category: "diabetes",
    price: 999,
    currency: "NPR",
    seller: {
      id: "s2",
      name: "NutriCare Nepal",
      avatar: "NC",
      verified: true,
      rating: 4.7,
    },
    rating: 4.6,
    reviews: 156,
    sales: 890,
    image: "🍲",
    tags: ["diabetes", "low sugar", "healthy"],
  },
  {
    id: "3",
    title: "Muscle Building Nutrition Guide",
    description: "Complete guide to building muscle with vegetarian protein sources. Includes workout meal timing.",
    type: "ebook",
    category: "muscle_gain",
    price: 799,
    originalPrice: 1299,
    currency: "NPR",
    seller: {
      id: "s3",
      name: "FitNepal Pro",
      avatar: "FN",
      verified: true,
      rating: 4.8,
    },
    rating: 4.7,
    reviews: 89,
    sales: 456,
    image: "💪",
    tags: ["muscle", "protein", "vegetarian"],
    featured: true,
  },
  {
    id: "4",
    title: "Traditional Newari Health Foods",
    description: "Authentic Newari recipes with modern nutritional analysis. 40+ recipes from the Kathmandu Valley.",
    type: "recipe",
    category: "traditional",
    price: 599,
    currency: "NPR",
    seller: {
      id: "s4",
      name: "Newari Kitchen",
      avatar: "NK",
      verified: false,
      rating: 4.5,
    },
    rating: 4.4,
    reviews: 67,
    sales: 234,
    image: "🍛",
    tags: ["newari", "traditional", "cultural"],
  },
  {
    id: "5",
    title: "Keto Diet Nepal Edition",
    description: "Low-carb, high-fat recipes adapted for Nepali taste buds. 60+ keto-friendly recipes.",
    type: "meal_plan",
    category: "keto",
    price: 1299,
    currency: "NPR",
    seller: {
      id: "s5",
      name: "Keto Nepal",
      avatar: "KN",
      verified: true,
      rating: 4.6,
    },
    rating: 4.5,
    reviews: 123,
    sales: 567,
    image: "🥑",
    tags: ["keto", "low carb", "fat loss"],
  },
  {
    id: "6",
    title: "1-on-1 Nutrition Consultation (3 Sessions)",
    description: "Personal consultation with certified nutritionist. Includes customized meal plan and follow-up.",
    type: "consultation",
    category: "weight_loss",
    price: 2999,
    originalPrice: 4500,
    currency: "NPR",
    seller: {
      id: "s1",
      name: "Dr. Priya Sharma",
      avatar: "PS",
      verified: true,
      rating: 4.9,
    },
    rating: 5.0,
    reviews: 45,
    sales: 89,
    image: "👩‍⚕️",
    tags: ["consultation", "personal", "expert"],
    featured: true,
  },
  {
    id: "7",
    title: "Vegan Protein Masterclass",
    description: "Online course teaching you how to get complete protein on a vegan diet. 10 video lessons.",
    type: "course",
    category: "vegan",
    price: 1999,
    currency: "NPR",
    seller: {
      id: "s6",
      name: "Plant Power Nepal",
      avatar: "PP",
      verified: true,
      rating: 4.7,
    },
    rating: 4.8,
    reviews: 78,
    sales: 234,
    image: "🌱",
    tags: ["vegan", "protein", "course"],
  },
  {
    id: "8",
    title: "Festival Healthy Eating Guide",
    description: "How to enjoy Dashain, Tihar, and other festivals without gaining weight. Smart substitutes included.",
    type: "ebook",
    category: "traditional",
    price: 499,
    currency: "NPR",
    seller: {
      id: "s2",
      name: "NutriCare Nepal",
      avatar: "NC",
      verified: true,
      rating: 4.7,
    },
    rating: 4.3,
    reviews: 156,
    sales: 890,
    image: "🎉",
    tags: ["festival", "healthy", "tips"],
  },
];

const productTypes: { value: ProductType | "all"; label: string }[] = [
  { value: "all", label: "All Products" },
  { value: "recipe", label: "Recipes" },
  { value: "meal_plan", label: "Meal Plans" },
  { value: "consultation", label: "Consultations" },
  { value: "ebook", label: "E-Books" },
  { value: "course", label: "Courses" },
];

const categories: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "weight_loss", label: "Weight Loss" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "diabetes", label: "Diabetes" },
  { value: "vegan", label: "Vegan" },
  { value: "keto", label: "Keto" },
  { value: "traditional", label: "Traditional" },
];

export default function MarketplacePage() {
  const [selectedType, setSelectedType] = useState<ProductType | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "price_low" | "price_high" | "rating">("popular");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Product["seller"] | null>(null);

  const filteredProducts = mockProducts
    .filter((product) => {
      if (selectedType !== "all" && product.type !== selectedType) return false;
      if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.sales - a.sales;
        case "rating":
          return b.rating - a.rating;
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        default:
          return 0;
      }
    });

  const featuredProducts = mockProducts.filter((p) => p.featured);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getTypeIcon = (type: ProductType) => {
    switch (type) {
      case "recipe":
        return "📖";
      case "meal_plan":
        return "📋";
      case "consultation":
        return "👨‍⚕️";
      case "ebook":
        return "📚";
      case "course":
        return "🎓";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Marketplace</h1>
          <p className="text-neutral-600">
            Discover premium recipes, meal plans, and expert guidance
          </p>
        </div>
        <button
          onClick={() => setShowCart(true)}
          className="relative flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Featured Products */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">⭐ Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{product.image}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{product.title}</h3>
                  <p className="text-sm text-white/80">{product.seller.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold">
                      {product.currency} {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-white/60 line-through">
                        {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as ProductType | "all")}
            className="px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {productTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | "all")}
            className="px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Product Image/Icon */}
            <div className="h-32 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
              <span className="text-5xl">{product.image}</span>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                  {getTypeIcon(product.type)} {product.type.replace("_", " ")}
                </span>
                {product.originalPrice && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              <h3
                onClick={() => setSelectedProduct(product)}
                className="font-semibold text-neutral-900 cursor-pointer hover:text-primary-600 line-clamp-2"
              >
                {product.title}
              </h3>

              {/* Seller */}
              <div
                onClick={() => {
                  setSelectedSeller(product.seller);
                  setShowSellerModal(true);
                }}
                className="flex items-center gap-2 mt-2 cursor-pointer hover:bg-neutral-50 -mx-2 px-2 py-1 rounded-lg"
              >
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-xs font-medium text-primary-700">
                  {product.seller.avatar}
                </div>
                <span className="text-sm text-neutral-600">{product.seller.name}</span>
                {product.seller.verified && (
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              {/* Rating & Sales */}
              <div className="flex items-center gap-3 mt-2 text-sm">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-neutral-700">{product.rating}</span>
                  <span className="text-neutral-400">({product.reviews})</span>
                </div>
                <span className="text-neutral-400">•</span>
                <span className="text-neutral-500">{product.sales} sold</span>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between mt-4">
                <div>
                  <span className="text-lg font-bold text-neutral-900">
                    {product.currency} {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-neutral-400 line-through ml-2">
                      {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl">🔍</span>
          <p className="mt-2 text-neutral-600">No products found matching your criteria</p>
        </div>
      )}

      {/* Become a Seller CTA */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Become a Seller</h3>
            <p className="text-white/90">
              Share your recipes and meal plans with thousands of health enthusiasts
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-colors">
            Start Selling →
          </button>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <span className="text-7xl">{selectedProduct.image}</span>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
                  {getTypeIcon(selectedProduct.type)} {selectedProduct.type.replace("_", " ")}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full">
                    {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-neutral-900">{selectedProduct.title}</h2>

              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-medium text-primary-700">
                    {selectedProduct.seller.avatar}
                  </div>
                  <span className="font-medium">{selectedProduct.seller.name}</span>
                  {selectedProduct.seller.verified && (
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium">{selectedProduct.rating}</span>
                  <span className="text-neutral-400">({selectedProduct.reviews} reviews)</span>
                </div>
              </div>

              <p className="mt-4 text-neutral-600">{selectedProduct.description}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                {selectedProduct.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-neutral-900">
                      {selectedProduct.currency} {selectedProduct.price.toLocaleString()}
                    </span>
                    {selectedProduct.originalPrice && (
                      <span className="text-lg text-neutral-400 line-through ml-2">
                        {selectedProduct.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-neutral-500">{selectedProduct.sales} sold</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-6 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Close
                </button>
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
                <h2 className="text-xl font-bold text-neutral-900">Shopping Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full"
                >
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
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4 p-3 bg-neutral-50 rounded-xl">
                      <span className="text-3xl">{item.product.image}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-neutral-900 truncate">{item.product.title}</h3>
                        <p className="text-sm text-neutral-500">
                          {item.product.currency} {item.product.price.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <>
                  <div className="mt-6 pt-4 border-t border-neutral-200">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>NPR {cartTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors">
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Seller Modal */}
      {showSellerModal && selectedSeller && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl font-bold text-primary-700">
                  {selectedSeller.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-neutral-900">{selectedSeller.name}</h3>
                    {selectedSeller.verified && (
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium">{selectedSeller.rating}</span>
                    <span className="text-neutral-400">seller rating</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <p className="text-2xl font-bold text-neutral-900">
                    {mockProducts.filter((p) => p.seller.id === selectedSeller.id).length}
                  </p>
                  <p className="text-sm text-neutral-500">Products</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <p className="text-2xl font-bold text-neutral-900">
                    {mockProducts
                      .filter((p) => p.seller.id === selectedSeller.id)
                      .reduce((sum, p) => sum + p.sales, 0)}
                  </p>
                  <p className="text-sm text-neutral-500">Sales</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <p className="text-2xl font-bold text-neutral-900">
                    {mockProducts
                      .filter((p) => p.seller.id === selectedSeller.id)
                      .reduce((sum, p) => sum + p.reviews, 0)}
                  </p>
                  <p className="text-sm text-neutral-500">Reviews</p>
                </div>
              </div>

              <button
                onClick={() => setShowSellerModal(false)}
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
