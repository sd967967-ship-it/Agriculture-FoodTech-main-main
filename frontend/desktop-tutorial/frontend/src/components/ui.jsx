import React from 'react';

/**
 * Shared farmer-friendly primitives. Calm styling, 44px+ targets,
 * plain-language states. No business logic here.
 */

export function PrimaryButton({ children, ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={`btn-primary min-h-[48px] rounded-xl px-6 py-3 text-base font-bold ${props.className || ''}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={`min-h-[48px] rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-3 text-base font-bold text-emerald-100 transition-colors hover:bg-emerald-500/20 ${props.className || ''}`}
    >
      {children}
    </button>
  );
}

export function Card({ children, ...props }) {
  return (
    <div
      {...props}
      className={`card-3d rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-md sm:p-6 ${props.className || ''}`}
    >
      {children}
    </div>
  );
}

export function SectionHead({ eyebrow, title, copy }) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl font-bold text-slate-100">{title}</h2>
      {copy && <p className="mt-2 text-[15px] leading-6 text-slate-300">{copy}</p>}
    </div>
  );
}

/** Lightweight skeleton block. Pass width/height via className. */
export function Skeleton({ className = '', label = 'Loading…' }) {
  return <div role="status" aria-label={label} className={`skel ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div role="status" aria-label="Loading content" className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
      <div className="skel h-5 w-2/3" />
      <div className="skel mt-3 h-4 w-full" />
      <div className="skel mt-2 h-4 w-5/6" />
      <div className="mt-4 flex gap-3">
        <div className="skel h-11 flex-1" />
        <div className="skel h-11 flex-1" />
      </div>
    </div>
  );
}

export function EmptyState({ icon = '🌱', title, copy, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-600 bg-slate-900/50 p-6 text-center">
      <div className="text-3xl" aria-hidden="true">{icon}</div>
      <p className="mt-3 text-base font-bold text-slate-100">{title}</p>
      {copy && <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-300">{copy}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ title, copy, onRetry, retryLabel = 'Try again' }) {
  return (
    <div role="alert" className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-center">
      <div className="text-3xl" aria-hidden="true">⚠️</div>
      <p className="mt-3 text-base font-bold text-amber-100">{title}</p>
      {copy && <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-amber-100/85">{copy}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 min-h-[48px] rounded-xl bg-amber-400 px-6 py-3 text-base font-bold text-slate-950 transition-colors hover:bg-amber-300"
        >
          ↻ {retryLabel}
        </button>
      )}
    </div>
  );
}
