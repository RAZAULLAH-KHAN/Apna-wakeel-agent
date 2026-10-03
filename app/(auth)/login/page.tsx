'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n';

export default function LoginPage() {
  const { t, isUrdu } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.session) {
        router.push('/app');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md card-elevated p-6 sm:p-8 bg-white border border-gray-200">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#0F2A4A] text-teal-400 mx-auto flex items-center justify-center mb-3 shadow-md">
            <Scale className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isUrdu ? 'اپنا وکیل میں لاگ ان کریں' : 'Log in to Apna Wakil AI'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {isUrdu ? 'اپنی محفوظ قانونی مشاورت تک رسائی کے لیے' : 'Access your private legal consultations & drafts'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-700">
                {isUrdu ? 'پاس ورڈ' : 'Password'}
              </label>
              <Link href="/reset" className="text-xs text-teal-600 hover:underline">
                {isUrdu ? 'پاس ورڈ بھول گئے؟' : 'Forgot password?'}
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 rtl:left-auto rtl:right-3 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 rtl:pl-10 rtl:pr-9 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-teal-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 rtl:right-auto rtl:left-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-sm mt-2"
          >
            {loading ? (isUrdu ? 'لاگ ان ہو رہا ہے...' : 'Signing in...') : (isUrdu ? 'لاگ ان کریں' : 'Log in')}
          </button>

          {/* Quick Demo Credentials for Hackathon Evaluators */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setEmail('demo@apnawakil.ai');
                setPassword('Password123!');
              }}
              className="w-full py-2 px-3 rounded-lg border border-dashed border-teal-400 bg-teal-50/60 hover:bg-teal-50 text-teal-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>🚀 {isUrdu ? 'ڈیمو اکاؤنٹ سے خودکار لاگ ان کریں' : 'Quick Demo: Fill Test Account'}</span>
            </button>
            <div className="text-[11px] text-center text-gray-400 mt-1 font-mono">
              demo@apnawakil.ai / Password123!
            </div>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-600">
          {isUrdu ? 'اکاؤنٹ نہیں ہے؟' : "Don't have an account?"}{' '}
          <Link href="/signup" className="text-teal-600 font-semibold hover:underline">
            {isUrdu ? 'ابھی مفت رجسٹر ہوں' : 'Sign up free'}
          </Link>
        </div>
      </div>
    </div>
  );
}
