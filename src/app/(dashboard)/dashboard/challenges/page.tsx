"use client";

import { useState } from "react";
import { Card, CardHeader, Button } from "@/components/ui";
import {
  useSocialStore,
  useChallenges,
  type Challenge,
  type ChallengeParticipation,
} from "@/store/socialStore";

export default function ChallengesPage() {
  const [selectedChallenge, setSelectedChallenge] = useState<
    (Challenge & { participation?: ChallengeParticipation }) | null
  >(null);
  const [filter, setFilter] = useState<"all" | "joined" | "completed">("all");

  const { available, joined, join, leave } = useChallenges();

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const getProgressPercent = (challenge: Challenge, participation?: ChallengeParticipation) => {
    if (!participation) return 0;
    return Math.min(100, (participation.progress / challenge.target) * 100);
  };

  const isJoined = (challengeId: string) => {
    return joined.some((c) => c.id === challengeId);
  };

  const handleJoinChallenge = (challengeId: string) => {
    join(challengeId);
  };

  const handleLeaveChallenge = (challengeId: string) => {
    leave(challengeId);
    setSelectedChallenge(null);
  };

  const filteredChallenges = () => {
    if (filter === "joined") {
      return joined;
    }
    if (filter === "completed") {
      return joined.filter((c) => c.participation.completed);
    }
    return available;
  };

  const getChallengeIcon = (type: Challenge["type"]) => {
    switch (type) {
      case "streak":
        return "🔥";
      case "water":
        return "💧";
      case "calories":
        return "🎯";
      case "meals":
        return "🍽️";
      default:
        return "⭐";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Challenges</h1>
        <p className="text-neutral-500">
          Join challenges, compete with friends, and earn rewards
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-primary-600">{joined.length}</div>
          <div className="text-sm text-neutral-500">Active</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600">
            {joined.filter((c) => c.participation.completed).length}
          </div>
          <div className="text-sm text-neutral-500">Completed</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-yellow-600">
            {joined.reduce(
              (acc, c) => acc + (c.participation.completed && c.reward ? c.reward.points : 0),
              0
            )}
          </div>
          <div className="text-sm text-neutral-500">Points Earned</div>
        </Card>
      </div>

      {/* My Active Challenges */}
      {joined.length > 0 && (
        <Card>
          <CardHeader title="My Active Challenges" subtitle="Track your progress" />
          <div className="space-y-4">
            {joined.map((challenge) => (
              <div
                key={challenge.id}
                className="p-4 bg-neutral-50 rounded-xl cursor-pointer hover:bg-neutral-100 transition-all"
                onClick={() => setSelectedChallenge(challenge)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
                    {getChallengeIcon(challenge.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-neutral-900">{challenge.name}</h3>
                      {challenge.participation.completed ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          ✓ Completed
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-500">
                          {getDaysRemaining(challenge.endDate)} days left
                        </span>
                      )}
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-600">
                          {challenge.participation.progress} / {challenge.target} {challenge.unit}
                        </span>
                        <span className="font-medium text-primary-600">
                          {Math.round(getProgressPercent(challenge, challenge.participation))}%
                        </span>
                      </div>
                      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            challenge.participation.completed
                              ? "bg-green-500"
                              : "bg-primary-500"
                          }`}
                          style={{
                            width: `${getProgressPercent(challenge, challenge.participation)}%`,
                          }}
                        />
                      </div>
                    </div>
                    {challenge.reward && (
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span>🏆 {challenge.reward.points} points</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { value: "all", label: "All Challenges" },
          { value: "joined", label: "My Challenges" },
          { value: "completed", label: "Completed" },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value as typeof filter)}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === option.value
                ? "bg-primary-500 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Available Challenges */}
      <div className="space-y-4">
        {filteredChallenges().map((challenge) => {
          const challengeIsJoined = isJoined(challenge.id);
          const participation = "participation" in challenge
            ? (challenge as Challenge & { participation: ChallengeParticipation }).participation
            : undefined;

          return (
            <Card
              key={challenge.id}
              className="cursor-pointer hover:shadow-md transition-all"
              onClick={() => setSelectedChallenge({ ...challenge, participation })}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {getChallengeIcon(challenge.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-neutral-900">{challenge.name}</h3>
                    {challengeIsJoined ? (
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                        Joined
                      </span>
                    ) : (
                      <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                        {getDaysRemaining(challenge.endDate)} days left
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 mb-2">{challenge.description}</p>
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span>🎯 {challenge.target} {challenge.unit}</span>
                    <span>👥 {challenge.participants.toLocaleString()} participants</span>
                    {challenge.reward && <span>🏆 {challenge.reward.points} pts</span>}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredChallenges().length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            <div className="text-4xl mb-4">🎯</div>
            <p>No challenges found</p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="text-primary-600 hover:underline mt-2"
              >
                View all challenges
              </button>
            )}
          </div>
        )}
      </div>

      {/* Challenge Detail Modal */}
      {selectedChallenge && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setSelectedChallenge(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-3xl mb-3">
                    {getChallengeIcon(selectedChallenge.type)}
                  </div>
                  <h2 className="text-xl font-bold">{selectedChallenge.name}</h2>
                  <p className="text-primary-100 text-sm mt-1">
                    {getDaysRemaining(selectedChallenge.endDate)} days remaining
                  </p>
                </div>
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="p-2 hover:bg-white/20 rounded-lg"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">About</h3>
                <p className="text-neutral-600 text-sm">{selectedChallenge.description}</p>
              </div>

              {/* Goal */}
              <div className="bg-neutral-50 rounded-xl p-4">
                <h3 className="font-semibold text-neutral-900 mb-3">Goal</h3>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Target</span>
                  <span className="font-bold text-lg">
                    {selectedChallenge.target} {selectedChallenge.unit}
                  </span>
                </div>
                {selectedChallenge.participation && (
                  <>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-neutral-600">Your Progress</span>
                      <span className="font-bold text-lg text-primary-600">
                        {selectedChallenge.participation.progress} {selectedChallenge.unit}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            selectedChallenge.participation.completed
                              ? "bg-green-500"
                              : "bg-primary-500"
                          }`}
                          style={{
                            width: `${getProgressPercent(
                              selectedChallenge,
                              selectedChallenge.participation
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedChallenge.participants.toLocaleString()}
                  </div>
                  <div className="text-xs text-blue-600">Participants</div>
                </div>
                {selectedChallenge.reward && (
                  <div className="bg-yellow-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {selectedChallenge.reward.points}
                    </div>
                    <div className="text-xs text-yellow-600">Points Reward</div>
                  </div>
                )}
              </div>

              {/* Duration */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Duration</h3>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <span>
                    {new Date(selectedChallenge.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span>→</span>
                  <span>
                    {new Date(selectedChallenge.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t p-4">
              {isJoined(selectedChallenge.id) ? (
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => handleLeaveChallenge(selectedChallenge.id)}
                  >
                    Leave Challenge
                  </Button>
                  <Button fullWidth onClick={() => setSelectedChallenge(null)}>
                    View Progress
                  </Button>
                </div>
              ) : (
                <Button fullWidth onClick={() => handleJoinChallenge(selectedChallenge.id)}>
                  Join Challenge
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
