'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Copy,
  Download,
  Check,
  Send,
  ArrowLeft,
  Shield,
  AlertCircle,
  Building2,
  Lock,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function DraftsPage() {
  const { t, isUrdu } = useLanguage();

  const [templateType, setTemplateType] = useState<'police_sho' | 'fia_cyber' | 'extortion_bribe'>('police_sho');
  const [formData, setFormData] = useState({
    applicantName: '',
    phone: '',
    cnic: '',
    cityStation: '',
    incidentDate: new Date().toISOString().split('T')[0],
    details: '',
    oppositeParty: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: templateType,
          fields: formData,
        }),
      });

      const data = await res.json();
      if (res.ok && data.draft) {
        setGeneratedDraft(data.draft);
        setTimeout(() => {
          const el = document.getElementById('draft-result');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedDraft], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${templateType}_application_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const templates = [
    {
      id: 'police_sho',
      title: isUrdu ? 'تھانے / ایس ایچ او کو درخواست' : 'Application to Police SHO',
      desc: isUrdu
        ? 'بغیر ایف آئی آر فون یا بلاوجہ طلبی پر تحریری ریکارڈ کی قانونی درخواست (CrPC 160)'
        : 'Request written grounds and FIR clarification for informal summons under Section 160 CrPC.',
      icon: Shield,
    },
    {
      id: 'fia_cyber',
      title: isUrdu ? 'ایف آئی اے سائبر کرائم شکایت' : 'FIA Cybercrime Complaint',
      desc: isUrdu
        ? 'آن لائن بلیک میلنگ، نجی تصاویر، دھمکیاں اور بھتہ خوری کے خلاف سرکاری شکایت (PECA)'
        : 'Formal complaint for online blackmail, leaked media, and cyber harassment under PECA 2016.',
      icon: Lock,
    },
    {
      id: 'extortion_bribe',
      title: isUrdu ? 'رشوت اور بھتہ خوری کی شکایت' : 'Bribe / Extortion Complaint',
      desc: isUrdu
        ? 'پولیس یا سرکاری اہلکاروں کی طرف سے رشوت یا دکان سیل کرنے کی دھمکی کے خلاف درخواست'
        : 'Report illegal gratification demands or threats against your business to SSP / Anti-Corruption.',
      icon: Building2,
    },
  ];

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
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2A4A] tracking-tight">
          {isUrdu ? 'قانونی درخواست اور شکایت جنریٹر' : 'Legal Application & Complaint Generator'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {isUrdu
            ? 'صرف بنیادی معلومات فراہم کریں اور قانونی دفعات کے تحت فوری دستخط کے لیے تیار درخواست حاصل کریں۔'
            : 'Fill a few simple fields to produce a copyable, downloadable formal complaint ready to print or submit.'}
        </p>
      </div>

      {/* Step 1: Choose Template */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
          {isUrdu ? 'مرحلہ 1: درخواست کی قسم منتخب کریں' : 'Step 1: Choose Template'}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((tmpl) => {
            const isSelected = templateType === tmpl.id;
            const Icon = tmpl.icon;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setTemplateType(tmpl.id as any)}
                className={`p-4 rounded-xl text-left rtl:text-right border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-teal-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-gray-900">{tmpl.title}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{tmpl.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Form */}
      <div className="card-elevated p-6 bg-white mb-8">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
          {isUrdu ? 'مرحلہ 2: بنیادی معلومات درج کریں' : 'Step 2: Enter Basic Particulars'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {isUrdu ? 'آپ کا مکمل نام *' : 'Applicant Full Name *'}
              </label>
              <input
                type="text"
                required
                value={formData.applicantName}
                onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                placeholder="e.g. Muhammad Ali Khan"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {isUrdu ? 'رابطہ فون نمبر *' : 'Phone Number *'}
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0300-1234567"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {isUrdu ? 'متعلقہ تھانہ یا شہر / ضلع *' : 'Police Station / Zone / City *'}
              </label>
              <input
                type="text"
                required
                value={formData.cityStation}
                onChange={(e) => setFormData({ ...formData, cityStation: e.target.value })}
                placeholder="e.g. Gulberg Police Station, Lahore"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {isUrdu ? 'واقعہ / طلبی کی تاریخ *' : 'Incident / Summons Date *'}
              </label>
              <input
                type="date"
                required
                value={formData.incidentDate}
                onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {isUrdu ? 'مخالف فریق یا ملوث اہلکار کا نام (اختیاری)' : 'Opposing Party / Officer Involved (Optional)'}
            </label>
            <input
              type="text"
              value={formData.oppositeParty}
              onChange={(e) => setFormData({ ...formData, oppositeParty: e.target.value })}
              placeholder="e.g. Sub-Inspector Ahmad / Unknown caller 0301-XXXXXXX"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {isUrdu ? 'واقعہ کی مختصر تفصیل *' : 'Summary of What Happened *'}
            </label>
            <textarea
              required
              rows={4}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder={
                isUrdu
                  ? 'مختصر بیان کریں کہ کیا کہا گیا یا کیا دھمکی دی گئی...'
                  : 'Briefly describe what was said, demanded, or threatened...'
              }
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="btn-primary w-full text-sm flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>{isGenerating ? (isUrdu ? 'درخواست تیار ہو رہی ہے...' : 'Generating Draft...') : (isUrdu ? 'قانونی درخواست تیار کریں' : 'Generate Formal Legal Draft')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Step 3: Result Preview & Download */}
      {generatedDraft && (
        <div id="draft-result" className="card-elevated p-6 bg-white border border-teal-200 shadow-lg animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                {isUrdu ? 'مرحلہ 3: تیار شدہ مسودہ' : 'Step 3: Ready Application Draft'}
              </span>
              <h3 className="font-bold text-gray-900 text-base">
                {isUrdu ? 'آپ کی سرکاری قانونی درخواست' : 'Your Ready Legal Document'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isUrdu ? 'کاپی ہو گیا' : 'Copied') : (isUrdu ? 'کاپی کریں' : 'Copy Text')}</span>
              </button>

              <button
                onClick={handleDownload}
                className="btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5 min-h-[36px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'ڈاؤن لوڈ (.txt)' : 'Download .txt'}</span>
              </button>
            </div>
          </div>

          {/* Legal Advisory Alert */}
          <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
            <span>
              {isUrdu
                ? 'اہم ہدایت: جمع کروانے سے پہلے متن کا بغور جائزہ لیں۔ قانونی کارروائی سے قبل کسی وکیل سے مشورہ ضروری ہے۔'
                : 'Advisory: Review all dates and facts before submitting. Consider consulting a licensed advocate before lodging formal proceedings.'}
            </span>
          </div>

          <textarea
            value={generatedDraft}
            onChange={(e) => setGeneratedDraft(e.target.value)}
            rows={16}
            className="w-full p-4 rounded-xl border border-gray-200 font-mono text-xs sm:text-sm leading-relaxed text-gray-800 bg-gray-50/50 focus:bg-white focus:border-teal-500 outline-none"
          />
        </div>
      )}
    </div>
  );
}
