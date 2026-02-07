import { create } from "zustand";
import { persist } from "zustand/middleware";

// ==========================================
// Notification System
// ==========================================

export type NotificationType =
  | "meal_reminder"
  | "health_alert"
  | "social"
  | "achievement"
  | "system"
  | "water_reminder"
  | "streak";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  icon: string;
  read: boolean;
  timestamp: Date;
  actionUrl?: string;
  priority: "low" | "medium" | "high";
}

export interface NotificationPreferences {
  mealReminders: boolean;
  healthAlerts: boolean;
  social: boolean;
  achievements: boolean;
  system: boolean;
  waterReminders: boolean;
  streakAlerts: boolean;
  push: boolean;
  email: boolean;
  whatsapp: boolean;
  frequency: "instant" | "hourly" | "daily";
}

export interface QuietHours {
  enabled: boolean;
  start: string; // HH:mm
  end: string; // HH:mm
}

interface NotificationState {
  // Notifications
  notifications: Notification[];

  // Preferences
  preferences: NotificationPreferences;

  // Quiet hours
  quietHours: QuietHours;

  // Computed
  unreadCount: number;

  // Actions
  addNotification: (notification: Omit<Notification, "id" | "read" | "timestamp">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
  deleteNotification: (id: string) => void;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
  setQuietHours: (hours: Partial<QuietHours>) => void;

  // Getters
  getUnreadNotifications: () => Notification[];
  getNotificationsByType: (type: NotificationType) => Notification[];
  getRecentNotifications: (count: number) => Notification[];
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      preferences: {
        mealReminders: true,
        healthAlerts: true,
        social: true,
        achievements: true,
        system: true,
        waterReminders: true,
        streakAlerts: true,
        push: false,
        email: true,
        whatsapp: false,
        frequency: "instant",
      },
      quietHours: {
        enabled: false,
        start: "22:00",
        end: "07:00",
      },
      unreadCount: 0,

      addNotification: (notification) => {
        set((state) => {
          const newNotification: Notification = {
            ...notification,
            id: `notif_${Date.now()}`,
            read: false,
            timestamp: new Date(),
          };
          const updated = [newNotification, ...state.notifications].slice(0, 200);
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
          };
        });
      },

      markRead: (id) => {
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
          };
        });
      },

      markAllRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      deleteNotification: (id) => {
        set((state) => {
          const updated = state.notifications.filter((n) => n.id !== id);
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
          };
        });
      },

      updatePreferences: (prefs) => {
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        }));
      },

      setQuietHours: (hours) => {
        set((state) => ({
          quietHours: { ...state.quietHours, ...hours },
        }));
      },

      getUnreadNotifications: () => {
        return get().notifications.filter((n) => !n.read);
      },

      getNotificationsByType: (type) => {
        return get().notifications.filter((n) => n.type === type);
      },

      getRecentNotifications: (count) => {
        return get().notifications.slice(0, count);
      },
    }),
    {
      name: "nepfit-notification-storage",
      partialize: (state) => ({
        notifications: state.notifications.slice(0, 50),
        preferences: state.preferences,
        quietHours: state.quietHours,
        unreadCount: state.unreadCount,
      }),
    }
  )
);
