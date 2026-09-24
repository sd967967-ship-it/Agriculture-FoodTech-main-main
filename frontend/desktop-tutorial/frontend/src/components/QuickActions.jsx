import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const copy = {
  en: { title: 'What do you want to do today?', items: [['🔍', 'Check my crop', 'Photo diagnosis with treatment advice', '/diagnose'], ['💰', 'Mandi prices', 'Today’s rates before you sell', '/tools'], ['🗺️', 'Pest alerts nearby', 'Hotspot map for your area', '/hotspots'], ['🤖', 'Ask KisanMitra', 'Farming questions, local answers', '/kisanmitra']] },
  bn: { title: 'আজ কী করতে চান?', items: [['🔍', 'ফসল পরীক্ষা', 'ছবি দিয়ে রোগ নির্ণয় ও চিকিৎসা', '/diagnose'], ['💰', 'বাজারদর', 'বিক্রির আগে আজকের দাম', '/tools'], ['🗺️', 'কাছের পোকার সতর্কতা', 'আপনার এলাকার হটস্পট মানচিত্র', '/hotspots'], ['🤖', 'কিষানমিত্রকে জিজ্ঞাসা', 'কৃষি প্রশ্ন, স্থানীয় উত্তর', '/kisanmitra']] },
  hi: { title: 'आज आप क्या करना चाहते हैं?', items: [['🔍', 'फसल जाँचें', 'तस्वीर से रोग पहचान व उपचार', '/diagnose'], ['💰', 'मंडी भाव', 'बेचने से पहले आज का भाव', '/tools'], ['🗺️', 'पास में कीट चेतावनी', 'आपके क्षेत्र का हॉटस्पॉट नक्शा', '/hotspots'], ['🤖', 'किसानमित्र से पूछें', 'खेती के सवाल, स्थानीय जवाब', '/kisanmitra']] },
};

/** Big one-tap shortcuts: the 4 daily jobs, reachable in one tap from home. */
export default function QuickActions() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = copy[language] || copy.en;
  return (
    <section aria-label={t.title} className="mx-auto max-w-7xl px-4 pt-6 sm:pt-8">
      <h2 className="text-base font-bold text-slate-100">{t.title}</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {t.items.map(([icon, title, desc, to]) => (
          <button
            key={to + title}
            type="button"
            onClick={() => navigate(to)}
            className="group min-h-[92px] rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-[#0d2b21] to-[#081711] p-4 text-left shadow-md transition-all hover:-translate-y-0.5 hover:border-lime-300/50 active:translate-y-0"
          >
            <span aria-hidden="true" className="text-3xl">{icon}</span>
            <span className="mt-2 block text-[15px] font-bold leading-5 text-white">{title}</span>
            <span className="mt-0.5 block text-xs leading-4 text-emerald-100/70">{desc}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
