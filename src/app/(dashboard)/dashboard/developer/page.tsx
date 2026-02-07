"use client";

import { useState } from "react";

type DeveloperTab = "overview" | "api_keys" | "documentation" | "usage" | "webhooks";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  status: "active" | "revoked";
  permissions: string[];
  requestsToday: number;
}

interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  rateLimit: string;
  auth: boolean;
}

interface ApiSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  version: string;
  endpoints: ApiEndpoint[];
}

interface UsageRecord {
  endpoint: string;
  requests: number;
  avgLatency: number;
  errorRate: number;
  lastHour: number;
}

interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret: string;
  status: "active" | "inactive" | "failing";
  lastTriggered?: string;
  successRate: number;
}

const mockApiKeys: ApiKey[] = [
  {
    id: "k1",
    name: "Production App",
    key: "nf_live_sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    created: "2025-09-15",
    lastUsed: "2026-02-07",
    status: "active",
    permissions: ["food:read", "nutrition:read", "meal_plan:read", "user:read"],
    requestsToday: 4521,
  },
  {
    id: "k2",
    name: "Staging Environment",
    key: "nf_test_sk_x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4",
    created: "2025-10-01",
    lastUsed: "2026-02-06",
    status: "active",
    permissions: ["food:read", "nutrition:read"],
    requestsToday: 238,
  },
  {
    id: "k3",
    name: "Old Integration",
    key: "nf_live_sk_j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6",
    created: "2025-06-01",
    lastUsed: "2025-11-15",
    status: "revoked",
    permissions: ["food:read"],
    requestsToday: 0,
  },
];

const mockApiSections: ApiSection[] = [
  {
    id: "food",
    title: "Food Database API",
    description: "Search and retrieve nutritional information for Nepali and South Asian foods",
    icon: "🍛",
    version: "v2",
    endpoints: [
      { method: "GET", path: "/api/v2/foods/search", description: "Search foods by name or barcode", rateLimit: "100/min", auth: true },
      { method: "GET", path: "/api/v2/foods/{id}", description: "Get detailed food nutrition data", rateLimit: "200/min", auth: true },
      { method: "GET", path: "/api/v2/foods/categories", description: "List all food categories", rateLimit: "50/min", auth: true },
      { method: "POST", path: "/api/v2/foods/custom", description: "Add a custom food entry", rateLimit: "20/min", auth: true },
    ],
  },
  {
    id: "nutrition",
    title: "Nutrition Calculator API",
    description: "Calculate nutritional values, recommended daily intake, and meal analysis",
    icon: "🧮",
    version: "v2",
    endpoints: [
      { method: "POST", path: "/api/v2/nutrition/calculate", description: "Calculate nutrition for a meal", rateLimit: "50/min", auth: true },
      { method: "POST", path: "/api/v2/nutrition/analyze", description: "Analyze a full day's nutrition", rateLimit: "30/min", auth: true },
      { method: "GET", path: "/api/v2/nutrition/rdi", description: "Get recommended daily intake", rateLimit: "100/min", auth: true },
    ],
  },
  {
    id: "meal_plan",
    title: "Meal Plan API",
    description: "Generate and manage personalized meal plans based on dietary preferences",
    icon: "📋",
    version: "v1",
    endpoints: [
      { method: "POST", path: "/api/v1/meal-plans/generate", description: "Generate a personalized meal plan", rateLimit: "10/min", auth: true },
      { method: "GET", path: "/api/v1/meal-plans/{id}", description: "Get a meal plan by ID", rateLimit: "50/min", auth: true },
      { method: "PUT", path: "/api/v1/meal-plans/{id}", description: "Update a meal plan", rateLimit: "20/min", auth: true },
      { method: "DELETE", path: "/api/v1/meal-plans/{id}", description: "Delete a meal plan", rateLimit: "20/min", auth: true },
    ],
  },
  {
    id: "user",
    title: "User Data API",
    description: "Access user profiles, health metrics, and tracking data",
    icon: "👤",
    version: "v2",
    endpoints: [
      { method: "GET", path: "/api/v2/users/me", description: "Get current user profile", rateLimit: "100/min", auth: true },
      { method: "GET", path: "/api/v2/users/me/logs", description: "Get user food logs", rateLimit: "50/min", auth: true },
      { method: "GET", path: "/api/v2/users/me/metrics", description: "Get user health metrics", rateLimit: "50/min", auth: true },
      { method: "POST", path: "/api/v2/users/me/logs", description: "Create a food log entry", rateLimit: "30/min", auth: true },
    ],
  },
];

const mockUsageRecords: UsageRecord[] = [
  { endpoint: "/api/v2/foods/search", requests: 12450, avgLatency: 85, errorRate: 0.3, lastHour: 520 },
  { endpoint: "/api/v2/foods/{id}", requests: 8920, avgLatency: 42, errorRate: 0.1, lastHour: 380 },
  { endpoint: "/api/v2/nutrition/calculate", requests: 5630, avgLatency: 156, errorRate: 0.8, lastHour: 210 },
  { endpoint: "/api/v1/meal-plans/generate", requests: 2140, avgLatency: 890, errorRate: 1.2, lastHour: 85 },
  { endpoint: "/api/v2/users/me/logs", requests: 3890, avgLatency: 65, errorRate: 0.2, lastHour: 165 },
  { endpoint: "/api/v2/users/me", requests: 6780, avgLatency: 38, errorRate: 0.1, lastHour: 290 },
];

const mockWebhooks: Webhook[] = [
  {
    id: "w1",
    url: "https://yourapp.com/webhooks/nepfit",
    events: ["food.logged", "meal_plan.completed", "goal.achieved"],
    secret: "whsec_a1b2c3d4e5f6g7h8i9j0",
    status: "active",
    lastTriggered: "2026-02-07 14:32:00",
    successRate: 99.2,
  },
  {
    id: "w2",
    url: "https://staging.yourapp.com/hooks/health",
    events: ["user.updated", "metrics.synced"],
    secret: "whsec_x9y8z7w6v5u4t3s2r1q0",
    status: "failing",
    lastTriggered: "2026-02-06 09:15:00",
    successRate: 72.5,
  },
];

const availableWebhookEvents = [
  "food.logged",
  "food.deleted",
  "meal_plan.created",
  "meal_plan.completed",
  "goal.achieved",
  "goal.updated",
  "user.updated",
  "user.deleted",
  "metrics.synced",
  "report.generated",
];

const rateLimitTiers = [
  { plan: "Free", daily: "100", perMinute: "10", price: "Free" },
  { plan: "Premium", daily: "10,000", perMinute: "100", price: "NPR 2,999/mo" },
  { plan: "Enterprise", daily: "Unlimited", perMinute: "1,000", price: "Custom" },
];

export default function DeveloperPage() {
  const [activeTab, setActiveTab] = useState<DeveloperTab>("overview");
  const [expandedSection, setExpandedSection] = useState<string | null>("food");
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(["food:read"]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvents, setWebhookEvents] = useState<string[]>([]);

  const apiStats = {
    totalRequests: mockUsageRecords.reduce((sum, r) => sum + r.requests, 0),
    successRate: (100 - mockUsageRecords.reduce((sum, r) => sum + r.errorRate, 0) / mockUsageRecords.length).toFixed(1),
    avgLatency: Math.round(mockUsageRecords.reduce((sum, r) => sum + r.avgLatency, 0) / mockUsageRecords.length),
    activeKeys: mockApiKeys.filter(k => k.status === "active").length,
  };

  const handleCopyKey = (keyId: string, key: string) => {
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-700";
      case "POST":
        return "bg-blue-100 text-blue-700";
      case "PUT":
        return "bg-yellow-100 text-yellow-700";
      case "DELETE":
        return "bg-red-100 text-red-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Developer Portal</h1>
          <p className="text-neutral-600">
            Build integrations with the NepFit API platform
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Full Docs
          </a>
          <button
            onClick={() => setShowCreateKeyModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-sm"
          >
            + New API Key
          </button>
        </div>
      </div>

      {/* API Stats Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">API Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">{(apiStats.totalRequests / 1000).toFixed(1)}K</p>
            <p className="text-xs text-primary-100">Total Requests</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">{apiStats.successRate}%</p>
            <p className="text-xs text-primary-100">Success Rate</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">{apiStats.avgLatency}ms</p>
            <p className="text-xs text-primary-100">Avg Latency</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">{apiStats.activeKeys}</p>
            <p className="text-xs text-primary-100">Active Keys</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 overflow-x-auto">
        {[
          { id: "overview", label: "Overview", icon: "📊" },
          { id: "api_keys", label: "API Keys", icon: "🔑" },
          { id: "documentation", label: "Documentation", icon: "📖" },
          { id: "usage", label: "Usage", icon: "📈" },
          { id: "webhooks", label: "Webhooks", icon: "🔔" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as DeveloperTab)}
            className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "text-primary-600 border-b-2 border-primary-500"
                : "text-neutral-500 hover:text-neutral-700"
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
          {/* Quick Start */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">🚀 Quick Start</h2>
            <p className="text-sm text-neutral-500 mb-4">
              Get started with the NepFit API in minutes. Here&apos;s a sample request:
            </p>
            <div className="bg-neutral-900 rounded-xl p-4 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono">
{`curl -X GET "https://api.nepfit.app/v2/foods/search?q=dal+bhat" \\
  -H "Authorization: Bearer nf_live_sk_your_key_here" \\
  -H "Content-Type: application/json"`}
              </pre>
            </div>
            <div className="mt-4 bg-neutral-900 rounded-xl p-4 overflow-x-auto">
              <p className="text-xs text-neutral-400 mb-2 font-mono"># Response</p>
              <pre className="text-sm text-blue-400 font-mono">
{`{
  "data": [
    {
      "id": "food_001",
      "name": "Dal Bhat (Standard Serving)",
      "calories": 450,
      "protein": 15.2,
      "carbs": 72.8,
      "fat": 8.5,
      "fiber": 6.3
    }
  ],
  "total": 24,
  "page": 1
}`}
              </pre>
            </div>
          </div>

          {/* Rate Limits */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">⚡ Rate Limits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rateLimitTiers.map((tier) => (
                <div key={tier.plan} className={`p-4 rounded-xl border-2 ${
                  tier.plan === "Premium" ? "border-primary-500 bg-primary-50" : "border-neutral-200"
                }`}>
                  <h3 className="font-semibold text-neutral-900">{tier.plan}</h3>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Daily Requests</span>
                      <span className="font-medium text-neutral-900">{tier.daily}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Per Minute</span>
                      <span className="font-medium text-neutral-900">{tier.perMinute}</span>
                    </div>
                    <div className="pt-2 border-t border-neutral-100">
                      <span className="text-sm font-semibold text-primary-600">{tier.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API Sections Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockApiSections.map((section) => (
              <div key={section.id} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{section.icon}</span>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{section.title}</h3>
                    <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">{section.version}</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-500 mb-3">{section.description}</p>
                <p className="text-xs text-neutral-400">{section.endpoints.length} endpoints</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === "api_keys" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">🔑 API Keys</h2>
              <button
                onClick={() => setShowCreateKeyModal(true)}
                className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-sm"
              >
                Create New Key
              </button>
            </div>

            <div className="space-y-4">
              {mockApiKeys.map((apiKey) => (
                <div key={apiKey.id} className={`p-4 rounded-xl border ${
                  apiKey.status === "active" ? "border-neutral-200" : "border-neutral-100 bg-neutral-50"
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-neutral-900">{apiKey.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          apiKey.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {apiKey.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        Created: {new Date(apiKey.created).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        {" | "}Last used: {new Date(apiKey.lastUsed).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    {apiKey.status === "active" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopyKey(apiKey.id, apiKey.key)}
                          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                            copiedKey === apiKey.id
                              ? "bg-green-100 text-green-700"
                              : "border border-neutral-200 hover:bg-neutral-50"
                          }`}
                        >
                          {copiedKey === apiKey.id ? "Copied!" : "Copy"}
                        </button>
                        <button className="px-3 py-1 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                          Revoke
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-neutral-100 rounded-lg font-mono text-xs text-neutral-600">
                    <span className="truncate">{apiKey.key.substring(0, 12)}...{apiKey.key.substring(apiKey.key.length - 8)}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {apiKey.permissions.map((perm) => (
                      <span key={perm} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                        {perm}
                      </span>
                    ))}
                  </div>

                  {apiKey.status === "active" && (
                    <p className="text-xs text-neutral-500 mt-2">
                      Requests today: {apiKey.requestsToday.toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🔒</span>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900">Security Best Practices</h3>
                <ul className="mt-2 space-y-1 text-sm text-neutral-600">
                  <li>Never expose API keys in client-side code or public repositories</li>
                  <li>Rotate keys regularly and revoke unused ones</li>
                  <li>Use environment variables to store API keys</li>
                  <li>Apply the principle of least privilege for permissions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documentation Tab */}
      {activeTab === "documentation" && (
        <div className="space-y-4">
          {mockApiSections.map((section) => (
            <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  <div className="text-left">
                    <h3 className="font-semibold text-neutral-900">{section.title}</h3>
                    <p className="text-sm text-neutral-500">{section.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">{section.version}</span>
                  <svg
                    className={`w-5 h-5 text-neutral-400 transition-transform ${expandedSection === section.id ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {expandedSection === section.id && (
                <div className="border-t border-neutral-100 p-4">
                  <div className="space-y-3">
                    {section.endpoints.map((endpoint, index) => (
                      <div key={index} className="p-3 bg-neutral-50 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${getMethodColor(endpoint.method)}`}>
                            {endpoint.method}
                          </span>
                          <code className="text-sm font-mono text-neutral-700">{endpoint.path}</code>
                          {endpoint.auth && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">Auth</span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600">{endpoint.description}</p>
                        <p className="text-xs text-neutral-400 mt-1">Rate limit: {endpoint.rateLimit}</p>
                      </div>
                    ))}
                  </div>

                  {/* Code Example */}
                  <div className="mt-4">
                    <p className="text-sm font-medium text-neutral-700 mb-2">Example Request:</p>
                    <div className="bg-neutral-900 rounded-xl p-4 overflow-x-auto">
                      <pre className="text-sm text-green-400 font-mono">
{`curl -X ${section.endpoints[0].method} "https://api.nepfit.app${section.endpoints[0].path}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Usage Tab */}
      {activeTab === "usage" && (
        <div className="space-y-6">
          {/* Usage Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="p-4 border-b border-neutral-100">
              <h2 className="font-semibold text-neutral-900">📈 API Usage by Endpoint</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Endpoint</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Total Requests</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Last Hour</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Avg Latency</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Error Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {mockUsageRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <code className="text-sm font-mono text-neutral-700">{record.endpoint}</code>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{record.requests.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{record.lastHour.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${record.avgLatency > 500 ? "text-red-600" : record.avgLatency > 200 ? "text-yellow-600" : "text-green-600"}`}>
                          {record.avgLatency}ms
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          record.errorRate < 0.5 ? "bg-green-100 text-green-700" :
                          record.errorRate < 1 ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {record.errorRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Usage Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <h3 className="font-medium text-neutral-900 mb-3">Today&apos;s Usage</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Requests Used</span>
                  <span className="font-medium text-neutral-900">4,759 / 10,000</span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: "47.6%" }} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <h3 className="font-medium text-neutral-900 mb-3">This Month</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Total Requests</span>
                  <span className="font-medium text-neutral-900">39,810</span>
                </div>
                <p className="text-xs text-green-600">12% increase from last month</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <h3 className="font-medium text-neutral-900 mb-3">Health</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Uptime</span>
                  <span className="font-semibold text-green-600">99.97%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">P99 Latency</span>
                  <span className="font-medium text-neutral-900">245ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Webhooks Tab */}
      {activeTab === "webhooks" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">🔔 Webhooks</h2>
              <button
                onClick={() => setShowWebhookModal(true)}
                className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-sm"
              >
                Add Webhook
              </button>
            </div>

            <div className="space-y-4">
              {mockWebhooks.map((webhook) => (
                <div key={webhook.id} className="p-4 border border-neutral-200 rounded-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <code className="text-sm font-mono text-neutral-700">{webhook.url}</code>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          webhook.status === "active" ? "bg-green-100 text-green-700" :
                          webhook.status === "failing" ? "bg-red-100 text-red-700" :
                          "bg-neutral-100 text-neutral-600"
                        }`}>
                          {webhook.status}
                        </span>
                        <span className="text-xs text-neutral-500">
                          Success rate: {webhook.successRate}%
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50">
                        Test
                      </button>
                      <button className="px-3 py-1 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50">
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {webhook.events.map((event) => (
                      <span key={event} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-mono">
                        {event}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
                    <span>Secret: {webhook.secret.substring(0, 10)}...</span>
                    {webhook.lastTriggered && (
                      <>
                        <span className="text-neutral-300">|</span>
                        <span>Last triggered: {webhook.lastTriggered}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Events */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">📋 Available Webhook Events</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {availableWebhookEvents.map((event) => (
                <div key={event} className="p-2 bg-neutral-50 rounded-lg text-center">
                  <code className="text-xs font-mono text-neutral-700">{event}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create API Key Modal */}
      {showCreateKeyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Create New API Key</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-neutral-600 mb-1 block">Key Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Production App"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm text-neutral-600 mb-2 block">Permissions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["food:read", "food:write", "nutrition:read", "meal_plan:read", "meal_plan:write", "user:read", "user:write"].map((perm) => (
                      <label
                        key={perm}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                          newKeyPermissions.includes(perm)
                            ? "bg-primary-50 border-2 border-primary-500"
                            : "bg-neutral-50 border-2 border-transparent"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={newKeyPermissions.includes(perm)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewKeyPermissions([...newKeyPermissions, perm]);
                            } else {
                              setNewKeyPermissions(newKeyPermissions.filter(p => p !== perm));
                            }
                          }}
                          className="sr-only"
                        />
                        <code className="text-xs">{perm}</code>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateKeyModal(false)}
                  className="flex-1 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateKeyModal(false)}
                  className="flex-1 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                >
                  Create Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Webhook Modal */}
      {showWebhookModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Add Webhook</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-neutral-600 mb-1 block">Endpoint URL</label>
                  <input
                    type="url"
                    placeholder="https://yourapp.com/webhooks/nepfit"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm text-neutral-600 mb-2 block">Events</label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {availableWebhookEvents.map((event) => (
                      <label
                        key={event}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                          webhookEvents.includes(event)
                            ? "bg-primary-50 border-2 border-primary-500"
                            : "bg-neutral-50 border-2 border-transparent"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={webhookEvents.includes(event)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setWebhookEvents([...webhookEvents, event]);
                            } else {
                              setWebhookEvents(webhookEvents.filter(ev => ev !== event));
                            }
                          }}
                          className="sr-only"
                        />
                        <code>{event}</code>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowWebhookModal(false)}
                  className="flex-1 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowWebhookModal(false)}
                  className="flex-1 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                >
                  Create Webhook
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
