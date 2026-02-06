"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useSubscriptionStore, PLANS, formatPrice } from "@/store/subscriptionStore";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  featureDescription?: string;
}

export function PaywallModal({
  isOpen,
  onClose,
  feature,
  featureDescription,
}: PaywallModalProps) {
  const router = useRouter();
  const { trialUsed, startTrial } = useSubscriptionStore();

  if (!isOpen) return null;

  const handleStartTrial = () => {
    startTrial();
    onClose();
  };

  const handleUpgrade = () => {
    router.push("/dashboard/premium");
    onClose();
  };

  const premiumPlan = PLANS.find((p) => p.id === "premium");

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-sm w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Premium Feature</h2>
          <p className="text-primary-100 text-sm mt-1">
            Unlock {feature} with NepFit Premium
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {featureDescription && (
            <p className="text-neutral-600 text-center mb-6">
              {featureDescription}
            </p>
          )}

          {/* Premium Benefits */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-sm text-neutral-700">Unlimited AI chat messages</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-sm text-neutral-700">Photo food recognition</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-sm text-neutral-700">Advanced analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-sm text-neutral-700">Personalized meal plans</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="text-center mb-6">
            <p className="text-neutral-500 text-sm">Starting at just</p>
            <p className="text-3xl font-bold text-neutral-900">
              {formatPrice(premiumPlan?.yearlyMonthlyEquivalent || 125)}
              <span className="text-lg font-normal text-neutral-500">/month</span>
            </p>
            <p className="text-xs text-neutral-500">
              Billed yearly at {formatPrice(premiumPlan?.yearlyPrice || 1499)}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button fullWidth onClick={handleUpgrade}>
              View Premium Plans
            </Button>

            {!trialUsed && (
              <Button fullWidth variant="secondary" onClick={handleStartTrial}>
                Start 7-Day Free Trial
              </Button>
            )}

            <button
              onClick={onClose}
              className="w-full text-center text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for easy paywall trigger
export function usePaywall() {
  const { canAccessFeature, isPremium } = useSubscriptionStore();

  const checkAccess = (feature: string): boolean => {
    return canAccessFeature(feature);
  };

  return {
    checkAccess,
    isPremium: isPremium(),
    requiresUpgrade: (feature: string) => !canAccessFeature(feature),
  };
}
