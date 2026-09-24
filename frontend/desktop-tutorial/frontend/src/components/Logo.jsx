import React from 'react';

/**
 * FasalSathi logo — a young paddy sprout under a rising sun.
 * Flat inline SVG, static (no animation): kind to low-end phones.
 * Brand gradient: crop green #10B981 -> harvest gold #F59E0B.
 */
export default function Logo({ size = 44 }) {
  return (
    <span
      className="inline-grid shrink-0 place-items-center overflow-hidden rounded-2xl"
      style={{ width: size, height: size, backgroundColor: '#061C14', border: '1px solid rgba(16,185,129,0.35)' }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 96 96" width={size} height={size} role="img" aria-label="FasalSathi logo">
        <defs>
          <linearGradient id="fs-brand" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="fs-sprout" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#0B7A55" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>

        {/* field ground */}
        <path d="M8 70 Q28 62 48 68 T88 68 L88 96 L8 96 Z" fill="#0F291E" />
        <path d="M8 70 Q28 62 48 68 T88 68" fill="none" stroke="#10B981" strokeOpacity="0.6" strokeWidth="2" />

        {/* rising sun */}
        <path d="M28 52 A20 20 0 0 1 68 52" fill="none" stroke="url(#fs-brand)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="48" cy="52" r="4" fill="#F59E0B" />

        {/* paddy sprout: central stem */}
        <path d="M48 78 V46" stroke="url(#fs-sprout)" strokeWidth="3.4" strokeLinecap="round" />
        {/* side shoots */}
        <path d="M48 66 C40 64 34 58 32 50" fill="none" stroke="url(#fs-sprout)" strokeWidth="3" strokeLinecap="round" />
        <path d="M48 66 C56 64 62 58 64 50" fill="none" stroke="url(#fs-sprout)" strokeWidth="3" strokeLinecap="round" />
        {/* leaves */}
        <ellipse cx="36" cy="56" rx="7" ry="3.2" fill="#10B981" transform="rotate(-28 36 56)" />
        <ellipse cx="60" cy="56" rx="7" ry="3.2" fill="#10B981" transform="rotate(28 60 56)" />
        {/* grain head */}
        <ellipse cx="48" cy="40" rx="4" ry="7" fill="#F59E0B" />
        <path d="M48 33 V47 M44 36 L52 44 M52 36 L44 44" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}
