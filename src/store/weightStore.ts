import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WeightEntry {
  date: string; // YYYY-MM-DD
  weight: number; // in kg
  note?: string;
  createdAt: number;
}

interface WeightState {
  entries: WeightEntry[];

  // Actions
  addEntry: (date: string, weight: number, note?: string) => void;
  updateEntry: (date: string, weight: number, note?: string) => void;
  deleteEntry: (date: string) => void;
  getEntry: (date: string) => WeightEntry | undefined;
  getLatestEntry: () => WeightEntry | undefined;
  getEntriesInRange: (startDate: string, endDate: string) => WeightEntry[];
  getWeightChange: (days: number) => { change: number; startWeight: number; endWeight: number } | null;
}

export const useWeightStore = create<WeightState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (date, weight, note) => {
        set((state) => {
          // Check if entry already exists for this date
          const existingIndex = state.entries.findIndex((e) => e.date === date);

          if (existingIndex >= 0) {
            // Update existing entry
            const newEntries = [...state.entries];
            newEntries[existingIndex] = {
              date,
              weight,
              note,
              createdAt: Date.now(),
            };
            return { entries: newEntries };
          }

          // Add new entry
          return {
            entries: [
              ...state.entries,
              { date, weight, note, createdAt: Date.now() },
            ].sort((a, b) => a.date.localeCompare(b.date)),
          };
        });
      },

      updateEntry: (date, weight, note) => {
        set((state) => {
          const newEntries = state.entries.map((e) =>
            e.date === date
              ? { ...e, weight, note, createdAt: Date.now() }
              : e
          );
          return { entries: newEntries };
        });
      },

      deleteEntry: (date) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.date !== date),
        }));
      },

      getEntry: (date) => {
        return get().entries.find((e) => e.date === date);
      },

      getLatestEntry: () => {
        const entries = get().entries;
        if (entries.length === 0) return undefined;
        return entries[entries.length - 1];
      },

      getEntriesInRange: (startDate, endDate) => {
        return get().entries.filter(
          (e) => e.date >= startDate && e.date <= endDate
        );
      },

      getWeightChange: (days) => {
        const entries = get().entries;
        if (entries.length < 2) return null;

        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - days);

        const startDateStr = startDate.toISOString().split("T")[0];
        const endDateStr = today.toISOString().split("T")[0];

        // Find closest entries to start and end dates
        const entriesInRange = entries.filter(
          (e) => e.date >= startDateStr && e.date <= endDateStr
        );

        if (entriesInRange.length < 2) return null;

        const startWeight = entriesInRange[0].weight;
        const endWeight = entriesInRange[entriesInRange.length - 1].weight;

        return {
          change: endWeight - startWeight,
          startWeight,
          endWeight,
        };
      },
    }),
    {
      name: "nepfit-weight-storage",
    }
  )
);

// Helper to get today's date string
export const getTodayDateString = (): string => {
  return new Date().toISOString().split("T")[0];
};
