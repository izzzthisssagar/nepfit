"use client";

import { useState } from "react";
import { useTranslation, LANGUAGES, type Locale } from "@/i18n";

interface LanguageSwitcherProps {
  variant?: "dropdown" | "inline" | "compact";
  showLabel?: boolean;
}

export function LanguageSwitcher({
  variant = "dropdown",
  showLabel = true,
}: LanguageSwitcherProps) {
  const { locale, setLocale, currentLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (code: Locale) => {
    setLocale(code);
    setIsOpen(false);
  };

  if (variant === "inline") {
    return (
      <div className="flex gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              locale === lang.code
                ? "bg-primary-500 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            <span className="mr-1">{lang.flag}</span>
            {lang.nativeName}
          </button>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-neutral-100 transition-all"
        >
          <span className="text-lg">{currentLanguage.flag}</span>
          <svg
            className={`w-4 h-4 text-neutral-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-neutral-50 ${
                    locale === lang.code
                      ? "text-primary-600 font-medium"
                      : "text-neutral-700"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                  {locale === lang.code && (
                    <svg
                      className="w-4 h-4 ml-auto text-primary-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl hover:border-neutral-300 transition-all"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        {showLabel && (
          <span className="text-sm font-medium text-neutral-700">
            {currentLanguage.nativeName}
          </span>
        )}
        <svg
          className={`w-4 h-4 text-neutral-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
            <div className="px-4 py-2 text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Select Language
            </div>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-neutral-50 transition-colors ${
                  locale === lang.code
                    ? "bg-primary-50 text-primary-700"
                    : "text-neutral-700"
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div>
                  <div className="font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-neutral-500">{lang.name}</div>
                </div>
                {locale === lang.code && (
                  <svg
                    className="w-5 h-5 ml-auto text-primary-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
