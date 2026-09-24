import { useEffect, useRef } from 'react';

/**
 * FX — frontend-only visual layer. No API / routing / state logic lives here.
 * Performance budget: transform/opacity animations only on the compositor,
 * cheap canvas (no shadowBlur, capped DPR + particle counts), auto-degrades
 * on low-end devices. Escape hatch: ?fx=off or localStorage 'fasal-fx'='off'.
 */

const LEAVES = ['🌾', '🍃', '🌿', '✦'];

function fxDisabled() {
  try {
    const q = new URLSearchParams(window.location.search).get('fx');
    if (q === 'off') return true;
    if (localStorage.getItem('fasal-fx') === 'off') return true;
  } catch { /* visual only — ignore */ }
  return false;
}

function isLowTier() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  try {
    if (navigator.connection && navigator.connection.saveData) return true;
    const cores = navigator.hardwareConcurrency || 8;
    const mem = navigator.deviceMemory || 8;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const small = Math.min(window.innerWidth, window.innerHeight) < 500;
    if (cores <= 4 || mem <= 4) return true;
    if (coarse && small) return true;
  } catch { /* assume high tier */ }
  return false;
}

export function SkyCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    if (fxDisabled()) return;
    if (isLowTier()) {
      document.documentElement.classList.add('perf-low');
      return;
    }
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let raf = 0;
    let w = 0;
    let h = 0;
    let running = true;
    // DPR cap: fullscreen canvas at DPR 2 is 4x the pixels — the #1 lag source.
    const DPR = Math.min(window.devicePixelRatio || 1, 1.25);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const mobile = w < 640;
    const N = mobile ? 10 : 20;
    const DOTS = mobile ? 10 : 18;
    const parts = Array.from({ length: N }, (_, i) => spawn(true, i));

    function spawn(initial, i) {
      const layer = Math.random();
      return {
        i,
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 40,
        // bucket sizes so ctx.font string is reused, not rebuilt per particle
        s: layer > 0.66 ? 26 : layer > 0.33 ? 17 : 11,
        vy: 0.25 + layer * 0.6,
        vx: -0.2 + Math.random() * 0.4,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.004 + Math.random() * 0.01,
        rot: Math.random() * Math.PI * 2,
        vr: -0.008 + Math.random() * 0.016,
        alpha: 0.18 + layer * 0.4,
        glyph: LEAVES[(Math.random() * LEAVES.length) | 0],
        depth: layer,
      };
    }

    // Parallax, rAF-throttled (no setState, no layout reads in handler)
    let tx = 0;
    let ty = 0;
    let px = 0;
    let py = 0;
    const onMouse = (e) => {
      tx = (e.clientX / w - 0.5) * 18;
      ty = (e.clientY / h - 0.5) * 12;
    };
    window.addEventListener('pointermove', onMouse, { passive: true });

    // Pause when tab hidden — stops battery drain + jank on return.
    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(tick);
      else cancelAnimationFrame(raf);
    };
    document.addEventListener('visibilitychange', onVis);

    // Precomputed dot field (no per-frame random / trig beyond one sine)
    const dots = Array.from({ length: DOTS }, (_, k) => ({
      fx: (k * 197.3) % 1,
      fy: (k * 311.7) % 1,
      sp: 0.12 + (k % 5) * 0.06,
      ph: k * 1.7,
      r: 1 + (k % 3) * 0.7,
    }));

    let last = 0;
    const tick = (now) => {
      if (!running) return;
      // Cap at ~30fps: halves paint cost, still looks smooth for ambient drift.
      if (now - last < 33) {
        raf = requestAnimationFrame(tick);
        return;
      }
      last = now;
      px += (tx - px) * 0.06;
      py += (ty - py) * 0.06;

      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = '#beffaa';
      for (const d of dots) {
        const dx = (((d.fx * w + now * 0.008 * d.sp * 60 * 0.016) % w) + w) % w;
        const dy = h * 0.12 + ((d.fy * h * 0.8 + h) % (h * 0.8));
        const tw = 0.5 + 0.5 * Math.sin(now * 0.001 + d.ph);
        ctx.globalAlpha = 0.08 + tw * 0.16;
        ctx.beginPath();
        ctx.arc(dx, dy, d.r, 0, 6.2832);
        ctx.fill();
      }

      // NOTE: no shadowBlur (extremely expensive per-glyph). No clouds here —
      // ambience is handled by static CSS gradients (zero per-frame cost).
      let font = '';
      for (const p of parts) {
        p.sway += p.swaySpeed;
        p.rot += p.vr;
        p.y -= p.vy;
        p.x += p.vx + Math.sin(p.sway) * 0.3;
        if (p.y < -50 || p.x < -60 || p.x > w + 60) Object.assign(p, spawn(false, p.i));
        const f = `${p.s}px serif`;
        if (f !== font) {
          font = f;
          ctx.font = f;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
        }
        ctx.globalAlpha = p.alpha;
        ctx.save();
        ctx.translate(p.x + px * p.depth, p.y + py * p.depth);
        ctx.rotate(p.rot);
        ctx.fillText(p.glyph, 0, 0);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMouse);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fx-sky"
    />
  );
}

export function AmbientField() {
  if (typeof window !== 'undefined' && fxDisabled()) return null;
  return (
    <div aria-hidden="true" className="fx-ambient">
      <div className="fx-orb fx-orb-a" />
      <div className="fx-orb fx-orb-b" />
      <div className="fx-sun" />
      {/* static grid: no per-frame repaint. floats are transform-only. */}
      <div className="fx-grid" />
      <span className="fx-float fx-f1">🌾</span>
      <span className="fx-float fx-f3">🍃</span>
      <span className="fx-float fx-f4">☁️</span>
    </div>
  );
}

/** Adds pointer-driven 3D tilt to [data-tilt] cards. rAF-throttled, visual only. */
export function useGlobalTilt() {
  useEffect(() => {
    if (fxDisabled() || isLowTier()) return;
    const onMove = (e) => {
      const el = e.currentTarget;
      if (el.__tiltQueued) return;
      el.__tiltQueued = true;
      const { clientX, clientY } = e;
      requestAnimationFrame(() => {
        el.__tiltQueued = false;
        const r = el.getBoundingClientRect();
        const px = (clientX - r.left) / r.width - 0.5;
        const py = (clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--rx', `${(-py * 8).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${(px * 10).toFixed(2)}deg`);
        el.style.setProperty('--mx', `${(px * 100 + 50).toFixed(0)}%`);
        el.style.setProperty('--my', `${(py * 100 + 50).toFixed(0)}%`);
      });
    };
    const onLeave = (e) => {
      e.currentTarget.style.setProperty('--rx', '0deg');
      e.currentTarget.style.setProperty('--ry', '0deg');
    };
    const bound = new Set();
    const bind = () => {
      document.querySelectorAll('[data-tilt]').forEach((el) => {
        if (bound.has(el)) return;
        bound.add(el);
        el.addEventListener('pointermove', onMove, { passive: true });
        el.addEventListener('pointerleave', onLeave, { passive: true });
      });
    };
    bind();
    const obs = new MutationObserver(bind);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);
}

/** Adds .is-in to .reveal elements on scroll. Visual only. */
export function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' },
    );
    const watch = () => document.querySelectorAll('.reveal:not(.is-in)').forEach((el) => io.observe(el));
    watch();
    const obs = new MutationObserver(watch);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); obs.disconnect(); };
  }, []);
}
