import type { Metadata } from 'next';
import { LOCALES, type Locale } from '@/lib/i18n';

export const SITE_URL = 'https://www.thefoilbuddy.com';

/**
 * Canonical + hreflang for a localized page. Canonical URLs are always
 * locale-prefixed (/en/..., /fr/...) to match the sitemap.
 */
export function localeAlternates(locale: Locale, path: string): Metadata['alternates'] {
  const clean = path === '/' || path === '' ? '' : path.startsWith('/') ? path : `/${path}`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `/${l}${clean}`;
  languages['x-default'] = `/en${clean}`;
  return { canonical: `/${locale}${clean}`, languages };
}

export const NOINDEX: Metadata['robots'] = { index: false, follow: true };

/** Full localized metadata: absolute title, description, canonical/hreflang, Open Graph, Twitter. */
export function pageMetadata(
  locale: Locale,
  path: string,
  meta: { title: string; description: string },
  image?: { url: string; width?: number; height?: number; alt?: string },
): Metadata {
  const clean = path === '/' || path === '' ? '' : path.startsWith('/') ? path : `/${path}`;
  const img = image ?? { url: '/app-share.jpg', width: 1200, height: 630, alt: 'The Foil Buddy' };
  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: localeAlternates(locale, path),
    openGraph: {
      type: 'website',
      siteName: 'The Foil Buddy',
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${locale}${clean}`,
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      images: [img],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [img.url],
    },
  };
}
