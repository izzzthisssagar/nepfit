"use client";

import { useState } from "react";
import { Card, CardHeader, Button, ProgressBar } from "@/components/ui";
import { useAIBrainStore, useAIInsights } from "@/store/aiBrainStore";

export default function AIBrainPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "knowledge" | "learning" | "settings">("overview");

  const {
    feedbackHistory,
    patterns,
    qValues,
    explorationRate,
    nutritionKnowledge,
    healthGuidelines,
    weights,
    epochs,
    trainingLoss,
    userProfile,
    setUserProfile,
    totalInteractions,
    learningProgress,
    getRecommendations,
  } = useAIBrainStore();

  const insights = useAIInsights();

  const recentFoods = feedbackHistory.slice(-10).map((f) => f.foodId);
  const recommendations = userProfile
    ? getRecommendations(userProfile, recentFoods)
    : [];

  // Calculate stats
  const likedCount = feedbackHistory.filter((f) => f.feedback === "liked").length;
  const dislikedCount = feedbackHistory.filter((f) => f.feedback === "disliked").length;
  const accuracyRate = feedbackHistory.length > 0
    ? Math.round((likedCount / feedbackHistory.length) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <span className="text-3xl">🧠</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">AI Brain</h1>
          <p className="text-neutral-500">
            Your personal nutrition intelligence system
          </p>
        </div>
      </div>

      {/* Learning Progress Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-neutral-900">Learning Progress</h3>
            <p className="text-sm text-neutral-500">
              AI is learning from your {totalInteractions} interactions
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(learningProgress)}%
            </div>
            <p className="text-xs text-neutral-500">trained</p>
          </div>
        </div>
        <ProgressBar
          value={learningProgress}
          max={100}
          color="primary"
          showValue={false}
        />
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-xl p-3">
            <div className="text-xl font-bold text-green-600">{likedCount}</div>
            <div className="text-xs text-neutral-500">Foods Liked</div>
          </div>
          <div className="bg-white rounded-xl p-3">
            <div className="text-xl font-bold text-red-600">{dislikedCount}</div>
            <div className="text-xs text-neutral-500">Foods Disliked</div>
          </div>
          <div className="bg-white rounded-xl p-3">
            <div className="text-xl font-bold text-purple-600">{accuracyRate}%</div>
            <div className="text-xs text-neutral-500">Satisfaction</div>
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="flex bg-neutral-100 rounded-xl p-1 gap-1">
        {[
          { id: "overview", label: "Overview", icon: "📊" },
          { id: "knowledge", label: "Knowledge", icon: "📚" },
          { id: "learning", label: "Neural Net", icon: "🔮" },
          { id: "settings", label: "Settings", icon: "⚙️" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* AI Insights */}
          <Card>
            <CardHeader title="🧠 AI Insights" subtitle="Personalized observations" />
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl"
                >
                  <span className="text-xl">💡</span>
                  <p className="text-neutral-700">{insight}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Card>
              <CardHeader
                title="🎯 AI Recommendations"
                subtitle="Foods tailored for you"
              />
              <div className="space-y-3">
                {recommendations.slice(0, 5).map((rec) => (
                  <div
                    key={rec.foodId}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl"
                  >
                    <div>
                      <h4 className="font-medium text-neutral-900">{rec.foodName}</h4>
                      <p className="text-sm text-neutral-500">
                        {rec.reasons[0] || "Recommended for you"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-600">
                        {Math.round(rec.score)}%
                      </div>
                      <p className="text-xs text-neutral-400">match</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Learned Patterns */}
          {patterns.length > 0 && (
            <Card>
              <CardHeader
                title="📈 Learned Patterns"
                subtitle="Your eating habits"
              />
              <div className="space-y-2">
                {patterns.slice(0, 5).map((pattern, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">
                      {pattern.pattern.replace("_", " ")}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${pattern.weight * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-neutral-500 w-10">
                        {Math.round(pattern.weight * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Knowledge Tab */}
      {activeTab === "knowledge" && (
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="📚 Nutrition Knowledge Base"
              subtitle="AI-learned nutrition facts"
            />
            <div className="space-y-4">
              {nutritionKnowledge.map((knowledge, idx) => (
                <div key={idx} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-neutral-900 capitalize">
                      {knowledge.topic.replace("_", " ")}
                    </h4>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {Math.round(knowledge.confidence * 100)}% confident
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {knowledge.facts.map((fact, factIdx) => (
                      <li key={factIdx} className="text-sm text-neutral-600 flex items-start gap-2">
                        <span className="text-primary-500">•</span>
                        {fact}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-neutral-400 mt-2">
                    Sources: {knowledge.sources.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Health Guidelines */}
          <Card>
            <CardHeader
              title="🏥 Health Guidelines"
              subtitle="Condition-specific recommendations"
            />
            <div className="space-y-4">
              {Object.entries(healthGuidelines).map(([condition, guidelines]) => (
                <details key={condition} className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-3 bg-neutral-50 rounded-xl">
                    <span className="font-medium text-neutral-900 capitalize">
                      {condition.replace("_", " ")}
                    </span>
                    <svg
                      className="w-5 h-5 text-neutral-500 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-2 p-4 bg-neutral-50 rounded-xl space-y-3">
                    <div>
                      <p className="text-xs font-medium text-green-700 mb-1">✓ Recommended</p>
                      <p className="text-sm text-neutral-600">
                        {guidelines.recommended.join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-red-700 mb-1">✗ Avoid</p>
                      <p className="text-sm text-neutral-600">
                        {guidelines.avoid.join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-blue-700 mb-1">💡 Tips</p>
                      <ul className="text-sm text-neutral-600 space-y-1">
                        {guidelines.tips.map((tip, idx) => (
                          <li key={idx}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Neural Network Tab */}
      {activeTab === "learning" && (
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="🔮 Neural Network Status"
              subtitle="Deep learning recommendation engine"
            />
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">{epochs}</div>
                <div className="text-sm text-neutral-500">Training Epochs</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {Object.keys(qValues).length}
                </div>
                <div className="text-sm text-neutral-500">Foods Learned</div>
              </div>
            </div>

            {/* Network Visualization */}
            <div className="bg-neutral-900 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-8">
                {/* Input Layer */}
                <div className="space-y-2">
                  <p className="text-xs text-neutral-400 mb-2">Input</p>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full bg-green-500 animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>

                {/* Connections */}
                <div className="text-neutral-600">→</div>

                {/* Hidden Layer */}
                <div className="space-y-2">
                  <p className="text-xs text-neutral-400 mb-2">Hidden</p>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full bg-purple-500 animate-pulse"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>

                {/* Connections */}
                <div className="text-neutral-600">→</div>

                {/* Output Layer */}
                <div className="space-y-2">
                  <p className="text-xs text-neutral-400 mb-2">Output</p>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full bg-pink-500 animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-neutral-400 text-xs mt-4">
                Neural network processing your preferences in real-time
              </p>
            </div>

            {/* Training Loss */}
            {trainingLoss.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-neutral-700 mb-2">
                  Training Loss History
                </h4>
                <div className="h-20 flex items-end gap-1">
                  {trainingLoss.slice(-20).map((loss, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-purple-500 rounded-t"
                      style={{ height: `${Math.max(10, (1 - loss) * 100)}%` }}
                    />
                  ))}
                </div>
                <p className="text-xs text-neutral-400 mt-2 text-center">
                  Lower loss = better predictions
                </p>
              </div>
            )}

            {/* Exploration Rate */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-700">Exploration Rate</span>
                <span className="text-sm font-medium">
                  {Math.round(explorationRate * 100)}%
                </span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                  style={{ width: `${explorationRate * 100}%` }}
                />
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Higher = more variety in recommendations
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="⚙️ AI Settings"
              subtitle="Customize your AI experience"
            />

            <div className="space-y-4">
              {/* Health Conditions */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Health Conditions
                </label>
                <div className="flex flex-wrap gap-2">
                  {["diabetes", "hypertension", "weight_loss", "muscle_gain"].map(
                    (condition) => (
                      <button
                        key={condition}
                        onClick={() => {
                          const current = userProfile?.healthConditions || [];
                          const updated = current.includes(condition)
                            ? current.filter((c) => c !== condition)
                            : [...current, condition];
                          setUserProfile({
                            ...userProfile,
                            goals: userProfile?.goals || [],
                            restrictions: userProfile?.restrictions || [],
                            allergies: userProfile?.allergies || [],
                            preferences: userProfile?.preferences || {
                              spiceLevel: "medium",
                              cuisinePreferences: [],
                              mealTimings: { breakfast: "8:00", lunch: "13:00", dinner: "20:00" },
                            },
                            healthConditions: updated,
                          });
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          userProfile?.healthConditions?.includes(condition)
                            ? "bg-purple-500 text-white"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                      >
                        {condition.replace("_", " ")}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Goals */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nutrition Goals
                </label>
                <div className="flex flex-wrap gap-2">
                  {["lose weight", "gain muscle", "maintain weight", "eat healthier", "more protein"].map(
                    (goal) => (
                      <button
                        key={goal}
                        onClick={() => {
                          const current = userProfile?.goals || [];
                          const updated = current.includes(goal)
                            ? current.filter((g) => g !== goal)
                            : [...current, goal];
                          setUserProfile({
                            ...userProfile,
                            goals: updated,
                            restrictions: userProfile?.restrictions || [],
                            allergies: userProfile?.allergies || [],
                            preferences: userProfile?.preferences || {
                              spiceLevel: "medium",
                              cuisinePreferences: [],
                              mealTimings: { breakfast: "8:00", lunch: "13:00", dinner: "20:00" },
                            },
                            healthConditions: userProfile?.healthConditions || [],
                          });
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          userProfile?.goals?.includes(goal)
                            ? "bg-green-500 text-white"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                      >
                        {goal}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Allergies & Restrictions
                </label>
                <div className="flex flex-wrap gap-2">
                  {["vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free", "halal"].map(
                    (item) => (
                      <button
                        key={item}
                        onClick={() => {
                          const current = userProfile?.allergies || [];
                          const updated = current.includes(item)
                            ? current.filter((a) => a !== item)
                            : [...current, item];
                          setUserProfile({
                            ...userProfile,
                            goals: userProfile?.goals || [],
                            restrictions: userProfile?.restrictions || [],
                            allergies: updated,
                            preferences: userProfile?.preferences || {
                              spiceLevel: "medium",
                              cuisinePreferences: [],
                              mealTimings: { breakfast: "8:00", lunch: "13:00", dinner: "20:00" },
                            },
                            healthConditions: userProfile?.healthConditions || [],
                          });
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          userProfile?.allergies?.includes(item)
                            ? "bg-red-500 text-white"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader title="📊 Data Management" />
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                <div>
                  <p className="font-medium text-neutral-900">Feedback History</p>
                  <p className="text-sm text-neutral-500">
                    {feedbackHistory.length} interactions stored
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                <div>
                  <p className="font-medium text-neutral-900">Neural Weights</p>
                  <p className="text-sm text-neutral-500">
                    {epochs} training epochs completed
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
