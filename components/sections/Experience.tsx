'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GraduationCap, Rocket, Satellite } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { GlassCard } from '@/components/ui/GlassCard';
import { TagList } from '@/components/ui/Tag';

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineProgress, setLineProgress] = useState(25);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const total = rect.height + windowHeight * 0.4;
      const scrolled = windowHeight * 0.65 - rect.top;
      const pct = Math.min(100, Math.max(12, (scrolled / total) * 100));
      setLineProgress(pct);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="experience" className="relative py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <SectionTitle
          index="04"
          label="Timeline Misi & Rekam Jejak"
          title="Perjalanan Karier & Stasiun Orbit Rekayasa"
          subtitle="Setiap penugasan adalah ekspedisi teknis untuk memecahkan masalah skala besar dan meningkatkan standar kualitas produk."
        />

        <div ref={containerRef} className="relative mt-12">
          {/* Jalur Vertikal di Tengah (Desktop) dan di Kiri (Mobile) */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-5 w-[2px] bg-white/10 md:left-1/2 md:-translate-x-1/2"
          >
            <div
              className="w-full bg-gradient-to-b from-[#22d3ee] via-[#8b5cf6] to-[#f472b6] shadow-[0_0_16px_#22d3ee] transition-[height] duration-150"
              style={{ height: `${lineProgress}%` }}
            />
          </div>

          <div className="space-y-12">
            {portfolioData.experience.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              const IconComponent =
                item.tipe === 'Pendidikan'
                  ? GraduationCap
                  : item.statusAktif
                    ? Rocket
                    : Satellite;

              return (
                <div
                  key={item.id}
                  className="relative grid grid-cols-1 items-start md:grid-cols-12"
                >
                  {/* Titik Simpul Stasiun Luar Angkasa */}
                  <div
                    aria-hidden="true"
                    className={`absolute left-5 z-20 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border-2 bg-[#05030f] md:left-1/2 ${
                      item.statusAktif
                        ? 'border-[#22d3ee] text-[#22d3ee] shadow-[0_0_24px_rgba(34,211,238,0.6)]'
                        : 'border-[#8b5cf6] text-[#a78bfa]'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>

                  {/* Kartu Entri Bergantian Kiri & Kanan */}
                  <div
                    className={`pl-14 md:pl-0 ${
                      isLeft
                        ? 'md:col-span-5 md:col-start-1 md:pr-8'
                        : 'md:col-span-5 md:col-start-8 md:pl-8'
                    }`}
                  >
                    <GlassCard className="p-6 sm:p-7">
                      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                        <span className="text-[#94a3b8] tabular-nums">
                          {item.periode}
                        </span>
                        {item.statusAktif ? (
                          <span className="font-semibold tracking-wider text-[#22d3ee]">
                            ● MISI SAAT INI
                          </span>
                        ) : (
                          <span className="text-[#a78bfa]">
                            {item.koordinatMisi}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 font-display text-xl font-bold text-[#f1f5f9]">
                        {item.posisi}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-[#22d3ee]">
                        {item.organisasi}{' '}
                        <span className="text-[#94a3b8]">· {item.lokasi}</span>
                      </p>

                      <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[#cbd5e1]">
                        {item.poinPencapaian.map((poin, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2.5">
                            <span
                              aria-hidden="true"
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22d3ee]"
                            />
                            <span>{poin}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-5 border-t border-white/[0.08] pt-4">
                        <TagList items={item.teknologi} />
                      </div>
                    </GlassCard>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
