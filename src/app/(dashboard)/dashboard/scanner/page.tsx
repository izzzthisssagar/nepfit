"use client";

import { useState, useRef } from "react";

interface ScannedProduct {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  ingredients: string[];
  allergens: string[];
  healthScore: number;
  image: string;
  isVerified: boolean;
  alternatives?: {
    name: string;
    brand: string;
    healthScore: number;
    calories: number;
  }[];
}

interface ScanHistory {
  product: ScannedProduct;
  scannedAt: Date;
  logged: boolean;
}

const mockProducts: Record<string, ScannedProduct> = {
  "8901030865350": {
    id: "1",
    barcode: "8901030865350",
    name: "Wai Wai Instant Noodles",
    brand: "CG Foods",
    servingSize: "75g (1 packet)",
    calories: 340,
    protein: 8,
    carbs: 48,
    fat: 14,
    fiber: 2,
    sugar: 4,
    sodium: 1200,
    ingredients: ["Wheat Flour", "Palm Oil", "Salt", "Spices", "MSG", "Dehydrated Vegetables"],
    allergens: ["Gluten", "Soy"],
    healthScore: 45,
    image: "🍜",
    isVerified: true,
    alternatives: [
      { name: "Brown Rice Noodles", brand: "Organic Nepal", healthScore: 78, calories: 180 },
      { name: "Whole Wheat Noodles", brand: "Healthy Choice", healthScore: 72, calories: 220 },
    ],
  },
  "8901262150040": {
    id: "2",
    barcode: "8901262150040",
    name: "Amul Butter",
    brand: "Amul",
    servingSize: "10g (1 tbsp)",
    calories: 72,
    protein: 0.1,
    carbs: 0,
    fat: 8,
    fiber: 0,
    sugar: 0,
    sodium: 80,
    ingredients: ["Milk Fat", "Salt"],
    allergens: ["Dairy"],
    healthScore: 55,
    image: "🧈",
    isVerified: true,
    alternatives: [
      { name: "Olive Oil Spread", brand: "Bertolli", healthScore: 75, calories: 60 },
      { name: "Avocado Spread", brand: "Natural Foods", healthScore: 82, calories: 50 },
    ],
  },
  "8901719110016": {
    id: "3",
    barcode: "8901719110016",
    name: "Dabur Honey",
    brand: "Dabur",
    servingSize: "20g (1 tbsp)",
    calories: 62,
    protein: 0,
    carbs: 17,
    fat: 0,
    fiber: 0,
    sugar: 16,
    sodium: 1,
    ingredients: ["Pure Honey"],
    allergens: [],
    healthScore: 70,
    image: "🍯",
    isVerified: true,
  },
  "8904004400583": {
    id: "4",
    barcode: "8904004400583",
    name: "Real Fruit Power Mixed Fruit",
    brand: "Dabur",
    servingSize: "200ml",
    calories: 100,
    protein: 0,
    carbs: 24,
    fat: 0,
    fiber: 0,
    sugar: 22,
    sodium: 10,
    ingredients: ["Water", "Fruit Pulp", "Sugar", "Citric Acid", "Natural Flavors"],
    allergens: [],
    healthScore: 42,
    image: "🧃",
    isVerified: true,
    alternatives: [
      { name: "Fresh Orange Juice", brand: "Homemade", healthScore: 85, calories: 45 },
      { name: "Coconut Water", brand: "Tropicana", healthScore: 90, calories: 46 },
    ],
  },
  "5000159484695": {
    id: "5",
    barcode: "5000159484695",
    name: "Quaker Oats",
    brand: "Quaker",
    servingSize: "40g (1/2 cup)",
    calories: 150,
    protein: 5,
    carbs: 27,
    fat: 3,
    fiber: 4,
    sugar: 1,
    sodium: 0,
    ingredients: ["100% Whole Grain Rolled Oats"],
    allergens: ["Gluten"],
    healthScore: 92,
    image: "🥣",
    isVerified: true,
  },
};

export default function ScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);
  const [manualBarcode, setManualBarcode] = useState("");
  const [activeTab, setActiveTab] = useState<"scan" | "history" | "favorites">("scan");
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = (barcode: string) => {
    const product = mockProducts[barcode];
    if (product) {
      setScannedProduct(product);
      setScanHistory((prev) => [
        { product, scannedAt: new Date(), logged: false },
        ...prev,
      ]);
    } else {
      setShowNotFoundModal(true);
    }
    setIsScanning(false);
  };

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const barcodes = Object.keys(mockProducts);
      const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)];
      handleScan(randomBarcode);
    }, 2000);
  };

  const handleManualEntry = () => {
    if (manualBarcode.trim()) {
      handleScan(manualBarcode.trim());
      setManualBarcode("");
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    if (score >= 40) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Barcode Scanner</h1>
        <p className="text-neutral-600">
          Scan packaged foods to get instant nutrition information
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200">
        {[
          { id: "scan", label: "Scan", icon: "📷" },
          { id: "history", label: "History", icon: "📜" },
          { id: "favorites", label: "Favorites", icon: "⭐" },
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

      {activeTab === "scan" && (
        <div className="space-y-6">
          {/* Scanner Area */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <div className="text-center">
              {!isScanning && !scannedProduct ? (
                <>
                  <div className="w-48 h-48 mx-auto bg-neutral-100 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-20 h-20 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-neutral-900 mb-2">Scan Product Barcode</h2>
                  <p className="text-neutral-500 mb-6">
                    Position the barcode within the frame to scan
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={simulateScan}
                      className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                    >
                      📷 Start Scanning
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                    >
                      📁 Upload Barcode Image
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={() => simulateScan()}
                    />
                  </div>
                </>
              ) : isScanning ? (
                <div className="py-12">
                  <div className="w-48 h-48 mx-auto bg-neutral-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-1 bg-red-500 animate-pulse" />
                    </div>
                    <span className="text-white text-sm absolute bottom-4">Scanning...</span>
                  </div>
                  <button
                    onClick={() => setIsScanning(false)}
                    className="mt-6 px-6 py-2 text-neutral-600 hover:text-neutral-800"
                  >
                    Cancel
                  </button>
                </div>
              ) : null}
            </div>

            {/* Manual Entry */}
            <div className="mt-6 pt-6 border-t border-neutral-100">
              <p className="text-sm text-neutral-500 text-center mb-3">Or enter barcode manually</p>
              <div className="flex gap-2 max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Enter barcode number..."
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={handleManualEntry}
                  className="px-6 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  Search
                </button>
              </div>
              <p className="text-xs text-neutral-400 text-center mt-2">
                Try: 8901030865350, 8901262150040, 5000159484695
              </p>
            </div>
          </div>

          {/* Scanned Product Result */}
          {scannedProduct && (
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-primary-50 rounded-xl flex items-center justify-center text-4xl">
                    {scannedProduct.image}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-neutral-900">{scannedProduct.name}</h3>
                      {scannedProduct.isVerified && (
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-neutral-500">{scannedProduct.brand}</p>
                    <p className="text-sm text-neutral-400">Serving: {scannedProduct.servingSize}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getHealthScoreColor(scannedProduct.healthScore)}`}>
                      {scannedProduct.healthScore}/100
                    </span>
                    <p className="text-xs text-neutral-500 mt-1">{getHealthScoreLabel(scannedProduct.healthScore)}</p>
                  </div>
                </div>

                {/* Nutrition Facts */}
                <div className="mt-6 grid grid-cols-4 lg:grid-cols-8 gap-3">
                  {[
                    { label: "Calories", value: scannedProduct.calories, unit: "kcal", color: "bg-orange-50 text-orange-700" },
                    { label: "Protein", value: scannedProduct.protein, unit: "g", color: "bg-red-50 text-red-700" },
                    { label: "Carbs", value: scannedProduct.carbs, unit: "g", color: "bg-blue-50 text-blue-700" },
                    { label: "Fat", value: scannedProduct.fat, unit: "g", color: "bg-yellow-50 text-yellow-700" },
                    { label: "Fiber", value: scannedProduct.fiber, unit: "g", color: "bg-green-50 text-green-700" },
                    { label: "Sugar", value: scannedProduct.sugar, unit: "g", color: "bg-pink-50 text-pink-700" },
                    { label: "Sodium", value: scannedProduct.sodium, unit: "mg", color: "bg-purple-50 text-purple-700" },
                  ].map((nutrient) => (
                    <div key={nutrient.label} className={`p-3 rounded-xl text-center ${nutrient.color}`}>
                      <p className="text-lg font-bold">{nutrient.value}{nutrient.unit}</p>
                      <p className="text-xs">{nutrient.label}</p>
                    </div>
                  ))}
                </div>

                {/* Allergens */}
                {scannedProduct.allergens.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm font-medium text-red-800">
                      ⚠️ Allergens: {scannedProduct.allergens.join(", ")}
                    </p>
                  </div>
                )}

                {/* Ingredients */}
                <div className="mt-4">
                  <h4 className="font-medium text-neutral-700 mb-2">Ingredients</h4>
                  <p className="text-sm text-neutral-600">
                    {scannedProduct.ingredients.join(", ")}
                  </p>
                </div>

                {/* Healthier Alternatives */}
                {scannedProduct.alternatives && scannedProduct.alternatives.length > 0 && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <h4 className="font-medium text-green-800 mb-3">🌱 Healthier Alternatives</h4>
                    <div className="space-y-2">
                      {scannedProduct.alternatives.map((alt, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg">
                          <div>
                            <p className="font-medium text-neutral-900">{alt.name}</p>
                            <p className="text-sm text-neutral-500">{alt.brand}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-sm px-2 py-0.5 rounded-full ${getHealthScoreColor(alt.healthScore)}`}>
                              {alt.healthScore}/100
                            </span>
                            <p className="text-xs text-neutral-500">{alt.calories} kcal</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors">
                    Add to Food Log
                  </button>
                  <button className="px-4 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
                    ⭐
                  </button>
                  <button
                    onClick={() => setScannedProduct(null)}
                    className="px-4 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                  >
                    Scan Another
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <h3 className="font-semibold text-blue-800 mb-2">📝 Scanning Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Hold your camera steady and ensure good lighting</li>
              <li>• Make sure the entire barcode is visible in frame</li>
              <li>• Clean the barcode if it&apos;s dirty or damaged</li>
              <li>• Try both 1D barcodes and QR codes</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-4">
          {scanHistory.length > 0 ? (
            scanHistory.map((item, index) => (
              <div
                key={index}
                onClick={() => setScannedProduct(item.product)}
                className="bg-white rounded-xl p-4 shadow-sm border border-neutral-100 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{item.product.image}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900">{item.product.name}</h4>
                    <p className="text-sm text-neutral-500">{item.product.brand}</p>
                    <p className="text-xs text-neutral-400">
                      Scanned {item.scannedAt.toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm px-2 py-0.5 rounded-full ${getHealthScoreColor(item.product.healthScore)}`}>
                      {item.product.healthScore}/100
                    </span>
                    <p className="text-sm text-neutral-600 mt-1">{item.product.calories} kcal</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-neutral-100">
              <span className="text-5xl">📜</span>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">No scan history</h3>
              <p className="text-neutral-500">Products you scan will appear here</p>
              <button
                onClick={() => setActiveTab("scan")}
                className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
              >
                Start Scanning
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "favorites" && (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-neutral-100">
          <span className="text-5xl">⭐</span>
          <h3 className="mt-4 text-lg font-semibold text-neutral-900">No favorites yet</h3>
          <p className="text-neutral-500">Save products for quick access</p>
          <button
            onClick={() => setActiveTab("scan")}
            className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
          >
            Scan Products
          </button>
        </div>
      )}

      {/* Not Found Modal */}
      {showNotFoundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
            <span className="text-5xl">🔍</span>
            <h3 className="mt-4 text-lg font-semibold text-neutral-900">Product Not Found</h3>
            <p className="text-neutral-500 mt-2">
              This product is not in our database yet. Would you like to add it?
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNotFoundModal(false)}
                className="flex-1 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNotFoundModal(false)}
                className="flex-1 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
