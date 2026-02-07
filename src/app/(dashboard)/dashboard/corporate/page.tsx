"use client";

import { useState } from "react";

type CorporateTab = "overview" | "departments" | "challenges" | "analytics" | "settings";

interface Department {
  id: string;
  name: string;
  icon: string;
  employees: number;
  activeUsers: number;
  avgHealthScore: number;
  challengesCompleted: number;
  topPerformer: string;
}

interface DepartmentChallenge {
  id: string;
  title: string;
  department: string;
  participants: number;
  progress: number;
  endDate: string;
  reward: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  department: string;
  avatar: string;
  points: number;
  streak: number;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  joinedDate: string;
  healthScore: number;
  status: "active" | "invited" | "inactive";
}

const companyData = {
  name: "TechCorp Nepal",
  plan: "Enterprise",
  totalEmployees: 250,
  activeUsers: 198,
  avgHealthScore: 78,
  challengesCompleted: 42,
  monthlyEngagement: 84,
  caloriesTracked: 1250000,
  mealsLogged: 18500,
  joinedDate: "2025-06-15",
};

const mockDepartments: Department[] = [
  {
    id: "d1",
    name: "Engineering",
    icon: "💻",
    employees: 85,
    activeUsers: 72,
    avgHealthScore: 82,
    challengesCompleted: 15,
    topPerformer: "Arun Shrestha",
  },
  {
    id: "d2",
    name: "Marketing",
    icon: "📢",
    employees: 35,
    activeUsers: 30,
    avgHealthScore: 76,
    challengesCompleted: 8,
    topPerformer: "Sita Tamang",
  },
  {
    id: "d3",
    name: "Sales",
    icon: "📈",
    employees: 50,
    activeUsers: 38,
    avgHealthScore: 74,
    challengesCompleted: 10,
    topPerformer: "Bikash Rai",
  },
  {
    id: "d4",
    name: "HR",
    icon: "👥",
    employees: 20,
    activeUsers: 18,
    avgHealthScore: 85,
    challengesCompleted: 5,
    topPerformer: "Priya Maharjan",
  },
  {
    id: "d5",
    name: "Finance",
    icon: "💰",
    employees: 30,
    activeUsers: 22,
    avgHealthScore: 71,
    challengesCompleted: 4,
    topPerformer: "Rajan Koirala",
  },
];

const mockChallenges: DepartmentChallenge[] = [
  {
    id: "c1",
    title: "10K Steps Daily Challenge",
    department: "Engineering vs Marketing",
    participants: 95,
    progress: 68,
    endDate: "2026-02-28",
    reward: "Team Lunch Voucher",
  },
  {
    id: "c2",
    title: "Hydration Week",
    department: "All Departments",
    participants: 180,
    progress: 45,
    endDate: "2026-02-14",
    reward: "Water Bottle Set",
  },
  {
    id: "c3",
    title: "Healthy Lunch Month",
    department: "Sales vs Finance",
    participants: 62,
    progress: 82,
    endDate: "2026-02-20",
    reward: "NPR 5,000 Gift Card",
  },
  {
    id: "c4",
    title: "Meditation Streak",
    department: "HR Challenge",
    participants: 18,
    progress: 90,
    endDate: "2026-02-10",
    reward: "Spa Voucher",
  },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Arun Shrestha", department: "Engineering", avatar: "AS", points: 2450, streak: 28 },
  { rank: 2, name: "Priya Maharjan", department: "HR", avatar: "PM", points: 2380, streak: 25 },
  { rank: 3, name: "Sita Tamang", department: "Marketing", avatar: "ST", points: 2210, streak: 22 },
  { rank: 4, name: "Bikash Rai", department: "Sales", avatar: "BR", points: 2150, streak: 20 },
  { rank: 5, name: "Rajan Koirala", department: "Finance", avatar: "RK", points: 2080, streak: 18 },
  { rank: 6, name: "Kabita Gurung", department: "Engineering", avatar: "KG", points: 1990, streak: 15 },
  { rank: 7, name: "Deepak Lama", department: "Sales", avatar: "DL", points: 1920, streak: 14 },
  { rank: 8, name: "Anita Bhandari", department: "Marketing", avatar: "AB", points: 1850, streak: 12 },
];

const mockEmployees: Employee[] = [
  { id: "e1", name: "Arun Shrestha", email: "arun@techcorp.np", department: "Engineering", joinedDate: "2025-06-20", healthScore: 92, status: "active" },
  { id: "e2", name: "Priya Maharjan", email: "priya@techcorp.np", department: "HR", joinedDate: "2025-06-18", healthScore: 88, status: "active" },
  { id: "e3", name: "Sita Tamang", email: "sita@techcorp.np", department: "Marketing", joinedDate: "2025-07-01", healthScore: 85, status: "active" },
  { id: "e4", name: "Bikash Rai", email: "bikash@techcorp.np", department: "Sales", joinedDate: "2025-07-10", healthScore: 79, status: "active" },
  { id: "e5", name: "New Hire 1", email: "newhire1@techcorp.np", department: "Engineering", joinedDate: "2026-02-01", healthScore: 0, status: "invited" },
  { id: "e6", name: "Inactive User", email: "inactive@techcorp.np", department: "Finance", joinedDate: "2025-08-15", healthScore: 45, status: "inactive" },
];

const aggregateAnalytics = {
  avgDailyCalories: 2150,
  avgDailyProtein: 68,
  avgDailyWater: 2.1,
  avgSleepHours: 7.2,
  avgStepsDaily: 7850,
  topNutrientDeficiency: "Vitamin D",
  mostPopularMeal: "Dal Bhat",
  avgBMI: 24.3,
};

export default function CorporatePage() {
  const [activeTab, setActiveTab] = useState<CorporateTab>("overview");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteDepartment, setInviteDepartment] = useState("Engineering");
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [companyGoalCalories, setCompanyGoalCalories] = useState("2200");
  const [companyGoalSteps, setCompanyGoalSteps] = useState("8000");
  const [companyGoalWater, setCompanyGoalWater] = useState("2.5");
  const [onboardingLink] = useState("https://nepfit.app/join/techcorp-nepal-x8k2m");
  const [linkCopied, setLinkCopied] = useState(false);

  const handleInvite = () => {
    if (inviteEmail) {
      setShowInviteSuccess(true);
      setInviteEmail("");
      setTimeout(() => setShowInviteSuccess(false), 3000);
    }
  };

  const handleCopyLink = () => {
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-700 bg-green-100";
      case "invited":
        return "text-blue-700 bg-blue-100";
      case "inactive":
        return "text-neutral-600 bg-neutral-100";
      default:
        return "text-neutral-600 bg-neutral-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Corporate Wellness</h1>
          <p className="text-neutral-600">
            Manage your company&apos;s health and wellness program
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">
            {companyData.plan} Plan
          </span>
          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            {companyData.activeUsers} Active
          </span>
        </div>
      </div>

      {/* Company Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏢</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">{companyData.name}</h2>
                <p className="text-primary-100 text-sm">
                  Member since {new Date(companyData.joinedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{companyData.totalEmployees}</p>
              <p className="text-xs text-primary-100">Total Employees</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{companyData.activeUsers}</p>
              <p className="text-xs text-primary-100">Active Users</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{companyData.avgHealthScore}</p>
              <p className="text-xs text-primary-100">Avg Health Score</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{companyData.challengesCompleted}</p>
              <p className="text-xs text-primary-100">Challenges Done</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 overflow-x-auto">
        {[
          { id: "overview", label: "Overview", icon: "📊" },
          { id: "departments", label: "Departments", icon: "🏗️" },
          { id: "challenges", label: "Challenges", icon: "🏆" },
          { id: "analytics", label: "Analytics", icon: "📈" },
          { id: "settings", label: "Settings", icon: "⚙️" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CorporateTab)}
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
          {/* Engagement Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Engagement Rate</p>
                  <p className="text-2xl font-bold text-neutral-900">{companyData.monthlyEngagement}%</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Calories Tracked</p>
                  <p className="text-2xl font-bold text-neutral-900">{(companyData.caloriesTracked / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🍽️</span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Meals Logged</p>
                  <p className="text-2xl font-bold text-neutral-900">{(companyData.mealsLogged / 1000).toFixed(1)}K</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Active Challenges</p>
                  <p className="text-2xl font-bold text-neutral-900">{mockChallenges.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Department Health Scores */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">🏗️ Department Health Scores</h2>
            <div className="space-y-3">
              {mockDepartments.map((dept) => (
                <div key={dept.id} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                  <span className="text-2xl">{dept.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-neutral-900">{dept.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getHealthScoreColor(dept.avgHealthScore)}`}>
                        {dept.avgHealthScore}/100
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          dept.avgHealthScore >= 80 ? "bg-green-500" : dept.avgHealthScore >= 60 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${dept.avgHealthScore}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-neutral-500">
                      <span>{dept.activeUsers}/{dept.employees} active</span>
                      <span>{dept.challengesCompleted} challenges</span>
                      <span>Top: {dept.topPerformer}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">🌟 Top Performers This Month</h2>
            <div className="space-y-2">
              {mockLeaderboard.slice(0, 5).map((entry) => (
                <div key={entry.rank} className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    entry.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                    entry.rank === 2 ? "bg-neutral-200 text-neutral-600" :
                    entry.rank === 3 ? "bg-orange-100 text-orange-700" :
                    "bg-neutral-100 text-neutral-500"
                  }`}>
                    {entry.rank}
                  </div>
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-sm font-medium text-primary-700">
                    {entry.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">{entry.name}</p>
                    <p className="text-xs text-neutral-500">{entry.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">{entry.points.toLocaleString()} pts</p>
                    <p className="text-xs text-neutral-500">{entry.streak} day streak</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Departments Tab */}
      {activeTab === "departments" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockDepartments.map((dept) => (
              <div key={dept.id} className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="h-16 bg-gradient-to-r from-primary-50 to-primary-100 flex items-center justify-center">
                  <span className="text-3xl">{dept.icon}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-neutral-900 text-lg">{dept.name}</h3>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="p-2 bg-neutral-50 rounded-lg text-center">
                      <p className="text-lg font-bold text-neutral-900">{dept.employees}</p>
                      <p className="text-xs text-neutral-500">Employees</p>
                    </div>
                    <div className="p-2 bg-neutral-50 rounded-lg text-center">
                      <p className="text-lg font-bold text-green-600">{dept.activeUsers}</p>
                      <p className="text-xs text-neutral-500">Active</p>
                    </div>
                    <div className="p-2 bg-neutral-50 rounded-lg text-center">
                      <p className="text-lg font-bold text-primary-600">{dept.avgHealthScore}</p>
                      <p className="text-xs text-neutral-500">Health Score</p>
                    </div>
                    <div className="p-2 bg-neutral-50 rounded-lg text-center">
                      <p className="text-lg font-bold text-orange-600">{dept.challengesCompleted}</p>
                      <p className="text-xs text-neutral-500">Challenges</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-neutral-100">
                    <p className="text-xs text-neutral-500">Top Performer</p>
                    <p className="text-sm font-medium text-neutral-900">{dept.topPerformer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Employee List */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="p-4 border-b border-neutral-100">
              <h2 className="font-semibold text-neutral-900">Employee Directory</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Department</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Health Score</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {mockEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{emp.name}</p>
                          <p className="text-xs text-neutral-500">{emp.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{emp.department}</td>
                      <td className="px-4 py-3">
                        {emp.healthScore > 0 ? (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getHealthScoreColor(emp.healthScore)}`}>
                            {emp.healthScore}/100
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-400">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getStatusColor(emp.status)}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">
                        {new Date(emp.joinedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Challenges Tab */}
      {activeTab === "challenges" && (
        <div className="space-y-6">
          {/* Active Challenges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockChallenges.map((challenge) => (
              <div key={challenge.id} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-neutral-900">{challenge.title}</h3>
                    <p className="text-sm text-neutral-500">{challenge.department}</p>
                  </div>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-neutral-500">Progress</span>
                      <span className="font-medium text-neutral-900">{challenge.progress}%</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${challenge.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">
                      {challenge.participants} participants
                    </span>
                    <span className="text-neutral-500">
                      Ends {new Date(challenge.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                    <span className="text-sm">🎁</span>
                    <span className="text-sm text-neutral-600">{challenge.reward}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Full Leaderboard */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">🏆 Company Leaderboard</h2>
            <div className="space-y-2">
              {mockLeaderboard.map((entry) => (
                <div key={entry.rank} className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    entry.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                    entry.rank === 2 ? "bg-neutral-200 text-neutral-600" :
                    entry.rank === 3 ? "bg-orange-100 text-orange-700" :
                    "bg-neutral-100 text-neutral-500"
                  }`}>
                    {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : entry.rank}
                  </div>
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-sm font-medium text-primary-700">
                    {entry.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">{entry.name}</p>
                    <p className="text-xs text-neutral-500">{entry.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">{entry.points.toLocaleString()} pts</p>
                    <p className="text-xs text-neutral-500">{entry.streak} day streak 🔥</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Create Challenge CTA */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">Create a New Challenge</h3>
                <p className="text-white/90">
                  Boost engagement with inter-department wellness competitions
                </p>
              </div>
              <button className="px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-colors">
                Create Challenge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Aggregate Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Avg Daily Calories</p>
                  <p className="text-2xl font-bold text-neutral-900">{aggregateAnalytics.avgDailyCalories}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🥩</span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Avg Daily Protein</p>
                  <p className="text-2xl font-bold text-neutral-900">{aggregateAnalytics.avgDailyProtein}g</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💧</span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Avg Daily Water</p>
                  <p className="text-2xl font-bold text-neutral-900">{aggregateAnalytics.avgDailyWater}L</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👟</span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Avg Daily Steps</p>
                  <p className="text-2xl font-bold text-neutral-900">{aggregateAnalytics.avgStepsDaily.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <h3 className="font-semibold text-neutral-900 mb-4">📊 Company Health Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <span className="text-sm text-neutral-600">Average BMI</span>
                  <span className="font-semibold text-neutral-900">{aggregateAnalytics.avgBMI}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <span className="text-sm text-neutral-600">Avg Sleep Hours</span>
                  <span className="font-semibold text-neutral-900">{aggregateAnalytics.avgSleepHours} hrs</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <span className="text-sm text-neutral-600">Top Nutrient Gap</span>
                  <span className="font-semibold text-orange-600">{aggregateAnalytics.topNutrientDeficiency}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <span className="text-sm text-neutral-600">Most Tracked Meal</span>
                  <span className="font-semibold text-neutral-900">{aggregateAnalytics.mostPopularMeal}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <h3 className="font-semibold text-neutral-900 mb-4">📈 Department Comparison</h3>
              <div className="space-y-4">
                {mockDepartments.map((dept) => (
                  <div key={dept.id} className="flex items-center gap-3">
                    <span className="text-lg">{dept.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-neutral-700">{dept.name}</span>
                        <span className="font-medium">{dept.avgHealthScore}%</span>
                      </div>
                      <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full"
                          style={{ width: `${dept.avgHealthScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Export */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-2">📥 Export Analytics Report</h3>
            <p className="text-sm text-neutral-500 mb-4">
              Generate comprehensive wellness reports for stakeholders and management
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-sm">
                Export as PDF
              </button>
              <button className="px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors text-sm">
                Export as CSV
              </button>
              <button className="px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors text-sm">
                Schedule Monthly Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          {/* Invite Employees */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">📧 Invite Employees</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Employee email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <select
                value={inviteDepartment}
                onChange={(e) => setInviteDepartment(e.target.value)}
                className="px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {mockDepartments.map((dept) => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
              <button
                onClick={handleInvite}
                className="px-6 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
              >
                Send Invite
              </button>
            </div>
            {showInviteSuccess && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
                Invitation sent successfully!
              </div>
            )}
          </div>

          {/* Onboarding Link */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">🔗 Employee Onboarding Link</h2>
            <p className="text-sm text-neutral-500 mb-4">
              Share this link with employees to self-register for your corporate wellness program
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                readOnly
                value={onboardingLink}
                className="flex-1 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-600"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-xl transition-colors text-sm ${
                  linkCopied
                    ? "bg-green-500 text-white"
                    : "bg-primary-500 text-white hover:bg-primary-600"
                }`}
              >
                {linkCopied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>

          {/* Manage Departments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">🏗️ Manage Departments</h2>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="New department name"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-sm">
                Add Department
              </button>
            </div>
            <div className="space-y-2">
              {mockDepartments.map((dept) => (
                <div key={dept.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{dept.icon}</span>
                    <span className="font-medium text-neutral-900">{dept.name}</span>
                    <span className="text-xs text-neutral-500">{dept.employees} employees</span>
                  </div>
                  <button className="text-xs text-red-500 hover:text-red-700">Remove</button>
                </div>
              ))}
            </div>
          </div>

          {/* Company Goals */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">🎯 Company-wide Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-neutral-600 mb-1 block">Daily Calorie Target</label>
                <input
                  type="number"
                  value={companyGoalCalories}
                  onChange={(e) => setCompanyGoalCalories(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-600 mb-1 block">Daily Steps Target</label>
                <input
                  type="number"
                  value={companyGoalSteps}
                  onChange={(e) => setCompanyGoalSteps(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-600 mb-1 block">Daily Water Target (L)</label>
                <input
                  type="number"
                  step="0.1"
                  value={companyGoalWater}
                  onChange={(e) => setCompanyGoalWater(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <button className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
              Save Goals
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200">
            <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-red-100 rounded-xl">
                <div>
                  <p className="font-medium text-neutral-900">Export All Data</p>
                  <p className="text-sm text-neutral-500">Download all employee wellness data</p>
                </div>
                <button className="px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors text-sm">
                  Export
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border border-red-100 rounded-xl">
                <div>
                  <p className="font-medium text-neutral-900">Cancel Corporate Plan</p>
                  <p className="text-sm text-neutral-500">This will downgrade all employee accounts</p>
                </div>
                <button className="px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors text-sm">
                  Cancel Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
