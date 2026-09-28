import type { MetadataRoute } from 'next';
import { LOCALES } from '@/lib/i18n';

const SITE = 'https://www.thefoilbuddy.com';

const STATIC_PATHS = ['', '/shop', '/app', '/privacy', '/terms', '/legal', '/returns'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return LOCALES.flatMap((locale) =>
    STATIC_PATHS.map((path) => ({
      url: `${SITE}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === '' || path === '/shop' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1 : path === '/shop' || path === '/app' ? 0.9 : 0.5,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE}/${l}${path}`])),
      },
    })),
  );
}
