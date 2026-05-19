import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n';
import { REVIEW_STRINGS } from '@/lib/review-i18n';

export default async function ThanksPage({
  params,
}: {
  params: Promise<{ locale: string; orderId: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lang = locale as Locale;
  const strings = REVIEW_STRINGS[lang];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#FFC937]/10">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#FFC937" aria-hidden>
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight">{strings.thanksTitle}</h1>
        <p className="mt-4 text-white/70">{strings.thanksBody}</p>
        <Link
          href={`/${lang}`}
          className="mt-10 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-black"
        >
          {strings.thanksLink}
        </Link>
      </div>
    </main>
  );
}
