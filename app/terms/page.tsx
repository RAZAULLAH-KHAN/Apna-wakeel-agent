import React from 'react';
import Link from 'next/link';
import { Scale, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function TermsPage() {
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
          <Scale className="w-8 h-8 text-teal-600" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2A4A]">Terms of Service</h1>
            <p className="text-xs text-gray-500">Last updated: October 2026</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs sm:text-sm flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>CRITICAL STATUTORY NOTICE:</strong> Apna Wakil AI (اپنا وکیل) is an artificial intelligence legal guidance system. It is <strong>NOT</strong> a licensed advocate, legal practitioner, or law firm. Its guidance does not constitute legal representation, court appearance, or an advocate-client relationship under the Legal Practitioners and Bar Councils Act 1973.
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0F2A4A]">1. Scope of Guidance</h2>
          <p className="text-sm text-gray-600">
            Apna Wakil AI is designed to assist ordinary Pakistani citizens, street vendors, women, and cyber victims with basic procedural rights under the Constitution of Pakistan 1973, Code of Criminal Procedure 1898 (CrPC), Pakistan Penal Code 1860 (PPC), and Prevention of Electronic Crimes Act 2016 (PECA). All decisions must be vetted with a licensed advocate prior to formal court submissions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0F2A4A]">2. Prohibited Uses</h2>
          <p className="text-sm text-gray-600">
            Users are strictly forbidden from utilizing this service to:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            <li>Evade lawful arrest or official judicial warrants.</li>
            <li>Fabricate false First Information Reports (FIRs) or fabricate false evidence under Section 193 PPC.</li>
            <li>Harass, intimidate, or blackmail other individuals.</li>
            <li>Interfere with law enforcement officers acting within lawful authority.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0F2A4A]">3. Active Emergencies</h2>
          <p className="text-sm text-gray-600">
            If you are facing active violence, robbery in progress, or immediate physical assault, do not await AI text generation. Immediately contact Police Helpline 15 or proceed to the nearest police station or safe public facility.
          </p>
        </section>
      </div>
    </div>
  );
}
