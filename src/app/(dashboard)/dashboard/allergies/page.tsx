"use client";

import { useState } from "react";

interface Allergy {
  id: string;
  name: string;
  severity: "mild" | "moderate" | "severe" | "life-threatening";
  type: "food" | "environmental" | "medication" | "other";
  symptoms: string[];
  avoidItems: string[];
  crossReactivity?: string[];
  diagnosedDate?: Date;
  notes?: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

interface AllergyCard {
  language: string;
  content: string;
}

const commonAllergens = [
  { name: "Peanuts", icon: "🥜", type: "food" },
  { name: "Tree Nuts", icon: "🌰", type: "food" },
  { name: "Milk", icon: "🥛", type: "food" },
  { name: "Eggs", icon: "🥚", type: "food" },
  { name: "Wheat", icon: "🌾", type: "food" },
  { name: "Soy", icon: "🫘", type: "food" },
  { name: "Fish", icon: "🐟", type: "food" },
  { name: "Shellfish", icon: "🦐", type: "food" },
  { name: "Sesame", icon: "🫘", type: "food" },
  { name: "Gluten", icon: "🍞", type: "food" },
  { name: "Lactose", icon: "🧀", type: "food" },
  { name: "Sulfites", icon: "🍷", type: "food" },
];

const mockAllergies: Allergy[] = [
  {
    id: "1",
    name: "Peanuts",
    severity: "severe",
    type: "food",
    symptoms: ["Hives", "Swelling", "Difficulty breathing", "Anaphylaxis risk"],
    avoidItems: ["Peanut butter", "Peanut oil", "Mixed nuts", "Some Asian sauces"],
    crossReactivity: ["Tree nuts", "Lupin"],
    diagnosedDate: new Date(2015, 5, 15),
    notes: "Carry EpiPen at all times",
  },
  {
    id: "2",
    name: "Shellfish",
    severity: "moderate",
    type: "food",
    symptoms: ["Itching", "Stomach cramps", "Nausea"],
    avoidItems: ["Shrimp", "Crab", "Lobster", "Crawfish", "Oysters"],
    diagnosedDate: new Date(2018, 2, 10),
  },
  {
    id: "3",
    name: "Lactose",
    severity: "mild",
    type: "food",
    symptoms: ["Bloating", "Gas", "Stomach discomfort"],
    avoidItems: ["Milk", "Ice cream", "Soft cheeses", "Cream sauces"],
    notes: "Can tolerate small amounts. Lactase pills help.",
  },
];

const mockEmergencyContacts: EmergencyContact[] = [
  { id: "1", name: "John Doe", relationship: "Spouse", phone: "+1 (555) 123-4567", isPrimary: true },
  { id: "2", name: "Dr. Smith", relationship: "Allergist", phone: "+1 (555) 987-6543", isPrimary: false },
];

const severityColors: Record<string, { bg: string; text: string; border: string }> = {
  mild: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  moderate: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
  severe: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300" },
  "life-threatening": { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
};

export default function AllergiesPage() {
  const [activeTab, setActiveTab] = useState<"allergies" | "emergency" | "cards" | "scan">("allergies");
  const [allergies, setAllergies] = useState<Allergy[]>(mockAllergies);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAllergy, setSelectedAllergy] = useState<Allergy | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const allergyCardLanguages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
    { code: "ne", name: "Nepali", flag: "🇳🇵" },
  ];

  const generateAllergyCard = (language: string): string => {
    const allergenList = allergies.map((a) => a.name).join(", ");
    const translations: Record<string, string> = {
      en: `I have food allergies. I cannot eat: ${allergenList}. Please ensure my food does not contain these ingredients. In case of emergency, contact: ${mockEmergencyContacts[0]?.phone}`,
      es: `Tengo alergias alimentarias. No puedo comer: ${allergenList}. Por favor, asegúrese de que mi comida no contenga estos ingredientes.`,
      fr: `J'ai des allergies alimentaires. Je ne peux pas manger: ${allergenList}. Veuillez vous assurer que ma nourriture ne contient pas ces ingrédients.`,
      ne: `मलाई खाने एलर्जी छ। म खान सक्दिन: ${allergenList}। कृपया मेरो खानामा यी सामग्रीहरू नभएको सुनिश्चित गर्नुहोस्।`,
    };
    return translations[language] || translations["en"];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Allergy Manager</h1>
          <p className="text-gray-600 mt-1">Track allergies and stay safe</p>
        </div>

        {/* Emergency Banner */}
        {allergies.some((a) => a.severity === "life-threatening" || a.severity === "severe") && (
          <div className="bg-red-500 text-white rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold">Severe Allergies Detected</p>
                <p className="text-sm opacity-90">Carry emergency medication at all times</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white text-red-600 rounded-lg font-medium">
              View Plan
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "allergies", label: "My Allergies", icon: "🚫" },
            { id: "emergency", label: "Emergency", icon: "🚨" },
            { id: "cards", label: "Restaurant Cards", icon: "🗣️" },
            { id: "scan", label: "Scan Food", icon: "📷" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-red-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-red-50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Allergies Tab */}
        {activeTab === "allergies" && (
          <div className="space-y-6">
            {/* Quick Add */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Add Common Allergens</h3>
              <div className="flex flex-wrap gap-2">
                {commonAllergens
                  .filter((a) => !allergies.some((allergy) => allergy.name === a.name))
                  .slice(0, 8)
                  .map((allergen) => (
                    <button
                      key={allergen.name}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-red-50 rounded-lg text-sm transition-colors"
                    >
                      <span>{allergen.icon}</span>
                      <span>{allergen.name}</span>
                      <span className="text-red-500">+</span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Allergy List */}
            <div className="space-y-4">
              {allergies.map((allergy) => {
                const colors = severityColors[allergy.severity];
                return (
                  <div
                    key={allergy.id}
                    className={`bg-white rounded-2xl shadow-sm overflow-hidden border-l-4 ${colors.border}`}
                    onClick={() => setSelectedAllergy(allergy)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">
                            {commonAllergens.find((a) => a.name === allergy.name)?.icon || "🚫"}
                          </span>
                          <div>
                            <h4 className="font-semibold text-gray-900">{allergy.name}</h4>
                            <span
                              className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${colors.bg} ${colors.text}`}
                            >
                              {allergy.severity}
                            </span>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      {/* Symptoms */}
                      <div className="mt-3">
                        <p className="text-sm text-gray-500 mb-1">Symptoms:</p>
                        <div className="flex flex-wrap gap-1">
                          {allergy.symptoms.slice(0, 3).map((symptom, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {symptom}
                            </span>
                          ))}
                          {allergy.symptoms.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                              +{allergy.symptoms.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Avoid Items */}
                      <div className="mt-3">
                        <p className="text-sm text-gray-500 mb-1">Avoid:</p>
                        <p className="text-sm text-gray-700">
                          {allergy.avoidItems.slice(0, 4).join(", ")}
                          {allergy.avoidItems.length > 4 && "..."}
                        </p>
                      </div>

                      {allergy.notes && (
                        <div className="mt-3 p-2 bg-amber-50 rounded-lg">
                          <p className="text-sm text-amber-800">⚠️ {allergy.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add New Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full p-4 bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600 transition-colors"
            >
              + Add Allergy
            </button>
          </div>
        )}

        {/* Emergency Tab */}
        {activeTab === "emergency" && (
          <div className="space-y-6">
            {/* Emergency Action Plan */}
            <div className="bg-red-500 text-white rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">🚨 Emergency Action Plan</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                    1
                  </span>
                  <div>
                    <p className="font-medium">Recognize Symptoms</p>
                    <p className="text-sm opacity-90">
                      Hives, swelling, difficulty breathing, dizziness
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                    2
                  </span>
                  <div>
                    <p className="font-medium">Administer EpiPen</p>
                    <p className="text-sm opacity-90">
                      Inject into outer thigh, hold for 10 seconds
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                    3
                  </span>
                  <div>
                    <p className="font-medium">Call Emergency Services</p>
                    <p className="text-sm opacity-90">Dial 911 immediately</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Emergency Contacts</h3>
              <div className="space-y-3">
                {mockEmergencyContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-semibold">
                          {contact.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {contact.name}
                          {contact.isPrimary && (
                            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                              Primary
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">{contact.relationship}</p>
                      </div>
                    </div>
                    <a
                      href={`tel:${contact.phone}`}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium"
                    >
                      Call
                    </a>
                  </div>
                ))}
                <button className="w-full p-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-red-300 hover:text-red-600 transition-colors">
                  + Add Contact
                </button>
              </div>
            </div>

            {/* Medical Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Medical Information</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Blood Type</p>
                  <p className="text-lg font-semibold text-gray-900">O+</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Emergency Medications</p>
                  <p className="text-lg font-semibold text-gray-900">
                    EpiPen (Epinephrine Auto-Injector)
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Expires: June 2026</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Insurance</p>
                  <p className="text-lg font-semibold text-gray-900">Blue Cross Blue Shield</p>
                  <p className="text-sm text-gray-500 mt-1">ID: XXX-XXX-1234</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Restaurant Cards Tab */}
        {activeTab === "cards" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Restaurant Allergy Cards</h3>
              <p className="text-gray-600 text-sm mb-4">
                Show this card to restaurant staff to communicate your allergies
              </p>

              {/* Language Selector */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Select Language:</p>
                <div className="flex flex-wrap gap-2">
                  {allergyCardLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.code)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedLanguage === lang.code
                          ? "bg-red-100 text-red-700 border-2 border-red-300"
                          : "bg-gray-100 text-gray-600 border-2 border-transparent"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generated Card */}
              <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">⚠️</span>
                  <h4 className="text-xl font-bold">Food Allergy Alert</h4>
                </div>
                <p className="text-lg leading-relaxed">
                  {generateAllergyCard(selectedLanguage)}
                </p>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-sm opacity-80">
                    Allergens: {allergies.map((a) => a.name).join(" • ")}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <button className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium">
                  📱 Save to Phone
                </button>
                <button className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium">
                  🖨️ Print Card
                </button>
              </div>
            </div>

            {/* Pre-made Cards */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Cards</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {allergies.map((allergy) => (
                  <div
                    key={allergy.id}
                    className="p-4 bg-gray-50 rounded-xl border-l-4 border-red-500"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">
                        {commonAllergens.find((a) => a.name === allergy.name)?.icon || "🚫"}
                      </span>
                      <span className="font-medium text-gray-900">{allergy.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      I am allergic to {allergy.name.toLowerCase()}. Please ensure my food does not
                      contain this ingredient.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scan Tab */}
        {activeTab === "scan" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Scan Food Labels</h3>
              <p className="text-gray-600 text-sm mb-6">
                Take a photo of ingredients to check for allergens
              </p>

              {/* Camera Area */}
              <div className="aspect-video bg-gray-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                <span className="text-6xl mb-4">📷</span>
                <p className="text-gray-500 mb-4">Point camera at ingredient list</p>
                <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium">
                  Open Camera
                </button>
              </div>

              {/* Or Upload */}
              <div className="mt-4 text-center">
                <p className="text-gray-500 text-sm">or</p>
                <button className="mt-2 text-red-600 font-medium">
                  Upload Photo from Gallery
                </button>
              </div>
            </div>

            {/* Recent Scans */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Scans</h3>
              <div className="space-y-3">
                {[
                  { product: "Granola Bar", status: "safe", allergens: [] },
                  { product: "Thai Sauce", status: "warning", allergens: ["Peanuts"] },
                  { product: "Bread Loaf", status: "safe", allergens: [] },
                ].map((scan, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl flex items-center justify-between ${
                      scan.status === "safe" ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {scan.status === "safe" ? "✅" : "⚠️"}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{scan.product}</p>
                        {scan.allergens.length > 0 && (
                          <p className="text-sm text-red-600">
                            Contains: {scan.allergens.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        scan.status === "safe"
                          ? "bg-green-200 text-green-700"
                          : "bg-red-200 text-red-700"
                      }`}
                    >
                      {scan.status === "safe" ? "Safe" : "Warning"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-3">💡 Scanning Tips</h3>
              <ul className="space-y-2 text-sm">
                <li>• Make sure the ingredient list is clearly visible</li>
                <li>• Good lighting improves accuracy</li>
                <li>• Hold the camera steady for best results</li>
                <li>• Check "may contain" warnings manually</li>
              </ul>
            </div>
          </div>
        )}

        {/* Add Allergy Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Add Allergy</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Common Allergens
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {commonAllergens.slice(0, 9).map((allergen) => (
                      <button
                        key={allergen.name}
                        className="p-3 bg-gray-50 hover:bg-red-50 rounded-xl text-center transition-colors"
                      >
                        <span className="text-2xl">{allergen.icon}</span>
                        <p className="text-xs text-gray-600 mt-1">{allergen.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Or enter custom allergen
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    placeholder="e.g., Mustard"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity
                  </label>
                  <select className="w-full p-3 border border-gray-200 rounded-xl">
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                    <option value="life-threatening">Life-threatening</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Symptoms
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-200 rounded-xl resize-none"
                    rows={2}
                    placeholder="List your symptoms..."
                  />
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium">
                  Add Allergy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Allergy Detail Modal */}
        {selectedAllergy && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {commonAllergens.find((a) => a.name === selectedAllergy.name)?.icon || "🚫"}
                  </span>
                  <h3 className="font-semibold text-gray-900">{selectedAllergy.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedAllergy(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div
                  className={`p-3 rounded-xl ${
                    severityColors[selectedAllergy.severity].bg
                  }`}
                >
                  <p className="text-sm text-gray-600">Severity</p>
                  <p
                    className={`font-semibold capitalize ${
                      severityColors[selectedAllergy.severity].text
                    }`}
                  >
                    {selectedAllergy.severity}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Symptoms</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAllergy.symptoms.map((symptom, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Foods to Avoid</h4>
                  <ul className="space-y-1">
                    {selectedAllergy.avoidItems.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600">
                        <span className="text-red-500">✕</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedAllergy.crossReactivity && (
                  <div className="p-3 bg-amber-50 rounded-xl">
                    <p className="text-sm text-amber-800">
                      ⚠️ <strong>Cross-reactivity:</strong>{" "}
                      {selectedAllergy.crossReactivity.join(", ")}
                    </p>
                  </div>
                )}

                {selectedAllergy.notes && (
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-800">
                      📝 <strong>Notes:</strong> {selectedAllergy.notes}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium">
                    Edit
                  </button>
                  <button className="flex-1 px-4 py-3 bg-red-100 text-red-600 rounded-xl font-medium">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
