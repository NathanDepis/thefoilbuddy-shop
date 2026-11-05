import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { appPageT, type Shot } from '@/lib/app-page-i18n';
import { localeAlternates, SITE_URL } from '@/lib/seo';
import { WEB_APP_URL } from '@/lib/app-store';
import ShopHeader from '@/components/ShopHeader';
import Footer from '@/components/Footer';
import GrainOverlay from '@/components/GrainOverlay';
import StoreBadges from '@/components/StoreBadges';
import AppJsonLd from '@/components/AppJsonLd';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = appPageT(locale);
  return {
    title: { absolute: d.metaTitle },
    description: d.metaDescription,
    alternates: localeAlternates(locale, '/app'),
    openGraph: {
      type: 'website',
      title: d.metaTitle,
      description: d.metaDescription,
      url: `${SITE_URL}/${locale}/app`,
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      images: [{ url: '/app-share.jpg', width: 1200, height: 630, alt: 'TheFoilBuddy' }],
    },
    twitter: { card: 'summary_large_image', title: d.metaTitle, description: d.metaDescription, images: ['/app-share.jpg'] },
  };
}

function Phone({ shot, className = '', priority = false, sizes = '(max-width: 640px) 70vw, 280px' }: { shot: Shot; className?: string; priority?: boolean; sizes?: string }) {
  return (
    <div className={`rounded-[2rem] overflow-hidden ring-1 ring-white/15 bg-[#0B3C5D] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.75)] ${className}`}>
      <Image src={shot.src} alt={shot.alt} width={720} height={1400} sizes={sizes} priority={priority} className="w-full h-auto block" />
    </div>
  );
}

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-0.5 shrink-0 text-[#9ED63A]">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default async function AppPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = appPageT(locale);
  const lg = locale === 'fr' ? 'fr' : 'en';

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: d.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#091E2C] text-white">
      <AppJsonLd description={d.metaDescription} url={`${SITE_URL}/${locale}/app`} inLanguage={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, '\\u003c') }} />
      <GrainOverlay />
      <div className="relative z-[2] max-w-6xl mx-auto px-4 sm:px-8">
        <ShopHeader locale={locale} />

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0B3C5D] via-[#091E2C] to-[#041320] px-6 pt-10 pb-0 sm:px-14 sm:pt-14 mb-20">
          <div className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full opacity-25 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #4DB8C7 0%, transparent 70%)' }} />
          <div className="absolute -bottom-32 -left-24 w-[420px] h-[420px] rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #9ED63A 0%, transparent 70%)' }} />
          <div className="relative grid md:grid-cols-[1.1fr_1fr] gap-10 items-end">
            <div className="pb-10 sm:pb-14 self-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#4DB8C7]/40 bg-[#4DB8C7]/10 px-3 py-1 text-xs uppercase tracking-widest text-[#4DB8C7] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4DB8C7] animate-pulse" />
                {d.kicker}
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold leading-[1.04] tracking-tight mb-5">
                {d.title} <span className="bg-gradient-to-r from-[#4DB8C7] to-[#9ED63A] bg-clip-text text-transparent">{d.titleAccent}</span>
              </h1>
              <p className="text-lg text-white/75 leading-relaxed mb-6 max-w-xl">{d.intro}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {d.pills.map((p) => (
                  <span key={p} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">{p}</span>
                ))}
              </div>
              <StoreBadges locale={locale} />
              <p className="mt-4 text-sm font-semibold text-[#9ED63A]">{d.free}</p>
              <a href={WEB_APP_URL} target="_blank" rel="noopener" className="mt-2 inline-block text-sm text-white/60 underline underline-offset-4 hover:text-white">
                {d.webApp}
              </a>
            </div>
            <div className="relative flex justify-center md:justify-end gap-4">
              <Phone shot={d.heroShot} priority sizes="(max-width: 768px) 62vw, 300px" className="w-[62%] max-w-[300px] translate-y-6 rounded-b-none" />
              <Phone shot={{ src: `/app-shots/v2-stats-${lg}.jpg`, alt: d.features[2].shots[0].alt }} sizes="(max-width: 768px) 40vw, 220px" className="hidden sm:block w-[40%] max-w-[220px] translate-y-16 rotate-[3deg] opacity-90 rounded-b-none" />
            </div>
          </div>
        </section>

        {/* FEATURE NAV */}
        <nav aria-label="sections" className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto pb-2 mb-14 sm:justify-center">
          {d.features.map((f) => (
            <a key={f.id} href={`#${f.id}`} className="shrink-0 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 hover:border-[#4DB8C7]/60 hover:text-white transition">
              {f.kicker}
            </a>
          ))}
          <a href="#watches" className="shrink-0 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 hover:border-[#4DB8C7]/60 hover:text-white transition">
            {d.watchKicker}
          </a>
        </nav>

        {/* FEATURES */}
        {d.features.map((f, i) => {
          const flip = i % 2 === 1;
          return (
            <section key={f.id} id={f.id} className="scroll-mt-24 mb-24 sm:mb-32 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className={flip ? 'md:order-2' : ''}>
                <div className="text-xs uppercase tracking-[0.2em] text-[#4DB8C7] mb-3">
                  <span className="text-white/35 mr-2">{String(i + 1).padStart(2, '0')}</span>
                  {f.kicker}
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">{f.title}</h2>
                <p className="text-white/70 leading-relaxed mb-6">{f.body}</p>
                <ul className="space-y-2.5">
                  {f.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm text-white/85">
                      <Check />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`relative flex justify-center gap-4 ${flip ? 'md:order-1' : ''}`}>
                <div className="absolute inset-0 m-auto w-3/4 h-3/4 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: `radial-gradient(circle, ${i % 2 ? '#9ED63A' : '#4DB8C7'} 0%, transparent 70%)` }} />
                {f.shots.map((s, j) => (
                  <Phone
                    key={s.src}
                    shot={s}
                    sizes="(max-width: 768px) 45vw, 260px"
                    className={`relative ${f.shots.length > 1 ? 'w-[46%] max-w-[250px]' : 'w-[64%] max-w-[290px]'} ${j === 1 ? 'mt-12 rotate-[2deg]' : ''}`}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* WATCHES */}
        <section id="watches" className="scroll-mt-24 mb-24 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0B3C5D]/70 to-[#041320] p-8 sm:p-12">
          <div className="text-xs uppercase tracking-[0.2em] text-[#4DB8C7] mb-3">{d.watchKicker}</div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{d.watchTitle}</h2>
          <p className="text-white/70 leading-relaxed mb-8 max-w-2xl">{d.watchBody}</p>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {d.watches.map((w) => (
              <div key={w.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-2 font-semibold mb-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-[#4DB8C7]">
                    <circle cx="12" cy="12" r="6" />
                    <path d="M9 18l1 4h4l1-4M9 6l1-4h4l1 4M12 9.5V12l1.5 1.5" />
                  </svg>
                  {w.name}
                </div>
                <p className="text-sm text-white/65 leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
          <StoreBadges locale={locale} size="sm" />
        </section>

        {/* STORE GALLERY */}
        <section className="mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">{d.shotsTitle}</h2>
          <div className="-mx-4 sm:mx-0 px-4 sm:px-0 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4">
            {d.storeShots.map((alt, i) => {
              const src = `/app-shots/store-${lg}-${i + 1}.jpg`;
              return (
                <figure key={src} className="snap-start shrink-0 w-[62%] sm:w-[220px]">
                  <div className="aspect-[9/16] rounded-2xl overflow-hidden ring-1 ring-white/10 bg-[#0B3C5D]">
                    <Image src={src} alt={alt} width={720} height={1280} sizes="(max-width: 640px) 62vw, 220px" className="w-full h-full object-cover" />
                  </div>
                  <figcaption className="mt-2 text-xs text-white/55">{alt}</figcaption>
                </figure>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-24 max-w-3xl">
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
        <section className="relative overflow-hidden mb-10 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0B3C5D] to-[#041320] p-8 sm:p-14 text-center">
          <div className="absolute inset-x-0 -top-40 mx-auto w-[500px] h-[400px] rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #4DB8C7 0%, transparent 70%)' }} />
          <h2 className="relative text-3xl sm:text-4xl font-bold tracking-tight mb-3">{d.ctaTitle}</h2>
          <p className="relative text-white/70 mb-8">{d.ctaBody}</p>
          <div className="relative">
            <StoreBadges locale={locale} align="center" />
          </div>
        </section>

        <Footer locale={locale} />
      </div>
    </main>
  );
}
