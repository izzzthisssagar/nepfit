import { create } from "zustand";
import { persist } from "zustand/middleware";

// ==========================================
// Social & Community Types
// ==========================================

export interface Friend {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  status: "pending_sent" | "pending_received" | "accepted" | "blocked";
  streakDays?: number;
  lastActive?: Date;
  privacyLevel: "public" | "friends" | "private";
  addedAt: Date;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: "streak" | "calories" | "water" | "meals" | "custom";
  target: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  participants: number;
  reward?: {
    badgeId: string;
    points: number;
  };
  createdBy: "system" | "community" | string;
  isActive: boolean;
}

export interface ChallengeParticipation {
  challengeId: string;
  progress: number;
  completed: boolean;
  joinedAt: Date;
  completedAt?: Date;
  rank?: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  score: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface CommunityRecipe {
  id: string;
  name: string;
  description: string;
  authorId: string;
  authorName: string;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  servings: number;
  prepTime: number; // minutes
  cookTime: number;
  tags: string[];
  likes: number;
  saves: number;
  comments: number;
  images: string[];
  createdAt: Date;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Kudos {
  id: string;
  fromUserId: string;
  fromUsername: string;
  type: "cheer" | "congrats" | "motivation" | "achievement";
  message?: string;
  createdAt: Date;
}

// ==========================================
// Default Challenges
// ==========================================

export const SYSTEM_CHALLENGES: Omit<Challenge, "id">[] = [
  {
    name: "7-Day Logging Streak",
    description: "Log your meals for 7 consecutive days",
    type: "streak",
    target: 7,
    unit: "days",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    participants: 2847,
    reward: { badgeId: "weekly_warrior", points: 100 },
    createdBy: "system",
    isActive: true,
  },
  {
    name: "Hydration Hero",
    description: "Drink 8 glasses of water daily for a week",
    type: "water",
    target: 56,
    unit: "glasses",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    participants: 1523,
    reward: { badgeId: "hydration_hero", points: 75 },
    createdBy: "system",
    isActive: true,
  },
  {
    name: "Protein Power",
    description: "Hit your protein goal for 5 days",
    type: "meals",
    target: 5,
    unit: "days",
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    participants: 982,
    reward: { badgeId: "protein_power", points: 50 },
    createdBy: "system",
    isActive: true,
  },
  {
    name: "Festival Balance",
    description: "Log balanced meals during festival season",
    type: "meals",
    target: 15,
    unit: "balanced meals",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    participants: 756,
    reward: { badgeId: "festival_balance", points: 150 },
    createdBy: "system",
    isActive: true,
  },
];

// ==========================================
// Social Store
// ==========================================

interface SocialState {
  // Friends
  friends: Friend[];
  pendingRequests: Friend[];

  // Challenges
  challenges: Challenge[];
  myParticipations: ChallengeParticipation[];

  // Kudos
  receivedKudos: Kudos[];
  sentKudos: Kudos[];

  // Community recipes
  savedRecipes: string[];
  likedRecipes: string[];

  // Activity feed visibility
  activityPrivacy: "public" | "friends" | "private";

  // Actions - Friends
  sendFriendRequest: (userId: string, username: string, displayName: string) => void;
  acceptFriendRequest: (friendId: string) => void;
  declineFriendRequest: (friendId: string) => void;
  removeFriend: (friendId: string) => void;
  blockUser: (friendId: string) => void;

  // Actions - Challenges
  joinChallenge: (challengeId: string) => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  leaveChallenge: (challengeId: string) => void;

  // Actions - Kudos
  sendKudos: (toUserId: string, toUsername: string, type: Kudos["type"], message?: string) => void;
  markKudosRead: (kudosId: string) => void;

  // Actions - Recipes
  likeRecipe: (recipeId: string) => void;
  unlikeRecipe: (recipeId: string) => void;
  saveRecipe: (recipeId: string) => void;
  unsaveRecipe: (recipeId: string) => void;

  // Actions - Privacy
  setActivityPrivacy: (level: "public" | "friends" | "private") => void;

  // Getters
  getAcceptedFriends: () => Friend[];
  getPendingIncoming: () => Friend[];
  getPendingOutgoing: () => Friend[];
  getActiveChallenges: () => Challenge[];
  getMyActiveChallenges: () => (Challenge & { participation: ChallengeParticipation })[];
  getUnreadKudos: () => Kudos[];
}

export const useSocialStore = create<SocialState>()(
  persist(
    (set, get) => ({
      friends: [],
      pendingRequests: [],
      challenges: SYSTEM_CHALLENGES.map((c, idx) => ({ ...c, id: `challenge_${idx}` })),
      myParticipations: [],
      receivedKudos: [],
      sentKudos: [],
      savedRecipes: [],
      likedRecipes: [],
      activityPrivacy: "friends",

      // Friend Actions
      sendFriendRequest: (userId, username, displayName) => {
        const newFriend: Friend = {
          id: `friend_${Date.now()}`,
          userId,
          username,
          displayName,
          status: "pending_sent",
          privacyLevel: "friends",
          addedAt: new Date(),
        };
        set((state) => ({
          friends: [...state.friends, newFriend],
        }));
      },

      acceptFriendRequest: (friendId) => {
        set((state) => ({
          friends: state.friends.map((f) =>
            f.id === friendId ? { ...f, status: "accepted" as const } : f
          ),
        }));
      },

      declineFriendRequest: (friendId) => {
        set((state) => ({
          friends: state.friends.filter((f) => f.id !== friendId),
        }));
      },

      removeFriend: (friendId) => {
        set((state) => ({
          friends: state.friends.filter((f) => f.id !== friendId),
        }));
      },

      blockUser: (friendId) => {
        set((state) => ({
          friends: state.friends.map((f) =>
            f.id === friendId ? { ...f, status: "blocked" as const } : f
          ),
        }));
      },

      // Challenge Actions
      joinChallenge: (challengeId) => {
        const existing = get().myParticipations.find((p) => p.challengeId === challengeId);
        if (existing) return;

        const participation: ChallengeParticipation = {
          challengeId,
          progress: 0,
          completed: false,
          joinedAt: new Date(),
        };

        set((state) => ({
          myParticipations: [...state.myParticipations, participation],
          challenges: state.challenges.map((c) =>
            c.id === challengeId ? { ...c, participants: c.participants + 1 } : c
          ),
        }));
      },

      updateChallengeProgress: (challengeId, progress) => {
        set((state) => {
          const challenge = state.challenges.find((c) => c.id === challengeId);
          const isCompleted = challenge ? progress >= challenge.target : false;

          return {
            myParticipations: state.myParticipations.map((p) =>
              p.challengeId === challengeId
                ? {
                    ...p,
                    progress,
                    completed: isCompleted,
                    completedAt: isCompleted && !p.completed ? new Date() : p.completedAt,
                  }
                : p
            ),
          };
        });
      },

      leaveChallenge: (challengeId) => {
        set((state) => ({
          myParticipations: state.myParticipations.filter((p) => p.challengeId !== challengeId),
          challenges: state.challenges.map((c) =>
            c.id === challengeId ? { ...c, participants: Math.max(0, c.participants - 1) } : c
          ),
        }));
      },

      // Kudos Actions
      sendKudos: (toUserId, toUsername, type, message) => {
        const kudos: Kudos = {
          id: `kudos_${Date.now()}`,
          fromUserId: "current_user", // Replace with actual user ID
          fromUsername: "You",
          type,
          message,
          createdAt: new Date(),
        };
        set((state) => ({
          sentKudos: [kudos, ...state.sentKudos].slice(0, 100),
        }));
      },

      markKudosRead: (kudosId) => {
        // In a real app, this would update read status
      },

      // Recipe Actions
      likeRecipe: (recipeId) => {
        set((state) => ({
          likedRecipes: [...new Set([...state.likedRecipes, recipeId])],
        }));
      },

      unlikeRecipe: (recipeId) => {
        set((state) => ({
          likedRecipes: state.likedRecipes.filter((id) => id !== recipeId),
        }));
      },

      saveRecipe: (recipeId) => {
        set((state) => ({
          savedRecipes: [...new Set([...state.savedRecipes, recipeId])],
        }));
      },

      unsaveRecipe: (recipeId) => {
        set((state) => ({
          savedRecipes: state.savedRecipes.filter((id) => id !== recipeId),
        }));
      },

      // Privacy
      setActivityPrivacy: (level) => {
        set({ activityPrivacy: level });
      },

      // Getters
      getAcceptedFriends: () => {
        return get().friends.filter((f) => f.status === "accepted");
      },

      getPendingIncoming: () => {
        return get().friends.filter((f) => f.status === "pending_received");
      },

      getPendingOutgoing: () => {
        return get().friends.filter((f) => f.status === "pending_sent");
      },

      getActiveChallenges: () => {
        const now = new Date();
        return get().challenges.filter(
          (c) => c.isActive && new Date(c.endDate) > now
        );
      },

      getMyActiveChallenges: () => {
        const state = get();
        const now = new Date();
        return state.myParticipations
          .map((p) => {
            const challenge = state.challenges.find((c) => c.id === p.challengeId);
            if (!challenge || new Date(challenge.endDate) <= now) return null;
            return { ...challenge, participation: p };
          })
          .filter(Boolean) as (Challenge & { participation: ChallengeParticipation })[];
      },

      getUnreadKudos: () => {
        // In a real app, filter by unread status
        return get().receivedKudos.slice(0, 10);
      },
    }),
    {
      name: "nepfit-social-storage",
      partialize: (state) => ({
        friends: state.friends,
        myParticipations: state.myParticipations,
        receivedKudos: state.receivedKudos,
        savedRecipes: state.savedRecipes,
        likedRecipes: state.likedRecipes,
        activityPrivacy: state.activityPrivacy,
      }),
    }
  )
);

// ==========================================
// Helper Hooks
// ==========================================

export const useFriends = () => {
  const { getAcceptedFriends, getPendingIncoming, getPendingOutgoing } = useSocialStore();
  return {
    friends: getAcceptedFriends(),
    pendingIncoming: getPendingIncoming(),
    pendingOutgoing: getPendingOutgoing(),
  };
};

export const useChallenges = () => {
  const { getActiveChallenges, getMyActiveChallenges, joinChallenge, leaveChallenge, updateChallengeProgress } =
    useSocialStore();
  return {
    available: getActiveChallenges(),
    joined: getMyActiveChallenges(),
    join: joinChallenge,
    leave: leaveChallenge,
    updateProgress: updateChallengeProgress,
  };
};
