'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Scale, Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n';

export default function ResetPasswordPage() {
  const { isUrdu } = useLanguage();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/app/settings`,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg(
          isUrdu
            ? 'پاس ورڈ کی بحالی کا لنک آپ کے ای میل پر بھیج دیا گیا ہے۔'
            : 'Password recovery email sent! Please check your inbox.'
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error requesting reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md card-elevated p-6 sm:p-8 bg-white border border-gray-200">
        <div className="mb-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-teal-700"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{isUrdu ? 'لاگ ان پر واپس جائیں' : 'Back to login'}</span>
          </Link>
        </div>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#0F2A4A] text-teal-400 mx-auto flex items-center justify-center mb-3 shadow-md">
            <Scale className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isUrdu ? 'پاس ورڈ تبدیل کریں' : 'Reset Password'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {isUrdu ? 'اپنا ای میل درج کریں تاکہ بحالی کا لنک بھیجا جا سکے' : 'Enter your email to receive recovery instructions'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-4 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-teal-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {isUrdu ? 'ای میل ایڈریس' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 rtl:left-auto rtl:right-3 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 rtl:pl-3.5 rtl:pr-9 rounded-lg border border-gray-200 text-sm focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-sm mt-2"
          >
            {loading ? (isUrdu ? 'بھیجا جا رہا ہے...' : 'Sending...') : (isUrdu ? 'بحالی کا لنک بھیجیں' : 'Send Recovery Link')}
          </button>
        </form>
      </div>
    </div>
  );
}
