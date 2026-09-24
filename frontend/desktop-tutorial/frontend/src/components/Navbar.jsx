import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Logo from './Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [largeText, setLargeText] = useState(() => {
    try { return localStorage.getItem('fasal-textscale') === 'large'; } catch { return false; }
  });
  const moreRef = useRef(null);
  const location = useLocation();
  const { language, setLanguage, languages } = useLanguage();
  const labels = {
    en: ['Home', 'Diagnose', 'Pest Log', 'Hotspot Map', 'Official Dashboard', 'Tools', 'About', 'Profile'],
    bn: ['হোম', 'রোগ নির্ণয়', 'কীটপতঙ্গ লগ', 'হটস্পট মানচিত্র', 'সরকারি ড্যাশবোর্ড', 'সরঞ্জাম', 'সম্পর্কে', 'প্রোফাইল'],
    hi: ['होम', 'जाँच', 'कीट लॉग', 'हॉटस्पॉट नक्शा', 'सरकारी डैशबोर्ड', 'उपकरण', 'जानकारी', 'प्रोफ़ाइल']
  }[language] || ['Home', 'Diagnose', 'Pest Log', 'Hotspot Map', 'Official Dashboard', 'Tools', 'About', 'Profile'];

  // Same routes as before — visual upgrade only.
  const navLinks = [
    { path: '/', label: labels[0], icon: '🏠' },
    { path: '/diagnose', label: labels[1], icon: '🔍' },
    { path: '/admin/dashboard', label: labels[4], icon: '📊' },
  ];

  const moreLinks = [
    { path: '/pest-log', label: labels[2], icon: '🪤' },
    { path: '/hotspots', label: labels[3], icon: '🗺️' },
    { path: '/kisanmitra', label: language === 'bn' ? 'কিষানমিত্র' : language === 'hi' ? 'किसानमित्र' : 'KisanMitra', icon: '🤖' },
    { path: '/tools', label: labels[5], icon: '🧰' },
    { path: '/about', label: labels[6], icon: 'ℹ️' },
    { path: '/profile', label: labels[7], icon: '👤' },
  ];

  const isActive = (path) => location.pathname === path;

  // Large-text mode for older farmers / bright sunlight. Persisted.
  const toggleTextSize = () => {
    setLargeText((current) => {
      const next = !current;
      document.documentElement.classList.toggle('text-large', next);
      try { localStorage.setItem('fasal-textscale', next ? 'large' : 'normal'); } catch { /* ignore */ }
      return next;
    });
  };

  // Close the More menu on outside click / Escape so it never gets stuck open.
  useEffect(() => {
    if (!isMoreOpen) return;
    const onPointerDown = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setIsMoreOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setIsMoreOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isMoreOpen]);

  return (
    <nav className="nav-glass sticky top-0 z-[1200] border-b border-lime-200/15 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.75rem] items-center justify-between gap-3">
          {/* Paddy-sprout logo + solid brand name */}
          <Link to="/" className="group flex items-center gap-3" aria-label="FasalSathi home">
            <Logo size={44} />
            <span className="leading-none">
              <span className="block text-[1.45rem] font-extrabold tracking-tight text-[#F7FAF6]">FasalSathi</span>
              <span className="mt-1 hidden text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-200/70 min-[400px]:block">
                AI Crop Doctor · ফসল সাথী
              </span>
            </span>
          </Link>

          {/* Primary desktop menu */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive(link.path) ? 'page' : undefined}
                className={`flex min-h-[44px] items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive(link.path)
                    ? 'nav-link-active text-lime-100'
                    : 'border border-transparent text-emerald-100/80 hover:border-white/10 hover:bg-white/10 hover:text-white'
                }`}
                title={link.label}
              >
                <span className="text-lg drop-shadow">{link.icon}</span>
                <span>{link.label}</span>
                {isActive(link.path) && <span className="ml-1 h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300 shadow-[0_0_10px_#bef264]" />}
              </Link>
            ))}
          </div>

          {/* More menu, language selector, and mobile menu button */}
          <div className="flex items-center gap-2.5">
            <div className="relative hidden md:block" ref={moreRef}>
              <button
                type="button"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`flex min-h-[44px] items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                  isMoreOpen || moreLinks.some((link) => isActive(link.path))
                    ? 'nav-link-active text-lime-100'
                    : 'border border-white/10 bg-white/5 text-emerald-100/80 hover:bg-white/10 hover:text-white'
                }`}
                aria-expanded={isMoreOpen}
                aria-haspopup="menu"
              >
                <span className="text-lg">⋯</span>
                <span>{language === 'bn' ? 'আরও' : language === 'hi' ? 'और' : 'More'}</span>
                <svg className={`h-4 w-4 transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {isMoreOpen && (
                <div className="menu-enter absolute right-0 top-full z-[1300] mt-2 w-60 overflow-hidden rounded-2xl border border-lime-200/20 bg-[#0a2119] p-2 shadow-[0_24px_60px_rgba(0,0,0,.55)]" role="menu">
                  <div className="h-1 rounded-full bg-gradient-to-r from-lime-300 via-emerald-400 to-amber-300" />
                  {moreLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMoreOpen(false)}
                      aria-current={isActive(link.path) ? 'page' : undefined}
                      className={`mt-1 flex min-h-[48px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive(link.path)
                          ? 'nav-link-active text-lime-100'
                          : 'text-emerald-100/85 hover:translate-x-0.5 hover:bg-white/10 hover:text-white'
                      }`}
                      role="menuitem"
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-lg">{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Text-size toggle */}
            <button
              type="button"
              onClick={toggleTextSize}
              aria-pressed={largeText}
              title={language === 'bn' ? 'বড় অক্ষর' : language === 'hi' ? 'बड़े अक्षर' : 'Larger text'}
              aria-label={language === 'bn' ? 'বড় অক্ষর' : language === 'hi' ? 'बड़े अक्षर' : 'Larger text'}
              className={`grid min-h-[44px] min-w-[44px] place-items-center rounded-xl border px-2 text-base font-black transition-all ${
                largeText
                  ? 'border-lime-300/60 bg-lime-300 text-emerald-950'
                  : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              A+
            </button>

            {/* Language Buttons */}
            <div className="hidden gap-1 rounded-xl border border-white/10 bg-white/5 p-1 sm:flex">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`min-h-[44px] min-w-[44px] rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    language === lang.code
                      ? 'bg-gradient-to-r from-lime-300 to-emerald-300 text-emerald-950 shadow-[0_4px_14px_rgba(190,242,100,.4)]'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                  title={lang.label}
                >
                  {lang.short}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="grid min-h-[44px] min-w-[44px] place-items-center rounded-xl border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10 focus:outline-none md:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu — same links, 3D glass style */}
      {isOpen && (
        <div className="menu-enter border-t border-lime-200/10 bg-gradient-to-b from-[#0a2119] to-[#061310] md:hidden">
          <div className="space-y-1 px-3 pb-4 pt-3">
            {[...navLinks, ...moreLinks].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                aria-current={isActive(link.path) ? 'page' : undefined}
                className={`flex min-h-[52px] items-center gap-3 rounded-xl px-3 py-3 text-base font-medium transition-all ${
                  isActive(link.path)
                    ? 'nav-link-active text-lime-100'
                    : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-lg">{link.icon}</span>
                {link.label}
              </Link>
            ))}

            {/* Mobile Language Selector */}
            <div className="mt-2 border-t border-white/10 px-1 py-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-200/70">{language === 'bn' ? 'ভাষা' : language === 'hi' ? 'भाषा' : 'Language'}</p>
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`flex-1 rounded-xl px-2 py-3 text-xs font-bold transition-all ${
                      language === lang.code
                        ? 'bg-gradient-to-r from-lime-300 to-emerald-300 text-emerald-950'
                        : 'border border-white/10 bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {lang.short}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
