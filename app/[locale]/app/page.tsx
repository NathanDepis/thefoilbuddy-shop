import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { appPageT } from '@/lib/app-page-i18n';
import { localeAlternates, SITE_URL } from '@/lib/seo';
import { WEB_APP_URL } from '@/lib/app-store';
import ShopHeader from '@/components/ShopHeader';
import Footer from '@/components/Footer';
import GrainOverlay from '@/components/GrainOverlay';
import StoreBadges from '@/components/StoreBadges';
import AppJsonLd from '@/components/AppJsonLd';

const SHOTS = [
  '/app-shots/01-carte.jpg',
  '/app-shots/02-spot.jpg',
  '/app-shots/03-modeles.jpg',
  '/app-shots/04-session.jpg',
  '/app-shots/05-partage.jpg',
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = appPageT(locale);
  return {
    title: { absolute: d.metaTitle },
    description: d.metaDescription,
    alternates: localeAlternates(locale, '/app'),
    openGraph: {
      title: d.metaTitle,
      description: d.metaDescription,
      url: `${SITE_URL}/${locale}/app`,
      images: [{ url: '/app-share.jpg', width: 1200, height: 630, alt: 'TheFoilBuddy' }],
    },
  };
}

export default async function AppPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = appPageT(locale);

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: d.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <main className="relative min-h-screen bg-[#091E2C] text-white">
      <AppJsonLd description={d.metaDescription} url={`${SITE_URL}/${locale}/app`} inLanguage={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, '\\u003c') }} />
      <GrainOverlay />
      <div className="relative z-[2] max-w-6xl mx-auto px-4 sm:px-8">
        <ShopHeader locale={locale} />

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0B3C5D] via-[#091E2C] to-[#041320] p-8 sm:p-14 mb-16">
          <div
            className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #4DB8C7 0%, transparent 70%)' }}
          />
          <div className="relative grid md:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#4DB8C7]/40 bg-[#4DB8C7]/10 px-3 py-1 text-xs uppercase tracking-widest text-[#4DB8C7] mb-6">
                {d.kicker}
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold leading-[1.08] tracking-tight mb-5">{d.title}</h1>
              <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-xl">{d.intro}</p>
              <StoreBadges locale={locale} />
              <a href={WEB_APP_URL} target="_blank" rel="noopener" className="mt-5 inline-block text-sm text-white/60 underline underline-offset-4 hover:text-white">
                {d.webApp}
              </a>
            </div>
            <div className="hidden md:block w-[230px] rounded-[2rem] overflow-hidden ring-1 ring-white/15 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.75)] rotate-[2deg]">
              <Image src={SHOTS[0]} alt={d.shots[0]} width={720} height={1463} priority className="w-full h-auto block" />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">{d.featuresTitle}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {d.features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-semibold text-[#4DB8C7] mb-2">{f.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SCREENSHOTS */}
        <section className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">{d.shotsTitle}</h2>
          <div className="-mx-4 sm:mx-0 px-4 sm:px-0 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4">
            {SHOTS.map((src, i) => (
              <figure key={src} className="snap-start shrink-0 w-[62%] sm:w-[200px]">
                <div className="aspect-[720/1463] rounded-2xl overflow-hidden ring-1 ring-white/10 bg-[#0B3C5D]">
                  <Image src={src} alt={d.shots[i]} width={720} height={1463} className="w-full h-full object-cover object-top" />
                </div>
                <figcaption className="mt-2 text-xs text-white/55">{d.shots[i]}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-20 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">{d.faqTitle}</h2>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {d.faq.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="cursor-pointer list-none flex justify-between gap-4 font-medium">
                  {f.q}
                  <span className="text-white/40 group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">{d.ctaTitle}</h2>
          <StoreBadges locale={locale} align="center" />
        </section>

        <Footer locale={locale} />
      </div>
    </main>
  );
}
