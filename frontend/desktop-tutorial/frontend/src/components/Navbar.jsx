import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, languages } = useLanguage();
  const labels = {
    en: ['Home', 'Diagnose', 'Pest Log', 'Hotspot Map', 'Official Dashboard', 'Tools', 'About', 'Profile'],
    bn: ['হোম', 'রোগ নির্ণয়', 'কীটপতঙ্গ লগ', 'হটস্পট মানচিত্র', 'সরকারি ড্যাশবোর্ড', 'সরঞ্জাম', 'সম্পর্কে', 'প্রোফাইল'],
    hi: ['होम', 'जाँच', 'कीट लॉग', 'हॉटस्पॉट नक्शा', 'सरकारी डैशबोर्ड', 'उपकरण', 'जानकारी', 'प्रोफ़ाइल']
  }[language] || ['Home', 'Diagnose', 'Pest Log', 'Hotspot Map', 'Official Dashboard', 'Tools', 'About', 'Profile'];

  const navLinks = [
    { path: '/', label: labels[0], icon: '🏠' },
    { path: '/diagnose', label: labels[1], icon: '🔍' },
    { path: '/admin/dashboard', label: labels[4], icon: '📊' },
  ];

  const moreLinks = [
    { path: '/pest-log', label: labels[2], icon: '🪤' },
    { path: '/hotspots', label: labels[3], icon: '🗺️' },
    { path: '/tools', label: labels[5], icon: '🧰' },
    { path: '/about', label: labels[6], icon: 'ℹ️' },
    { path: '/profile', label: labels[7], icon: '👤' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-300/15 bg-[#092019]/90 text-white shadow-2xl backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3 font-bold tracking-tight transition-opacity hover:opacity-90">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-lime-200/20 bg-lime-300/10 text-xl shadow-inner">🌾</span>
            <span className="hidden text-xl sm:inline">Fasal<span className="text-lime-300">Sathi</span></span>
          </Link>
          
          {/* Primary desktop menu */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'bg-lime-300/15 text-lime-200 shadow-inner'
                    : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                }`}
                title={link.label}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* More menu, language selector, and mobile menu button */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                  isMoreOpen || moreLinks.some((link) => location.pathname === link.path)
                    ? 'bg-lime-300/15 text-lime-200 shadow-inner'
                    : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                }`}
                aria-expanded={isMoreOpen}
                aria-haspopup="menu"
              >
                <span className="text-lg">⋯</span>
                <span>{language === 'bn' ? 'আরও' : language === 'hi' ? 'और' : 'More'}</span>
                <svg className={`h-4 w-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {isMoreOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-emerald-300/20 bg-[#0b241b] p-2 shadow-2xl" role="menu">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMoreOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        location.pathname === link.path
                          ? 'bg-lime-300/15 text-lime-200'
                          : 'text-emerald-100/85 hover:bg-white/10 hover:text-white'
                      }`}
                      role="menuitem"
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Language Buttons */}
            <div className="hidden sm:flex gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 text-xs font-bold rounded transition-all ${
                    language === lang.code
                      ? 'bg-lime-300 text-emerald-950 shadow-md'
                        : 'bg-white/10 text-white hover:bg-white/20'
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
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 focus:outline-none transition-colors"
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="menu-enter md:hidden border-t border-emerald-600 bg-emerald-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block rounded-md px-3 py-3 text-base font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-white/20 text-white'
                    : 'text-emerald-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Language Selector */}
            <div className="px-3 py-3 border-t border-emerald-600 mt-2">
              <p className="text-xs text-emerald-200 font-semibold mb-2">{language === 'bn' ? 'ভাষা' : language === 'hi' ? 'भाषा' : 'Language'}</p>
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`flex-1 rounded-lg px-2 py-3 text-xs font-bold transition-all ${
                      language === lang.code
                        ? 'bg-white text-emerald-700'
                        : 'bg-white/20 text-white hover:bg-white/30'
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
