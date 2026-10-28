'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { GlassCard } from '@/components/ui/GlassCard';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Testimonials() {
  const testimonials = portfolioData.testimonials;
  const reducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  // Auto-play tiap 6 detik, berhenti saat hover atau fokus
  useEffect(() => {
    if (isPaused || reducedMotion) return;
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, reducedMotion, testimonials.length]);

  const currentItem = testimonials[currentIndex];

  return (
    <section id="testimonials" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <SectionTitle
          index="05"
          label="Transmisi Klien & Mitra"
          title="Bukti Kolaborasi dari Pemimpin Rekayasa & Produk"
          subtitle="Umpan balik terverifikasi dari eksekutif teknologi dan pendiri perusahaan yang telah meluncurkan produk bersama kami."
          align="center"
        />

        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX === null) return;
            const deltaX = e.changedTouches[0].clientX - touchStartX;
            if (deltaX > 50) handlePrev();
            else if (deltaX < -50) handleNext();
            setTouchStartX(null);
          }}
          className="mx-auto max-w-4xl"
        >
          <GlassCard className="p-7 sm:p-10 md:p-12">
            <div className="flex flex-col justify-between gap-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-[#22d3ee]">
                  DAMPAK: {currentItem.dampakTerukur}
                </span>
                <Quote
                  aria-hidden="true"
                  className="h-8 w-8 text-[#8b5cf6]/40"
                />
              </div>

              <blockquote className="text-lg leading-relaxed font-medium text-[#f1f5f9] sm:text-xl">
                “{currentItem.kutipan}”
              </blockquote>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-full border border-[#22d3ee]/50 bg-[#05030f]">
                    <Image
                      src={currentItem.foto}
                      alt={currentItem.nama}
                      fill
                      sizes="56px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <p className="font-display text-base font-bold text-[#f1f5f9]">
                      {currentItem.nama}
                    </p>
                    <p className="text-xs text-[#94a3b8]">
                      {currentItem.jabatan} ·{' '}
                      <span className="text-[#22d3ee]">
                        {currentItem.organisasi}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Tombol Navigasi Panah & Indikator Titik */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Testimoni sebelumnya"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[#f1f5f9] transition-colors hover:border-[#22d3ee] hover:text-[#22d3ee] cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Testimoni berikutnya"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[#f1f5f9] transition-colors hover:border-[#22d3ee] hover:text-[#22d3ee] cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Indikator Titik Posisi Aktif */}
          <div className="mt-6 flex items-center justify-center gap-2.5">
            {testimonials.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Tampilkan testimoni ${idx + 1} dari ${item.nama}`}
                aria-current={currentIndex === idx}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'w-8 bg-[#22d3ee]'
                    : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
