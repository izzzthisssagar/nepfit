"use client";

import { useState } from "react";

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: "discount" | "product" | "experience" | "donation";
  image: string;
  available: boolean;
  expiresIn?: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointsEarned: number;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface PointsHistory {
  id: string;
  action: string;
  points: number;
  date: Date;
  type: "earned" | "spent";
}

interface Tier {
  name: string;
  minPoints: number;
  maxPoints: number;
  benefits: string[];
  color: string;
  icon: string;
}

const tiers: Tier[] = [
  {
    name: "Bronze",
    minPoints: 0,
    maxPoints: 999,
    benefits: ["Basic rewards access", "Weekly challenges"],
    color: "from-amber-600 to-amber-700",
    icon: "🥉",
  },
  {
    name: "Silver",
    minPoints: 1000,
    maxPoints: 4999,
    benefits: ["10% bonus points", "Exclusive challenges", "Priority support"],
    color: "from-gray-400 to-gray-500",
    icon: "🥈",
  },
  {
    name: "Gold",
    minPoints: 5000,
    maxPoints: 14999,
    benefits: ["25% bonus points", "VIP rewards", "Early access", "Free shipping"],
    color: "from-yellow-500 to-amber-500",
    icon: "🥇",
  },
  {
    name: "Platinum",
    minPoints: 15000,
    maxPoints: Infinity,
    benefits: ["50% bonus points", "Exclusive products", "Personal nutritionist", "Annual gift"],
    color: "from-purple-500 to-indigo-600",
    icon: "💎",
  },
];

const rewards: Reward[] = [
  {
    id: "1",
    name: "20% Off Supplements",
    description: "Get 20% off any supplement in the marketplace",
    pointsCost: 500,
    category: "discount",
    image: "💊",
    available: true,
    expiresIn: "30 days",
  },
  {
    id: "2",
    name: "Free Premium Week",
    description: "One week of NepFit Premium for free",
    pointsCost: 1000,
    category: "experience",
    image: "⭐",
    available: true,
  },
  {
    id: "3",
    name: "Nutrition Consultation",
    description: "30-minute video call with a registered dietitian",
    pointsCost: 2500,
    category: "experience",
    image: "👨‍⚕️",
    available: true,
  },
  {
    id: "4",
    name: "Branded Water Bottle",
    description: "NepFit stainless steel water bottle",
    pointsCost: 1500,
    category: "product",
    image: "🍶",
    available: true,
  },
  {
    id: "5",
    name: "Meal Prep Container Set",
    description: "Set of 10 glass meal prep containers",
    pointsCost: 2000,
    category: "product",
    image: "📦",
    available: false,
  },
  {
    id: "6",
    name: "Donate to Food Bank",
    description: "Donate equivalent of 10 meals to local food bank",
    pointsCost: 500,
    category: "donation",
    image: "❤️",
    available: true,
  },
  {
    id: "7",
    name: "Recipe Book",
    description: "Digital cookbook with 100 healthy recipes",
    pointsCost: 800,
    category: "product",
    image: "📚",
    available: true,
  },
  {
    id: "8",
    name: "$50 Store Credit",
    description: "Credit for the NepFit marketplace",
    pointsCost: 3000,
    category: "discount",
    image: "💵",
    available: true,
  },
];

const achievements: Achievement[] = [
  {
    id: "1",
    name: "First Steps",
    description: "Log your first meal",
    icon: "🎯",
    pointsEarned: 50,
    unlockedAt: new Date(Date.now() - 86400000 * 30),
  },
  {
    id: "2",
    name: "Week Warrior",
    description: "Log meals for 7 consecutive days",
    icon: "🔥",
    pointsEarned: 200,
    unlockedAt: new Date(Date.now() - 86400000 * 20),
  },
  {
    id: "3",
    name: "Hydration Hero",
    description: "Meet water goal for 30 days",
    icon: "💧",
    pointsEarned: 500,
    progress: 22,
    maxProgress: 30,
  },
  {
    id: "4",
    name: "Recipe Master",
    description: "Create 10 custom recipes",
    icon: "👨‍🍳",
    pointsEarned: 300,
    progress: 7,
    maxProgress: 10,
  },
  {
    id: "5",
    name: "Community Champion",
    description: "Help 50 users with advice",
    icon: "🤝",
    pointsEarned: 1000,
    progress: 28,
    maxProgress: 50,
  },
  {
    id: "6",
    name: "Century Club",
    description: "Log 100 meals",
    icon: "💯",
    pointsEarned: 500,
    unlockedAt: new Date(Date.now() - 86400000 * 5),
  },
];

const pointsHistory: PointsHistory[] = [
  { id: "1", action: "Daily login bonus", points: 10, date: new Date(), type: "earned" },
  { id: "2", action: "Completed meal logging", points: 20, date: new Date(), type: "earned" },
  { id: "3", action: "Water goal achieved", points: 15, date: new Date(Date.now() - 86400000), type: "earned" },
  { id: "4", action: "Redeemed: 20% Off Coupon", points: -500, date: new Date(Date.now() - 86400000 * 2), type: "spent" },
  { id: "5", action: "Weekly challenge completed", points: 100, date: new Date(Date.now() - 86400000 * 3), type: "earned" },
  { id: "6", action: "Referred a friend", points: 500, date: new Date(Date.now() - 86400000 * 5), type: "earned" },
];

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<"rewards" | "achievements" | "history" | "tiers">("rewards");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const currentPoints = 2750;
  const lifetimePoints = 8500;
  const currentTier = tiers.find(
    (t) => lifetimePoints >= t.minPoints && lifetimePoints < t.maxPoints
  ) || tiers[0];
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];

  const filteredRewards =
    selectedCategory === "all"
      ? rewards
      : rewards.filter((r) => r.category === selectedCategory);

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case "discount":
        return "🏷️";
      case "product":
        return "📦";
      case "experience":
        return "✨";
      case "donation":
        return "❤️";
      default:
        return "🎁";
    }
  };

  const handleRedeem = (reward: Reward) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Rewards & Loyalty</h1>
          <p className="text-gray-600 mt-1">Earn points and redeem amazing rewards</p>
        </div>

        {/* Points Overview */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-violet-200 text-sm">Available Points</p>
              <p className="text-4xl font-bold">{currentPoints.toLocaleString()}</p>
              <p className="text-violet-200 text-sm mt-1">
                Lifetime: {lifetimePoints.toLocaleString()} points
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="text-4xl">{currentTier.icon}</span>
                <p className="text-sm font-medium mt-1">{currentTier.name} Member</p>
              </div>
              {nextTier && (
                <div className="text-right">
                  <p className="text-xs text-violet-200">Next tier</p>
                  <p className="font-medium">{nextTier.name}</p>
                  <p className="text-xs text-violet-200">
                    {(nextTier.minPoints - lifetimePoints).toLocaleString()} points to go
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Progress to next tier */}
          {nextTier && (
            <div className="mt-4">
              <div className="h-2 bg-violet-400/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{
                    width: `${
                      ((lifetimePoints - currentTier.minPoints) /
                        (nextTier.minPoints - currentTier.minPoints)) *
                      100
                    }%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-violet-200">
                <span>{currentTier.minPoints.toLocaleString()}</span>
                <span>{nextTier.minPoints.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { icon: "📝", label: "Log Meal", points: "+20" },
            { icon: "💧", label: "Water Goal", points: "+15" },
            { icon: "🏃", label: "Exercise", points: "+30" },
            { icon: "👥", label: "Refer Friend", points: "+500" },
          ].map((action, idx) => (
            <button
              key={idx}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <span className="text-2xl">{action.icon}</span>
              <p className="text-sm text-gray-700 mt-1">{action.label}</p>
              <p className="text-xs text-violet-600 font-medium">{action.points}</p>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "rewards", label: "Rewards", icon: "🎁" },
            { id: "achievements", label: "Achievements", icon: "🏆" },
            { id: "history", label: "History", icon: "📜" },
            { id: "tiers", label: "Tiers", icon: "👑" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-violet-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-violet-50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Rewards Tab */}
        {activeTab === "rewards" && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { id: "all", label: "All Rewards" },
                { id: "discount", label: "Discounts" },
                { id: "product", label: "Products" },
                { id: "experience", label: "Experiences" },
                { id: "donation", label: "Donate" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-violet-100 text-violet-700"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {cat.id !== "all" && getCategoryIcon(cat.id)} {cat.label}
                </button>
              ))}
            </div>

            {/* Rewards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden ${
                    !reward.available ? "opacity-60" : ""
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-4xl">{reward.image}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          reward.category === "discount"
                            ? "bg-green-100 text-green-700"
                            : reward.category === "product"
                            ? "bg-blue-100 text-blue-700"
                            : reward.category === "experience"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {reward.category}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900">{reward.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
                    {reward.expiresIn && (
                      <p className="text-xs text-orange-600 mt-2">
                        Valid for {reward.expiresIn}
                      </p>
                    )}
                  </div>
                  <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-violet-600">
                        {reward.pointsCost.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">points</span>
                    </div>
                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={!reward.available || currentPoints < reward.pointsCost}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        reward.available && currentPoints >= reward.pointsCost
                          ? "bg-violet-600 text-white hover:bg-violet-700"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {!reward.available
                        ? "Out of Stock"
                        : currentPoints < reward.pointsCost
                        ? "Not Enough"
                        : "Redeem"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <p className="text-2xl font-bold text-violet-600">
                  {achievements.filter((a) => a.unlockedAt).length}
                </p>
                <p className="text-sm text-gray-500">Unlocked</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <p className="text-2xl font-bold text-violet-600">
                  {achievements.filter((a) => !a.unlockedAt).length}
                </p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <p className="text-2xl font-bold text-violet-600">
                  {achievements
                    .filter((a) => a.unlockedAt)
                    .reduce((sum, a) => sum + a.pointsEarned, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Points Earned</p>
              </div>
            </div>

            {/* Achievements List */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">All Achievements</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 flex items-center gap-4 ${
                      achievement.unlockedAt ? "" : "opacity-70"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                        achievement.unlockedAt
                          ? "bg-violet-100"
                          : "bg-gray-100"
                      }`}
                    >
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                        {achievement.unlockedAt && (
                          <span className="text-xs text-green-600">✓ Unlocked</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{achievement.description}</p>
                      {achievement.progress !== undefined && !achievement.unlockedAt && (
                        <div className="mt-2">
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-violet-500 rounded-full"
                              style={{
                                width: `${
                                  (achievement.progress / (achievement.maxProgress || 1)) * 100
                                }%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {achievement.progress} / {achievement.maxProgress}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-violet-600">
                        +{achievement.pointsEarned}
                      </span>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Points History</h3>
                <p className="text-sm text-gray-500">Track your earnings and redemptions</p>
              </div>
              <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>All Time</option>
                <option>This Month</option>
                <option>This Week</option>
              </select>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {pointsHistory.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.type === "earned"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.type === "earned" ? "+" : "-"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.action}</p>
                        <p className="text-sm text-gray-500">
                          {item.date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-lg font-bold ${
                        item.type === "earned" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.type === "earned" ? "+" : ""}
                      {item.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Summary */}
            <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">This Month's Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Points Earned</p>
                  <p className="text-2xl font-bold text-green-600">+1,245</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Points Spent</p>
                  <p className="text-2xl font-bold text-red-600">-500</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tiers Tab */}
        {activeTab === "tiers" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Loyalty Tiers</h3>
              <p className="text-gray-600 text-sm">
                Earn lifetime points to unlock higher tiers and better benefits
              </p>
            </div>

            <div className="space-y-4">
              {tiers.map((tier, idx) => {
                const isCurrentTier = tier.name === currentTier.name;
                const isUnlocked = lifetimePoints >= tier.minPoints;

                return (
                  <div
                    key={tier.name}
                    className={`bg-white rounded-2xl shadow-sm overflow-hidden ${
                      isCurrentTier ? "ring-2 ring-violet-500" : ""
                    }`}
                  >
                    <div
                      className={`p-4 bg-gradient-to-r ${tier.color} text-white flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{tier.icon}</span>
                        <div>
                          <h4 className="font-semibold">{tier.name}</h4>
                          <p className="text-sm opacity-90">
                            {tier.maxPoints === Infinity
                              ? `${tier.minPoints.toLocaleString()}+ points`
                              : `${tier.minPoints.toLocaleString()} - ${tier.maxPoints.toLocaleString()} points`}
                          </p>
                        </div>
                      </div>
                      {isCurrentTier && (
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                          Current Tier
                        </span>
                      )}
                      {!isUnlocked && (
                        <span className="px-3 py-1 bg-black/20 rounded-full text-sm">
                          🔒 Locked
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h5 className="text-sm font-medium text-gray-500 mb-3">Benefits</h5>
                      <ul className="space-y-2">
                        {tier.benefits.map((benefit, bidx) => (
                          <li key={bidx} className="flex items-center gap-2">
                            <span className={isUnlocked ? "text-green-500" : "text-gray-400"}>
                              {isUnlocked ? "✓" : "○"}
                            </span>
                            <span className={isUnlocked ? "text-gray-700" : "text-gray-400"}>
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Redeem Modal */}
        {showRedeemModal && selectedReward && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6 text-center">
                <span className="text-6xl">{selectedReward.image}</span>
                <h3 className="text-xl font-semibold text-gray-900 mt-4">
                  {selectedReward.name}
                </h3>
                <p className="text-gray-600 mt-2">{selectedReward.description}</p>
                <div className="mt-4 p-4 bg-violet-50 rounded-xl">
                  <p className="text-sm text-gray-600">Cost</p>
                  <p className="text-2xl font-bold text-violet-600">
                    {selectedReward.pointsCost.toLocaleString()} points
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Balance after: {(currentPoints - selectedReward.pointsCost).toLocaleString()} points
                  </p>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setShowRedeemModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowRedeemModal(false);
                    alert("Reward redeemed successfully!");
                  }}
                  className="flex-1 px-4 py-3 bg-violet-600 text-white rounded-xl font-medium"
                >
                  Confirm Redeem
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
