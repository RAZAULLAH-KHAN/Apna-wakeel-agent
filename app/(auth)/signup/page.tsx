'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Scale, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n';

export default function SignupPage() {
  const { t, isUrdu } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/app`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg(
          isUrdu
            ? 'اکاؤنٹ بن گیا ہے! براہ کرم اپنی ای میل میں تصدیقی لنک چیک کریں۔'
            : 'Account created! Please check your email inbox to verify your account.'
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating account.');
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
            {isUrdu ? 'نیا اکاؤنٹ بنائیں' : 'Create Free Account'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {isUrdu ? 'اپنے قانونی حقوق اور مشاورت کو محفوظ رکھنے کے لیے' : 'Join Apna Wakil AI for private legal guidance'}
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

        <form onSubmit={handleSignup} className="space-y-4">
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
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {isUrdu ? 'پاس ورڈ (کم از کم 6 حروف)' : 'Password (min. 6 characters)'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 rtl:left-auto rtl:right-3 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
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

          <div className="text-[11px] text-gray-500 leading-relaxed">
            {isUrdu ? 'رجسٹر ہونے پر آپ ہماری ' : 'By creating an account, you agree to our '}{' '}
            <Link href="/terms" className="text-teal-600 hover:underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-teal-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-sm mt-2"
          >
            {loading ? (isUrdu ? 'اکاؤنٹ بن رہا ہے...' : 'Creating account...') : (isUrdu ? 'رجسٹر ہوں' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-600">
          {isUrdu ? 'پہلے سے اکاؤنٹ ہے؟' : 'Already have an account?'}{' '}
          <Link href="/login" className="text-teal-600 font-semibold hover:underline">
            {isUrdu ? 'لاگ ان کریں' : 'Log in'}
          </Link>
        </div>
      </div>
    </div>
  );
}
