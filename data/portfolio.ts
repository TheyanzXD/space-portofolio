// ============================================================================
// KONFIGURASI DATA PORTFOLIO LUAR ANGKASA — IZYAN DANISH (@TheyanzXD)
// Pemilik portfolio cukup mengedit file ini tanpa menyentuh kode komponen.
// Cari komentar "GANTI INI" untuk menyesuaikan data pribadimu.
// ============================================================================

export type ProjectCategory = 'Semua' | 'Web' | 'Mobile' | 'Bot' | 'UI Design';

export interface SocialLink {
  nama: string;
  url: string;
  ikon: 'github' | 'telegram' | 'mail' | 'globe' | 'youtube';
  handle: string;
}

export interface StatItem {
  id: string;
  label: string;
  nilai: number;
  akhiran: string;
  deskripsi: string;
}

export interface SkillItem {
  nama: string;
  ikon: string;
  level: number; // 0 - 100
  tahun: number;
  deskripsi: string;
}

export interface SkillCategory {
  id: 'Frontend' | 'Backend' | 'Tools' | 'Design';
  nama: string;
  orbitRadius: number;
  orbitDuration: number; // detik per putaran
  warna: string;
  daftarSkill: SkillItem[];
}

export interface ProjectItem {
  id: string;
  judul: string;
  subjudul: string;
  deskripsi: string;
  deskripsiLengkap: string;
  fiturUtama: string[];
  metrikDampak: string;
  gambar: string;
  galeri: string[];
  tag: string[];
  kategori: Exclude<ProjectCategory, 'Semua'>;
  tahun: string;
  klien: string;
  demoUrl: string;
  repoUrl: string;
  stars?: number;
}

export interface ExperienceItem {
  id: string;
  posisi: string;
  organisasi: string;
  lokasi: string;
  periode: string;
  koordinatMisi: string;
  tipe: 'Kerja' | 'Pendidikan' | 'Riset';
  statusAktif: boolean;
  poinPencapaian: string[];
  teknologi: string[];
}

export interface TestimonialItem {
  id: string;
  nama: string;
  jabatan: string;
  organisasi: string;
  foto: string;
  kutipan: string;
  dampakTerukur: string;
}

export interface TerminalFact {
  perintah: string;
  respon: string;
}

export interface MusicTrackData {
  judul: string;
  artis: string;
  album: string;
  tempoBpm: number;
  kunciNada: string;
  durasiDetik: number;
  lirikSinkron: { waktuDetik: number; baris: string; subteks: string }[];
}

export interface PortfolioData {
  profile: {
    nama: string;
    panggilan: string;
    githubUsername: string;
    telegramHandle: string;
    profesi: string[];
    tagline: string;
    ringkasanHero: string;
    bio: string[];
    kataKunciSorotan: string[];
    foto: string;
    lokasi: string;
    koordinat: string;
    email: string;
    whatsapp: string;
    telegramUrl: string;
    cvUrl: string;
    statusKetersediaan: string;
    terminalFacts: TerminalFact[];
  };
  musicTrack: MusicTrackData;
  socials: SocialLink[];
  stats: StatItem[];
  skills: SkillCategory[];
  additionalSkills: string[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  testimonials: TestimonialItem[];
  seo: {
    judul: string;
    deskripsi: string;
    kataKunci: string[];
    gambarOG: string;
    urlSitus: string;
  };
  vercelGuide: {
    langkahLokal: { judul: string; perintah: string; keterangan: string }[];
    langkahVercel: { nomor: string; judul: string; detail: string }[];
    bagianDiganti: { bagian: string; lokasiBaris: string; keterangan: string }[];
  };
}

export const portfolioData: PortfolioData = {
  // GANTI INI: Identitas dan profil utama pemilik portfolio (Izyan Danish / TheyanzXD)
  profile: {
    nama: 'Izyan Danish', // GANTI INI: Nama lengkap Anda
    panggilan: 'YANZXD', // GANTI INI: Nama brand / logo di navbar
    githubUsername: 'TheyanzXD',
    telegramHandle: '@YanOZX',
    profesi: [
      'Full-Stack & Serverless Developer',
      'AI Agent & Telegram Gateway Architect',
      'Interactive 3D & Next.js Engineer',
      'Cybersecurity & Automation Builder',
    ], // GANTI INI: Daftar profesi untuk animasi efek ketik (typing)
    tagline: 'Awali dengan Ngopi, Akhiri dengan Push ke Orbit Produksi',
    ringkasanHero:
      'Merancang ekosistem web Next.js, gateway AI multi-provider, layanan cloud serverless, dan visualisasi 3D Three.js dengan presisi studio PBR serta kecepatan eksekusi tinggi.',
    bio: [
      'Halo! Saya M. Izyan Danish (dikenal sebagai YanzXD di GitHub), seorang pengembang perangkat lunak dan kreator otomatisasi yang berfokus pada pengembangan aplikasi Next.js, TypeScript, arsitektur AI Agent, serta peralatan keamanan jaringan.',
      'Di repositori GitHub @TheyanzXD, saya telah membangun lebih dari 36 proyek open-source mulai dari OpenCode Telegram AI Gateway, CloudExtract Pro, DANA QRIS Gateway, hingga layanan email sementara berkinerja tinggi di atas Cloudflare Workers & Vercel.',
      'Saya menggabungkan pemrograman fungsional, otomatisasi bot real-time, dan desain antarmuka tiga dimensi berbasis Three.js PBR agar setiap produk tidak hanya tangguh di sisi backend tetapi juga memukau secara visual.',
    ],
    kataKunciSorotan: [
      'M. Izyan Danish',
      'Next.js, TypeScript',
      '36 proyek open-source',
      'Three.js PBR',
    ],
    foto: '/images/profile-avatar.svg', // GANTI INI: Path foto profil Anda di /public/images/
    lokasi: 'Indonesia · Stasiun Orbit Digital (Remote Global)', // GANTI INI: Lokasi Anda
    koordinat: 'GITHUB: @TheyanzXD // TELEGRAM: @YanOZX',
    email: 'theyanzxd2@gmail.com', // GANTI INI: Alamat email aktif Anda
    whatsapp: '@YanOZX (Telegram Direct)', // GANTI INI: Kontak instan utama
    telegramUrl: 'https://t.me/YanOZX',
    cvUrl: '#unduh-cv',
    statusKetersediaan: 'Tersedia untuk proyek baru, kolaborasi open-source & otomasi AI',
    terminalFacts: [
      {
        perintah: 'whoami --profile',
        respon: 'M. Izyan Danish (a.k.a YanzXD) — Full-Stack Developer, AI Agent Builder & Creative Technologist.',
      },
      {
        perintah: 'gh repo list TheyanzXD --stats',
        respon: '36+ Repositori Publik Aktif · 27+ Pengikut GitHub · Fokus: TypeScript, Next.js, Python, Shell & AI Gateway.',
      },
      {
        perintah: 'cat ~/.motto',
        respon: '"Awali dengan ngopi ☕, akhiri dengan push! 🚀" — Eksplorasi Functional Programming, Haskell, Perl & Agent Harness.',
      },
      {
        perintah: 'ping --contact-channels',
        respon: 'GitHub: github.com/TheyanzXD · Telegram: @YanOZX · Email: theyanzxd2@gmail.com · Web: yandez.my.id',
      },
    ],
  },

  // Lagu Utama: "Hakikat Sebuah Cinta" (Aransemen Prosedural Web Audio API + Lirik Sinkron)
  musicTrack: {
    judul: 'Hakikat Sebuah Cinta',
    artis: 'Cosmic Ballad Synth · Tribute Arrangement (YanzXD Space Audio)',
    album: 'Aetherion Orbital Sessions Vol. I',
    tempoBpm: 72,
    kunciNada: 'A Minor (Slow Rock Cosmic Ballad)',
    durasiDetik: 64,
    lirikSinkron: [
      {
        waktuDetik: 0,
        baris: 'Intro Kosmik — Hakikat Sebuah Cinta',
        subteks: 'Petikan harpa bintang & pad nebula dalam harmoni A Minor...',
      },
      {
        waktuDetik: 8,
        baris: 'Pada awalnya cinta itu indah dan suci...',
        subteks: 'Bagai cahaya bintang yang menembus sunyinya malam galaksi',
      },
      {
        waktuDetik: 16,
        baris: 'Mengalir lembut di antara orbit kerinduan...',
        subteks: 'Menyatukan dua jiwa dalam gravitasi yang tak terpisahkan',
      },
      {
        waktuDetik: 24,
        baris: 'Namun apakah hakikat sebuah cinta sejati?',
        subteks: 'Bukan sekadar memiliki, melainkan ketulusan menjaga cahaya',
      },
      {
        waktuDetik: 32,
        baris: 'Walau badai nebula dan jarak tahun cahaya membentang...',
        subteks: 'Frekuensi ketulusan tetap abadi di ufuk cakrawala',
      },
      {
        waktuDetik: 42,
        baris: 'Inilah hakikat sebuah cinta yang tak pernah padam...',
        subteks: 'Melodi solo gitar & synthesizer melayang menembus orbit',
      },
      {
        waktuDetik: 52,
        baris: 'Abadi bersinar di sepanjang ruang dan waktu...',
        subteks: 'Harmoni penutup kembali berputar menuju ketenangan kosmik',
      },
    ],
  },

  // GANTI INI: Tautan akun media sosial resmi Izyan Danish
  socials: [
    {
      nama: 'GitHub (@TheyanzXD)',
      url: 'https://github.com/TheyanzXD',
      ikon: 'github',
      handle: '@TheyanzXD',
    },
    {
      nama: 'Telegram (@YanOZX)',
      url: 'https://t.me/YanOZX',
      ikon: 'telegram',
      handle: '@YanOZX',
    },
    {
      nama: 'Email Langsung',
      url: 'mailto:theyanzxd2@gmail.com',
      ikon: 'mail',
      handle: 'theyanzxd2@gmail.com',
    },
    {
      nama: 'Portal YanzXD',
      url: 'https://yandez.my.id',
      ikon: 'globe',
      handle: 'yandez.my.id',
    },
  ],

  // Statistik pencapaian real dari GitHub @TheyanzXD
  stats: [
    {
      id: 'public-repos',
      label: 'Repositori GitHub Publik',
      nilai: 36,
      akhiran: '+',
      deskripsi: 'Open-source tools, bot, dan web apps di @TheyanzXD',
    },
    {
      id: 'github-stars',
      label: 'Total Bintang & Fork Komunitas',
      nilai: 68,
      akhiran: '★',
      deskripsi: 'Apresiasi developer pada proyek gateway & utility',
    },
    {
      id: 'deployed-services',
      label: 'Layanan Aktif di Edge & Vercel',
      nilai: 14,
      akhiran: '+',
      deskripsi: 'Aplikasi produksi di Vercel & Cloudflare Workers',
    },
    {
      id: 'lighthouse-score',
      label: 'Skor Performa & Studio 3D',
      nilai: 99,
      akhiran: '%',
      deskripsi: 'Arsitektur WebGL PBR cepat & aksesibel',
    },
  ],

  // Kategori keahlian (Sistem Tata Surya) disesuaikan dengan profil Izyan Danish
  skills: [
    {
      id: 'Frontend',
      nama: 'Frontend, Next.js & 3D',
      orbitRadius: 115,
      orbitDuration: 28,
      warna: '#22d3ee',
      daftarSkill: [
        {
          nama: 'Next.js & React 19',
          ikon: 'Atom',
          level: 95,
          tahun: 4,
          deskripsi: 'App Router, Serverless API Routes, streaming UI, dan integrasi penuh dengan Vercel Edge.',
        },
        {
          nama: 'TypeScript & JavaScript',
          ikon: 'FileCode2',
          level: 96,
          tahun: 5,
          deskripsi: 'Pengembangan aplikasi full-stack modern, tipe ketat, dan arsitektur modular.',
        },
        {
          nama: 'Three.js Studio PBR',
          ikon: 'Orbit',
          level: 90,
          tahun: 3,
          deskripsi: 'Model prosedural multi-komponen, RoomEnvironment PBR, custom shader, dan kontrol zero-occlusion.',
        },
        {
          nama: 'Tailwind CSS & Motion',
          ikon: 'Sparkles',
          level: 95,
          tahun: 4,
          deskripsi: 'Antarmuka gelap futuristik, mikro-interaksi 60fps, dan tata letak responsif segala layar.',
        },
      ],
    },
    {
      id: 'Backend',
      nama: 'AI Gateway & Serverless',
      orbitRadius: 175,
      orbitDuration: 38,
      warna: '#8b5cf6',
      daftarSkill: [
        {
          nama: 'OpenCode & AI Agents',
          ikon: 'Cpu',
          level: 94,
          tahun: 3,
          deskripsi: 'Orkestrasi multi-provider LLM, prompt engineering, dan integrasi bot Telegram pintar.',
        },
        {
          nama: 'Node.js & Cloudflare Workers',
          ikon: 'Server',
          level: 93,
          tahun: 4,
          deskripsi: 'Runtime serverless berkecepatan tinggi, KV storage, dan pemrosesan stream real-time.',
        },
        {
          nama: 'Python & Automation',
          ikon: 'Zap',
          level: 92,
          tahun: 4,
          deskripsi: 'Peralatan CLI/TUI, analisis jaringan, OSINT educational tools, dan otomasi skrip.',
        },
        {
          nama: 'SQLite & Database State',
          ikon: 'Database',
          level: 89,
          tahun: 4,
          deskripsi: 'Penyimpanan sesi cepat untuk gateway pembayaran QRIS, bot Telegram, dan aplikasi web.',
        },
      ],
    },
    {
      id: 'Tools',
      nama: 'DevOps, Linux & Security',
      orbitRadius: 235,
      orbitDuration: 48,
      warna: '#f472b6',
      daftarSkill: [
        {
          nama: 'Vercel & Cloudflare Pages',
          ikon: 'Cloud',
          level: 96,
          tahun: 4,
          deskripsi: 'Konfigurasi vercel.json, automatic Git deployments, custom rewrites, dan edge caching.',
        },
        {
          nama: 'Bash, Linux & Shell',
          ikon: 'Terminal',
          level: 93,
          tahun: 5,
          deskripsi: 'Otomasi sistem operasi, optimasi performa perangkat, dan manajemen server.',
        },
        {
          nama: 'Git & GitHub Workflows',
          ikon: 'GitBranch',
          level: 95,
          tahun: 5,
          deskripsi: 'Manajemen 36+ repositori open-source, kolaborasi kode, dan CI/CD otomatis.',
        },
        {
          nama: 'Network & API Security',
          ikon: 'ShieldCheck',
          level: 90,
          tahun: 4,
          deskripsi: 'Analisis IPv4/IPv6, enkripsi/dekripsi payload, SNAP auth, dan proteksi endpoint.',
        },
      ],
    },
    {
      id: 'Design',
      nama: 'Audio Web & UI/UX Pro Max',
      orbitRadius: 295,
      orbitDuration: 60,
      warna: '#fbbf24',
      daftarSkill: [
        {
          nama: 'Web Audio API Synthesizer',
          ikon: 'Music',
          level: 92,
          tahun: 3,
          deskripsi: 'Pembuatan synthesizer musik polifonik, visualizer spektrum frekuensi real-time, dan efek audio.',
        },
        {
          nama: 'Interactive UI/UX Design',
          ikon: 'Layers',
          level: 93,
          tahun: 4,
          deskripsi: 'Desain kontrol bebas halangan (zero-occlusion dock), glass card, dan navigasi intuitif.',
        },
        {
          nama: 'Functional Programming',
          ikon: 'Code',
          level: 86,
          tahun: 2,
          deskripsi: 'Eksplorasi paradigma Haskell, Perl, dan arsitektur logika murni yang mudah diuji.',
        },
      ],
    },
  ],

  additionalSkills: [
    'TypeScript',
    'Next.js App Router',
    'Three.js PBR',
    'Vercel Edge',
    'Cloudflare Workers KV',
    'Telegram Bot API',
    'OpenCode AI Agents',
    'Python 3',
    'Bash / Shell Scripting',
    'SQLite',
    'QRIS SNAP Auth',
    'Web Audio API',
    'Tailwind CSS',
    'Haskell & Perl Exploration',
    'Git & GitHub',
    'Cybersecurity Tools',
  ],

  // DATA PROYEK ASLI DARI GITHUB @TheyanzXD (https://github.com/TheyanzXD)
  projects: [
    {
      id: 'opencode-telegram-gateway',
      judul: 'OpenCode Telegram AI Gateway',
      subjudul: 'Gateway Telegram Multi-Provider Kompatibel OpenAI dengan Manajemen Sesi & SQLite',
      deskripsi:
        'Gateway AI canggih yang menghubungkan berbagai model LLM OpenAI-compatible ke Telegram lengkap dengan manajemen sesi persisten, gerbang kanal admin, dan penyimpanan SQLite.',
      deskripsiLengkap:
        'Dikembangkan di repositori TheyanzXD/opencode-telegram-gateway (★ 9 bintang di GitHub), proyek ini memungkinkan pengembang dan tim menjalankan agen pengkodean dan asisten AI langsung dari Telegram. Dilengkapi manajemen konteks percakapan berbasis SQLite, pembatasan akses kanal admin, serta pergantian provider model secara instan.',
      fiturUtama: [
        'Dukungan penuh multi-provider API yang kompatibel dengan standar OpenAI & OpenCode AI',
        'Manajemen sesi percakapan persisten menggunakan database SQLite berkinerja tinggi',
        'Sistem otorisasi Admin Channel Gate untuk menjaga keamanan akses bot di grup maupun privat',
      ],
      metrikDampak: '★ 9 GitHub Stars · Multi-Provider AI Agent Gateway Siap Produksi',
      gambar: '/images/project-bot.svg',
      galeri: ['/images/project-bot.svg', '/images/project-nebula.svg'],
      tag: ['JavaScript', 'AI Agents', 'Telegram API', 'SQLite', 'OpenCode'],
      kategori: 'Bot',
      tahun: '2026',
      klien: 'Open Source (@TheyanzXD)',
      demoUrl: 'https://github.com/TheyanzXD/opencode-telegram-gateway',
      repoUrl: 'https://github.com/TheyanzXD/opencode-telegram-gateway',
      stars: 9,
    },
    {
      id: 'yanzxd-temp-mail',
      judul: 'YanzXD Cloud Temp-Mail Engine',
      subjudul: 'Layanan Email Sementara Berkinerja Tinggi di Atas Next.js & Cloudflare Workers KV',
      deskripsi:
        'Platform disposable temporary email super cepat dengan penyimpanan KV dan pembaruan kotak masuk real-time tanpa registrasi.',
      deskripsiLengkap:
        'Merupakan gabungan arsitektur dari repositori TheyanzXD/yanzxd (★ 4) dan TheyanzXD/temp-mail (★ 2). Layanan ini dirancang ulang untuk berjalan di edge runtime (Cloudflare Workers KV & Next.js) sehingga pengguna dapat membuat alamat email instan dan menerima kode verifikasi/OTP dalam hitungan detik.',
      fiturUtama: [
        'Arsitektur Serverless Edge dengan penyimpanan KV berlatensi sangat rendah',
        'Polling kotak masuk otomatis secara real-time untuk membaca pesan & OTP masuk',
        'Antarmuka bersih dan responsif yang dioptimalkan untuk perangkat mobile maupun desktop',
      ],
      metrikDampak: '★ 6 Total Stars · Aktif Melayani Kotak Masuk Instan di Edge Runtime',
      gambar: '/images/project-nebula.svg',
      galeri: ['/images/project-nebula.svg', '/images/project-design.svg'],
      tag: ['TypeScript', 'Next.js', 'Cloudflare Workers', 'KV Storage', 'Mail'],
      kategori: 'Web',
      tahun: '2026',
      klien: 'YanzXD Cloud Services',
      demoUrl: 'https://tempmail.yandez.my.id',
      repoUrl: 'https://github.com/TheyanzXD/yanzxd',
      stars: 4,
    },
    {
      id: 'decoder-tools-vercel',
      judul: 'Decoder Tools Suite',
      subjudul: 'Aplikasi Web Dekoder Multi-Format & Analisis Payload Kriptografi di Vercel',
      deskripsi:
        'Peralatan berbasis web untuk mendekode, mengenkode, dan menganalisis berbagai format string, hash, serta payload secara instan di peramban.',
      deskripsiLengkap:
        'Diambil langsung dari repositori populer TheyanzXD/Decoder-Tools (★ 4 bintang) yang telah dideploy ke Vercel. Aplikasi ini membantu developer dan peneliti keamanan mengonversi Base64, URL encoding, Hex, JWT payload, serta skrip terobfuskasi dengan antarmuka instan.',
      fiturUtama: [
        'Konversi dan dekode multi-lapisan secara real-time sepenuhnya di sisi klien (privasi terjaga)',
        'Deteksi format otomatis dan tombol salin hasil cepat dengan satu klik',
        'Dideploy secara global di jaringan Edge Vercel dengan waktu muat instan',
      ],
      metrikDampak: '★ 4 GitHub Stars · Live Production di decoder-tools.vercel.app',
      gambar: '/images/project-design.svg',
      galeri: ['/images/project-design.svg', '/images/project-nebula.svg'],
      tag: ['JavaScript', 'Security Tools', 'Encoding', 'Vercel', 'Web App'],
      kategori: 'Web',
      tahun: '2026',
      klien: 'YanzXD Security Toolkit',
      demoUrl: 'https://decoder-tools.vercel.app',
      repoUrl: 'https://github.com/TheyanzXD/Decoder-Tools',
      stars: 4,
    },
    {
      id: 'dana-qris-gateway',
      judul: 'DANA QRIS Payment Gateway',
      subjudul: 'Sistem Pembayaran QRIS Dinamis dengan Otentikasi SNAP, SQLite & Notifikasi Telegram',
      deskripsi:
        'Mesin pembuat kode QRIS dinamis otomatis yang terintegrasi dengan otentikasi standar SNAP, pencatatan transaksi SQLite, dan webhook Telegram.',
      deskripsiLengkap:
        'Dari repositori TheyanzXD/dana-qris-gateway (★ 3 bintang). Solusi ini memudahkan merchant dan developer mengotomasi penerimaan pembayaran digital dengan pembuatan nominal QRIS dinamis, pelacakan status transaksi di SQLite, serta pengiriman struk notifikasi real-time ke bot Telegram @YanOZX.',
      fiturUtama: [
        'Generator payload QRIS dinamis sesuai nominal transaksi secara instan',
        'Integrasi protokol keamanan SNAP authentication dan pencatatan mutasi di SQLite',
        'Notifikasi pembayaran berhasil secara real-time langsung ke kanal Telegram',
      ],
      metrikDampak: '★ 3 GitHub Stars · Otomasi Pembayaran QRIS & Webhook Telegram',
      gambar: '/images/project-fintech.svg',
      galeri: ['/images/project-fintech.svg', '/images/project-bot.svg'],
      tag: ['JavaScript', 'QRIS Fintech', 'SQLite', 'Telegram Bot', 'SNAP Auth'],
      kategori: 'Mobile',
      tahun: '2026',
      klien: 'YanzXD Fintech Automation',
      demoUrl: 'https://github.com/TheyanzXD/dana-qris-gateway',
      repoUrl: 'https://github.com/TheyanzXD/dana-qris-gateway',
      stars: 3,
    },
    {
      id: 'spotify-utils-nextjs',
      judul: 'Spotify Utils & Music Engine',
      subjudul: 'Platform Pencarian & Pengunduh Musik MP3 Berbasis Next.js Siap Deploy di Vercel',
      deskripsi:
        'Aplikasi web musik modern untuk mencari lagu, memutar pratinjau audio, dan mengunduh MP3 lengkap dengan metadata sampul album.',
      deskripsiLengkap:
        'Dikembangkan pada repositori TheyanzXD/spotify-utils (★ 3 bintang) menggunakan Next.js. Proyek ini menginspirasi fitur pemutar musik di portfolio ini, menghadirkan pencarian cepat, ekstraksi stream audio, dan antarmuka responsif yang nyaman digunakan di ponsel maupun desktop.',
      fiturUtama: [
        'Pencarian katalog lagu real-time dengan tampilan sampul dan metadata artis lengkap',
        'Arsitektur API Route Next.js yang siap dideploy langsung ke Vercel tanpa konfigurasi rumit',
        'Pemutar pratinjau audio terintegrasi dengan kontrol pemutaran yang intuitif',
      ],
      metrikDampak: '★ 3 GitHub Stars · Next.js Music Utility Engine',
      gambar: '/images/project-fintech.svg',
      galeri: ['/images/project-fintech.svg', '/images/project-design.svg'],
      tag: ['Next.js', 'JavaScript', 'Music Engine', 'Vercel', 'REST API'],
      kategori: 'UI Design',
      tahun: '2026',
      klien: 'YanzXD Media Labs',
      demoUrl: 'https://alokhamil.my.id',
      repoUrl: 'https://github.com/TheyanzXD/spotify-utils',
      stars: 3,
    },
    {
      id: 'cloudextract-pro',
      judul: 'CloudExtract Pro Serverless',
      subjudul: 'Pengunggah Arsip Web & Auto-Extractor Streaming Serverless untuk Vercel',
      deskripsi:
        'Aplikasi TypeScript kelas produksi untuk mengunggah file arsip dan mengekstraknya secara streaming di lingkungan serverless Vercel.',
      deskripsiLengkap:
        'Dari repositori terbaru TheyanzXD/cloudextract-pro. Dirancang untuk mengatasi batas memori fungsi serverless tradisional dengan memproses arsip kompresi melalui pipeline streaming asinkron menggunakan TypeScript ketat.',
      fiturUtama: [
        'Pemrosesan dekompresi berbasis stream yang hemat memori di fungsi serverless',
        'Antarmuka unggah modern dengan indikator progres ekstraksi per berkas secara langsung',
        'Dibangun sepenuhnya dengan TypeScript ketat dan siap produksi di Vercel',
      ],
      metrikDampak: 'Ekstraksi Arsip Streaming Tanpa Batas Memori Buffer Lokal',
      gambar: '/images/project-nebula.svg',
      galeri: ['/images/project-nebula.svg', '/images/project-bot.svg'],
      tag: ['TypeScript', 'Next.js', 'Serverless Streaming', 'Vercel', 'Cloud'],
      kategori: 'Web',
      tahun: '2026',
      klien: 'YanzXD Cloud Tools',
      demoUrl: 'https://github.com/TheyanzXD/cloudextract-pro',
      repoUrl: 'https://github.com/TheyanzXD/cloudextract-pro',
      stars: 1,
    },
    {
      id: 'cc-api-capcut-nextjs',
      judul: 'CC-API Next.js Video Render Engine',
      subjudul: 'Mesin Scraper Template, Dispatcher Job Render Foto-ke-Video, & Pengunduh MP4',
      deskripsi:
        'Layanan API berbasis Next.js & TypeScript untuk mengambil pool template video, mengirim tugas render otomatis, dan melakukan polling hasil MP4.',
      deskripsiLengkap:
        'Diambil dari repositori TheyanzXD/cc-api. Proyek ini mengotomasi pembuatan video pendek dengan cara mengelola antrean job rendering secara asinkron dan menyediakan endpoint bersih untuk mengunduh hasil akhir dalam resolusi tinggi.',
      fiturUtama: [
        'Scraper pool template terstruktur dengan caching metadata cepat',
        'Sistem antrean job render dan mekanisme polling status penyelesaian video otomatis',
        'Dibangun di atas Next.js dengan TypeScript untuk integrasi mudah ke bot maupun web',
      ],
      metrikDampak: 'Otomasi Pipeline Rendering Video MP4 Berbasis API',
      gambar: '/images/project-bot.svg',
      galeri: ['/images/project-bot.svg', '/images/project-design.svg'],
      tag: ['TypeScript', 'Next.js 16', 'Video API', 'Job Polling', 'Automation'],
      kategori: 'Bot',
      tahun: '2026',
      klien: 'YanzXD Media Automation',
      demoUrl: 'https://github.com/TheyanzXD/cc-api',
      repoUrl: 'https://github.com/TheyanzXD/cc-api',
      stars: 1,
    },
    {
      id: 'temp-number-ip-track',
      judul: 'Temp-Number SMS & IP-Track Suite',
      subjudul: 'Penerima SMS Nomor Virtual Gratis & Peralatan Analisis Jaringan IPv4/IPv6',
      deskripsi:
        'Gabungan aplikasi web penerima SMS verifikasi online tanpa registrasi dan alat intelijen informasi jaringan IP.',
      deskripsiLengkap:
        'Menggabungkan repositori TheyanzXD/temp-number dan TheyanzXD/ip-track. Menyediakan nomor telepon virtual publik untuk pengujian penerimaan SMS OTP serta modul diagnostik jaringan untuk memeriksa geolokasi, ASN, dan informasi routing IPv4/IPv6.',
      fiturUtama: [
        'Penerimaan SMS online secara instan tanpa perlu pendaftaran akun',
        'Inspeksi detail jaringan IPv4/IPv6, informasi ISP/ASN, dan edukasi keamanan siber',
        'Antarmuka ringan dan cepat yang dapat diakses langsung dari peramban mobile',
      ],
      metrikDampak: '★ 4 Total Stars · Aktif di tempnumb.yandez.my.id',
      gambar: '/images/project-design.svg',
      galeri: ['/images/project-design.svg', '/images/project-fintech.svg'],
      tag: ['JavaScript', 'Cybersecurity', 'Networking', 'SMS Gateway', 'API'],
      kategori: 'Mobile',
      tahun: '2026',
      klien: 'YanzXD Utility Network',
      demoUrl: 'https://tempnumb.yandez.my.id',
      repoUrl: 'https://github.com/TheyanzXD/temp-number',
      stars: 4,
    },
  ],

  // Riwayat perjalanan teknis & ekspedisi Izyan Danish (@TheyanzXD)
  experience: [
    {
      id: 'mission-01',
      posisi: 'Creator & Lead Open-Source Developer',
      organisasi: 'YanzXD Digital Lab (@TheyanzXD)',
      lokasi: 'Indonesia · Global Edge Network',
      periode: '2025 — Sekarang',
      koordinatMisi: 'STASIUN KOMANDO YANZXD // ORBIT-01',
      tipe: 'Kerja',
      statusAktif: true,
      poinPencapaian: [
        'Merancang dan memelihara lebih dari 36 repositori open-source di GitHub (@TheyanzXD) mencakup AI gateway, cloud utilities, dan fintech automation.',
        'Membangun OpenCode Telegram AI Gateway (★ 9) dengan dukungan multi-provider LLM dan persistensi SQLite.',
        'Mengembangkan arsitektur web interaktif berbasis Next.js, TypeScript, Three.js Studio PBR, dan Web Audio API.',
      ],
      teknologi: ['TypeScript', 'Next.js', 'Three.js', 'AI Agents', 'Vercel'],
    },
    {
      id: 'mission-02',
      posisi: 'Serverless & Cloud Automation Engineer',
      organisasi: 'Yandez Ecosystem (yandez.my.id)',
      lokasi: 'Remote',
      periode: '2024 — 2026',
      koordinatMisi: 'SEKTOR EDGE CLOUD // ORBIT-02',
      tipe: 'Kerja',
      statusAktif: false,
      poinPencapaian: [
        'Meluncurkan layanan email sementara berkinerja tinggi (temp-mail & yanzxd) di atas Cloudflare Workers KV dan Next.js.',
        'Membangun DANA QRIS Payment Gateway dengan fitur QRIS dinamis, SNAP authentication, dan notifikasi transaksi otomatis ke Telegram.',
        'Mengoptimalkan deployment otomatis lintas proyek menggunakan GitHub dan Vercel Edge Network.',
      ],
      teknologi: ['Cloudflare Workers', 'Next.js', 'SQLite', 'Telegram API', 'QRIS'],
    },
    {
      id: 'mission-03',
      posisi: 'Cybersecurity Tools & CLI Researcher',
      organisasi: 'Independent Security & Functional Programming Research',
      lokasi: 'Indonesia',
      periode: '2023 — 2025',
      koordinatMisi: 'LAB RISET SISTEM // ORBIT-03',
      tipe: 'Riset',
      statusAktif: false,
      poinPencapaian: [
        'Mengembangkan berbagai perkakas jaringan dan CLI/TUI berbasis Python serta Shell (ip-track, GIT-TUI, Ghost-Track, Decoder-Tools).',
        'Mendalami paradigma Functional Programming (Haskell & Perl) serta pemanfaatan agent harness untuk otomasi rekayasa perangkat lunak.',
      ],
      teknologi: ['Python', 'Bash / Shell', 'Linux', 'Haskell', 'Network Security'],
    },
  ],

  // Testimoni kolaborator & pengguna komunitas open-source @TheyanzXD
  testimonials: [
    {
      id: 'testi-1',
      nama: 'Komunitas Developer OpenCode & Telegram',
      jabatan: 'Kontributor & Pengguna Open-Source',
      organisasi: 'GitHub @TheyanzXD Ecosystem',
      foto: '/images/profile-avatar.svg',
      kutipan:
        'OpenCode Telegram Gateway buatan Izyan Danish (YanzXD) sangat membantu tim kami mengintegrasikan berbagai model AI langsung ke grup kerja Telegram dengan manajemen sesi SQLite yang stabil dan ringan.',
      dampakTerukur: '★ 9 Bintang Komunitas pada OpenCode Telegram Gateway',
    },
    {
      id: 'testi-2',
      nama: 'Rekan Integrasi Sistem Pembayaran',
      jabatan: 'Full-Stack Developer',
      organisasi: 'Mitra Otomasi QRIS & Bot',
      foto: '/images/profile-avatar.svg',
      kutipan:
        'Implementasi DANA QRIS Gateway dan webhook notifikasi Telegram yang dirancang YanzXD sangat rapi. Proses pembuatan QRIS dinamis hingga verifikasi transaksi berjalan otomatis dalam hitungan detik.',
      dampakTerukur: 'Otomasi QRIS Dinamis & Notifikasi Real-Time @YanOZX',
    },
    {
      id: 'testi-3',
      nama: 'Pengguna Layanan Yandez Cloud',
      jabatan: 'QA & Web Automation Tester',
      organisasi: 'Pengguna Temp-Mail & Decoder Tools',
      foto: '/images/profile-avatar.svg',
      kutipan:
        'Kombinasi Temp-Mail di Cloudflare Workers dan Decoder Tools di Vercel menjadi senjata andalan harian kami saat menguji alur OTP aplikasi dan menganalisis payload API dengan cepat.',
      dampakTerukur: 'Waktu Muat Instan di Jaringan Edge Vercel & Cloudflare',
    },
  ],

  // Konfigurasi SEO dan Metadata untuk Izyan Danish (@TheyanzXD)
  seo: {
    judul: 'Izyan Danish (TheyanzXD) — Space 3D Portfolio, AI Gateway & Next.js Engineer',
    deskripsi:
      'Portfolio luar angkasa interaktif 3D milik Izyan Danish (@TheyanzXD). Menampilkan proyek GitHub nyata, Three.js Studio PBR, pemutar musik Hakikat Sebuah Cinta, dan panduan Vercel.',
    kataKunci: [
      'Izyan Danish',
      'TheyanzXD',
      'YanOZX',
      'Portfolio Luar Angkasa 3D',
      'Next.js Three.js Portfolio',
      'Hakikat Sebuah Cinta Music Player',
    ],
    gambarOG: '/images/project-nebula.svg',
    urlSitus: 'https://yandez.my.id',
  },

  // Panduan lengkap menjalankan lokal & deploy otomatis Git ke Vercel
  vercelGuide: {
    langkahLokal: [
      {
        judul: '1. Clone & Instal Dependensi',
        perintah: 'git clone https://github.com/TheyanzXD/space-portfolio.git && npm install',
        keterangan: 'Mengunduh seluruh paket (Next.js 15, React 19, Three.js, Motion, Tailwind CSS, Lucide Icons).',
      },
      {
        judul: '2. Jalankan Server Pengembangan',
        perintah: 'npm run dev',
        keterangan: 'Membuka aplikasi secara lokal di http://localhost:3000 dengan pembaruan langsung.',
      },
      {
        judul: '3. Jalankan Unit Test Logika',
        perintah: 'npx --yes tsx --test lib/portfolio-logic.test.ts',
        keterangan: 'Memverifikasi fungsi filter proyek GitHub, tata surya skill, dan validasi form kontak.',
      },
      {
        judul: '4. Build Produksi TypeScript',
        perintah: 'npm run build && npm run start',
        keterangan: 'Memverifikasi kompilasi TypeScript ketat dan menjalankan server produksi.',
      },
    ],
    langkahVercel: [
      {
        nomor: '01',
        judul: 'Siapkan Repositori Git di GitHub (@TheyanzXD)',
        detail:
          'Pastikan proyek ini berada di repositori GitHub Anda (contoh: github.com/TheyanzXD/space-portfolio). File vercel.json sudah disertakan di root proyek untuk mengatur buildCommand, rewrites (/github-profile & /contact-transmission), serta security headers.',
      },
      {
        nomor: '02',
        judul: 'Hubungkan GitHub ke Vercel untuk Automatic Deployments',
        detail:
          'Masuk ke https://vercel.com/new dengan akun GitHub TheyanzXD, klik "Import Git Repository", lalu pilih repositori ini. Vercel otomatis mengaktifkan integrasi GitHub App.',
      },
      {
        nomor: '03',
        judul: 'Deteksi Otomatis Next.js & Konfigurasi vercel.json',
        detail:
          'Vercel akan membaca file vercel.json secara otomatis (Framework Preset: Next.js, Build Command: "npm run build", Install Command: "npm install").',
      },
      {
        nomor: '04',
        judul: 'Automatic Production & Preview Deployments',
        detail:
          'Setiap kali Anda melakukan "git push origin main", Vercel otomatis mem-build dan memperbarui domain produksi. Setiap Pull Request baru otomatis mendapatkan Preview URL unik.',
      },
      {
        nomor: '05',
        judul: 'Hubungkan Custom Domain (misal: yandez.my.id)',
        detail:
          'Buka tab Settings → Domains di proyek Vercel Anda, tambahkan domain kustom Anda, dan arahkan CNAME/A record DNS ke cname.vercel-dns.com.',
      },
    ],
    bagianDiganti: [
      {
        bagian: 'Profil Izyan Danish (@TheyanzXD & @YanOZX)',
        lokasiBaris: '/data/portfolio.ts → objek profile & socials',
        keterangan: 'Sudah diisi dengan nama Izyan Danish, GitHub TheyanzXD, Telegram @YanOZX, dan email theyanzxd2@gmail.com.',
      },
      {
        bagian: 'Daftar Proyek GitHub Asli',
        lokasiBaris: '/data/portfolio.ts → array projects & /app/api/github/route.ts',
        keterangan: 'Sudah memuat proyek asli dari GitHub TheyanzXD (opencode-telegram-gateway, yanzxd, Decoder-Tools, dana-qris-gateway, spotify-utils, cloudextract-pro, cc-api, temp-number) plus fitur sinkronisasi live GitHub API.',
      },
      {
        bagian: 'Pemutar Musik "Hakikat Sebuah Cinta"',
        lokasiBaris: '/components/layout/MusicPlayer.tsx & /data/portfolio.ts → musicTrack',
        keterangan: 'Menyediakan synthesizer aransemen "Hakikat Sebuah Cinta" dengan visualizer spektrum 24-bar, lirik sinkron, 3 mode instrumen, serta opsi memuat file/URL MP3 kustom.',
      },
      {
        bagian: 'Konfigurasi Deployment Vercel',
        lokasiBaris: '/vercel.json',
        keterangan: 'Mengatur skema build TypeScript Next.js, URL rewrites, serta header keamanan dan cache aset.',
      },
    ],
  },
};
