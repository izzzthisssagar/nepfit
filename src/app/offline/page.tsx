"use client";

import Link from "next/link";
import { Button } from "@/components/ui";

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Offline Icon */}
        <div className="w-24 h-24 bg-neutral-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          You&apos;re Offline
        </h1>
        <p className="text-neutral-600 mb-8">
          Don&apos;t worry! Your food logs are saved locally and will sync when
          you&apos;re back online.
        </p>

        {/* What you can still do */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 mb-6 text-left">
          <h2 className="font-semibold text-neutral-900 mb-4">
            What you can still do:
          </h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-neutral-600">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                ✓
              </span>
              <span>View your saved food logs</span>
            </li>
            <li className="flex items-center gap-3 text-neutral-600">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                ✓
              </span>
              <span>Log new meals (will sync later)</span>
            </li>
            <li className="flex items-center gap-3 text-neutral-600">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                ✓
              </span>
              <span>Track water intake</span>
            </li>
            <li className="flex items-center gap-3 text-neutral-600">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                ✓
              </span>
              <span>View saved recipes</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button onClick={handleRetry} fullWidth size="lg">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </Button>
          <Link href="/dashboard">
            <Button variant="secondary" fullWidth size="lg">
              Continue Offline
            </Button>
          </Link>
        </div>

        {/* Tip */}
        <p className="text-sm text-neutral-500 mt-8">
          💡 Tip: NepFit works offline! All your data is stored locally on your
          device.
        </p>
      </div>
    </div>
  );
}
