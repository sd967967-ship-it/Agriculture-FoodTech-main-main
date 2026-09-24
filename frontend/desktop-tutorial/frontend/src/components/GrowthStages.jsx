import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const copy = {
  en: { caption: 'From seed to harvest', stages: ['Seed', 'Sprout', 'Growing', 'Flowering', 'Fruiting'], label: 'Crop growth stages: seed to fruiting plant' },
  bn: { caption: 'বীজ থেকে ফসল', stages: ['বীজ', 'চারা', 'বৃদ্ধি', 'ফুল', 'ফল'], label: 'ফসলের বৃদ্ধির ধাপ: বীজ থেকে ফলন্ত গাছ' },
  hi: { caption: 'बीज से फसल', stages: ['बीज', 'अंकुर', 'बढ़वार', 'फूल', 'फल'], label: 'फसल वृद्धि चरण: बीज से फलता पौधा' },
};

function StageArt({ stage }) {
  const leaf = '#4ade80';
  const leafDeep = '#16a34a';
  const stem = '#22c55e';
  const soil = '#8a5a2b';
  return (
    <svg viewBox="0 0 64 64" width="52" height="52" aria-hidden="true">
      {/* soil */}
      <ellipse cx="32" cy="54" rx="22" ry="6" fill={soil} opacity="0.85" />
      <ellipse cx="32" cy="52" rx="16" ry="4" fill="#a06a35" opacity="0.9" />
      {stage >= 1 && (
        <g className="gs-sway">
          {/* stem */}
          <path d={`M32 52 ${stage >= 2 ? 'V26' : 'V36'}`} stroke={stem} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* leaves */}
          <ellipse cx="24" cy={stage >= 2 ? 36 : 42} rx="8" ry="4" fill={leaf} transform={`rotate(-28 24 ${stage >= 2 ? 36 : 42})`} />
          <ellipse cx="40" cy={stage >= 2 ? 36 : 42} rx="8" ry="4" fill={leaf} transform={`rotate(28 40 ${stage >= 2 ? 36 : 42})`} />
          {stage >= 2 && (
            <>
              <ellipse cx="23" cy="28" rx="7" ry="3.6" fill={leafDeep} transform="rotate(-28 23 28)" />
              <ellipse cx="41" cy="28" rx="7" ry="3.6" fill={leafDeep} transform="rotate(28 41 28)" />
            </>
          )}
          {stage >= 3 && (
            <g>
              <circle cx="32" cy="22" r="4.5" fill="#f9a8d4" />
              <circle cx="24" cy="26" r="3.4" fill="#fde047" />
              <circle cx="40" cy="26" r="3.4" fill="#f9a8d4" />
              <circle cx="32" cy="22" r="1.6" fill="#fff7ed" />
            </g>
          )}
          {stage >= 4 && (
            <g>
              <circle cx="25" cy="30" r="5" fill="#f87171" />
              <circle cx="39" cy="30" r="5" fill="#fb923c" />
              <circle cx="32" cy="38" r="5" fill="#ef4444" />
              <circle cx="25" cy="30" r="1.5" fill="#fecaca" />
              <circle cx="39" cy="30" r="1.5" fill="#fed7aa" />
            </g>
          )}
        </g>
      )}
      {stage === 0 && (
        <g>
          <ellipse cx="32" cy="46" rx="7" ry="9" fill="#b07a3f" transform="rotate(18 32 46)" />
          <path d="M32 38 Q34 44 33 50" stroke="#7c4a21" strokeWidth="1.6" fill="none" />
          <circle cx="29" cy="43" r="1.4" fill="#e9c48a" />
        </g>
      )}
    </svg>
  );
}

/**
 * Seed → harvest strip: five hand-drawn stages lighting up in sequence.
 * JS only advances the active step (paused off-screen / tab-hidden /
 * reduced-motion); all motion is transform/opacity.
 */
export default function GrowthStages() {
  const { language } = useLanguage();
  const t = copy[language] || copy.en;
  const [active, setActive] = useState(0);
  const [staticAll, setStaticAll] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStaticAll(true);
      return;
    }
    let timer = 0;
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !timer) {
          timer = window.setInterval(() => setActive((a) => (a + 1) % 5), 1400);
        } else if (!visible && timer) {
          window.clearInterval(timer);
          timer = 0;
        }
      },
      { threshold: 0.2 },
    );
    const onVis = () => {
      if (document.hidden && timer) { window.clearInterval(timer); timer = 0; }
      else if (!document.hidden && visible && !timer) {
        timer = window.setInterval(() => setActive((a) => (a + 1) % 5), 1400);
      }
    };
    if (ref.current) io.observe(ref.current);
    document.addEventListener('visibilitychange', onVis);
    timer = window.setInterval(() => setActive((a) => (a + 1) % 5), 1400);
    return () => {
      window.clearInterval(timer);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div ref={ref} role="img" aria-label={t.label} className="mx-auto mt-10 max-w-2xl">
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-200/70">{t.caption}</p>
      <div className="relative mt-4">
        <div className="absolute left-8 right-8 top-6 h-0.5 rounded-full bg-white/10" aria-hidden="true">
          <div
            className="h-full rounded-full bg-gradient-to-r from-lime-300 via-emerald-400 to-amber-300 transition-all duration-700"
            style={{ width: staticAll ? '100%' : `${(active / 4) * 100}%` }}
          />
        </div>
        <ol className="relative flex items-start justify-between gap-1">
          {t.stages.map((label, i) => (
            <li
              key={label}
              className={`gs-stage flex flex-1 flex-col items-center gap-1.5 ${staticAll || i <= active ? 'is-on' : ''}`}
            >
              <span className="gs-dot" aria-hidden="true">{i + 1}</span>
              <StageArt stage={i} />
              <span className="text-center text-xs font-bold leading-4">{label}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
