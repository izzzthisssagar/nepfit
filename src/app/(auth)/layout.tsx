import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen gradient-hero flex flex-col relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-200 rounded-full blur-3xl opacity-20" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-accent-200 rounded-full blur-3xl opacity-20" />

      {/* Simple Header */}
      <header className="relative z-10 p-4">
        <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="font-bold text-xl text-neutral-900">NepFit</span>
        </Link>
      </header>

      {/* Auth Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-4 text-center text-sm text-neutral-500">
        © 2026 NepFit. Made with ❤️ in Nepal
      </footer>
    </div>
  );
}
