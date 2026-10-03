'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  Send,
  Lock,
  FileText,
  History,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import ScenarioCard from '@/components/ScenarioCard';
import ActionBrief from '@/components/ActionBrief';
import AgentSteps from '@/components/AgentSteps';

export default function AppHomePage() {
  const { t, isUrdu } = useLanguage();

  const [inputMessage, setInputMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseContent, setResponseContent] = useState('');
  const [responseSources, setResponseSources] = useState<any[]>([]);

  const handlePromptSelect = (prompt: string, category: string) => {
    setInputMessage(prompt);
    setSelectedCategory(category);
    const el = document.getElementById('consult-area');
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

      if (!res.ok) throw new Error('Chat request failed');

      const sourcesHeader = res.headers.get('X-Legal-Sources');
      if (sourcesHeader) {
        try {
          const parsed = JSON.parse(decodeURIComponent(sourcesHeader));
          setResponseSources(parsed);
        } catch (e) {
          console.error(e);
        }
      }

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
      setResponseContent('⚠️ Error processing legal brief. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      {/* Greeting Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>{isUrdu ? 'فعال قانونی نگہبان' : 'Active Legal Guidance'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F2A4A] tracking-tight">
          {t('home.greeting')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {isUrdu
            ? 'کسی ایک صورتحال کا انتخاب کریں یا نیچے اپنی زبانی تفصیل لکھیں۔'
            : 'Select your emergency scenario below or type your situation for an instant action brief.'}
        </p>
      </div>

      {/* 4 Core Scenario Cards (2x2 on mobile, 4 columns on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <ScenarioCard id="police" onSelectPrompt={handlePromptSelect} />
        <ScenarioCard id="business" onSelectPrompt={handlePromptSelect} />
        <ScenarioCard id="women" onSelectPrompt={handlePromptSelect} />
        <ScenarioCard id="cyber" onSelectPrompt={handlePromptSelect} />
      </div>

      {/* Free Text Input Consultation Area */}
      <div id="consult-area" className="card-elevated p-5 sm:p-6 bg-white mb-8 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-teal-600" />
            {isUrdu ? 'قانونی سوال یا صورتحال لکھیں' : 'Consult Apna Wakil AI'}
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
              <span>{isUrdu ? 'مکمل رازدارانہ قانونی مشاورت' : 'Confidential Pakistani Legal Analysis'}</span>
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

        {/* Autonomous Agent Steps Strip */}
        <AgentSteps isLoading={isLoading} />

        {/* Action Brief Response */}
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

      {/* Secondary Quick Access Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/app/drafts"
          className="p-4 rounded-xl bg-white border border-gray-200 hover:border-teal-400 hover:shadow-sm transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">{t('home.draftLetter')}</h4>
            <p className="text-xs text-gray-500">{isUrdu ? 'ایس ایچ او، ایف آئی اے کی درخواست' : 'Police, FIA, Anti-corruption'}</p>
          </div>
        </Link>

        <Link
          href="/app/history"
          className="p-4 rounded-xl bg-white border border-gray-200 hover:border-teal-400 hover:shadow-sm transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">{t('home.pastChats')}</h4>
            <p className="text-xs text-gray-500">{isUrdu ? 'محفوظ شدہ مشاورت دیکھیں' : 'Review previous briefs'}</p>
          </div>
        </Link>

        <Link
          href="/emergency"
          className="p-4 rounded-xl bg-white border border-gray-200 hover:border-red-400 hover:shadow-sm transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">{t('home.emergencyHelplines')}</h4>
            <p className="text-xs text-gray-500">{isUrdu ? 'پولیس 15، ایف آئی اے 1991' : 'Police 15, FIA 1991, 1043'}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
