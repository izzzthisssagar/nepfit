import { create } from "zustand";
import { persist } from "zustand/middleware";

// Import translations
import en from "./messages/en.json";
import ne from "./messages/ne.json";
import hi from "./messages/hi.json";
import bn from "./messages/bn.json";
import ur from "./messages/ur.json";
import si from "./messages/si.json";

// ==========================================
// Types
// ==========================================

export type Locale = "en" | "ne" | "hi" | "bn" | "ur" | "si";

export interface Language {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
  direction: "ltr" | "rtl";
}

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", direction: "ltr" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", flag: "🇳🇵", direction: "ltr" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", direction: "ltr" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩", direction: "ltr" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰", direction: "rtl" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල", flag: "🇱🇰", direction: "ltr" },
];

// ==========================================
// Translation Messages
// ==========================================

const messages: Record<Locale, typeof en> = {
  en,
  ne,
  hi,
  bn,
  ur,
  si,
};

// ==========================================
// Language Store
// ==========================================

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "nepfit-language-storage",
    }
  )
);

// ==========================================
// Translation Hook
// ==========================================

type TranslationKeys = typeof en;
type NestedKeyOf<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends Record<string, unknown>
    ? `${K}.${NestedKeyOf<T[K]>}`
    : K
  : never;

type TranslationPath = NestedKeyOf<TranslationKeys>;

export function useTranslation() {
  const { locale, setLocale } = useLanguageStore();
  const currentMessages = messages[locale];

  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split(".");
    let value: unknown = currentMessages;

    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        // Fallback to English
        value = messages.en;
        for (const k of keys) {
          if (value && typeof value === "object" && k in value) {
            value = (value as Record<string, unknown>)[k];
          } else {
            return path; // Return path if not found
          }
        }
        break;
      }
    }

    let result = String(value);

    // Replace params
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        result = result.replace(new RegExp(`{{${key}}}`, "g"), String(val));
      });
    }

    return result;
  };

  return {
    t,
    locale,
    setLocale,
    languages: LANGUAGES,
    currentLanguage: LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0],
  };
}

// ==========================================
// Helper Functions
// ==========================================

export function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find((l) => l.code === code);
}

export function formatNumber(num: number, locale: Locale = "en"): string {
  const localeMap: Record<Locale, string> = {
    en: "en-US",
    ne: "ne-NP",
    hi: "hi-IN",
    bn: "bn-BD",
    ur: "ur-PK",
    si: "si-LK",
  };
  return new Intl.NumberFormat(localeMap[locale]).format(num);
}

export function formatDate(date: Date, locale: Locale = "en"): string {
  const localeMap: Record<Locale, string> = {
    en: "en-US",
    ne: "ne-NP",
    hi: "hi-IN",
    bn: "bn-BD",
    ur: "ur-PK",
    si: "si-LK",
  };
  return new Intl.DateTimeFormat(localeMap[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatCurrency(amount: number, locale: Locale = "en"): string {
  const config: Record<Locale, { locale: string; currency: string }> = {
    en: { locale: "en-IN", currency: "INR" },
    ne: { locale: "ne-NP", currency: "NPR" },
    hi: { locale: "hi-IN", currency: "INR" },
    bn: { locale: "bn-BD", currency: "BDT" },
    ur: { locale: "ur-PK", currency: "PKR" },
    si: { locale: "si-LK", currency: "LKR" },
  };
  const { locale: loc, currency } = config[locale];
  return new Intl.NumberFormat(loc, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
