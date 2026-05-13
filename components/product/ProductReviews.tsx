import { getReviews, getReviewStats } from '@/lib/reviews';
import { type Locale } from '@/lib/i18n';

type Props = {
  slug: string;
  locale: Locale;
};

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  // Renders 5 stars; partial fill via clip-path width % for the average display.
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className="relative inline-flex" aria-label={`${value.toFixed(1)} / 5`}>
      {/* base (empty) */}
      <span className="inline-flex text-white/20">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} size={size} />
        ))}
      </span>
      {/* filled overlay */}
      <span
        className="absolute inset-0 inline-flex overflow-hidden text-[#FFC937]"
        style={{ width: `${pct}%` }}
        aria-hidden
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} size={size} />
        ))}
      </span>
    </span>
  );
}

function Star({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="shrink-0"
    >
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function formatDate(iso: string, locale: Locale) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function ProductReviews({ slug, locale }: Props) {
  const reviews = getReviews(slug);
  if (reviews.length === 0) return null;

  const stats = getReviewStats(slug);
  const max = Math.max(...Object.values(stats.histogram));

  const sorted = [...reviews].sort((a, b) => (a.date < b.date ? 1 : -1));

  const copy =
    locale === 'fr'
      ? {
          kicker: 'Avis clients',
          basedOn: (n: number) => `Basé sur ${n} avis vérifiés`,
          verified: 'Achat vérifié',
          breakdown: 'Répartition des notes',
          star: 'étoile',
          stars: 'étoiles',
        }
      : {
          kicker: 'Customer reviews',
          basedOn: (n: number) => `Based on ${n} verified reviews`,
          verified: 'Verified buyer',
          breakdown: 'Rating breakdown',
          star: 'star',
          stars: 'stars',
        };

  return (
    <section id="reviews" className="mb-16 max-w-4xl">
      <h2 className="text-xs uppercase tracking-widest text-[#4DB8C7] mb-5">
        {copy.kicker}
      </h2>

      {/* Header: average + histogram */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-6 sm:p-8 mb-8">
        <div className="grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-10 items-center">
          <div className="text-center sm:text-left">
            <div className="text-5xl font-bold text-white leading-none">
              {stats.average.toFixed(1)}
              <span className="text-2xl text-white/40">/5</span>
            </div>
            <div className="mt-2 flex justify-center sm:justify-start">
              <Stars value={stats.average} size={18} />
            </div>
            <div className="mt-2 text-sm text-white/60">
              {copy.basedOn(stats.count)}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-white/40 mb-3">
              {copy.breakdown}
            </div>
            <ul className="space-y-1.5">
              {([5, 4, 3, 2, 1] as const).map((n) => {
                const v = stats.histogram[n];
                const pct = max === 0 ? 0 : (v / max) * 100;
                return (
                  <li key={n} className="flex items-center gap-3 text-sm">
                    <span className="w-12 text-white/60 inline-flex items-center gap-1">
                      {n}
                      <Star size={12} />
                    </span>
                    <span className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <span
                        className="block h-full rounded-full bg-[#FFC937]"
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="w-6 text-right text-white/50 tabular-nums">
                      {v}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* List of reviews */}
      <ul className="space-y-5">
        {sorted.map((r) => (
          <li
            key={r.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <Stars value={r.rating} size={15} />
              {r.title && (
                <span className="font-semibold text-white text-base">
                  {r.title}
                </span>
              )}
            </div>
            <p className="text-white/80 leading-relaxed text-[15px]">
              {r.body}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/55">
              <span className="font-medium text-white/80">{r.name}</span>
              {r.location && <span>· {r.location}</span>}
              <span>· {formatDate(r.date, locale)}</span>
              {r.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#9ED63A]/10 border border-[#9ED63A]/30 text-[#9ED63A] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {copy.verified}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
