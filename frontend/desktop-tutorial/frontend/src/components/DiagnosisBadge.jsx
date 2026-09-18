import React from 'react';

export default function DiagnosisBadge({ type, language = 'en' }) {
  const isDefinitive = type === "DEFINITIVE_DIAGNOSIS";
  const isNotMatched = type === "IMAGE_NOT_MATCHED";
  const labels = {
    en: { unmatched: 'Image Not Matched', definitive: 'Definitive Diagnosis', advisory: 'Advisory Support' },
    bn: { unmatched: 'ছবির সাথে মিল পাওয়া যায়নি', definitive: 'নিশ্চিত শনাক্তকরণ', advisory: 'পরামর্শমূলক সহায়তা' },
    hi: { unmatched: 'छवि का मिलान नहीं हुआ', definitive: 'निश्चित पहचान', advisory: 'सलाहकारी सहायता' },
  }[language] || { unmatched: 'Image Not Matched', definitive: 'Definitive Diagnosis', advisory: 'Advisory Support' };

  return (
    <div 
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm ${
        isNotMatched
          ? 'border border-red-500/30 bg-red-950/40 text-red-100'
          : isDefinitive
          ? 'border border-emerald-500/30 bg-emerald-950/40 text-emerald-100'
          : 'border border-amber-500/30 bg-amber-950/30 text-amber-100'
      }`}
    >
      {isNotMatched ? (
        <>
          <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86l-8.1 14A2 2 0 003.92 21h16.16a2 2 0 001.73-3.14l-8.1-14a2 2 0 00-3.42 0z" />
          </svg>
          {labels.unmatched}
        </>
      ) : isDefinitive ? (
        <>
          <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {labels.definitive}
        </>
      ) : (
        <>
          <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {labels.advisory}
        </>
      )}
    </div>
  );
}
