import { t, type Locale } from '@/lib/i18n';

export default function Comparison({ locale }: { locale: Locale }) {
  const d = t(locale).comparison;
  return (
    <section className="mb-16">
      <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-8 text-center">
        {d.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-red-400/20 bg-gradient-to-br from-red-950/40 to-transparent p-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 text-red-400/50">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-xs uppercase tracking-widest text-red-400/80 mb-3">
            {d.old.label}
          </div>
          <p className="text-white/80 leading-relaxed">{d.old.body}</p>
        </div>
        <div className="rounded-2xl border border-[#9ED63A]/30 bg-gradient-to-br from-[#9ED63A]/10 to-transparent p-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 text-[#9ED63A]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-xs uppercase tracking-widest text-[#9ED63A] mb-3">
            {d.modern.label}
          </div>
          <p className="text-white/85 leading-relaxed">{d.modern.body}</p>
        </div>
      </div>
    </section>
  );
}
