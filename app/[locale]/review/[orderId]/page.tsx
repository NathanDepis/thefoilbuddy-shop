import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isLocale, type Locale } from '@/lib/i18n';
import { verifyReviewToken } from '@/lib/review-token';
import { REVIEW_STRINGS } from '@/lib/review-i18n';
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
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-xl px-6 py-16">
        <Link href={`/${lang}`} className="inline-flex items-center text-sm text-white/60 hover:text-white">
          <span aria-hidden>← </span>TheFoilBuddy
        </Link>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight">
          {strings.formTitle(payload.productName)}
        </h1>
        <p className="mt-3 text-white/70">{strings.formSubtitle(payload.firstName)}</p>
        <p className="mt-2 inline-block rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wider text-white/80">
          {strings.verifiedBadge}
        </p>
        <ReviewForm
          locale={lang}
          orderId={payload.orderId}
          token={token}
          productSlug={payload.productSlug}
          productName={payload.productName}
          defaultName={payload.firstName}
        />
      </div>
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
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">{strings.invalidTitle}</h1>
        <p className="mt-3 text-white/70">{strings.invalidBody}</p>
        <Link
          href={`/${locale}`}
          className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
        >
          {strings.thanksLink}
        </Link>
      </div>
    </main>
  );
}
