# NepFit Phase 3 - Implementation Plan

## Overview
Phase 3 focuses on social features, premium monetization, advanced integrations, and scaling the app for production. This phase transforms NepFit from a personal nutrition tracker into a comprehensive health platform.

---

## Phase 3 Features

### 1. Social & Community Features
**Priority: HIGH**

#### 1.1 Friend System
- Add friends via email/username
- View friends' progress (opt-in privacy)
- Send encouragement/kudos
- **Files to create:**
  - `src/store/socialStore.ts`
  - `src/app/(dashboard)/dashboard/friends/page.tsx`
  - `src/components/FriendCard.tsx`

#### 1.2 Community Challenges
- Weekly/monthly challenges (e.g., "Log meals for 7 days")
- Leaderboards with anonymity option
- Challenge rewards (badges, points)
- **Files to create:**
  - `src/app/(dashboard)/dashboard/challenges/page.tsx`
  - `src/data/challenges.ts`
  - Update `gamificationStore.ts` for challenge rewards

#### 1.3 Recipe Sharing
- Share personal recipes with community
- Like/save recipes from others
- Recipe comments and ratings
- **Files to create:**
  - `src/app/(dashboard)/dashboard/community-recipes/page.tsx`
  - `src/store/recipeStore.ts`

---

### 2. Premium/Subscription Model
**Priority: HIGH**

#### 2.1 Subscription Tiers
```
FREE:
- Basic food logging
- 10 AI chat messages/day
- Basic progress tracking
- Access to public recipes

PREMIUM (₹199/month or ₹1499/year):
- Unlimited AI chat
- Advanced analytics
- Personalized meal plans
- Priority support
- No ads
- Export data

FAMILY (₹349/month):
- Up to 5 family members
- Shared meal planning
- Family nutrition dashboard
```

#### 2.2 Payment Integration
- Razorpay for Indian payments
- Stripe for international
- **Files to create:**
  - `src/store/subscriptionStore.ts`
  - `src/app/(dashboard)/dashboard/premium/page.tsx`
  - `src/app/api/payment/route.ts`
  - `src/components/PaywallModal.tsx`

---

### 3. Advanced Analytics Dashboard
**Priority: MEDIUM**

#### 3.1 Enhanced Progress Tracking
- Weekly/monthly comparison charts
- Macros breakdown over time
- Weight correlation with nutrition
- Sleep impact analysis (if data available)
- **Files to create:**
  - `src/app/(dashboard)/dashboard/analytics/page.tsx`
  - `src/components/charts/` (multiple chart components)

#### 3.2 Health Insights Engine
- AI-generated weekly health reports
- Trend detection (improving/declining)
- Personalized recommendations based on data patterns
- **Enhancement to:**
  - `src/store/aiBrainStore.ts`

---

### 4. Device Integrations
**Priority: MEDIUM**

#### 4.1 Fitness Tracker Sync
- Google Fit integration
- Apple HealthKit (iOS)
- Fitbit API
- Samsung Health
- **Files to create:**
  - `src/lib/integrations/googleFit.ts`
  - `src/lib/integrations/healthKit.ts`
  - `src/app/(dashboard)/dashboard/settings/integrations/page.tsx`

#### 4.2 Smart Scale Integration
- Weight auto-sync
- Body composition data
- Historical weight charts

---

### 5. Multi-Language Support
**Priority: HIGH**

#### 5.1 Languages to Support
- English (default)
- Nepali (नेपाली)
- Hindi (हिन्दी)
- Bengali (বাংলা) - future

#### 5.2 Implementation
- Use next-intl for i18n
- RTL support preparation
- **Files to create:**
  - `src/i18n/` directory
  - `src/i18n/messages/en.json`
  - `src/i18n/messages/ne.json`
  - `src/i18n/messages/hi.json`
  - `src/components/LanguageSwitcher.tsx`

---

### 6. Enhanced AI Features
**Priority: MEDIUM**

#### 6.1 AI Meal Photo Recognition
- Upload photo → identify foods
- Estimate portions from image
- Use vision API (GPT-4V or similar)
- **Files to create:**
  - `src/components/PhotoFoodLogger.tsx`
  - `src/app/api/ai/photo-analyze/route.ts`

#### 6.2 Voice Logging
- "I had 2 rotis and dal for lunch"
- Speech-to-text → food parsing
- **Files to create:**
  - `src/components/VoiceFoodLogger.tsx`
  - `src/lib/voiceParser.ts`

#### 6.3 Smart Meal Suggestions
- Based on time of day
- Based on nutrition gaps
- Based on preferences learned
- **Enhancement to:**
  - `src/store/aiBrainStore.ts`

---

### 7. Notification System
**Priority: HIGH**

#### 7.1 Push Notifications (PWA)
- Meal reminders
- Hydration reminders
- Streak at risk alerts
- Achievement unlocked
- **Files to create:**
  - `src/lib/notifications.ts`
  - Update `sw.js` for push handling

#### 7.2 Email Notifications
- Weekly progress summary
- Account activity
- Challenge updates
- **Files to create:**
  - `src/app/api/email/route.ts`
  - Email templates

---

### 8. Barcode Scanner
**Priority: LOW**

#### 8.1 Features
- Scan packaged food barcodes
- Auto-fill nutrition from database
- Manual entry if not found
- Contribute to database
- **Files to create:**
  - `src/components/BarcodeScanner.tsx`
  - `src/lib/barcodeApi.ts`

---

### 9. Settings & Profile Enhancements
**Priority: MEDIUM**

#### 9.1 Profile Customization
- Profile photo
- Bio
- Health goals display
- Privacy settings
- **Files to create:**
  - `src/app/(dashboard)/dashboard/settings/profile/page.tsx`

#### 9.2 Data Management
- Export data (CSV, PDF)
- Delete account
- Data backup
- **Files to create:**
  - `src/app/(dashboard)/dashboard/settings/data/page.tsx`
  - `src/lib/dataExport.ts`

---

## Implementation Timeline

### Week 1-2: Social Foundation
- [ ] Friend system backend
- [ ] Friend list UI
- [ ] Community challenges structure

### Week 3-4: Premium & Payments
- [ ] Subscription store
- [ ] Razorpay integration
- [ ] Paywall components
- [ ] Premium features gating

### Week 5-6: Multi-Language
- [ ] Set up next-intl
- [ ] Translate all UI strings
- [ ] Language switcher
- [ ] Test Nepali/Hindi

### Week 7-8: Analytics & AI
- [ ] Advanced analytics dashboard
- [ ] Photo food recognition (if API available)
- [ ] Enhanced insights engine

### Week 9-10: Integrations & Polish
- [ ] Google Fit integration
- [ ] Notification system
- [ ] Bug fixes and optimization
- [ ] Performance improvements

---

## Technical Architecture Changes

### Database Schema Additions
```sql
-- Friends
CREATE TABLE friendships (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  friend_id UUID REFERENCES users(id),
  status ENUM('pending', 'accepted', 'blocked'),
  created_at TIMESTAMP
);

-- Challenges
CREATE TABLE challenges (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  type ENUM('streak', 'calories', 'water', 'custom'),
  target_value INT,
  start_date DATE,
  end_date DATE,
  reward_badge_id VARCHAR(50)
);

-- Challenge Participation
CREATE TABLE challenge_participants (
  id UUID PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id),
  user_id UUID REFERENCES users(id),
  progress INT DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  joined_at TIMESTAMP
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan ENUM('free', 'premium', 'family'),
  status ENUM('active', 'cancelled', 'expired'),
  payment_provider VARCHAR(50),
  payment_id VARCHAR(255),
  starts_at TIMESTAMP,
  expires_at TIMESTAMP
);
```

### API Routes to Add
```
POST /api/friends/request
POST /api/friends/accept
GET  /api/friends/list
DELETE /api/friends/:id

GET  /api/challenges
POST /api/challenges/join
GET  /api/challenges/:id/leaderboard

POST /api/payment/create-order
POST /api/payment/verify
GET  /api/subscription/status

POST /api/ai/analyze-photo
POST /api/ai/voice-to-food
```

---

## Files Summary

### New Files to Create
1. `src/store/socialStore.ts`
2. `src/store/subscriptionStore.ts`
3. `src/store/recipeStore.ts`
4. `src/app/(dashboard)/dashboard/friends/page.tsx`
5. `src/app/(dashboard)/dashboard/challenges/page.tsx`
6. `src/app/(dashboard)/dashboard/community-recipes/page.tsx`
7. `src/app/(dashboard)/dashboard/premium/page.tsx`
8. `src/app/(dashboard)/dashboard/analytics/page.tsx`
9. `src/app/(dashboard)/dashboard/settings/profile/page.tsx`
10. `src/app/(dashboard)/dashboard/settings/integrations/page.tsx`
11. `src/app/(dashboard)/dashboard/settings/data/page.tsx`
12. `src/components/PaywallModal.tsx`
13. `src/components/PhotoFoodLogger.tsx`
14. `src/components/VoiceFoodLogger.tsx`
15. `src/components/LanguageSwitcher.tsx`
16. `src/components/BarcodeScanner.tsx`
17. `src/lib/notifications.ts`
18. `src/lib/dataExport.ts`
19. `src/i18n/` directory with translation files

### Files to Enhance
1. `src/store/aiBrainStore.ts` - Add meal suggestions
2. `src/store/gamificationStore.ts` - Challenge rewards
3. `src/app/(dashboard)/layout.tsx` - Add new nav items
4. `public/sw.js` - Push notification handling

---

## Recommended Starting Point

**Start with: Premium/Subscription System**

Reason: Monetization foundation enables sustainable development and sets up feature gating for premium features.

1. Create `subscriptionStore.ts`
2. Create premium page with tier comparison
3. Implement Razorpay integration
4. Add `PaywallModal` for gated features
5. Update UI to show premium badges

This allows us to gate future features (AI photo, analytics, etc.) behind premium while building them out.

---

## Questions Before Implementation

1. **Payment Provider Preference?** Razorpay (India-focused) or Stripe (international)?
2. **AI Photo Recognition API?** OpenAI Vision, Google Cloud Vision, or local model?
3. **Multi-language Priority?** Start with Nepali or Hindi first?
4. **Social Features Scope?** Full social network or simple friend tracking?

---

*Phase 3 Plan - Created for NepFit v2.0*
