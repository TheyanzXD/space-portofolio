import { NextResponse } from 'next/server';
import { portfolioData } from '@/data/portfolio';

export interface GitHubRepoResponse {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
}

/**
 * Endpoint API untuk mengambil data repositori real-time dari GitHub @TheyanzXD
 * dilengkapi fallback deterministik agar tidak pernah gagal saat offline/rate-limited.
 */
export async function GET() {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/TheyanzXD', {
        headers: { Accept: 'application/vnd.github.v3+json' },
        next: { revalidate: 300 },
      }),
      fetch('https://api.github.com/users/TheyanzXD/repos?sort=updated&per_page=12', {
        headers: { Accept: 'application/vnd.github.v3+json' },
        next: { revalidate: 300 },
      }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return NextResponse.json({
        ok: true,
        source: 'cached-snapshot',
        username: 'TheyanzXD',
        projects: portfolioData.projects,
      });
    }

    const userData = await userRes.json();
    const reposData = (await reposRes.json()) as GitHubRepoResponse[];

    return NextResponse.json({
      ok: true,
      source: 'github-live-api',
      username: userData.login || 'TheyanzXD',
      publicRepos: userData.public_repos ?? 36,
      followers: userData.followers ?? 27,
      repos: reposData.map((r) => ({
        id: String(r.id),
        name: r.name,
        description: r.description,
        url: r.html_url,
        homepage: r.homepage,
        language: r.language || 'TypeScript',
        stars: r.stargazers_count,
        topics: r.topics || [],
        updatedAt: r.updated_at,
      })),
    });
  } catch {
    return NextResponse.json({
      ok: true,
      source: 'cached-snapshot',
      username: 'TheyanzXD',
      projects: portfolioData.projects,
    });
  }
}
