"use client";

import Link from "next/link";
import { Button } from "@/components/ui";

const features = [
  {
    icon: "🍎",
    title: "Smart Food Logging",
    description: "Log meals in seconds with AI-powered food recognition and 105+ Nepali foods",
    color: "bg-red-100",
  },
  {
    icon: "📊",
    title: "Nutrition Tracking",
    description: "Track calories, macros, and micronutrients with beautiful visualizations",
    color: "bg-blue-100",
  },
  {
    icon: "🍳",
    title: "Recipe Library",
    description: "Discover 45+ healthy recipes tailored for Nepali and Indian cuisines",
    color: "bg-yellow-100",
  },
  {
    icon: "🎯",
    title: "Goal Setting",
    description: "Set personalized goals for weight loss, muscle gain, or maintenance",
    color: "bg-green-100",
  },
  {
    icon: "🏆",
    title: "Gamification",
    description: "Stay motivated with streaks, badges, and community challenges",
    color: "bg-purple-100",
  },
  {
    icon: "🤖",
    title: "AI Health Coach",
    description: "Get personalized advice from our AI nutritionist anytime",
    color: "bg-pink-100",
  },
];

const stats = [
  { value: "105+", label: "Foods in Database" },
  { value: "45+", label: "Healthy Recipes" },
  { value: "3", label: "Languages Supported" },
  { value: "24/7", label: "AI Support" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Lost 12kg in 3 months",
    avatar: "👩",
    content: "NepFit made tracking my meals so easy! The Nepali food database is amazing - finally an app that understands dal bhat!",
    rating: 5,
  },
  {
    name: "Rajesh Thapa",
    role: "Diabetes Management",
    avatar: "👨",
    content: "The GI index feature helped me manage my blood sugar levels. The AI recommendations are spot-on for my dietary needs.",
    rating: 5,
  },
  {
    name: "Anita Gurung",
    role: "Fitness Enthusiast",
    avatar: "👩‍🦱",
    content: "I love the meal planning feature! It saves me hours every week and keeps my nutrition on track for my workouts.",
    rating: 5,
  },
];

const processSteps = [
  {
    step: "01",
    title: "Create Your Profile",
    description: "Set your goals, preferences, and dietary restrictions",
  },
  {
    step: "02",
    title: "Log Your Meals",
    description: "Quick and easy food logging with our smart search",
  },
  {
    step: "03",
    title: "Track Progress",
    description: "Monitor your nutrition and see your improvements",
  },
  {
    step: "04",
    title: "Achieve Goals",
    description: "Reach your health goals with personalized guidance",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">NepFit</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-neutral-600 hover:text-primary-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-neutral-600 hover:text-primary-600 transition-colors">How It Works</a>
              <a href="#testimonials" className="text-neutral-600 hover:text-primary-600 transition-colors">Testimonials</a>
              <a href="#pricing" className="text-neutral-600 hover:text-primary-600 transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden gradient-hero">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-0 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-200 rounded-full blur-3xl opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-slide-up">
              <span className="badge badge-primary mb-4">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                Nepal&apos;s #1 Nutrition App
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-6">
                Eat <span className="text-primary-500">Healthy</span>,<br />
                Live <span className="text-secondary-500">Happy</span>
              </h1>
              <p className="text-lg text-neutral-600 mb-8 max-w-lg">
                Track your nutrition with the first app designed for Nepali and Indian diets.
                Achieve your health goals with AI-powered insights and personalized meal plans.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <Link href="/signup">
                  <Button size="lg" className="shadow-lg hover:shadow-xl">
                    Start Free Trial
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Demo
                </Button>
              </div>
              {/* Social Proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["👩", "👨", "👩‍🦱", "👨‍🦰"].map((avatar, i) => (
                    <div key={i} className="w-10 h-10 bg-white rounded-full border-2 border-white shadow flex items-center justify-center text-lg">
                      {avatar}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-secondary-400">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                  <p className="text-sm text-neutral-500">
                    <span className="font-semibold text-neutral-700">4.9/5</span> from 2,000+ users
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content - App Preview */}
            <div className="relative animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="relative z-10">
                {/* Phone Mockup */}
                <div className="bg-neutral-900 rounded-[3rem] p-3 shadow-2xl mx-auto max-w-[300px]">
                  <div className="bg-white rounded-[2.5rem] overflow-hidden">
                    {/* Status Bar */}
                    <div className="bg-primary-500 px-6 py-3 flex items-center justify-between text-white text-xs">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <span>📶</span>
                        <span>🔋</span>
                      </div>
                    </div>
                    {/* App Content Preview */}
                    <div className="p-4 space-y-4">
                      <div className="text-center">
                        <p className="text-neutral-500 text-sm">Today&apos;s Progress</p>
                        <div className="text-4xl font-bold text-neutral-900">1,450</div>
                        <p className="text-primary-600 text-sm">calories remaining</p>
                      </div>
                      <div className="bg-neutral-50 rounded-xl p-3">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-neutral-600">Protein</span>
                          <span className="font-medium">45g / 90g</span>
                        </div>
                        <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500 rounded-full" style={{ width: "50%" }} />
                        </div>
                      </div>
                      <div className="bg-neutral-50 rounded-xl p-3">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-neutral-600">Carbs</span>
                          <span className="font-medium">120g / 200g</span>
                        </div>
                        <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                          <div className="h-full bg-secondary-500 rounded-full" style={{ width: "60%" }} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
                          <span className="text-2xl">🔥</span>
                          <p className="text-xs text-neutral-600 mt-1">7 Day Streak!</p>
                        </div>
                        <div className="flex-1 bg-blue-50 rounded-xl p-3 text-center">
                          <span className="text-2xl">💧</span>
                          <p className="text-xs text-neutral-600 mt-1">6/8 Glasses</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute -left-4 top-20 bg-white rounded-2xl p-4 shadow-lg float" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
                    🍳
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">Breakfast</p>
                    <p className="text-sm text-neutral-500">320 cal logged</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 bottom-32 bg-white rounded-2xl p-4 shadow-lg float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                    🎯
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">Goal Reached!</p>
                    <p className="text-sm text-green-600">+50 XP earned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center animate-count" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <p className="text-neutral-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge badge-primary mb-4">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Everything You Need for<br />
              <span className="text-primary-500">Healthy Living</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Powerful tools designed specifically for South Asian diets and lifestyles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge badge-secondary mb-4">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Your Health Journey<br />
              <span className="text-secondary-500">Starts Here</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="step-number bg-primary-500 text-white text-xl">
                    {step.step}
                  </div>
                  {i < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-primary-200" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{step.title}</h3>
                <p className="text-neutral-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge badge-primary mb-4">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Loved by <span className="text-primary-500">Thousands</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="testimonial-card">
                <div className="rating-stars mb-4 pt-6">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>
                <p className="text-neutral-700 mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                    <p className="text-sm text-primary-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge badge-accent mb-4">Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Choose Your <span className="text-primary-500">Plan</span>
            </h2>
            <p className="text-lg text-neutral-600">
              Start free, upgrade when you&apos;re ready
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)]">
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Free</h3>
              <p className="text-neutral-500 mb-6">Get started with basics</p>
              <div className="text-4xl font-bold text-neutral-900 mb-6">
                ₹0<span className="text-lg text-neutral-500 font-normal">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Basic food logging", "100+ foods database", "Daily tracking", "Water tracking"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-neutral-600">
                    <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button variant="outline" fullWidth size="lg">Start Free</Button>
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-2xl p-8 border-2 border-primary-500 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Premium</h3>
              <p className="text-neutral-500 mb-6">For serious health goals</p>
              <div className="text-4xl font-bold text-primary-600 mb-6">
                ₹199<span className="text-lg text-neutral-500 font-normal">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Everything in Free", "AI Chat (unlimited)", "Advanced analytics", "Meal planning", "Recipe library", "Priority support"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-neutral-600">
                    <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button fullWidth size="lg">Get Premium</Button>
              </Link>
            </div>

            {/* Family Plan */}
            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)]">
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Family</h3>
              <p className="text-neutral-500 mb-6">For the whole family</p>
              <div className="text-4xl font-bold text-neutral-900 mb-6">
                ₹349<span className="text-lg text-neutral-500 font-normal">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Everything in Premium", "Up to 5 accounts", "Family dashboard", "Shared meal plans", "Kids mode"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-neutral-600">
                    <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button variant="outline" fullWidth size="lg">Get Family</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 dots-pattern opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Start Your Health Journey Today
          </h2>
          <p className="text-lg text-primary-200 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their lives with NepFit.
            Free to start, no credit card required.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50 shadow-lg">
              Get Started Free
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <span className="text-xl font-bold">NepFit</span>
              </div>
              <p className="text-neutral-400">
                Nepal&apos;s first nutrition tracking app designed for South Asian diets.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.27 20.1H3.65V9.24h3.62V20.1zM5.47 7.76h-.03c-1.22 0-2-.83-2-1.87 0-1.06.8-1.87 2.05-1.87 1.24 0 2 .8 2.02 1.87 0 1.04-.78 1.87-2.05 1.87zM20.34 20.1h-3.63v-5.8c0-1.45-.52-2.45-1.83-2.45-1 0-1.6.67-1.87 1.32-.1.23-.11.55-.11.88v6.05H9.28s.05-9.82 0-10.84h3.63v1.54a3.6 3.6 0 0 1 3.26-1.8c2.39 0 4.18 1.56 4.18 4.89v6.21z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-400">
            <p>&copy; 2026 NepFit. Made with ❤️ in Nepal</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
