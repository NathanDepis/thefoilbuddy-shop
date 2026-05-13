/**
 * Customer reviews data (seeded).
 *
 * Each review listed here is PUBLISHED. To moderate:
 *   - Add a review: append a new object to the relevant product slug.
 *   - Hide a review: delete it from the array (or comment it out).
 *   - Edit/correct a review: update the fields inline.
 *
 * IDs must be unique per product. Dates are ISO YYYY-MM-DD.
 *
 * Reviews are kept in their ORIGINAL language (we don't auto-translate
 * customer content). The surrounding UI (labels, dates) is localized.
 *
 * NOTE: Until we hook up Supabase for user-submitted reviews + moderation
 * dashboard, this file is the single source of truth.
 */

export type Review = {
  id: string;
  name: string;
  location?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string; // ISO YYYY-MM-DD
  verified: boolean;
  title?: string;
  body: string;
};

export const REVIEWS: Record<string, Review[]> = {
  // ===== Foil Buddy — T30/T45 (jaune-orange) — 3 avis =====
  'tool-titanium-torx-t30-t45-yellow-orange': [
    {
      id: 'r1',
      name: 'Hugo T.',
      location: 'Plougonvelin',
      rating: 5,
      date: '2026-05-10',
      verified: true,
      title: 'T45 parfait pour AFS',
      body: 'Couleurs jaune/orange flashy, on le retrouve direct s\'il tombe. T45 nickel pour AFS fuselink.',
    },
    {
      id: 'r2',
      name: 'Pierre G.',
      location: 'Carro',
      rating: 4,
      date: '2026-04-19',
      verified: true,
      body: 'Bon outil nickel c\'est ingénieux.',
    },
    {
      id: 'r3',
      name: 'Tom W.',
      location: 'Goring',
      rating: 5,
      date: '2026-04-08',
      verified: true,
      body: 'Nice floating tool, I love it.',
    },
  ],

  // ===== Foil Buddy — T30/T40 Standard (vert-rouge) — 4 avis =====
  'tool-titanium-torx-t30-t45-green-red': [
    {
      id: 'r1',
      name: 'Thomas L.',
      location: 'Penmarc\'h',
      rating: 5,
      date: '2026-05-08',
      verified: true,
      title: 'Indispensable sur l\'eau',
      body: 'Plus jamais sans. Je l\'ai dans la poche de mon impact vest à chaque session. Hier j\'ai resserré mon aile avant entre deux bords sans rentrer au sable, c\'est exactement ce que je cherchais. Le titane fait son taf, aucune trace de rouille après 3 mois.',
    },
    {
      id: 'r2',
      name: 'Julien P.',
      location: 'Châtelaillon-Plage',
      rating: 5,
      date: '2026-04-22',
      verified: true,
      title: 'Top outil',
      body: 'Bien pensé les couleurs flashy pour pas le perdre, ça flotte, ça rouille pas.',
    },
    {
      id: 'r3',
      name: 'Sébastien R.',
      location: 'Quiberon',
      rating: 4,
      date: '2026-04-15',
      verified: true,
      body: 'Très bon outil, je mets 4 étoiles juste pour le prix un peu cher mais bon c\'est du titane et la livraison est inclue dans le prix donc ça va.',
    },
    {
      id: 'r4',
      name: 'Camille B.',
      location: 'Lacanau',
      rating: 5,
      date: '2026-04-03',
      verified: true,
      body: 'Merci pour ce petit outil bien pratique !',
    },
  ],

  // ===== Coupe-ligne + Clé Torx flottante — 2 avis =====
  'outil-flottant-coupe-ligne-clé-torx-t45': [
    {
      id: 'r1',
      name: 'Vincent A.',
      location: 'Trégastel',
      rating: 5,
      date: '2026-05-11',
      verified: true,
      body: 'Il y a souvent des filets non indiqués là où je navigue, je suis plus tranquille avec. Impossible de se couper avec la lame c\'est bien pensé.',
    },
    {
      id: 'r2',
      name: 'Olivier D.',
      location: 'Le Crouesty',
      rating: 4,
      date: '2026-04-25',
      verified: true,
      body: 'Je navigue qu\'en Gong j\'avais pas besoin de deux clés torx, la T30 suffit. Le coupe-ligne intégré c\'est une bonne idée.',
    },
  ],
};

/** Aggregate stats helper — used by the UI to render the header summary. */
export function getReviewStats(slug: string | null | undefined): {
  count: number;
  average: number; // 0 if no reviews
  histogram: Record<1 | 2 | 3 | 4 | 5, number>;
} {
  const list = (slug && REVIEWS[slug.normalize('NFC')]) || [];
  const histogram: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  for (const r of list) {
    histogram[r.rating]++;
    sum += r.rating;
  }
  return {
    count: list.length,
    average: list.length === 0 ? 0 : sum / list.length,
    histogram,
  };
}

export function getReviews(slug: string | null | undefined): Review[] {
  if (!slug) return [];
  return REVIEWS[slug.normalize('NFC')] ?? [];
}
