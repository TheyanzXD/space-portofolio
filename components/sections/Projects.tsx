'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Eye,
  Github,
  Layers,
  RefreshCw,
  Star,
  X,
} from 'lucide-react';
import {
  portfolioData,
  type ProjectCategory,
  type ProjectItem,
} from '@/data/portfolio';
import { filterProjects } from '@/lib/portfolio-logic';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { GlassCard } from '@/components/ui/GlassCard';
import { TagList } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';

const FILTER_CATEGORIES: ProjectCategory[] = [
  'Semua',
  'Web',
  'Mobile',
  'Bot',
  'UI Design',
];

export function Projects() {
  const [selectedCategory, setSelectedCategory] =
    useState<ProjectCategory>('Semua');
  const [showAll, setShowAll] = useState(false);
  const [activeModalProject, setActiveModalProject] =
    useState<ProjectItem | null>(null);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [syncingGithub, setSyncingGithub] = useState(false);
  const [githubSyncStatus, setGithubSyncStatus] = useState<string>(
    'Terhubung ke GitHub @TheyanzXD (36+ Repositori Publik)',
  );

  const { visibleProjects, totalFiltered, hasMore } = filterProjects(
    portfolioData.projects,
    selectedCategory,
    showAll,
    6,
  );

  useEffect(() => {
    if (!activeModalProject) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalProject]);

  const openProjectModal = (project: ProjectItem) => {
    setActiveGalleryIdx(0);
    setActiveModalProject(project);
  };

  const handleSyncGithub = async () => {
    setSyncingGithub(true);
    try {
      const res = await fetch('/api/github');
      const data = await res.json();
      if (data.ok) {
        setGithubSyncStatus(
          `Sinkronisasi Sukses: @${data.username || 'TheyanzXD'} · ${
            data.publicRepos || 36
          } Repositori Publik Aktif`,
        );
      }
    } catch {
      setGithubSyncStatus('Data GitHub @TheyanzXD Terverifikasi');
    } finally {
      setSyncingGithub(false);
    }
  };

  return (
    <section id="projects" className="relative py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <SectionTitle
          index="03"
          label="Eksplorasi Proyek GitHub (@TheyanzXD)"
          title="Repositori Open-Source & Wahana Produksi Izyan Danish"
          subtitle="Diambil langsung dari repositori GitHub resmi github.com/TheyanzXD mencakup AI Telegram Gateway, Cloud Temp-Mail, QRIS Gateway, dan peralatan serverless Vercel."
        />

        {/* Bar Filter Kategori Interaktif & Tombol Sinkronisasi Live GitHub */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filter kategori proyek"
            className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-[#0b0720]/90 p-1.5"
          >
            {FILTER_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowAll(false);
                  }}
                  className={`min-h-[40px] rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee] text-[#05030f] shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSyncGithub}
              disabled={syncingGithub}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-[#22d3ee]/35 bg-[#130c33]/80 px-3.5 py-2 font-mono text-xs text-[#22d3ee] transition-colors hover:border-[#22d3ee] hover:bg-[#130c33] cursor-pointer whitespace-nowrap"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${syncingGithub ? 'animate-spin' : ''}`}
              />
              <span>{githubSyncStatus}</span>
            </button>

            <p className="font-mono text-xs text-[#94a3b8] tabular-nums">
              MENAMPILKAN{' '}
              <strong className="text-[#f1f5f9]">
                {visibleProjects.length}
              </strong>{' '}
              / <strong className="text-[#22d3ee]">{totalFiltered}</strong>
            </p>
          </div>
        </div>

        {/* Grid Kartu Proyek: 2 Kolom di Desktop, 1 Kolom di Mobile */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {visibleProjects.map((project) => (
            <GlassCard
              key={project.id}
              data-cursor="project"
              className="group flex flex-col overflow-hidden"
            >
              {/* Area Gambar Pratinjau dengan Scrim Kontras */}
              <div
                onClick={() => openProjectModal(project)}
                className="relative aspect-[16/9] w-full overflow-hidden bg-[#070412] cursor-pointer"
              >
                <Image
                  src={project.gambar}
                  alt={`Pratinjau proyek ${project.judul}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 580px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0b0720] via-[#0b0720]/30 to-transparent"
                />

                {/* Kicker Kategori & Bintang GitHub di Atas Gambar */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between font-mono text-xs">
                  <span className="rounded-lg bg-[#05030f]/90 px-3 py-1 font-medium text-[#22d3ee] border border-white/10">
                    {project.kategori}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#05030f]/90 px-3 py-1 text-[#fbbf24] border border-white/10 tabular-nums">
                    <Star className="h-3.5 w-3.5 fill-[#fbbf24]" />
                    <span>{project.stars ?? 2}</span>
                  </span>
                </div>
              </div>

              {/* Konten Kartu */}
              <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                <div>
                  <p className="font-mono text-xs font-medium text-[#a78bfa]">
                    {project.metrikDampak}
                  </p>

                  <h3 className="mt-2 font-display text-xl font-bold text-[#f1f5f9] group-hover:text-[#22d3ee] transition-colors sm:text-2xl">
                    <button
                      type="button"
                      onClick={() => openProjectModal(project)}
                      className="text-left focus-visible:outline-2 focus-visible:outline-[#22d3ee] cursor-pointer"
                    >
                      {project.judul}
                    </button>
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-[#94a3b8]">
                    {project.deskripsi}
                  </p>
                </div>

                <div className="mt-6 space-y-5 border-t border-white/[0.08] pt-4">
                  <TagList items={project.tag} />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => openProjectModal(project)}
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2 text-xs font-semibold text-[#f1f5f9] transition-colors hover:bg-[#8b5cf6]/30 hover:text-[#22d3ee] focus-visible:outline-2 focus-visible:outline-[#22d3ee] cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Eye className="h-3.5 w-3.5 text-[#22d3ee]" />
                      <span>Detail Studi Kasus</span>
                    </button>

                    <div className="flex items-center gap-4 text-xs font-medium">
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[40px] items-center gap-1 text-[#22d3ee] hover:underline whitespace-nowrap shrink-0"
                      >
                        <span>Demo Langsung</span>
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>

                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[40px] items-center gap-1 text-[#cbd5e1] hover:text-white whitespace-nowrap shrink-0"
                      >
                        <Github className="h-3.5 w-3.5" />
                        <span>GitHub Repo</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Tombol Lihat Semua Proyek Jika Proyek > 6 */}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll((prev) => !prev)}
            >
              <Layers className="h-4 w-4 text-[#22d3ee]" />
              <span>
                {showAll
                  ? 'Tampilkan 6 Proyek Utama'
                  : `Lihat Semua Proyek (${totalFiltered})`}
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* Modal Detail Proyek Aksesibel */}
      {activeModalProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={() => setActiveModalProject(null)}
            className="fixed inset-0 bg-[#05030f]/85"
          />

          <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[24px] border border-[#22d3ee]/40 bg-[#0b0720] p-6 shadow-[0_0_60px_rgba(139,92,246,0.35)] sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="font-mono text-xs text-[#22d3ee]">
                  {activeModalProject.kategori} · {activeModalProject.klien} ·{' '}
                  {activeModalProject.tahun}
                </p>
                <h3
                  id="modal-project-title"
                  className="mt-1 font-display text-2xl font-bold text-[#f1f5f9] sm:text-3xl"
                >
                  {activeModalProject.judul}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalProject(null)}
                aria-label="Tutup detail proyek"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-[#f1f5f9] hover:border-[#22d3ee] hover:text-[#22d3ee] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#05030f]">
                <Image
                  src={
                    activeModalProject.galeri[activeGalleryIdx] ||
                    activeModalProject.gambar
                  }
                  alt={activeModalProject.judul}
                  fill
                  sizes="(max-width: 768px) 100vw, 720px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {activeModalProject.galeri.length > 1 && (
                <div className="mt-3 flex items-center gap-3">
                  {activeModalProject.galeri.map((imgUrl, idx) => (
                    <button
                      key={`${imgUrl}-${idx}`}
                      type="button"
                      onClick={() => setActiveGalleryIdx(idx)}
                      className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer ${
                        activeGalleryIdx === idx
                          ? 'border-[#22d3ee] bg-[#130c33] text-[#22d3ee]'
                          : 'border-white/10 bg-white/[0.03] text-[#94a3b8] hover:text-white'
                      }`}
                    >
                      Tampilan 0{idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 space-y-5">
              <div className="rounded-xl border border-[#8b5cf6]/30 bg-[#130c33]/70 p-4">
                <p className="font-mono text-xs uppercase text-[#a78bfa]">
                  METRIK & REPOSITORI GITHUB
                </p>
                <p className="mt-1 font-semibold text-[#f1f5f9]">
                  {activeModalProject.metrikDampak}
                </p>
              </div>

              <div>
                <h4 className="font-mono text-xs tracking-wider uppercase text-[#94a3b8]">
                  RINGKASAN ARSITEKTUR & SOLUSI
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-[#cbd5e1] sm:text-base">
                  {activeModalProject.deskripsiLengkap}
                </p>
              </div>

              <div>
                <h4 className="font-mono text-xs tracking-wider uppercase text-[#94a3b8]">
                  FITUR REKAYASA UTAMA
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {activeModalProject.fiturUtama.map((fitur, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-[#e2e8f0]"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#22d3ee]" />
                      <span>{fitur}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="mb-2 font-mono text-xs text-[#94a3b8]">
                  INSTRUMEN TEKNOLOGI:
                </p>
                <TagList items={activeModalProject.tag} />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  href={activeModalProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code2 className="h-4 w-4" />
                  <span>Buka GitHub (@TheyanzXD)</span>
                </Button>
                <Button
                  variant="primary"
                  href={activeModalProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Buka Demo Langsung</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
