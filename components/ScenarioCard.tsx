'use client';

import React from 'react';
import { Shield, Store, UserCheck, Smartphone, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface ScenarioCardProps {
  id: 'police' | 'business' | 'women' | 'cyber';
  onSelectPrompt: (prompt: string, category: string) => void;
}

export default function ScenarioCard({ id, onSelectPrompt }: ScenarioCardProps) {
  const { t, isUrdu } = useLanguage();

  const configs = {
    police: {
      icon: Shield,
      bgIcon: 'bg-blue-500/10 text-blue-600 border-blue-200',
      title: t('scenarios.policeTitle'),
      desc: t('scenarios.policeDesc'),
      prompts: isUrdu
        ? [
            'تھانے سے رات کو فون آیا ہے، کوئی ایف آئی آر نہیں ہے',
            'پولیس بغیر وارنٹ کے گھر تلاشی لینے آ گئی ہے',
            'پولیس نے دوست کو بغیر وجہ بتائے حراست میں لے لیا ہے',
          ]
        : [
            'Police called me to station at night, no FIR exists',
            'Police asking to search my house without a warrant',
            'Friend detained by police for over 24 hours without court',
          ],
    },
    business: {
      icon: Store,
      bgIcon: 'bg-teal-500/10 text-teal-600 border-teal-200',
      title: t('scenarios.businessTitle'),
      desc: t('scenarios.businessDesc'),
      prompts: isUrdu
        ? [
            'پولیس اہلکار دکان پر چائے پانی اور رشوت مانگ رہا ہے',
            'بلدیاتی اہلکار بغیر چالان کے دکان سیل کرنے کی دھمکی دے رہا ہے',
            'پٹرولنگ پولیس ریڑھی لگانے پر پیسے مانگ رہی ہے',
          ]
        : [
            'Patrol police demanding cash / bribe from my shop',
            'Inspector threatening to seal shop without written challan',
            'Municipal staff demanding money from street vendor cart',
          ],
    },
    women: {
      icon: UserCheck,
      bgIcon: 'bg-rose-500/10 text-rose-600 border-rose-200',
      title: t('scenarios.womenTitle'),
      desc: t('scenarios.womenDesc'),
      prompts: isUrdu
        ? [
            'ایک شخص روزانہ راستے میں تعاقب اور چھیڑ چھاڑ کرتا ہے',
            'دفتر میں باس یا ساتھی ہراساں کر رہا ہے، کیا کروں؟',
            'پولیس والے نے خاتون کو رات کے وقت تھانے بلایا ہے',
          ]
        : [
            'Someone is stalking and following me on my daily commute',
            'Facing workplace harassment from a colleague / manager',
            'Police officer asking a woman to come to station at night',
          ],
    },
    cyber: {
      icon: Smartphone,
      bgIcon: 'bg-purple-500/10 text-purple-600 border-purple-200',
      title: t('scenarios.cyberTitle'),
      desc: t('scenarios.cyberDesc'),
      prompts: isUrdu
        ? [
            'کوئی واٹس ایپ پر نجی تصاویر لیک کرنے کی دھمکی دے رہا ہے',
            'فیس بک پر فیک اکاؤنٹ بنا کر پیسے مانگے جا رہے ہیں',
            'بلیک میلر کو پیسے نہ دینے پر کیا کرنا چاہیے؟',
          ]
        : [
            'Someone is blackmailing me with private photos on WhatsApp',
            'Fake social media account created with my face and name',
            'Blackmailer demanding crypto/money, how to report to FIA?',
          ],
    },
  };

  const item = configs[id];
  const Icon = item.icon;

  return (
    <div className="card-elevated p-5 sm:p-6 flex flex-col justify-between hover:border-teal-400 transition-all group bg-white">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.bgIcon}`}>
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
            {t(`categories.${id}`)}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
          {item.desc}
        </p>
      </div>

      <div>
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          {isUrdu ? 'فوری رہنمائی کے لیے کلک کریں:' : 'Instant Guided Starters:'}
        </div>
        <div className="space-y-1.5">
          {item.prompts.map((p, i) => (
            <button
              key={i}
              onClick={() => onSelectPrompt(p, id)}
              className="w-full text-left rtl:text-right px-3 py-2 rounded-lg text-xs bg-gray-50 hover:bg-teal-50 hover:text-teal-800 text-gray-700 border border-gray-100 hover:border-teal-200 transition-colors flex items-center justify-between group/chip"
            >
              <span className="truncate pr-2 rtl:pr-0 rtl:pl-2">"{p}"</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover/chip:text-teal-600 rtl:rotate-180 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
