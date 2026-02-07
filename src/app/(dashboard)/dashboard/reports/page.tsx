"use client";

import { useState } from "react";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  sections: string[];
  frequency: "daily" | "weekly" | "monthly" | "custom";
}

interface GeneratedReport {
  id: string;
  templateId: string;
  name: string;
  dateRange: { start: string; end: string };
  generatedAt: string;
  status: "ready" | "generating" | "scheduled";
  fileSize: string;
}

interface InsightCard {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down" | "neutral";
  icon: string;
  period: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: "nutrition-summary",
    name: "Nutrition Summary",
    description: "Complete overview of your nutritional intake including macros, micros, and trends",
    icon: "🥗",
    category: "Nutrition",
    sections: ["Calorie Analysis", "Macro Distribution", "Micronutrient Gaps", "Meal Patterns"],
    frequency: "weekly",
  },
  {
    id: "weight-progress",
    name: "Weight & Body Progress",
    description: "Track your body composition changes and progress towards your goals",
    icon: "⚖️",
    category: "Body",
    sections: ["Weight Trend", "Body Measurements", "BMI Analysis", "Progress Photos Timeline"],
    frequency: "monthly",
  },
  {
    id: "fitness-performance",
    name: "Fitness Performance",
    description: "Workout statistics, strength gains, and cardio improvements",
    icon: "💪",
    category: "Fitness",
    sections: ["Workout Frequency", "Calories Burned", "Strength Progress", "Personal Records"],
    frequency: "weekly",
  },
  {
    id: "health-metrics",
    name: "Health Metrics Dashboard",
    description: "Blood sugar, blood pressure, heart rate, and other vital statistics",
    icon: "❤️",
    category: "Health",
    sections: ["Blood Sugar Trends", "Blood Pressure Log", "Heart Rate Zones", "Health Score"],
    frequency: "monthly",
  },
  {
    id: "sleep-recovery",
    name: "Sleep & Recovery Analysis",
    description: "Sleep quality patterns and recovery metrics",
    icon: "😴",
    category: "Wellness",
    sections: ["Sleep Duration", "Sleep Quality", "Recovery Score", "Recommendations"],
    frequency: "weekly",
  },
  {
    id: "food-journal",
    name: "Food Journal Export",
    description: "Complete log of all meals with photos, notes, and ratings",
    icon: "📔",
    category: "Nutrition",
    sections: ["Daily Entries", "Meal Photos", "Mood Correlations", "Favorite Meals"],
    frequency: "monthly",
  },
  {
    id: "family-nutrition",
    name: "Family Nutrition Report",
    description: "Nutrition overview for all household members",
    icon: "👨‍👩‍👧‍👦",
    category: "Family",
    sections: ["Individual Summaries", "Family Comparisons", "Shared Meals", "Recommendations"],
    frequency: "monthly",
  },
  {
    id: "waste-impact",
    name: "Food Waste Impact",
    description: "Environmental and financial impact of food waste",
    icon: "♻️",
    category: "Sustainability",
    sections: ["Waste Breakdown", "Cost Analysis", "Environmental Impact", "Improvement Tips"],
    frequency: "monthly",
  },
];

const generatedReports: GeneratedReport[] = [
  {
    id: "1",
    templateId: "nutrition-summary",
    name: "Weekly Nutrition Summary",
    dateRange: { start: "2026-02-01", end: "2026-02-07" },
    generatedAt: "2026-02-07T10:00:00",
    status: "ready",
    fileSize: "2.4 MB",
  },
  {
    id: "2",
    templateId: "weight-progress",
    name: "January Body Progress",
    dateRange: { start: "2026-01-01", end: "2026-01-31" },
    generatedAt: "2026-02-01T08:00:00",
    status: "ready",
    fileSize: "5.1 MB",
  },
  {
    id: "3",
    templateId: "health-metrics",
    name: "Health Metrics - January",
    dateRange: { start: "2026-01-01", end: "2026-01-31" },
    generatedAt: "2026-02-01T08:30:00",
    status: "ready",
    fileSize: "1.8 MB",
  },
  {
    id: "4",
    templateId: "fitness-performance",
    name: "Weekly Fitness Report",
    dateRange: { start: "2026-02-08", end: "2026-02-14" },
    generatedAt: "",
    status: "scheduled",
    fileSize: "",
  },
];

const insights: InsightCard[] = [
  { title: "Avg. Daily Calories", value: "1,847", change: -5.2, trend: "down", icon: "🔥", period: "vs last week" },
  { title: "Protein Intake", value: "98g", change: 12.3, trend: "up", icon: "🥩", period: "vs last week" },
  { title: "Workouts Completed", value: "5", change: 25, trend: "up", icon: "💪", period: "vs last week" },
  { title: "Avg. Sleep Duration", value: "7.2h", change: 0.3, trend: "up", icon: "😴", period: "vs last week" },
  { title: "Water Intake", value: "2.1L", change: -8, trend: "down", icon: "💧", period: "vs last week" },
  { title: "Health Score", value: "82", change: 3, trend: "up", icon: "❤️", period: "vs last month" },
];

const chartData = {
  calories: [1950, 1820, 2100, 1750, 1680, 1920, 1810],
  protein: [85, 92, 78, 105, 98, 88, 102],
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

export default function AdvancedReportsPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "generate" | "history" | "schedule">("dashboard");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(reportTemplates.map(t => t.category)))];
  const filteredTemplates = selectedCategory === "all"
    ? reportTemplates
    : reportTemplates.filter(t => t.category === selectedCategory);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getTrendIcon = (trend: string, isPositive: boolean) => {
    if (trend === "up") return isPositive ? "↑" : "↑";
    if (trend === "down") return isPositive ? "↓" : "↓";
    return "→";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            📊 Advanced Reports
          </h1>
          <p className="text-gray-600 mt-1">Generate detailed reports, track insights, and export your data</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: "📈" },
            { id: "generate", label: "Generate Report", icon: "📄" },
            { id: "history", label: "Report History", icon: "📁" },
            { id: "schedule", label: "Scheduled", icon: "📅" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-indigo-500 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-indigo-50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Quick Insights */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {insights.map((insight, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{insight.icon}</span>
                      <span className={`text-sm font-medium ${getTrendColor(insight.trend)}`}>
                        {getTrendIcon(insight.trend, insight.change > 0)} {Math.abs(insight.change)}%
                      </span>
                    </div>
                    <div className="text-xl font-bold text-gray-800">{insight.value}</div>
                    <div className="text-xs text-gray-500">{insight.title}</div>
                    <div className="text-xs text-gray-400">{insight.period}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Calorie Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-4">Weekly Calorie Intake</h4>
                <div className="h-48 flex items-end justify-around gap-2">
                  {chartData.calories.map((cal, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                      <div className="text-xs text-gray-500">{cal}</div>
                      <div
                        className="w-full max-w-[40px] bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t transition-all hover:from-indigo-600 hover:to-purple-500"
                        style={{ height: `${(cal / 2500) * 150}px` }}
                      ></div>
                      <div className="text-xs text-gray-500">{chartData.days[idx]}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>Avg: 1,861 cal</span>
                  <span>Goal: 2,000 cal</span>
                </div>
              </div>

              {/* Protein Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-4">Weekly Protein Intake</h4>
                <div className="h-48 flex items-end justify-around gap-2">
                  {chartData.protein.map((prot, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                      <div className="text-xs text-gray-500">{prot}g</div>
                      <div
                        className="w-full max-w-[40px] bg-gradient-to-t from-green-500 to-emerald-400 rounded-t transition-all hover:from-green-600 hover:to-emerald-500"
                        style={{ height: `${(prot / 120) * 150}px` }}
                      ></div>
                      <div className="text-xs text-gray-500">{chartData.days[idx]}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>Avg: 92g</span>
                  <span>Goal: 100g</span>
                </div>
              </div>
            </div>

            {/* Macro Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">Macro Distribution (This Week)</h4>
              <div className="flex items-center gap-8">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 36 36" className="w-40 h-40 transform -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none" stroke="#8b5cf6" strokeWidth="3"
                      strokeDasharray="40 100" strokeLinecap="round"
                    />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3"
                      strokeDasharray="25 100" strokeDashoffset="-40" strokeLinecap="round"
                    />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="3"
                      strokeDasharray="35 100" strokeDashoffset="-65" strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">1,847</div>
                      <div className="text-xs text-gray-500">avg cal/day</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-4 h-4 bg-purple-500 rounded-full mx-auto mb-2"></div>
                    <div className="text-xl font-bold">40%</div>
                    <div className="text-sm text-gray-500">Carbs</div>
                    <div className="text-xs text-gray-400">185g avg</div>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <div className="text-xl font-bold">25%</div>
                    <div className="text-sm text-gray-500">Protein</div>
                    <div className="text-xs text-gray-400">115g avg</div>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 bg-amber-500 rounded-full mx-auto mb-2"></div>
                    <div className="text-xl font-bold">35%</div>
                    <div className="text-sm text-gray-500">Fat</div>
                    <div className="text-xs text-gray-400">72g avg</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab("generate")}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white text-left hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl mb-2">📄</div>
                <div className="font-semibold">Generate New Report</div>
                <div className="text-sm opacity-80">Create a custom report with your data</div>
              </button>
              <button className="bg-white rounded-2xl p-6 text-left hover:shadow-lg transition-shadow border">
                <div className="text-3xl mb-2">📤</div>
                <div className="font-semibold text-gray-800">Export All Data</div>
                <div className="text-sm text-gray-500">Download your complete history</div>
              </button>
              <button className="bg-white rounded-2xl p-6 text-left hover:shadow-lg transition-shadow border">
                <div className="text-3xl mb-2">🔗</div>
                <div className="font-semibold text-gray-800">Share with Provider</div>
                <div className="text-sm text-gray-500">Send reports to your doctor</div>
              </button>
            </div>
          </div>
        )}

        {/* Generate Tab */}
        {activeTab === "generate" && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full capitalize whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? "bg-indigo-500 text-white"
                      : "bg-white text-gray-600 hover:bg-indigo-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Report Templates */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <div key={template.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{template.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{template.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-xs text-gray-400 mb-2">Includes:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.sections.slice(0, 3).map(section => (
                        <span key={section} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                          {section}
                        </span>
                      ))}
                      {template.sections.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                          +{template.sections.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-400 capitalize">
                      📅 {template.frequency}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowGenerateModal(true);
                      }}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-medium hover:bg-indigo-600 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Report */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold mb-2">✨ Create Custom Report</h4>
                  <p className="opacity-80">Select exactly what data you want to include</p>
                </div>
                <button className="px-6 py-3 bg-white text-purple-600 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                  Build Custom
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Generated Reports</h3>
              <select className="px-4 py-2 border rounded-xl bg-white">
                <option>All Time</option>
                <option>This Month</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
              </select>
            </div>

            <div className="space-y-3">
              {generatedReports.filter(r => r.status === "ready").map(report => {
                const template = reportTemplates.find(t => t.id === report.templateId);
                return (
                  <div key={report.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{template?.icon}</div>
                        <div>
                          <div className="font-semibold text-gray-800">{report.name}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(report.dateRange.start).toLocaleDateString()} - {new Date(report.dateRange.end).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Generated: {new Date(report.generatedAt).toLocaleString()} • {report.fileSize}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl text-sm font-medium hover:bg-indigo-200 transition-colors">
                          👁️ View
                        </button>
                        <button className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 transition-colors">
                          ⬇️ Download
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                          📤 Share
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Storage Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">Storage Used</h4>
                <span className="text-sm text-gray-500">9.3 MB of 100 MB</span>
              </div>
              <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: "9.3%" }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Older reports are automatically archived after 90 days</p>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Scheduled Reports</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors">
                ➕ Schedule Report
              </button>
            </div>

            {/* Scheduled Reports */}
            <div className="space-y-3">
              {[
                {
                  name: "Weekly Nutrition Summary",
                  template: "nutrition-summary",
                  frequency: "Every Monday at 8:00 AM",
                  nextRun: "Feb 10, 2026",
                  enabled: true,
                },
                {
                  name: "Monthly Body Progress",
                  template: "weight-progress",
                  frequency: "1st of every month",
                  nextRun: "Mar 1, 2026",
                  enabled: true,
                },
                {
                  name: "Weekly Fitness Report",
                  template: "fitness-performance",
                  frequency: "Every Sunday at 6:00 PM",
                  nextRun: "Feb 9, 2026",
                  enabled: true,
                },
                {
                  name: "Monthly Health Metrics",
                  template: "health-metrics",
                  frequency: "1st of every month",
                  nextRun: "Mar 1, 2026",
                  enabled: false,
                },
              ].map((schedule, idx) => {
                const template = reportTemplates.find(t => t.id === schedule.template);
                return (
                  <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{template?.icon}</div>
                        <div>
                          <div className="font-semibold text-gray-800">{schedule.name}</div>
                          <div className="text-sm text-gray-500">{schedule.frequency}</div>
                          <div className="text-xs text-gray-400 mt-1">Next: {schedule.nextRun}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            schedule.enabled ? "bg-indigo-500" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              schedule.enabled ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          ⚙️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Email Delivery Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">📧 Email Delivery</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Reports</div>
                    <div className="text-sm text-gray-500">Receive scheduled reports via email</div>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-500">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border rounded-xl"
                    defaultValue="user@example.com"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="cc-provider" className="rounded" />
                  <label htmlFor="cc-provider" className="text-sm text-gray-700">
                    Also send to my healthcare provider
                  </label>
                </div>
              </div>
            </div>

            {/* Data Export Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">📁 Export Settings</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Format</label>
                  <select className="w-full px-4 py-2 border rounded-xl">
                    <option>PDF</option>
                    <option>Excel (.xlsx)</option>
                    <option>CSV</option>
                    <option>JSON</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Include</label>
                  <select className="w-full px-4 py-2 border rounded-xl">
                    <option>Charts & Graphs</option>
                    <option>Data Tables Only</option>
                    <option>Both</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Modal */}
        {showGenerateModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Generate {selectedTemplate.name}</h3>
                <button onClick={() => setShowGenerateModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <span className="text-4xl">{selectedTemplate.icon}</span>
                  <div>
                    <div className="font-medium">{selectedTemplate.name}</div>
                    <div className="text-sm text-gray-500">{selectedTemplate.sections.length} sections</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" className="px-4 py-2 border rounded-xl" defaultValue="2026-02-01" />
                    <input type="date" className="px-4 py-2 border rounded-xl" defaultValue="2026-02-07" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                  <select className="w-full px-4 py-2 border rounded-xl">
                    <option>PDF</option>
                    <option>Excel</option>
                    <option>CSV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sections to Include</label>
                  <div className="space-y-2">
                    {selectedTemplate.sections.map(section => (
                      <label key={section} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">{section}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="w-full py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
