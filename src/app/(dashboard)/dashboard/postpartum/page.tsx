"use client";

import { useState } from "react";

type PostpartumTab = "overview" | "nutrition" | "recovery" | "breastfeeding" | "wellness";

interface LactationFood {
  id: string;
  name: string;
  nameNe: string;
  icon: string;
  benefit: string;
  category: string;
  isGalactagogue: boolean;
}

interface RecoveryMilestone {
  id: string;
  week: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  exerciseLevel: string;
}

interface FeedingLog {
  id: string;
  time: string;
  duration: number;
  side: "left" | "right" | "both" | "bottle";
  type: "breastfeed" | "pump" | "formula";
  amount?: number;
  notes: string;
}

interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  energy: number;
  sleep: number;
  anxiety: number;
  notes: string;
}

const lactationFoods: LactationFood[] = [
  { id: "lf1", name: "Fenugreek (Methi)", nameNe: "मेथी", icon: "🌿", benefit: "Traditional galactagogue, increases milk supply", category: "Herbs", isGalactagogue: true },
  { id: "lf2", name: "Garlic (Lasun)", nameNe: "लसुन", icon: "🧄", benefit: "Improves milk flow and baby may prefer the taste", category: "Spices", isGalactagogue: true },
  { id: "lf3", name: "Oats (Jau)", nameNe: "जौ", icon: "🥣", benefit: "Iron-rich, promotes prolactin production", category: "Grains", isGalactagogue: true },
  { id: "lf4", name: "Lentils (Dal)", nameNe: "दाल", icon: "🫘", benefit: "High protein, iron, and folate for recovery", category: "Protein", isGalactagogue: false },
  { id: "lf5", name: "Ghee", nameNe: "घिउ", icon: "🧈", benefit: "Traditional postpartum food, helps healing and energy", category: "Fats", isGalactagogue: false },
  { id: "lf6", name: "Sesame (Til)", nameNe: "तिल", icon: "🫘", benefit: "Calcium-rich, supports bone health during lactation", category: "Seeds", isGalactagogue: true },
  { id: "lf7", name: "Almonds (Badam)", nameNe: "बदाम", icon: "🥜", benefit: "Healthy fats, vitamin E, calcium for milk quality", category: "Nuts", isGalactagogue: false },
  { id: "lf8", name: "Spinach (Palungo)", nameNe: "पालुंगो", icon: "🥬", benefit: "Iron and calcium replenishment after delivery", category: "Greens", isGalactagogue: false },
  { id: "lf9", name: "Cumin (Jeera)", nameNe: "जीरा", icon: "🟤", benefit: "Aids digestion, traditional milk booster", category: "Spices", isGalactagogue: true },
  { id: "lf10", name: "Dried Ginger (Suntho)", nameNe: "सुन्ठो", icon: "🫚", benefit: "Warming, aids digestion, traditional postpartum healing", category: "Spices", isGalactagogue: false },
  { id: "lf11", name: "Jaggery (Gur)", nameNe: "गुड", icon: "🟫", benefit: "Iron-rich natural sweetener, helps with blood loss recovery", category: "Sweetener", isGalactagogue: false },
  { id: "lf12", name: "Fish (Machha)", nameNe: "माछा", icon: "🐟", benefit: "DHA for baby's brain development through breast milk", category: "Protein", isGalactagogue: false },
];

const recoveryMilestones: RecoveryMilestone[] = [
  { id: "r1", week: "Week 1-2", title: "Gentle Rest", description: "Focus on rest, bonding, and basic mobility. Short walks inside the house.", icon: "🏠", completed: true, exerciseLevel: "Rest + gentle movements" },
  { id: "r2", week: "Week 3-4", title: "Light Walking", description: "Short 10-minute walks outside. Begin pelvic floor exercises (Kegels).", icon: "🚶", completed: true, exerciseLevel: "10-15 min gentle walks" },
  { id: "r3", week: "Week 5-6", title: "Gentle Yoga", description: "Postnatal yoga, stretching, continued pelvic floor work. Check for diastasis recti.", icon: "🧘", completed: true, exerciseLevel: "Light yoga + walks" },
  { id: "r4", week: "Week 7-8", title: "Light Exercise", description: "Moderate walking (20-30 min), light bodyweight exercises if cleared by doctor.", icon: "💪", completed: false, exerciseLevel: "Moderate walks + light exercise" },
  { id: "r5", week: "Week 9-12", title: "Building Strength", description: "Gradually increase intensity. Swimming, cycling, strength training if cleared.", icon: "🏋️", completed: false, exerciseLevel: "Progressive strength building" },
  { id: "r6", week: "Month 4+", title: "Full Activity", description: "Return to pre-pregnancy exercise levels. Listen to your body.", icon: "🏃", completed: false, exerciseLevel: "Regular exercise routine" },
];

const feedingLogs: FeedingLog[] = [
  { id: "fl1", time: "06:30 AM", duration: 20, side: "left", type: "breastfeed", notes: "Good latch, baby seemed satisfied" },
  { id: "fl2", time: "09:15 AM", duration: 15, side: "right", type: "breastfeed", notes: "Short feed, baby fell asleep" },
  { id: "fl3", time: "11:00 AM", duration: 10, side: "both", type: "pump", amount: 120, notes: "Pumped for storage" },
  { id: "fl4", time: "12:30 PM", duration: 18, side: "left", type: "breastfeed", notes: "Cluster feeding started" },
  { id: "fl5", time: "01:45 PM", duration: 12, side: "right", type: "breastfeed", notes: "Continuation of cluster feed" },
  { id: "fl6", time: "04:00 PM", duration: 22, side: "both", type: "breastfeed", notes: "Long satisfying feed" },
];

const moodEntries: MoodEntry[] = [
  { id: "m1", date: "2026-02-07", mood: 7, energy: 5, sleep: 4, anxiety: 3, notes: "Better day, baby slept longer" },
  { id: "m2", date: "2026-02-06", mood: 5, energy: 4, sleep: 3, anxiety: 5, notes: "Tired, cluster feeding at night" },
  { id: "m3", date: "2026-02-05", mood: 6, energy: 5, sleep: 5, anxiety: 3, notes: "Good walk outside, felt refreshed" },
  { id: "m4", date: "2026-02-04", mood: 4, energy: 3, sleep: 2, anxiety: 6, notes: "Very little sleep, feeling overwhelmed" },
  { id: "m5", date: "2026-02-03", mood: 7, energy: 6, sleep: 6, anxiety: 2, notes: "Great day, visitors helped a lot" },
];

const ppdScreening = [
  { question: "I have been able to laugh and see the funny side of things", id: "ppd1" },
  { question: "I have looked forward with enjoyment to things", id: "ppd2" },
  { question: "I have blamed myself unnecessarily when things went wrong", id: "ppd3" },
  { question: "I have been anxious or worried for no good reason", id: "ppd4" },
  { question: "I have felt scared or panicky for no good reason", id: "ppd5" },
];

export default function PostpartumPage() {
  const [activeTab, setActiveTab] = useState<PostpartumTab>("overview");
  const [hydrationGlasses, setHydrationGlasses] = useState(5);
  const [showFeedingForm, setShowFeedingForm] = useState(false);
  const [foodFilter, setFoodFilter] = useState<"all" | "galactagogue">("all");

  const tabs: { id: PostpartumTab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "nutrition", label: "Nutrition", icon: "🥗" },
    { id: "recovery", label: "Recovery", icon: "💪" },
    { id: "breastfeeding", label: "Feeding", icon: "🍼" },
    { id: "wellness", label: "Wellness", icon: "💜" },
  ];

  const weeksSinceDelivery = 7;
  const filteredFoods = foodFilter === "all" ? lactationFoods : lactationFoods.filter(f => f.isGalactagogue);
  const todayFeedings = feedingLogs.length;
  const totalFeedingMinutes = feedingLogs.reduce((sum, f) => sum + f.duration, 0);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">🤱 Postpartum &amp; Lactation Support</h1>
        <p className="text-pink-100">Your journey to recovery and motherhood wellness</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-rose-500 text-white"
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
          {/* Timeline */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">👶 Postpartum Journey</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white">
                <div className="text-center">
                  <p className="text-lg font-bold">{weeksSinceDelivery}</p>
                  <p className="text-[10px]">weeks</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-800">Week {weeksSinceDelivery} Postpartum</p>
                <p className="text-xs text-neutral-500">Phase: Early Recovery → Light Exercise</p>
              </div>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full">
              <div className="h-2 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full" style={{ width: `${(weeksSinceDelivery / 12) * 100}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-neutral-400 mt-1">
              <span>Birth</span>
              <span>6 weeks</span>
              <span>12 weeks</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Daily Calories", value: "2,300", icon: "🔥", note: "+500 for breastfeeding", color: "text-orange-600" },
              { label: "Today Feedings", value: todayFeedings.toString(), icon: "🍼", note: `${totalFeedingMinutes} min total`, color: "text-pink-600" },
              { label: "Hydration", value: `${hydrationGlasses}/10`, icon: "💧", note: "glasses today", color: "text-blue-600" },
              { label: "Mood Today", value: "7/10", icon: "😊", note: "Good day", color: "text-emerald-600" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
                <span className="text-2xl">{stat.icon}</span>
                <p className={`text-lg font-bold ${stat.color} mt-2`}>{stat.value}</p>
                <p className="text-xs text-neutral-500">{stat.label}</p>
                <p className="text-xs text-neutral-400">{stat.note}</p>
              </div>
            ))}
          </div>

          {/* Hydration Tracker */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">💧 Hydration Tracker</h2>
            <p className="text-sm text-neutral-500 mb-3">Aim for 10+ glasses daily while breastfeeding</p>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: 10 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setHydrationGlasses(i + 1)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                    i < hydrationGlasses
                      ? "bg-blue-100 border-2 border-blue-400"
                      : "bg-neutral-50 border-2 border-transparent"
                  }`}
                >
                  {i < hydrationGlasses ? "💧" : "⬜"}
                </button>
              ))}
            </div>
            <p className="text-sm text-blue-600 mt-2">{hydrationGlasses >= 8 ? "✅ Great hydration!" : hydrationGlasses >= 5 ? "💪 Keep drinking more water!" : "⚠️ You need more water!"}</p>
          </div>

          {/* Baby Milestones */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">👶 Baby Milestones (Week {weeksSinceDelivery})</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { milestone: "Social smile developing", icon: "😊", status: "on track" },
                { milestone: "Head control improving", icon: "👶", status: "on track" },
                { milestone: "Tracking objects with eyes", icon: "👀", status: "on track" },
                { milestone: "Making cooing sounds", icon: "🗣️", status: "emerging" },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl">
                  <span className="text-xl">{m.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{m.milestone}</p>
                    <span className={`text-xs ${m.status === "on track" ? "text-emerald-600" : "text-amber-600"}`}>✅ {m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Nutrition Tab */}
      {activeTab === "nutrition" && (
        <div className="space-y-6">
          {/* Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFoodFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${foodFilter === "all" ? "bg-rose-500 text-white" : "bg-white text-neutral-600 border border-neutral-200"}`}
            >
              🍽️ All Foods
            </button>
            <button
              onClick={() => setFoodFilter("galactagogue")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${foodFilter === "galactagogue" ? "bg-rose-500 text-white" : "bg-white text-neutral-600 border border-neutral-200"}`}
            >
              🤱 Milk Boosters
            </button>
          </div>

          {/* Food Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredFoods.map(food => (
              <div key={food.id} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{food.icon}</span>
                  <div>
                    <h3 className="font-medium text-neutral-800">{food.name}</h3>
                    <p className="text-xs text-neutral-400">{food.nameNe} • {food.category}</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 mb-2">{food.benefit}</p>
                {food.isGalactagogue && (
                  <span className="inline-block px-2 py-0.5 bg-pink-50 text-pink-600 rounded-full text-xs font-medium">🤱 Galactagogue</span>
                )}
              </div>
            ))}
          </div>

          {/* Sample Meal Plan */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">📋 Nursing Mother&apos;s Daily Meal Plan</h2>
            <p className="text-sm text-neutral-500 mb-3">~2,300 calories (1,800 base + 500 for breastfeeding)</p>
            <div className="space-y-3">
              {[
                { meal: "Early Morning", time: "6:00 AM", items: "Warm water + methi seeds, 3 soaked almonds", icon: "🌅", calories: 120 },
                { meal: "Breakfast", time: "8:00 AM", items: "Oats porridge with ghee, banana, and sesame seeds", icon: "🥣", calories: 450 },
                { meal: "Mid-Morning", time: "10:30 AM", items: "Lassi + dates + walnuts", icon: "🥛", calories: 280 },
                { meal: "Lunch", time: "1:00 PM", items: "Dal bhat, palungo ko saag, chicken tarkari, ghee", icon: "☀️", calories: 600 },
                { meal: "Snack", time: "4:00 PM", items: "Jwano ko lito (ajwain porridge), fruit", icon: "🍲", calories: 200 },
                { meal: "Dinner", time: "7:00 PM", items: "Chapati, mixed dal, fish curry, salad", icon: "🌙", calories: 500 },
                { meal: "Before Bed", time: "9:30 PM", items: "Warm turmeric milk with ghee", icon: "🥛", calories: 150 },
              ].map((meal, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-pink-50 rounded-xl">
                  <span className="text-2xl">{meal.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-neutral-800">{meal.meal}</h3>
                      <span className="text-xs text-neutral-500">{meal.time}</span>
                    </div>
                    <p className="text-sm text-neutral-600">{meal.items}</p>
                  </div>
                  <span className="text-sm font-medium text-rose-600">{meal.calories}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Foods to Avoid */}
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <h2 className="text-lg font-semibold text-amber-800 mb-3">⚠️ Foods to Limit While Breastfeeding</h2>
            <div className="grid md:grid-cols-2 gap-2">
              {[
                { food: "Caffeine (>2 cups)", icon: "☕", reason: "Can make baby fussy" },
                { food: "Alcohol", icon: "🍷", reason: "Passes through breast milk" },
                { food: "Spicy foods (excessive)", icon: "🌶️", reason: "May cause gas in some babies" },
                { food: "High-mercury fish", icon: "🐟", reason: "Mercury transfers to milk" },
                { food: "Peppermint/Sage", icon: "🌿", reason: "May decrease milk supply" },
                { food: "Processed foods", icon: "🍟", reason: "Empty calories, low nutrition" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                  <span>{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-amber-800">{item.food}</p>
                    <p className="text-xs text-amber-600">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recovery Tab */}
      {activeTab === "recovery" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">💪 Recovery Timeline</h2>
            <div className="space-y-3">
              {recoveryMilestones.map((milestone, i) => (
                <div key={milestone.id} className={`p-4 rounded-xl flex items-start gap-4 ${
                  milestone.completed ? "bg-emerald-50 border border-emerald-200" : "bg-neutral-50 border border-neutral-200"
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                    milestone.completed ? "bg-emerald-500 text-white" : "bg-neutral-200 text-neutral-500"
                  }`}>
                    {milestone.completed ? "✅" : milestone.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-neutral-800">{milestone.title}</h3>
                      <span className="text-xs text-neutral-400">{milestone.week}</span>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">{milestone.description}</p>
                    <p className="text-xs text-rose-600 mt-1">🏃 {milestone.exerciseLevel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pelvic Floor */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🧘 Pelvic Floor Exercises</h2>
            <div className="space-y-3">
              {[
                { name: "Kegel Squeeze", reps: "10 reps x 3 sets", instruction: "Squeeze pelvic floor muscles, hold 5 seconds, release", icon: "💪" },
                { name: "Bridge Pose", reps: "10 reps x 2 sets", instruction: "Lie on back, lift hips, squeeze glutes and pelvic floor", icon: "🌉" },
                { name: "Deep Breathing", reps: "5 minutes", instruction: "Diaphragmatic breathing to engage pelvic floor gently", icon: "🫁" },
              ].map((exercise, i) => (
                <div key={i} className="p-3 bg-rose-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{exercise.icon}</span>
                    <h3 className="font-medium text-neutral-800">{exercise.name}</h3>
                    <span className="text-xs text-rose-500">{exercise.reps}</span>
                  </div>
                  <p className="text-sm text-neutral-600">{exercise.instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weight Tracking */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">⚖️ Weight Recovery</h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-neutral-50 rounded-xl p-3 text-center">
                <p className="text-xs text-neutral-500">Pre-pregnancy</p>
                <p className="text-lg font-bold text-neutral-700">58 kg</p>
              </div>
              <div className="bg-neutral-50 rounded-xl p-3 text-center">
                <p className="text-xs text-neutral-500">Current</p>
                <p className="text-lg font-bold text-rose-600">65 kg</p>
              </div>
              <div className="bg-neutral-50 rounded-xl p-3 text-center">
                <p className="text-xs text-neutral-500">Goal</p>
                <p className="text-lg font-bold text-emerald-600">60 kg</p>
              </div>
            </div>
            <p className="text-sm text-neutral-500">💡 Aim to lose 0.5 kg/week maximum while breastfeeding. Don&apos;t restrict calories below 1,800/day.</p>
          </div>
        </div>
      )}

      {/* Breastfeeding Tab */}
      {activeTab === "breastfeeding" && (
        <div className="space-y-6">
          {/* Today's Feeding Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 text-center">
              <p className="text-2xl font-bold text-rose-600">{todayFeedings}</p>
              <p className="text-xs text-neutral-500">Feedings Today</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 text-center">
              <p className="text-2xl font-bold text-blue-600">{totalFeedingMinutes}</p>
              <p className="text-xs text-neutral-500">Total Minutes</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 text-center">
              <p className="text-2xl font-bold text-emerald-600">120</p>
              <p className="text-xs text-neutral-500">ml Pumped</p>
            </div>
          </div>

          {/* Feeding Log */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-neutral-800">🍼 Feeding Log</h2>
              <button
                onClick={() => setShowFeedingForm(true)}
                className="px-3 py-1.5 bg-rose-500 text-white rounded-xl text-sm font-medium hover:bg-rose-600"
              >
                + Log Feed
              </button>
            </div>
            <div className="space-y-2">
              {feedingLogs.map(feed => (
                <div key={feed.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{feed.type === "breastfeed" ? "🤱" : feed.type === "pump" ? "🧴" : "🍼"}</span>
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{feed.time} - {feed.type}</p>
                      <p className="text-xs text-neutral-500">
                        {feed.side} side • {feed.duration} min
                        {feed.amount && ` • ${feed.amount}ml`}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 max-w-[120px] truncate">{feed.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Issues */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">❓ Common Breastfeeding Issues</h2>
            <div className="space-y-3">
              {[
                { issue: "Low Milk Supply", tips: ["Nurse frequently (8-12 times/day)", "Drink plenty of water", "Eat galactagogues (methi, oats)", "Get adequate rest"], icon: "📉" },
                { issue: "Latching Difficulty", tips: ["Position baby tummy-to-tummy", "Wait for wide open mouth", "Bring baby to breast, not breast to baby", "Try different positions"], icon: "🤱" },
                { issue: "Engorgement", tips: ["Apply warm compress before feeding", "Feed frequently", "Hand express to relieve pressure", "Cold compress after feeding"], icon: "😣" },
                { issue: "Sore Nipples", tips: ["Check baby's latch", "Apply breast milk after feeding", "Air dry nipples", "Use lanolin cream"], icon: "⚠️" },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-pink-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{item.icon}</span>
                    <h3 className="font-medium text-neutral-800">{item.issue}</h3>
                  </div>
                  <ul className="space-y-1">
                    {item.tips.map((tip, j) => (
                      <li key={j} className="text-sm text-neutral-600 flex items-start gap-1">
                        <span className="text-emerald-500 text-xs mt-1">✓</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Wellness Tab */}
      {activeTab === "wellness" && (
        <div className="space-y-6">
          {/* PPD Screening */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-2">💜 Mental Health Check-In</h2>
            <p className="text-sm text-neutral-500 mb-4">Edinburgh Postnatal Depression Scale (EPDS) - Quick Check</p>
            <div className="space-y-3">
              {ppdScreening.map((q, i) => (
                <div key={q.id} className="p-3 bg-neutral-50 rounded-xl">
                  <p className="text-sm text-neutral-700 mb-2">{i + 1}. {q.question}</p>
                  <div className="flex gap-2">
                    {["Always", "Often", "Sometimes", "Rarely"].map((option, j) => (
                      <button key={j} className="flex-1 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-600 hover:border-rose-300 transition-colors">
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-neutral-400 mt-3">⚠️ This is not a diagnosis. If you&apos;re struggling, please reach out to a healthcare provider.</p>
          </div>

          {/* Mood Journal */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">📔 Mood Journal</h2>
            <div className="space-y-2">
              {moodEntries.map(entry => (
                <div key={entry.id} className="p-3 bg-neutral-50 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-neutral-700">{new Date(entry.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                    <span className="text-lg">
                      {entry.mood >= 8 ? "😄" : entry.mood >= 6 ? "🙂" : entry.mood >= 4 ? "😐" : "😢"}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    <div className="text-center">
                      <p className="text-xs text-neutral-400">Mood</p>
                      <p className="text-sm font-medium">{entry.mood}/10</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-neutral-400">Energy</p>
                      <p className="text-sm font-medium">{entry.energy}/10</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-neutral-400">Sleep</p>
                      <p className="text-sm font-medium">{entry.sleep}/10</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-neutral-400">Anxiety</p>
                      <p className="text-sm font-medium">{entry.anxiety}/10</p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500">{entry.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Self-Care */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">🧘 Self-Care Reminders</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { activity: "5-minute meditation", icon: "🧘", time: "Morning" },
                { activity: "Take a warm shower", icon: "🚿", time: "Anytime" },
                { activity: "Call a friend or family", icon: "📞", time: "Afternoon" },
                { activity: "Read something you enjoy", icon: "📖", time: "Baby nap time" },
                { activity: "Step outside for fresh air", icon: "🌤️", time: "Daily" },
                { activity: "Accept help from others", icon: "🤝", time: "Always" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{item.activity}</p>
                    <p className="text-xs text-neutral-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Resources */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">📞 Support Resources</h2>
            <div className="space-y-2">
              {[
                { name: "Nepal Mental Health Helpline", contact: "1166", type: "Emergency" },
                { name: "Postpartum Support International", contact: "1-800-944-4773", type: "Helpline" },
                { name: "NepFit Community - New Moms Group", contact: "In-app group", type: "Community" },
                { name: "Lactation Consultant", contact: "Book in Experts section", type: "Professional" },
              ].map((resource, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{resource.name}</p>
                    <p className="text-xs text-purple-600">{resource.contact}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs">{resource.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feeding Form Modal */}
      {showFeedingForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">🍼 Log Feeding</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
                <select className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm">
                  <option>Breastfeed</option>
                  <option>Pump</option>
                  <option>Formula</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Side</label>
                <div className="flex gap-2">
                  {["Left", "Right", "Both"].map(side => (
                    <button key={side} className="flex-1 py-2 border border-neutral-200 rounded-xl text-sm hover:bg-rose-50">{side}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Duration (minutes)</label>
                <input type="number" placeholder="15" className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Notes</label>
                <textarea placeholder="How did the feeding go?" rows={2} className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm"></textarea>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowFeedingForm(false)} className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl text-sm text-neutral-600">Cancel</button>
              <button onClick={() => setShowFeedingForm(false)} className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-medium hover:bg-rose-600">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}