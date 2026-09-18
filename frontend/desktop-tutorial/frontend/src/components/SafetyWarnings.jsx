import React from 'react';

export default function SafetyWarnings({ warnings, language = 'en' }) {
  if (!warnings || warnings.length === 0) return null;
  const title = { en: 'Safety Warnings', bn: 'নিরাপত্তা সতর্কতা', hi: 'सुरक्षा चेतावनियाँ' }[language] || 'Safety Warnings';

  return (
    <div className="mb-6 overflow-hidden rounded-[1.25rem] border border-amber-500/20 bg-[linear-gradient(180deg,rgba(42,27,12,0.92),rgba(26,19,9,0.96))] shadow-[0_10px_18px_rgba(0,0,0,0.18)]">
      <div className="flex items-center gap-3 border-b border-amber-400/20 bg-amber-500/10 px-5 py-4">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-500/10 text-xl">⚠️</span>
        <h3 className="text-lg font-bold text-amber-100">{title}</h3>
      </div>
      <ul className="space-y-2 px-5 py-4">
        {warnings.map((warning, idx) => (
          <li key={idx} className="text-sm leading-6 text-amber-100/90">
            {warning}
          </li>
        ))}
      </ul>
    </div>
  );
}
