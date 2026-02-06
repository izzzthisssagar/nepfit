"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, Button } from "@/components/ui";
import { useFoodLogStore, getTodayDateString } from "@/store/foodLogStore";
import { useUserStore } from "@/store/userStore";
import { getAIBrain, type FoodKnowledge } from "@/lib/ai/brain";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  learningData?: {
    type: "recommendation" | "fact" | "tip";
    items?: Array<{ food: FoodKnowledge; score: number; reason: string }>;
  };
}

interface AIContext {
  todayCalories: number;
  todayProtein: number;
  calorieGoal: number;
  proteinGoal: number;
  waterGlasses: number;
  mealType: string;
  timeOfDay: string;
}

// Time of day helper
const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour < 11) return "morning";
  if (hour < 15) return "afternoon";
  if (hour < 19) return "evening";
  return "night";
};

// Current meal type helper
const getMealType = (): string => {
  const hour = new Date().getHours();
  if (hour < 10) return "breakfast";
  if (hour < 14) return "lunch";
  if (hour < 18) return "snack";
  return "dinner";
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { getDailyLog } = useFoodLogStore();
  const { targets } = useUserStore();

  const todayDate = getTodayDateString();
  const dailyLog = getDailyLog(todayDate);

  // Get AI Brain instance
  const brain = typeof window !== 'undefined' ? getAIBrain() : null;

  // Context for AI responses
  const context: AIContext = {
    todayCalories: dailyLog.totalNutrition.calories,
    todayProtein: dailyLog.totalNutrition.protein,
    calorieGoal: targets?.dailyCalories || 2000,
    proteinGoal: targets?.macros?.protein || 90,
    waterGlasses: dailyLog.water,
    mealType: getMealType(),
    timeOfDay: getTimeOfDay(),
  };

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const stats = brain?.getStats();
      const welcomeMessage: Message = {
        id: "welcome",
        role: "assistant",
        content: `Namaste! 🙏 I'm your NepFit **Advanced AI** nutrition assistant.

🧠 **AI Capabilities:**
• **Deep Learning** - Personalized food recommendations
• **Self-Learning** - I improve with every interaction
• **Reinforcement Learning** - I learn from your feedback
• **Knowledge Base** - ${stats?.uniqueFoodsLearned || 15}+ foods learned

${stats && stats.totalInteractions > 0
  ? `📊 I've learned from ${stats.totalInteractions} of your interactions!`
  : `🌟 Start interacting and I'll learn your preferences!`}

How can I help you today?`,
        timestamp: new Date(),
        suggestions: [
          "What should I eat now?",
          "Check my progress",
          "Show AI learning stats",
        ],
      };
      setMessages([welcomeMessage]);
    }
  }, [brain, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Advanced AI Response Generator
  const generateAIResponse = useCallback(
    (userMessage: string): { content: string; suggestions: string[]; learningData?: Message["learningData"] } => {
      const lowerMessage = userMessage.toLowerCase();

      // Greeting responses
      if (lowerMessage.match(/^(hi|hello|hey|namaste)/)) {
        const tip = brain?.getHealthTip("general");
        return {
          content: `Namaste! 🙏 Great to see you!

**Your Status Today:**
• Calories: ${context.todayCalories} / ${context.calorieGoal} (${Math.round((context.todayCalories / context.calorieGoal) * 100)}%)
• Protein: ${context.todayProtein}g / ${context.proteinGoal}g
• Water: ${context.waterGlasses} / 8 glasses

💡 **Today's Tip:** ${tip?.tip || "Stay consistent with your nutrition goals!"}

What would you like help with?`,
          suggestions: [
            `What should I eat for ${context.mealType}?`,
            "High protein options",
            "Check my learning",
          ],
        };
      }

      // Show AI stats
      if (lowerMessage.match(/(stats|learning|brain|ai status|intelligence|show.*learning)/)) {
        const stats = brain?.getStats();
        if (!stats) {
          return {
            content: "AI stats not available yet. Keep interacting and I'll learn!",
            suggestions: ["Recommend food", "Check progress"],
          };
        }

        return {
          content: `🧠 **AI Learning Statistics**

**Learning Progress:**
• Total Interactions: ${stats.totalInteractions}
• Foods Learned: ${stats.uniqueFoodsLearned}
• Learning Rate: ${(stats.learningRate * 100).toFixed(0)}%
• Exploration Rate: ${(stats.explorationRate * 100).toFixed(0)}%

**Neural Network Weights:**
• Protein Preference: ${(stats.neuralWeights.proteinPreference * 100).toFixed(0)}%
• Health Focus: ${(stats.neuralWeights.healthFocus * 100).toFixed(0)}%
• Traditional Food: ${(stats.neuralWeights.traditionPreference * 100).toFixed(0)}%
• Calorie Preference: ${stats.neuralWeights.caloriePreference > 0 ? "Higher" : "Lower"}

**Your Top Preferences:**
${stats.topPreferences.length > 0
  ? stats.topPreferences.map((p, i) => `${i + 1}. ${p.food} (${(p.score * 100).toFixed(0)}% match)`).join('\n')
  : "Still learning your preferences..."}

*I continuously improve as you interact with me!* 🚀`,
          suggestions: [
            "Self-learn now",
            "Recommend food",
            "Reset AI",
          ],
        };
      }

      // Trigger self-learning
      if (lowerMessage.match(/(self.?learn|improve|optimize|train)/)) {
        const result = brain?.performSelfLearning();
        return {
          content: `🧠 **Self-Learning Complete!**

**Patterns Found:**
${result?.patternsFound.length ? result.patternsFound.map(p => `• ${p}`).join('\n') : '• Still collecting data...'}

**Adjustments Made:**
${result?.adjustmentsMade.length ? result.adjustmentsMade.map(a => `• ${a}`).join('\n') : '• No adjustments needed yet'}

*My recommendations will now be more accurate!*`,
          suggestions: ["Show new recommendations", "Check stats", "What should I eat?"],
        };
      }

      // Reset AI
      if (lowerMessage.match(/(reset|clear|forget|start over)/)) {
        brain?.reset();
        return {
          content: `🔄 **AI Brain Reset Complete!**

All my learning has been cleared. I'm starting fresh!

Don't worry - I'll quickly learn your preferences again as you:
• Log foods
• Give feedback on recommendations
• Interact with me

Let's start fresh! What would you like to eat?`,
          suggestions: ["Recommend breakfast", "Show healthy options", "Help me plan meals"],
        };
      }

      // Progress check
      if (lowerMessage.match(/(how am i doing|my progress|today's status|check my|summary)/)) {
        const caloriePercent = Math.round((context.todayCalories / context.calorieGoal) * 100);
        const proteinPercent = Math.round((context.todayProtein / context.proteinGoal) * 100);
        const remaining = context.calorieGoal - context.todayCalories;

        let insight = "";
        if (caloriePercent < 50) {
          insight = "You have plenty of room for a substantial meal!";
        } else if (caloriePercent < 80) {
          insight = "You're on track! A moderate meal would fit nicely.";
        } else if (caloriePercent < 100) {
          insight = "Almost at your goal - consider a light option if hungry.";
        } else {
          insight = "You've exceeded your goal. Consider lighter options.";
        }

        const fact = brain?.getNutritionFact();

        return {
          content: `📊 **Your Progress Today**

**Calories:** ${context.todayCalories} / ${context.calorieGoal} (${caloriePercent}%)
${'█'.repeat(Math.min(10, Math.round(caloriePercent / 10)))}${'░'.repeat(Math.max(0, 10 - Math.round(caloriePercent / 10)))}

**Protein:** ${context.todayProtein}g / ${context.proteinGoal}g (${proteinPercent}%)
${'█'.repeat(Math.min(10, Math.round(proteinPercent / 10)))}${'░'.repeat(Math.max(0, 10 - Math.round(proteinPercent / 10)))}

**Water:** ${context.waterGlasses} / 8 glasses 💧

**Remaining:** ${remaining > 0 ? remaining : 0} calories

💡 *${insight}*

📚 **Did you know?** ${fact?.fact || "Balanced nutrition is key to health!"}`,
          suggestions: [
            remaining > 300 ? "Suggest a meal" : "Light snack ideas",
            "High protein options",
            "What should I avoid?",
          ],
        };
      }

      // Food recommendations (AI-powered)
      if (lowerMessage.match(/(what should i eat|recommend|suggest|meal idea|hungry|food)/)) {
        const remaining = context.calorieGoal - context.todayCalories;
        const proteinNeeded = context.proteinGoal - context.todayProtein;

        const recommendations = brain?.getRecommendations({
          mealType: context.mealType,
          remainingCalories: remaining,
          proteinNeeded: proteinNeeded,
          timeOfDay: context.timeOfDay,
          count: 5,
        });

        if (!recommendations || recommendations.length === 0) {
          return {
            content: "I'm still learning your preferences. Try some foods and give me feedback!",
            suggestions: ["Show all foods", "Popular choices", "Healthy options"],
          };
        }

        const topRecs = recommendations.slice(0, 3);

        return {
          content: `🍽️ **AI-Powered Recommendations for ${context.mealType.charAt(0).toUpperCase() + context.mealType.slice(1)}**

Based on my deep learning analysis of your preferences and nutritional needs:

${topRecs.map((rec, i) => `**${i + 1}. ${rec.food.name}** (${Math.round(rec.score * 100)}% match)
   📊 ${rec.food.nutrition.calories} cal | ${rec.food.nutrition.protein}g protein
   💡 *${rec.reason}*
   ✨ ${rec.food.benefits.slice(0, 2).join(', ')}`).join('\n\n')}

**Your Budget:** ${remaining} calories | ${proteinNeeded}g protein needed

*Rate these recommendations to help me learn!* 👍👎`,
          suggestions: [
            `I like ${topRecs[0]?.food.name}`,
            `Not ${topRecs[0]?.food.name}`,
            "More options",
          ],
          learningData: {
            type: "recommendation",
            items: recommendations,
          },
        };
      }

      // Positive feedback - reinforcement learning
      if (lowerMessage.match(/(i like|love|great|good|perfect|yes|👍|thanks|thank you)/)) {
        const foodMatch = lowerMessage.match(/like\s+(\w+(?:\s+\w+)?)/i);
        const foodName = foodMatch ? foodMatch[1] : lastFeedback;

        if (foodName && brain) {
          brain.recordLearningEvent({
            type: 'positive_feedback',
            food: foodName,
            context: { timeOfDay: context.timeOfDay, mealType: context.mealType },
            reward: 0.8,
          });
        }

        return {
          content: `✅ **Feedback Recorded!**

I've learned that you ${foodName ? `like **${foodName}**` : 'appreciate these recommendations'}!

🧠 My neural network has been updated:
• Your preference weights adjusted
• Future recommendations improved
• Learning score: +0.8

*Thank you! This helps me serve you better.*`,
          suggestions: ["More recommendations", "Check my progress", "Show AI stats"],
        };
      }

      // Negative feedback - reinforcement learning
      if (lowerMessage.match(/(don't like|dislike|hate|bad|no|👎|not|avoid)/)) {
        const foodMatch = lowerMessage.match(/(?:don't like|not|hate|dislike|avoid)\s+(\w+(?:\s+\w+)?)/i);
        const foodName = foodMatch ? foodMatch[1] : lastFeedback;

        if (foodName && brain) {
          brain.recordLearningEvent({
            type: 'negative_feedback',
            food: foodName,
            context: { timeOfDay: context.timeOfDay, mealType: context.mealType },
            reward: -0.8,
          });
        }

        return {
          content: `📝 **Feedback Noted!**

I've learned that you ${foodName ? `don't prefer **${foodName}**` : 'didn\'t like those options'}.

🧠 My neural network updated:
• Preference weights decreased
• Will suggest alternatives
• Learning score: -0.8

*Let me find better options for you!*`,
          suggestions: ["Show different options", "What do you recommend instead?", "Healthy alternatives"],
        };
      }

      // Protein advice
      if (lowerMessage.match(/(protein|high protein|more protein)/)) {
        const proteinDeficit = context.proteinGoal - context.todayProtein;
        const proteinRecs = brain?.getRecommendations({
          mealType: context.mealType,
          remainingCalories: context.calorieGoal - context.todayCalories,
          proteinNeeded: proteinDeficit,
          timeOfDay: context.timeOfDay,
          count: 5,
        }).filter(r => r.food.nutrition.protein >= 15);

        return {
          content: `💪 **High Protein Recommendations**

**Your Status:** ${context.todayProtein}g / ${context.proteinGoal}g (need ${proteinDeficit}g more)

**AI-Selected High Protein Foods:**
${proteinRecs?.slice(0, 4).map((rec, i) =>
  `${i + 1}. **${rec.food.name}** - ${rec.food.nutrition.protein}g protein (${rec.food.nutrition.calories} cal)`
).join('\n') || '• Eggs (6g per egg)\n• Paneer (18g per 100g)\n• Chicken (25g per 100g)\n• Dal (9g per 100g)'}

🧠 *Based on your learned preferences and ${context.timeOfDay} eating patterns*`,
          suggestions: [
            proteinRecs?.[0] ? `I want ${proteinRecs[0].food.name}` : "More protein ideas",
            "Vegetarian protein",
            "Quick protein snacks",
          ],
        };
      }

      // Weight loss
      if (lowerMessage.match(/(weight loss|lose weight|diet|fat loss)/)) {
        const tip = brain?.getHealthTip("weight_loss");
        return {
          content: `📉 **Weight Loss Guidance**

**Smart Eating Strategy:**
1. **Calorie Deficit** - Stay within ${context.calorieGoal} cal/day
2. **High Protein** - ${context.proteinGoal}g keeps you full
3. **Fiber Rich** - Dal, vegetables, whole grains
4. **Hydration** - Aim for 8+ glasses water

**AI Tip:** ${tip?.tip || "Eat protein at every meal to boost metabolism"}

**Your Today:** ${context.todayCalories} cal consumed
${context.todayCalories < context.calorieGoal
  ? `✅ You're ${context.calorieGoal - context.todayCalories} cal under goal!`
  : `⚠️ You're ${context.todayCalories - context.calorieGoal} cal over goal`}

*I'll learn your successful patterns and suggest more of what works!*`,
          suggestions: ["Low calorie meal", "Healthy snacks", "Show my patterns"],
        };
      }

      // Default intelligent response
      const fact = brain?.getNutritionFact();
      return {
        content: `I understand you're asking about "${userMessage}".

As your **AI-powered** nutrition assistant, I can help with:

🍽️ **Smart Recommendations** - Personalized food suggestions
📊 **Progress Tracking** - Your daily nutrition status
🧠 **Learning** - I improve with your feedback
💡 **Knowledge** - Nutrition facts and tips

**Random Fact:** ${fact?.fact || "Balanced nutrition is the foundation of good health!"}

What would you like to explore?`,
        suggestions: [
          "What should I eat?",
          "Check my progress",
          "Show AI capabilities",
        ],
      };
    },
    [brain, context, lastFeedback]
  );

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Store for potential feedback reference
    setLastFeedback(messageText);

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const { content, suggestions, learningData } = generateAIResponse(messageText);

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content,
        timestamp: new Date(),
        suggestions,
        learningData,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Record food consumption for learning
  const handleFoodClick = (food: FoodKnowledge) => {
    if (brain) {
      brain.recordLearningEvent({
        type: 'consumption',
        food: food.name,
        context: { timeOfDay: context.timeOfDay, mealType: context.mealType },
        reward: 0.5,
      });
    }
    handleSend(`Tell me more about ${food.name}`);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] flex flex-col pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center animate-pulse">
          <span className="text-2xl">🧠</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-neutral-900">NepFit AI Brain</h1>
          <p className="text-sm text-neutral-500">
            Deep Learning • Self-Improving • {brain?.getStats().totalInteractions || 0} interactions
          </p>
        </div>
        <div className="flex-1" />
        <button
          onClick={() => setShowStats(!showStats)}
          className="px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-all"
        >
          {showStats ? "Hide Stats" : "🧠 AI Stats"}
        </button>
      </div>

      {/* Quick Stats Bar */}
      {showStats && brain && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 mb-4 grid grid-cols-4 gap-3 text-center">
          <div>
            <p className="text-xs text-neutral-500">Interactions</p>
            <p className="font-bold text-purple-600">{brain.getStats().totalInteractions}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Foods Learned</p>
            <p className="font-bold text-pink-600">{brain.getStats().uniqueFoodsLearned}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Learning Rate</p>
            <p className="font-bold text-orange-600">{(brain.getStats().learningRate * 100).toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Exploration</p>
            <p className="font-bold text-green-600">{(brain.getStats().explorationRate * 100).toFixed(0)}%</p>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <Card className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              <div
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white"
                      : "bg-neutral-100 text-neutral-900"
                  }`}
                >
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: message.content
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*(.*?)\*/g, "<em>$1</em>")
                        .replace(/\n/g, "<br />"),
                    }}
                  />
                  <p
                    className={`text-xs mt-2 ${
                      message.role === "user" ? "text-primary-100" : "text-neutral-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Clickable Food Recommendations */}
              {message.learningData?.items && (
                <div className="flex flex-wrap gap-2 mt-2 ml-2">
                  {message.learningData.items.slice(0, 3).map((item) => (
                    <button
                      key={item.food.name}
                      onClick={() => handleFoodClick(item.food)}
                      className="px-3 py-1.5 text-sm bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-full hover:from-purple-200 hover:to-pink-200 transition-all flex items-center gap-2"
                    >
                      <span>🍽️</span>
                      <span>{item.food.name}</span>
                      <span className="text-xs text-purple-600">{Math.round(item.score * 100)}%</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {message.role === "assistant" && message.suggestions && !message.learningData?.items && (
                <div className="flex flex-wrap gap-2 mt-2 ml-2">
                  {message.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(suggestion)}
                      className="px-3 py-1.5 text-sm bg-white border border-neutral-200 rounded-full hover:border-primary-300 hover:text-primary-600 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4">
                <div className="flex gap-1 items-center">
                  <span className="text-sm text-purple-600 mr-2">AI thinking</span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <span
                    className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-neutral-200 p-4">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask AI for personalized nutrition advice..."
              className="flex-1 px-4 py-3 bg-neutral-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              className="px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {[
              { icon: "🍽️", label: "Smart Recommend", action: "What should I eat?" },
              { icon: "📊", label: "My Progress", action: "Check my progress" },
              { icon: "🧠", label: "AI Learning", action: "Show AI learning stats" },
              { icon: "💪", label: "Protein Boost", action: "High protein options" },
              { icon: "🔄", label: "Self-Learn", action: "Run self-learning" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => handleSend(item.action)}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 text-sm whitespace-nowrap transition-all"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
