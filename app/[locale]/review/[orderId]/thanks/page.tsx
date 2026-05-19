import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n';
import { REVIEW_STRINGS } from '@/lib/review-i18n';
import ShopHeader from '@/components/ShopHeader';
import Footer from '@/components/Footer';

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
    <main className="min-h-screen bg-[#091E2C] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <ShopHeader locale={lang} />
        <section className="mx-auto max-w-xl py-20 sm:py-24 text-center">
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#9ED63A]/15 border border-[#9ED63A]/30">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#9ED63A" aria-hidden>
              <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
          <h1 className="mt-8 text-4xl sm:text-5xl font-semibold tracking-tight">{strings.thanksTitle}</h1>
          <p className="mt-4 text-white/70 text-lg">{strings.thanksBody}</p>
          <Link
            href={`/${lang}`}
            className="mt-10 inline-block rounded-full bg-[#9ED63A] px-8 py-3 text-sm font-bold text-[#0B3C5D] hover:bg-[#b1e054] transition"
          >
            {strings.thanksLink}
          </Link>
        </section>
      </div>
      <Footer locale={lang} />
    </main>
  );
}
