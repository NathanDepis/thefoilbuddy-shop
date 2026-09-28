import { APP_STORE_URL, PLAY_STORE_URL, PLAY_STORE_LIVE } from '@/lib/app-store';
import type { Locale } from '@/lib/i18n';

/** Official App Store + Google Play badges. Play shown as "coming soon" while in closed test. */
export default function StoreBadges({
  locale,
  align = 'start',
  size = 'md',
}: {
  locale: Locale;
  align?: 'start' | 'center';
  size?: 'sm' | 'md';
}) {
  const h = size === 'sm' ? 'h-10' : 'h-12';
  const soon = locale === 'fr' ? 'Bientôt' : 'Coming soon';
  const playSrc = locale === 'fr' ? '/badges/gplay-fr.png' : '/badges/gplay-en.png';
  return (
    <div className={`flex flex-wrap items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener"
        aria-label={locale === 'fr' ? "Télécharger sur l'App Store" : 'Download on the App Store'}
        className="inline-block transition hover:opacity-90"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/badges/appstore-en.svg" alt="Download on the App Store" className={`${h} w-auto`} />
      </a>
      {(() => {
        const badge = (
          <span className={`inline-flex items-center overflow-hidden ${h}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={playSrc}
              alt={PLAY_STORE_LIVE ? 'Google Play' : ''}
              className={`h-[136%] w-auto max-w-none -mx-[5%] ${PLAY_STORE_LIVE ? '' : 'opacity-45 grayscale'}`}
            />
          </span>
        );
        return PLAY_STORE_LIVE ? (
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener" className="inline-block transition hover:opacity-90">
            {badge}
          </a>
        ) : (
          <span className="relative inline-flex items-center" title={soon} aria-label={`Google Play — ${soon}`}>
            {badge}
            <span className="absolute -top-2 -right-2 rounded-full bg-[#9ED63A] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#091E2C]">
              {soon}
            </span>
          </span>
        );
      })()}
    </div>
  );
}
