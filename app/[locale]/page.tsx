import type { Metadata } from 'next';
import { localeAlternates, NOINDEX } from '@/lib/seo';
import { isLocale as _isLocale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import Landing from '@/components/Landing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!_isLocale(locale)) return {};
  return { alternates: localeAlternates(locale, '/') };
}

export default async function LocaleIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Landing locale={locale} />;
}
