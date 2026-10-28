'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Download, MapPin, Terminal as TerminalIcon } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

export interface AboutProps {
  onOpenCvModal: () => void;
}

export function About({ onOpenCvModal }: AboutProps) {
  const { profile, stats } = portfolioData;
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [counts, setCounts] = useState<number[]>(stats.map(() => 0));
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [activeFactIdx, setActiveFactIdx] = useState(0);

  // Trigger hitung naik statistik saat masuk viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    let rafId = 0;

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounts(stats.map((s) => Math.round(s.nilai * eased)));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [inView, stats]);

  const handlePhotoMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -ny * 12, ry: nx * 12 });
  };

  const highlightKeywords = (paragraph: string) => {
    let result: React.ReactNode[] = [paragraph];
    profile.kataKunciSorotan.forEach((keyword) => {
      const next: React.ReactNode[] = [];
      result.forEach((part, idx) => {
        if (typeof part !== 'string') {
          next.push(part);
          return;
        }
        const splitParts = part.split(keyword);
        splitParts.forEach((chunk, cIdx) => {
          next.push(chunk);
          if (cIdx < splitParts.length - 1) {
            next.push(
              <span
                key={`${keyword}-${idx}-${cIdx}`}
                className="font-semibold text-[#22d3ee]"
              >
                {keyword}
              </span>,
            );
          }
        });
      });
      result = next;
    });
    return result;
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <SectionTitle
          index="01"
          label="Tentang Saya"
          title="Merakit Arsitektur Web Masa Depan dari Stasiun Komando Digital"
          subtitle="Perpaduan disiplin rekayasa perangkat lunak, arah seni tiga dimensi, dan obsesi terhadap kecepatan muat."
        />

        {/* Layout 2 Kolom: Foto dengan 3 Ring Orbit di Kiri, Bio & Terminal di Kanan */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Kolom Kiri: Frame Foto Lingkaran + 3 Ring Orbit */}
          <div className="flex flex-col items-center justify-center lg:col-span-5">
            <div
              onMouseMove={handlePhotoMove}
              onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
              style={{
                transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                transition: 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className="relative flex h-[310px] w-[310px] items-center justify-center sm:h-[370px] sm:w-[370px]"
            >
              {/* Ring Orbit 1 (Luar - Searah Jarum Jam) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full border border-dashed border-[#8b5cf6]/40 animate-[spin_28s_linear_infinite]"
              >
                <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#8b5cf6] shadow-[0_0_12px_#8b5cf6]" />
              </div>

              {/* Ring Orbit 2 (Tengah - Berlawanan Jarum Jam) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-5 rounded-full border border-[#22d3ee]/35 animate-[spin_20s_linear_infinite_reverse]"
              >
                <span className="absolute top-1/2 -right-1.5 h-3 w-3 -translate-y-1/2 rounded-full bg-[#22d3ee] shadow-[0_0_12px_#22d3ee]" />
              </div>

              {/* Ring Orbit 3 (Dalam - Searah Jarum Jam) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-10 rounded-full border border-[#f472b6]/35 animate-[spin_14s_linear_infinite]"
              >
                <span className="absolute -bottom-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#f472b6] shadow-[0_0_10px_#f472b6]" />
              </div>

              {/* Foto Profil Utama */}
              <div className="relative h-52 w-52 overflow-hidden rounded-full border-2 border-[#22d3ee]/60 bg-[#0b0720] shadow-[0_0_45px_rgba(139,92,246,0.35)] sm:h-60 sm:w-60">
                <Image
                  src={profile.foto}
                  alt={`Foto profil ${profile.nama} - ${profile.profesi[0]}`}
                  fill
                  sizes="(max-width: 768px) 220px, 260px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 font-mono text-xs text-[#94a3b8]">
              <MapPin className="h-4 w-4 text-[#22d3ee]" />
              <span>{profile.lokasi}</span>
            </div>
          </div>

          {/* Kolom Kanan: Narasi Bio, Terminal Luar Angkasa, dan Tombol CV */}
          <div className="space-y-5 lg:col-span-7">
            {profile.bio.map((paragraf, index) => (
              <p
                key={index}
                className="max-w-[65ch] text-base leading-[1.75] text-[#cbd5e1]"
              >
                {highlightKeywords(paragraf)}
              </p>
            ))}

            {/* Fakta Singkat Bergaya Terminal Luar Angkasa */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-[#070414] p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2 font-mono text-xs text-[#22d3ee]">
                  <TerminalIcon className="h-4 w-4" />
                  <span>AETHERION-TERMINAL // FAKTA CEPAT</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profile.terminalFacts.map((fact, idx) => (
                    <button
                      key={fact.perintah}
                      type="button"
                      onClick={() => setActiveFactIdx(idx)}
                      className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors cursor-pointer ${
                        activeFactIdx === idx
                          ? 'bg-[#8b5cf6]/30 text-[#22d3ee] border border-[#22d3ee]/40'
                          : 'bg-white/[0.04] text-[#94a3b8] hover:text-white'
                      }`}
                    >
                      0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-2 font-mono text-xs sm:text-sm">
                <p className="text-[#a78bfa]">
                  $ {profile.terminalFacts[activeFactIdx].perintah}
                </p>
                <p className="leading-relaxed text-[#f1f5f9]">
                  {profile.terminalFacts[activeFactIdx].respon}
                </p>
              </div>
            </div>

            <div className="pt-3">
              <Button variant="outline" onClick={onOpenCvModal}>
                <Download className="h-4 w-4 text-[#22d3ee] transition-transform group-hover:translate-y-0.5" />
                <span>Lihat & Unduh Ringkasan CV</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Baris Penuh 4 Kartu Statistik Hitung Naik di Bawah Split */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <GlassCard key={stat.id} className="p-6">
              <p className="font-mono text-xs tracking-wider uppercase text-[#94a3b8]">
                {stat.label}
              </p>
              <p className="mt-2 font-mono text-3xl font-bold text-[#f1f5f9] tabular-nums sm:text-4xl">
                {counts[idx]}
                <span className="ml-1 text-[#22d3ee]">{stat.akhiran}</span>
              </p>
              <p className="mt-2 text-xs text-[#94a3b8]">{stat.deskripsi}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
