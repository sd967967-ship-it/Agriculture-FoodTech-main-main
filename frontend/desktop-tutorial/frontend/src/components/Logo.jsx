import React from 'react';

/**
 * Enhanced FasalSathi 3D logo — visual only.
 * Layered sun halo + terraced fields + wheat stalk + droplet, all gradient.
 */
export default function Logo({ size = 44 }) {
  return (
    <span className="logo-3d" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 96 96" width={size} height={size} role="img" aria-label="FasalSathi logo">
        <defs>
          <radialGradient id="fs-sun" cx="50%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#fffbe3" />
            <stop offset="38%" stopColor="#fde68a" />
            <stop offset="72%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.9" />
          </radialGradient>
          <linearGradient id="fs-leaf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d9f99d" />
            <stop offset="45%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="fs-field" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="55%" stopColor="#0c3b24" />
            <stop offset="100%" stopColor="#05271a" />
          </linearGradient>
          <linearGradient id="fs-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#bef264" />
            <stop offset="50%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <linearGradient id="fs-drop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* outer glow ring */}
        <circle cx="48" cy="48" r="45" fill="none" stroke="url(#fs-ring)" strokeWidth="3.5" opacity="0.95" />
        <circle cx="48" cy="48" r="41" fill="#06130e" />
        {/* sun */}
        <circle className="logo-sun" cx="48" cy="34" r="15" fill="url(#fs-sun)" />
        {/* hills / terraced fields */}
        <path d="M7 62 Q24 48 40 58 T73 56 T89 62 L89 78 Q48 88 7 78 Z" fill="url(#fs-field)" stroke="#34d399" strokeOpacity="0.35" strokeWidth="1" />
        <path d="M7 68 Q30 60 48 66 T89 67" fill="none" stroke="#4ade80" strokeOpacity="0.5" strokeWidth="1.4" strokeDasharray="5 4" />
        <path d="M10 74 Q32 68 52 72 T86 73" fill="none" stroke="#a3e635" strokeOpacity="0.45" strokeWidth="1.2" strokeDasharray="4 4" />
        {/* wheat stalk */}
        <g className="logo-wheat" strokeLinecap="round">
          <path d="M48 78 V44" stroke="#d9f99d" strokeWidth="2.6" />
          <ellipse cx="42.5" cy="52" rx="5.2" ry="2.8" fill="url(#fs-leaf)" transform="rotate(-28 42.5 52)" />
          <ellipse cx="53.5" cy="52" rx="5.2" ry="2.8" fill="url(#fs-leaf)" transform="rotate(28 53.5 52)" />
          <ellipse cx="42.5" cy="60" rx="5.2" ry="2.8" fill="url(#fs-leaf)" transform="rotate(-28 42.5 60)" />
          <ellipse cx="53.5" cy="60" rx="5.2" ry="2.8" fill="url(#fs-leaf)" transform="rotate(28 53.5 60)" />
          <ellipse cx="48" cy="40" rx="3.4" ry="5.4" fill="#fef08a" stroke="#f59e0b" strokeWidth="1" />
        </g>
        {/* droplet */}
        <path d="M70 30 c3.4 4.2 5.2 6.6 5.2 9.2 a5.2 5.2 0 1 1 -10.4 0 c0 -2.6 1.8 -5 5.2 -9.2z" fill="url(#fs-drop)" stroke="#e0f2fe" strokeWidth="1" opacity="0.95" />
        {/* sparkles */}
        <g fill="#fef9c3" opacity="0.9">
          <circle className="logo-twinkle" cx="26" cy="30" r="1.8" />
          <circle className="logo-twinkle t2" cx="72" cy="58" r="1.5" />
          <circle className="logo-twinkle t3" cx="24" cy="56" r="1.3" />
        </g>
      </svg>
    </span>
  );
}
