import { NextRequest, NextResponse } from 'next/server';
import {
  checkRateLimit,
  validateContactInput,
  type ContactFormInput,
} from '@/lib/portfolio-logic';

const rateLimitStore = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor
      ? forwardedFor.split(',')[0].trim()
      : 'local-client';

    const rateStatus = checkRateLimit(
      clientIp,
      rateLimitStore,
      Date.now(),
      60_000,
      5,
    );

    if (!rateStatus.allowed) {
      return NextResponse.json(
        {
          ok: false,
          message: `Terlalu banyak transmisi dalam waktu singkat. Silakan coba lagi dalam ${rateStatus.retryAfterSeconds} detik.`,
        },
        { status: 429 },
      );
    }

    const body = (await req.json()) as Partial<ContactFormInput>;
    const validation = validateContactInput({
      nama: body.nama ?? '',
      email: body.email ?? '',
      subjek: body.subjek ?? '',
      pesan: body.pesan ?? '',
      honeypot: body.honeypot ?? '',
    });

    // Jika terdeteksi bot honeypot, kembalikan respons sukses semu agar bot tidak mencoba ulang
    if (validation.isSpam) {
      return NextResponse.json({
        ok: true,
        transmissionId: 'TX-FILTERED',
        message: 'Transmisi diterima.',
      });
    }

    if (!validation.valid) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Mohon periksa kembali kolom formulir yang belum sesuai.',
          errors: validation.errors,
        },
        { status: 400 },
      );
    }

    const transmissionId = `AETH-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      ok: true,
      transmissionId,
      receivedAt: new Date().toISOString(),
      message: `Transmisi berhasil dikirim ke Stasiun Komando! ID Transmisi: ${transmissionId}`,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: 'Terjadi gangguan sinyal saat memproses pesan Anda. Silakan coba sesaat lagi.',
      },
      { status: 500 },
    );
  }
}
