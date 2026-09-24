import React from 'react';

/**
 * Optimized animation components to improve performance
 * These components use CSS transforms and opacity for better GPU acceleration
 */

export function OptimizedHeroSection({ children }) {
  return (
    <section className="relative overflow-hidden bg-[#0F291E] px-4 py-12 sm:py-16">
      {/* Static background: no per-frame animation, no blur filters */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(120deg, rgba(6, 28, 20, 0.94), rgba(15, 41, 30, 0.88)), url("/farm-hero.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(115deg, rgba(190,242,100,0.05), transparent 35%, rgba(45,212,191,0.06) 60%, transparent 80%)'
      }} />

      <div className="reveal relative mx-auto max-w-3xl text-center">
        {children}
      </div>
    </section>
  );
}

export function OptimizedCard({ children, className = '' }) {
  return (
    <div className={`interactive-card rounded-xl border border-slate-700/80 bg-slate-900/80 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.2)] transition-all duration-300 ease-out transform-gpu ${className}`}>
      {children}
    </div>
  );
}

export function OptimizedButton({ children, onClick, className = '', disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-h-[44px] rounded-xl px-6 py-3 text-base font-semibold transition-all duration-200 ease-out transform-gpu ${
        disabled 
          ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50' 
          : 'bg-emerald-500 text-slate-950 shadow-[0_8px_16px_rgba(52,211,153,0.25)] hover:bg-emerald-400 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(52,211,153,0.35)] active:scale-95'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function OptimizedTab({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap border-b-2 px-5 py-4 text-sm font-bold transition-all duration-200 ease-out transform-gpu ${
        active
          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200'
          : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-100'
      }`}
    >
      {children}
    </button>
  );
}

export function OptimizedLoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]}`}>
      <div className="animate-spin rounded-full border-2 border-slate-600 border-t-emerald-500"></div>
    </div>
  );
}

export function OptimizedFadeIn({ children, delay = 0 }) {
  return (
    <div 
      className="opacity-0 transition-opacity duration-500 ease-out"
      style={{ transitionDelay: `${delay}ms` }}
      onLoad={() => {
        // Trigger animation when component mounts
        requestAnimationFrame(() => {
          const element = document.querySelector(`[style*="transition-delay: ${delay}ms"]`);
          if (element) {
            element.classList.add('opacity-100');
          }
        });
      }}
    >
      {children}
    </div>
  );
}