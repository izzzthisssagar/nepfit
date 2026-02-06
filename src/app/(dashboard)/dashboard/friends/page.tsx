"use client";

import { useState } from "react";
import { Card, CardHeader, Button, Input } from "@/components/ui";
import { useSocialStore, type Friend, type Kudos } from "@/store/socialStore";

// Mock data for demo
const MOCK_USERS = [
  { id: "u1", username: "priya_sharma", displayName: "Priya Sharma", avatar: "👩", streakDays: 15 },
  { id: "u2", username: "rajesh_thapa", displayName: "Rajesh Thapa", avatar: "👨", streakDays: 7 },
  { id: "u3", username: "anita_gurung", displayName: "Anita Gurung", avatar: "👩‍🦱", streakDays: 23 },
  { id: "u4", username: "sagar_kc", displayName: "Sagar KC", avatar: "👨‍🦰", streakDays: 12 },
  { id: "u5", username: "maya_rai", displayName: "Maya Rai", avatar: "👩‍🦰", streakDays: 30 },
];

const KUDOS_TYPES: { type: Kudos["type"]; emoji: string; label: string }[] = [
  { type: "cheer", emoji: "🎉", label: "Cheer" },
  { type: "congrats", emoji: "🏆", label: "Congrats" },
  { type: "motivation", emoji: "💪", label: "Motivate" },
  { type: "achievement", emoji: "⭐", label: "Amazing" },
];

// Mock activity feed
const MOCK_ACTIVITY = [
  { id: "a1", user: "Priya Sharma", avatar: "👩", action: "logged 3 meals", time: "2h ago", calories: 1420 },
  { id: "a2", user: "Rajesh Thapa", avatar: "👨", action: "completed 7-day streak", time: "4h ago", badge: "🔥" },
  { id: "a3", user: "Anita Gurung", avatar: "👩‍🦱", action: "reached protein goal", time: "5h ago", badge: "💪" },
  { id: "a4", user: "Sagar KC", avatar: "👨‍🦰", action: "shared a recipe", time: "6h ago", recipe: "Healthy Dal" },
  { id: "a5", user: "Maya Rai", avatar: "👩‍🦰", action: "joined Hydration Hero challenge", time: "8h ago", badge: "💧" },
];

type TabType = "friends" | "requests" | "search" | "activity";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [kudosMessage, setKudosMessage] = useState("");

  const {
    friends,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    sendKudos,
    getAcceptedFriends,
    getPendingIncoming,
    getPendingOutgoing,
  } = useSocialStore();

  const acceptedFriends = getAcceptedFriends();
  const pendingIncoming = getPendingIncoming();
  const pendingOutgoing = getPendingOutgoing();

  const searchResults = searchQuery.length > 1
    ? MOCK_USERS.filter(
        (u) =>
          u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSendRequest = (user: typeof MOCK_USERS[0]) => {
    sendFriendRequest(user.id, user.username, user.displayName);
  };

  const handleSendKudos = (friendId: string, type: Kudos["type"]) => {
    const friend = friends.find((f) => f.id === friendId);
    if (friend) {
      sendKudos(friend.userId, friend.username, type, kudosMessage || undefined);
      setSelectedFriend(null);
      setKudosMessage("");
    }
  };

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: "friends", label: "Friends", count: acceptedFriends.length },
    { id: "requests", label: "Requests", count: pendingIncoming.length },
    { id: "search", label: "Find Friends" },
    { id: "activity", label: "Activity" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Friends</h1>
        <p className="text-neutral-500">Connect with friends and stay motivated together</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-primary-500 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? "bg-white/20" : "bg-primary-100 text-primary-700"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Friends List */}
      {activeTab === "friends" && (
        <div className="space-y-4">
          {acceptedFriends.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No friends yet</h3>
              <p className="text-neutral-500 mb-4">Find friends to stay motivated together!</p>
              <Button onClick={() => setActiveTab("search")}>Find Friends</Button>
            </Card>
          ) : (
            acceptedFriends.map((friend) => (
              <Card key={friend.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                    {friend.avatar || "👤"}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">{friend.displayName}</p>
                    <p className="text-sm text-neutral-500">@{friend.username}</p>
                    {friend.streakDays && (
                      <p className="text-xs text-primary-600 mt-1">
                        🔥 {friend.streakDays} day streak
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedFriend(friend.id)}
                  >
                    Send Kudos
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFriend(friend.id)}
                  >
                    ✕
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Friend Requests */}
      {activeTab === "requests" && (
        <div className="space-y-6">
          {/* Incoming Requests */}
          <div>
            <h3 className="font-semibold text-neutral-900 mb-3">
              Incoming Requests ({pendingIncoming.length})
            </h3>
            {pendingIncoming.length === 0 ? (
              <Card className="text-center py-8 text-neutral-500">
                No pending requests
              </Card>
            ) : (
              <div className="space-y-3">
                {pendingIncoming.map((friend) => (
                  <Card key={friend.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-xl">
                        {friend.avatar || "👤"}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">{friend.displayName}</p>
                        <p className="text-sm text-neutral-500">@{friend.username}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => acceptFriendRequest(friend.id)}>
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => declineFriendRequest(friend.id)}
                      >
                        Decline
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Outgoing Requests */}
          <div>
            <h3 className="font-semibold text-neutral-900 mb-3">
              Sent Requests ({pendingOutgoing.length})
            </h3>
            {pendingOutgoing.length === 0 ? (
              <Card className="text-center py-8 text-neutral-500">
                No sent requests
              </Card>
            ) : (
              <div className="space-y-3">
                {pendingOutgoing.map((friend) => (
                  <Card key={friend.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-xl">
                        {friend.avatar || "👤"}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">{friend.displayName}</p>
                        <p className="text-sm text-neutral-500">Pending...</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => declineFriendRequest(friend.id)}
                    >
                      Cancel
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Friends */}
      {activeTab === "search" && (
        <div className="space-y-4">
          <Input
            placeholder="Search by username or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />

          {searchQuery.length > 1 && (
            <div className="space-y-3">
              {searchResults.length === 0 ? (
                <Card className="text-center py-8 text-neutral-500">
                  No users found matching &quot;{searchQuery}&quot;
                </Card>
              ) : (
                searchResults.map((user) => {
                  const existingFriend = friends.find((f) => f.userId === user.id);
                  const isPending = existingFriend?.status === "pending_sent";
                  const isFriend = existingFriend?.status === "accepted";

                  return (
                    <Card key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-xl">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">{user.displayName}</p>
                          <p className="text-sm text-neutral-500">@{user.username}</p>
                          <p className="text-xs text-primary-600">🔥 {user.streakDays} day streak</p>
                        </div>
                      </div>
                      {isFriend ? (
                        <span className="text-green-600 font-medium text-sm">✓ Friends</span>
                      ) : isPending ? (
                        <span className="text-neutral-500 text-sm">Request Sent</span>
                      ) : (
                        <Button size="sm" onClick={() => handleSendRequest(user)}>
                          Add Friend
                        </Button>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          )}

          {searchQuery.length <= 1 && (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Find Friends</h3>
              <p className="text-neutral-500">Search by username or name to find friends</p>
            </Card>
          )}
        </div>
      )}

      {/* Activity Feed */}
      {activeTab === "activity" && (
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Friend Activity"
              subtitle="See what your friends are up to"
            />
            <div className="space-y-4">
              {MOCK_ACTIVITY.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 bg-neutral-50 rounded-xl"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    {activity.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-neutral-900">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      {activity.action}
                      {activity.badge && <span className="ml-1">{activity.badge}</span>}
                    </p>
                    {activity.calories && (
                      <p className="text-sm text-neutral-500">{activity.calories} calories</p>
                    )}
                    {activity.recipe && (
                      <p className="text-sm text-primary-600">🍳 {activity.recipe}</p>
                    )}
                    <p className="text-xs text-neutral-400 mt-1">{activity.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    👏
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Kudos Modal */}
      {selectedFriend && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-sm w-full animate-bounce-in" padding="lg">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">Send Kudos</h3>
              <p className="text-sm text-neutral-500">Choose how you want to encourage your friend</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {KUDOS_TYPES.map((kudos) => (
                <button
                  key={kudos.type}
                  onClick={() => handleSendKudos(selectedFriend, kudos.type)}
                  className="p-4 bg-neutral-50 hover:bg-primary-50 rounded-xl text-center transition-colors"
                >
                  <div className="text-3xl mb-2">{kudos.emoji}</div>
                  <div className="text-sm font-medium text-neutral-700">{kudos.label}</div>
                </button>
              ))}
            </div>

            <Input
              placeholder="Add a message (optional)"
              value={kudosMessage}
              onChange={(e) => setKudosMessage(e.target.value)}
              className="mb-4"
            />

            <Button variant="outline" fullWidth onClick={() => setSelectedFriend(null)}>
              Cancel
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
