import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
      <body className="min-h-screen bg-zinc-50 font-sans">
        <nav className="bg-blue-700 text-white px-6 py-3 mb-6 flex items-center">
          <a href="/" className="font-bold text-lg">Brasaland Talent Pipeline Tracker</a>
          <a href="/nuevo" className="ml-6 underline">Registrar candidato</a>
        </nav>
        <div className="flex flex-col flex-1">{children}</div>
      </body>
    </html>
  );
}
