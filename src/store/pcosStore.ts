import { create } from "zustand";
import { persist } from "zustand/middleware";

// ==========================================
// PCOS Management Module
// ==========================================

export type CyclePhase = "menstrual" | "follicular" | "ovulatory" | "luteal";
export type FlowLevel = "none" | "light" | "medium" | "heavy";

export interface CycleDayEntry {
  id: string;
  date: string; // YYYY-MM-DD
  day: number; // day of cycle
  phase: CyclePhase;
  flowLevel: FlowLevel;
  temperature?: number;
  notes?: string;
}

export interface SymptomLog {
  id: string;
  date: string;
  acne: number; // 0-5
  hairFall: number; // 0-5
  fatigue: number; // 0-5
  bloating: number; // 0-5
  cravings: string[];
  mood: "great" | "good" | "okay" | "low" | "bad";
  notes?: string;
}

export interface SeedCyclingStatus {
  enabled: boolean;
  currentSeeds: string[];
  phase: "follicular" | "luteal";
}

export interface PCOSState {
  // Cycle data
  cycleData: CycleDayEntry[];
  currentPhase: CyclePhase;
  cycleLength: number;
  lastPeriodStart: string;

  // Symptoms
  symptoms: SymptomLog[];

  // Seed cycling
  seedCycling: SeedCyclingStatus;

  // Scores
  inflammationScore: number;
  healthScore: number;

  // Medication & supplements
  supplements: { id: string; name: string; dosage: string; time: string; active: boolean }[];

  // Actions
  logCycleDay: (entry: Omit<CycleDayEntry, "id">) => void;
  logSymptoms: (log: Omit<SymptomLog, "id">) => void;
  updatePhase: (phase: CyclePhase) => void;
  toggleSeedCycling: () => void;
  calculateInflammationScore: () => number;
  setCycleLength: (length: number) => void;
  setLastPeriodStart: (date: string) => void;
  addSupplement: (supplement: Omit<PCOSState["supplements"][0], "id">) => void;
  toggleSupplement: (id: string) => void;

  // Getters
  getCycleDayForDate: (date: string) => CycleDayEntry | undefined;
  getSymptomsForDate: (date: string) => SymptomLog | undefined;
  getRecentSymptoms: (days: number) => SymptomLog[];
}

export const usePCOSStore = create<PCOSState>()(
  persist(
    (set, get) => ({
      cycleData: [],
      currentPhase: "follicular",
      cycleLength: 28,
      lastPeriodStart: "",
      symptoms: [],
      seedCycling: {
        enabled: false,
        currentSeeds: ["flax", "pumpkin"],
        phase: "follicular",
      },
      inflammationScore: 0,
      healthScore: 72,
      supplements: [],

      logCycleDay: (entry) => {
        set((state) => ({
          cycleData: [
            { ...entry, id: `cycle_${Date.now()}` },
            ...state.cycleData,
          ].slice(0, 365),
        }));
      },

      logSymptoms: (log) => {
        set((state) => ({
          symptoms: [
            { ...log, id: `sym_${Date.now()}` },
            ...state.symptoms.filter((s) => s.date !== log.date),
          ].slice(0, 365),
        }));
      },

      updatePhase: (phase) => {
        const seedPhase = phase === "menstrual" || phase === "follicular" ? "follicular" : "luteal";
        const seeds =
          seedPhase === "follicular"
            ? ["flax", "pumpkin"]
            : ["sesame", "sunflower"];

        set((state) => ({
          currentPhase: phase,
          seedCycling: {
            ...state.seedCycling,
            phase: seedPhase,
            currentSeeds: seeds,
          },
        }));
      },

      toggleSeedCycling: () => {
        set((state) => ({
          seedCycling: {
            ...state.seedCycling,
            enabled: !state.seedCycling.enabled,
          },
        }));
      },

      calculateInflammationScore: () => {
        const state = get();
        const recent = state.symptoms.slice(0, 7);
        if (recent.length === 0) return 0;

        const avgAcne = recent.reduce((sum, s) => sum + s.acne, 0) / recent.length;
        const avgBloating = recent.reduce((sum, s) => sum + s.bloating, 0) / recent.length;
        const avgFatigue = recent.reduce((sum, s) => sum + s.fatigue, 0) / recent.length;

        const score = Math.round(((avgAcne + avgBloating + avgFatigue) / 15) * 100);
        set({ inflammationScore: score });
        return score;
      },

      setCycleLength: (length) => {
        set({ cycleLength: length });
      },

      setLastPeriodStart: (date) => {
        set({ lastPeriodStart: date });
      },

      addSupplement: (supplement) => {
        set((state) => ({
          supplements: [
            { ...supplement, id: `supp_${Date.now()}` },
            ...state.supplements,
          ],
        }));
      },

      toggleSupplement: (id) => {
        set((state) => ({
          supplements: state.supplements.map((s) =>
            s.id === id ? { ...s, active: !s.active } : s
          ),
        }));
      },

      getCycleDayForDate: (date) => {
        return get().cycleData.find((d) => d.date === date);
      },

      getSymptomsForDate: (date) => {
        return get().symptoms.find((s) => s.date === date);
      },

      getRecentSymptoms: (days) => {
        return get().symptoms.slice(0, days);
      },
    }),
    {
      name: "nepfit-pcos-storage",
    }
  )
);
