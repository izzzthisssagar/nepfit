"use client";

import { useState } from "react";

type GeneticTab = "profile" | "recommendations" | "nutrients" | "reports";

interface GeneticMarker {
  id: string;
  name: string;
  gene: string;
  icon: string;
  result: "favorable" | "moderate" | "attention";
  description: string;
  impact: string;
  recommendation: string;
}

interface FoodRecommendation {
  id: string;
  name: string;
  icon: string;
  category: string;
  benefit: string;
  geneticReason: string;
  type: "favor" | "avoid" | "moderate";
}

interface NutrientNeed {
  id: string;
  name: string;
  icon: string;
  personalizedRDA: number;
  standardRDA: number;
  unit: string;
  status: "optimal" | "increase" | "decrease";
  geneticNote: string;
}

interface GeneticReport {
  id: string;
  title: string;
  type: string;
  date: string;
  status: "ready" | "processing" | "pending";
  riskLevel: "low" | "moderate" | "elevated";
  summary: string;
}

const mockMarkers: GeneticMarker[] = [
  { id: "g1", name: "Lactose Tolerance", gene: "MCM6/LCT", icon: "🥛", result: "attention", description: "Likely lactose intolerant", impact: "Reduced ability to digest dairy products", recommendation: "Choose lactose-free dairy or plant-based alternatives" },
  { id: "g2", name: "Caffeine Metabolism", gene: "CYP1A2", icon: "☕", result: "favorable", description: "Fast caffeine metabolizer", impact: "Processes caffeine quickly - moderate intake is fine", recommendation: "Up to 3 cups of coffee per day is suitable" },
  { id: "g3", name: "Vitamin D Processing", gene: "VDR/GC", icon: "☀️", result: "moderate", description: "Moderate vitamin D absorption", impact: "May need higher vitamin D intake", recommendation: "Increase sun exposure and vitamin D-rich foods" },
  { id: "g4", name: "Folate Metabolism", gene: "MTHFR", icon: "🧬", result: "attention", description: "Reduced folate conversion", impact: "Difficulty converting folic acid to active form", recommendation: "Choose methylfolate supplements and green leafy vegetables" },
  { id: "g5", name: "Omega-3 Conversion", gene: "FADS1/FADS2", icon: "🐟", result: "moderate", description: "Average omega-3 conversion", impact: "Moderate ability to convert plant omega-3 to EPA/DHA", recommendation: "Include direct sources like fish or algae supplements" },
  { id: "g6", name: "Gluten Sensitivity", gene: "HLA-DQ2/DQ8", icon: "🌾", result: "favorable", description: "Low genetic risk for celiac", impact: "Low predisposition for gluten sensitivity", recommendation: "No need to avoid gluten unless symptoms present" },
  { id: "g7", name: "Iron Absorption", gene: "HFE", icon: "🩸", result: "favorable", description: "Normal iron metabolism", impact: "Typical iron absorption and storage", recommendation: "Maintain balanced iron intake through diet" },
  { id: "g8", name: "Salt Sensitivity", gene: "ACE/AGT", icon: "🧂", result: "attention", description: "Salt-sensitive blood pressure", impact: "Higher blood pressure response to sodium", recommendation: "Limit sodium intake to under 2000mg daily" },
];

const foodRecommendations: FoodRecommendation[] = [
  { id: "f1", name: "Spinach (Palungo)", icon: "🥬", category: "Leafy Greens", benefit: "High in methylfolate", geneticReason: "Compensates for MTHFR variant", type: "favor" },
  { id: "f2", name: "Salmon / Mackerel", icon: "🐟", category: "Fish", benefit: "Direct EPA/DHA source", geneticReason: "Bypasses FADS conversion", type: "favor" },
  { id: "f3", name: "Sunlight + Mushrooms", icon: "🍄", category: "Vitamin D", benefit: "Natural vitamin D", geneticReason: "Supports VDR variant needs", type: "favor" },
  { id: "f4", name: "Turmeric (Besar)", icon: "🟡", category: "Spices", benefit: "Anti-inflammatory", geneticReason: "Supports methylation pathways", type: "favor" },
  { id: "f5", name: "Walnuts (Okhar)", icon: "🥜", category: "Nuts", benefit: "Plant omega-3 (ALA)", geneticReason: "Partial omega-3 conversion support", type: "favor" },
  { id: "f6", name: "Lentils (Dal)", icon: "🫘", category: "Legumes", benefit: "Natural folate source", geneticReason: "Better than synthetic folic acid for MTHFR", type: "favor" },
  { id: "f7", name: "Regular Milk", icon: "🥛", category: "Dairy", benefit: "Calcium source", geneticReason: "Lactose intolerance - switch to alternatives", type: "avoid" },
  { id: "f8", name: "Cheese (aged)", icon: "🧀", category: "Dairy", benefit: "Lower lactose", geneticReason: "Aged cheese has less lactose - use moderately", type: "moderate" },
  { id: "f9", name: "High-sodium pickles", icon: "🥒", category: "Condiments", benefit: "Fermented benefits", geneticReason: "Salt sensitivity - limit intake", type: "avoid" },
  { id: "f10", name: "Processed snacks", icon: "🍿", category: "Snacks", benefit: "None significant", geneticReason: "High sodium content - avoid due to ACE variant", type: "avoid" },
  { id: "f11", name: "Yogurt (Dahi)", icon: "🥣", category: "Dairy", benefit: "Probiotics", geneticReason: "Cultured - lower lactose, but monitor tolerance", type: "moderate" },
  { id: "f12", name: "Eggs", icon: "🥚", category: "Protein", benefit: "Choline + B vitamins", geneticReason: "Supports methylation pathways", type: "favor" },
];

const nutrientNeeds: NutrientNeed[] = [
  { id: "n1", name: "Vitamin D", icon: "☀️", personalizedRDA: 2000, standardRDA: 600, unit: "IU", status: "increase", geneticNote: "VDR variant requires 3x standard intake" },
  { id: "n2", name: "Folate", icon: "🥬", personalizedRDA: 800, standardRDA: 400, unit: "mcg", status: "increase", geneticNote: "MTHFR variant - use methylfolate form" },
  { id: "n3", name: "Omega-3 (DHA)", icon: "🐟", personalizedRDA: 500, standardRDA: 250, unit: "mg", status: "increase", geneticNote: "FADS variant - need direct DHA sources" },
  { id: "n4", name: "Calcium", icon: "🦴", personalizedRDA: 1200, standardRDA: 1000, unit: "mg", status: "increase", geneticNote: "Reduced dairy - need alternate calcium sources" },
  { id: "n5", name: "Iron", icon: "🩸", personalizedRDA: 18, standardRDA: 18, unit: "mg", status: "optimal", geneticNote: "Normal iron metabolism - maintain current intake" },
  { id: "n6", name: "Vitamin B12", icon: "💊", personalizedRDA: 2.4, standardRDA: 2.4, unit: "mcg", status: "optimal", geneticNote: "Normal B12 absorption" },
  { id: "n7", name: "Sodium", icon: "🧂", personalizedRDA: 1500, standardRDA: 2300, unit: "mg", status: "decrease", geneticNote: "ACE variant - reduce sodium intake" },
  { id: "n8", name: "Magnesium", icon: "🌿", personalizedRDA: 400, standardRDA: 320, unit: "mg", status: "increase", geneticNote: "Supports methylation and vitamin D activation" },
];

const geneticReports: GeneticReport[] = [
  { id: "r1", title: "Nutrigenomics Full Report", type: "Comprehensive", date: "2026-01-15", status: "ready", riskLevel: "low", summary: "Overall favorable genetic profile for nutrition with specific areas requiring dietary adjustments" },
  { id: "r2", title: "Metabolic Health Risk", type: "Risk Assessment", date: "2026-01-15", status: "ready", riskLevel: "moderate", summary: "Moderate metabolic risk factors identified - dietary interventions recommended" },
  { id: "r3", title: "Food Sensitivity Panel", type: "Sensitivity", date: "2026-01-15", status: "ready", riskLevel: "moderate", summary: "Lactose intolerance and salt sensitivity identified with clear dietary guidelines" },
  { id: "r4", title: "Vitamin Optimization Plan", type: "Micronutrients", date: "2026-02-01", status: "ready", riskLevel: "low", summary: "Personalized vitamin and mineral recommendations based on genetic variants" },
  { id: "r5", title: "Weight Management Genetic Profile", type: "Weight", date: "2026-02-10", status: "processing", riskLevel: "moderate", summary: "Analysis of genes affecting metabolism, appetite, and fat storage" },
  { id: "r6", title: "Athletic Performance Genetics", type: "Fitness", date: "2026-02-15", status: "pending", riskLevel: "low", summary: "Pending analysis of muscle composition, recovery, and endurance genes" },
];

export default function GeneticNutritionPage() {
  const [activeTab, setActiveTab] = useState<GeneticTab>("profile");
  const [selectedMarker, setSelectedMarker] = useState<GeneticMarker | null>(null);
  const [filterType, setFilterType] = useState<"all" | "favor" | "avoid" | "moderate">("all");

  const tabs: { id: GeneticTab; label: string; icon: string }[] = [
    { id: "profile", label: "DNA Profile", icon: "🧬" },
    { id: "recommendations", label: "Foods", icon: "🥗" },
    { id: "nutrients", label: "Nutrients", icon: "💊" },
    { id: "reports", label: "Reports", icon: "📋" },
  ];

  const filteredFoods = filterType === "all" ? foodRecommendations : foodRecommendations.filter(f => f.type === filterType);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">🧬 Genetic Nutrition</h1>
        <p className="text-violet-100">DNA-based personalized dietary recommendations</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-violet-500 text-white"
                : "bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* DNA Test Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-800">🔬 DNA Test Status</h2>
                <p className="text-sm text-neutral-500">Your genetic analysis results</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium">✅ Complete</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-violet-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-violet-600">8</p>
                <p className="text-xs text-neutral-500">Markers Analyzed</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-emerald-600">3</p>
                <p className="text-xs text-neutral-500">Favorable</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-amber-600">2</p>
                <p className="text-xs text-neutral-500">Moderate</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-red-500">3</p>
                <p className="text-xs text-neutral-500">Needs Attention</p>
              </div>
            </div>
          </div>

          {/* Genetic Markers */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🧪 Genetic Markers</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {mockMarkers.map(marker => (
                <div
                  key={marker.id}
                  onClick={() => setSelectedMarker(marker)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 cursor-pointer hover:border-violet-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{marker.icon}</span>
                      <div>
                        <h3 className="font-medium text-neutral-800">{marker.name}</h3>
                        <p className="text-xs text-neutral-400 font-mono">{marker.gene}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      marker.result === "favorable" ? "bg-emerald-50 text-emerald-600" :
                      marker.result === "moderate" ? "bg-amber-50 text-amber-600" :
                      "bg-red-50 text-red-500"
                    }`}>
                      {marker.result}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">{marker.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Test Results */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-2">📤 Upload New Test Results</h2>
            <p className="text-sm text-neutral-500 mb-4">Support for 23andMe, AncestryDNA, and other raw DNA data formats</p>
            <div className="border-2 border-dashed border-neutral-200 rounded-xl p-8 text-center">
              <div className="text-4xl mb-2">📁</div>
              <p className="text-sm text-neutral-600 mb-2">Drag & drop your DNA data file here</p>
              <p className="text-xs text-neutral-400 mb-4">Supports .txt, .csv, .zip formats</p>
              <button className="px-4 py-2 bg-violet-500 text-white rounded-xl text-sm font-medium hover:bg-violet-600 transition-colors">Browse Files</button>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === "recommendations" && (
        <div className="space-y-6">
          {/* Filter */}
          <div className="flex gap-2">
            {[
              { id: "all" as const, label: "All Foods", icon: "🍽️" },
              { id: "favor" as const, label: "Eat More", icon: "✅" },
              { id: "moderate" as const, label: "Moderate", icon: "⚠️" },
              { id: "avoid" as const, label: "Avoid", icon: "❌" },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterType === f.id
                    ? "bg-violet-500 text-white"
                    : "bg-white text-neutral-600 border border-neutral-200"
                }`}
              >
                <span>{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>

          {/* Food Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredFoods.map(food => (
              <div key={food.id} className={`bg-white rounded-2xl p-4 shadow-sm border ${
                food.type === "favor" ? "border-emerald-200" :
                food.type === "avoid" ? "border-red-200" :
                "border-amber-200"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{food.icon}</span>
                  <div>
                    <h3 className="font-medium text-neutral-800">{food.name}</h3>
                    <p className="text-xs text-neutral-500">{food.category}</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 mb-2">{food.benefit}</p>
                <div className={`px-2 py-1 rounded-lg text-xs ${
                  food.type === "favor" ? "bg-emerald-50 text-emerald-600" :
                  food.type === "avoid" ? "bg-red-50 text-red-500" :
                  "bg-amber-50 text-amber-600"
                }`}>
                  🧬 {food.geneticReason}
                </div>
              </div>
            ))}
          </div>

          {/* Meal Suggestion */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🍽️ Genetically Optimized Daily Meal Plan</h2>
            <div className="space-y-3">
              {[
                { meal: "Breakfast", time: "7:00 AM", items: "Eggs + spinach scramble, mushroom, herbal tea", icon: "🌅", calories: 380 },
                { meal: "Snack", time: "10:00 AM", items: "Walnuts + banana, lactose-free yogurt", icon: "🥜", calories: 200 },
                { meal: "Lunch", time: "12:30 PM", items: "Dal bhat with saag, turmeric chicken, low-sodium achar", icon: "☀️", calories: 550 },
                { meal: "Snack", time: "4:00 PM", items: "Sweet potato + almond butter", icon: "🍠", calories: 180 },
                { meal: "Dinner", time: "7:00 PM", items: "Grilled fish with brown rice, steamed vegetables", icon: "🌙", calories: 480 },
              ].map((meal, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-neutral-50 rounded-xl">
                  <span className="text-2xl">{meal.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-neutral-800">{meal.meal}</h3>
                      <span className="text-xs text-neutral-500">{meal.time}</span>
                    </div>
                    <p className="text-sm text-neutral-600">{meal.items}</p>
                  </div>
                  <span className="text-sm font-medium text-violet-600">{meal.calories} cal</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Nutrients Tab */}
      {activeTab === "nutrients" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-1">💊 Personalized Nutrient Needs</h2>
            <p className="text-sm text-neutral-500 mb-4">Based on your genetic profile vs. standard RDA</p>

            <div className="space-y-4">
              {nutrientNeeds.map(nutrient => (
                <div key={nutrient.id} className="p-4 bg-neutral-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{nutrient.icon}</span>
                      <h3 className="font-medium text-neutral-800">{nutrient.name}</h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      nutrient.status === "optimal" ? "bg-emerald-50 text-emerald-600" :
                      nutrient.status === "increase" ? "bg-blue-50 text-blue-600" :
                      "bg-amber-50 text-amber-600"
                    }`}>
                      {nutrient.status === "increase" ? "⬆️ Increase" : nutrient.status === "decrease" ? "⬇️ Decrease" : "✅ Optimal"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <p className="text-xs text-neutral-500">Your Need</p>
                      <p className="text-lg font-bold text-violet-600">{nutrient.personalizedRDA} {nutrient.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Standard RDA</p>
                      <p className="text-lg font-bold text-neutral-400">{nutrient.standardRDA} {nutrient.unit}</p>
                    </div>
                  </div>
                  {/* Comparison Bar */}
                  <div className="relative h-3 bg-neutral-200 rounded-full mb-2">
                    <div
                      className="absolute top-0 left-0 h-3 bg-violet-500 rounded-full"
                      style={{ width: `${Math.min((nutrient.personalizedRDA / (Math.max(nutrient.personalizedRDA, nutrient.standardRDA) * 1.2)) * 100, 100)}%` }}
                    ></div>
                    <div
                      className="absolute top-0 h-3 w-0.5 bg-neutral-500"
                      style={{ left: `${(nutrient.standardRDA / (Math.max(nutrient.personalizedRDA, nutrient.standardRDA) * 1.2)) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-neutral-500">🧬 {nutrient.geneticNote}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">📋 Genetic Health Reports</h2>
            <div className="space-y-3">
              {geneticReports.map(report => (
                <div key={report.id} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-neutral-800">{report.title}</h3>
                      <p className="text-xs text-neutral-500">{report.type} • {new Date(report.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.riskLevel === "low" ? "bg-emerald-50 text-emerald-600" :
                        report.riskLevel === "moderate" ? "bg-amber-50 text-amber-600" :
                        "bg-red-50 text-red-500"
                      }`}>
                        {report.riskLevel} risk
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === "ready" ? "bg-emerald-50 text-emerald-600" :
                        report.status === "processing" ? "bg-blue-50 text-blue-600" :
                        "bg-neutral-50 text-neutral-500"
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 mb-3">{report.summary}</p>
                  <div className="flex gap-2">
                    {report.status === "ready" && (
                      <>
                        <button className="px-3 py-1.5 bg-violet-500 text-white rounded-lg text-xs font-medium hover:bg-violet-600 transition-colors">View Report</button>
                        <button className="px-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-600 hover:bg-neutral-50">Download PDF</button>
                      </>
                    )}
                    {report.status === "processing" && (
                      <span className="text-xs text-blue-600">⏳ Analysis in progress...</span>
                    )}
                    {report.status === "pending" && (
                      <span className="text-xs text-neutral-500">Waiting for data submission</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Request New Report */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">📝 Request New Analysis</h2>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { name: "Allergy Prediction", icon: "🤧", description: "Analyze genetic predisposition to food allergies", price: "Rs. 2,500" },
                { name: "Metabolism Deep Dive", icon: "🔥", description: "Detailed analysis of metabolic gene variants", price: "Rs. 3,500" },
                { name: "Longevity Panel", icon: "🧓", description: "Genetic factors affecting aging and longevity", price: "Rs. 5,000" },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-violet-50 rounded-xl">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h3 className="font-medium text-neutral-800 mb-1">{item.name}</h3>
                  <p className="text-xs text-neutral-500 mb-3">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-violet-600">{item.price}</span>
                    <button className="px-3 py-1.5 bg-violet-500 text-white rounded-lg text-xs font-medium hover:bg-violet-600">Request</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Marker Detail Modal */}
      {selectedMarker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{selectedMarker.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-neutral-800">{selectedMarker.name}</h3>
                <p className="text-sm text-neutral-400 font-mono">{selectedMarker.gene}</p>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="p-3 bg-neutral-50 rounded-xl">
                <p className="text-xs text-neutral-500 mb-1">Result</p>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  selectedMarker.result === "favorable" ? "bg-emerald-50 text-emerald-600" :
                  selectedMarker.result === "moderate" ? "bg-amber-50 text-amber-600" :
                  "bg-red-50 text-red-500"
                }`}>{selectedMarker.result}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <p className="text-xs text-neutral-500 mb-1">Impact</p>
                <p className="text-sm text-neutral-700">{selectedMarker.impact}</p>
              </div>
              <div className="p-3 bg-violet-50 rounded-xl">
                <p className="text-xs text-violet-500 mb-1">Recommendation</p>
                <p className="text-sm text-violet-700">{selectedMarker.recommendation}</p>
              </div>
            </div>
            <button onClick={() => setSelectedMarker(null)} className="w-full px-4 py-2 bg-violet-500 text-white rounded-xl text-sm font-medium hover:bg-violet-600">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}