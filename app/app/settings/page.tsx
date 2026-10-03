'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, ArrowLeft, Trash2, Globe, Shield, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const { locale, setLocale, t, isUrdu } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.trim() !== 'DELETE') {
      setDeleteError(isUrdu ? 'تصدیق کے لیے "DELETE" ٹائپ کریں' : 'Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    try {
      const res = await fetch('/api/account/delete', { method: 'DELETE' });
      if (res.ok) {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = '/';
      } else {
        const data = await res.json();
        setDeleteError(data.error || 'Failed to delete account');
      }
    } catch (err: any) {
      setDeleteError(err.message || 'Error deleting account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      <div className="mb-6">
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{isUrdu ? 'واپس جائیں' : 'Back to Dashboard'}</span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2A4A] tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-teal-600" />
          <span>{isUrdu ? 'اکاؤنٹ سیٹنگز' : 'Account & Preferences'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {isUrdu
            ? 'زبان کی ترجیحات، پرائیویسی اور ڈیٹا کا کنٹرول۔'
            : 'Manage language preferences, privacy, and account data.'}
        </p>
      </div>

      {/* Language Preference Card */}
      <div className="card-elevated p-6 bg-white mb-6">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
          <Globe className="w-5 h-5 text-teal-600" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            {isUrdu ? 'زبان کا انتخاب' : 'Language Preference'}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setLocale('en')}
            className={`p-4 rounded-xl border text-center transition-all ${
              locale === 'en'
                ? 'bg-teal-50 border-teal-500 font-bold text-teal-900 ring-2 ring-teal-500/20'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            English (LTR)
          </button>

          <button
            onClick={() => setLocale('ur')}
            className={`p-4 rounded-xl border text-center transition-all font-semibold ${
              locale === 'ur'
                ? 'bg-teal-50 border-teal-500 font-bold text-teal-900 ring-2 ring-teal-500/20'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            اردو (RTL)
          </button>
        </div>
      </div>

      {/* Account Info */}
      <div className="card-elevated p-6 bg-white mb-6">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
          <Shield className="w-5 h-5 text-teal-600" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            {isUrdu ? 'اکاؤنٹ کی تفصیل' : 'Account Details'}
          </h2>
        </div>

        <div className="space-y-2 text-sm text-gray-700">
          <div>
            <span className="font-semibold">{isUrdu ? 'ای میل:' : 'Email:'}</span>{' '}
            <span className="text-gray-600">{user?.email || 'Logged in user'}</span>
          </div>
          <div>
            <span className="font-semibold">{isUrdu ? 'پرائیویسی سٹیٹس:' : 'Privacy Protection:'}</span>{' '}
            <span className="text-emerald-700 font-medium">Row-Level Security (RLS) Active</span>
          </div>
        </div>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="p-6 rounded-2xl bg-red-50 border border-red-200">
        <div className="flex items-center gap-2 mb-2 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-sm font-bold uppercase tracking-wider">
            {isUrdu ? 'اکاؤنٹ اور ڈیٹا کا خاتمہ' : 'Danger Zone: Delete Account'}
          </h2>
        </div>

        <p className="text-xs text-red-800 leading-relaxed mb-4">
          {isUrdu
            ? 'اکاؤنٹ حذف کرنے سے آپ کا تمام ڈیٹا، مشاورت کا ریکارڈ اور پیغامات مستقل طور پر ختم کر دیے جائیں گے۔ یہ عمل ناقابلِ واپسی ہے۔'
            : 'Deleting your account permanently removes all your saved consultations, messages, and profile records. This action cannot be undone.'}
        </p>

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-red-900">
            {isUrdu ? 'تصدیق کے لیے "DELETE" لکھیں:' : 'Type "DELETE" to confirm:'}
          </label>
          <input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="DELETE"
            className="w-full px-3.5 py-2 rounded-lg border border-red-300 text-sm focus:border-red-600 outline-none bg-white font-mono"
          />

          {deleteError && <div className="text-xs text-red-600 font-medium">{deleteError}</div>}

          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting || deleteConfirmText !== 'DELETE'}
            className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? (isUrdu ? 'حذف کیا جا رہا ہے...' : 'Purging Data...') : (isUrdu ? 'اکاؤنٹ اور ڈیٹا ہمیشہ کے لیے حذف کریں' : 'Permanently Delete My Account & Data')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
