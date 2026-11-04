import type { Locale } from '@/lib/i18n';

/**
 * Click-oriented <title> (<= 60 chars) and meta description (<= 155 chars)
 * per page and locale. Tuned 2026-11-04 from Search Console (Oct: 1.24K
 * impressions, 62 clicks; queries "the foil buddy", "foil buddy tool").
 */
export type SeoMeta = { title: string; description: string };

export const HOME_META: Record<Locale, SeoMeta> = {
  fr: {
    title: 'Foil Buddy : outil foil flottant en titane + app gratuite',
    description:
      'Clé Torx T30/T40/T45 en titane qui flotte, à glisser dans ta combi pour régler ton foil sur le spot. Et l’app foil gratuite : spots, vent, GPS, coach IA.',
  },
  en: {
    title: 'Foil Buddy: floating titanium foil tool + free foil app',
    description:
      'Floating titanium Torx T30/T40/T45 key that fits in your wetsuit: adjust your foil on the beach. Plus the free foil app: spots, wind, GPS, AI coach.',
  },
};

export const SHOP_META: Record<Locale, SeoMeta> = {
  fr: {
    title: 'Outils foil flottants en titane T30/T40/T45 | Foil Buddy',
    description:
      'Outils foil en titane grade 5 qui flottent et ne rouillent pas : clé Torx T30/T40/T45, coupe-ligne. Dès 34,95 €, livraison offerte en France.',
  },
  en: {
    title: 'Floating titanium foil tools T30/T40/T45 | Foil Buddy',
    description:
      'Grade 5 titanium foil tools that float and never rust: Torx T30/T40/T45 key, line cutter. From €34.95, 14-day returns.',
  },
};

export const PRODUCT_META: Record<Locale, Record<string, SeoMeta>> = {
  fr: {
    'tool-titanium-torx-t30-t45-green-red': {
      title: 'Clé foil flottante titane Torx T30/T40 | Foil Buddy',
      description:
        'Le tool foil qui flotte : Torx T30 pour le stab, T40 pour l’aile avant. Titane grade 5, zéro rouille, tient dans la combi. 39,95 €.',
    },
    'tool-titanium-torx-t30-t45-yellow-orange': {
      title: 'Clé foil flottante titane Torx T30/T45 | Foil Buddy',
      description:
        'Le tool foil qui flotte : Torx T30 pour le stab, T45 pour l’aile avant. Titane grade 5, zéro rouille, tient dans la combi. 39,95 €.',
    },
    'outil-flottant-coupe-ligne-clé-torx-t45': {
      title: 'Clé Torx T45 flottante + coupe-ligne foil | Foil Buddy',
      description:
        'Clé Torx T45 et coupe-ligne en un seul outil flottant : règle ton foil, coupe-ligne intégré, titane qui ne rouille pas. 34,95 €.',
    },
  },
  en: {
    'tool-titanium-torx-t30-t45-green-red': {
      title: 'Floating titanium foil tool Torx T30/T40 | Foil Buddy',
      description:
        'The foil tool that floats: Torx T30 for the stabilizer, T40 for the front wing. Grade 5 titanium, never rusts, fits in your wetsuit. €39.95.',
    },
    'tool-titanium-torx-t30-t45-yellow-orange': {
      title: 'Floating titanium foil tool Torx T30/T45 | Foil Buddy',
      description:
        'The foil tool that floats: Torx T30 for the stabilizer, T45 for the front wing. Grade 5 titanium, never rusts, fits in your wetsuit. €39.95.',
    },
    'outil-flottant-coupe-ligne-clé-torx-t45': {
      title: 'Floating Torx T45 key + line cutter for foil | Foil Buddy',
      description:
        'Torx T45 key and line cutter in one floating tool: adjust your foil, built-in line cutter, rust-proof titanium. €34.95.',
    },
  },
};

export function productMeta(locale: Locale, slug: string | null | undefined): SeoMeta | undefined {
  if (!slug) return undefined;
  return PRODUCT_META[locale]?.[slug.normalize('NFC')];
}
