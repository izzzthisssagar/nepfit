"use client";

import { useState } from "react";
import { Card, CardHeader, Button, Input } from "@/components/ui";

// Types
interface Group {
  id: string;
  name: string;
  description: string;
  category: "diet" | "fitness" | "health" | "regional" | "lifestyle";
  memberCount: number;
  icon: string;
  isJoined: boolean;
  isPrivate: boolean;
  activeChallenge?: string;
  weeklyGoal?: string;
  topMembers: { name: string; avatar: string; streak: number }[];
  createdAt: Date;
}

// Mock groups data
const MOCK_GROUPS: Group[] = [
  {
    id: "g1",
    name: "Keto Nepal",
    description: "A community for people following ketogenic diet in Nepal. Share recipes, tips, and support!",
    category: "diet",
    memberCount: 1245,
    icon: "🥑",
    isJoined: true,
    isPrivate: false,
    activeChallenge: "30-Day Keto Challenge",
    weeklyGoal: "Stay under 50g carbs daily",
    topMembers: [
      { name: "Priya S.", avatar: "👩", streak: 45 },
      { name: "Rajesh T.", avatar: "👨", streak: 38 },
      { name: "Anita G.", avatar: "👩‍🦱", streak: 32 },
    ],
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  },
  {
    id: "g2",
    name: "Vegetarian Foodies",
    description: "Delicious vegetarian recipes and meal ideas for the health-conscious",
    category: "diet",
    memberCount: 2890,
    icon: "🥗",
    isJoined: false,
    isPrivate: false,
    activeChallenge: "Meatless Month",
    weeklyGoal: "Try 3 new recipes",
    topMembers: [
      { name: "Maya R.", avatar: "👩‍🦰", streak: 60 },
      { name: "Sagar K.", avatar: "👨‍🦰", streak: 42 },
      { name: "Nisha P.", avatar: "👩", streak: 35 },
    ],
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
  },
  {
    id: "g3",
    name: "Diabetes Warriors",
    description: "Support group for managing diabetes through diet. Share low-GI recipes and tips.",
    category: "health",
    memberCount: 876,
    icon: "💪",
    isJoined: true,
    isPrivate: true,
    activeChallenge: "Blood Sugar Control Week",
    weeklyGoal: "Log all meals with GI values",
    topMembers: [
      { name: "Ramesh B.", avatar: "👨", streak: 90 },
      { name: "Sunita K.", avatar: "👩", streak: 67 },
      { name: "Binod S.", avatar: "👨‍🦳", streak: 55 },
    ],
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
  },
  {
    id: "g4",
    name: "Morning Workout Crew",
    description: "Early birds who exercise before breakfast. Share your morning routines!",
    category: "fitness",
    memberCount: 1567,
    icon: "🌅",
    isJoined: false,
    isPrivate: false,
    activeChallenge: "5 AM Club Challenge",
    weeklyGoal: "Workout 5 times this week",
    topMembers: [
      { name: "Bikash T.", avatar: "👨‍🦱", streak: 120 },
      { name: "Kriti S.", avatar: "👩‍🦱", streak: 89 },
      { name: "Nabin G.", avatar: "👨", streak: 76 },
    ],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  },
  {
    id: "g5",
    name: "Newari Kitchen",
    description: "Authentic Newari recipes made healthy! Traditional taste, modern nutrition.",
    category: "regional",
    memberCount: 654,
    icon: "🏔️",
    isJoined: false,
    isPrivate: false,
    activeChallenge: "Healthy Newari Week",
    weeklyGoal: "Share one Newari recipe",
    topMembers: [
      { name: "Pratima S.", avatar: "👩", streak: 28 },
      { name: "Sujan M.", avatar: "👨", streak: 24 },
      { name: "Bibha J.", avatar: "👩‍🦱", streak: 19 },
    ],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
  },
  {
    id: "g6",
    name: "Intermittent Fasting",
    description: "Support for all IF schedules - 16:8, 18:6, OMAD. Share experiences and tips.",
    category: "lifestyle",
    memberCount: 2134,
    icon: "⏰",
    isJoined: false,
    isPrivate: false,
    activeChallenge: "21-Day IF Journey",
    weeklyGoal: "Complete 5 successful fasts",
    topMembers: [
      { name: "Dipesh K.", avatar: "👨", streak: 150 },
      { name: "Shristi R.", avatar: "👩", streak: 98 },
      { name: "Arun P.", avatar: "👨‍🦰", streak: 87 },
    ],
    createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
  },
];

const CATEGORIES = [
  { id: "all", label: "All Groups", icon: "🌐" },
  { id: "diet", label: "Diet", icon: "🥗" },
  { id: "fitness", label: "Fitness", icon: "💪" },
  { id: "health", label: "Health", icon: "❤️" },
  { id: "regional", label: "Regional", icon: "🏔️" },
  { id: "lifestyle", label: "Lifestyle", icon: "⭐" },
];

export default function GroupsPage() {
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const filteredGroups = groups.filter((group) => {
    const matchesCategory = selectedCategory === "all" || group.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const myGroups = groups.filter((g) => g.isJoined);

  const handleJoinLeave = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, isJoined: !g.isJoined } : g))
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Groups</h1>
          <p className="text-neutral-500">Join communities with similar health goals</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          + Create Group
        </Button>
      </div>

      {/* My Groups Quick View */}
      {myGroups.length > 0 && (
        <Card gradient="hero">
          <CardHeader title="My Groups" subtitle={`You're in ${myGroups.length} groups`} />
          <div className="flex gap-4 overflow-x-auto pb-2">
            {myGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className="flex-shrink-0 w-32 text-center cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl mx-auto mb-2">
                  {group.icon}
                </div>
                <p className="text-sm font-medium text-neutral-900 truncate">{group.name}</p>
                <p className="text-xs text-neutral-500">{group.memberCount} members</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="space-y-4">
        <Input
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredGroups.map((group) => (
          <Card key={group.id} hover onClick={() => setSelectedGroup(group)}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                {group.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-neutral-900 truncate">{group.name}</h3>
                  {group.isPrivate && (
                    <span className="text-xs bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded-full">
                      Private
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-500">{group.memberCount.toLocaleString()} members</p>
              </div>
            </div>

            <p className="text-sm text-neutral-600 line-clamp-2 mb-4">{group.description}</p>

            {/* Active Challenge */}
            {group.activeChallenge && (
              <div className="bg-primary-50 rounded-xl p-3 mb-4">
                <p className="text-xs text-primary-600 font-medium mb-1">🎯 Active Challenge</p>
                <p className="text-sm text-primary-800">{group.activeChallenge}</p>
              </div>
            )}

            {/* Top Members */}
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {group.topMembers.slice(0, 3).map((member, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-white border-2 border-white rounded-full flex items-center justify-center text-sm shadow-sm"
                  >
                    {member.avatar}
                  </div>
                ))}
                {group.memberCount > 3 && (
                  <div className="w-8 h-8 bg-neutral-100 border-2 border-white rounded-full flex items-center justify-center text-xs text-neutral-600 shadow-sm">
                    +{group.memberCount - 3}
                  </div>
                )}
              </div>

              <Button
                size="sm"
                variant={group.isJoined ? "outline" : "primary"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleJoinLeave(group.id);
                }}
              >
                {group.isJoined ? "Joined ✓" : "Join"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No groups found</h3>
          <p className="text-neutral-500 mb-4">Try adjusting your search or create your own group!</p>
          <Button onClick={() => setShowCreateModal(true)}>Create Group</Button>
        </Card>
      )}

      {/* Group Detail Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="max-w-lg w-full my-8 animate-bounce-in" padding="lg">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-3xl">
                  {selectedGroup.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">{selectedGroup.name}</h2>
                  <p className="text-neutral-500">{selectedGroup.memberCount.toLocaleString()} members</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGroup(null)}
                className="p-2 hover:bg-neutral-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <p className="text-neutral-600 mb-6">{selectedGroup.description}</p>

            {/* Active Challenge */}
            {selectedGroup.activeChallenge && (
              <div className="bg-primary-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-primary-800 mb-2">🎯 Active Challenge</h4>
                <p className="text-primary-700">{selectedGroup.activeChallenge}</p>
                {selectedGroup.weeklyGoal && (
                  <p className="text-sm text-primary-600 mt-2">
                    Weekly Goal: {selectedGroup.weeklyGoal}
                  </p>
                )}
              </div>
            )}

            {/* Top Members */}
            <div className="mb-6">
              <h4 className="font-semibold text-neutral-900 mb-3">🏆 Top Members</h4>
              <div className="space-y-3">
                {selectedGroup.topMembers.map((member, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-primary-600">#{i + 1}</span>
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg shadow-sm">
                        {member.avatar}
                      </div>
                      <span className="font-medium text-neutral-900">{member.name}</span>
                    </div>
                    <span className="text-sm text-primary-600">🔥 {member.streak} days</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                fullWidth
                variant={selectedGroup.isJoined ? "outline" : "primary"}
                onClick={() => handleJoinLeave(selectedGroup.id)}
              >
                {selectedGroup.isJoined ? "Leave Group" : "Join Group"}
              </Button>
              {selectedGroup.isJoined && (
                <Button variant="secondary">
                  💬 Chat
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full animate-bounce-in" padding="lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Create New Group</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <Input label="Group Name" placeholder="e.g., Healthy Eating Tribe" />

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="What is this group about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className="p-3 border border-neutral-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <p className="text-xs text-neutral-600 mt-1">{cat.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-500" />
                <span className="text-sm text-neutral-700">Make this a private group</span>
              </label>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={() => setShowCreateModal(false)}>
                  Create Group
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
