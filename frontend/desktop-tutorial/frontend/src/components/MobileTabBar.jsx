import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const tabs = (t) => [
  { to: '/', label: t.home, icon: '🏠' },
  { to: '/diagnose', label: t.diagnose, icon: '🔍' },
  { to: '/kisanmitra', label: t.mitra, icon: '🤖' },
  { to: '/tools', label: t.tools, icon: '🧰' },
  { to: '/profile', label: t.profile, icon: '👤' },
];

const copy = {
  en: { home: 'Home', diagnose: 'Check Crop', mitra: 'Ask Mitra', tools: 'Tools', profile: 'Profile', nav: 'Main navigation' },
  bn: { home: 'হোম', diagnose: 'ফসল দেখুন', mitra: 'মিত্রকে জিজ্ঞাসা', tools: 'সরঞ্জাম', profile: 'প্রোফাইল', nav: 'প্রধান মেনু' },
  hi: { home: 'होम', diagnose: 'फसल देखें', mitra: 'मित्र से पूछें', tools: 'उपकरण', profile: 'प्रोफ़ाइल', nav: 'मुख्य मेनू' },
};

/**
 * One-hand bottom tab bar for phones: the 5 daily tasks, thumb-reachable,
 * 56px+ targets, always-visible active state. Hidden on desktop (md+).
 */
export default function MobileTabBar() {
  const { language } = useLanguage();
  const t = copy[language] || copy.en;
  return (
    <nav aria-label={t.nav} className="mtabbar fixed inset-x-0 bottom-0 z-[1150] border-t border-lime-200/15 bg-[#050f0b] md:hidden">
      <div className="grid grid-cols-5">
        {tabs(t).map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            aria-label={tab.label}
            className={({ isActive }) => `flex min-h-[60px] flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-bold transition-colors ${
              isActive ? 'text-lime-300' : 'text-emerald-100/70'
            }`}
          >
            {({ isActive }) => (
              <>
                <span aria-hidden="true" className={`text-[22px] leading-none ${isActive ? 'drop-shadow-[0_0_10px_rgba(190,242,100,.6)]' : ''}`}>{tab.icon}</span>
                <span className="leading-tight">{tab.label}</span>
                <span aria-hidden="true" className={`h-1 w-8 rounded-full ${isActive ? 'bg-lime-300' : 'bg-transparent'}`} />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
