'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { History, Trash2, ArrowLeft, MessageSquare, AlertCircle, PlusCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';

export default function HistoryPage() {
  const { t, isUrdu } = useLanguage();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setConversations(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(isUrdu ? 'کیا آپ اس گفتگو کو حذف کرنا چاہتے ہیں؟' : 'Are you sure you want to delete this consultation record?')) {
      return;
    }

    try {
      const supabase = createClient();
      await supabase.from('conversations').delete().eq('id', id);
      setConversations(conversations.filter((c) => c.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{isUrdu ? 'واپس جائیں' : 'Back to Dashboard'}</span>
        </Link>

        <Link
          href="/app"
          className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5 min-h-[36px]"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{isUrdu ? 'نیا سوال پوچھیں' : 'New Consultation'}</span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2A4A] tracking-tight flex items-center gap-2">
          <History className="w-7 h-7 text-amber-500" />
          <span>{isUrdu ? 'آپ کی محفوظ شدہ قانونی مشاورت' : 'Consultation History'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {isUrdu
            ? 'آپ کے تمام سابقہ سوالات اور موصولہ لائحہ عمل یہاں محفوظ ہیں۔'
            : 'Private record of your past legal briefs and guidance.'}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-gray-200 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="card-elevated p-12 text-center bg-white border border-gray-200">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {isUrdu ? 'کوئی سابقہ گفتگو موجود نہیں ہے' : 'No Consultations Yet'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6">
            {isUrdu
              ? 'جب آپ کسی قانونی معاملے پر رہنمائی حاصل کریں گے تو اس کا محفوظ ریکارڈ یہاں ظاہر ہوگا۔'
              : 'When you consult Apna Wakil AI with a scenario, your action brief will be saved here for quick reference.'}
          </p>
          <Link href="/app" className="btn-primary text-sm px-6 py-2.5">
            {isUrdu ? 'ابھی پہلا سوال پوچھیں' : 'Start Your First Consultation'}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((c) => (
            <div
              key={c.id}
              className="card-elevated p-4 sm:p-5 bg-white flex items-center justify-between gap-4 hover:border-teal-300 transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                    {c.category?.toUpperCase() || 'GENERAL'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                  {c.title || 'Legal Consultation'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
