'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '@/lib/i18n';

export default function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname() ?? '/';

  function hrefFor(target: Locale): string {
    // Strip current locale prefix to get the canonical path.
    const parts = pathname.split('/').filter(Boolean);
    const hasLocalePrefix = (LOCALES as readonly string[]).includes(parts[0] ?? '');
    const rest = hasLocalePrefix ? parts.slice(1) : parts;
    const path = '/' + rest.join('/');
    if (target === DEFAULT_LOCALE) return path === '/' ? '/' : path;
    return `/${target}${path === '/' ? '' : path}`;
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 backdrop-blur p-1">
      {LOCALES.map((loc) => {
        const isActive = loc === current;
        return (
          <Link
            key={loc}
            href={hrefFor(loc)}
            prefetch={false}
            className={`px-2.5 py-1 text-xs rounded-full transition ${
              isActive
                ? 'bg-[#4DB8C7] text-[#091E2C] font-semibold'
                : 'text-white/70 hover:text-white'
            }`}
            aria-current={isActive ? 'true' : undefined}
          >
            {loc.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
