export const LOCALES = ['en', 'fr'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

type Dict = {
  nav: { shop: string; app: string; cart: string };
  landing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    trustBar: string[];
    chooseTitle: string;
    app: {
      kicker: string;
      title: string;
      tagline: string;
      features: string[];
      cta: string;
      statsTitle: string;
      statsSpotsLabel: string;
      leaderboardLabel: string;
      leaderboardUnit: string;
    };
    shop: {
      kicker: string;
      title: string;
      tagline: string;
      features: string[];
      cta: string;
      material: { title: string; headers: { label: string; titanium: string; steel: string }; rows: { label: string; titanium: string; steel: string }[] };
    };
    community: {
      title: string;
      workshopCaption: string;
      workshopTag: string;
      igHandle: string;
      igCta: string;
    };
    founder: {
      kicker: string;
      quote: string;
      signature: string;
      role: string;
    };
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    secondaryCta: string;
  };
  features: {
    title: string;
    titanium: { title: string; body: string };
    floating: { title: string; body: string };
    pocket: { title: string; body: string };
    twoInOne: { title: string; body: string };
  };
  comparison: {
    title: string;
    old: { label: string; body: string };
    modern: { label: string; body: string };
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: { name: string; handle: string; quote: string }[];
  };
  shop: {
    title: string;
    subtitle: string;
    bundlePromo: string;
    viewDetails: string;
    newBadge: string;
  };
  product: {
    back: string;
    addToCart: string;
    adding: string;
    color: string;
    size: string;
    quantity: string;
    shipping: { title: string; body: string };
    freeShip: string;
    stock: string;
    features: string;
  };
  cart: {
    title: string;
    empty: string;
    seeProducts: string;
    subtotal: string;
    checkout: string;
    remove: string;
  };
  thanks: {
    title: string;
    body: string;
    backToShop: string;
  };
  footer: {
    tagline: string;
    made: string;
    legal: string;
    terms: string;
    privacy: string;
    returns: string;
    contact: string;
  };
};

const en: Dict = {
  nav: { shop: 'Shop', app: 'App', cart: 'Cart' },
  landing: {
    eyebrow: 'Made by wingfoilers, for wingfoilers',
    title: 'Everything you need to ride longer.',
    subtitle:
      'A live community for spots and conditions — and the titanium tools you bring with you on the water. One brand, two essentials.',
    trustBar: ['Titanium Grade 5', 'Handcrafted in Bayonne', 'Community-driven'],
    chooseTitle: 'Pick your entry point',
    app: {
      kicker: 'The App',
      title: 'TheFoilBuddy App',
      tagline:
        'Find the best spots, live weather, real-time rider reports and a community that rides where you ride.',
      features: [
        'Interactive spot map worldwide',
        'Live wind, waves, tide & temperature',
        'Real-time session reports from riders on the water',
        'Strava & Polar sync (Garmin soon) — automatic speed leaderboards per spot',
      ],
      cta: 'Open the App',
      statsTitle: 'Live on the app',
      statsSpotsLabel: 'spots mapped',
      leaderboardLabel: 'Top speed — Saint-Jean-de-Luz',
      leaderboardUnit: 'kn',
    },
    shop: {
      kicker: 'The Shop',
      title: 'Tools built for the ocean',
      tagline:
        'Grade 5 titanium. Unsinkable. Pocket-sized. Stop wasting time on rusty tools.',
      features: [
        'Grade 5 titanium — lifetime anti-corrosion warranty',
        'Floats back to the surface. Always.',
        'T30, T40 and T45 — fits every major foil brand',
      ],
      cta: 'Visit the shop',
      material: {
        title: 'Why Grade 5 titanium beats stainless steel',
        headers: { label: '', titanium: 'Titanium Gr5', steel: 'Steel 316L' },
        rows: [
          { label: 'Saltwater corrosion', titanium: 'None', steel: 'Pitting over time' },
          { label: 'Weight (same part)', titanium: '~ 55% lighter', steel: 'Reference' },
          { label: 'Strength-to-weight', titanium: '~ 2× higher', steel: 'Reference' },
          { label: 'Galvanic reaction w/ foil', titanium: 'Inert', steel: 'Possible' },
        ],
      },
    },
    community: {
      title: 'Made in Bayonne, shared with the community',
      workshopCaption: 'Prototyping tools, one layer at a time.',
      workshopTag: 'Workshop',
      igHandle: '@thefoilbuddy',
      igCta: 'Follow on Instagram',
    },
    founder: {
      kicker: 'The founder',
      quote:
        'TheFoilBuddy started from a simple realisation: too much time lost on a loose front wing or a badly tuned foil, too many apps open just to decide whether to hit the water. I built these tools for myself first, as a rider. Then I shared them.',
      signature: 'Nathan DEPIS',
      role: 'Rider & founder — Bayonne',
    },
  },
  hero: {
    eyebrow: 'Made for wingfoilers, by wingfoilers',
    title: 'The only tool you can take with you on the water.',
    subtitle:
      'Titanium grade 5. Unsinkable. Pocket-sized. Stop losing time and tools — adjust your foil in seconds, without leaving the spot.',
    cta: 'Shop now',
    secondaryCta: 'How it works',
  },
  features: {
    title: 'Built to outlast the ocean',
    titanium: {
      title: 'Grade 5 Titanium',
      body: 'Total resistance to salt water. It will never rust.',
    },
    floating: {
      title: 'Unsinkable',
      body: 'High-visibility colors and buoyant design. It stays on the surface.',
    },
    pocket: {
      title: 'Pocket Size',
      body: 'Smooth rounded edges. Fits in your wetsuit or impact vest without any discomfort.',
    },
    twoInOne: {
      title: 'Two-in-One',
      body: 'T30 for your stabilizer and T40 (or T45) for your front wing.',
    },
  },
  comparison: {
    title: 'Why settle for rust?',
    old: {
      label: 'The old way',
      body: 'Rusty multi-tools from the toolbox, missing bits, and that one time you dropped the T40 into 3m of water.',
    },
    modern: {
      label: 'The Foil Buddy way',
      body: 'One pocket-sized tool. Titanium. Floats. Two sizes. Done.',
    },
  },
  testimonials: {
    title: 'They talk about us',
    subtitle: 'Riders sharing their Foil Buddy, in the water.',
    items: [
      {
        name: 'Julien',
        handle: '@julienfoils',
        quote: 'I used to carry four tools. Now one, in my spring suit chest pocket. Game changer.',
      },
      {
        name: 'Marine',
        handle: '@marine.wing',
        quote: 'Dropped it twice in the break — it just floats back up. Worth every cent.',
      },
      {
        name: 'Axel',
        handle: '@axel_riders',
        quote: 'The titanium finish is next-level. Zero rust after a full winter of Atlantic sessions.',
      },
    ],
  },
  shop: {
    title: 'Shop',
    subtitle: 'Three tools. One mission: more time riding, less time fixing.',
    bundlePromo: 'Buy 2, save 10%',
    viewDetails: 'View details',
    newBadge: 'New',
  },
  product: {
    back: '← Back to shop',
    addToCart: 'Add to cart',
    adding: 'Adding…',
    color: 'Color',
    size: 'Size',
    quantity: 'Quantity',
    shipping: {
      title: 'Shipping & returns',
      body: 'Free shipping in France. Delivery within 3–5 business days. 14-day return policy.',
    },
    freeShip: 'Free shipping in France',
    stock: 'In stock — ships in 48h',
    features: 'Key features',
  },
  cart: {
    title: 'Your cart',
    empty: 'Your cart is empty.',
    seeProducts: 'Browse products',
    subtotal: 'Subtotal',
    checkout: 'Checkout',
    remove: 'Remove',
  },
  thanks: {
    title: 'Thanks for your order!',
    body: 'You\'ll receive a confirmation email in a few minutes. Your order is being prepared and will ship within 48h.',
    backToShop: 'Back to shop',
  },
  footer: {
    tagline: 'Made by wingfoilers, for wingfoilers.',
    made: 'Handcrafted in France.',
    legal: 'Legal notice',
    terms: 'Terms & conditions',
    privacy: 'Privacy policy',
    returns: 'Shipping & returns',
    contact: 'Contact',
  },
};

const fr: Dict = {
  nav: { shop: 'Boutique', app: 'App', cart: 'Panier' },
  landing: {
    eyebrow: 'Conçu par des wingfoilers, pour les wingfoilers',
    title: 'Tout ce qu\'il te faut pour rider plus longtemps.',
    subtitle:
      'Une communauté live pour les spots et les conditions — et les outils en titane que tu emmènes sur l\'eau. Une marque, deux essentiels.',
    trustBar: ['Titane Grade 5', 'Conçu à Bayonne', 'Porté par la communauté'],
    chooseTitle: 'Choisis ton point d\'entrée',
    app: {
      kicker: 'L\'App',
      title: 'L\'App TheFoilBuddy',
      tagline:
        'Les meilleurs spots, la météo live, les rapports des riders en temps réel et une communauté qui ride où tu rides.',
      features: [
        'Carte interactive des spots dans le monde',
        'Vent, vagues, marée et température en direct',
        'Rapports de session en temps réel depuis l\'eau',
        'Sync Strava & Polar (Garmin bientôt) — classement vitesse automatique par spot',
      ],
      cta: 'Ouvrir l\'App',
      statsTitle: 'En direct sur l\'app',
      statsSpotsLabel: 'spots référencés',
      leaderboardLabel: 'Top speed — Saint-Jean-de-Luz',
      leaderboardUnit: 'kn',
    },
    shop: {
      kicker: 'La Boutique',
      title: 'Des outils taillés pour l\'océan',
      tagline:
        'Titane grade 5. Insubmersible. Format poche. Arrête de perdre du temps avec des outils rouillés.',
      features: [
        'Titane grade 5 — garantie à vie anti-corrosion',
        'Flotte. Toujours. Même si tu le lâches.',
        'T30, T40 et T45 — compatible toutes marques de foil',
      ],
      cta: 'Voir la boutique',
      material: {
        title: 'Pourquoi le titane Grade 5 surpasse l\'inox',
        headers: { label: '', titanium: 'Titane Gr5', steel: 'Inox 316L' },
        rows: [
          { label: 'Corrosion eau salée', titanium: 'Aucune', steel: 'Piqûres avec le temps' },
          { label: 'Poids (pièce équivalente)', titanium: '~ 55 % plus léger', steel: 'Référence' },
          { label: 'Rapport résistance/poids', titanium: '~ 2× supérieur', steel: 'Référence' },
          { label: 'Réaction galvanique sur foil', titanium: 'Inerte', steel: 'Possible' },
        ],
      },
    },
    community: {
      title: 'Conçu à Bayonne, partagé avec la communauté',
      workshopCaption: 'Prototypage des outils, couche par couche.',
      workshopTag: 'Atelier',
      igHandle: '@thefoilbuddy',
      igCta: 'Suivre sur Instagram',
    },
    founder: {
      kicker: 'Le fondateur',
      quote:
        'TheFoilBuddy est né d\'un constat simple : trop de temps perdu avec une aile mal serrée ou un foil mal réglé, trop d\'applis ouvertes pour décider d\'aller à l\'eau. J\'ai d\'abord pensé ces outils pour moi, en tant que rider. Avant d\'en faire profiter les autres.',
      signature: 'Nathan DEPIS',
      role: 'Rider & fondateur — Bayonne',
    },
  },
  hero: {
    eyebrow: 'Conçu par des wingfoilers, pour les wingfoilers',
    title: 'Le seul outil que tu peux amener avec toi sur l\'eau.',
    subtitle:
      'Titane grade 5. Insubmersible. Format poche. Arrête de perdre du temps et tes outils — règle ton foil en quelques secondes, sans quitter le spot.',
    cta: 'Je découvre',
    secondaryCta: 'Comment ça marche',
  },
  features: {
    title: 'Taillé pour résister à l\'océan',
    titanium: {
      title: 'Titane grade 5',
      body: 'Résistance totale à l\'eau salée. Il ne rouillera jamais.',
    },
    floating: {
      title: 'Insubmersible',
      body: 'Couleurs haute visibilité et flottabilité parfaite. Il reste en surface.',
    },
    pocket: {
      title: 'Format poche',
      body: 'Bords arrondis. Se glisse dans ta combi ou ton impact vest sans gêne.',
    },
    twoInOne: {
      title: 'Deux-en-un',
      body: 'T30 pour ton stab et T40 (ou T45) pour ton aile avant.',
    },
  },
  comparison: {
    title: 'Pourquoi subir la rouille ?',
    old: {
      label: 'L\'ancienne méthode',
      body: 'Un multi-outils rouillé, des embouts manquants, et cette fois où le T40 a coulé par 3m de fond.',
    },
    modern: {
      label: 'La méthode Foil Buddy',
      body: 'Un seul outil format poche. Titane. Flotte. Deux tailles. Point.',
    },
  },
  testimonials: {
    title: 'Ils parlent de nous',
    subtitle: 'Des riders qui filent avec leur Foil Buddy, à l\'eau.',
    items: [
      {
        name: 'Julien',
        handle: '@julienfoils',
        quote: 'Je trimballais quatre outils. Maintenant un seul, dans la poche poitrine de ma shorty. Ça change tout.',
      },
      {
        name: 'Marine',
        handle: '@marine.wing',
        quote: 'Lâché deux fois dans le shore break — il remonte tout seul. Vaut chaque centime.',
      },
      {
        name: 'Axel',
        handle: '@axel_riders',
        quote: 'La finition titane est dingue. Zéro rouille après un hiver entier de sessions Atlantique.',
      },
    ],
  },
  shop: {
    title: 'Boutique',
    subtitle: 'Trois outils. Une mission : plus de temps à rider, moins à bricoler.',
    bundlePromo: '2 achetés, 10% offerts',
    viewDetails: 'Voir le produit',
    newBadge: 'Nouveau',
  },
  product: {
    back: '← Retour à la boutique',
    addToCart: 'Ajouter au panier',
    adding: 'Ajout…',
    color: 'Couleur',
    size: 'Taille',
    quantity: 'Quantité',
    shipping: {
      title: 'Livraison & retours',
      body: 'Livraison gratuite en France. Expédition sous 3–5 jours ouvrés. Retours sous 14 jours.',
    },
    freeShip: 'Livraison gratuite en France',
    stock: 'En stock — expédié sous 48h',
    features: 'Caractéristiques',
  },
  cart: {
    title: 'Mon panier',
    empty: 'Votre panier est vide.',
    seeProducts: 'Voir les produits',
    subtotal: 'Sous-total',
    checkout: 'Commander',
    remove: 'Retirer',
  },
  thanks: {
    title: 'Merci pour ta commande !',
    body: 'Tu vas recevoir un email de confirmation dans quelques minutes. Ta commande est prise en charge et sera expédiée sous 48h.',
    backToShop: 'Retour à la boutique',
  },
  footer: {
    tagline: 'Créé par des wingfoilers, pour les wingfoilers.',
    made: 'Conçu en France.',
    legal: 'Mentions légales',
    terms: 'CGV',
    privacy: 'Confidentialité',
    returns: 'Livraison & retours',
    contact: 'Contact',
  },
};

const DICTS: Record<Locale, Dict> = { en, fr };

export function t(locale: Locale): Dict {
  return DICTS[locale] ?? DICTS[DEFAULT_LOCALE];
}

/** Build a localized href. For the default locale, we omit the prefix. */
export function localeHref(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return `/${locale}${clean}`;
}

/**
 * Manual translation overrides for Wix product names.
 * The Wix headless SDK doesn't transparently return Wix Multilingual content
 * (it needs the site's built-in multilingual layer which isn't exposed via
 * the OAuth visitor client). For 3 products this map is more reliable than
 * guessing headers — keep in sync with the prod site.
 */
const PRODUCT_NAME_OVERRIDES: Record<Locale, Record<string, string>> = {
  en: {},
  fr: {
    'outil-flottant-coupe-ligne-clé-torx-t45': 'Clé Torx Flottante + Coupe-ligne',
    // Fallback with URL-encoded variant some browsers produce
    'outil-flottant-coupe-ligne-cl%C3%A9-torx-t45':
      'Clé Torx Flottante + Coupe-ligne',
    // The 2 Foil Buddy SKUs keep their branded names on the prod FR site.
  },
};

export function translateProductName(
  locale: Locale,
  slug: string | undefined,
  original: string | undefined,
): string | undefined {
  if (!slug) return original;
  return PRODUCT_NAME_OVERRIDES[locale]?.[slug] ?? original;
}

/**
 * Manual HTML description overrides, same reason as PRODUCT_NAME_OVERRIDES:
 * Wix OAuth visitor clients don't return Multilingual translations.
 * Keep the HTML structure matching what Wix ships so the prose class styles
 * (prose-invert, bullets, spacing) continue to work.
 */
const PRODUCT_DESCRIPTION_OVERRIDES: Record<Locale, Record<string, string>> = {
  en: {},
  fr: {
    'tool-titanium-torx-t30-t45-yellow-orange':
      '<p>Le seul outil qu\'il te faut sur l\'eau.</p>' +
      '<p>Arrête de perdre du temps et tes outils. Le Foil Buddy est l\'accessoire 2-en-1 ultime, pensé pour des ajustements rapides sans quitter le spot.</p>' +
      '<ul>' +
      '<li><p>Titane Grade 5 : résistance totale à l\'eau salée. Il ne rouillera jamais.</p></li>' +
      '<li><p>Insubmersible : couleurs haute visibilité et conception flottante. Il reste en surface.</p></li>' +
      '<li><p>Format poche : bords arrondis et lisses. Conçu pour se glisser dans ta combi ou ton impact vest sans gêner.</p></li>' +
      '<li><p>Deux-en-un : T30 pour ton stab, T40 (ou T45) pour ton aile avant.</p></li>' +
      '</ul>' +
      '<p>&nbsp;</p>' +
      '<p>GUIDE DE COMPATIBILITÉ</p>' +
      '<p>&nbsp;</p>' +
      '<p>T30 / T40&nbsp;&nbsp; F-One, Armstrong, Sabfoil, Takuma, etc.<br>T30 / T45&nbsp;&nbsp; Duotone, AFS, Sroka, Indiana.</p>',
    'tool-titanium-torx-t30-t45-green-red':
      '<p>Le seul outil qu\'il te faut sur l\'eau.</p>' +
      '<p>Arrête de perdre du temps et tes outils. Le Foil Buddy est l\'accessoire 2-en-1 ultime, pensé pour des ajustements rapides sans quitter le spot.</p>' +
      '<ul>' +
      '<li><p>Titane Grade 5 : résistance totale à l\'eau salée. Il ne rouillera jamais.</p></li>' +
      '<li><p>Insubmersible : couleurs haute visibilité et conception flottante. Il reste en surface.</p></li>' +
      '<li><p>Format poche : bords arrondis et lisses. Conçu pour se glisser dans ta combi ou ton impact vest sans gêner.</p></li>' +
      '<li><p>Deux-en-un : T30 pour ton stab, T40 (ou T45) pour ton aile avant.</p></li>' +
      '</ul>' +
      '<p>&nbsp;</p>' +
      '<p>GUIDE DE COMPATIBILITÉ</p>' +
      '<p>&nbsp;</p>' +
      '<p>T30 / T40&nbsp;&nbsp; F-One, Armstrong, Sabfoil, Takuma, etc.<br>T30 / T45&nbsp;&nbsp; Duotone, AFS, Sroka, Indiana.</p>',
    'outil-flottant-coupe-ligne-clé-torx-t45':
      '<p>TheFoilBuddy – Clé Torx Flottante + Coupe-ligne</p>' +
      '<p>Un seul outil. Tout ce qu\'il te faut.</p>' +
      '<p>La Clé + Coupe-ligne Foil Buddy combine un embout Torx haute qualité et une lame de sécurité dans un format ultra-compact qui flotte, pensé pour l\'eau. C\'est l\'outil qui va dans ta poche quand tu rides — pas celui qui reste dans la voiture.</p>' +
      '<p>À quoi ça sert ?</p>' +
      '<ul>' +
      '<li><p>Serrer &amp; ajuster : sécurise ton foil, ton mât ou ton fuselage avant ou pendant ta session.</p></li>' +
      '<li><p>Coupe d\'urgence : tranche net un filet, un bout de pêche ou une ligne si tu restes accroché.</p></li>' +
      '<li><p>Tranquillité : un outil simple, essentiel, facile à emmener et qui ne coule jamais.</p></li>' +
      '</ul>' +
      '<p>Soyons clairs…</p>' +
      '<ul>' +
      '<li><p>Est-ce qu\'il a autant de couple qu\'une grande clé d\'atelier ? Non.</p></li>' +
      '<li><p>Est-ce qu\'il coupe les grosses cordes mieux qu\'un couteau de plongée pro ? Non.</p></li>' +
      '</ul>' +
      '<p>Mais voilà pourquoi il gagne :</p>' +
      '<ul>' +
      '<li><p>Il serre exactement ce qu\'il faut pour continuer à rider.</p></li>' +
      '<li><p>Il coupe exactement au moment où tu en as besoin.</p></li>' +
      '<li><p>Il flotte (et ça change tout).</p></li>' +
      '<li><p>Il est prêt à l\'usage en quelques secondes.</p></li>' +
      '<li><p>Il est léger, compact, toujours avec toi sur l\'eau.</p></li>' +
      '</ul>' +
      '<p>En wing, SUP ou surf foil, c\'est exactement ce qu\'il nous faut.</p>',
  },
};

export function translateProductDescription(
  locale: Locale,
  slug: string | undefined,
  original: string | undefined,
): string | undefined {
  if (!slug) return original;
  const normalized = slug.normalize('NFC');
  return PRODUCT_DESCRIPTION_OVERRIDES[locale]?.[normalized] ?? original;
}

/** Slugs flagged as "new" — surface a badge on the card and product page. */
const NEW_PRODUCT_SLUGS = new Set<string>([
  'outil-flottant-coupe-ligne-clé-torx-t45',
]);

export function isNewProduct(slug: string | undefined): boolean {
  if (!slug) return false;
  return NEW_PRODUCT_SLUGS.has(slug.normalize('NFC'));
}
