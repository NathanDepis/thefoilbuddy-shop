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
