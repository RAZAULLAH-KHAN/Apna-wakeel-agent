'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Scale, Lock, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import ActionBrief from '@/components/ActionBrief';
import AgentSteps from '@/components/AgentSteps';

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t, isUrdu } = useLanguage();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string; sources?: any[] }>
  >([]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage;
    setInputMessage('');
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          conversationId: id,
          language: isUrdu ? 'ur' : 'en',
        }),
      });

      if (!res.ok) throw new Error('Chat failed');

      let parsedSources: any[] = [];
      const sourcesHeader = res.headers.get('X-Legal-Sources');
      if (sourcesHeader) {
        try {
          parsedSources = JSON.parse(decodeURIComponent(sourcesHeader));
        } catch (e) {
          console.error(e);
        }
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      let assistantText = '';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '', sources: parsedSources },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: assistantText,
            sources: parsedSources,
          };
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-teal-700"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{isUrdu ? 'واپس جائیں' : 'Back to Home'}</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-gray-700">
            {isUrdu ? 'وکیل اے آئی فعال ہے' : 'Apna Wakil Active'}
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 space-y-6 overflow-y-auto mb-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center mb-3">
              <Scale className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-1">
              {isUrdu ? 'اپنی صورتحال بیان کریں' : 'Describe Your Situation'}
            </h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {isUrdu
                ? 'پولیس طلبی، رشوت کی دھمکی، ہراسانی یا سائبر بلیک میلنگ کی تفصیل نیچے لکھیں۔'
                : 'Share details of police summons, extortion, harassment, or cyber threats below.'}
            </p>
          </div>
        ) : (
          messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                m.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {m.role === 'user' ? (
                <div className="max-w-[85%] rounded-2xl rounded-tr-none px-4 py-3 bg-[#0E9F8E] text-white text-sm shadow-sm">
                  {m.content}
                </div>
              ) : (
                <div className="w-full">
                  <ActionBrief content={m.content} sources={m.sources} />
                </div>
              )}
            </div>
          ))
        )}

        <AgentSteps isLoading={isLoading} />
      </div>

      {/* Sticky Bottom Input Bar */}
      <div className="sticky bottom-4 bg-white p-3 rounded-2xl shadow-xl border border-gray-200">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t('home.promptPlaceholder')}
            maxLength={2000}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-sm text-gray-800 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="btn-primary text-xs px-4 py-2.5 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed min-h-[42px]"
          >
            <Send className="w-3.5 h-3.5 rtl:rotate-180" />
            <span className="hidden sm:inline">{t('home.send')}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
