'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '@/data/locales/en.json';
import ur from '@/data/locales/ur.json';

type Locale = 'en' | 'ur';

interface LanguageContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (keyPath: string) => string;
  isUrdu: boolean;
}

const translations: Record<Locale, any> = { en, ur };

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (k) => k,
  isUrdu: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const saved = localStorage.getItem('apna_wakil_lang') as Locale | null;
    if (saved === 'ur' || saved === 'en') {
      setLocaleState(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === 'ur' ? 'rtl' : 'ltr';
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('apna_wakil_lang', l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ur' ? 'rtl' : 'ltr';
  };

  const t = (keyPath: string): string => {
    const parts = keyPath.split('.');
    let cur = translations[locale];
    for (const p of parts) {
      if (!cur || typeof cur !== 'object') return keyPath;
      cur = cur[p];
    }
    return typeof cur === 'string' ? cur : keyPath;
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t,
        isUrdu: locale === 'ur',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
