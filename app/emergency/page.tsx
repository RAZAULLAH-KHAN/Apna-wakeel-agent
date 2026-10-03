'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PhoneCall, ShieldAlert, ExternalLink, ArrowLeft, Filter } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import contacts from '@/data/emergency_contacts.json';

export default function EmergencyPage() {
  const { t, isUrdu } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filtered = selectedFilter === 'all'
    ? contacts
    : contacts.filter((c) => c.category === selectedFilter || (selectedFilter === 'emergency' && c.urgency === 'critical'));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      {/* Top Banner */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{isUrdu ? 'مرکزی صفحہ پر واپس جائیں' : 'Back to Home'}</span>
        </Link>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5" />
          {isUrdu ? '24/7 تصدیق شدہ ہیلپ لائنز' : '24/7 Verified Helplines'}
        </span>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F2A4A] tracking-tight">
          {isUrdu ? 'پاکستان ایمرجنسی و قانونی ہیلپ لائنز' : 'Pakistan Emergency & Legal Helplines'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          {isUrdu
            ? 'کسی بھی ہنگامی صورتحال، پولیس زیادتی، سائبر کرائم یا قانونی مدد کے لیے ایک کلک پر کال کریں۔'
            : 'One-tap dialers for immediate police emergency, cybercrime rescue, women protection, and free legal aid.'}
        </p>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {[
          { id: 'all', label: isUrdu ? 'تمام نمبرز' : 'All Helplines' },
          { id: 'police', label: isUrdu ? 'پولیس' : 'Police' },
          { id: 'cyber', label: isUrdu ? 'سائبر کرائم (FIA)' : 'Cybercrime (FIA)' },
          { id: 'women', label: isUrdu ? 'خواتین کا تحفظ' : 'Women Protection' },
          { id: 'business', label: isUrdu ? 'اینٹی کرپشن' : 'Anti-Corruption' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedFilter === f.id
                ? 'bg-[#0F2A4A] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tap-to-Call Emergency Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filtered.map((item) => {
          const isCritical = item.urgency === 'critical';

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isCritical
                  ? 'bg-red-50/80 border-red-300 shadow-md ring-1 ring-red-200'
                  : 'bg-white border-gray-200 card-elevated'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                      isCritical
                        ? 'bg-red-600 text-white'
                        : 'bg-teal-50 text-teal-700 border border-teal-200'
                    }`}
                  >
                    {item.hours}
                  </span>

                  <span className="text-xs text-gray-500 font-medium">
                    {item.category.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                  {isUrdu ? item.name_ur : item.name}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  {isUrdu ? item.description_ur : item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                <a
                  href={`tel:${item.number}`}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-center flex items-center justify-center gap-2 transition-all shadow-sm ${
                    isCritical
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  <span className="text-sm">
                    {isUrdu ? 'ابھی کال ملائیں' : 'Dial Now'}: {item.display_number}
                  </span>
                </a>

                {item.website && (
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    title="Official Web Portal"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
