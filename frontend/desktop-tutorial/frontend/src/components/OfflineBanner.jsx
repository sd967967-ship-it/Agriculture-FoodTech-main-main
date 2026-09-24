import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const copy = {
  en: { offline: 'You are offline.', detail: 'Saved records and tools on this device still work. Diagnosis needs internet.' },
  bn: { offline: 'আপনি অফলাইনে আছেন।', detail: 'এই ডিভাইসে সংরক্ষিত তথ্য ও সরঞ্জাম চলবে। রোগ নির্ণয়ে ইন্টারনেট লাগবে।' },
  hi: { offline: 'आप ऑफ़लाइन हैं।', detail: 'इस डिवाइस पर सहेजे रिकॉर्ड और उपकरण चलेंगे। जाँच के लिए इंटरनेट चाहिए।' },
};

/** Non-blocking connectivity banner for unstable field networks. */
export default function OfflineBanner() {
  const { language } = useLanguage();
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  const text = copy[language] || copy.en;

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);

  if (online) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="offline-banner fixed inset-x-0 bottom-20 z-[1150] mx-auto w-[calc(100%-2rem)] max-w-xl rounded-2xl border border-amber-400/50 bg-[#231603] px-4 py-3 shadow-2xl md:bottom-8"
    >
      <p className="flex items-center gap-2 text-sm font-bold text-amber-200">
        <span aria-hidden="true">📡</span> {text.offline}
      </p>
      <p className="mt-1 text-[13px] leading-5 text-amber-100/85">{text.detail}</p>
    </div>
  );
}
