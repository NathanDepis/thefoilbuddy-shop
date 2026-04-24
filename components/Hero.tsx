import { t, type Locale } from '@/lib/i18n';

export default function Hero({ locale }: { locale: Locale }) {
  const d = t(locale).hero;
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0B3C5D] via-[#091E2C] to-[#041320] p-8 sm:p-14 mb-16">
      <video
        className="absolute inset-0 w-full h-full object-cover object-center md:object-right pointer-events-none"
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />
      {/* Readability overlay:
            mobile — dark veil over the whole frame
            desktop — fade from opaque-left to transparent-right so the
            square video on the right stays intact while the text on the
            left sits on a solid gradient */}
      <div
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(9,30,44,0.55) 0%, rgba(9,30,44,0.45) 40%, rgba(9,30,44,0.85) 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          background:
            'linear-gradient(90deg, rgba(9,30,44,0.95) 0%, rgba(9,30,44,0.8) 40%, rgba(9,30,44,0.15) 75%, rgba(9,30,44,0) 100%)',
        }}
      />
      {/* glow */}
      <div
        className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4DB8C7 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #9ED63A 0%, transparent 70%)' }}
      />

      <div className="relative max-w-3xl md:max-w-[55%] lg:max-w-[52%]">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#4DB8C7]/40 bg-[#4DB8C7]/10 px-3 py-1 text-xs uppercase tracking-widest text-[#4DB8C7] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4DB8C7] animate-pulse" />
          {d.eyebrow}
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold leading-[1.05] tracking-tight text-white mb-5">
          {d.title}
        </h1>

        <p className="text-lg sm:text-xl text-white/75 leading-relaxed mb-8">
          {d.subtitle}
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href="#products"
            className="inline-flex items-center gap-2 rounded-full bg-[#9ED63A] text-[#0B3C5D] font-semibold px-7 py-3.5 hover:shadow-[0_0_24px_rgba(158,214,58,0.4)] hover:scale-[1.02] transition"
          >
            {d.cta}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#how"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 text-white px-6 py-3.5 hover:bg-white/10 transition"
          >
            {d.secondaryCta}
          </a>
        </div>
      </div>
    </section>
  );
}
