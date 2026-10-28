'use client';

import React, { useEffect, useState } from 'react';
import { Rocket } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Loader() {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [isSplitting, setIsSplitting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const autoStart = params.get('autostart') === '1';
    const alreadySeen =
      window.sessionStorage.getItem('aetherion_loader_seen') === 'true';

    if (autoStart || alreadySeen || reducedMotion) {
      setIsHidden(true);
      return;
    }

    const startTime = performance.now();
    const duration = 1750; // Cepat dan responsif (< 2.8 detik)
    let rafId = 0;

    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        rafId = requestAnimationFrame(updateProgress);
      } else {
        window.sessionStorage.setItem('aetherion_loader_seen', 'true');
        setIsSplitting(true);
        window.setTimeout(() => {
          setIsHidden(true);
        }, 480);
      }
    };

    rafId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  const handleSkip = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('aetherion_loader_seen', 'true');
    }
    setIsSplitting(true);
    window.setTimeout(() => {
      setIsHidden(true);
    }, 300);
  };

  if (isHidden) return null;

  const statusText =
    progress < 38
      ? 'Menyiapkan mesin propulsi...'
      : progress < 78
        ? 'Mengisi bahan bakar kuantum...'
        : 'Meluncur ke orbit utama!';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Memuat pengalaman luar angkasa"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden pointer-events-auto"
    >
      {/* Pintu Hangar Atas */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 bg-[#05030f] border-b border-white/10 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: isSplitting ? 'translateY(-100%)' : 'translateY(0%)',
        }}
      />
      {/* Pintu Hangar Bawah */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#05030f] border-t border-white/10 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: isSplitting ? 'translateY(100%)' : 'translateY(0%)',
        }}
      />

      {/* Konten Tengah Loader */}
      <div
        className="relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center transition-opacity duration-300"
        style={{ opacity: isSplitting ? 0 : 1 }}
      >
        {/* Visual Roket Meluncur */}
        <div className="relative mb-8 flex h-28 w-28 items-center justify-center rounded-full border border-[#8b5cf6]/35 bg-[#0b0720] shadow-[0_0_50px_rgba(139,92,246,0.35)]">
          <div
            style={{
              transform: `translateY(${-(progress * 0.25)}px)`,
              transition: 'transform 80ms linear',
            }}
            className="flex flex-col items-center"
          >
            <Rocket className="h-10 w-10 -rotate-45 text-[#22d3ee]" />
            <div className="mt-1 h-7 w-2 rounded-full bg-gradient-to-b from-[#22d3ee] via-[#f472b6] to-transparent opacity-90" />
          </div>
        </div>

        <p className="font-display text-sm font-bold tracking-[0.25em] uppercase text-[#f1f5f9]">
          AETHERION SPACE STATION
        </p>
        <p className="mt-2 font-mono text-xs text-[#22d3ee]">{statusText}</p>

        {/* Progress Bar */}
        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8b5cf6] via-[#22d3ee] to-[#f472b6] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 flex w-full items-center justify-between font-mono text-xs text-[#94a3b8] tabular-nums">
          <span>SISTEM INISIALISASI</span>
          <span className="font-semibold text-[#f1f5f9]">{progress}%</span>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="mt-6 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2 text-xs font-medium text-[#cbd5e1] transition-colors hover:border-[#22d3ee] hover:text-white focus-visible:outline-2 focus-visible:outline-[#22d3ee] cursor-pointer"
        >
          Lewati Intro
        </button>
      </div>
    </div>
  );
}
