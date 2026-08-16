import Link from 'next/link';
import Image from 'next/image';
import { getWixClient } from '@/lib/wix-server';
import { t, localeHref, type Locale } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

const APP_URL = 'https://app.thefoilbuddy.com';

async function getCartCount(locale: Locale): Promise<number> {
  try {
    const { client, hasTokens } = await getWixClient(locale);
    if (!hasTokens) return 0;
    const cart = await client.currentCart.getCurrentCart();
    return (cart.lineItems ?? []).reduce(
      (sum, li) => sum + (li.quantity ?? 0),
      0,
    );
  } catch {
    return 0;
  }
}

export default async function ShopHeader({ locale }: { locale: Locale }) {
  const count = await getCartCount(locale);
  const d = t(locale);

  return (
    <header className="sticky top-0 z-40 -mx-4 sm:-mx-8 mb-10 border-b border-white/10 bg-[#091E2C]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4 px-4 sm:px-8 py-4">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0 flex-shrink">
          <Link
            href={localeHref(locale, '/')}
            className="flex items-center gap-2 sm:gap-2.5 group min-w-0 flex-shrink"
            aria-label="The Foil Buddy"
          >
            <Image
              src="/logo-icon.png"
              alt="The Foil Buddy"
              width={64}
              height={64}
              priority
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-cover shrink-0 group-hover:scale-105 transition"
            />
            <span className="hidden sm:inline text-2xl font-bold tracking-tight text-white group-hover:text-[#4DB8C7] transition">
              The Foil Buddy
            </span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href={localeHref(locale, '/shop')}
              className="rounded-full px-3 py-1.5 text-sm text-white/75 hover:text-white hover:bg-white/5 transition"
            >
              {d.nav.shop}
            </Link>
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-white/75 hover:text-white hover:bg-white/5 transition"
            >
              {d.nav.app}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="opacity-60">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher current={locale} />
          <Link
            href={localeHref(locale, '/cart')}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-3 sm:px-4 py-2 text-sm hover:bg-white/15 transition"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="hidden sm:inline">{d.nav.cart}</span>
            {count > 0 && (
              <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded-full bg-[#9ED63A] text-[#091E2C] text-xs font-bold">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
