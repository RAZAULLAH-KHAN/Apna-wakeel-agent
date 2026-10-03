import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Apna Wakil AI (اپنا وکیل) — Legal Guidance Agent for Pakistan',
  description:
    'Every person deserves a personal lawyer. Calming, step-by-step Pakistani legal guidance grounded in CrPC, PPC, and PECA with exact scripts and action plans.',
  keywords: [
    'Pakistan legal advice',
    'Apna Wakil',
    'FIR Pakistan law',
    'police summons rights',
    'FIA cybercrime complaint',
    'bribe extortion law',
    'women harassment Pakistan',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F7F9FC] text-[#1F2937]">
        <LanguageProvider>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
