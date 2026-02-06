import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PWAProvider } from "@/components/PWAProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NepFit - Your AI Dietician for South Asian Wellness",
  description: "AI-powered Nepali & Indian fitness, diet & nutrition super app. Track calories, get personalized meal plans, and achieve your health goals with traditional foods.",
  keywords: ["nepali food", "indian food", "calorie tracker", "diet app", "nutrition", "meal planning", "weight loss", "diabetes management"],
  authors: [{ name: "NepFit Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NepFit",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "NepFit",
    title: "NepFit - Your AI Dietician for South Asian Wellness",
    description: "Track nutrition with traditional Nepali & Indian foods. AI-powered meal logging and personalized insights.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#10B981",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="antialiased min-h-screen">
        <PWAProvider>
          {children}
        </PWAProvider>
      </body>
    </html>
  );
}
