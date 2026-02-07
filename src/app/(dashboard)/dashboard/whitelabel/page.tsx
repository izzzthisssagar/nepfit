"use client";

import { useState } from "react";

type WhiteLabelTab = "overview" | "branding" | "tenants" | "analytics";

interface Partner {
  id: string;
  name: string;
  logo: string;
  domain: string;
  plan: "starter" | "professional" | "enterprise";
  users: number;
  status: "active" | "trial" | "suspended" | "pending";
  revenue: number;
  joinedDate: string;
}

interface BrandingConfig {
  id: string;
  label: string;
  type: "color" | "text" | "image" | "toggle";
  value: string;
  description: string;
}

interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: "starter" | "professional" | "enterprise";
  users: number;
  maxUsers: number;
  status: "active" | "trial" | "suspended" | "pending";
  createdDate: string;
  primaryColor: string;
  logo: string;
  monthlyRevenue: number;
}

interface RevenueData {
  month: string;
  starter: number;
  professional: number;
  enterprise: number;
}

const mockPartners: Partner[] = [
  { id: "p1", name: "HealthFirst Nepal", logo: "🏥", domain: "healthfirst.nepfit.com", plan: "enterprise", users: 2450, status: "active", revenue: 4500, joinedDate: "2025-08-15" },
  { id: "p2", name: "FitLife Gym Chain", logo: "💪", domain: "fitlife.nepfit.com", plan: "professional", users: 890, status: "active", revenue: 1800, joinedDate: "2025-10-01" },
  { id: "p3", name: "NutriCare Clinics", logo: "🥗", domain: "nutricare.nepfit.com", plan: "professional", users: 560, status: "active", revenue: 1200, joinedDate: "2025-11-20" },
  { id: "p4", name: "YogaFlow Studios", logo: "🧘", domain: "yogaflow.nepfit.com", plan: "starter", users: 230, status: "trial", revenue: 0, joinedDate: "2026-01-10" },
  { id: "p5", name: "Corporate Wellness Co", logo: "🏢", domain: "corpwell.nepfit.com", plan: "enterprise", users: 3200, status: "active", revenue: 6000, joinedDate: "2025-07-01" },
  { id: "p6", name: "MindBody Health", logo: "🧠", domain: "mindbody.nepfit.com", plan: "starter", users: 145, status: "pending", revenue: 0, joinedDate: "2026-02-01" },
];

const brandingConfig: BrandingConfig[] = [
  { id: "b1", label: "Primary Color", type: "color", value: "#10b981", description: "Main brand color used across the app" },
  { id: "b2", label: "Secondary Color", type: "color", value: "#f97316", description: "Accent color for highlights and CTAs" },
  { id: "b3", label: "App Name", type: "text", value: "NepFit", description: "Display name shown in header and PWA" },
  { id: "b4", label: "Logo URL", type: "image", value: "/logo.png", description: "Company logo (SVG or PNG, 200x200px)" },
  { id: "b5", label: "Favicon", type: "image", value: "/favicon.ico", description: "Browser tab icon (32x32px)" },
  { id: "b6", label: "Custom Domain", type: "text", value: "app.example.com", description: "Your custom domain for the app" },
  { id: "b7", label: "Footer Text", type: "text", value: "© 2026 Your Company", description: "Copyright text in footer" },
  { id: "b8", label: "Show Powered By", type: "toggle", value: "true", description: "Show 'Powered by NepFit' badge" },
];

const mockTenants: Tenant[] = [
  { id: "t1", name: "HealthFirst Nepal", domain: "healthfirst.nepfit.com", plan: "enterprise", users: 2450, maxUsers: 5000, status: "active", createdDate: "2025-08-15", primaryColor: "#2563eb", logo: "🏥", monthlyRevenue: 4500 },
  { id: "t2", name: "FitLife Gym Chain", domain: "fitlife.nepfit.com", plan: "professional", users: 890, maxUsers: 1000, status: "active", createdDate: "2025-10-01", primaryColor: "#dc2626", logo: "💪", monthlyRevenue: 1800 },
  { id: "t3", name: "NutriCare Clinics", domain: "nutricare.nepfit.com", plan: "professional", users: 560, maxUsers: 1000, status: "active", createdDate: "2025-11-20", primaryColor: "#16a34a", logo: "🥗", monthlyRevenue: 1200 },
  { id: "t4", name: "YogaFlow Studios", domain: "yogaflow.nepfit.com", plan: "starter", users: 230, maxUsers: 500, status: "trial", createdDate: "2026-01-10", primaryColor: "#9333ea", logo: "🧘", monthlyRevenue: 0 },
  { id: "t5", name: "Corporate Wellness Co", domain: "corpwell.nepfit.com", plan: "enterprise", users: 3200, maxUsers: 10000, status: "active", createdDate: "2025-07-01", primaryColor: "#0891b2", logo: "🏢", monthlyRevenue: 6000 },
];

const revenueData: RevenueData[] = [
  { month: "Sep", starter: 1200, professional: 3600, enterprise: 8500 },
  { month: "Oct", starter: 1400, professional: 4200, enterprise: 9200 },
  { month: "Nov", starter: 1600, professional: 4800, enterprise: 10500 },
  { month: "Dec", starter: 1800, professional: 5400, enterprise: 10800 },
  { month: "Jan", starter: 2100, professional: 6000, enterprise: 11500 },
  { month: "Feb", starter: 2400, professional: 6600, enterprise: 12000 },
];

const pricingPlans = [
  { name: "Starter", price: 299, icon: "🚀", features: ["Up to 500 users", "Basic branding", "Email support", "Standard analytics", "Monthly reports"], color: "from-blue-500 to-blue-600" },
  { name: "Professional", price: 799, icon: "⭐", features: ["Up to 2,000 users", "Full branding", "Priority support", "Advanced analytics", "Custom domain", "API access"], color: "from-emerald-500 to-teal-600" },
  { name: "Enterprise", price: 1999, icon: "👑", features: ["Unlimited users", "Complete white label", "Dedicated support", "Custom features", "SLA guarantee", "Multi-region", "Custom integrations"], color: "from-purple-500 to-purple-600" },
];

export default function WhiteLabelPage() {
  const [activeTab, setActiveTab] = useState<WhiteLabelTab>("overview");
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const tabs: { id: WhiteLabelTab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "branding", label: "Branding", icon: "🎨" },
    { id: "tenants", label: "Tenants", icon: "🏢" },
    { id: "analytics", label: "Analytics", icon: "📈" },
  ];

  const totalUsers = mockPartners.reduce((sum, p) => sum + p.users, 0);
  const totalRevenue = mockPartners.reduce((sum, p) => sum + p.revenue, 0);
  const activePartners = mockPartners.filter(p => p.status === "active").length;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">🏷️ White Label Solution</h1>
        <p className="text-purple-100">License and customize NepFit for your brand</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-purple-500 text-white"
                : "bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Active Partners", value: activePartners.toString(), icon: "🤝", color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Total Users", value: totalUsers.toLocaleString(), icon: "👥", color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Monthly Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: "💰", color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Avg Satisfaction", value: "4.7/5", icon: "⭐", color: "text-amber-600", bg: "bg-amber-50" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center text-lg mb-3`}>{stat.icon}</div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Pricing Plans */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">📋 Pricing Plans</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {pricingPlans.map((plan, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                  <div className={`bg-gradient-to-r ${plan.color} p-4 text-white`}>
                    <div className="text-2xl mb-1">{plan.icon}</div>
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    <p className="text-2xl font-bold">${plan.price}<span className="text-sm font-normal">/mo</span></p>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-neutral-600">
                          <span className="text-emerald-500">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partner List */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🤝 Active Partners</h2>
            <div className="space-y-3">
              {mockPartners.map(partner => (
                <div
                  key={partner.id}
                  onClick={() => setSelectedPartner(partner)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 flex items-center justify-between cursor-pointer hover:border-purple-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center text-2xl">{partner.logo}</div>
                    <div>
                      <h3 className="font-medium text-neutral-800">{partner.name}</h3>
                      <p className="text-sm text-neutral-500">{partner.domain}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-medium text-neutral-700">{partner.users.toLocaleString()} users</p>
                      <p className="text-xs text-neutral-500">{partner.plan}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      partner.status === "active" ? "bg-emerald-50 text-emerald-600" :
                      partner.status === "trial" ? "bg-amber-50 text-amber-600" :
                      partner.status === "suspended" ? "bg-red-50 text-red-600" :
                      "bg-neutral-50 text-neutral-600"
                    }`}>
                      {partner.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Branding Tab */}
      {activeTab === "branding" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🎨 Brand Customization</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {brandingConfig.map(config => (
                <div key={config.id} className="p-4 bg-neutral-50 rounded-xl">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">{config.label}</label>
                  <p className="text-xs text-neutral-500 mb-2">{config.description}</p>
                  {config.type === "color" && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg border border-neutral-200" style={{ backgroundColor: config.value }}></div>
                      <input type="text" value={config.value} readOnly className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white" />
                    </div>
                  )}
                  {config.type === "text" && (
                    <input type="text" value={config.value} readOnly className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white" />
                  )}
                  {config.type === "image" && (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-white rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-400">📷</div>
                      <button className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50">Upload</button>
                    </div>
                  )}
                  {config.type === "toggle" && (
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-6 rounded-full ${config.value === "true" ? "bg-purple-500" : "bg-neutral-300"} relative cursor-pointer`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${config.value === "true" ? "right-1" : "left-1"}`}></div>
                      </div>
                      <span className="text-sm text-neutral-600">{config.value === "true" ? "Enabled" : "Disabled"}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">👁️ Live Preview</h2>
            <div className="border-2 border-dashed border-neutral-200 rounded-xl p-6">
              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-t-xl p-4 text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">🥗</div>
                    <span className="font-bold">NepFit</span>
                  </div>
                </div>
                <div className="bg-neutral-50 p-4 rounded-b-xl space-y-3">
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-neutral-500">Today&apos;s Progress</p>
                    <div className="h-2 bg-neutral-100 rounded-full mt-2">
                      <div className="h-2 bg-emerald-500 rounded-full w-3/4"></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-neutral-500">Quick Actions</p>
                    <div className="flex gap-2 mt-2">
                      <div className="w-8 h-8 bg-emerald-50 rounded-lg"></div>
                      <div className="w-8 h-8 bg-emerald-50 rounded-lg"></div>
                      <div className="w-8 h-8 bg-emerald-50 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CSS Variables */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">🔧 CSS Variables Export</h2>
            <div className="bg-neutral-900 rounded-xl p-4 text-sm font-mono">
              <p className="text-emerald-400">{`:root {`}</p>
              <p className="text-neutral-300 pl-4">{`--primary: #10b981;`}</p>
              <p className="text-neutral-300 pl-4">{`--secondary: #f97316;`}</p>
              <p className="text-neutral-300 pl-4">{`--accent: #8b5cf6;`}</p>
              <p className="text-neutral-300 pl-4">{`--background: #ffffff;`}</p>
              <p className="text-neutral-300 pl-4">{`--surface: #f9fafb;`}</p>
              <p className="text-neutral-300 pl-4">{`--text: #1f2937;`}</p>
              <p className="text-emerald-400">{`}`}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tenants Tab */}
      {activeTab === "tenants" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-neutral-800">🏢 Tenant Management</h2>
            <button
              onClick={() => setShowAddTenant(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded-xl text-sm font-medium hover:bg-purple-600 transition-colors"
            >
              + Add Tenant
            </button>
          </div>

          {/* Tenant Cards */}
          <div className="space-y-3">
            {mockTenants.map(tenant => (
              <div key={tenant.id} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: tenant.primaryColor + "20" }}>
                      {tenant.logo}
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-800">{tenant.name}</h3>
                      <p className="text-xs text-neutral-500">{tenant.domain}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    tenant.status === "active" ? "bg-emerald-50 text-emerald-600" :
                    tenant.status === "trial" ? "bg-amber-50 text-amber-600" :
                    tenant.status === "suspended" ? "bg-red-50 text-red-600" :
                    "bg-neutral-50 text-neutral-600"
                  }`}>
                    {tenant.status}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-neutral-500">Plan</p>
                    <p className="text-sm font-medium text-neutral-700 capitalize">{tenant.plan}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Users</p>
                    <p className="text-sm font-medium text-neutral-700">{tenant.users}/{tenant.maxUsers}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Revenue</p>
                    <p className="text-sm font-medium text-emerald-600">${tenant.monthlyRevenue}/mo</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Created</p>
                    <p className="text-sm font-medium text-neutral-700">{new Date(tenant.createdDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
                  </div>
                </div>
                {/* Usage Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-neutral-500 mb-1">
                    <span>User Capacity</span>
                    <span>{Math.round((tenant.users / tenant.maxUsers) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-100 rounded-full">
                    <div
                      className={`h-1.5 rounded-full ${(tenant.users / tenant.maxUsers) > 0.8 ? "bg-amber-500" : "bg-purple-500"}`}
                      style={{ width: `${(tenant.users / tenant.maxUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">💰 Revenue by Plan</h2>
            <div className="space-y-3">
              {revenueData.map((data, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm text-neutral-500 w-10">{data.month}</span>
                  <div className="flex-1 flex gap-1 h-6">
                    <div className="bg-blue-400 rounded-l" style={{ width: `${(data.starter / 16000) * 100}%` }}></div>
                    <div className="bg-emerald-400" style={{ width: `${(data.professional / 16000) * 100}%` }}></div>
                    <div className="bg-purple-400 rounded-r" style={{ width: `${(data.enterprise / 16000) * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-neutral-700 w-20 text-right">
                    ${(data.starter + data.professional + data.enterprise).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-400 rounded"></div> Starter</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-400 rounded"></div> Professional</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-400 rounded"></div> Enterprise</div>
            </div>
          </div>

          {/* Partner Performance */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">📊 Partner Performance</h2>
            <div className="space-y-4">
              {mockPartners.filter(p => p.status === "active").map(partner => (
                <div key={partner.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-xl">{partner.logo}</div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-neutral-700">{partner.name}</span>
                      <span className="text-sm text-emerald-600 font-medium">${partner.revenue}/mo</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full">
                      <div className="h-2 bg-purple-500 rounded-full" style={{ width: `${(partner.revenue / 6000) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Breakdown */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">📱 Feature Usage</h3>
              <div className="space-y-3">
                {[
                  { feature: "Food Logging", usage: 92, icon: "🍽️" },
                  { feature: "Recipes", usage: 78, icon: "📖" },
                  { feature: "AI Chat", usage: 65, icon: "🤖" },
                  { feature: "Challenges", usage: 54, icon: "🏆" },
                  { feature: "Meal Plans", usage: 48, icon: "📅" },
                  { feature: "Analytics", usage: 41, icon: "📊" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-600">{item.feature}</span>
                        <span className="font-medium">{item.usage}%</span>
                      </div>
                      <div className="h-1.5 bg-neutral-100 rounded-full">
                        <div className="h-1.5 bg-emerald-500 rounded-full" style={{ width: `${item.usage}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">🌍 Geographic Distribution</h3>
              <div className="space-y-3">
                {[
                  { region: "Kathmandu Valley", users: 3200, pct: 43 },
                  { region: "Other Nepal", users: 1800, pct: 24 },
                  { region: "India", users: 1400, pct: 19 },
                  { region: "International", users: 1075, pct: 14 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-600">{item.region}</span>
                      <span className="font-medium text-neutral-700">{item.users.toLocaleString()} ({item.pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full">
                      <div className="h-1.5 bg-purple-500 rounded-full" style={{ width: `${item.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Tenant Modal */}
      {showAddTenant && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">➕ Add New Tenant</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Company Name</label>
                <input type="text" placeholder="e.g. HealthCo" className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Custom Domain</label>
                <input type="text" placeholder="e.g. healthco.nepfit.com" className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Plan</label>
                <select className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm">
                  <option>Starter ($299/mo)</option>
                  <option>Professional ($799/mo)</option>
                  <option>Enterprise ($1,999/mo)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Contact Email</label>
                <input type="email" placeholder="admin@healthco.com" className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddTenant(false)} className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50">Cancel</button>
              <button onClick={() => setShowAddTenant(false)} className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-xl text-sm font-medium hover:bg-purple-600">Create Tenant</button>
            </div>
          </div>
        </div>
      )}

      {/* Partner Detail Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center text-2xl">{selectedPartner.logo}</div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-800">{selectedPartner.name}</h3>
                <p className="text-sm text-neutral-500">{selectedPartner.domain}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-neutral-50 rounded-xl p-3">
                <p className="text-xs text-neutral-500">Plan</p>
                <p className="text-sm font-medium capitalize">{selectedPartner.plan}</p>
              </div>
              <div className="bg-neutral-50 rounded-xl p-3">
                <p className="text-xs text-neutral-500">Users</p>
                <p className="text-sm font-medium">{selectedPartner.users.toLocaleString()}</p>
              </div>
              <div className="bg-neutral-50 rounded-xl p-3">
                <p className="text-xs text-neutral-500">Revenue</p>
                <p className="text-sm font-medium text-emerald-600">${selectedPartner.revenue}/mo</p>
              </div>
              <div className="bg-neutral-50 rounded-xl p-3">
                <p className="text-xs text-neutral-500">Joined</p>
                <p className="text-sm font-medium">{new Date(selectedPartner.joinedDate).toLocaleDateString()}</p>
              </div>
            </div>
            <button onClick={() => setSelectedPartner(null)} className="w-full px-4 py-2 bg-purple-500 text-white rounded-xl text-sm font-medium hover:bg-purple-600">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}