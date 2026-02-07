"use client";

import { useState } from "react";

type HealthcareTab = "overview" | "reports" | "lab_results" | "medications" | "providers";

interface HealthMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: "normal" | "warning" | "critical";
  icon: string;
  lastChecked: string;
  range: string;
}

interface LabResult {
  id: string;
  testName: string;
  value: number;
  unit: string;
  referenceRange: string;
  status: "normal" | "low" | "high" | "critical";
  date: string;
  previousValue?: number;
  trend: "up" | "down" | "stable";
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: "morning" | "afternoon" | "evening" | "night" | "with_meals";
  prescribedBy: string;
  startDate: string;
  endDate?: string;
  foodInteraction: string | null;
  refillDate: string;
  active: boolean;
}

interface Provider {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  phone: string;
  email: string;
  avatar: string;
  nextAppointment?: string;
  rating: number;
}

interface HealthTimelineEvent {
  id: string;
  date: string;
  type: "lab" | "appointment" | "medication" | "diagnosis" | "report";
  title: string;
  description: string;
  icon: string;
}

const mockHealthMetrics: HealthMetric[] = [
  {
    id: "bp",
    name: "Blood Pressure",
    value: "128/82",
    unit: "mmHg",
    status: "warning",
    icon: "❤️",
    lastChecked: "2026-02-06",
    range: "Normal: <120/80",
  },
  {
    id: "bs",
    name: "Blood Sugar (Fasting)",
    value: "105",
    unit: "mg/dL",
    status: "warning",
    icon: "🩸",
    lastChecked: "2026-02-05",
    range: "Normal: 70-100",
  },
  {
    id: "chol",
    name: "Total Cholesterol",
    value: "195",
    unit: "mg/dL",
    status: "normal",
    icon: "💉",
    lastChecked: "2026-01-20",
    range: "Normal: <200",
  },
  {
    id: "bmi",
    name: "BMI",
    value: "24.3",
    unit: "kg/m2",
    status: "normal",
    icon: "⚖️",
    lastChecked: "2026-02-06",
    range: "Normal: 18.5-24.9",
  },
];

const mockLabResults: LabResult[] = [
  {
    id: "l1",
    testName: "HbA1c",
    value: 5.8,
    unit: "%",
    referenceRange: "4.0-5.6",
    status: "high",
    date: "2026-02-01",
    previousValue: 6.1,
    trend: "down",
  },
  {
    id: "l2",
    testName: "LDL Cholesterol",
    value: 118,
    unit: "mg/dL",
    referenceRange: "<100",
    status: "high",
    date: "2026-01-20",
    previousValue: 125,
    trend: "down",
  },
  {
    id: "l3",
    testName: "HDL Cholesterol",
    value: 52,
    unit: "mg/dL",
    referenceRange: ">40",
    status: "normal",
    date: "2026-01-20",
    previousValue: 48,
    trend: "up",
  },
  {
    id: "l4",
    testName: "Triglycerides",
    value: 145,
    unit: "mg/dL",
    referenceRange: "<150",
    status: "normal",
    date: "2026-01-20",
    previousValue: 160,
    trend: "down",
  },
  {
    id: "l5",
    testName: "TSH (Thyroid)",
    value: 3.2,
    unit: "mIU/L",
    referenceRange: "0.4-4.0",
    status: "normal",
    date: "2026-01-15",
    previousValue: 3.5,
    trend: "down",
  },
  {
    id: "l6",
    testName: "Vitamin D",
    value: 22,
    unit: "ng/mL",
    referenceRange: "30-100",
    status: "low",
    date: "2026-01-15",
    previousValue: 18,
    trend: "up",
  },
  {
    id: "l7",
    testName: "Serum Iron",
    value: 75,
    unit: "mcg/dL",
    referenceRange: "60-170",
    status: "normal",
    date: "2026-01-15",
    previousValue: 70,
    trend: "up",
  },
  {
    id: "l8",
    testName: "Vitamin B12",
    value: 380,
    unit: "pg/mL",
    referenceRange: "200-900",
    status: "normal",
    date: "2026-01-15",
    previousValue: 350,
    trend: "up",
  },
];

const mockMedications: Medication[] = [
  {
    id: "m1",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    timing: "with_meals",
    prescribedBy: "Dr. Ramesh Adhikari",
    startDate: "2025-08-15",
    foodInteraction: "Take with meals to reduce stomach upset. Avoid excessive alcohol.",
    refillDate: "2026-02-20",
    active: true,
  },
  {
    id: "m2",
    name: "Amlodipine",
    dosage: "5mg",
    frequency: "Once daily",
    timing: "morning",
    prescribedBy: "Dr. Sushma Karki",
    startDate: "2025-10-01",
    foodInteraction: "Avoid grapefruit. Can be taken with or without food.",
    refillDate: "2026-03-01",
    active: true,
  },
  {
    id: "m3",
    name: "Vitamin D3",
    dosage: "60,000 IU",
    frequency: "Once weekly",
    timing: "morning",
    prescribedBy: "Dr. Ramesh Adhikari",
    startDate: "2026-01-20",
    endDate: "2026-04-20",
    foodInteraction: "Take with a fatty meal for better absorption.",
    refillDate: "2026-03-15",
    active: true,
  },
  {
    id: "m4",
    name: "Atorvastatin",
    dosage: "10mg",
    frequency: "Once daily",
    timing: "night",
    prescribedBy: "Dr. Sushma Karki",
    startDate: "2025-06-01",
    endDate: "2025-12-01",
    foodInteraction: null,
    refillDate: "2025-12-01",
    active: false,
  },
];

const mockProviders: Provider[] = [
  {
    id: "p1",
    name: "Dr. Ramesh Adhikari",
    specialty: "Endocrinologist",
    hospital: "Norvic International Hospital",
    phone: "+977-1-4258554",
    email: "r.adhikari@norvic.np",
    avatar: "RA",
    nextAppointment: "2026-02-15 10:00 AM",
    rating: 4.8,
  },
  {
    id: "p2",
    name: "Dr. Sushma Karki",
    specialty: "Cardiologist",
    hospital: "Grande International Hospital",
    phone: "+977-1-5159266",
    email: "s.karki@grande.np",
    avatar: "SK",
    nextAppointment: "2026-03-01 2:00 PM",
    rating: 4.9,
  },
  {
    id: "p3",
    name: "Dr. Anita Poudel",
    specialty: "General Physician",
    hospital: "B&B Hospital",
    phone: "+977-1-5531933",
    email: "a.poudel@bnb.np",
    avatar: "AP",
    rating: 4.6,
  },
  {
    id: "p4",
    name: "Nutritionist Kabita Shrestha",
    specialty: "Clinical Nutritionist",
    hospital: "NepFit Wellness Center",
    phone: "+977-1-4445566",
    email: "kabita@nepfit.np",
    avatar: "KS",
    nextAppointment: "2026-02-10 11:30 AM",
    rating: 4.7,
  },
];

const mockTimeline: HealthTimelineEvent[] = [
  { id: "t1", date: "2026-02-06", type: "lab", title: "Blood Sugar Test", description: "Fasting blood sugar: 105 mg/dL", icon: "🩸" },
  { id: "t2", date: "2026-02-01", type: "lab", title: "HbA1c Test", description: "HbA1c result: 5.8% (improved from 6.1%)", icon: "📊" },
  { id: "t3", date: "2026-01-20", type: "lab", title: "Lipid Panel", description: "Full lipid panel completed at Norvic Hospital", icon: "💉" },
  { id: "t4", date: "2026-01-20", type: "medication", title: "Vitamin D3 Started", description: "60,000 IU weekly prescribed for deficiency", icon: "💊" },
  { id: "t5", date: "2026-01-15", type: "appointment", title: "Endocrinology Visit", description: "Follow-up with Dr. Ramesh Adhikari", icon: "👨‍⚕️" },
  { id: "t6", date: "2025-12-01", type: "medication", title: "Atorvastatin Stopped", description: "Discontinued after 6-month course", icon: "💊" },
  { id: "t7", date: "2025-11-20", type: "report", title: "Annual Health Report", description: "Comprehensive health report generated", icon: "📄" },
];

export default function HealthcarePage() {
  const [activeTab, setActiveTab] = useState<HealthcareTab>("overview");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareDoctor, setShareDoctor] = useState("");
  const [showFhirModal, setShowFhirModal] = useState(false);
  const [fhirConnected, setFhirConnected] = useState(false);
  const [reportGenerating, setReportGenerating] = useState(false);

  const handleGenerateReport = () => {
    setReportGenerating(true);
    setTimeout(() => setReportGenerating(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-700 bg-green-100";
      case "warning":
      case "high":
        return "text-yellow-700 bg-yellow-100";
      case "critical":
        return "text-red-700 bg-red-100";
      case "low":
        return "text-orange-700 bg-orange-100";
      default:
        return "text-neutral-600 bg-neutral-100";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "↑";
      case "down":
        return "↓";
      case "stable":
        return "→";
      default:
        return "";
    }
  };

  const getTrendColor = (trend: string, status: string) => {
    if (status === "normal") return "text-green-600";
    if (trend === "down" && (status === "high" || status === "critical")) return "text-green-600";
    if (trend === "up" && status === "low") return "text-green-600";
    if (trend === "up" && (status === "high" || status === "critical")) return "text-red-600";
    if (trend === "down" && status === "low") return "text-red-600";
    return "text-neutral-500";
  };

  const getTimingLabel = (timing: string) => {
    switch (timing) {
      case "morning":
        return "Morning";
      case "afternoon":
        return "Afternoon";
      case "evening":
        return "Evening";
      case "night":
        return "Night";
      case "with_meals":
        return "With Meals";
      default:
        return timing;
    }
  };

  const getTimingIcon = (timing: string) => {
    switch (timing) {
      case "morning":
        return "🌅";
      case "afternoon":
        return "☀️";
      case "evening":
        return "🌆";
      case "night":
        return "🌙";
      case "with_meals":
        return "🍽️";
      default:
        return "💊";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Healthcare Integration</h1>
          <p className="text-neutral-600">
            Connect your health records and manage medical information
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share with Doctor
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={reportGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-sm disabled:opacity-50"
          >
            {reportGenerating ? "Generating..." : "Generate Report (PDF)"}
          </button>
        </div>
      </div>

      {/* Health Summary Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">🏥 Health Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockHealthMetrics.map((metric) => (
            <div key={metric.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{metric.icon}</span>
                <span className="text-sm text-primary-100">{metric.name}</span>
              </div>
              <p className="text-2xl font-bold">
                {metric.value} <span className="text-sm font-normal text-primary-100">{metric.unit}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  metric.status === "normal" ? "bg-green-400/30 text-green-100" :
                  metric.status === "warning" ? "bg-yellow-400/30 text-yellow-100" :
                  "bg-red-400/30 text-red-100"
                }`}>
                  {metric.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 overflow-x-auto">
        {[
          { id: "overview", label: "Overview", icon: "📊" },
          { id: "reports", label: "Reports", icon: "📄" },
          { id: "lab_results", label: "Lab Results", icon: "🔬" },
          { id: "medications", label: "Medications", icon: "💊" },
          { id: "providers", label: "Providers", icon: "👨‍⚕️" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as HealthcareTab)}
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
          {/* Health Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {mockHealthMetrics.map((metric) => (
              <div key={metric.id} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    metric.status === "normal" ? "bg-green-100" :
                    metric.status === "warning" ? "bg-yellow-100" :
                    "bg-red-100"
                  }`}>
                    <span className="text-2xl">{metric.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">{metric.name}</p>
                    <p className="text-xl font-bold text-neutral-900">{metric.value} <span className="text-xs font-normal text-neutral-500">{metric.unit}</span></p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </span>
                  <span className="text-xs text-neutral-400">{metric.range}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Health Record Timeline */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">📅 Health Record Timeline</h2>
            <div className="space-y-4">
              {mockTimeline.map((event, index) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">{event.icon}</span>
                    </div>
                    {index < mockTimeline.length - 1 && (
                      <div className="w-0.5 h-full bg-neutral-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-neutral-900">{event.title}</h3>
                      <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full capitalize">
                        {event.type}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">{event.description}</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FHIR Connection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">🔗 FHIR API Connection</h2>
                <p className="text-sm text-neutral-500">Connect to your hospital&apos;s electronic health records</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                fhirConnected ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"
              }`}>
                {fhirConnected ? "Connected" : "Not Connected"}
              </span>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-blue-800 font-medium">HL7 FHIR R4 Compatible</p>
                  <p className="text-xs text-blue-600 mt-1">
                    NepFit supports FHIR R4 standard for interoperability with hospital systems in Nepal
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setShowFhirModal(true);
                setTimeout(() => {
                  setFhirConnected(true);
                  setShowFhirModal(false);
                }, 1500);
              }}
              className="px-6 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
            >
              {fhirConnected ? "Reconnect" : "Connect Hospital System"}
            </button>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">📄 Doctor Report Generation</h2>
            <p className="text-sm text-neutral-500 mb-6">
              Generate comprehensive health reports to share with your healthcare providers
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Complete Health Report", description: "Full report with nutrition, vitals, lab results, and trends", icon: "📋", period: "Last 3 months" },
                { title: "Nutrition Summary", description: "Detailed breakdown of daily nutrition intake and patterns", icon: "🥗", period: "Last 30 days" },
                { title: "Medication Adherence", description: "Report on medication schedule compliance and tracking", icon: "💊", period: "Last 3 months" },
                { title: "Diabetes Management", description: "Blood sugar trends, HbA1c tracking, and diet impact", icon: "🩸", period: "Last 6 months" },
              ].map((report, index) => (
                <div key={index} className="p-4 border border-neutral-200 rounded-xl hover:border-primary-300 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{report.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900">{report.title}</h3>
                      <p className="text-sm text-neutral-500 mt-1">{report.description}</p>
                      <p className="text-xs text-neutral-400 mt-2">Period: {report.period}</p>
                    </div>
                  </div>
                  <button className="mt-3 w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm">
                    Generate PDF
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">📁 Recent Reports</h3>
            <div className="space-y-3">
              {[
                { name: "Complete Health Report - Jan 2026", date: "2026-01-25", size: "2.4 MB" },
                { name: "Nutrition Summary - Dec 2025", date: "2025-12-28", size: "1.8 MB" },
                { name: "Diabetes Management - Q4 2025", date: "2025-12-15", size: "3.1 MB" },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📄</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{report.name}</p>
                      <p className="text-xs text-neutral-500">
                        {new Date(report.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} | {report.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors">
                      Download
                    </button>
                    <button className="px-3 py-1 text-sm text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lab Results Tab */}
      {activeTab === "lab_results" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="font-semibold text-neutral-900">🔬 Lab Results Tracker</h2>
              <button className="text-sm text-primary-600 hover:text-primary-700">Add Result +</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Test</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Result</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Reference</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Trend</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {mockLabResults.map((result) => (
                    <tr key={result.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900">{result.testName}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">
                        {result.value} {result.unit}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">{result.referenceRange}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getStatusColor(result.status)}`}>
                          {result.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className={`text-lg font-bold ${getTrendColor(result.trend, result.status)}`}>
                            {getTrendIcon(result.trend)}
                          </span>
                          {result.previousValue && (
                            <span className="text-xs text-neutral-400">
                              from {result.previousValue}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">
                        {new Date(result.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lab Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <h3 className="font-medium text-neutral-900 mb-3">Improving</h3>
              <div className="space-y-2">
                {mockLabResults.filter(r => (r.status === "high" || r.status === "low") && (
                  (r.status === "high" && r.trend === "down") || (r.status === "low" && r.trend === "up")
                )).map(r => (
                  <div key={r.id} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">↗</span>
                    <span className="text-neutral-700">{r.testName}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <h3 className="font-medium text-neutral-900 mb-3">Needs Attention</h3>
              <div className="space-y-2">
                {mockLabResults.filter(r => r.status === "low" || r.status === "high").map(r => (
                  <div key={r.id} className="flex items-center gap-2 text-sm">
                    <span className="text-yellow-500">⚠</span>
                    <span className="text-neutral-700">{r.testName}: {r.value} {r.unit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <h3 className="font-medium text-neutral-900 mb-3">All Normal</h3>
              <div className="space-y-2">
                {mockLabResults.filter(r => r.status === "normal").map(r => (
                  <div key={r.id} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span className="text-neutral-700">{r.testName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Medications Tab */}
      {activeTab === "medications" && (
        <div className="space-y-6">
          {/* Active Medications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">💊 Active Medications</h2>
            <div className="space-y-4">
              {mockMedications.filter(m => m.active).map((med) => (
                <div key={med.id} className="p-4 border border-neutral-200 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">{getTimingIcon(med.timing)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">{med.name} - {med.dosage}</h3>
                        <p className="text-sm text-neutral-500">{med.frequency} | {getTimingLabel(med.timing)}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  {med.foodInteraction && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-sm">⚠️</span>
                        <p className="text-sm text-yellow-800">{med.foodInteraction}</p>
                      </div>
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500">
                    <span>Prescribed by: {med.prescribedBy}</span>
                    <span>Refill: {new Date(med.refillDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Medications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">📋 Past Medications</h2>
            <div className="space-y-3">
              {mockMedications.filter(m => !m.active).map((med) => (
                <div key={med.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💊</span>
                    <div>
                      <p className="text-sm font-medium text-neutral-700">{med.name} - {med.dosage}</p>
                      <p className="text-xs text-neutral-500">
                        {new Date(med.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} - {med.endDate ? new Date(med.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Ongoing"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded-full">Completed</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Providers Tab */}
      {activeTab === "providers" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockProviders.map((provider) => (
              <div key={provider.id} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-lg font-bold text-primary-700">
                    {provider.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900">{provider.name}</h3>
                    <p className="text-sm text-primary-600">{provider.specialty}</p>
                    <p className="text-sm text-neutral-500">{provider.hospital}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-neutral-700">{provider.rating}</span>
                    </div>
                  </div>
                </div>

                {provider.nextAppointment && (
                  <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-xl">
                    <p className="text-xs text-primary-600 font-medium">Next Appointment</p>
                    <p className="text-sm text-primary-900">{provider.nextAppointment}</p>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setSelectedProvider(provider)}
                    className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                  >
                    View Details
                  </button>
                  <button className="flex-1 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
                    Book Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share with Doctor Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-2">Share Health Report</h2>
              <p className="text-sm text-neutral-500 mb-4">
                Send a comprehensive health report to your healthcare provider
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-neutral-600 mb-1 block">Select Doctor</label>
                  <select
                    value={shareDoctor}
                    onChange={(e) => setShareDoctor(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Choose a provider...</option>
                    {mockProviders.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - {p.specialty}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-neutral-600 mb-1 block">Report Type</label>
                  <select className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option>Complete Health Report</option>
                    <option>Nutrition Summary</option>
                    <option>Lab Results Only</option>
                    <option>Medication List</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                >
                  Share Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Provider Detail Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl font-bold text-primary-700">
                  {selectedProvider.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">{selectedProvider.name}</h3>
                  <p className="text-primary-600">{selectedProvider.specialty}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                  <span>🏥</span>
                  <span className="text-sm text-neutral-700">{selectedProvider.hospital}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                  <span>📞</span>
                  <span className="text-sm text-neutral-700">{selectedProvider.phone}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                  <span>📧</span>
                  <span className="text-sm text-neutral-700">{selectedProvider.email}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProvider(null)}
                className="w-full mt-6 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FHIR Connection Modal */}
      {showFhirModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Connecting to FHIR Server</h3>
            <p className="text-sm text-neutral-500 mt-2">Establishing secure connection to hospital records...</p>
          </div>
        </div>
      )}
    </div>
  );
}
