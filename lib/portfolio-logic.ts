import type {
  ProjectCategory,
  ProjectItem,
  SkillCategory,
} from '../data/portfolio';

export interface ContactFormInput {
  nama: string;
  email: string;
  subjek: string;
  pesan: string;
  honeypot?: string;
}

export interface ContactValidationResult {
  valid: boolean;
  isSpam: boolean;
  errors: {
    nama?: string;
    email?: string;
    subjek?: string;
    pesan?: string;
  };
}

/**
 * Memfilter daftar proyek berdasarkan kategori dan batas tampilan awal.
 */
export function filterProjects(
  projects: ProjectItem[],
  category: ProjectCategory,
  showAll: boolean,
  initialLimit = 6,
): {
  visibleProjects: ProjectItem[];
  totalFiltered: number;
  hasMore: boolean;
} {
  const filtered =
    category === 'Semua'
      ? projects
      : projects.filter((item) => item.kategori === category);

  const visibleProjects = showAll
    ? filtered
    : filtered.slice(0, Math.max(1, initialLimit));

  return {
    visibleProjects,
    totalFiltered: filtered.length,
    hasMore: filtered.length > initialLimit,
  };
}

/**
 * Memfilter kategori orbit keahlian pada sistem tata surya.
 */
export function filterSkillCategories(
  categories: SkillCategory[],
  activeCategory: 'Semua' | SkillCategory['id'],
): SkillCategory[] {
  if (activeCategory === 'Semua') {
    return categories;
  }
  return categories.filter((cat) => cat.id === activeCategory);
}

/**
 * Menghitung ringkasan statistik keahlian untuk panel telemetri tata surya.
 */
export function computeSkillSummary(categories: SkillCategory[]): {
  totalSkills: number;
  averageLevel: number;
  topSkill: string;
} {
  const allSkills = categories.flatMap((c) => c.daftarSkill);
  if (allSkills.length === 0) {
    return { totalSkills: 0, averageLevel: 0, topSkill: '-' };
  }
  const sum = allSkills.reduce((acc, item) => acc + item.level, 0);
  const sorted = [...allSkills].sort((a, b) => b.level - a.level);

  return {
    totalSkills: allSkills.length,
    averageLevel: Math.round(sum / allSkills.length),
    topSkill: sorted[0].nama,
  };
}

/**
 * Validasi input form kontak secara ketat dan ramah pengguna.
 */
export function validateContactInput(
  input: ContactFormInput,
): ContactValidationResult {
  const errors: ContactValidationResult['errors'] = {};

  // Deteksi bot spam melalui honeypot tersembunyi
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return {
      valid: false,
      isSpam: true,
      errors: {},
    };
  }

  const nama = (input.nama ?? '').trim();
  const email = (input.email ?? '').trim();
  const subjek = (input.subjek ?? '').trim();
  const pesan = (input.pesan ?? '').trim();

  if (!nama) {
    errors.nama = 'Nama lengkap wajib diisi agar kami mengenal Anda.';
  } else if (nama.length < 2) {
    errors.nama = 'Nama minimal terdiri dari 2 karakter.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!email) {
    errors.email = 'Alamat email wajib diisi untuk balasan transmisi.';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Format alamat email belum valid (contoh: nama@domain.com).';
  }

  if (!subjek) {
    errors.subjek = 'Subjek kolaborasi atau proyek wajib diisi.';
  } else if (subjek.length < 4) {
    errors.subjek = 'Subjek minimal terdiri dari 4 karakter.';
  }

  if (!pesan) {
    errors.pesan = 'Detail pesan tidak boleh kosong.';
  } else if (pesan.length < 15) {
    errors.pesan = 'Mohon tuliskan pesan minimal 15 karakter agar jelas.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    isSpam: false,
    errors,
  };
}

/**
 * Pembatas laju pengiriman pesan (rate limiter) berbasis memori untuk API route.
 */
export function checkRateLimit(
  identifier: string,
  store: Map<string, number[]>,
  nowMs: number,
  windowMs = 60_000,
  maxRequests = 4,
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const prevTimestamps = store.get(identifier) ?? [];
  const validTimestamps = prevTimestamps.filter((ts) => nowMs - ts < windowMs);

  if (validTimestamps.length >= maxRequests) {
    const oldest = validTimestamps[0];
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((windowMs - (nowMs - oldest)) / 1000),
    );
    store.set(identifier, validTimestamps);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  validTimestamps.push(nowMs);
  store.set(identifier, validTimestamps);

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - validTimestamps.length),
    retryAfterSeconds: 0,
  };
}
