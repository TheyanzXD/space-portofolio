'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  ArrowDown,
  Download,
  ExternalLink,
  Github,
  Globe,
  Mail,
  Rocket,
  Send,
} from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { Button } from '@/components/ui/Button';
import { MagneticWrapper } from '@/components/ui/MagneticWrapper';

const PlanetCanvas = dynamic(
  () => import('@/components/canvas/Planet').then((mod) => mod.Planet),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[390px] w-full items-center justify-center sm:h-[460px] lg:h-[560px]">
        <div className="h-44 w-44 rounded-full border border-[#22d3ee]/30 bg-gradient-to-tr from-[#8b5cf6]/25 to-[#22d3ee]/20" />
      </div>
    ),
  },
);

export interface HeroProps {
  onOpenCvModal: () => void;
  onActionSound?: () => void;
}

export function Hero({ onOpenCvModal, onActionSound }: HeroProps) {
  const { profile, socials } = portfolioData;
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState(profile.profesi[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = profile.profesi[roleIndex];
    const typeSpeed = isDeleting ? 35 : 70;

    const timer = window.setTimeout(() => {
      if (!isDeleting && displayedRole.length < currentFullText.length) {
        setDisplayedRole(currentFullText.slice(0, displayedRole.length + 1));
      } else if (
        !isDeleting &&
        displayedRole.length === currentFullText.length
      ) {
        window.setTimeout(() => setIsDeleting(true), 1800);
      } else if (isDeleting && displayedRole.length > 0) {
        setDisplayedRole(currentFullText.slice(0, displayedRole.length - 1));
      } else if (isDeleting && displayedRole.length === 0) {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % profile.profesi.length);
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [displayedRole, isDeleting, roleIndex, profile.profesi]);

  const scrollToProjects = () => {
    onActionSound?.();
    const el = document.getElementById('projects');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const renderSocialIcon = (icon: string) => {
    switch (icon) {
      case 'github':
        return <Github className="h-4 w-4" />;
      case 'telegram':
        return <Send className="h-4 w-4" />;
      case 'mail':
        return <Mail className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center pt-24 pb-16 lg:pt-28"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Visual Planet Studio 3D PBR + Collapsible Dock */}
          <div className="order-1 lg:order-2 lg:col-span-6">
            <PlanetCanvas />
          </div>

          {/* Kolom Teks Utama Hero (Izyan Danish / @TheyanzXD) */}
          <div className="order-2 lg:order-1 lg:col-span-6">
            <p className="mb-4 font-mono text-xs font-medium tracking-wider text-[#22d3ee]">
              ● {profile.statusKetersediaan}
            </p>

            <h1 className="font-display text-[clamp(2.35rem,5vw,4.35rem)] leading-[1.08] font-extrabold tracking-tight text-[#f1f5f9] [text-wrap:balance]">
              <span className="block text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-[#94a3b8] mb-2 font-mono">
                GITHUB: @{profile.githubUsername} · TELEGRAM: {profile.telegramHandle}
              </span>
              <span className="bg-gradient-to-r from-[#f8fafc] via-[#a78bfa] to-[#22d3ee] bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(139,92,246,0.35)]">
                {profile.nama}
              </span>
            </h1>

            {/* Subjudul Profesi dengan Efek Ketik */}
            <div className="mt-4 flex min-h-[36px] items-center font-mono text-base font-medium text-[#22d3ee] sm:text-xl">
              <span className="mr-2 text-[#8b5cf6]">&gt;</span>
              <span>{displayedRole}</span>
              <span
                aria-hidden="true"
                className="ml-1 inline-block h-5 w-2 bg-[#22d3ee]"
              />
            </div>

            <p className="mt-5 max-w-[60ch] text-base leading-[1.7] text-[#94a3b8] sm:text-lg">
              {profile.ringkasanHero}
            </p>

            {/* Tombol CTA Magnetik */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <MagneticWrapper>
                <Button variant="primary" size="lg" onClick={scrollToProjects}>
                  <Rocket className="h-4 w-4" />
                  <span>Lihat Proyek GitHub</span>
                </Button>
              </MagneticWrapper>

              <MagneticWrapper>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    onActionSound?.();
                    onOpenCvModal();
                  }}
                >
                  <Download className="h-4 w-4 text-[#22d3ee]" />
                  <span>CV & Panduan Vercel</span>
                </Button>
              </MagneticWrapper>

              <a
                href="/izyan-space-portfolio.zip"
                download="izyan-space-portfolio.zip"
                onClick={() => onActionSound?.()}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#22d3ee]/45 bg-[#130c33]/90 px-5 py-3 text-sm font-semibold text-[#22d3ee] shadow-[0_0_24px_rgba(34,211,238,0.2)] transition-all hover:border-[#22d3ee] hover:bg-[#22d3ee]/15 hover:text-white"
              >
                <Download className="h-4 w-4" />
                <span>Unduh Source (.ZIP)</span>
              </a>
            </div>

            {/* Tautan Cepat GitHub, Telegram, Email */}
            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              {socials.map((soc) => (
                <a
                  key={soc.nama}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Buka ${soc.nama}`}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/10 bg-[#0b0720]/90 px-3.5 py-2 text-xs font-medium text-[#cbd5e1] transition-colors hover:border-[#22d3ee] hover:text-[#22d3ee]"
                >
                  {renderSocialIcon(soc.ikon)}
                  <span>{soc.nama}</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Indikator Gulir di Bawah */}
        <div className="mt-10 flex justify-center lg:mt-14">
          <a
            href="#about"
            aria-label="Gulir ke bagian Tentang Saya"
            className="group inline-flex flex-col items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#94a3b8] transition-colors hover:text-[#22d3ee]"
          >
            <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1 group-hover:border-[#22d3ee]">
              <span className="h-2 w-1 rounded-full bg-[#22d3ee] transition-transform duration-300 group-hover:translate-y-3" />
            </span>
            <span className="inline-flex items-center gap-1">
              Jelajahi Orbit <ArrowDown className="h-3 w-3" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
