import { create } from "zustand";
import { persist } from "zustand/middleware";

// ==========================================
// Subscription Plans and Pricing
// ==========================================

export type PlanType = "free" | "premium" | "family";
export type BillingCycle = "monthly" | "yearly";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface PlanFeature {
  name: string;
  free: boolean | string;
  premium: boolean | string;
  family: boolean | string;
}

export interface Plan {
  id: PlanType;
  name: string;
  description: string;
  monthlyPrice: number; // in INR
  yearlyPrice: number; // in INR
  yearlyMonthlyEquivalent: number;
  savingsPercent: number;
  maxMembers: number;
  highlighted?: boolean;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: "razorpay" | "stripe";
  planType: PlanType;
  billingCycle: BillingCycle;
  createdAt: Date;
  completedAt?: Date;
}

export interface Subscription {
  id: string;
  planType: PlanType;
  billingCycle: BillingCycle;
  status: "active" | "cancelled" | "expired" | "trial";
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentId?: string;
  familyMembers?: string[]; // For family plan
  trialEndDate?: Date;
}

// ==========================================
// Plan Definitions
// ==========================================

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Basic nutrition tracking for beginners",
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyMonthlyEquivalent: 0,
    savingsPercent: 0,
    maxMembers: 1,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Advanced features for health enthusiasts",
    monthlyPrice: 199,
    yearlyPrice: 1499,
    yearlyMonthlyEquivalent: 125,
    savingsPercent: 37,
    maxMembers: 1,
    highlighted: true,
  },
  {
    id: "family",
    name: "Family",
    description: "Health tracking for the whole family",
    monthlyPrice: 349,
    yearlyPrice: 2999,
    yearlyMonthlyEquivalent: 250,
    savingsPercent: 28,
    maxMembers: 5,
  },
];

export const PLAN_FEATURES: PlanFeature[] = [
  { name: "Food logging", free: true, premium: true, family: true },
  { name: "Basic progress tracking", free: true, premium: true, family: true },
  { name: "Recipe library", free: "100+ recipes", premium: "500+ recipes", family: "500+ recipes" },
  { name: "AI chat messages/day", free: "10 messages", premium: "Unlimited", family: "Unlimited" },
  { name: "Personalized meal plans", free: false, premium: true, family: true },
  { name: "Advanced analytics", free: false, premium: true, family: true },
  { name: "Photo food recognition", free: false, premium: true, family: true },
  { name: "Voice food logging", free: false, premium: true, family: true },
  { name: "Export data (CSV/PDF)", free: false, premium: true, family: true },
  { name: "Priority support", free: false, premium: true, family: true },
  { name: "Ad-free experience", free: false, premium: true, family: true },
  { name: "Family members", free: "1", premium: "1", family: "Up to 5" },
  { name: "Shared meal planning", free: false, premium: false, family: true },
  { name: "Family dashboard", free: false, premium: false, family: true },
];

// ==========================================
// Subscription Store
// ==========================================

interface SubscriptionState {
  // Current subscription
  subscription: Subscription | null;

  // Payment history
  payments: Payment[];

  // Trial status
  trialUsed: boolean;

  // Feature access cache
  featureAccess: Record<string, boolean>;

  // Actions
  setSubscription: (subscription: Subscription) => void;
  cancelSubscription: () => void;
  reactivateSubscription: () => void;
  addPayment: (payment: Payment) => void;
  startTrial: () => void;

  // Feature checks
  isPremium: () => boolean;
  isFamily: () => boolean;
  canAccessFeature: (feature: string) => boolean;
  getRemainingDays: () => number;

  // Usage limits
  aiMessagesUsedToday: number;
  incrementAiMessages: () => void;
  resetDailyLimits: () => void;
  getAiMessageLimit: () => number;
  canSendAiMessage: () => boolean;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscription: null,
      payments: [],
      trialUsed: false,
      featureAccess: {},
      aiMessagesUsedToday: 0,

      setSubscription: (subscription) => {
        set({ subscription });
      },

      cancelSubscription: () => {
        set((state) => ({
          subscription: state.subscription
            ? { ...state.subscription, autoRenew: false, status: "cancelled" }
            : null,
        }));
      },

      reactivateSubscription: () => {
        set((state) => ({
          subscription: state.subscription
            ? { ...state.subscription, autoRenew: true, status: "active" }
            : null,
        }));
      },

      addPayment: (payment) => {
        set((state) => ({
          payments: [payment, ...state.payments].slice(0, 50), // Keep last 50
        }));
      },

      startTrial: () => {
        const now = new Date();
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 7); // 7-day trial

        set({
          trialUsed: true,
          subscription: {
            id: `trial_${Date.now()}`,
            planType: "premium",
            billingCycle: "monthly",
            status: "trial",
            startDate: now,
            endDate: trialEnd,
            autoRenew: false,
            trialEndDate: trialEnd,
          },
        });
      },

      isPremium: () => {
        const { subscription } = get();
        if (!subscription) return false;
        if (new Date() > new Date(subscription.endDate)) return false;
        return subscription.planType === "premium" || subscription.planType === "family";
      },

      isFamily: () => {
        const { subscription } = get();
        if (!subscription) return false;
        if (new Date() > new Date(subscription.endDate)) return false;
        return subscription.planType === "family";
      },

      canAccessFeature: (feature) => {
        const state = get();
        const isPremium = state.isPremium();

        // Features available to all
        const freeFeatures = [
          "food_logging",
          "basic_progress",
          "basic_recipes",
        ];

        // Premium features
        const premiumFeatures = [
          "unlimited_ai",
          "meal_plans",
          "advanced_analytics",
          "photo_recognition",
          "voice_logging",
          "data_export",
          "priority_support",
          "ad_free",
        ];

        // Family-only features
        const familyFeatures = [
          "family_members",
          "shared_meal_planning",
          "family_dashboard",
        ];

        if (freeFeatures.includes(feature)) return true;
        if (premiumFeatures.includes(feature) && isPremium) return true;
        if (familyFeatures.includes(feature) && state.isFamily()) return true;

        return false;
      },

      getRemainingDays: () => {
        const { subscription } = get();
        if (!subscription) return 0;

        const now = new Date();
        const end = new Date(subscription.endDate);
        const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return Math.max(0, diff);
      },

      incrementAiMessages: () => {
        set((state) => ({
          aiMessagesUsedToday: state.aiMessagesUsedToday + 1,
        }));
      },

      resetDailyLimits: () => {
        set({ aiMessagesUsedToday: 0 });
      },

      getAiMessageLimit: () => {
        const state = get();
        if (state.isPremium()) return Infinity;
        return 10; // Free limit
      },

      canSendAiMessage: () => {
        const state = get();
        const limit = state.getAiMessageLimit();
        return state.aiMessagesUsedToday < limit;
      },
    }),
    {
      name: "nepfit-subscription-storage",
      partialize: (state) => ({
        subscription: state.subscription,
        payments: state.payments,
        trialUsed: state.trialUsed,
        aiMessagesUsedToday: state.aiMessagesUsedToday,
      }),
    }
  )
);

// ==========================================
// Helper Hooks
// ==========================================

export const usePremiumFeature = (feature: string) => {
  const { canAccessFeature, isPremium } = useSubscriptionStore();
  return {
    hasAccess: canAccessFeature(feature),
    isPremium: isPremium(),
    requiresUpgrade: !canAccessFeature(feature),
  };
};

export const useAiMessageLimit = () => {
  const { aiMessagesUsedToday, getAiMessageLimit, canSendAiMessage, incrementAiMessages } =
    useSubscriptionStore();
  const limit = getAiMessageLimit();

  return {
    used: aiMessagesUsedToday,
    limit: limit === Infinity ? "Unlimited" : limit,
    remaining: limit === Infinity ? "Unlimited" : Math.max(0, limit - aiMessagesUsedToday),
    canSend: canSendAiMessage(),
    recordMessage: incrementAiMessages,
  };
};

// Format price for display
export const formatPrice = (amount: number, currency = "INR"): string => {
  if (amount === 0) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};
