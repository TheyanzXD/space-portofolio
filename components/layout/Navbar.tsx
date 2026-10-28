'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { id: 'about', label: 'Tentang', href: '#about' },
  { id: 'skills', label: 'Keahlian', href: '#skills' },
  { id: 'projects', label: 'Proyek', href: '#projects' },
  { id: 'experience', label: 'Misi', href: '#experience' },
  { id: 'contact', label: 'Kontak', href: '#contact' },
];

export interface NavbarProps {
  onNavigate?: () => void;
}

/**
 * Navbar sticky transparan yang mengikuti kontrak 3-Zona:
 * [1. Brand Wordmark] — [2. 5 Link Navigasi Satu Baris] — [3. 1 Tombol Aksi Utama]
 */
export function Navbar({ onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 40);

      if (currentY > 180 && currentY > lastScrollY.current + 12) {
        setHidden(true);
      } else if (currentY < lastScrollY.current - 8 || currentY <= 80) {
        setHidden(false);
      }
      lastScrollY.current = currentY;

      // Deteksi section aktif
      const sections = [
        'hero',
        'about',
        'skills',
        'projects',
        'experience',
        'testimonials',
        'contact',
      ];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 220) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    onNavigate?.();
    setMobileMenuOpen(false);

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* Tautan Lompat ke Konten Utama untuk Aksesibilitas Papan Ketik */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[110] focus:rounded-lg focus:bg-[#22d3ee] focus:px-4 focus:py-2 focus:font-semibold focus:text-[#05030f]"
      >
        Lompat ke konten utama
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          hidden && !mobileMenuOpen ? '-translate-y-full' : 'translate-y-0',
          scrolled || mobileMenuOpen
            ? 'border-b border-white/[0.08] bg-[#05030f]/95 py-3.5 shadow-[0_8px_32px_rgba(5,3,15,0.75)]'
            : 'bg-transparent py-5',
        )}
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-5 sm:px-8">
          {/* Zona 1: Brand Wordmark Satu Elemen */}
          <a
            href="#hero"
            onClick={(e) => scrollToSection(e, '#hero')}
            className="font-display text-lg font-extrabold tracking-[0.14em] text-[#f1f5f9] transition-colors hover:text-[#22d3ee] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22d3ee] whitespace-nowrap shrink-0"
          >
            {portfolioData.profile.panggilan}
          </a>

          {/* Zona 2: 5 Link Navigasi Satu Baris */}
          <nav
            aria-label="Navigasi Utama"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#94a3b8]"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={cn(
                    'relative py-1 transition-colors whitespace-nowrap shrink-0 hover:text-[#f1f5f9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22d3ee]',
                    isActive ? 'text-[#f1f5f9]' : 'text-[#94a3b8]',
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee] shadow-[0_0_10px_#22d3ee]"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zona 3: 1 Tombol Aksi Utama (+ Hamburger Mobile) */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className="hidden sm:inline-flex min-h-[40px] items-center justify-center rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee] px-5 py-2 text-xs font-semibold text-[#05030f] shadow-[0_0_24px_rgba(139,92,246,0.4)] transition-all hover:shadow-[0_0_32px_rgba(34,211,238,0.6)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#22d3ee] whitespace-nowrap shrink-0"
            >
              Hubungi Saya
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#0b0720] text-[#f1f5f9] transition-colors hover:border-[#22d3ee] md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-[#22d3ee]" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Panel Navigasi Mobile */}
        {mobileMenuOpen && (
          <nav
            aria-label="Navigasi Mobile"
            className="border-t border-white/10 bg-[#05030f] px-6 py-6 md:hidden"
          >
            <ul className="flex flex-col space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className={cn(
                      'flex min-h-[44px] items-center rounded-xl px-4 py-2.5 text-base font-medium transition-colors',
                      activeSection === item.id
                        ? 'bg-[#130c33] text-[#22d3ee]'
                        : 'text-[#f1f5f9] hover:bg-white/[0.04]',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="#contact"
                  onClick={(e) => scrollToSection(e, '#contact')}
                  className="flex min-h-[46px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee] px-5 py-2.5 text-sm font-semibold text-[#05030f]"
                >
                  Hubungi Saya
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
