'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Disc3,
  Music2,
  Pause,
  Play,
  RotateCcw,
  Upload,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { portfolioData } from '@/data/portfolio';

type SynthArrangement = 'ballad' | 'harp' | 'orchestra';

// Tangga nada & progresi kord "Hakikat Sebuah Cinta" (A Minor Slow Rock Ballad — 72 BPM)
// Progresi: Am -> Dm -> G -> C -> F -> Dm -> E7 -> Am
const BALLAD_SEQUENCE: {
  leadFreq: number;
  bassFreq: number;
  chordFreqs: number[];
  durationSec: number;
}[] = [
  // Frasa 1: Am (A4 - C5 - E5 - D5 - C5 - B4)
  { leadFreq: 440.0, bassFreq: 110.0, chordFreqs: [220.0, 261.63, 329.63], durationSec: 1.0 },
  { leadFreq: 523.25, bassFreq: 110.0, chordFreqs: [220.0, 261.63, 329.63], durationSec: 1.0 },
  { leadFreq: 659.25, bassFreq: 110.0, chordFreqs: [220.0, 261.63, 329.63], durationSec: 1.5 },
  { leadFreq: 587.33, bassFreq: 110.0, chordFreqs: [220.0, 261.63, 329.63], durationSec: 0.5 },
  // Frasa 2: Dm (F5 - E5 - D5 - A4)
  { leadFreq: 698.46, bassFreq: 146.83, chordFreqs: [293.66, 349.23, 440.0], durationSec: 1.2 },
  { leadFreq: 659.25, bassFreq: 146.83, chordFreqs: [293.66, 349.23, 440.0], durationSec: 0.8 },
  { leadFreq: 587.33, bassFreq: 146.83, chordFreqs: [293.66, 349.23, 440.0], durationSec: 1.5 },
  { leadFreq: 440.0, bassFreq: 146.83, chordFreqs: [293.66, 349.23, 440.0], durationSec: 0.5 },
  // Frasa 3: G Major (B4 - D5 - G5 - F5 - E5)
  { leadFreq: 493.88, bassFreq: 98.0, chordFreqs: [196.0, 246.94, 293.66], durationSec: 1.0 },
  { leadFreq: 587.33, bassFreq: 98.0, chordFreqs: [196.0, 246.94, 293.66], durationSec: 1.0 },
  { leadFreq: 783.99, bassFreq: 98.0, chordFreqs: [196.0, 246.94, 293.66], durationSec: 1.4 },
  { leadFreq: 698.46, bassFreq: 98.0, chordFreqs: [196.0, 246.94, 293.66], durationSec: 0.6 },
  // Frasa 4: C Major -> E7 (E5 - C5 - B4)
  { leadFreq: 659.25, bassFreq: 130.81, chordFreqs: [261.63, 329.63, 392.0], durationSec: 2.0 },
  { leadFreq: 523.25, bassFreq: 164.81, chordFreqs: [246.94, 329.63, 415.3], durationSec: 1.0 },
  { leadFreq: 493.88, bassFreq: 164.81, chordFreqs: [246.94, 329.63, 415.3], durationSec: 1.0 },
  // Frasa 5: Klimaks "Hakikat Sebuah Cinta" — F -> Dm -> E7 -> Am
  { leadFreq: 698.46, bassFreq: 87.31, chordFreqs: [174.61, 220.0, 261.63], durationSec: 1.5 },
  { leadFreq: 659.25, bassFreq: 87.31, chordFreqs: [174.61, 220.0, 261.63], durationSec: 0.5 },
  { leadFreq: 587.33, bassFreq: 146.83, chordFreqs: [293.66, 349.23, 440.0], durationSec: 1.2 },
  { leadFreq: 523.25, bassFreq: 146.83, chordFreqs: [293.66, 349.23, 440.0], durationSec: 0.8 },
  { leadFreq: 493.88, bassFreq: 164.81, chordFreqs: [246.94, 329.63, 415.3], durationSec: 1.5 },
  { leadFreq: 523.25, bassFreq: 164.81, chordFreqs: [246.94, 329.63, 415.3], durationSec: 0.5 },
  { leadFreq: 440.0, bassFreq: 110.0, chordFreqs: [220.0, 261.63, 329.63], durationSec: 2.0 },
];

/**
 * Pemutar Musik Kosmik UI/UX Pro Max — "Hakikat Sebuah Cinta"
 * Dilengkapi Web Audio API Polyphonic Synthesizer, 24-Bar Real-Time Spectrum Visualizer,
 * Lirik Sinkron, 3 Mode Instrumen, dan Pemutar Berkas/URL MP3 Kustom.
 */
export function MusicPlayer() {
  const { musicTrack } = portfolioData;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [arrangement, setArrangement] = useState<SynthArrangement>('ballad');
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [customTrackName, setCustomTrackName] = useState<string | null>(null);
  const [bars, setBars] = useState<number[]>(() => Array(20).fill(14));

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const stepIndexRef = useRef(0);
  const schedulerTimerRef = useRef<number>(0);
  const progressTimerRef = useRef<number>(0);
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const volumeRef = useRef(volume);
  volumeRef.current = isMuted ? 0 : volume;

  const arrangementRef = useRef(arrangement);
  arrangementRef.current = arrangement;

  // Pastikan AudioContext & AnalyserNode siap
  const ensureAudioEngine = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      const ctx = new AudioCtx();
      const masterGain = ctx.createGain();
      masterGain.gain.value = volumeRef.current * 0.35;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;

      masterGain.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = masterGain;
      analyserRef.current = analyser;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  // Mainkan satu langkah harmoni "Hakikat Sebuah Cinta"
  const triggerBalladNote = useCallback(
    (stepIdx: number) => {
      const ctx = ensureAudioEngine();
      const master = masterGainRef.current;
      if (!ctx || !master) return;

      const note = BALLAD_SEQUENCE[stepIdx % BALLAD_SEQUENCE.length];
      const now = ctx.currentTime;
      const dur = note.durationSec;
      const mode = arrangementRef.current;

      // 1. Lead Melodi (Gitar Slow-Rock / Synth Ballad dengan Vibrato Halus)
      const leadOsc = ctx.createOscillator();
      const leadFilter = ctx.createBiquadFilter();
      const leadGain = ctx.createGain();

      leadOsc.type =
        mode === 'ballad'
          ? 'sawtooth'
          : mode === 'harp'
            ? 'triangle'
            : 'sine';
      leadOsc.frequency.setValueAtTime(note.leadFreq, now);

      // Vibrato ekspresif pada nada panjang
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 5.2;
      lfoGain.gain.value = mode === 'ballad' ? 4.5 : 2.0;
      lfo.connect(leadOsc.frequency);
      lfo.start(now);
      lfo.stop(now + dur);

      leadFilter.type = 'lowpass';
      leadFilter.frequency.setValueAtTime(
        mode === 'ballad' ? 1650 : 2200,
        now,
      );

      leadGain.gain.setValueAtTime(0.001, now);
      leadGain.gain.linearRampToValueAtTime(0.28, now + 0.08);
      leadGain.gain.exponentialRampToValueAtTime(0.08, now + dur * 0.75);
      leadGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      leadOsc.connect(leadFilter);
      leadFilter.connect(leadGain);
      leadGain.connect(master);
      leadOsc.start(now);
      leadOsc.stop(now + dur + 0.02);

      // 2. Bassline Dalam (Sub-Bass A Minor)
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(note.bassFreq, now);
      bassGain.gain.setValueAtTime(0.001, now);
      bassGain.gain.linearRampToValueAtTime(0.26, now + 0.05);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      bassOsc.connect(bassGain);
      bassGain.connect(master);
      bassOsc.start(now);
      bassOsc.stop(now + dur + 0.02);

      // 3. Pad Harmoni & Arpeggio Kosmik
      note.chordFreqs.forEach((cFreq, idx) => {
        const padOsc = ctx.createOscillator();
        const padGain = ctx.createGain();
        padOsc.type = mode === 'orchestra' ? 'sawtooth' : 'sine';
        padOsc.frequency.setValueAtTime(cFreq, now + idx * 0.06);

        padGain.gain.setValueAtTime(0.001, now + idx * 0.06);
        padGain.gain.linearRampToValueAtTime(
          mode === 'orchestra' ? 0.09 : 0.06,
          now + idx * 0.06 + 0.12,
        );
        padGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        padOsc.connect(padGain);
        padGain.connect(master);
        padOsc.start(now + idx * 0.06);
        padOsc.stop(now + dur + 0.03);
      });
    },
    [ensureAudioEngine],
  );

  // Loop penjadwalan sekuenser & pembaruan visualizer
  useEffect(() => {
    if (!isPlaying) {
      window.clearTimeout(schedulerTimerRef.current);
      window.clearInterval(progressTimerRef.current);
      setBars(Array(20).fill(14));
      return;
    }

    if (customAudioUrl && htmlAudioRef.current) {
      htmlAudioRef.current.volume = isMuted ? 0 : volume;
      htmlAudioRef.current.play().catch(() => {});
    } else {
      const scheduleNext = () => {
        const idx = stepIndexRef.current;
        const note = BALLAD_SEQUENCE[idx % BALLAD_SEQUENCE.length];
        triggerBalladNote(idx);
        stepIndexRef.current = (idx + 1) % BALLAD_SEQUENCE.length;
        schedulerTimerRef.current = window.setTimeout(
          scheduleNext,
          note.durationSec * 1000,
        );
      };
      scheduleNext();
    }

    progressTimerRef.current = window.setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.25;
        return next >= musicTrack.durasiDetik ? 0 : next;
      });

      if (analyserRef.current) {
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        const nextBars = Array.from({ length: 20 }, (_, i) => {
          const val = data[i % data.length] || 0;
          const fallbackWave =
            22 + Math.round(Math.abs(Math.sin(Date.now() * 0.006 + i * 0.5)) * 58);
          return val > 5 ? Math.max(16, Math.min(96, Math.round((val / 255) * 100))) : fallbackWave;
        });
        setBars(nextBars);
      } else {
        setBars(
          Array.from({ length: 20 }, (_, i) =>
            20 + Math.round(Math.abs(Math.sin(Date.now() * 0.007 + i * 0.45)) * 68),
          ),
        );
      }
    }, 250);

    return () => {
      window.clearTimeout(schedulerTimerRef.current);
      window.clearInterval(progressTimerRef.current);
    };
  }, [
    isPlaying,
    customAudioUrl,
    triggerBalladNote,
    musicTrack.durasiDetik,
    volume,
    isMuted,
  ]);

  // Sinkronkan volume master
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(
        (isMuted ? 0 : volume) * 0.35,
        audioCtxRef.current.currentTime,
      );
    }
    if (htmlAudioRef.current) {
      htmlAudioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (htmlAudioRef.current) htmlAudioRef.current.pause();
      setIsPlaying(false);
    } else {
      ensureAudioEngine();
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    stepIndexRef.current = 0;
    setCurrentTime(0);
    if (htmlAudioRef.current) {
      htmlAudioRef.current.currentTime = 0;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setCustomAudioUrl(objectUrl);
    setCustomTrackName(file.name.replace(/\.[^/.]+$/, ''));
    setCurrentTime(0);
    setIsPlaying(true);
  };

  // Cari baris lirik aktif berdasarkan currentTime
  const activeLyric =
    [...musicTrack.lirikSinkron]
      .reverse()
      .find((l) => currentTime >= l.waktuDetik) || musicTrack.lirikSinkron[0];

  const formatTime = (sec: number) => {
    const s = Math.floor(sec);
    const mins = Math.floor(s / 60);
    const rem = s % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <aside
      aria-label="Pemutar Musik Luar Angkasa - Hakikat Sebuah Cinta"
      className="fixed bottom-5 left-5 z-40 w-[calc(100vw-2.5rem)] max-w-[390px]"
    >
      {customAudioUrl && (
        <audio
          ref={htmlAudioRef}
          src={customAudioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="overflow-hidden rounded-[22px] border border-[#8b5cf6]/45 bg-[#0b0720]/95 shadow-[0_0_45px_rgba(139,92,246,0.32)]">
        {/* Header Bar Ringkas (Selalu Terlihat) */}
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] bg-[#130c33]/90 px-4 py-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <Disc3
              className={`h-5 w-5 shrink-0 text-[#22d3ee] ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            />
            <div className="truncate">
              <p className="truncate font-display text-xs font-bold tracking-wide text-[#f1f5f9]">
                {customTrackName || musicTrack.judul}
              </p>
              <p className="truncate font-mono text-[10px] text-[#22d3ee]">
                {isPlaying ? 'MEMUTAR DI ORBIT' : 'SIAP DIPUTAR'} · 72 BPM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleTogglePlay}
              aria-label={
                isPlaying
                  ? 'Jeda lagu Hakikat Sebuah Cinta'
                  : 'Putar lagu Hakikat Sebuah Cinta'
              }
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee] text-[#05030f] transition-transform active:scale-95 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              aria-label={
                isExpanded
                  ? 'Ciutkan panel pemutar musik'
                  : 'Bentangkan panel pemutar musik'
              }
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-[#cbd5e1] hover:border-[#22d3ee] hover:text-white cursor-pointer"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Panel Lengkap UI/UX Pro Max */}
        {isExpanded && (
          <div className="p-4 space-y-3.5">
            {/* Visualizer Spektrum 20-Bar Real-Time */}
            <div
              aria-hidden="true"
              className="flex h-11 items-end justify-between gap-1 rounded-xl border border-white/[0.06] bg-[#05030f] px-3 py-2"
            >
              {bars.map((heightPct, idx) => (
                <span
                  key={idx}
                  className="w-1.5 rounded-full bg-gradient-to-t from-[#8b5cf6] via-[#22d3ee] to-[#f472b6] transition-all duration-150"
                  style={{
                    height: `${isPlaying ? heightPct : 16}%`,
                    opacity: isPlaying ? 0.95 : 0.35,
                  }}
                />
              ))}
            </div>

            {/* Lirik & Narasi Sinkron "Hakikat Sebuah Cinta" */}
            <div className="rounded-xl border border-white/[0.07] bg-[#070414] px-3.5 py-2.5">
              <p className="font-sans text-xs font-semibold text-[#f1f5f9]">
                {activeLyric.baris}
              </p>
              <p className="mt-0.5 text-[11px] text-[#94a3b8]">
                {activeLyric.subteks}
              </p>
            </div>

            {/* Scrubber Durasi & Waktu */}
            <div>
              <input
                type="range"
                aria-label="Posisi waktu lagu Hakikat Sebuah Cinta"
                min={0}
                max={musicTrack.durasiDetik}
                step={1}
                value={Math.floor(currentTime)}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCurrentTime(val);
                  stepIndexRef.current = Math.floor(
                    (val / musicTrack.durasiDetik) * BALLAD_SEQUENCE.length,
                  );
                }}
                className="h-1.5 w-full accent-[#22d3ee] cursor-pointer"
              />
              <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-[#94a3b8] tabular-nums">
                <span>{formatTime(currentTime)}</span>
                <span>{musicTrack.kunciNada}</span>
                <span>{formatTime(musicTrack.durasiDetik)}</span>
              </div>
            </div>

            {/* Pemilih Aransemen Suara + Volume + Unggah MP3 */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1">
                {(
                  [
                    { id: 'ballad', label: 'Slow Rock' },
                    { id: 'harp', label: 'Harpa' },
                    { id: 'orchestra', label: 'Orkestra' },
                  ] as const
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => {
                      setCustomAudioUrl(null);
                      setCustomTrackName(null);
                      setArrangement(mode.id);
                    }}
                    className={`rounded-lg px-2.5 py-1 font-mono text-[10px] transition-colors cursor-pointer ${
                      !customAudioUrl && arrangement === mode.id
                        ? 'bg-[#8b5cf6] font-semibold text-white'
                        : 'bg-white/[0.04] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  aria-label="Ulangi lagu dari awal"
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-[#cbd5e1] hover:border-[#22d3ee] hover:text-[#22d3ee] cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsMuted((prev) => !prev)}
                  aria-label={isMuted ? 'Nyalakan suara musik' : 'Bisukan musik'}
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-[#cbd5e1] hover:border-[#22d3ee] hover:text-[#22d3ee] cursor-pointer"
                >
                  {isMuted ? (
                    <VolumeX className="h-3.5 w-3.5 text-[#f472b6]" />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5 text-[#22d3ee]" />
                  )}
                </button>

                <input
                  type="range"
                  aria-label="Volume musik"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setIsMuted(false);
                    setVolume(Number(e.target.value));
                  }}
                  className="h-1 w-14 accent-[#22d3ee] cursor-pointer"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Muat file MP3 Hakikat Sebuah Cinta dari perangkat Anda"
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[10px] text-[#cbd5e1] hover:border-[#22d3ee] hover:text-[#22d3ee] cursor-pointer"
                >
                  <Upload className="h-3 w-3" />
                  <span>MP3</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
