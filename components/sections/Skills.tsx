'use client';

import React, { useState } from 'react';
import { Orbit, Sparkles } from 'lucide-react';
import {
  portfolioData,
  type SkillCategory,
  type SkillItem,
} from '@/data/portfolio';
import {
  computeSkillSummary,
  filterSkillCategories,
} from '@/lib/portfolio-logic';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { GlassCard } from '@/components/ui/GlassCard';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const CATEGORY_TABS: ('Semua' | SkillCategory['id'])[] = [
  'Semua',
  'Frontend',
  'Backend',
  'Tools',
  'Design',
];

export function Skills() {
  const reducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<
    'Semua' | SkillCategory['id']
  >('Semua');
  const [selectedSkill, setSelectedSkill] = useState<{
    skill: SkillItem;
    categoryName: string;
    color: string;
  }>({
    skill: portfolioData.skills[0].daftarSkill[0],
    categoryName: portfolioData.skills[0].nama,
    color: portfolioData.skills[0].warna,
  });
  const [isOrbitPaused, setIsOrbitPaused] = useState(false);

  const filteredCategories = filterSkillCategories(
    portfolioData.skills,
    activeCategory,
  );
  const summary = computeSkillSummary(filteredCategories);

  return (
    <section id="skills" className="relative py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <SectionTitle
          index="02"
          label="Sistem Tata Surya Keahlian"
          title="Peta Navigasi Teknologi & Instrumen Rekayasa"
          subtitle="Setiap orbit merepresentasikan lapisan spesialisasi teknis. Arahkan kursor atau klik planet teknologi untuk memeriksa level penguasaan dan tahun pengalaman."
        />

        {/* Tombol Filter Kategori Orbit */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filter kategori keahlian"
            className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-[#0b0720]/90 p-1.5"
          >
            {CATEGORY_TABS.map((tab) => {
              const isSelected = activeCategory === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveCategory(tab)}
                  className={`min-h-[40px] rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee] text-[#05030f] shadow-[0_0_20px_rgba(34,211,238,0.35)]'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Ringkasan Telemetri Kuantitatif */}
          <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-[#94a3b8] tabular-nums">
            <span>
              TOTAL INSTRUMEN:{' '}
              <strong className="text-[#f1f5f9]">{summary.totalSkills}</strong>
            </span>
            <span>·</span>
            <span>
              RATA-RATA PENGUASAAN:{' '}
              <strong className="text-[#22d3ee]">{summary.averageLevel}%</strong>
            </span>
          </div>
        </div>

        {/* Visualisasi Sistem Tata Surya Interaktif (Desktop) + Panel Inspektur */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Panggung Orbit Tata Surya (Ditampilkan di layar >= md) */}
          <div
            onMouseEnter={() => setIsOrbitPaused(true)}
            onMouseLeave={() => setIsOrbitPaused(false)}
            className="relative hidden md:flex h-[620px] w-full items-center justify-center overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#070414]/90 lg:col-span-7"
          >
            {/* Inti Matahari Bercahaya di Tengah */}
            <div className="relative z-20 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-gradient-to-br from-[#fbbf24] via-[#f472b6] to-[#8b5cf6] p-2 text-center shadow-[0_0_50px_rgba(251,191,36,0.45)]">
              <Orbit className="h-5 w-5 text-[#05030f]" />
              <span className="mt-1 font-display text-[10px] font-bold tracking-wider text-[#05030f]">
                {portfolioData.profile.panggilan}
              </span>
            </div>

            {/* Lapisan Orbit */}
            {portfolioData.skills.map((category) => {
              const isHighlighted =
                activeCategory === 'Semua' || activeCategory === category.id;
              const diameter = category.orbitRadius * 2;

              return (
                <div
                  key={category.id}
                  style={{
                    width: `${diameter}px`,
                    height: `${diameter}px`,
                    opacity: isHighlighted ? 1 : 0.18,
                  }}
                  className="pointer-events-none absolute rounded-full border border-dashed border-white/15 transition-opacity duration-300"
                >
                  {/* Container Berputar untuk Planet Skill */}
                  <div
                    style={{
                      animation: reducedMotion
                        ? 'none'
                        : `spin ${category.orbitDuration}s linear infinite`,
                      animationPlayState: isOrbitPaused ? 'paused' : 'running',
                    }}
                    className="relative h-full w-full"
                  >
                    {category.daftarSkill.map((skill, sIdx) => {
                      const angleRad =
                        (sIdx / category.daftarSkill.length) * Math.PI * 2;
                      const x = Number(
                        (
                          Math.cos(angleRad) * category.orbitRadius +
                          category.orbitRadius
                        ).toFixed(2),
                      );
                      const y = Number(
                        (
                          Math.sin(angleRad) * category.orbitRadius +
                          category.orbitRadius
                        ).toFixed(2),
                      );
                      const isActiveSkill =
                        selectedSkill.skill.nama === skill.nama;

                      return (
                        <button
                          key={skill.nama}
                          type="button"
                          onClick={() =>
                            setSelectedSkill({
                              skill,
                              categoryName: category.nama,
                              color: category.warna,
                            })
                          }
                          onMouseEnter={() =>
                            setSelectedSkill({
                              skill,
                              categoryName: category.nama,
                              color: category.warna,
                            })
                          }
                          style={{
                            left: `${x}px`,
                            top: `${y}px`,
                            borderColor: category.warna,
                            boxShadow: isActiveSkill
                              ? `0 0 24px ${category.warna}`
                              : 'none',
                          }}
                          aria-label={`Inspeksi skill ${skill.nama} (${skill.level}%)`}
                          className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-full border bg-[#0b0720] px-3 py-1.5 text-xs font-medium text-[#f1f5f9] transition-transform hover:scale-125 focus-visible:outline-2 focus-visible:outline-[#22d3ee] cursor-pointer whitespace-nowrap"
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: category.warna }}
                          />
                          <span>{skill.nama}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="absolute bottom-4 left-5 font-mono text-[11px] text-[#94a3b8]">
              {isOrbitPaused
                ? 'STATUS ORBIT: DIJEDA (INSPEKSI AKTIF)'
                : 'STATUS ORBIT: ROTASI AKTIF (ARAHKAN KURSOR UNTUK JEDA)'}
            </div>
          </div>

          {/* Kolom Kanan: Kartu Inspektur Planet & Daftar Kartu Progress */}
          <div className="space-y-6 lg:col-span-5">
            {/* Panel Detail Planet Skill yang Dipilih */}
            <GlassCard className="p-6 border-[#22d3ee]/35">
              <div className="flex items-center justify-between font-mono text-xs text-[#22d3ee]">
                <span>TELEMETRI PLANET KEAHLIAN</span>
                <span>{selectedSkill.categoryName}</span>
              </div>

              <h3 className="mt-3 font-display text-2xl font-bold text-[#f1f5f9]">
                {selectedSkill.skill.nama}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[#cbd5e1]">
                {selectedSkill.skill.deskripsi}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 font-mono tabular-nums">
                <div>
                  <span className="block text-[11px] text-[#94a3b8]">
                    LEVEL PENGUASAAN
                  </span>
                  <span className="text-2xl font-bold text-[#22d3ee]">
                    {selectedSkill.skill.level}%
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-[#94a3b8]">
                    JAM TERBANG MISI
                  </span>
                  <span className="text-2xl font-bold text-[#f1f5f9]">
                    {selectedSkill.skill.tahun} Tahun
                  </span>
                </div>
              </div>

              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee] transition-all duration-500"
                  style={{ width: `${selectedSkill.skill.level}%` }}
                />
              </div>
            </GlassCard>

            {/* Daftar Kartu Progress untuk Semua Layar (Utama di Mobile & Aksesibilitas Keyboard) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 max-h-[380px] overflow-y-auto pr-1">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-2xl border border-white/[0.08] bg-[#0b0720]/85 p-4"
                >
                  <h4 className="mb-3 font-mono text-xs font-semibold tracking-wider uppercase text-[#a78bfa]">
                    Orbit {cat.nama}
                  </h4>
                  <div className="space-y-3">
                    {cat.daftarSkill.map((sk) => (
                      <button
                        key={sk.nama}
                        type="button"
                        onClick={() =>
                          setSelectedSkill({
                            skill: sk,
                            categoryName: cat.nama,
                            color: cat.warna,
                          })
                        }
                        className="w-full text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-[#22d3ee] rounded-lg p-1"
                      >
                        <div className="flex items-center justify-between text-xs font-medium text-[#f1f5f9] group-hover:text-[#22d3ee] tabular-nums">
                          <span>{sk.nama}</span>
                          <span className="font-mono text-[#94a3b8]">
                            {sk.level}% · {sk.tahun} thn
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${sk.level}%`,
                              backgroundColor: cat.warna,
                            }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Marquee Dua Baris Arah Berlawanan untuk Keahlian Tambahan */}
        <div className="mt-14 space-y-3 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#070414]/80 py-5">
          <div className="flex items-center gap-6 overflow-x-auto px-4 no-scrollbar">
            <div className="flex items-center gap-6 whitespace-nowrap font-mono text-xs text-[#cbd5e1]">
              {portfolioData.additionalSkills.map((tech, idx) => (
                <span key={`${tech}-${idx}`} className="inline-flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#22d3ee]" />
                  <span>{tech}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6 overflow-x-auto px-4 no-scrollbar">
            <div className="flex items-center gap-6 whitespace-nowrap font-mono text-xs text-[#94a3b8]">
              {[...portfolioData.additionalSkills].reverse().map((tech, idx) => (
                <span key={`rev-${tech}-${idx}`} className="inline-flex items-center gap-2">
                  <span className="text-[#8b5cf6]">·</span>
                  <span>{tech}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
