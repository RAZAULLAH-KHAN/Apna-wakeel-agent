'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, ShieldCheck, Lock, BookOpen } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function Footer() {
  const { t, isUrdu } = useLanguage();

  return (
    <footer className="bg-[#0F2A4A] text-gray-300 border-t border-[#163A63] mt-auto">
      {/* Trust Bar */}
      <div className="border-b border-[#163A63] py-6 bg-[#0A1C33]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left rtl:md:text-right">
            <div className="flex items-center justify-center md:justify-start rtl:md:justify-end gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold">
                  {isUrdu ? 'پاکستانی قوانین پر مبنی' : 'Pakistani Law Corpus'}
                </h4>
                <p className="text-xs text-gray-400">
                  {isUrdu ? 'آئینِ پاکستان، ضابطہ فوجداری، تعزیراتِ پاکستان اور پیکا' : 'Constitution 1973, CrPC 1898, PPC 1860, PECA 2016'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start rtl:md:justify-end gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold">
                  {isUrdu ? 'مستند قانونی حوالہ جات' : 'Grounded Legal Citations'}
                </h4>
                <p className="text-xs text-gray-400">
                  {isUrdu ? 'ہر جواب میں متعلقہ دفعات کے تصدیق شدہ حوالے' : 'Accurate section citations retrieved via AI RAG'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start rtl:md:justify-end gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold">
                  {isUrdu ? 'مکمل رازداری' : 'Confidential & Private'}
                </h4>
                <p className="text-xs text-gray-400">
                  {isUrdu ? 'آپ کا ڈیٹا محفوظ اور آپ کی اجازت کے بغیر شیئر نہیں کیا جاتا' : 'Strict user isolation & RLS data protection'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Legal Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-[#0E9F8E]" />
            <span className="font-bold text-lg text-white">Apna Wakil AI (اپنا وکیل)</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/" className="hover:text-teal-400 transition-colors">
              {t('dashboard')}
            </Link>
            <Link href="/emergency" className="text-red-400 hover:text-red-300 transition-colors font-medium">
              {t('emergency')}
            </Link>
            <Link href="/terms" className="hover:text-teal-400 transition-colors">
              Terms of Use
            </Link>
            <Link href="/privacy" className="hover:text-teal-400 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Mandatory Legal Disclaimer */}
        <div className="mt-8 pt-6 border-t border-[#163A63]/60 text-center">
          <p className="text-xs leading-relaxed text-gray-400 max-w-4xl mx-auto">
            {t('brief.disclaimer')}
          </p>
          <p className="text-[11px] text-gray-500 mt-3">
            © {new Date().getFullYear()} Apna Wakil AI. Built for the Agentic AI Hackathon.
          </p>
        </div>
      </div>
    </footer>
  );
}
