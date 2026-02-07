import { create } from "zustand";
import { persist } from "zustand/middleware";

// ==========================================
// Thyroid Management Module
// ==========================================

export type ThyroidMode = "hypothyroid" | "hyperthyroid";

export interface LabResult {
  id: string;
  date: string; // YYYY-MM-DD
  tsh: number; // mIU/L
  t3?: number; // ng/dL
  t4?: number; // mcg/dL
  notes?: string;
}

export interface ThyroidMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string; // e.g. "empty stomach"
  waitBeforeFood: number; // minutes
  active: boolean;
  reminders: string[]; // time strings
}

export interface CheckupReminder {
  id: string;
  title: string;
  date: string;
  type: "lab_test" | "doctor_visit" | "medication_review";
  completed: boolean;
}

export interface GoitrogenFood {
  name: string;
  category: "cruciferous" | "soy" | "other";
  impact: "high" | "moderate" | "low";
  tip: string;
}

export interface ThyroidBoostFood {
  name: string;
  nutrient: "selenium" | "iodine" | "zinc" | "iron" | "vitamin_d";
  benefit: string;
}

// Pre-defined goitrogen foods
export const GOITROGEN_FOODS: GoitrogenFood[] = [
  { name: "Raw Cabbage", category: "cruciferous", impact: "high", tip: "Cook to reduce goitrogen effect" },
  { name: "Raw Cauliflower", category: "cruciferous", impact: "high", tip: "Steaming reduces goitrogens by 50%" },
  { name: "Raw Broccoli", category: "cruciferous", impact: "high", tip: "Lightly cooking is safe" },
  { name: "Raw Kale", category: "cruciferous", impact: "moderate", tip: "Avoid raw in large amounts" },
  { name: "Brussels Sprouts", category: "cruciferous", impact: "moderate", tip: "Roasting reduces goitrogens" },
  { name: "Soy Milk", category: "soy", impact: "high", tip: "Can interfere with thyroid medication" },
  { name: "Tofu", category: "soy", impact: "moderate", tip: "Fermented soy is better tolerated" },
  { name: "Edamame", category: "soy", impact: "moderate", tip: "Limit to small portions" },
  { name: "Millet (Bajra)", category: "other", impact: "moderate", tip: "Limit intake if hypothyroid" },
  { name: "Sweet Potato (raw)", category: "other", impact: "low", tip: "Cooking eliminates goitrogens" },
  { name: "Strawberries", category: "other", impact: "low", tip: "Safe in moderate amounts" },
  { name: "Peanuts", category: "other", impact: "low", tip: "Roasted is better than raw" },
];

// Pre-defined thyroid-boosting foods
export const THYROID_BOOST_FOODS: ThyroidBoostFood[] = [
  { name: "Brazil Nuts", nutrient: "selenium", benefit: "Just 2-3 nuts meet daily selenium needs" },
  { name: "Eggs", nutrient: "selenium", benefit: "Rich in selenium and iodine" },
  { name: "Sunflower Seeds", nutrient: "selenium", benefit: "Great snack for thyroid health" },
  { name: "Fish (Hilsa/Rohu)", nutrient: "selenium", benefit: "Omega-3 reduces thyroid inflammation" },
  { name: "Iodized Salt", nutrient: "iodine", benefit: "Primary iodine source in Nepal" },
  { name: "Seaweed", nutrient: "iodine", benefit: "Richest natural source of iodine" },
  { name: "Dairy (Milk/Dahi)", nutrient: "iodine", benefit: "Good iodine source" },
  { name: "Prawns", nutrient: "iodine", benefit: "Excellent iodine content" },
  { name: "Pumpkin Seeds", nutrient: "zinc", benefit: "Zinc supports T3 production" },
  { name: "Chickpeas (Chana)", nutrient: "zinc", benefit: "Plant-based zinc source" },
  { name: "Cashews (Kaju)", nutrient: "zinc", benefit: "Healthy zinc-rich snack" },
  { name: "Spinach (Palak)", nutrient: "iron", benefit: "Iron supports thyroid function" },
  { name: "Lentils (Dal)", nutrient: "iron", benefit: "Staple iron-rich food" },
  { name: "Mushrooms", nutrient: "vitamin_d", benefit: "Vitamin D supports thyroid" },
];

interface ThyroidState {
  // Lab results
  labResults: LabResult[];

  // Medications
  medications: ThyroidMedication[];

  // Mode
  thyroidMode: ThyroidMode;

  // Alerts
  goitrogenAlerts: boolean;

  // Checkup reminders
  checkupReminders: CheckupReminder[];

  // Health score
  healthScore: number;

  // Next checkup
  nextCheckup: string;

  // Weight & energy tracking
  weightEnergyLog: { date: string; weight?: number; energy: number }[];

  // Actions
  addLabResult: (result: Omit<LabResult, "id">) => void;
  deleteLabResult: (id: string) => void;
  addMedication: (med: Omit<ThyroidMedication, "id">) => void;
  updateMedication: (id: string, updates: Partial<ThyroidMedication>) => void;
  deleteMedication: (id: string) => void;
  setThyroidMode: (mode: ThyroidMode) => void;
  toggleGoitrogenAlerts: () => void;
  addCheckupReminder: (reminder: Omit<CheckupReminder, "id">) => void;
  completeCheckup: (id: string) => void;
  setNextCheckup: (date: string) => void;
  logWeightEnergy: (entry: { date: string; weight?: number; energy: number }) => void;

  // Getters
  getLatestLab: () => LabResult | undefined;
  getLabHistory: (count: number) => LabResult[];
  getActiveMedications: () => ThyroidMedication[];
  getPendingCheckups: () => CheckupReminder[];
}

export const useThyroidStore = create<ThyroidState>()(
  persist(
    (set, get) => ({
      labResults: [],
      medications: [],
      thyroidMode: "hypothyroid",
      goitrogenAlerts: true,
      checkupReminders: [],
      healthScore: 68,
      nextCheckup: "",
      weightEnergyLog: [],

      addLabResult: (result) => {
        set((state) => ({
          labResults: [
            { ...result, id: `lab_${Date.now()}` },
            ...state.labResults,
          ].slice(0, 100),
        }));
      },

      deleteLabResult: (id) => {
        set((state) => ({
          labResults: state.labResults.filter((r) => r.id !== id),
        }));
      },

      addMedication: (med) => {
        set((state) => ({
          medications: [
            { ...med, id: `tmed_${Date.now()}` },
            ...state.medications,
          ],
        }));
      },

      updateMedication: (id, updates) => {
        set((state) => ({
          medications: state.medications.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        }));
      },

      deleteMedication: (id) => {
        set((state) => ({
          medications: state.medications.filter((m) => m.id !== id),
        }));
      },

      setThyroidMode: (mode) => {
        set({ thyroidMode: mode });
      },

      toggleGoitrogenAlerts: () => {
        set((state) => ({
          goitrogenAlerts: !state.goitrogenAlerts,
        }));
      },

      addCheckupReminder: (reminder) => {
        set((state) => ({
          checkupReminders: [
            { ...reminder, id: `chk_${Date.now()}` },
            ...state.checkupReminders,
          ],
        }));
      },

      completeCheckup: (id) => {
        set((state) => ({
          checkupReminders: state.checkupReminders.map((r) =>
            r.id === id ? { ...r, completed: true } : r
          ),
        }));
      },

      setNextCheckup: (date) => {
        set({ nextCheckup: date });
      },

      logWeightEnergy: (entry) => {
        set((state) => ({
          weightEnergyLog: [
            entry,
            ...state.weightEnergyLog.filter((e) => e.date !== entry.date),
          ].slice(0, 365),
        }));
      },

      getLatestLab: () => {
        return get().labResults[0];
      },

      getLabHistory: (count) => {
        return get().labResults.slice(0, count);
      },

      getActiveMedications: () => {
        return get().medications.filter((m) => m.active);
      },

      getPendingCheckups: () => {
        return get().checkupReminders.filter((r) => !r.completed);
      },
    }),
    {
      name: "nepfit-thyroid-storage",
    }
  )
);
