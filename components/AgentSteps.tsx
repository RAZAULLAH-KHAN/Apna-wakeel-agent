'use client';

import React, { useEffect, useState } from 'react';
import { Search, Brain, FileCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface AgentStepsProps {
  isLoading: boolean;
  onFinished?: () => void;
}

export default function AgentSteps({ isLoading }: AgentStepsProps) {
  const { t, isUrdu } = useLanguage();
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (!isLoading) {
      setActiveStep(3);
      return;
    }

    setActiveStep(1);
    const timer1 = setTimeout(() => {
      setActiveStep(2);
    }, 1200);

    const timer2 = setTimeout(() => {
      setActiveStep(3);
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  const steps = [
    { id: 1, label: t('agentSteps.step1'), icon: Brain },
    { id: 2, label: t('agentSteps.step2'), icon: Search },
    { id: 3, label: t('agentSteps.step3'), icon: FileCheck },
  ];

  return (
    <div className="w-full my-4 p-4 rounded-xl bg-gradient-to-r from-[#0F2A4A] to-[#163A63] text-white shadow-lg border border-teal-500/30 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
            {isUrdu ? 'وکیل اے آئی کارروائی' : 'Autonomous Agent Pipeline'}
          </span>
        </div>
        <span className="text-xs text-gray-300 flex items-center gap-1 font-mono">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
          {isUrdu ? 'تیاری جاری ہے...' : 'Processing...'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {steps.map((step) => {
          const isDone = activeStep > step.id;
          const isCurrent = activeStep === step.id;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-2.5 rounded-lg transition-all ${
                isCurrent
                  ? 'bg-teal-500/20 border border-teal-400/50 shadow-sm'
                  : isDone
                  ? 'bg-white/5 opacity-80'
                  : 'opacity-40'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDone
                    ? 'bg-teal-500 text-white'
                    : isCurrent
                    ? 'bg-teal-400 text-[#0F2A4A] animate-pulse'
                    : 'bg-white/10 text-gray-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              <span className="text-xs font-medium text-gray-100 leading-tight">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
