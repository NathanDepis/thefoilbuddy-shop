import Link from 'next/link';
import { isLocale, t, localeHref, type Locale } from '@/lib/i18n';
import { getLegalDoc, type LegalKey } from '@/lib/legal';
import { notFound } from 'next/navigation';
import ShopHeader from './ShopHeader';
import Footer from './Footer';

export default function LegalPage({
  locale: rawLocale,
  docKey,
}: {
  locale: string;
  docKey: LegalKey;
}) {
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const doc = getLegalDoc(locale, docKey);
  const d = t(locale);

  return (
    <main className="min-h-screen bg-[#091E2C] text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <ShopHeader locale={locale} />

        <Link
          href={localeHref(locale, '/shop')}
          className="inline-block mb-6 text-sm text-white/60 hover:text-white transition"
        >
          {d.product.back}
        </Link>

        <article className="pb-16">
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{doc.title}</h1>
            <p className="text-sm text-white/50">{doc.updated}</p>
          </header>

          <div className="space-y-8">
            {doc.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-lg font-semibold text-[#4DB8C7] mb-3">
                  {section.heading}
                </h2>
                <p className="text-[15px] text-white/80 leading-relaxed whitespace-pre-line">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </article>

        <Footer locale={locale} />
      </div>
    </main>
  );
}
