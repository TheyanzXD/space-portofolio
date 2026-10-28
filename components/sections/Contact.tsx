'use client';

import React, { useRef, useState } from 'react';
import {
  Check,
  Copy,
  Globe,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Rocket,
  Send,
} from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import {
  validateContactInput,
  type ContactValidationResult,
} from '@/lib/portfolio-logic';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

export function Contact() {
  const { profile, socials } = portfolioData;
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [subjek, setSubjek] = useState('');
  const [pesan, setPesan] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [errors, setErrors] = useState<ContactValidationResult['errors']>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
    transmissionId?: string;
  }>({ type: 'idle', message: '' });

  const namaRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjekRef = useRef<HTMLInputElement>(null);
  const pesanRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      window.setTimeout(() => {
        setCopiedField(null);
      }, 2200);
    } catch {
      setCopiedField(label);
      window.setTimeout(() => {
        setCopiedField(null);
      }, 2200);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateContactInput({
      nama,
      email,
      subjek,
      pesan,
      honeypot,
    });

    if (!validation.valid && !validation.isSpam) {
      setErrors(validation.errors);
      // Pindahkan fokus ke kolom error pertama untuk aksesibilitas
      if (validation.errors.nama) namaRef.current?.focus();
      else if (validation.errors.email) emailRef.current?.focus();
      else if (validation.errors.subjek) subjekRef.current?.focus();
      else if (validation.errors.pesan) pesanRef.current?.focus();
      return;
    }

    setErrors({});
    setSubmitting(true);
    setSubmitStatus({ type: 'idle', message: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, subjek, pesan, honeypot }),
      });

      const data = (await res.json()) as {
        ok: boolean;
        message: string;
        transmissionId?: string;
        errors?: ContactValidationResult['errors'];
      };

      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        setSubmitStatus({
          type: 'error',
          message:
            data.message || 'Gagal mengirim pesan. Silakan periksa input Anda.',
        });
      } else {
        setSubmitStatus({
          type: 'success',
          message: data.message,
          transmissionId: data.transmissionId,
        });
        setNama('');
        setEmail('');
        setSubjek('');
        setPesan('');
      }
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-20 sm:py-28 lg:py-32"
    >
      {/* Dekorasi Latar Belakang: Bumi, Bulan, dan Satelit Mengorbit */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 -z-10 h-[420px] w-[420px] translate-x-1/4 translate-y-1/4 opacity-25"
      >
        <div className="relative h-full w-full rounded-full border border-[#22d3ee]/40 bg-gradient-to-tr from-[#05030f] via-[#1e3a8a] to-[#22d3ee] shadow-[0_0_90px_rgba(34,211,238,0.4)]">
          <div className="absolute -inset-12 rounded-full border border-dashed border-[#a78bfa]/45 animate-[spin_40s_linear_infinite]">
            <span className="absolute top-0 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e2e8f0] shadow-[0_0_16px_#ffffff]" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <SectionTitle
          index="06"
          label="Frekuensi Transmisi"
          title="Mari Berkolaborasi Membangun Produk Luar Biasa"
          subtitle="Siap mendiskusikan arsitektur web baru, peningkatan performa aplikasi, atau eksplorasi antarmuka 3D? Kirimkan transmisi langsung ke stasiun kami."
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Kolom Kiri: Info Kontak & Tombol Salin Cepat */}
          <div className="space-y-5 lg:col-span-5">
            <GlassCard className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#22d3ee]/30 bg-[#130c33] text-[#22d3ee]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase text-[#94a3b8]">
                      SURAT ELEKTRONIK
                    </p>
                    <p className="mt-1 font-medium text-[#f1f5f9] break-all">
                      {profile.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy('email', profile.email)}
                  aria-label="Salin alamat email"
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-[#cbd5e1] transition-colors hover:border-[#22d3ee] hover:text-[#22d3ee] cursor-pointer shrink-0"
                >
                  {copiedField === 'email' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#22d3ee]" />
                      <span className="text-[#22d3ee]">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#8b5cf6]/30 bg-[#130c33] text-[#a78bfa]">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase text-[#94a3b8]">
                      TELEGRAM LANGSUNG
                    </p>
                    <p className="mt-1 font-mono font-medium text-[#f1f5f9] tabular-nums">
                      {profile.whatsapp}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy('whatsapp', profile.telegramHandle)}
                  aria-label="Salin username Telegram @YanOZX"
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-[#cbd5e1] transition-colors hover:border-[#22d3ee] hover:text-[#22d3ee] cursor-pointer shrink-0"
                >
                  {copiedField === 'whatsapp' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#22d3ee]" />
                      <span className="text-[#22d3ee]">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#f472b6]/30 bg-[#130c33] text-[#f472b6]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase text-[#94a3b8]">
                    STASIUN BUMI & ZONA WAKTU
                  </p>
                  <p className="mt-1 font-medium text-[#f1f5f9]">
                    {profile.lokasi}
                  </p>
                  <p className="mt-1 font-mono text-xs text-[#22d3ee]">
                    {profile.koordinat}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Kanal Sosial Media */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0b0720]/85 p-6">
              <p className="font-mono text-xs uppercase text-[#94a3b8]">
                JARINGAN KOMUNIKASI ORBITAL
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {socials.map((soc) => (
                  <a
                    key={soc.nama}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/15 bg-[#130c33]/70 px-4 py-2 text-xs font-medium text-[#f1f5f9] transition-all hover:-translate-y-1 hover:border-[#22d3ee] hover:text-[#22d3ee] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                  >
                    <Globe className="h-3.5 w-3.5 text-[#22d3ee]" />
                    <span>{soc.nama}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Formulir Transmisi Pesan */}
          <div className="lg:col-span-7">
            <GlassCard className="p-6 sm:p-8 md:p-10" hoverLift={false}>
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Honeypot tersembunyi untuk anti-spam bot */}
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="website_url_hp">Jangan diisi jika manusia</label>
                  <input
                    id="website_url_hp"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Input Nama */}
                  <div>
                    <label
                      htmlFor="contact-nama"
                      className="block font-mono text-xs font-medium uppercase tracking-wider text-[#cbd5e1]"
                    >
                      Nama Lengkap *
                    </label>
                    <input
                      ref={namaRef}
                      id="contact-nama"
                      name="nama"
                      type="text"
                      required
                      value={nama}
                      onChange={(e) => {
                        setNama(e.target.value);
                        if (errors.nama)
                          setErrors((prev) => ({ ...prev, nama: undefined }));
                      }}
                      placeholder="Contoh: Budi Santoso"
                      aria-invalid={Boolean(errors.nama)}
                      aria-describedby={
                        errors.nama ? 'error-contact-nama' : undefined
                      }
                      className="mt-2 w-full rounded-[14px] border border-white/15 bg-[#05030f]/90 px-4 py-3 text-sm text-[#f1f5f9] placeholder-[#64748b] transition-colors focus:border-[#22d3ee] focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/30"
                    />
                    {errors.nama && (
                      <p
                        id="error-contact-nama"
                        role="alert"
                        className="mt-1.5 text-xs text-[#f472b6]"
                      >
                        {errors.nama}
                      </p>
                    )}
                  </div>

                  {/* Input Email */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block font-mono text-xs font-medium uppercase tracking-wider text-[#cbd5e1]"
                    >
                      Alamat Email *
                    </label>
                    <input
                      ref={emailRef}
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email)
                          setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder="nama@perusahaan.com"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? 'error-contact-email' : undefined
                      }
                      className="mt-2 w-full rounded-[14px] border border-white/15 bg-[#05030f]/90 px-4 py-3 text-sm text-[#f1f5f9] placeholder-[#64748b] transition-colors focus:border-[#22d3ee] focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/30"
                    />
                    {errors.email && (
                      <p
                        id="error-contact-email"
                        role="alert"
                        className="mt-1.5 text-xs text-[#f472b6]"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Input Subjek */}
                <div>
                  <label
                    htmlFor="contact-subjek"
                    className="block font-mono text-xs font-medium uppercase tracking-wider text-[#cbd5e1]"
                  >
                    Subjek Misi / Proyek *
                  </label>
                  <input
                    ref={subjekRef}
                    id="contact-subjek"
                    name="subjek"
                    type="text"
                    required
                    value={subjek}
                    onChange={(e) => {
                      setSubjek(e.target.value);
                      if (errors.subjek)
                        setErrors((prev) => ({ ...prev, subjek: undefined }));
                    }}
                    placeholder="Pengembangan Platform SaaS / Aplikasi Web 3D"
                    aria-invalid={Boolean(errors.subjek)}
                    aria-describedby={
                      errors.subjek ? 'error-contact-subjek' : undefined
                    }
                    className="mt-2 w-full rounded-[14px] border border-white/15 bg-[#05030f]/90 px-4 py-3 text-sm text-[#f1f5f9] placeholder-[#64748b] transition-colors focus:border-[#22d3ee] focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/30"
                  />
                  {errors.subjek && (
                    <p
                      id="error-contact-subjek"
                      role="alert"
                      className="mt-1.5 text-xs text-[#f472b6]"
                    >
                      {errors.subjek}
                    </p>
                  )}
                </div>

                {/* Input Pesan */}
                <div>
                  <label
                    htmlFor="contact-pesan"
                    className="block font-mono text-xs font-medium uppercase tracking-wider text-[#cbd5e1]"
                  >
                    Detail Transmisi Pesan *
                  </label>
                  <textarea
                    ref={pesanRef}
                    id="contact-pesan"
                    name="pesan"
                    rows={4}
                    required
                    value={pesan}
                    onChange={(e) => {
                      setPesan(e.target.value);
                      if (errors.pesan)
                        setErrors((prev) => ({ ...prev, pesan: undefined }));
                    }}
                    placeholder="Ceritakan tujuan produk, jadwal peluncuran, atau kebutuhan teknis tim Anda..."
                    aria-invalid={Boolean(errors.pesan)}
                    aria-describedby={
                      errors.pesan ? 'error-contact-pesan' : undefined
                    }
                    className="mt-2 w-full rounded-[14px] border border-white/15 bg-[#05030f]/90 px-4 py-3 text-sm text-[#f1f5f9] placeholder-[#64748b] transition-colors focus:border-[#22d3ee] focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/30"
                  />
                  {errors.pesan && (
                    <p
                      id="error-contact-pesan"
                      role="alert"
                      className="mt-1.5 text-xs text-[#f472b6]"
                    >
                      {errors.pesan}
                    </p>
                  )}
                </div>

                {/* Status Hasil Pengiriman */}
                {submitStatus.type !== 'idle' && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
                      submitStatus.type === 'success'
                        ? 'border-[#22d3ee]/50 bg-[#130c33] text-[#f1f5f9]'
                        : 'border-[#f472b6]/50 bg-[#f472b6]/10 text-[#f472b6]'
                    }`}
                  >
                    {submitStatus.type === 'success' && (
                      <Rocket className="mt-0.5 h-5 w-5 shrink-0 text-[#22d3ee]" />
                    )}
                    <div>
                      <p className="font-medium">{submitStatus.message}</p>
                      {submitStatus.transmissionId && (
                        <p className="mt-1 font-mono text-xs text-[#22d3ee]">
                          KODE PELACAKAN: {submitStatus.transmissionId}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 pt-2">
                  <p className="font-mono text-xs text-[#94a3b8]">
                    Waktu respons rata-rata: &lt; 24 Jam Kerja
                  </p>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Mengirim Transmisi...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Kirim Pesan</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
