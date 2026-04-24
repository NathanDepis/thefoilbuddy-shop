import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import Landing from '@/components/Landing';

export default async function LocaleIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Landing locale={locale} />;
}
