import type { Metadata } from 'next';
import {
  Orbitron,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from 'next/font/google';
import { portfolioData } from '@/data/portfolio';
import './globals.css';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const canonicalUrl = process.env.APP_URL || portfolioData.seo.urlSitus;

export const metadata: Metadata = {
  metadataBase: new URL(canonicalUrl),
  title: portfolioData.seo.judul,
  description: portfolioData.seo.deskripsi,
  keywords: portfolioData.seo.kataKunci,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: portfolioData.seo.judul,
    description: portfolioData.seo.deskripsi,
    url: canonicalUrl,
    siteName: `${portfolioData.profile.nama} — Space Portfolio`,
    type: 'website',
    locale: 'id_ID',
    images: [
      {
        url: portfolioData.seo.gambarOG,
        width: 1200,
        height: 675,
        alt: portfolioData.seo.judul,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: portfolioData.seo.judul,
    description: portfolioData.seo.deskripsi,
    images: [portfolioData.seo.gambarOG],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: portfolioData.profile.nama,
    alternateName: portfolioData.profile.panggilan,
    jobTitle: portfolioData.profile.profesi[0],
    description: portfolioData.seo.deskripsi,
    url: canonicalUrl,
    email: portfolioData.profile.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jakarta',
      addressCountry: 'ID',
    },
    sameAs: portfolioData.socials.map((s) => s.url),
  };

  return (
    <html
      lang="id"
      className={`${orbitron.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} dark`}
    >
      <body
        suppressHydrationWarning
        className="bg-[#05030f] text-[#f1f5f9] antialiased selection:bg-[#22d3ee]/30 selection:text-white"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
