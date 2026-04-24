import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, t, localeHref } from '@/lib/i18n';
import ShopHeader from '@/components/ShopHeader';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function ThanksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale);

  return (
    <main className="min-h-screen bg-[#091E2C] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <ShopHeader locale={locale} />

        <div className="max-w-xl mx-auto mt-12 rounded-3xl border border-[#9ED63A]/30 bg-gradient-to-br from-[#9ED63A]/10 to-transparent p-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#9ED63A]/15 flex items-center justify-center mb-6">
            <svg
              className="text-[#9ED63A]"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{d.thanks.title}</h1>
          <p className="text-white/75 mb-8 leading-relaxed">{d.thanks.body}</p>
          <Link
            href={localeHref(locale, '/shop')}
            className="inline-block rounded-full bg-[#4DB8C7] text-[#091E2C] font-semibold px-6 py-3 hover:opacity-90 transition"
          >
            {d.thanks.backToShop}
          </Link>
        </div>

        <Footer locale={locale} />
      </div>
    </main>
  );
}
