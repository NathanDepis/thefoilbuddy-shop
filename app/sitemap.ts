import type { MetadataRoute } from 'next';
import { LOCALES } from '@/lib/i18n';

const SITE = 'https://www.thefoilbuddy.com';

const STATIC_PATHS = ['', '/shop', '/privacy', '/terms', '/legal', '/returns'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return LOCALES.flatMap((locale) =>
    STATIC_PATHS.map((path) => ({
      url: `${SITE}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === '' || path === '/shop' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1 : path === '/shop' ? 0.9 : 0.5,
    })),
  );
}
