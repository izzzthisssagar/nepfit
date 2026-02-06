"use client";

import { useState } from "react";
import { Card, CardHeader, Button } from "@/components/ui";
import {
  useSubscriptionStore,
  PLANS,
  PLAN_FEATURES,
  formatPrice,
  type PlanType,
  type BillingCycle,
} from "@/store/subscriptionStore";

export default function PremiumPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const {
    subscription,
    isPremium,
    isFamily,
    getRemainingDays,
    trialUsed,
    startTrial,
    cancelSubscription,
    reactivateSubscription,
  } = useSubscriptionStore();

  const currentPlan = subscription?.planType || "free";
  const isActive = subscription?.status === "active" || subscription?.status === "trial";

  const handleSelectPlan = (planId: PlanType) => {
    if (planId === "free") return;
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  const handleStartTrial = () => {
    if (!trialUsed) {
      startTrial();
    }
  };

  const handlePayment = () => {
    // In production, this would integrate with Razorpay/Stripe
    // For now, we'll simulate a successful payment
    if (selectedPlan) {
      const now = new Date();
      const endDate = new Date();
      if (billingCycle === "monthly") {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      useSubscriptionStore.getState().setSubscription({
        id: `sub_${Date.now()}`,
        planType: selectedPlan,
        billingCycle,
        status: "active",
        startDate: now,
        endDate,
        autoRenew: true,
      });

      setShowPaymentModal(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900">
          Upgrade to Premium
        </h1>
        <p className="text-neutral-500 mt-2">
          Unlock advanced features for better health tracking
        </p>
      </div>

      {/* Current Plan Status */}
      {subscription && (
        <Card className={`${
          isPremium()
            ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white border-0"
            : "bg-neutral-50"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={isPremium() ? "text-primary-100" : "text-neutral-500"}>
                Current Plan
              </p>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {PLANS.find(p => p.id === currentPlan)?.name}
                {subscription.status === "trial" && (
                  <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">
                    Trial
                  </span>
                )}
              </h2>
              {isActive && (
                <p className={`text-sm mt-1 ${isPremium() ? "text-primary-100" : "text-neutral-500"}`}>
                  {subscription.status === "trial"
                    ? `Trial ends in ${getRemainingDays()} days`
                    : subscription.autoRenew
                      ? `Renews in ${getRemainingDays()} days`
                      : `Expires in ${getRemainingDays()} days`
                  }
                </p>
              )}
            </div>
            {isPremium() && subscription.status !== "trial" && (
              <div>
                {subscription.autoRenew ? (
                  <Button
                    variant="secondary"
                    className="bg-white/20 text-white hover:bg-white/30"
                    onClick={cancelSubscription}
                  >
                    Cancel Renewal
                  </Button>
                ) : (
                  <Button
                    className="bg-white text-primary-600 hover:bg-white/90"
                    onClick={reactivateSubscription}
                  >
                    Reactivate
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="bg-neutral-100 p-1 rounded-xl inline-flex">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              billingCycle === "monthly"
                ? "bg-white shadow text-neutral-900"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              billingCycle === "yearly"
                ? "bg-white shadow text-neutral-900"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Yearly
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Save up to 37%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
          const isCurrentPlan = currentPlan === plan.id && isActive;
          const isHighlighted = plan.highlighted;

          return (
            <Card
              key={plan.id}
              className={`relative ${
                isHighlighted
                  ? "border-2 border-primary-500 shadow-lg"
                  : ""
              } ${isCurrentPlan ? "ring-2 ring-primary-200" : ""}`}
            >
              {isHighlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-900">{plan.name}</h3>
                <p className="text-sm text-neutral-500 mt-1">{plan.description}</p>

                <div className="mt-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-neutral-900">
                      {formatPrice(billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyMonthlyEquivalent)}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-neutral-500">/month</span>
                    )}
                  </div>
                  {billingCycle === "yearly" && plan.yearlyPrice > 0 && (
                    <p className="text-sm text-neutral-500 mt-1">
                      {formatPrice(plan.yearlyPrice)} billed yearly
                    </p>
                  )}
                  {plan.savingsPercent > 0 && billingCycle === "yearly" && (
                    <p className="text-sm text-green-600 font-medium mt-1">
                      Save {plan.savingsPercent}% with yearly billing
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  {isCurrentPlan ? (
                    <Button fullWidth variant="secondary" disabled>
                      Current Plan
                    </Button>
                  ) : plan.id === "free" ? (
                    <Button fullWidth variant="secondary" disabled>
                      Free Forever
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant={isHighlighted ? "primary" : "secondary"}
                      onClick={() => handleSelectPlan(plan.id)}
                    >
                      {currentPlan === "free" ? "Upgrade" : "Switch"} to {plan.name}
                    </Button>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  {PLAN_FEATURES.map((feature) => {
                    const value = feature[plan.id];
                    const hasFeature = value === true || typeof value === "string";

                    return (
                      <div
                        key={feature.name}
                        className={`flex items-start gap-2 text-sm ${
                          hasFeature ? "text-neutral-700" : "text-neutral-400"
                        }`}
                      >
                        {hasFeature ? (
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-neutral-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span>
                          {feature.name}
                          {typeof value === "string" && (
                            <span className="text-neutral-500 ml-1">({value})</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Free Trial Banner */}
      {!trialUsed && !isPremium() && (
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Try Premium Free for 7 Days</h3>
              <p className="text-purple-100 mt-1">
                Experience all premium features with no commitment
              </p>
            </div>
            <Button
              className="bg-white text-purple-600 hover:bg-purple-50"
              onClick={handleStartTrial}
            >
              Start Free Trial
            </Button>
          </div>
        </Card>
      )}

      {/* FAQ Section */}
      <Card>
        <CardHeader title="Frequently Asked Questions" />
        <div className="space-y-4">
          {[
            {
              q: "Can I cancel anytime?",
              a: "Yes! You can cancel your subscription at any time. You'll continue to have access until your billing period ends.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit/debit cards, UPI, net banking, and digital wallets through Razorpay.",
            },
            {
              q: "Is there a refund policy?",
              a: "We offer a 7-day money-back guarantee if you're not satisfied with Premium.",
            },
            {
              q: "Can I switch between plans?",
              a: "Yes, you can upgrade or downgrade your plan at any time. The difference will be prorated.",
            },
            {
              q: "What happens to my data if I cancel?",
              a: "Your data remains safe. If you downgrade to Free, you keep access to basic features and all your historical data.",
            },
          ].map((faq, idx) => (
            <div key={idx} className="border-b border-neutral-100 last:border-0 pb-4 last:pb-0">
              <h4 className="font-medium text-neutral-900">{faq.q}</h4>
              <p className="text-sm text-neutral-500 mt-1">{faq.a}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPaymentModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Card className="max-w-md w-full">
              <CardHeader
                title="Complete Your Purchase"
                subtitle={`Upgrade to ${PLANS.find(p => p.id === selectedPlan)?.name}`}
              />

              {/* Order Summary */}
              <div className="bg-neutral-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-600">Plan</span>
                  <span className="font-medium">
                    {PLANS.find(p => p.id === selectedPlan)?.name} ({billingCycle})
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-600">Duration</span>
                  <span className="font-medium">
                    {billingCycle === "monthly" ? "1 Month" : "1 Year"}
                  </span>
                </div>
                <div className="border-t border-neutral-200 my-3"></div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-neutral-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(
                      billingCycle === "monthly"
                        ? PLANS.find(p => p.id === selectedPlan)?.monthlyPrice || 0
                        : PLANS.find(p => p.id === selectedPlan)?.yearlyPrice || 0
                    )}
                  </span>
                </div>
              </div>

              {/* Payment Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Demo Mode</p>
                    <p className="text-xs text-blue-600 mt-1">
                      This is a demo. In production, you would be redirected to Razorpay for secure payment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </Button>
                <Button fullWidth onClick={handlePayment}>
                  Complete Purchase
                </Button>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-neutral-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secured by 256-bit SSL encryption</span>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
