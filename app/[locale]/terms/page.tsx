import type { Metadata } from 'next';
import { localeAlternates, NOINDEX } from '@/lib/seo';
import { isLocale as _isLocale } from '@/lib/i18n';
import LegalPage from '@/components/LegalPage';

export const dynamic = 'force-static';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!_isLocale(locale)) return {};
  return { alternates: localeAlternates(locale, '/terms') };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalPage locale={locale} docKey="terms" />;
}
