import Link from 'next/link';
import { t, localeHref, type Locale } from '@/lib/i18n';
import { COMPANY } from '@/lib/legal';

export default function Footer({ locale }: { locale: Locale }) {
  const d = t(locale).footer;
  const year = new Date().getFullYear();

  const links: { href: string; label: string }[] = [
    { href: '/legal', label: d.legal },
    { href: '/terms', label: d.terms },
    { href: '/privacy', label: d.privacy },
    { href: '/returns', label: d.returns },
  ];

  return (
    <footer className="mt-20 pt-10 pb-8 border-t border-white/10 text-center">
      <div className="text-white font-semibold mb-1">The Foil Buddy</div>
      <p className="text-sm text-white/60 mb-6">{d.tagline}</p>

      <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/70 mb-6">
        {links.map((l) => (
          <Link
            key={l.href}
            href={localeHref(locale, l.href)}
            className="hover:text-white transition"
          >
            {l.label}
          </Link>
        ))}
        <a
          href={`mailto:${COMPANY.email}`}
          className="hover:text-white transition"
        >
          {d.contact}
        </a>
      </nav>

      <p className="text-xs text-white/40 leading-relaxed max-w-xl mx-auto">
        {COMPANY.name} — {COMPANY.legalForm}, capital {COMPANY.capital}. SIREN {COMPANY.siren}. TVA {COMPANY.vatNumber}.
        <br />
        Bayonne, France — {d.made} © {year}
      </p>
    </footer>
  );
}
