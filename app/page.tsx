'use client';

import React, { useState } from 'react';
import { StarField } from '@/components/canvas/StarField';
import { Loader } from '@/components/layout/Loader';
import { CustomCursor } from '@/components/layout/CustomCursor';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MusicPlayer } from '@/components/layout/MusicPlayer';
import { GuideAndCvModal } from '@/components/layout/GuideAndCvModal';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';
import { Experience } from '@/components/sections/Experience';
import { Testimonials } from '@/components/sections/Testimonials';
import { Contact } from '@/components/sections/Contact';
import { useSoundEffects } from '@/hooks/useSoundEffects';

export default function SpacePortfolioPage() {
  const [modalMode, setModalMode] = useState<'closed' | 'cv' | 'vercel'>(
    'closed',
  );
  const { soundEnabled, toggleSound, playClick, playWhoosh } =
    useSoundEffects();

  return (
    <div className="relative min-h-[100svh] w-full overflow-x-hidden">
      {/* Latar Belakang Bintang, Nebula & Bintang Jatuh Global */}
      <StarField />

      {/* Layar Muat Roket Meluncur */}
      <Loader />

      {/* Kursor Kustom Bintang & Cincin Orbital */}
      <CustomCursor />

      {/* Indikator Progress Gulir di Atas */}
      <ScrollProgress />

      {/* Navigasi Utama Sticky */}
      <Navbar onNavigate={playWhoosh} />

      {/* Pemutar Musik Kosmik UI/UX Pro Max: "Hakikat Sebuah Cinta" */}
      <MusicPlayer />

      {/* Konten Utama 7 Section */}
      <main id="main-content" className="relative z-10">
        <Hero
          onOpenCvModal={() => {
            playClick();
            setModalMode('vercel');
          }}
          onActionSound={playClick}
        />

        <div
          aria-hidden="true"
          className="mx-auto h-px max-w-[1000px] bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        <About
          onOpenCvModal={() => {
            playClick();
            setModalMode('cv');
          }}
        />

        <div
          aria-hidden="true"
          className="mx-auto h-px max-w-[1000px] bg-gradient-to-r from-transparent via-[#8b5cf6]/25 to-transparent"
        />

        <Skills />

        <div
          aria-hidden="true"
          className="mx-auto h-px max-w-[1000px] bg-gradient-to-r from-transparent via-[#22d3ee]/25 to-transparent"
        />

        <Projects />

        <div
          aria-hidden="true"
          className="mx-auto h-px max-w-[1000px] bg-gradient-to-r from-transparent via-[#f472b6]/25 to-transparent"
        />

        <Experience />

        <div
          aria-hidden="true"
          className="mx-auto h-px max-w-[1000px] bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        <Testimonials />

        <div
          aria-hidden="true"
          className="mx-auto h-px max-w-[1000px] bg-gradient-to-r from-transparent via-[#22d3ee]/25 to-transparent"
        />

        <Contact />
      </main>

      {/* Footer & Tombol Roket Kembali ke Atas */}
      <Footer
        onOpenVercelGuide={() => {
          playClick();
          setModalMode('vercel');
        }}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Modal CV & Panduan Deploy Vercel */}
      <GuideAndCvModal
        mode={modalMode}
        onClose={() => setModalMode('closed')}
      />
    </div>
  );
}
