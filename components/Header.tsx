'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scale, PhoneCall, Globe, Menu, X, ShieldAlert, FileText, History, User } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';

export default function Header() {
  const { locale, setLocale, t, isUrdu } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0F2A4A] text-white shadow-md border-b border-[#163A63]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href={user ? '/app' : '/'} className="flex items-center space-x-3 rtl:space-x-reverse group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0E9F8E] to-[#14B8A6] flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight leading-tight text-white group-hover:text-teal-200 transition-colors">
                {t('appName')}
              </span>
              <span className="text-[11px] text-teal-300 font-medium leading-none">
                {isUrdu ? 'آپ کا ذاتی قانونی وکیل' : 'Legal Agent Pakistan'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Controls */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {/* Quick Links */}
            <Link
              href="/app"
              className="text-gray-200 hover:text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
            >
              {t('dashboard')}
            </Link>
            <Link
              href="/app/drafts"
              className="text-gray-200 hover:text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-teal-400" />
              {t('drafts')}
            </Link>
            <Link
              href="/app/history"
              className="text-gray-200 hover:text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <History className="w-4 h-4 text-amber-400" />
              {t('history')}
            </Link>

            {/* Language Switcher */}
            <button
              onClick={() => setLocale(locale === 'en' ? 'ur' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 transition-all border border-white/10"
              title="Toggle English / اردو"
            >
              <Globe className="w-3.5 h-3.5 text-teal-300" />
              <span>{locale === 'en' ? 'اردو' : 'English'}</span>
            </button>

            {/* Red Emergency Button (Always Visible) */}
            <Link
              href="/emergency"
              className="btn-emergency flex items-center gap-1.5 text-sm uppercase tracking-wider animate-pulse hover:animate-none"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{t('emergency')}</span>
            </Link>

            {/* Auth States */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/10 rtl:border-r rtl:border-l-0 rtl:pr-2">
                <Link
                  href="/app/settings"
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  title={t('settings')}
                >
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs bg-white/10 hover:bg-white/20 text-gray-200 px-2.5 py-1.5 rounded-md font-medium transition-colors"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-semibold bg-[#0E9F8E] hover:bg-[#0B8274] text-white px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
                >
                  {t('signup')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Emergency trigger */}
          <div className="flex md:hidden items-center space-x-2 rtl:space-x-reverse">
            <Link
              href="/emergency"
              className="bg-[#DC2626] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>15</span>
            </Link>

            <button
              onClick={() => setLocale(locale === 'en' ? 'ur' : 'en')}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-white/10 text-white"
            >
              {locale === 'en' ? 'اردو' : 'EN'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 space-y-2">
            <Link
              href="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-white/10"
            >
              {t('dashboard')}
            </Link>
            <Link
              href="/app/drafts"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-white/10"
            >
              {t('drafts')}
            </Link>
            <Link
              href="/app/history"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-white/10"
            >
              {t('history')}
            </Link>
            <Link
              href="/emergency"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-red-300 hover:bg-red-950/40"
            >
              {t('emergency')}
            </Link>

            <div className="pt-2 border-t border-white/10">
              {user ? (
                <>
                  <Link
                    href="/app/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-white/10"
                  >
                    {t('settings')}
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left rtl:text-right px-3 py-2 rounded-lg text-base font-medium text-gray-400 hover:bg-white/10"
                  >
                    {t('logout')}
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 rounded-lg bg-white/10 text-white font-medium"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 rounded-lg bg-[#0E9F8E] text-white font-medium"
                  >
                    {t('signup')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
