import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import GlobalSearchInput from "../components/GlobalSearchInput";
import "./globals.css";

function IconDashboard({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconGroup({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 19C3.8 16.7 5.9 15 8.4 15h1.2c2.5 0 4.6 1.7 5.4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14.5 19c.5-1.5 1.9-2.5 3.5-2.5h.8c1.2 0 2.3.5 3.1 1.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconNote({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconSettings({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M19 12a7 7 0 0 0-.1-1l2-1.2-2-3.4-2.2 1a7 7 0 0 0-1.7-1L14.7 3h-5.4L8.9 6.4a7 7 0 0 0-1.7 1l-2.2-1-2 3.4L5 11a7 7 0 0 0 0 2L3 14.2l2 3.4 2.2-1a7 7 0 0 0 1.7 1l.4 3.4h5.4l.4-3.4a7 7 0 0 0 1.7-1l2.2 1 2-3.4-2.1-1.2c.1-.3.1-.7.1-1Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Brasaland Talent Pipeline Tracker",
  description: "Gestión de candidaturas para Brasaland Digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-neutral-900 text-neutral-100 font-sans">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col justify-between py-6 px-4">
            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="bg-yellow-400 text-black font-bold rounded w-8 h-8 flex items-center justify-center text-lg">T</div>
                <span className="text-xl font-semibold tracking-tight">Talent Pipeline</span>
              </div>
              <nav className="flex flex-col gap-2">
                <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded text-neutral-200 hover:bg-neutral-800 transition-colors font-medium">
                  <IconDashboard className="h-5 w-5 text-yellow-400" />
                  Pipeline
                </Link>
                <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded text-neutral-200 hover:bg-neutral-800 transition-colors font-medium">
                  <IconGroup className="h-5 w-5" />
                  Candidatos
                </Link>
                <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded text-neutral-200 hover:bg-neutral-800 transition-colors font-medium">
                  <IconNote className="h-5 w-5" />
                  Notes
                </Link>
              </nav>
            </div>
            <div className="text-neutral-500 text-sm flex items-center gap-2">
              <IconSettings className="h-5 w-5" />
              Settings
            </div>
          </aside>
          {/* Main content */}
          <main className="flex-1 flex flex-col min-h-screen bg-neutral-900">
            <header className="flex items-center justify-between px-10 py-6 border-b border-neutral-800">
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <div className="flex items-center gap-4">
                <GlobalSearchInput
                  className="bg-neutral-800 border border-neutral-700 rounded px-4 py-2 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Buscar candidatos por nombre o email..."
                />
                <Link href="/nuevo" className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition-colors">+ Nuevo Candidato</Link>
              </div>
            </header>
            <section className="flex-1 px-10 py-8">
              {children}
            </section>
          </main>
        </div>
      </body>
    </html>
  );
}
