import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isLocale, type Locale } from '@/lib/i18n';
import { verifyReviewToken } from '@/lib/review-token';
import { REVIEW_STRINGS } from '@/lib/review-i18n';
import ShopHeader from '@/components/ShopHeader';
import Footer from '@/components/Footer';
import { ReviewForm } from './ReviewForm';

export const dynamic = 'force-dynamic';

export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; orderId: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { locale, orderId } = await params;
  const { t: token } = await searchParams;
  if (!isLocale(locale)) notFound();

  const lang = locale as Locale;
  const strings = REVIEW_STRINGS[lang];

  if (!token) {
    return <InvalidPage locale={lang} strings={strings} />;
  }
  const result = verifyReviewToken(token, orderId, lang);
  if (!result.valid) {
    return <InvalidPage locale={lang} strings={strings} />;
  }
  const { payload } = result;

  return (
    <main className="min-h-screen bg-[#091E2C] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <ShopHeader locale={lang} />
        <section className="mx-auto max-w-xl py-12 sm:py-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9ED63A]/15 text-[#9ED63A] text-[11px] font-bold uppercase tracking-wider px-3 py-1 border border-[#9ED63A]/30">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            {strings.verifiedBadge}
          </span>
          <h1 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            {strings.formTitle(payload.productName)}
          </h1>
          <p className="mt-3 text-white/70 text-lg">{strings.formSubtitle(payload.firstName)}</p>
          <ReviewForm
            locale={lang}
            orderId={payload.orderId}
            token={token}
            productSlug={payload.productSlug}
            productName={payload.productName}
            defaultName={payload.firstName}
          />
        </section>
      </div>
      <Footer locale={lang} />
    </main>
  );
}

function InvalidPage({
  locale,
  strings,
}: {
  locale: Locale;
  strings: typeof REVIEW_STRINGS['fr'];
}) {
  return (
    <main className="min-h-screen bg-[#091E2C] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <ShopHeader locale={locale} />
        <section className="mx-auto max-w-xl py-16 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">{strings.invalidTitle}</h1>
          <p className="mt-4 text-white/70">{strings.invalidBody}</p>
          <Link
            href={`/${locale}`}
            className="mt-8 inline-block rounded-full bg-[#9ED63A] px-6 py-3 text-sm font-bold text-[#0B3C5D]"
          >
            {strings.thanksLink}
          </Link>
        </section>
      </div>
      <Footer locale={locale} />
    </main>
  );
}
