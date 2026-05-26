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
  // ===== Foil Buddy — T30/T45 (jaune-orange) =====
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
    {
      id: 'r4',
      name: 'Nicolas',
      location: 'Brest',
      rating: 5,
      date: '2026-05-20',
      verified: true,
      title: 'Efficace',
      body: 'Pas cher pour du titane, petit et très pratique',
    },
    {
      id: 'r5',
      name: 'Elisa',
      location: 'La Rochelle',
      rating: 5,
      date: '2026-05-20',
      verified: true,
      title: 'Super qualité',
      body: 'J\'ai acheté un accessoire pour planche à voile pour l\'offrir à mon père et il ne jure que par ça, sur l\'eau c\'est le top pour réparer. De plus le service client a été super réactif après un petit problème d\'adresse donc merci beaucoup !',
    },
    {
      id: 'r6',
      name: 'Patrick',
      rating: 3,
      date: '2026-05-20',
      verified: true,
      title: 'Adapté pour changer la position du mat et du stab',
      body: 'Très bien le Titane, solide et ne rouille pas. Par contre, il est difficile d\'appliquer un couple suffisant sur les M8 qui tiennent le fuselage. Cela doit couter cher, mais j\'aimerai bien une clef du style de celle de Duotone en Titane.',
    },
    {
      id: 'r7',
      name: 'Gilles',
      location: 'Île-de-France',
      rating: 5,
      date: '2026-05-20',
      verified: true,
      title: 'Je ne sors jamais sans',
      body: 'Ça me permet de régler différentes position de mon mat en fonction des conditions.',
    },
    {
      id: 'r8',
      name: 'Pierre',
      location: 'Saint-Nazaire',
      rating: 5,
      date: '2026-05-20',
      verified: true,
      title: 'Usefull',
      body: 'Top tool light and compact.',
    },
    {
      id: 'r9',
      name: 'Jean-Marie',
      location: 'Sablé-sur-Sarthe',
      rating: 5,
      date: '2026-05-20',
      verified: true,
      body: '',
    },
    {
      id: 'r10',
      name: 'Stéphane',
      location: 'Plomodiern',
      rating: 5,
      date: '2026-05-20',
      verified: true,
      title: 'Bien pratique pour régler son foil',
      body: 'En cas de changement de foil, de stab, etc. Permet un réglage en nav sans revenir au bord.',
    },
    {
      id: 'r11',
      name: 'Thomas',
      location: 'Saint-Jean-de-Luz',
      rating: 5,
      date: '2026-05-20',
      verified: true,
      body: '',
    },
    {
      id: 'r12',
      name: 'Michel',
      location: 'Lyon',
      rating: 5,
      date: '2026-05-20',
      verified: true,
      title: 'Très pratique sur l\'eau',
      body: 'Vraiment très pratique, ça ne rouille pas, on peut l\'avoir toujours sur soi, pour pouvoir resserrer une vis ou changer un réglage, sans avoir à retourner à la voiture.',
    },
    {
      id: 'r13',
      name: 'Félix',
      rating: 5,
      date: '2026-05-20',
      verified: true,
      title: 'Top',
      body: 'Ultra utile pour avoir toujours les outils à portée de main !',
    },
    {
      id: 'r14',
      name: 'French',
      location: 'Port-Louis',
      rating: 3,
      date: '2026-05-21',
      verified: true,
      title: 'Bien mais pas assez abouti',
      body: 'En fait pour ma part les deux parties ne restent pas accrochées entre elles du coup on peut perdre celle qui n\'a pas de cordon.',
    },
    {
      id: 'r15',
      name: 'Julien',
      location: 'Nogent-sur-Marne',
      rating: 5,
      date: '2026-05-21',
      verified: true,
      body: 'Hyper utile pour resserrer le foil sur l\'eau.',
    },
    {
      id: 'r16',
      name: 'Pascal',
      location: 'Lansargues',
      rating: 5,
      date: '2026-05-23',
      verified: true,
      body: 'Super outil, je le prends à l\'eau à chaque sortie, très pratique pour régler le mât sans avoir à revenir au bord. Aucune trace de rouille ou d\'usure après plusieurs mois d\'utilisation. Ça a déjà dépanné des copains sur l\'eau 😉 Je recommande.',
    },
    {
      id: 'r17',
      name: 'Alexis',
      rating: 5,
      date: '2026-05-26',
      verified: true,
      title: 'Très pratique',
      body: 'Outil indispensable pour les réglages sur l\'eau : visible, léger, flottant…',
    },
  ],

  // ===== Foil Buddy — T30/T40 Standard (vert-rouge) =====
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
    {
      id: 'r5',
      name: 'Frédéric',
      location: 'La Rochelle',
      rating: 3,
      date: '2026-05-20',
      verified: true,
      title: 'Très pratique pour serrer les vis qui se desserrent en navigation',
      body: 'Mais ne peut desserrer certaines vis car bras de levier un peu court, donc on peut pas toujours changer le réglage du pied de mat.',
    },
    {
      id: 'r6',
      name: 'Michael',
      location: 'Ingolstadt',
      rating: 5,
      date: '2026-05-21',
      verified: true,
      title: 'Optimize everywhere',
      body: 'When I\'m out on new foil, sometimes I have to change the position in the water. My old tool always felt a bit dangerous in my wetsuit. FoilBuddy feels secure and I am not afraid to lose it in the water.',
    },
  ],

  // ===== Coupe-ligne + Clé Torx flottante =====
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
