import React from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-teal-700"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="card-elevated p-6 sm:p-10 bg-white space-y-6 text-gray-800 leading-relaxed">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <Lock className="w-8 h-8 text-teal-600" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2A4A]">Privacy Policy & Data Commitments</h1>
            <p className="text-xs text-gray-500">Security & Trust First</p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0F2A4A]">1. What We Collect</h2>
          <p className="text-sm text-gray-600">
            We collect your account email address (for authentication) and user-submitted scenario descriptions to generate your step-by-step action brief and preserve your history.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0F2A4A]">2. What We NEVER Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <ShieldCheck className="w-5 h-5 text-teal-600 mb-1" />
              <h3 className="font-bold text-sm text-gray-900">No Selling of Data</h3>
              <p className="text-xs text-gray-500 mt-1">We never sell, rent, or trade your consultation records or personal identity.</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <ShieldCheck className="w-5 h-5 text-teal-600 mb-1" />
              <h3 className="font-bold text-sm text-gray-900">No AI Model Training</h3>
              <p className="text-xs text-gray-500 mt-1">Your sensitive private circumstances are never used to train public foundation models.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0F2A4A]">3. Data Deletion Right</h2>
          <p className="text-sm text-gray-600">
            You maintain absolute control over your information. At any moment, you can visit <strong>Settings &gt; Danger Zone</strong> and permanently erase your account, all consultation records, and chat transcripts instantly.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0F2A4A]">4. User Advisory</h2>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
            <strong>Safety Tip:</strong> When describing situations to AI tools, do not share unnecessary National Identity Card (CNIC) numbers, banking passwords, credit card numbers, or full home addresses.
          </div>
        </section>
      </div>
    </div>
  );
}
