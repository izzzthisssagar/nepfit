"use client";

import { useState, useEffect } from "react";
import { Button, Card } from "@/components/ui";
import { usePWA } from "./PWAProvider";

export function InstallPrompt() {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the prompt
    const wasDismissed = localStorage.getItem("nepfit-install-dismissed");
    if (wasDismissed) {
      const dismissedTime = parseInt(wasDismissed);
      // Show again after 7 days
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        setDismissed(true);
      }
    }

    // Delay showing the prompt for better UX
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("nepfit-install-dismissed", String(Date.now()));
  };

  const handleInstall = async () => {
    await installApp();
    setDismissed(true);
  };

  // Don't show if already installed, not installable, dismissed, or not ready
  if (isInstalled || !isInstallable || dismissed || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 lg:bottom-8 lg:left-auto lg:right-8 lg:max-w-sm z-40">
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white border-0 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Install NepFit</h3>
            <p className="text-primary-100 text-sm mb-4">
              Add NepFit to your home screen for quick access and offline support!
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDismiss}
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                Later
              </Button>
              <Button
                size="sm"
                onClick={handleInstall}
                className="bg-white text-primary-600 hover:bg-primary-50"
              >
                Install Now
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </Card>
    </div>
  );
}

// Compact version for settings page
export function InstallButton() {
  const { isInstallable, isInstalled, installApp } = usePWA();

  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm font-medium">App Installed</span>
      </div>
    );
  }

  if (!isInstallable) {
    return null;
  }

  return (
    <Button onClick={installApp} size="sm">
      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
      </svg>
      Install App
    </Button>
  );
}
