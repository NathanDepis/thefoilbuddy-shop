import Link from 'next/link';
import Image from 'next/image';
import { t, localeHref, type Locale } from '@/lib/i18n';
import { getCommunityStats } from '@/lib/stats';
import ShopHeader from './ShopHeader';
import Footer from './Footer';
import GrainOverlay from './GrainOverlay';

const APP_URL = 'https://app.thefoilbuddy.com';
const INSTAGRAM_URL = 'https://www.instagram.com/thefoilbuddy/';

export default async function Landing({ locale }: { locale: Locale }) {
  const d = t(locale).landing;
  const stats = await getCommunityStats();
  const fmt = (n: number | null, fallback: string) =>
    n === null ? fallback : n.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US');

  return (
    <main className="relative min-h-screen bg-[#091E2C] text-white">
      <GrainOverlay />
      <div className="relative z-[2] max-w-6xl mx-auto px-4 sm:px-8">
        <ShopHeader locale={locale} />

        {/* ====== HERO ====== */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0B3C5D] via-[#091E2C] to-[#041320] p-8 sm:p-16 mb-10">
          <Image
            src="/logo-hd.png"
            alt="The Foil Buddy"
            width={512}
            height={512}
            priority
            quality={95}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-44 h-44 sm:w-64 sm:h-64 lg:w-80 lg:h-80 object-contain pointer-events-none opacity-95 hidden md:block"
          />
          <div
            className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #4DB8C7 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #9ED63A 0%, transparent 70%)' }}
          />

          <div className="relative max-w-3xl md:max-w-[55%] lg:max-w-[55%]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4DB8C7]/40 bg-[#4DB8C7]/10 px-3 py-1 text-xs uppercase tracking-widest text-[#4DB8C7] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4DB8C7] animate-pulse" />
              {d.eyebrow}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-[1.05] tracking-tight text-white mb-5">
              {d.title}
            </h1>
            <p className="text-lg sm:text-xl text-white/75 leading-relaxed">
              {d.subtitle}
            </p>
          </div>
        </section>

        {/* ====== TRUST BAR ====== */}
        <section className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-20">
          {d.trustBar.map((item, i) => {
            const icons = [
              // titanium = shield-check
              <path key="t" d="M12 2L4 7v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V7l-8-5z M9 12l2 2 4-4" />,
              // bayonne = pin
              <path key="b" d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />,
              // community = users
              <path key="c" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
            ];
            return (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-2 text-xs uppercase tracking-widest text-white/70"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-[#4DB8C7]">
                  {icons[i]}
                </svg>
                {item}
              </span>
            );
          })}
        </section>

        {/* ====== CHOOSE ====== */}
        <section className="mb-24">
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className="h-px w-12 bg-white/15" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/50">
              {d.chooseTitle}
            </span>
            <span className="h-px w-12 bg-white/15" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* --- APP CARD --- */}
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener"
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur hover:border-[#4DB8C7]/50 hover:bg-white/[0.07] transition-all duration-300"
            >
              {/* Visual: real app screenshots composited for "see it in action" */}
              <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#0E4C63] via-[#0B3C5D] to-[#052232] flex items-center justify-center">
                <div
                  className="absolute inset-0 opacity-30 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at 25% 25%, rgba(77,184,199,0.55) 0%, transparent 55%), radial-gradient(circle at 85% 75%, rgba(158,214,58,0.2) 0%, transparent 60%)',
                  }}
                />

                {/* Weather screenshot — back-left, tilted left, hidden on tiny screens */}
                <div className="absolute left-[4%] top-[22%] w-[50%] max-w-[250px] rounded-xl overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.65)] ring-1 ring-white/10 transform -rotate-[8deg] hidden sm:block opacity-85">
                  <Image
                    src="/app-weather.jpg"
                    alt="Weather forecast in-app"
                    width={560}
                    height={244}
                    className="w-full h-auto block"
                  />
                </div>

                {/* Share conditions screenshot — back-right, tilted right, hidden on tiny screens */}
                <div className="absolute right-[6%] top-[10%] w-[32%] max-w-[130px] rounded-2xl overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.65)] ring-1 ring-white/10 transform rotate-[9deg] hidden sm:block opacity-90">
                  <Image
                    src="/app-share.jpg"
                    alt="Share conditions card"
                    width={360}
                    height={640}
                    className="w-full h-auto block"
                  />
                </div>

                {/* Session/Strava share — front layer, largest, centered */}
                <div className="relative w-[42%] max-w-[165px] sm:w-[38%] sm:max-w-[170px] rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.75)] ring-1 ring-white/20 transform rotate-[-2deg] sm:rotate-[2deg] translate-y-[6%]">
                  <Image
                    src="/app-session.jpg"
                    alt="Session share card with GPS trace"
                    width={400}
                    height={712}
                    className="w-full h-auto block"
                  />
                </div>

                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[#4DB8C7]/15 border border-[#4DB8C7]/40 px-3 py-1 text-[11px] uppercase tracking-widest text-[#4DB8C7] font-semibold backdrop-blur z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4DB8C7] animate-pulse" />
                  {d.app.kicker}
                </div>
                {/* Live spot count overlay — keeps Supabase real data visible */}
                <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/50 border border-white/15 px-3 py-1.5 text-[11px] text-white backdrop-blur-md z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9ED63A] animate-pulse" />
                  <span className="font-semibold text-[#4DB8C7]">{fmt(stats.spots, '—')}</span>
                  <span className="text-white/60">{d.app.statsSpotsLabel}</span>
                </div>
              </div>
              <div className="p-6 sm:p-8 flex flex-col flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-[#4DB8C7] transition">
                  {d.app.title}
                </h2>
                <p className="text-white/70 leading-relaxed mb-5">{d.app.tagline}</p>
                <ul className="space-y-2.5 mb-6">
                  {d.app.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-white/80">
                      <svg className="mt-0.5 shrink-0 text-[#4DB8C7]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#4DB8C7]/50 bg-[#4DB8C7]/10 text-[#4DB8C7] font-semibold px-6 py-3 group-hover:bg-[#4DB8C7]/20 transition">
                  {d.app.cta}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </span>
              </div>
            </a>

            {/* --- SHOP CARD --- */}
            <Link
              href={localeHref(locale, '/shop')}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur hover:border-[#9ED63A]/50 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#0B3C5D] via-[#091E2C] to-[#041320]">
                {/* Subtle radial glows to fill the letterboxed sides */}
                <div
                  className="absolute inset-0 opacity-30 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at 20% 30%, rgba(77,184,199,0.35) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(158,214,58,0.25) 0%, transparent 60%)',
                  }}
                />
                <video
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  src="/hero.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden
                />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[#9ED63A]/15 border border-[#9ED63A]/40 px-3 py-1 text-[11px] uppercase tracking-widest text-[#9ED63A] font-semibold backdrop-blur z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9ED63A] animate-pulse" />
                  {d.shop.kicker}
                </div>
              </div>
              <div className="p-6 sm:p-8 flex flex-col flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-[#9ED63A] transition">
                  {d.shop.title}
                </h2>
                <p className="text-white/70 leading-relaxed mb-5">{d.shop.tagline}</p>
                <ul className="space-y-2.5 mb-6">
                  {d.shop.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-white/80">
                      <svg className="mt-0.5 shrink-0 text-[#9ED63A]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <span className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#9ED63A] text-[#0B3C5D] font-bold px-6 py-3 group-hover:shadow-[0_0_24px_rgba(158,214,58,0.4)] transition">
                  {d.shop.cta}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* ====== COMMUNITY BENTO ====== */}
        <section className="mb-24">
          <h2 className="text-center text-2xl sm:text-3xl font-semibold text-white mb-10 max-w-2xl mx-auto">
            {d.community.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tile 1 — Workshop video (2 cols) */}
            <div className="md:col-span-2 relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0B3C5D] via-[#091E2C] to-[#041320] backdrop-blur min-h-[320px]">
              <video
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                src="/workshop.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(9,30,44,0.15) 0%, rgba(9,30,44,0.4) 60%, rgba(9,30,44,0.95) 100%)',
                }}
              />
              <div className="relative h-full flex flex-col justify-between p-6 sm:p-8 min-h-[320px]">
                <div className="inline-flex self-start items-center gap-1.5 rounded-full bg-[#9ED63A]/15 border border-[#9ED63A]/40 px-3 py-1 text-[11px] uppercase tracking-widest text-[#9ED63A] font-semibold backdrop-blur">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9ED63A] animate-pulse" />
                  {d.community.workshopTag}
                </div>
                <p className="text-white text-lg font-medium max-w-md">
                  {d.community.workshopCaption}
                </p>
              </div>
            </div>

            {/* Tile 2 — Instagram (1 col) */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener"
              className="group relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#3a1a4d] via-[#2a0f3f] to-[#1a0630] backdrop-blur p-6 sm:p-8 flex flex-col justify-between min-h-[320px] hover:border-white/25 transition"
            >
              <div>
                <svg
                  className="w-10 h-10 text-white mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <div className="text-xl font-bold text-white mb-1">
                  {d.community.igHandle}
                </div>
                <p className="text-sm text-white/65 leading-relaxed">
                  Sessions, riders, coulisses.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm text-white/90 group-hover:text-white transition mt-6">
                {d.community.igCta}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </span>
            </a>
          </div>
        </section>

        {/* ====== FOUNDER'S OATH ====== */}
        <section className="mb-24">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0B3C5D] via-[#091E2C] to-[#041320] p-8 sm:p-12">
            <div
              className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, #4DB8C7 0%, transparent 70%)' }}
            />
            <div className="relative grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center">
              <div className="relative shrink-0 mx-auto md:mx-0">
                <div className="absolute inset-0 rounded-full bg-[#4DB8C7]/20 blur-2xl" />
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
                  <Image
                    src="/founder.jpg"
                    alt={d.founder.signature}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    priority={false}
                  />
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#4DB8C7]/40 bg-[#4DB8C7]/10 px-3 py-1 text-xs uppercase tracking-widest text-[#4DB8C7] mb-4">
                  {d.founder.kicker}
                </div>
                <blockquote className="text-xl sm:text-2xl text-white leading-relaxed font-medium mb-5">
                  <span className="text-[#4DB8C7]">“</span>
                  {d.founder.quote}
                  <span className="text-[#4DB8C7]">”</span>
                </blockquote>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-lg font-bold text-white">{d.founder.signature}</span>
                  <span className="text-sm text-white/55">· {d.founder.role}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer locale={locale} />
      </div>
    </main>
  );
}
