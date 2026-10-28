# Izyan Danish (@TheyanzXD) — Deep Space 3D Portfolio

Website portfolio personal bertema **Luar Angkasa (Deep Space UI/UX Pro Max)** untuk **M. Izyan Danish (`@TheyanzXD`)**, dibangun menggunakan **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, dan **Three.js**.

---

## Fitur Utama

1. **Interactive Three.js 3D Studio PBR Hero Scene (`components/canvas/Planet.tsx`)**
   - Studio PBR (`THREE.RoomEnvironment` + `MeshPhysicalMaterial`) dengan 4 preset material (`Nebula`, `Titanium`, `Kristal`, `Emas Surya`).
   - Planet utama bertekstur prosedural, cincin ganda, 2 bulan yang mengorbit, sabuk 36 asteroid (`InstancedMesh`), dan astronot EVA 11 bagian.
   - **Zero-Occlusion Collapsible Dock**: Kontrol material, preset kamera (`Orbit`, `EVA`, `Kutub`), dan *slider* jarak pisah orbit yang dapat dilipat agar tidak menutupi objek 3D.

2. **Sinkronisasi Proyek GitHub `@TheyanzXD` (`components/sections/Projects.tsx` & `app/api/github/route.ts`)**
   - Menampilkan proyek asli dari repositori GitHub `TheyanzXD` (`opencode-telegram-gateway`, `yanzxd`, `Decoder-Tools`, `dana-qris-gateway`, `spotify-utils`, `cloudextract-pro`, `cc-api`, `temp-number` & `ip-track`).
   - Dilengkapi tombol **Sync Live GitHub** untuk mengambil pembaruan bintang (*stars*) dan repositori terbaru secara *real-time*.

3. **UI/UX Pro Max Space Music Player — "Hakikat Sebuah Cinta" (`components/layout/MusicPlayer.tsx`)**
   - Synthesizer polifonik **Web Audio API** yang memainkan progresi melodi & *arpeggio* lagu **"Hakikat Sebuah Cinta"** (72 BPM A-Minor Slow Rock Ballad) dengan 3 pilihan instrumen (**Slow Rock**, **Harpa**, **Orkestra**).
   - **20-Bar Real-Time Audio Spectrum Visualizer (`AnalyserNode`)** dan lirik tersinkronisasi (*synced lyrics*).
   - Mendukung fitur **Upload MP3** untuk memutar file audio `.mp3` lokal pilihan Anda sendiri.

4. **7 Section Responsif Penuh**
   - Navbar Sticky Glassmorphism, Hero 3D, About (3 cincin orbit), Solar System Skills, GitHub Projects, Mission Timeline Experience, Testimonials, dan Contact Form (`/api/contact`).

---

## Cara Menjalankan di Komputer Lokal

1. **Ekstrak file ZIP** dan buka terminal di dalam folder proyek.
2. **Install semua dependensi**:
   ```bash
   npm install
   ```
3. **Jalankan server development**:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di browser Anda.
4. **Jalankan Unit Test & Build Produksi**:
   ```bash
   npx tsx --test lib/portfolio-logic.test.ts
   npm run build
   npm start
   ```

---

## Cara Deploy ke Vercel (Otomatis via GitHub)

Proyek ini sudah dilengkapi file konfigurasi **`vercel.json`**.

1. Buat repositori baru di GitHub (`https://github.com/new`), misalnya `space-portfolio`.
2. Push seluruh kode ke repositori tersebut:
   ```bash
   git init
   git add .
   git commit -m "feat: initial space portfolio Izyan Danish (@TheyanzXD)"
   git branch -M main
   git remote add origin https://github.com/TheyanzXD/space-portfolio.git
   git push -u origin main
   ```
3. Buka [https://vercel.com/new](https://vercel.com/new), login dengan GitHub, pilih repositori `izyan-space-portfolio`, lalu klik **Deploy**.

---

## Kustomisasi Data

Seluruh profil, tautan sosial (`TheyanzXD`, `@YanOZX`, `theyanzxd2@gmail.com`), skill, daftar proyek, dan lirik lagu dapat diedit di satu file:
- `data/portfolio.ts`
