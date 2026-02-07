"use client";

import { useState } from "react";

type ThyroidTab = "overview" | "tracking" | "diet" | "medications" | "reports";

interface LabResult {
  id: string;
  marker: string;
  value: number;
  unit: string;
  normalRange: string;
  status: "normal" | "low" | "high";
  date: string;
}

interface ThyroidSymptom {
  id: string;
  name: string;
  icon: string;
  severity: 0 | 1 | 2 | 3;
  category: string;
}

interface ThyroidFood {
  id: string;
  name: string;
  icon: string;
  category: string;
  benefit: string;
  type: "recommended" | "avoid" | "moderate";
  nutrient: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  icon: string;
  adherence: number;
  notes: string;
}

const labResults: LabResult[] = [
  { id: "l1", marker: "TSH", value: 5.8, unit: "mIU/L", normalRange: "0.4-4.0", status: "high", date: "2026-01-28" },
  { id: "l2", marker: "Free T4", value: 0.9, unit: "ng/dL", normalRange: "0.8-1.8", status: "normal", date: "2026-01-28" },
  { id: "l3", marker: "Free T3", value: 2.1, unit: "pg/mL", normalRange: "2.3-4.2", status: "low", date: "2026-01-28" },
  { id: "l4", marker: "TPO Antibodies", value: 45, unit: "IU/mL", normalRange: "<35", status: "high", date: "2026-01-28" },
  { id: "l5", marker: "Thyroglobulin Ab", value: 12, unit: "IU/mL", normalRange: "<20", status: "normal", date: "2026-01-28" },
  { id: "l6", marker: "Vitamin D", value: 28, unit: "ng/mL", normalRange: "30-80", status: "low", date: "2026-01-28" },
];

const thyroidSymptoms: ThyroidSymptom[] = [
  { id: "s1", name: "Fatigue", icon: "😴", severity: 2, category: "Energy" },
  { id: "s2", name: "Weight Change", icon: "⚖️", severity: 1, category: "Metabolism" },
  { id: "s3", name: "Cold Sensitivity", icon: "🥶", severity: 2, category: "Temperature" },
  { id: "s4", name: "Hair Loss", icon: "💇", severity: 1, category: "Hair/Skin" },
  { id: "s5", name: "Brain Fog", icon: "🌫️", severity: 2, category: "Cognitive" },
  { id: "s6", name: "Dry Skin", icon: "🏜️", severity: 1, category: "Hair/Skin" },
  { id: "s7", name: "Constipation", icon: "😣", severity: 1, category: "Digestive" },
  { id: "s8", name: "Muscle Aches", icon: "💪", severity: 0, category: "Musculoskeletal" },
  { id: "s9", name: "Depression", icon: "😞", severity: 1, category: "Mood" },
  { id: "s10", name: "Puffy Face", icon: "😶", severity: 0, category: "Appearance" },
];

const thyroidFoods: ThyroidFood[] = [
  { id: "f1", name: "Brazil Nuts", icon: "🥜", category: "Selenium-rich", benefit: "Supports thyroid hormone production", type: "recommended", nutrient: "Selenium: 544mcg/oz" },
  { id: "f2", name: "Fish (Machha)", icon: "🐟", category: "Selenium + Omega-3", benefit: "Anti-inflammatory, selenium source", type: "recommended", nutrient: "Selenium: 47mcg/3oz" },
  { id: "f3", name: "Eggs (Anda)", icon: "🥚", category: "Iodine + Selenium", benefit: "Contains iodine and selenium together", type: "recommended", nutrient: "Iodine: 26mcg/egg" },
  { id: "f4", name: "Pumpkin Seeds", icon: "🎃", category: "Zinc-rich", benefit: "Zinc supports T3 conversion", type: "recommended", nutrient: "Zinc: 2.2mg/oz" },
  { id: "f5", name: "Yogurt (Dahi)", icon: "🥣", category: "Iodine source", benefit: "Natural iodine, probiotics for gut health", type: "recommended", nutrient: "Iodine: 75mcg/cup" },
  { id: "f6", name: "Chicken", icon: "🍗", category: "Protein + Zinc", benefit: "Lean protein with zinc for conversion", type: "recommended", nutrient: "Zinc: 2.4mg/3oz" },
  { id: "f7", name: "Spinach (Palungo)", icon: "🥬", category: "Iron-rich", benefit: "Iron supports thyroid function", type: "recommended", nutrient: "Iron: 6.4mg/cup" },
  { id: "f8", name: "Raw Broccoli", icon: "🥦", category: "Goitrogen", benefit: "Contains goitrogens - cook before eating", type: "moderate", nutrient: "Cook to reduce goitrogens" },
  { id: "f9", name: "Raw Cabbage", icon: "🥬", category: "Goitrogen", benefit: "Raw form interferes with iodine uptake", type: "moderate", nutrient: "Cook to reduce goitrogens" },
  { id: "f10", name: "Soy Products", icon: "🫘", category: "Phytoestrogen", benefit: "May interfere with thyroid medication absorption", type: "avoid", nutrient: "Avoid 4hrs before/after meds" },
  { id: "f11", name: "Gluten (some)", icon: "🌾", category: "Autoimmune trigger", benefit: "May trigger Hashimoto's flares in sensitive individuals", type: "avoid", nutrient: "Consider elimination trial" },
  { id: "f12", name: "Processed Foods", icon: "🍟", category: "Inflammatory", benefit: "Increases inflammation, disrupts hormones", type: "avoid", nutrient: "High sodium and additives" },
];

const medications: Medication[] = [
  { id: "m1", name: "Levothyroxine", dosage: "75 mcg", timing: "Empty stomach, 30min before food", icon: "💊", adherence: 94, notes: "Take with water only, avoid coffee/calcium for 1 hour" },
  { id: "m2", name: "Vitamin D3", dosage: "4000 IU", timing: "With breakfast (fatty meal)", icon: "☀️", adherence: 88, notes: "Take with food containing fat for better absorption" },
  { id: "m3", name: "Selenium", dosage: "200 mcg", timing: "With lunch", icon: "💊", adherence: 82, notes: "Do not exceed 400mcg/day total including food sources" },
  { id: "m4", name: "Iron Supplement", dosage: "27 mg", timing: "2 hours after levothyroxine", icon: "🩸", adherence: 78, notes: "Take with vitamin C, avoid with calcium/tea" },
];

const labHistory = [
  { date: "Jul 2025", tsh: 8.2, t4: 0.7, t3: 1.8 },
  { date: "Sep 2025", tsh: 7.1, t4: 0.8, t3: 1.9 },
  { date: "Nov 2025", tsh: 6.4, t4: 0.85, t3: 2.0 },
  { date: "Jan 2026", tsh: 5.8, t4: 0.9, t3: 2.1 },
];

export default function ThyroidPage() {
  const [activeTab, setActiveTab] = useState<ThyroidTab>("overview");
  const [energyLevel, setEnergyLevel] = useState(5);
  const [foodFilter, setFoodFilter] = useState<"all" | "recommended" | "avoid" | "moderate">("all");

  const tabs: { id: ThyroidTab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "tracking", label: "Tracking", icon: "📝" },
    { id: "diet", label: "Diet", icon: "🥗" },
    { id: "medications", label: "Medications", icon: "💊" },
    { id: "reports", label: "Reports", icon: "📈" },
  ];

  const filteredFoods = foodFilter === "all" ? thyroidFoods : thyroidFoods.filter(f => f.type === foodFilter);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-cyan-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">🦋 Thyroid Management</h1>
        <p className="text-sky-100">Monitor and manage your thyroid health</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-sky-500 text-white"
                : "bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Health Score & Condition */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <h2 className="text-lg font-semibold text-neutral-800 mb-3">🦋 Thyroid Health Score</h2>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-white">
                  <span className="text-2xl font-bold">65</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-600">Needs Attention</p>
                  <p className="text-xs text-neutral-500 mt-1">TSH elevated, on treatment</p>
                  <p className="text-xs text-emerald-500 mt-1">⬆️ Improving (+12 from July)</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <h2 className="text-lg font-semibold text-neutral-800 mb-3">🔬 Condition</h2>
              <div className="space-y-2">
                <div className="p-3 bg-amber-50 rounded-xl">
                  <p className="text-sm font-medium text-amber-700">Subclinical Hypothyroidism</p>
                  <p className="text-xs text-amber-600">Hashimoto&apos;s thyroiditis (autoimmune)</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-neutral-50 rounded-lg text-center">
                    <p className="text-xs text-neutral-500">Last Lab</p>
                    <p className="text-sm font-medium">Jan 28</p>
                  </div>
                  <div className="p-2 bg-neutral-50 rounded-lg text-center">
                    <p className="text-xs text-neutral-500">Next Lab</p>
                    <p className="text-sm font-medium">Apr 28</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Current TSH", value: "5.8", unit: "mIU/L", icon: "🔬", status: "High ⬆️" },
              { label: "Med Adherence", value: "94%", unit: "", icon: "💊", status: "Good ✅" },
              { label: "Weight Change", value: "+1.2 kg", unit: "", icon: "⚖️", status: "Monitor ⚠️" },
              { label: "Energy Level", value: "5/10", unit: "", icon: "⚡", status: "Moderate" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
                <span className="text-2xl">{stat.icon}</span>
                <p className="text-lg font-bold text-neutral-800 mt-2">{stat.value} <span className="text-xs font-normal text-neutral-400">{stat.unit}</span></p>
                <p className="text-xs text-neutral-500">{stat.label}</p>
                <p className="text-xs mt-1 text-neutral-400">{stat.status}</p>
              </div>
            ))}
          </div>

          {/* Current Lab Results */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🔬 Latest Lab Results (Jan 28, 2026)</h2>
            <div className="space-y-2">
              {labResults.map(lab => (
                <div key={lab.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{lab.marker}</p>
                    <p className="text-xs text-neutral-500">Normal: {lab.normalRange} {lab.unit}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className={`text-lg font-bold ${
                      lab.status === "normal" ? "text-emerald-600" :
                      lab.status === "high" ? "text-red-500" :
                      "text-amber-600"
                    }`}>
                      {lab.value} <span className="text-xs font-normal">{lab.unit}</span>
                    </p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      lab.status === "normal" ? "bg-emerald-50 text-emerald-600" :
                      lab.status === "high" ? "bg-red-50 text-red-500" :
                      "bg-amber-50 text-amber-600"
                    }`}>
                      {lab.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tracking Tab */}
      {activeTab === "tracking" && (
        <div className="space-y-6">
          {/* Symptom Tracker */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">📝 Daily Symptom Tracker</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {thyroidSymptoms.map(symptom => (
                <div key={symptom.id} className="p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{symptom.icon}</span>
                      <span className="text-sm font-medium text-neutral-800">{symptom.name}</span>
                    </div>
                    <span className="text-xs text-neutral-400">{symptom.category}</span>
                  </div>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map(level => (
                      <button
                        key={level}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          symptom.severity === level
                            ? level === 0 ? "bg-emerald-500 text-white" :
                              level === 1 ? "bg-amber-400 text-white" :
                              level === 2 ? "bg-orange-500 text-white" :
                              "bg-red-500 text-white"
                            : "bg-white border border-neutral-200 text-neutral-500"
                        }`}
                      >
                        {level === 0 ? "None" : level === 1 ? "Mild" : level === 2 ? "Mod" : "Severe"}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">⚡ Daily Energy Level</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-500">Low</span>
              <input
                type="range"
                min={1}
                max={10}
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="flex-1 accent-sky-500"
              />
              <span className="text-sm text-neutral-500">High</span>
            </div>
            <p className="text-center text-2xl mt-3">
              {energyLevel <= 3 ? "😴" : energyLevel <= 5 ? "😐" : energyLevel <= 7 ? "🙂" : "⚡"} {energyLevel}/10
            </p>
          </div>

          {/* Lab Result Entry */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🔬 Log New Lab Results</h2>
            <div className="grid md:grid-cols-3 gap-3">
              {["TSH", "Free T4", "Free T3", "TPO Antibodies", "Vitamin D", "Iron/Ferritin"].map((marker, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">{marker}</label>
                  <input type="number" placeholder="Value" step="0.1" className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm" />
                </div>
              ))}
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Test Date</label>
              <input type="date" className="px-3 py-2 rounded-xl border border-neutral-200 text-sm" />
            </div>
            <button className="mt-4 w-full px-4 py-2.5 bg-sky-500 text-white rounded-xl text-sm font-medium hover:bg-sky-600 transition-colors">Save Lab Results</button>
          </div>
        </div>
      )}

      {/* Diet Tab */}
      {activeTab === "diet" && (
        <div className="space-y-6">
          <div className="flex gap-2">
            {[
              { id: "all" as const, label: "All", icon: "🍽️" },
              { id: "recommended" as const, label: "Eat More", icon: "✅" },
              { id: "moderate" as const, label: "Moderate", icon: "⚠️" },
              { id: "avoid" as const, label: "Avoid", icon: "❌" },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFoodFilter(f.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  foodFilter === f.id ? "bg-sky-500 text-white" : "bg-white text-neutral-600 border border-neutral-200"
                }`}
              >
                <span>{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredFoods.map(food => (
              <div key={food.id} className={`bg-white rounded-2xl p-4 shadow-sm border ${
                food.type === "recommended" ? "border-emerald-200" :
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
                <p className="text-sm text-neutral-600 mb-1">{food.benefit}</p>
                <p className="text-xs text-sky-600">📊 {food.nutrient}</p>
              </div>
            ))}
          </div>

          {/* Thyroid-Friendly Nepali Recipes */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🇳🇵 Thyroid-Friendly Nepali Recipes</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { name: "Selenium-Rich Fish Curry", ingredients: "Machha, turmeric, ginger, garlic, tomato", time: "30 min", icon: "🐟" },
                { name: "Iron-Boosted Saag", ingredients: "Spinach, mustard greens, garlic, cumin, lemon", time: "20 min", icon: "🥬" },
                { name: "Zinc-Packed Chicken Tarkari", ingredients: "Chicken, pumpkin seeds, onion, spices", time: "35 min", icon: "🍗" },
                { name: "Iodine-Rich Egg Bhurji", ingredients: "Eggs, tomato, onion, green chili, turmeric", time: "10 min", icon: "🥚" },
              ].map((recipe, i) => (
                <div key={i} className="p-4 bg-sky-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{recipe.icon}</span>
                    <h3 className="font-medium text-neutral-800">{recipe.name}</h3>
                  </div>
                  <p className="text-sm text-neutral-600">{recipe.ingredients}</p>
                  <p className="text-xs text-sky-600 mt-1">⏱️ {recipe.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Medications Tab */}
      {activeTab === "medications" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">💊 Current Medications</h2>
            <div className="space-y-3">
              {medications.map(med => (
                <div key={med.id} className="p-4 bg-neutral-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{med.icon}</span>
                      <div>
                        <h3 className="font-medium text-neutral-800">{med.name} - {med.dosage}</h3>
                        <p className="text-xs text-neutral-500">⏰ {med.timing}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${med.adherence >= 90 ? "text-emerald-600" : med.adherence >= 80 ? "text-amber-600" : "text-red-500"}`}>{med.adherence}%</p>
                      <p className="text-xs text-neutral-400">adherence</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-neutral-200 rounded-full mb-2">
                    <div className={`h-1.5 rounded-full ${med.adherence >= 90 ? "bg-emerald-500" : med.adherence >= 80 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${med.adherence}%` }}></div>
                  </div>
                  <p className="text-xs text-sky-600">ℹ️ {med.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interaction Warnings */}
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <h2 className="text-lg font-semibold text-amber-800 mb-3">⚠️ Important Medication Interactions</h2>
            <ul className="space-y-2 text-sm text-amber-700">
              <li>• <strong>Levothyroxine + Calcium:</strong> Wait 4 hours between them</li>
              <li>• <strong>Levothyroxine + Iron:</strong> Wait 2-4 hours between them</li>
              <li>• <strong>Levothyroxine + Coffee:</strong> Wait at least 30 minutes after taking</li>
              <li>• <strong>Levothyroxine + Soy:</strong> Avoid soy products near medication time</li>
              <li>• <strong>Levothyroxine + Antacids:</strong> Wait 4 hours between them</li>
            </ul>
          </div>

          {/* Timing Schedule */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">⏰ Optimal Medication Schedule</h2>
            <div className="space-y-3">
              {[
                { time: "6:00 AM", action: "Levothyroxine 75mcg", note: "Empty stomach, water only", icon: "💊" },
                { time: "6:30 AM", action: "Wait period", note: "No food, coffee, or supplements", icon: "⏳" },
                { time: "7:00 AM", action: "Breakfast + Vitamin D", note: "Take Vitamin D with fatty food", icon: "🍳" },
                { time: "8:00 AM", action: "Iron supplement", note: "With vitamin C juice", icon: "🩸" },
                { time: "12:30 PM", action: "Selenium with lunch", note: "Do not exceed daily limit", icon: "💊" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-neutral-50 rounded-xl">
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-neutral-800">{item.action}</h3>
                      <span className="text-sm text-sky-600 font-medium">{item.time}</span>
                    </div>
                    <p className="text-xs text-neutral-500">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          {/* TSH Trend */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">📈 TSH Trend Over Time</h2>
            <div className="space-y-3">
              {labHistory.map((entry, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm text-neutral-500 w-20">{entry.date}</span>
                  <div className="flex-1">
                    <div className="flex gap-1 h-6">
                      <div className="bg-sky-400 rounded" style={{ width: `${(entry.tsh / 10) * 100}%` }} title={`TSH: ${entry.tsh}`}></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-neutral-700 w-12 text-right">{entry.tsh}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-emerald-50 rounded-xl">
              <p className="text-sm text-emerald-700">📉 TSH trending downward! Your treatment is working. Goal: TSH between 1.0-2.0 mIU/L</p>
            </div>
          </div>

          {/* Monthly Report Cards */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">📋 Monthly Health Reports</h2>
            <div className="space-y-3">
              {[
                { month: "January 2026", score: 65, highlight: "TSH improved to 5.8, medication adjusted", status: "improving" },
                { month: "December 2025", score: 58, highlight: "Added selenium supplement, diet changes started", status: "stable" },
                { month: "November 2025", score: 52, highlight: "First diagnosis, started levothyroxine", status: "baseline" },
              ].map((report, i) => (
                <div key={i} className="p-4 bg-neutral-50 rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-neutral-800">{report.month}</h3>
                    <p className="text-sm text-neutral-600">{report.highlight}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-sky-600">{report.score}/100</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      report.status === "improving" ? "bg-emerald-50 text-emerald-600" :
                      report.status === "stable" ? "bg-blue-50 text-blue-600" :
                      "bg-neutral-100 text-neutral-500"
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}