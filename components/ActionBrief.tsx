'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  Scale,
  CheckCircle,
  MessageSquareQuote,
  AlertOctagon,
  PhoneCall,
  BookOpen,
  Copy,
  Check,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '@/lib/i18n';

interface ActionBriefProps {
  content: string;
  sources?: Array<{ law_name: string; section: string; similarity?: number }>;
  category?: string;
}

export default function ActionBrief({ content, sources, category }: ActionBriefProps) {
  const { t, isUrdu } = useLanguage();
  const [copied, setCopied] = useState(false);

  // Parse markdown content by '## ' headings
  const sections: { title: string; body: string }[] = [];
  const rawParts = content.split(/^##\s+/m);

  for (let i = 1; i < rawParts.length; i++) {
    const part = rawParts[i];
    const firstLineEnd = part.indexOf('\n');
    if (firstLineEnd !== -1) {
      const title = part.substring(0, firstLineEnd).trim();
      const body = part.substring(firstLineEnd).trim();
      sections.push({ title, body });
    } else {
      sections.push({ title: part.trim(), body: '' });
    }
  }

  // Find the "What To Say" section to enable script copying
  const whatToSaySection = sections.find(
    (s) =>
      s.title.toLowerCase().includes('say') ||
      s.title.toLowerCase().includes('الفاظ') ||
      s.title.toLowerCase().includes('script')
  );

  const handleCopyScript = () => {
    if (!whatToSaySection) return;
    navigator.clipboard.writeText(whatToSaySection.body.replace(/["*]/g, '').trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // If content is still streaming or doesn't have headers, render clean markdown
  if (sections.length < 2) {
    return (
      <div className="card-elevated p-6 space-y-4 text-gray-800 leading-relaxed bg-white">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  }

  const getSectionIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('calm') || lower.includes('پریشان')) return <HeartHandshake className="w-5 h-5 text-blue-600" />;
    if (lower.includes('right') || lower.includes('حقوق')) return <Scale className="w-5 h-5 text-teal-600" />;
    if (lower.includes('do now') || lower.includes('کرنا ہے')) return <CheckCircle className="w-5 h-5 text-emerald-600" />;
    if (lower.includes('say') || lower.includes('الفاظ')) return <MessageSquareQuote className="w-5 h-5 text-amber-600" />;
    if (lower.includes('not to do') || lower.includes('بچنا ہے')) return <AlertOctagon className="w-5 h-5 text-red-600" />;
    if (lower.includes('contact') || lower.includes('رابطہ')) return <PhoneCall className="w-5 h-5 text-indigo-600" />;
    return <BookOpen className="w-5 h-5 text-teal-700" />;
  };

  const getSectionBg = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('calm') || lower.includes('پریشان')) return 'bg-blue-50/70 border-blue-200';
    if (lower.includes('right') || lower.includes('حقوق')) return 'bg-teal-50/60 border-teal-200';
    if (lower.includes('do now') || lower.includes('کرنا ہے')) return 'bg-emerald-50/50 border-emerald-200';
    if (lower.includes('say') || lower.includes('الفاظ')) return 'bg-amber-50 border-amber-300 shadow-sm';
    if (lower.includes('not to do') || lower.includes('بچنا ہے')) return 'bg-red-50/70 border-red-200';
    if (lower.includes('contact') || lower.includes('رابطہ')) return 'bg-indigo-50/60 border-indigo-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="space-y-4 my-2">
      {/* 7 Structured Cards */}
      {sections.map((section, idx) => {
        const isScriptCard =
          section.title.toLowerCase().includes('say') ||
          section.title.toLowerCase().includes('الفاظ');

        return (
          <div
            key={idx}
            className={`p-4 md:p-5 rounded-2xl border transition-all ${getSectionBg(section.title)}`}
          >
            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-black/5">
              <div className="flex items-center gap-2.5">
                {getSectionIcon(section.title)}
                <h3 className="text-base font-bold text-gray-900 tracking-tight">
                  {section.title}
                </h3>
              </div>

              {isScriptCard && (
                <button
                  onClick={handleCopyScript}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-amber-200/70 hover:bg-amber-300 text-amber-900 transition-colors shadow-sm"
                  title="Copy this script to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-700" />
                      <span>{t('brief.copied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t('brief.copyScript')}</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed font-normal">
              <ReactMarkdown>{section.body}</ReactMarkdown>
            </div>
          </div>
        );
      })}

      {/* Grounded Sources Pill Chips */}
      {sources && sources.length > 0 && (
        <div className="p-4 rounded-xl bg-gray-100 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-teal-700" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              {t('brief.sources')}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {sources.map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white text-teal-900 border border-teal-200 shadow-2xs"
              >
                ⚖️ {s.law_name} {s.section ? `• ${s.section}` : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Post-Brief Quick Actions */}
      <div className="pt-2 flex flex-wrap items-center gap-3">
        <Link
          href={`/app/drafts${category ? `?category=${category}` : ''}`}
          className="btn-primary text-xs flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>{t('brief.draftComplaint')}</span>
        </Link>

        <Link
          href="/emergency"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-red-100 hover:bg-red-200 text-red-700 transition-colors border border-red-200"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{t('brief.viewHelplines')}</span>
        </Link>
      </div>

      {/* Mandatory Disclaimer under each brief */}
      <div className="text-[11px] text-gray-500 pt-2 border-t border-gray-200">
        ⚖️ {t('brief.disclaimer')}
      </div>
    </div>
  );
}
