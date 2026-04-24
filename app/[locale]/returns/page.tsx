import LegalPage from '@/components/LegalPage';

export const dynamic = 'force-static';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalPage locale={locale} docKey="returns" />;
}
