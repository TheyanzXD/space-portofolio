'use client';

import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  FileText,
  Printer,
  Rocket,
  Terminal,
  X,
} from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { Button } from '@/components/ui/Button';

export interface GuideAndCvModalProps {
  mode: 'closed' | 'cv' | 'vercel';
  onClose: () => void;
}

/**
 * Modal serbaguna untuk:
 * 1) Ringkasan CV / Resume yang siap dicetak/diunduh
 * 2) Panduan Lengkap Menjalankan Lokal & Deploy ke Vercel + Daftar Bagian Kustomisasi
 */
export function GuideAndCvModal({ mode, onClose }: GuideAndCvModalProps) {
  const [activeTab, setActiveTab] = useState<'cv' | 'vercel'>('cv');

  useEffect(() => {
    if (mode === 'cv') setActiveTab('cv');
    else if (mode === 'vercel') setActiveTab('vercel');
  }, [mode]);

  useEffect(() => {
    if (mode === 'closed') return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mode, onClose]);

  if (mode === 'closed') return null;

  const { profile, experience, skills, vercelGuide } = portfolioData;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
      className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-6"
    >
      <div onClick={onClose} className="fixed inset-0 bg-[#05030f]/85" />

      <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[24px] border border-[#22d3ee]/40 bg-[#0b0720] p-6 shadow-[0_0_60px_rgba(139,92,246,0.35)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('cv')}
              className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'cv'
                  ? 'bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee] text-[#05030f]'
                  : 'bg-white/[0.04] text-[#94a3b8] hover:text-white'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Curriculum Vitae (CV)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('vercel')}
              className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'vercel'
                  ? 'bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee] text-[#05030f]'
                  : 'bg-white/[0.04] text-[#94a3b8] hover:text-white'
              }`}
            >
              <Terminal className="h-4 w-4" />
              <span>Panduan Deploy Vercel & Lokal</span>
            </button>

            <a
              href="/izyan-space-portfolio.zip"
              download="izyan-space-portfolio.zip"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-[#22d3ee]/45 bg-[#130c33] px-4 py-2 text-xs font-semibold text-[#22d3ee] transition-colors hover:bg-[#22d3ee]/20 hover:text-white"
            >
              <span>Unduh Semua File (.ZIP)</span>
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela dokumen"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-[#f1f5f9] hover:border-[#22d3ee] hover:text-[#22d3ee] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {activeTab === 'cv' ? (
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-white/10 bg-[#05030f] p-6">
              <div>
                <h3
                  id="guide-modal-title"
                  className="font-display text-2xl font-bold text-[#f1f5f9]"
                >
                  {profile.nama}
                </h3>
                <p className="mt-1 font-mono text-sm text-[#22d3ee]">
                  {profile.profesi.join(' · ')}
                </p>
                <p className="mt-2 text-xs text-[#94a3b8]">
                  {profile.lokasi} · {profile.email} · {profile.whatsapp}
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4" />
                <span>Cetak / Simpan PDF</span>
              </Button>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#22d3ee]">
                RINGKASAN EKSEKUTIF
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-[#cbd5e1]">
                {profile.bio.join(' ')}
              </p>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#22d3ee]">
                PENGALAMAN REKAYASA & PENDIDIKAN
              </h4>
              <div className="mt-3 space-y-4">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-[#f1f5f9]">
                        {exp.posisi} —{' '}
                        <span className="text-[#a78bfa]">{exp.organisasi}</span>
                      </p>
                      <span className="font-mono text-xs text-[#94a3b8]">
                        {exp.periode}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-[#cbd5e1]">
                      {exp.poinPencapaian.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#22d3ee]">
                KOMPETENSI INTI
              </h4>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {skills.map((cat) => (
                  <div
                    key={cat.id}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5"
                  >
                    <p className="font-mono text-xs font-semibold text-[#f1f5f9]">
                      {cat.nama}
                    </p>
                    <p className="mt-1 text-xs text-[#94a3b8]">
                      {cat.daftarSkill
                        .map((s) => `${s.nama} (${s.level}%)`)
                        .join(' · ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <div>
              <h3
                id="guide-modal-title"
                className="font-display text-2xl font-bold text-[#f1f5f9]"
              >
                Panduan Menjalankan Lokal & Deploy ke Vercel
              </h3>
              <p className="mt-1 text-sm text-[#94a3b8]">
                Ikuti langkah-langkah berikut untuk menjalankan kode secara
                lokal, memverifikasi unit test, dan mengunggahnya ke Vercel.
              </p>
            </div>

            {/* Langkah Menjalankan Lokal */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#22d3ee]">
                A. CARA MENJALANKAN DI KOMPUTER LOKAL
              </h4>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {vercelGuide.langkahLokal.map((step) => (
                  <div
                    key={step.judul}
                    className="rounded-xl border border-white/10 bg-[#05030f] p-4"
                  >
                    <p className="text-xs font-semibold text-[#f1f5f9]">
                      {step.judul}
                    </p>
                    <code className="mt-2 block rounded-lg bg-[#130c33] px-3 py-2 font-mono text-xs text-[#22d3ee]">
                      {step.perintah}
                    </code>
                    <p className="mt-2 text-xs text-[#94a3b8]">
                      {step.keterangan}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Langkah Deploy ke Vercel */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#22d3ee]">
                B. LANGKAH DEPLOY KE VERCEL (SIAP PRODUKSI)
              </h4>
              <div className="mt-3 space-y-3">
                {vercelGuide.langkahVercel.map((v) => (
                  <div
                    key={v.nomor}
                    className="flex items-start gap-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#8b5cf6]/25 font-mono text-xs font-bold text-[#22d3ee]">
                      {v.nomor}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#f1f5f9]">
                        {v.judul}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[#cbd5e1]">
                        {v.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daftar Bagian yang Harus Diganti Pemilik */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#22d3ee]">
                C. DAFTAR BAGIAN YANG DAPAT DIGANTI PEMILIK (/data/portfolio.ts)
              </h4>
              <div className="mt-3 space-y-2.5">
                {vercelGuide.bagianDiganti.map((item) => (
                  <div
                    key={item.bagian}
                    className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-[#05030f] p-3.5"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#22d3ee]" />
                    <div className="text-xs">
                      <span className="font-semibold text-[#f1f5f9]">
                        {item.bagian}
                      </span>{' '}
                      <span className="font-mono text-[#a78bfa]">
                        ({item.lokasiBaris})
                      </span>
                      <p className="mt-1 text-[#94a3b8]">{item.keterangan}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" onClick={onClose}>
                <Rocket className="h-4 w-4" />
                <span>Mengerti & Kembali Menjelajah</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
