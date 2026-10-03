'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Scale,
  Shield,
  ArrowRight,
  Send,
  Lock,
  PhoneCall,
  CheckCircle2,
  FileText,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import ScenarioCard from '@/components/ScenarioCard';
import ActionBrief from '@/components/ActionBrief';
import AgentSteps from '@/components/AgentSteps';

export default function LandingPage() {
  const { t, isUrdu } = useLanguage();
  const router = useRouter();

  const [inputMessage, setInputMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseContent, setResponseContent] = useState('');
  const [responseSources, setResponseSources] = useState<any[]>([]);

  const handlePromptSelect = (prompt: string, category: string) => {
    setInputMessage(prompt);
    setSelectedCategory(category);
    // Scroll smoothly to query box
    const el = document.getElementById('consultation-box');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    setIsLoading(true);
    setResponseContent('');
    setResponseSources([]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          category: selectedCategory,
          language: isUrdu ? 'ur' : 'en',
        }),
      });

      if (!res.ok) {
        throw new Error('Consultation request failed');
      }

      // Read legal sources from response headers
      const sourcesHeader = res.headers.get('X-Legal-Sources');
      if (sourcesHeader) {
        try {
          const parsed = JSON.parse(decodeURIComponent(sourcesHeader));
          setResponseSources(parsed);
        } catch (e) {
          console.error(e);
        }
      }

      // Stream assistant response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      let accumulated = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setResponseContent(accumulated);
      }
    } catch (err: any) {
      setResponseContent(
        '⚠️ Error retrieving legal brief. Please check your network or try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F2A4A] via-[#163A63] to-[#0F2A4A] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-6 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>
              {isUrdu ? 'پاکستانی قانون کا خودکار قانونی معاون' : 'Agentic AI Legal Guardian for Pakistan'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
            {t('heroHeading')}
          </h1>

          <p className="text-base sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed mb-8">
            {t('heroSubheading')}
          </p>

          {/* Quick CTA row */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <a
              href="#consultation-box"
              className="btn-primary text-sm sm:text-base flex items-center gap-2 px-6 py-3"
            >
              <span>{t('tryWithoutLogin')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </a>

            <Link
              href="/emergency"
              className="btn-emergency text-sm sm:text-base flex items-center gap-2 px-6 py-3"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{t('emergency')}</span>
            </Link>
          </div>
        </div>

        {/* Interactive Instant Consultation Input Box */}
        <div id="consultation-box" className="max-w-3xl mx-auto mt-2 relative z-20">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 text-gray-900 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-teal-600" />
                {isUrdu ? 'براہ راست قانونی رہنمائی حاصل کریں' : 'Instant Confidential Legal Brief'}
              </span>
              {selectedCategory && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                  {t(`categories.${selectedCategory}`)}
                </span>
              )}
            </div>

            <form onSubmit={handleAsk} className="space-y-3">
              <div className="relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={t('home.promptPlaceholder')}
                  rows={3}
                  maxLength={2000}
                  className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition text-sm sm:text-base resize-none text-gray-800 placeholder-gray-400"
                />
                <div className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3 text-[11px] text-gray-400">
                  {inputMessage.length}/2000
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Lock className="w-3.5 h-3.5 text-teal-600" />
                  <span>{isUrdu ? '100% پرائیویٹ • مصدقہ قانون' : '100% Private • Pakistani Statutes'}</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="btn-primary flex items-center gap-2 text-xs sm:text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 rtl:rotate-180" />
                  <span>{isLoading ? (isUrdu ? 'جائزہ لیا جا رہا ہے...' : 'Analyzing Law...') : t('home.send')}</span>
                </button>
              </div>
            </form>

            {/* Agent Steps strip while AI reasoning */}
            <AgentSteps isLoading={isLoading} />

            {/* Render ActionBrief if response is streaming or generated */}
            {responseContent && (
              <div className="mt-6 pt-6 border-t border-gray-200 animate-in fade-in duration-300">
                <ActionBrief
                  content={responseContent}
                  sources={responseSources}
                  category={selectedCategory || undefined}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4 Core Scenarios Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2A4A] tracking-tight">
            {isUrdu ? 'آپ کو اپنا وکیل کی ضرورت کب پیش آتی ہے؟' : 'When Do You Need Apna Wakil AI?'}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            {isUrdu
              ? 'چار بنیادی نازک حالات جن میں عام شہریوں کو فوری قانونی رہنمائی درکار ہوتی ہے۔'
              : 'Four critical scenarios where ordinary citizens lack immediate legal guidance.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScenarioCard id="police" onSelectPrompt={handlePromptSelect} />
          <ScenarioCard id="business" onSelectPrompt={handlePromptSelect} />
          <ScenarioCard id="women" onSelectPrompt={handlePromptSelect} />
          <ScenarioCard id="cyber" onSelectPrompt={handlePromptSelect} />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-14 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              {isUrdu ? 'طریقہ کار' : '3-Step Protocol'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2A4A] mt-1">
              {isUrdu ? 'یہ کیسے کام کرتا ہے؟' : 'How Apna Wakil Protects You'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-2">
                {isUrdu ? '1. بتائیں کیا ہوا ہے' : '1. Explain What Happened'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {isUrdu
                  ? 'بغیر کسی قانونی اصطلاح کے، اردو یا انگریزی میں اپنی صورتحال بیان کریں۔'
                  : 'Type your situation in plain English, Urdu, or Roman Urdu with zero legal jargon.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-2">
                {isUrdu ? '2. وکیل اے آئی قانون کھنگالتا ہے' : '2. Agent Retrieves Relevant Law'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {isUrdu
                  ? 'آئین، ضابطہ فوجداری (CrPC)، تعزیرات (PPC) اور پیکا (PECA) کی مصدقہ دفعات حاصل ہوتی ہیں۔'
                  : 'Autonomous RAG scans vetted Pakistani statutes to ground every step in genuine law.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-2">
                {isUrdu ? '3. ایکشن بریف اور الفاظ حاصل کریں' : '3. Get Your Action Plan & Script'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {isUrdu
                  ? 'منہ سے کیا بولنا ہے، کیا کرنا ہے، کن باتوں سے بچنا ہے اور درخواست ڈاؤن لوڈ کریں۔'
                  : 'Exact words to say, emergency helplines to dial, and copyable legal drafts.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Callout Strip */}
      <section className="bg-red-50 border-t border-red-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left rtl:sm:text-right">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-red-950 text-sm sm:text-base">
                {isUrdu ? 'فوری جسمانی خطرہ یا تشدد؟' : 'Facing Immediate Danger or Violence?'}
              </h4>
              <p className="text-xs text-red-700">
                {isUrdu
                  ? 'پہلے محفوظ جگہ پہنچیں اور فوری پولیس ایمرجنسی 15 پر رابطہ کریں۔'
                  : 'Do not wait for chat. Get to safety and dial Police Helpline 15 immediately.'}
              </p>
            </div>
          </div>

          <Link
            href="/emergency"
            className="btn-emergency text-xs sm:text-sm px-5 py-2.5 whitespace-nowrap"
          >
            <PhoneCall className="w-4 h-4 mr-1.5" />
            <span>{isUrdu ? 'تمام ایمرجنسی نمبرز دیکھیں' : 'View Pakistan Helplines'}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
