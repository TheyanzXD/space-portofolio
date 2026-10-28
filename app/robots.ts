import type { MetadataRoute } from 'next';
import { portfolioData } from '@/data/portfolio';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || portfolioData.seo.urlSitus;
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
