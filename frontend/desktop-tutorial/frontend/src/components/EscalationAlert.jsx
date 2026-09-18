import React from 'react';

export default function EscalationAlert({ show, info, language = 'en' }) {
  if (!show || !info) return null;
  const labels = {
    en: { title: 'Expert Consultation Recommended', call: 'Call' },
    bn: { title: 'বিশেষজ্ঞের পরামর্শ নেওয়া প্রয়োজন', call: 'ফোন করুন' },
    hi: { title: 'विशेषज्ञ की सलाह आवश्यक है', call: 'फोन करें' },
  }[language] || { title: 'Expert Consultation Recommended', call: 'Call' };

  // Extremely basic phone number extraction
  const phonePattern = /(\+?\d{1,3}[\s-]?)?(\(?\d{3}\)?[\s-]?)?[\d\s-]{7,10}/g;
  const phones = info.match(phonePattern) || [];
  
  return (
    <div className="mb-6 overflow-hidden rounded-[1.25rem] border border-red-500/20 bg-[linear-gradient(180deg,rgba(39,17,17,0.95),rgba(25,12,12,0.97))] shadow-[0_10px_18px_rgba(0,0,0,0.18)]">
      <div className="flex items-center gap-3 border-b border-red-400/20 bg-red-500/10 px-5 py-4">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-red-500/10 text-xl">🚨</span>
        <h3 className="text-lg font-bold text-red-100">{labels.title}</h3>
      </div>
      <div className="px-5 py-4">
        <p className="whitespace-pre-line text-sm leading-6 text-red-100/90">
          {info}
        </p>

        {phones.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {phones.map((phone, idx) => {
              const cleanPhone = phone.replace(/[^\d+]/g, '');
              if (cleanPhone.length >= 10) {
                return (
                  <a 
                    key={idx} 
                    href={`tel:${cleanPhone}`}
                    className="inline-flex items-center rounded-full border border-red-400/30 bg-red-950/40 px-4 py-2 text-sm font-semibold text-red-100 transition-colors hover:bg-red-900/60"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {labels.call} {phone.trim()}
                  </a>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
