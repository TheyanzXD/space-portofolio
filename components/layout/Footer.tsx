'use client';

import React, { useEffect, useState } from 'react';
import { Rocket, Terminal, Volume2, VolumeX } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';

export interface FooterProps {
  onOpenVercelGuide: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function Footer({
  onOpenVercelGuide,
  soundEnabled,
  onToggleSound,
}: FooterProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackToTop = () => {
    setIsLaunching(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.setTimeout(() => {
      setIsLaunching(false);
    }, 750);
  };

  return (
    <footer className="relative mt-20 border-t border-white/[0.08] bg-[#05030f] pt-14 pb-12">
      {/* Garis cahaya gradien tipis di atas footer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent opacity-75"
      />

      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-center">
          <div>
            <a
              href="#hero"
              className="font-display text-lg font-extrabold tracking-[0.14em] text-[#f1f5f9] hover:text-[#22d3ee]"
            >
              {portfolioData.profile.panggilan}
            </a>
            <p className="mt-2 max-w-md text-sm text-[#94a3b8]">
              {portfolioData.profile.tagline}
            </p>
            <p className="mt-2 font-mono text-xs text-[#64748b]">
              {portfolioData.profile.koordinat}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onToggleSound}
              aria-pressed={soundEnabled}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/15 bg-[#0b0720] px-4 py-2 text-xs font-medium text-[#cbd5e1] transition-colors hover:border-[#22d3ee] hover:text-white cursor-pointer whitespace-nowrap shrink-0"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="h-4 w-4 text-[#22d3ee]" />
                  <span>Efek Suara: Aktif</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4 text-[#94a3b8]" />
                  <span>Efek Suara: Mati</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenVercelGuide}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-[#8b5cf6]/40 bg-[#130c33] px-4 py-2 text-xs font-medium text-[#f1f5f9] transition-colors hover:border-[#22d3ee] hover:text-[#22d3ee] cursor-pointer whitespace-nowrap shrink-0"
            >
              <Terminal className="h-4 w-4 text-[#22d3ee]" />
              <span>Panduan Deploy Vercel & Lokal</span>
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-8 text-xs text-[#94a3b8] sm:flex-row sm:items-center">
          <p>
            © {currentYear} {portfolioData.profile.nama}. Seluruh hak cipta
            dilindungi. Dibangun dengan Next.js, Three.js & Tailwind CSS.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <a href="#about" className="hover:text-[#f1f5f9] transition-colors">
              Tentang
            </a>
            <a href="#skills" className="hover:text-[#f1f5f9] transition-colors">
              Keahlian
            </a>
            <a
              href="#projects"
              className="hover:text-[#f1f5f9] transition-colors"
            >
              Proyek
            </a>
            <a
              href="#experience"
              className="hover:text-[#f1f5f9] transition-colors"
            >
              Misi
            </a>
            <a
              href="#contact"
              className="hover:text-[#f1f5f9] transition-colors"
            >
              Kontak
            </a>
          </div>
        </div>
      </div>

      {/* Tombol Kembali ke Atas Berbentuk Roket */}
      {showBackToTop && (
        <button
          type="button"
          onClick={handleBackToTop}
          aria-label="Meluncur kembali ke atas halaman"
          className="fixed right-6 bottom-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[#22d3ee]/50 bg-[#0b0720]/95 text-[#22d3ee] shadow-[0_0_28px_rgba(34,211,238,0.35)] transition-all hover:scale-105 hover:bg-[#130c33] hover:text-white focus-visible:outline-2 focus-visible:outline-[#22d3ee] cursor-pointer"
        >
          <Rocket
            className={`h-5 w-5 -rotate-45 transition-transform duration-500 ${
              isLaunching ? '-translate-y-8 opacity-0' : 'translate-y-0 opacity-100'
            }`}
          />
        </button>
      )}
    </footer>
  );
}
